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
import { ResourceStatSetting } from '../types/settings'
import { stat } from './stats'

export type ExtendedCharacter = Character & {
  additionalResources: ResourceStatSetting[]
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
  const [additionalResources, setAdditionalResources] =
    useState<ResourceStatSetting[]>()

  const [loading, fetchCharacter] = useLoading(
    useCallback(
      async (id: string) => {
        const preview = await window.api.preview(id)
        const character = await window.api.loadCharacter(id)
        const additionalResources =
          (await window.api.setting<ResourceStatSetting[]>('resourceStats')) ||
          []
        setPreview(preview)
        setAdditionalResources(additionalResources)
        setCharacter(character)
      },
      [setCharacter, setPreview],
    ),
  )

  const value = useMemo(() => {
    const extended: null | ExtendedCharacter = character
      ? {
          ...character,
          additionalResources,
          getStat: (name: string) => character && stat(character, name),
        }
      : null
    return { preview, character: extended, loading }
  }, [preview, character, loading, additionalResources])

  useEffect(() => {
    fetchCharacter(id)
  }, [id, fetchCharacter])

  // const query = useCallback(async (id: string) => {
  //   const r = await window.api.raw(id)
  //   const ids = r.build[0].sum[0].element.map(s => s.$.id)
  //   const elements = await Promise.all(ids.map(window.api.resourceForId))
  //   console.log(
  //     elements.filter(
  //       el => el && el.rules && el.rules[0]?.stat?.some(e => e.$.name === 'hp'),
  //     ),
  //   )
  // }, [])
  //
  // useEffect(() => {
  //   query(id)
  // }, [query, id])

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
export const useAdditionalResources = () =>
  useCharacterContext().character.additionalResources
export const useMagic = () => useCharacterContext().character?.magic
export const useActions = () => useCharacterContext().character?.actions
