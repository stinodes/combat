import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { dnd } from '../../types/resource'
import { LOCAL_STORAGE_CHARACTERSE_KEY } from '../overview'
import { useParse } from './useParse'
import { Character, CombatAPI, CombatState } from './useParse/types'

type ContextType = {
  preview: dnd.CharacterPreview
  character: null | Character
  combat: [CombatState, CombatAPI]
}

const CharacterContext = createContext<ContextType>({
  preview: null as any,
  character: null,
  combat: [null, null] as any,
})

const useCombatInternal = (
  character: null | Character,
): [CombatState, CombatAPI] => {
  const maxHp = character?.hp || 0
  const [hp, setHp] = useState<number>(character?.hp || 0)

  const damage = useCallback(
    (amount: number) => {
      setHp(hp => Math.max(hp - amount, 0))
    },
    [setHp],
  )
  const heal = useCallback(
    (amount: number) => {
      setHp(hp => Math.min(hp + amount, maxHp))
    },
    [setHp, maxHp],
  )

  useEffect(() => {
    console.log('combat use effect')
    if (!character) return
    setHp(character.hp)
  }, [character, setHp])

  const state = useMemo(() => ({ hp }), [hp])
  const api = useMemo(() => ({ heal, damage }), [heal, damage])
  const value: [CombatState, CombatAPI] = useMemo(
    () => [state, api],
    [state, api],
  )
  return value
}

export const CharacterProvider = ({
  id,
  children,
}: {
  id: string
  children: ReactNode
}) => {
  const [character, setCharacter] = useState<null | dnd.Character>(null)

  const preview = useMemo(() => {
    const characters = JSON.parse(
      localStorage.getItem(LOCAL_STORAGE_CHARACTERSE_KEY) || '[]',
    ) as dnd.CharacterPreview[]
    return characters.find(ch => ch.id === id) as dnd.CharacterPreview
  }, [id])

  const parsedCharacter = useParse(character)

  const combat = useCombatInternal(parsedCharacter)

  const value = useMemo(
    () => ({ preview, character: parsedCharacter, combat }),
    [preview, parsedCharacter, combat],
  )

  const fetchCharacter = async (path: string) => {
    const character = await window.api.openCharacter(path)
    setCharacter(character)
  }

  useEffect(() => {
    fetchCharacter(preview.path)
  }, [preview])

  return (
    <CharacterContext.Provider value={value}>
      {children}
    </CharacterContext.Provider>
  )
}

export const useCharacterContext = () => useContext(CharacterContext)
export const usePreview = () => useCharacterContext().preview
export const useName = () => usePreview().name
export const usePortrait = () => usePreview().portrait
export const useCharacter = () => useCharacterContext().character
export const useCombat = () => useCharacterContext().combat
export const useCombatState = () => useCharacterContext().combat[0]
export const useCombatApi = () => useCharacterContext().combat[1]
