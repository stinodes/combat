import { character } from '../../types/character'
import { dnd } from '../../types/resource'

const abilityScoreMod = (abilityScore: number) =>
  Math.floor((abilityScore - 10) / 2)

const hasArmorEquipped = (
  character: character.Character,
  equipString: string,
) => {
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

const meetsRequirements = (
  character: character.Character,
  stat: dnd.StatRule,
) => {
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
  character: character.Character,
  name: string,
): null | number => {
  const stat = character.stats[name]
  if (name.endsWith(':modifier')) {
    const abilityScore = name.split(':')[0]
    const value = calculateStat(character, abilityScore) || 10
    return abilityScoreMod(value)
  }
  if (!stat) return null
  return stat.reduce((total, rule) => {
    if (!meetsRequirements(character, rule)) return total

    if (!isNaN(Number(rule.$.value))) return total + Number(rule.$.value)

    const recursiveValue = calculateStat(character, rule.$.value)
    if (recursiveValue === null) return total
    return total + recursiveValue
  }, 0)
}

export { calculateStat as stat }
