import { useCallback, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { dnd } from '../../../types/resource'
import { resourcesByIdSelector } from '../../resources/redux'
import {
  AbilityScore,
  AbilityScoreIDSubString,
  AbilityScores,
  Character,
  Class,
  Magic,
  SpellCasting,
  SpellSlotName,
  Stats,
} from './types'

const abilityScoreMod = (abilityScore: number) =>
  Math.floor((abilityScore - 10) / 2)

const useLevels = (character: null | dnd.Character) =>
  useMemo(() => {
    if (!character) return []

    const levels = character.build[0].elements[0].element.filter(
      el => el.$.type === 'Level',
    ) as dnd.Element<{ class?: string; rndhp?: string }>[]

    return levels
  }, [character])

const useClasses = (character: null | dnd.Character) => {
  const levels = useLevels(character)
  const sum = useSelector(
    resourcesByIdSelector(
      character?.build[0].sum[0].element.map(e => e.$.id) || [],
    ),
  )
  const classes = useSelector(
    resourcesByIdSelector(
      (
        character?.build[0].sum[0].element.filter(e =>
          ['Class', 'Multiclass'].includes(e.$.type),
        ) as dnd.Element<{ registered: string }>[]
      )?.map(e => e.$.id.replace('MULTICLASS', 'CLASS')) || [],
    ),
  )

  const spellcasting = useMemo(
    () => sum.filter(e => e && e.spellcasting),
    [sum],
  )

  return useMemo(() => {
    return classes
      .map(c => {
        if (!c) return null
        const name = c.$.name
        const id = c.$.id
        const classLevels = levels.filter(level => {
          const classNameForLevel =
            level.$.class ||
            (
              level.element.find(el => el.$.type === 'Class') as dnd.Element<{
                registered: string
              }>
            )?.$.registered

          return classNameForLevel.replace('MULTICLASS', 'CLASS') === id
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
          rndhp: levels
            .find(level => level.$.rndhp)
            ?.$.rndhp?.split(',')
            .map(Number),
          spellcasting: !!classSC,
          soloSpellslots: !!soloSC,
        } as Class
      })
      .filter(Boolean) as Class[]
  }, [classes, levels, spellcasting])
}

const useBaseAbilityScores = (character: null | dnd.Character) => {
  return useMemo(() => {
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
  }, [character])
}

const useEquipment = (
  character: null | dnd.Character,
): { [slot: string]: dnd.Resource } => {
  const equipment = useMemo(
    () =>
      character
        ? character.build[0].equipment[0].item.filter(
            item => item.equipped && item.equipped[0]._ === 'true',
          )
        : [],
    [character],
  )
  const equipmentIds = useMemo(() => equipment.map(el => el.$.id), [equipment])
  const items = useSelector(resourcesByIdSelector(equipmentIds))

  return useMemo(() => {
    return equipment.reduce((prev, item) => {
      const resource = items.find(i => i && i.$.id === item.$.id)
      if (!item || !item.equipped) return prev
      return {
        ...prev,
        [item.equipped[0].$.location.toLowerCase()]: resource,
      } as { [slot: string]: dnd.Resource }
    }, {} as { [slot: string]: dnd.Resource })
  }, [equipment, items])
}

const useStats = (
  character: null | dnd.Character,
): { stats: Stats; calculate: (stat: string) => null | number } => {
  const levels = useLevels(character)
  const classes = useClasses(character)
  const equipment = useEquipment(character)
  const baseAbilityScores = useBaseAbilityScores(character)
  const sum = useSelector(
    resourcesByIdSelector(
      character?.build[0].sum[0].element.map(e => e.$.id) || [],
    ),
  )

  const rndhpPerLevel = classes.reduce((prev, c) => {
    return prev.concat(c.rndhp.slice(0, c.level))
  }, [] as number[])

  const baseStats: Stats = useMemo(
    () => ({
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
    }),
    [rndhpPerLevel, baseAbilityScores],
  )

  const stats = useMemo(
    () =>
      sum.reduce(
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
      ),
    [baseStats, sum],
  )

  const hasArmorEquipped = useCallback(
    (equipString: string) => {
      const pair = equipString.replace('[', '').replace(']', '').split(':')
      const item = equipment[pair[0]]
      if (pair[1] === 'any') return !!item
      if (pair[1] === 'none') return !item
      return (
        !!item &&
        !!item.setters &&
        item.setters[0].set.some(
          setter =>
            setter.$.name === pair[0] && setter._.toLowerCase() === pair[1],
        )
      )
    },
    [equipment],
  )

  const meetsRequirements = useCallback(
    (stat: dnd.StatRule) => {
      let hasLevels = false
      let hasEquipped = false
      if (!stat.$.level) hasLevels = true
      if (!stat.$.equipped) hasEquipped = true
      if (Number(stat.$.level) <= levels.length) hasLevels = true
      if (stat.$.equipped) {
        hasEquipped = hasArmorEquipped(stat.$.equipped)
      }
      return hasLevels && hasEquipped
    },
    [levels, hasArmorEquipped],
  )

  const calculate = useCallback(
    (name: string): null | number => {
      const stat = stats[name]
      if (name.endsWith(':modifier')) {
        const abilityScore = name.split(':')[0]
        const value = calculate(abilityScore) || 10
        return abilityScoreMod(value)
      }
      if (!stat) return null
      return stat.reduce((total, rule) => {
        if (!meetsRequirements(rule)) return total

        if (!isNaN(Number(rule.$.value))) return total + Number(rule.$.value)

        const recursiveValue = calculate(rule.$.value)
        if (recursiveValue === null) return total
        return total + recursiveValue
      }, 0)
    },
    [meetsRequirements, stats],
  )

  return useMemo(() => ({ stats, calculate }), [stats, calculate])
}

const useMagic = (character: null | dnd.Character): Magic => {
  const classes = useClasses(character)

  return useMemo(() => {
    const magic: Magic = { multiclass: false, spellcasting: [] }
    if (!character) return magic

    const rawMagic = character.build[0].magic[0]

    if (rawMagic.$.multiclass === 'true') {
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

      const spellcasting: SpellCasting = {
        multiclass: magic.multiclass && !c.soloSpellslots,
        class: classMagic.$.name,
        ability: classMagic.$.ability.toLowerCase() as AbilityScore,
        dc: Number(classMagic.$.dc),
        attack: Number(classMagic.$.attack),
        slots,
      }

      magic.spellcasting.push(spellcasting)
    })

    return magic
  }, [character, classes])
}

export const useParse = (character: null | dnd.Character): Character => {
  const classes = useClasses(character)
  const equipment = useEquipment(character)
  const stats = useStats(character)
  const magic = useMagic(character)

  const classFeatures = useSelector(
    resourcesByIdSelector(
      character?.build[0].sum[0].element
        .filter(e => e.$.type === 'Class Feature')
        .map(e => e.$.id) || [],
    ),
  )
  const feats = useSelector(
    resourcesByIdSelector(
      character?.build[0].sum[0].element
        .filter(e => e.$.type === 'Feat')
        .map(e => e.$.id) || [],
    ),
  )

  console.log(character)
  console.log('Stats: ', stats.stats)
  console.log('Magic: ', magic)
  console.log('Classes: ', classes)
  console.log('Equipment: ', equipment)
  console.log('Class features: ', classFeatures)
  console.log('Feats: ', feats)

  return useMemo(
    () => ({
      classes,
      magic,
      stats: stats.stats,
      getStat: stats.calculate,
    }),
    [classes, magic, stats],
  )
}
