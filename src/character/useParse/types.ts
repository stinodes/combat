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
}
export type Stats = {
  [stat: string]: dnd.StatRule[]
}

export type Character = {
  classes: Class[]
  hp: number
  stats: Stats
  getStat: (name: string) => null | number
}
