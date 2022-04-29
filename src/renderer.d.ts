import { dnd } from '../types/resource'

export interface API {
  openDir: () => Promise<string>
  parseResources: (path: string) => Promise<dnd.ResourceDB>
  openCharacter: (path: string) => Promise<dnd.Character>
  createCharacterPreview: () => Promise<dnd.CharacterPreview>
}

declare global {
  interface Window {
    api: API
  }
}
