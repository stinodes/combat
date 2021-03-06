import { replaceStats } from '../../character/stats'
import { AuroraCharacter, Element, SpellSlotName } from '../../types/aurora'
import {
  AbilityScore,
  AbilityScoreIDSubString,
  AbilityScores,
  Action,
  ActionTime,
  Character,
  Class,
  Magic,
  Spell,
  SpellCasting,
  Stats,
} from '../../types/character'
import { ID, Resource } from '../../types/dnd'
import { resources } from '../resources'

const parseLevels = (
  character: null | AuroraCharacter,
): Element<{ class?: string; rndhp?: string }>[] => {
  if (!character) return []

  const levels = character.build[0].elements[0].element.filter(
    el => el.$.type === 'Level',
  ) as Element<{ class?: string; rndhp?: string }>[]

  return levels
}

const parseClasses = (character: null | AuroraCharacter) => {
  const levels = parseLevels(character)
  const sum = resources.resourcesForIds(
    character?.build[0].sum[0].element.map(e => e.$.id) || [],
  )

  const classes = resources.resourcesForIds(
    (
      character?.build[0].sum[0].element.filter(e =>
        ['Class', 'Multiclass'].includes(e.$.type),
      ) as Element<{ registered: string }>[]
    )?.map(e => e.$.id.replace('MULTICLASS', 'CLASS')) || [],
  )

  const spellcasting = sum.filter(e => e && e.spellcasting)

  let lastClass: null | string = null
  return classes
    .map(c => {
      if (!c) return null
      const name = c.$.name
      const id = c.$.id
      const classLevels = levels.filter(level => {
        const classNameForLevel =
          level.$.class ||
          (
            level.element?.find(el => el.$.type === 'Class') as
              | undefined
              | Element<{
                  registered: string
                }>
          )?.$.registered

        const className =
          classNameForLevel && classNameForLevel.replace('MULTICLASS', 'CLASS')
        if (!className) return lastClass === id
        lastClass = className
        return className === id
      })

      const classSC = spellcasting.find(
        s => s && s.spellcasting[0].$.name === name,
      )
      const soloSC =
        !!classSC &&
        classSC.rules &&
        classSC.rules[0].grant?.some(
          g =>
            g.$.id === 'ID_INTERNAL_GRANT_MULTICLASS_SPELLCASTING_SLOTS_SOLO',
        )

      return {
        class: name,
        id,
        level: classLevels.length,
        rndhp: classLevels
          .find(level => level.$.rndhp)
          ?.$.rndhp?.split(',')
          .map(Number),
        spellcasting: !!classSC,
        soloSpellslots: !!soloSC,
      } as Class
    })
    .filter(Boolean) as Class[]
}

const parseBaseAbilityScores = (character: null | AuroraCharacter) => {
  if (!character)
    return {
      [AbilityScore.strength]: 10,
      [AbilityScore.dexterity]: 10,
      [AbilityScore.constitution]: 10,
      [AbilityScore.intelligence]: 10,
      [AbilityScore.wisdom]: 10,
      [AbilityScore.charisma]: 10,
    }

  const rawScores = character.build[0].abilities[0]
  return Object.keys(character.build[0].abilities[0])
    .filter(k => k !== '$')
    .reduce((prev, key) => {
      const newKey = Object.keys(AbilityScoreIDSubString).find(
        k => AbilityScoreIDSubString[k as AbilityScore].toLowerCase() === key,
      ) as AbilityScore

      prev[newKey] = parseInt(rawScores[key as keyof typeof rawScores][0])
      return prev
    }, {} as AbilityScores)
}

const parseEquipment = (
  character: null | AuroraCharacter,
): { [slot: string]: Resource } => {
  const equipment = character
    ? character.build[0].equipment[0].item.filter(
        item => item.equipped && item.equipped[0]._ === 'true',
      )
    : []

  const equipmentIds = equipment.map(el => el.$.id)
  const items = resources.resourcesForIds(equipmentIds)

  return equipment.reduce((prev, item) => {
    const resource = items.find(i => i && i.$.id === item.$.id)
    if (!item || !item.equipped) return prev
    return {
      ...prev,
      [item.equipped[0].$.location.toLowerCase()]: resource,
    } as { [slot: string]: Resource }
  }, {} as { [slot: string]: Resource })
}

const parseStats = (character: null | AuroraCharacter): Stats => {
  const classes = parseClasses(character)
  const baseAbilityScores = parseBaseAbilityScores(character)
  const sum = resources.resourcesForIds(
    character?.build[0].sum[0].element.map(e => e.$.id) || [],
  )

  const rndhpPerLevel = classes.reduce((prev, c) => {
    return prev.concat(c.rndhp.slice(0, c.level))
  }, [] as number[])

  const baseStats: Stats = {
    hp: rndhpPerLevel.map(hp => ({ $: { name: 'hp', value: String(hp) } })),
    strength: [
      {
        $: { name: 'strength', value: String(baseAbilityScores.strength) },
      },
    ],
    dexterity: [
      {
        $: { name: 'dexterity', value: String(baseAbilityScores.dexterity) },
      },
    ],
    constitution: [
      {
        $: {
          name: 'constitution',
          value: String(baseAbilityScores.constitution),
        },
      },
    ],
    intelligence: [
      {
        $: {
          name: 'intelligence',
          value: String(baseAbilityScores.intelligence),
        },
      },
    ],
    wisdom: [
      {
        $: { name: 'wisdom', value: String(baseAbilityScores.wisdom) },
      },
    ],
    charisma: [
      {
        $: { name: 'charisma', value: String(baseAbilityScores.charisma) },
      },
    ],
  }

  const stats = sum.reduce(
    (prev, element) => {
      if (!element || !element.rules || !element.rules[0].stat) return prev

      element.rules[0].stat.forEach(stat => {
        const name = stat.$.name.toLowerCase()
        if (!prev[name]) prev[name] = []
        prev[name] = [...prev[name], stat]
      })

      return prev
    },
    { ...baseStats } as Stats,
  )

  return stats
}

const findSetter = (resource: Resource, setter: string): null | string =>
  (resource.setters &&
    resource.setters[0].set.find(s => s.$.name === setter)?._) ||
  null

const parseSpell = (spell: Resource, prepared: boolean): Spell => {
  const durationSetter = findSetter(spell, 'duration')?.match(/(\d+ \w+)/)
  return {
    id: spell.$.id,
    name: spell.$.name,
    action: findSetter(spell, 'time') as ActionTime,
    slotLevel: Number(findSetter(spell, 'level')),
    range: findSetter(spell, 'range'),
    prepared,
    duration: durationSetter ? durationSetter[1] : 'Instantaneous',
    isSomatic: findSetter(spell, 'hasSomaticComponent') === 'true',
    isVerbal: findSetter(spell, 'hasVerbalComponent') === 'true',
    isMaterial: findSetter(spell, 'hasMaterialComponent') === 'true',
    isConcentration: findSetter(spell, 'isConcentration') === 'true',
    isRitual: findSetter(spell, 'isRitual') === 'true',
    description: spell.description,
  }
}

const parseMagic = (character: null | AuroraCharacter): Magic => {
  const classes = parseClasses(character)

  const magic: Magic = { multiclass: false, spellcasting: [] }
  if (!character) return magic

  const rawMagic = character.build[0].magic[0]

  if (!rawMagic || !rawMagic.spellcasting) return magic

  if (rawMagic.$?.multiclass === 'true') {
    magic.multiclass = true
  }

  classes.forEach(c => {
    if (!c.spellcasting) return

    const classMagic = rawMagic.spellcasting.find(sl => sl.$.name === c.class)

    if (!classMagic) return

    const slots = Object.keys(classMagic.slots[0].$).reduce((prev, key) => {
      const typedKey = key as SpellSlotName
      prev[typedKey] = Number(classMagic.slots[0].$[typedKey])
      return prev
    }, {} as { [name in SpellSlotName]: number })

    const prepare =
      (
        resources.resourceForId(classMagic.$.source)
          ?.spellcasting[0] as Resource<{ prepare: string }>
      ).$.prepare === 'true'

    const spellcasting: SpellCasting = {
      multiclass: magic.multiclass && !c.soloSpellslots,
      class: classMagic.$.name,
      ability: classMagic.$.ability.toLowerCase() as AbilityScore,
      dc: Number(classMagic.$.dc),
      attack: Number(classMagic.$.attack),
      prepare,
      slots,
      spells: classMagic.spells[0].spell.map(spell =>
        parseSpell(
          resources.resourceForId(spell.$.id),
          prepare ? spell.$.prepared === 'true' : true,
        ),
      ),
    }

    magic.spellcasting.push(spellcasting)
  })

  return magic
}

const parseActions = (character: AuroraCharacter) => {
  const minimalCharacter = {
    level: parseLevels(character).length,
    classes: parseClasses(character),
    equipment: parseEquipment(character),
    stats: parseStats(character),
  }

  const actions = resources
    .resourcesForIds(character.build[0].sum[0].element.map(e => e?.$.id))
    .filter(e => {
      if (!e || !e.sheet) return false
      return e.sheet[0]?.$?.action || e.sheet[0]?.$?.usage
    })
    .map(rawaction => {
      const [usage, reset] = replaceStats(
        minimalCharacter,
        rawaction.sheet[0].$.usage,
      ).split('/') || [null, null]
      const tooltip =
        rawaction.sheet[0].description && rawaction.sheet[0].description[0]
      const action: Action = {
        name: rawaction.$.name,
        id: rawaction.$.id,
        action: rawaction.sheet[0].$.action as ActionTime,
        usage: usage && Number(usage),
        reset: reset as Action['reset'],
        tooltip: !tooltip
          ? ''
          : typeof tooltip === 'string'
          ? tooltip
          : tooltip._,
        description: rawaction.description[0],
      }
      return action
    })
    .reduce((prev, action) => {
      prev[action.id] = action
      return prev
    }, {} as { [id: ID]: Action })
  return actions
}

export const parseCharacter = (
  character: null | AuroraCharacter,
): Character => {
  const levels = parseLevels(character)
  const classes = parseClasses(character)
  const equipment = parseEquipment(character)
  const stats = parseStats(character)
  const magic = parseMagic(character)
  const actions = parseActions(character)

  // const classFeatures = resources.resourcesForIds(
  //   character?.build[0].sum[0].element
  //     .filter(e => e.$.type === 'Class Feature')
  //     .map(e => e.$.id) || [],
  // )
  // const feats = resources.resourcesForIds(
  //   character?.build[0].sum[0].element
  //     .filter(e => e.$.type === 'Feat')
  //     .map(e => e.$.id) || [],
  // )

  // console.log(character)
  // console.log('Stats: ', stats)
  // console.log('Magic: ', magic)
  // console.log('Classes: ', classes)
  // console.log('Equipment: ', equipment)
  // console.log('Class features: ', classFeatures)
  // console.log('Feats: ', feats)

  return {
    level: levels.length,
    classes,
    equipment,
    magic,
    stats,
    actions,
  }
}
