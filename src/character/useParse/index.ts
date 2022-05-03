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

  return useMemo(() => {
    return levels.reduce((prev, element) => {
      const classForElement =
        element.$.class ||
        (
          element.element.find(el => el.$.type === 'Class') as dnd.Element<{
            registered: string
          }>
        )?.$.registered

      let classObj = prev.find(c => c.class === classForElement) || {
        class: classForElement,
        level: 0,
        rndhp: element.$.rndhp?.split(',').map(Number) || [],
      }

      if (classObj.level === 0) prev.push(classObj)

      classObj.level = classObj.level + 1

      return prev
    }, [] as Class[])
  }, [levels])
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

const useHp = (classes: Class[], mod: number) => {
  return useMemo(() => {
    const rndhpPerLevel = classes.reduce((prev, c) => {
      return prev.concat(c.rndhp.slice(0, c.level))
    }, [] as number[])
    return rndhpPerLevel.reduce((prev, hp) => {
      return prev + hp + mod
    }, 0)
  }, [classes, mod])
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
  const equipment = useEquipment(character)
  const baseAbilityScores = useBaseAbilityScores(character)
  const sum = useSelector(
    resourcesByIdSelector(
      character?.build[0].sum[0].element.map(e => e.$.id) || [],
    ),
  )

  const baseStats: Stats = useMemo(
    () => ({
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
    [baseAbilityScores],
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

export const useParse = (character: null | dnd.Character): Character => {
  const classes = useClasses(character)
  const equipment = useEquipment(character)
  const stats = useStats(character)

  const hp = useHp(classes, stats.calculate('constitution:modifier') || 10)

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

  // console.log(character)
  console.log('Stats: ', stats.stats)
  console.log('Equipment: ', equipment)
  console.log('Class features: ', classFeatures)
  console.log('Feats: ', feats)

  return useMemo(
    () => ({ classes, hp, stats: stats.stats, getStat: stats.calculate }),
    [classes, hp, stats],
  )
}
