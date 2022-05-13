import { createContext, ReactNode, useContext } from 'react'
import { useCharacter } from '../character/CharacterContext'
import { CombatAPI, CombatState } from './types'
import { useCombatInternal } from './useCombat'

type ContextType = {
  state: CombatState
  api: CombatAPI
}

const CombatContext = createContext<ContextType>({
  state: null as any,
  api: null as any,
})

export const CombatProvider = (props: { children: ReactNode }) => {
  const character = useCharacter()
  const combat = useCombatInternal(character)

  return (
    <CombatContext.Provider value={combat}>
      {props.children}
    </CombatContext.Provider>
  )
}

export const useCombat = (): [CombatState, CombatAPI] => {
  const c = useContext(CombatContext)
  return [c.state, c.api]
}
export const useCombatState = () => useCombat()[0]
export const useCombatApi = () => useCombat()[1]
export const useCombatUndo = () => useCombat()[1].undo
export const useCombatLog = () => useCombat()[0].log
export const useSpellcasting = () => useCombat()[0].spellcasting
