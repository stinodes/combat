import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { dnd } from '../../../types/resource'
import { resourcesByIdSelector } from '../../resources/redux'
import {
  AbilityScore,
  AbilityScoreIDSubString,
  AbilityScores,
  Character,
  Class,
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
        [AbilityScore.str]: 10,
        [AbilityScore.dex]: 10,
        [AbilityScore.con]: 10,
        [AbilityScore.int]: 10,
        [AbilityScore.wis]: 10,
        [AbilityScore.char]: 10,
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

const useAbilityScores = (character: null | dnd.Character) => {
  const baseAbilityScores = useBaseAbilityScores(character)
  return useMemo(() => {
    if (!character) return baseAbilityScores

    const abilityScores = { ...baseAbilityScores }
    const asi =
      character?.build[0].sum[0].element
        .filter(e => e.$.type === 'Ability Score Improvement')
        .map(e => e.$.id) || []

    asi
      .map(id =>
        Object.keys(AbilityScoreIDSubString).find(
          key =>
            id.indexOf(AbilityScoreIDSubString[key as AbilityScore]) !== -1,
        ),
      )
      .forEach(abilityScore => {
        if (abilityScore) abilityScores[abilityScore as AbilityScore] += 1
      })

    return abilityScores
  }, [character, baseAbilityScores])
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

export const useParse = (character: null | dnd.Character): Character => {
  const classes = useClasses(character)

  const abilityScores = useAbilityScores(character)
  const abilityScoreMods = useMemo(() => {
    return Object.keys(abilityScores).reduce((prev, key) => {
      prev[key as AbilityScore] = abilityScoreMod(
        abilityScores[key as AbilityScore],
      )
      return prev
    }, {} as AbilityScores)
  }, [abilityScores])

  const hp = useHp(classes, abilityScoreMods.con)

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
  console.log('Ability Scores: ', abilityScores)
  console.log('Ability Scores Mods: ', abilityScoreMods)
  console.log('Class features: ', classFeatures)
  console.log('Feats: ', feats)

  return useMemo(
    () => ({ classes, hp, abilityScores, abilityScoreMods }),
    [classes, hp, abilityScores, abilityScoreMods],
  )
}
