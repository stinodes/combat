export enum AbilityScore {
  'str' = 'str',
  'dex' = 'dex',
  'con' = 'con',
  'int' = 'int',
  'wis' = 'wis',
  'char' = 'char',
}
export enum AbilityScoreIDSubString {
  'str' = 'STRENGTH',
  'dex' = 'DEXTERITY',
  'con' = 'CONSTITUTION',
  'int' = 'INTELLIGENCE',
  'wis' = 'WISDOM',
  'char' = 'CHARISMA',
}

export type AbilityScores = {
  [name in AbilityScore]: number
}
export type Class = {
  class: string
  level: number
  rndhp: number[]
}
export type Character = {
  abilityScores: AbilityScores
  abilityScoreMods: AbilityScores
  classes: Class[]
  hp: number
}

export type CombatState = {
  hp: number
}
export type CombatAPI = {
  heal: (amount: number) => any
  damage: (amount: number) => any
}
