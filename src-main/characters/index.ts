import { ipcMain } from 'electron'
import Store from 'electron-store'
import { aurora } from '../../types/aurora'
import { createCharacterPreview, openCharacter } from './openCharacter'
import { parseCharacter } from './parseCharacter'

const store = new Store()

export const characterApi = (() => {
  return {
    previews() {
      return store.get('previews') as { [id: string]: aurora.CharacterPreview }
    },
    preview(id: string) {
      return store.get(`previews.${id}`) as null | aurora.CharacterPreview
    },

    async createPreview(): Promise<null | aurora.CharacterPreview> {
      const preview = await createCharacterPreview()
      if (!preview) return null
      store.set(`previews.${preview.id}`, preview)
      return preview
    },
    async loadCharacter(id: string) {
      const preview = this.preview(id)
      if (!preview) return null
      const rawChar = await openCharacter(preview.path)
      const character = parseCharacter(rawChar)

      store.set(`character.${id}`, character)

      return character
    },
    character(id: string) {
      return store.get(`character.${id}`)
    },
  }
})()

export const setupCharacterIPC = () => {
  ipcMain.handle('character:createPreview', characterApi.createPreview)
  ipcMain.handle('character:previews', characterApi.previews)
  ipcMain.handle('character:preview', (_, id: string) =>
    characterApi.preview(id),
  )
  ipcMain.handle('character:load', (_, id: string) =>
    characterApi.loadCharacter(id),
  )
  ipcMain.handle('character:character', (_, id: string) =>
    characterApi.character(id),
  )
}
