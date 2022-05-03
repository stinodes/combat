import { PayloadAction } from '@reduxjs/toolkit'

export type CombatLog = PayloadAction<
  any,
  string,
  { undoable: true; undo?: boolean; id: string }
>

export type CombatState = {
  maxHp: number
  hp: number
  log: CombatLog[]
}
export type CombatAPI = {
  heal: (amount: number) => any
  damage: (amount: number) => any
  undo: (log: CombatLog) => any
}
