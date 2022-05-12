import { character } from '../types/character'
import { dnd } from '../types/resource'

export interface API {
  openDir: () => Promise<string>

  load: (path: string) => Promise<void>
  path: () => Promise<string>
  resourceForId: (id: string) => Promise<dnd.Resource>
  resourcesForIds: (ids: string[]) => Promise<dnd.Resource[]>
  resourceTypes: () => Promise<dnd.ResourceType[]>
  resourcesForType: (type: string) => Promise<dnd.Resource[]>

  createPreview: () => Promise<aurora.CharacterPreview>
  previews: () => Promise<aurora.CharacterPreview[]>
  preview: (id: string) => Promise<null | aurora.CharacterPreview>
  loadCharacter: (id: string) => Promise<null | character.Character>
  character: (id: string) => Promise<null | character.Character>
}

declare global {
  interface Window {
    api: API
  }
}
