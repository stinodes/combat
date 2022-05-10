import { PayloadAction } from '@reduxjs/toolkit'
import { SpellCasting, SpellSlotName } from '../character/useParse/types'

export type CombatLog = PayloadAction<
  any,
  string,
  { undoable: true; undo?: boolean; id: string }
>

export type CombatSpellcasting = Omit<SpellCasting, 'slots'> & {
  slots: {
    [slot in SpellSlotName]: {
      current: number
      max: number
    }
  }
}
export type CombatState = {
  maxHp: number
  hp: number
  spellcasting: null | { [className: string]: CombatSpellcasting }
  log: CombatLog[]
}
export type CombatAPI = {
  heal: (amount: number) => any
  damage: (amount: number) => any
  undo: (log: CombatLog) => any
  consumeSpellslot: (className: string, slot: SpellSlotName) => void
}
