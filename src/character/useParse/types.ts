import { dnd } from '../../../types/resource'

export enum AbilityScore {
  'strength' = 'strength',
  'dexterity' = 'dexterity',
  'constitution' = 'constitution',
  'intelligence' = 'intelligence',
  'wisdom' = 'wisdom',
  'charisma' = 'charisma',
}

export enum AbilityScoreIDSubString {
  'strength' = 'STRENGTH',
  'dexterity' = 'DEXTERITY',
  'constitution' = 'CONSTITUTION',
  'intelligence' = 'INTELLIGENCE',
  'wisdom' = 'WISDOM',
  'charisma' = 'CHARISMA',
}

export type AbilityScores = {
  [name in AbilityScore]: number
}
export type Class = {
  class: string
  level: number
  rndhp: number[]
  spellcasting: boolean
  soloSpellslots: boolean
}
export type Stats = {
  [stat: string]: dnd.StatRule[]
}
export type SpellSlotLevel = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9
export type SpellSlotName = `s${SpellSlotLevel}`
export type SpellCasting = {
  multiclass: boolean
  class: string
  ability: AbilityScore
  dc: number
  attack: number
  slots: { [slot in SpellSlotName]: number }
}
export type Magic = {
  multiclass: boolean
  spellcasting: SpellCasting[]
}
export type Character = {
  classes: Class[]
  stats: Stats
  magic: Magic
  getStat: (name: string) => null | number
}
