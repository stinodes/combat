import { dnd } from '../types/resource'

export interface API {
  openDir: () => Promise<string>
  parseResources: (path: string) => Promise<dnd.ResourceDB>
}

declare global {
  interface Window {
    api: API
  }
}
