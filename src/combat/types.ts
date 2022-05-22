import { PayloadAction } from '@reduxjs/toolkit'
import { SpellSlotName } from '../types/aurora'
import { SpellCasting } from '../types/character'
import { ID } from '../types/dnd'

export type CombatLog = PayloadAction<
  any,
  string,
  { undoable: true; undo?: boolean; id: string }
>

export type CombatResource = {
  current: number
  max: number
}
export type CombatSpellcasting = Omit<SpellCasting, 'slots'> & {
  slots: {
    [slot in SpellSlotName]: CombatResource
  }
}
export type CombatState = {
  maxHp: number
  hp: number
  shield: number
  spellcasting: null | {
    [className: string]: CombatSpellcasting
  }
  features: { [id: ID]: CombatResource }
  log: CombatLog[]
}
export type CombatAPI = {
  heal: (amount: number) => void
  shield: (amount: number) => void
  damage: (amount: number) => void
  undo: (log: CombatLog) => void
  consumeSpellslot: (className: string, slot: SpellSlotName) => void
  restoreSpellslot: (className: string, slot: SpellSlotName) => void
  consumeFeature: (id: ID) => void
  restoreFeature: (id: ID) => void
}
