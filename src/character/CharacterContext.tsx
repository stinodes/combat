import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { character } from '../../types/character'
import { aurora } from '../../types/aurora'
import { stat } from './stats'

type ExtendedCharacter = character.Character & {
  getStat: (name: string) => null | number
}
type ContextType = {
  preview: null | aurora.CharacterPreview
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
  const [loading, setLoading] = useState<boolean>(false)
  const [preview, setPreview] = useState<null | aurora.CharacterPreview>(null)
  const [character, setCharacter] = useState<null | character.Character>(null)

  const value = useMemo(() => {
    const extended: null | ExtendedCharacter = character
      ? {
          ...character,
          getStat: (name: string) => character && stat(character, name),
        }
      : null
    return { preview, character: extended, loading }
  }, [preview, character, loading])

  const fetchCharacter = useCallback(
    async (id: string) => {
      setLoading(true)
      const preview = await window.api.preview(id)
      const character = await window.api.loadCharacter(id)
      setPreview(preview)
      setCharacter(character)
      setLoading(false)
    },
    [setLoading, setCharacter, setPreview],
  )

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
