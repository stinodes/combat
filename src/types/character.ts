import { SpellSlotName } from './aurora'
import { Resource, StatRule } from './dnd'

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

export type CharacterPreview = {
  path: string
  name: string
  class: string
  portrait: null | string
  id: string
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
  [stat: string]: StatRule[]
}
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
  level: number
  classes: Class[]
  equipment: {
    [slot: string]: Resource
  }
  stats: Stats
  magic: Magic
}
