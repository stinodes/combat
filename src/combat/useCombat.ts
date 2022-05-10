import { createSlice, Draft, PayloadAction } from '@reduxjs/toolkit'
import { Dispatch, useCallback, useEffect, useMemo, useReducer } from 'react'
import { Character } from '../character/useParse/types'
import { CombatAPI, CombatLog, CombatSpellcasting, CombatState } from './types'
import { v4 } from 'uuid'
import { SpellSlotName } from '../../types/character'

const initialState: CombatState = {
  hp: 0,
  maxHp: 0,
  spellcasting: null,
  log: [],
}

const prepare = <P>(payload: P, undo?: boolean) => ({
  payload,
  meta: { undo, undoable: true, id: v4() },
  error: undefined,
})
const undoableAction = (
  reducer: (
    s: Draft<CombatState>,
    a: PayloadAction<any, string, any, any>,
  ) => any,
) => ({
  reducer,
  prepare,
})

const { reducer: combatReducer, actions } = createSlice({
  name: 'combat',
  initialState,
  reducers: {
    initialize: (state, action: PayloadAction<Character>) => {
      const hp = action.payload.getStat('hp')
      const magic = action.payload.magic

      state.log = []

      if (hp) {
        state.maxHp = hp
        state.hp = hp
      }

      if (magic.spellcasting.length) {
        const spellcasting: { [className: string]: CombatSpellcasting } = {}
        magic.spellcasting.forEach(s => {
          spellcasting[s.class] = {
            ...s,
            slots: Object.keys(s.slots).reduce((prev, key) => {
              const castedKey = key as SpellSlotName
              prev[castedKey] = {
                max: s.slots[castedKey],
                current: s.slots[castedKey],
              }
              return prev
            }, {} as { [slot in SpellSlotName]: { current: number; max: number } }),
          }
        })
        state.spellcasting = spellcasting
      } else state.spellcasting = null
    },
    heal: undoableAction((state, action) => {
      if (action.meta.undo) {
        state.hp = Math.max(state.hp - action.payload, 0)
      } else {
        state.hp = Math.min(state.hp + action.payload, state.maxHp)
      }
    }),
    damage: undoableAction((state, action) => {
      if (action.meta.undo) {
        state.hp = Math.min(state.hp + action.payload, state.maxHp)
      } else {
        state.hp = Math.max(state.hp - action.payload, 0)
      }
    }),
    consumeSpellslot: (
      state,
      action: PayloadAction<{ class: string; slot: SpellSlotName }>,
    ) => {
      if (!state.spellcasting) return
      const spellslots =
        state.spellcasting[action.payload.class].slots[action.payload.slot]

      state.spellcasting[action.payload.class].slots[
        action.payload.slot
      ].current = Math.max(spellslots.current - 1, 0)
    },
    restoreSpellslot: (
      state,
      action: PayloadAction<{ class: string; slot: SpellSlotName }>,
    ) => {
      if (!state.spellcasting) return
      const spellslots =
        state.spellcasting[action.payload.class].slots[action.payload.slot]

      state.spellcasting[action.payload.class].slots[
        action.payload.slot
      ].current = Math.min(spellslots.current + 1, spellslots.max)
    },
  },
  extraReducers: builder => {
    builder.addMatcher(
      action => action.meta?.undoable,
      (state, action: CombatLog) => {
        if (!action.meta.undo) state.log = [...state.log, action]
        if (action.meta.undo)
          state.log = state.log.filter(a => a.meta.id !== action.meta.id)
      },
    )
  },
})

const useCombatReducer = (): [
  CombatState,
  Dispatch<PayloadAction<any, string> | PayloadAction<any, string, any>>,
] => {
  const [state, dispatch] = useReducer(combatReducer, initialState)
  return [state, dispatch]
}

export const useCombatInternal = (
  character: null | Character,
): { state: CombatState; api: CombatAPI } => {
  const [state, dispatch] = useCombatReducer()

  const damage = useCallback(
    (amount: number) => {
      dispatch(actions.damage(amount))
    },
    [dispatch],
  )
  const heal = useCallback(
    (amount: number) => {
      dispatch(actions.heal(amount))
    },
    [dispatch],
  )

  const consumeSpellslot = useCallback(
    (className: string, slot: SpellSlotName) => {
      dispatch(actions.consumeSpellslot({ class: className, slot }))
    },
    [dispatch],
  )

  const restoreSpellslot = useCallback(
    (className: string, slot: SpellSlotName) => {
      dispatch(actions.restoreSpellslot({ class: className, slot }))
    },
    [dispatch],
  )

  const undo = useCallback(
    (log: CombatLog) => {
      dispatch({ ...log, meta: { ...log.meta, undo: true } })
    },
    [dispatch],
  )

  useEffect(() => {
    if (!character) return
    dispatch(actions.initialize(character) as CombatLog)
  }, [character, dispatch])

  const api = useMemo(
    () => ({ heal, damage, undo, consumeSpellslot, restoreSpellslot }),
    [heal, damage, undo, consumeSpellslot, restoreSpellslot],
  )
  const value = useMemo(() => ({ state, api }), [state, api])
  return value
}
