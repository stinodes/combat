import { Character } from '../types/character'
import { StatRule } from '../types/dnd'

type MinimalCharacter = Pick<
  Character,
  'level' | 'classes' | 'equipment' | 'stats'
>

const abilityScoreMod = (abilityScore: number) =>
  Math.floor((abilityScore - 10) / 2)

const hasArmorEquipped = (character: MinimalCharacter, equipString: string) => {
  const pair = equipString.replace('[', '').replace(']', '').split(':')
  const item = character.equipment[pair[0]]
  if (pair[1] === 'any') return !!item
  if (pair[1] === 'none') return !item
  return (
    !!item &&
    !!item.setters &&
    item.setters[0].set.some(
      setter => setter.$.name === pair[0] && setter._.toLowerCase() === pair[1],
    )
  )
}

const meetsRequirements = (character: MinimalCharacter, stat: StatRule) => {
  let hasLevels = false
  let hasEquipped = false
  if (!stat.$.level) hasLevels = true
  if (!stat.$.equipped) hasEquipped = true
  if (Number(stat.$.level) <= character.level) hasLevels = true
  if (stat.$.equipped) {
    hasEquipped = hasArmorEquipped(character, stat.$.equipped)
  }
  return hasLevels && hasEquipped
}

const calculateStat = (
  character: MinimalCharacter,
  name: string,
): null | number => {
  const stat = character.stats[name]

  if (name.endsWith(':modifier')) {
    const abilityScore = name.split(':')[0]
    const value = calculateStat(character, abilityScore) || 10
    return abilityScoreMod(value)
  }

  if (name.startsWith('level:')) {
    const className = name.split(':')[1]
    return (
      character.classes.find(c => c.class.toLowerCase() === className)?.level ||
      0
    )
  }

  if (!stat) return 0

  return stat.reduce((total, rule) => {
    if (!meetsRequirements(character, rule)) return total

    if (!isNaN(Number(rule.$.value))) return total + Number(rule.$.value)

    const recursiveValue = calculateStat(character, rule.$.value)
    if (recursiveValue === null) return total
    return total + recursiveValue
  }, 0)
}

const replaceStats = (character: MinimalCharacter, toReplace: string = '') => {
  const matches = Array.from(toReplace.matchAll(/\{\{([\w \-:]+)\}\}/g)).filter(
    match => match[1],
  )

  const replaced = matches.reduce(
    (string, match) =>
      string.replace(match[0], `${calculateStat(character, match[1])}`),
    toReplace,
  )

  return replaced
}

export { calculateStat as stat, replaceStats }
