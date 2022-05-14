import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { useLoading } from '../common/useLoading'
import { Character, CharacterPreview } from '../types/character'
import { stat } from './stats'

export type ExtendedCharacter = Character & {
  getStat: (name: string) => null | number
}
type ContextType = {
  preview: null | CharacterPreview
  character: null | ExtendedCharacter
  loading: boolean
}

const CharacterContext = createContext<ContextType>({
  preview: null,
  character: null,
  loading: false,
})

export const CharacterProvider = ({
  id,
  children,
}: {
  id: string
  children: ReactNode
}) => {
  const [preview, setPreview] = useState<null | CharacterPreview>(null)
  const [character, setCharacter] = useState<null | Character>(null)

  const [loading, fetchCharacter] = useLoading(
    useCallback(
      async (id: string) => {
        const preview = await window.api.preview(id)
        const character = await window.api.loadCharacter(id)
        setPreview(preview)
        setCharacter(character)
      },
      [setCharacter, setPreview],
    ),
  )

  const value = useMemo(() => {
    const extended: null | ExtendedCharacter = character
      ? {
          ...character,
          getStat: (name: string) => character && stat(character, name),
        }
      : null
    return { preview, character: extended, loading }
  }, [preview, character, loading])

  useEffect(() => {
    fetchCharacter(id)
  }, [id, fetchCharacter])

  return (
    <CharacterContext.Provider value={value}>
      {children}
    </CharacterContext.Provider>
  )
}

export const useCharacterContext = () => useContext(CharacterContext)
export const useCharacterLoading = () => useCharacterContext().loading
export const usePreview = () => useCharacterContext().preview
export const useName = () => usePreview()?.name
export const usePortrait = () => usePreview()?.portrait
export const useCharacter = () => useCharacterContext().character
export const useStat = (name: string) => {
  const char = useCharacterContext().character
  if (!char) return 0
  return stat(char, name)
}
export const useMagic = () => useCharacterContext().character?.magic
