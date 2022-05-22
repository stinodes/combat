export interface API {
  openDir: () => Promise<string>

  load: (path?: string) => Promise<void>
  path: () => Promise<string>
  resourceForId: (id: string) => Promise<Resource>
  resourcesForIds: (ids: string[]) => Promise<Resource[]>
  resourceTypes: () => Promise<ResourceType[]>
  resourcesForType: (type: string) => Promise<Resource[]>

  createPreview: () => Promise<CharacterPreview>
  previews: () => Promise<CharacterPreview[]>
  preview: (id: string) => Promise<null | CharacterPreview>
  raw: (id: string) => Promise<null | AuroraCharacter>
  loadCharacter: (id: string) => Promise<null | Character>
  deleteCharacter: (id: string) => Promise<void>
  character: (id: string) => Promise<null | Character>

  settings: () => Promise<Settings>
  setting: <R extends Settings[keyof Settings]>(
    key: keyof Settings,
  ) => Promise<R>
  saveSettings: (settings: Settings) => Promise<void>
}

declare global {
  interface Window {
    api: API
  }
}

import './main'
import { AuroraCharacter } from './types/aurora'
import { Character, CharacterPreview } from './types/character'
import { Resource, ResourceType } from './types/dnd'
import { Settings } from './types/settings'
