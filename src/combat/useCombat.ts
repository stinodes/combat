import { createSlice, Draft, PayloadAction } from '@reduxjs/toolkit'
import { Dispatch, useCallback, useEffect, useMemo, useReducer } from 'react'
import {
  CombatAPI,
  CombatLog,
  CombatResource,
  CombatSpellcasting,
  CombatState,
} from './types'
import { v4 } from 'uuid'
import { ExtendedCharacter } from '../character/CharacterContext'
import { SpellSlotName } from '../types/aurora'
import { ID } from '../types/dnd'
import { stat } from '../character/stats'

const initialState: CombatState = {
  hp: 0,
  maxHp: 0,
  shield: 0,
  spellcasting: null,
  features: {},
  log: [],
}

const prepare = <P>(payload: P, undo?: boolean) => ({
  payload,
  meta: { undo, undoable: true, id: v4() },
  error: undefined as void,
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
    initialize: (state, action: PayloadAction<ExtendedCharacter>) => {
      const hp = action.payload.getStat('hp')
      const magic = action.payload.magic
      const actions = action.payload.actions

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
            }, {} as { [slot in SpellSlotName]: CombatResource }),
          }
        })
        state.spellcasting = spellcasting
      } else state.spellcasting = null

      const actionUsage = Object.values(actions).reduce((prev, action) => {
        if (!!action.usage)
          prev[action.id] = { current: action.usage, max: action.usage }
        return prev
      }, {} as { [id: ID]: CombatResource })

      action.payload.additionalResources.forEach(resource => {
        const total = stat(action.payload, resource.name)
        actionUsage[resource.name] = {
          max: total,
          current: total,
        }
      })

      state.features = actionUsage
    },

    heal: undoableAction((state, action) => {
      if (!action.meta.undo)
        state.hp = Math.min(state.hp + action.payload, state.maxHp)
    }),

    shield: undoableAction((state, action) => {
      if (!action.meta.undo) state.shield = action.payload
    }),

    damage: undoableAction((state, action) => {
      if (!action.meta.undo) {
        let dmg = action.payload
        const shield = state.shield

        if (shield !== 0) {
          state.shield = Math.max(shield - dmg, 0)
          dmg = Math.max(dmg - shield, 0)
        }

        state.hp = Math.max(state.hp - dmg, 0)
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

    consumeFeature: (state, action: PayloadAction<{ id: ID }>) => {
      if (state.features[action.payload.id])
        state.features[action.payload.id].current = Math.max(
          state.features[action.payload.id].current - 1,
          0,
        )
    },

    restoreFeature: (state, action: PayloadAction<{ id: ID }>) => {
      if (state.features[action.payload.id])
        state.features[action.payload.id].current = Math.min(
          state.features[action.payload.id].current + 1,
          state.features[action.payload.id].max,
        )
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
  character: null | ExtendedCharacter,
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

  const shield = useCallback(
    (amount: number) => {
      dispatch(actions.shield(amount))
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

  const consumeFeature = useCallback(
    (id: ID) => {
      dispatch(actions.consumeFeature({ id }))
    },
    [dispatch],
  )

  const restoreFeature = useCallback(
    (id: ID) => {
      dispatch(actions.restoreFeature({ id }))
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
    () => ({
      heal,
      damage,
      shield,
      undo,
      consumeSpellslot,
      restoreSpellslot,
      consumeFeature,
      restoreFeature,
    }),
    [
      heal,
      damage,
      shield,
      undo,
      consumeSpellslot,
      restoreSpellslot,
      consumeFeature,
      restoreFeature,
    ],
  )
  const value = useMemo(() => ({ state, api }), [state, api])
  return value
}
