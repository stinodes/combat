import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { dnd } from '../../types/resource'
import { LOCAL_STORAGE_CHARACTERSE_KEY } from '../overview'

type ContextType = {
  preview: dnd.CharacterPreview
  character: null | dnd.Character
}

const CharacterContext = createContext<ContextType>({
  preview: null as any,
  character: null,
})

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
    return characters.find(ch => ch.id === id) as dnd.Character
  }, [id])

  const value = useMemo(() => ({ preview, character }), [preview, character])

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
