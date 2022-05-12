import { dnd } from '../../types/resource'
import { aurora } from '../../types/aurora'
import { character as characterNS } from '../../types/character'
import { resources } from '../resources'

const getLevels = (
  character: null | aurora.Character,
): aurora.Element<{ class?: string; rndhp?: string }>[] => {
  if (!character) return []

  const levels = character.build[0].elements[0].element.filter(
    el => el.$.type === 'Level',
  ) as aurora.Element<{ class?: string; rndhp?: string }>[]

  return levels
}

const getClasses = (character: null | aurora.Character) => {
  const levels = getLevels(character)
  const sum = resources.resourcesForIds(
    character?.build[0].sum[0].element.map(e => e.$.id) || [],
  )

  const classes = resources.resourcesForIds(
    (
      character?.build[0].sum[0].element.filter(e =>
        ['Class', 'Multiclass'].includes(e.$.type),
      ) as aurora.Element<{ registered: string }>[]
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
              | aurora.Element<{
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
      } as characterNS.Class
    })
    .filter(Boolean) as characterNS.Class[]
}

const getBaseAbilityScores = (character: null | aurora.Character) => {
  if (!character)
    return {
      [characterNS.AbilityScore.strength]: 10,
      [characterNS.AbilityScore.dexterity]: 10,
      [characterNS.AbilityScore.constitution]: 10,
      [characterNS.AbilityScore.intelligence]: 10,
      [characterNS.AbilityScore.wisdom]: 10,
      [characterNS.AbilityScore.charisma]: 10,
    }

  const rawScores = character.build[0].abilities[0]
  return Object.keys(character.build[0].abilities[0])
    .filter(k => k !== '$')
    .reduce((prev, key) => {
      const newKey = Object.keys(characterNS.AbilityScoreIDSubString).find(
        k =>
          characterNS.AbilityScoreIDSubString[
            k as characterNS.AbilityScore
          ].toLowerCase() === key,
      ) as characterNS.AbilityScore

      prev[newKey] = parseInt(rawScores[key as keyof typeof rawScores][0])
      return prev
    }, {} as characterNS.AbilityScores)
}

const getEquipment = (
  character: null | aurora.Character,
): { [slot: string]: dnd.Resource } => {
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
    } as { [slot: string]: dnd.Resource }
  }, {} as { [slot: string]: dnd.Resource })
}

const getStats = (character: null | aurora.Character): characterNS.Stats => {
  const classes = getClasses(character)
  const baseAbilityScores = getBaseAbilityScores(character)
  const sum = resources.resourcesForIds(
    character?.build[0].sum[0].element.map(e => e.$.id) || [],
  )

  const rndhpPerLevel = classes.reduce((prev, c) => {
    return prev.concat(c.rndhp.slice(0, c.level))
  }, [] as number[])

  const baseStats: characterNS.Stats = {
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
    { ...baseStats } as characterNS.Stats,
  )

  return stats
}

const getMagic = (character: null | aurora.Character): characterNS.Magic => {
  const classes = getClasses(character)

  const magic: characterNS.Magic = { multiclass: false, spellcasting: [] }
  if (!character) return magic

  const rawMagic = character.build[0].magic[0]

  if (!rawMagic || !rawMagic.$) return magic

  if (rawMagic.$.multiclass === 'true') {
    magic.multiclass = true
  }

  classes.forEach(c => {
    if (!c.spellcasting) return

    const classMagic = rawMagic.spellcasting.find(sl => sl.$.name === c.class)

    if (!classMagic) return

    const slots = Object.keys(classMagic.slots[0].$).reduce((prev, key) => {
      const typedKey = key as characterNS.SpellSlotName
      prev[typedKey] = Number(classMagic.slots[0].$[typedKey])
      return prev
    }, {} as { [name in characterNS.SpellSlotName]: number })

    const spellcasting: characterNS.SpellCasting = {
      multiclass: magic.multiclass && !c.soloSpellslots,
      class: classMagic.$.name,
      ability: classMagic.$.ability.toLowerCase() as characterNS.AbilityScore,
      dc: Number(classMagic.$.dc),
      attack: Number(classMagic.$.attack),
      slots,
    }

    magic.spellcasting.push(spellcasting)
  })

  return magic
}

export const parseCharacter = (
  character: null | aurora.Character,
): characterNS.Character => {
  const levels = getLevels(character)
  const classes = getClasses(character)
  const equipment = getEquipment(character)
  const stats = getStats(character)
  const magic = getMagic(character)

  const classFeatures = resources.resourcesForIds(
    character?.build[0].sum[0].element
      .filter(e => e.$.type === 'Class Feature')
      .map(e => e.$.id) || [],
  )
  const feats = resources.resourcesForIds(
    character?.build[0].sum[0].element
      .filter(e => e.$.type === 'Feat')
      .map(e => e.$.id) || [],
  )

  console.log(character)
  console.log('Stats: ', stats)
  console.log('Magic: ', magic)
  console.log('Classes: ', classes)
  console.log('Equipment: ', equipment)
  console.log('Class features: ', classFeatures)
  console.log('Feats: ', feats)

  return {
    level: levels.length,
    classes,
    equipment,
    magic,
    stats,
  }
}
