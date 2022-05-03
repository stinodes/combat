import { createSlice, Draft, PayloadAction } from '@reduxjs/toolkit'
import { Dispatch, useCallback, useEffect, useMemo, useReducer } from 'react'
import { Character } from '../character/useParse/types'
import { CombatAPI, CombatLog, CombatState } from './types'
import { v4 } from 'uuid'

const initialState: CombatState = { hp: 0, maxHp: 0, log: [] }

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
      state.log = []
      state.maxHp = action.payload.hp
      state.hp = action.payload.hp
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
  Dispatch<PayloadAction<any, string, any>>,
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

  const api = useMemo(() => ({ heal, damage, undo }), [heal, damage, undo])
  const value = useMemo(() => ({ state, api }), [state, api])
  return value
}
