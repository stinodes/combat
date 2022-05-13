export interface API {
  openDir: () => Promise<string>

  load: (path: string) => Promise<void>
  path: () => Promise<string>
  resourceForId: (id: string) => Promise<Resource>
  resourcesForIds: (ids: string[]) => Promise<Resource[]>
  resourceTypes: () => Promise<ResourceType[]>
  resourcesForType: (type: string) => Promise<Resource[]>

  createPreview: () => Promise<CharacterPreview>
  previews: () => Promise<CharacterPreview[]>
  preview: (id: string) => Promise<null | CharacterPreview>
  loadCharacter: (id: string) => Promise<null | Character>
  character: (id: string) => Promise<null | Character>
}

declare global {
  interface Window {
    api: API
  }
}

import './main'
import { Character, CharacterPreview } from './types/character'
import { Resource, ResourceType } from './types/dnd'
