import { ipcMain } from 'electron'
import Store from 'electron-store'
import { CharacterPreview } from '../../types/character'
import { createCharacterPreview, openCharacter } from './openCharacter'
import { parseCharacter } from './parseCharacter'

const store = new Store()

export const characterApi = (() => {
  return {
    previews() {
      return Object.values(store.get('previews') || {}) as CharacterPreview[]
    },
    preview(id: string) {
      return store.get(`previews.${id}`) as null | CharacterPreview
    },

    async createPreview(): Promise<null | CharacterPreview> {
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
    async raw(id: string) {
      const preview = this.preview(id)
      if (!preview) return null
      return openCharacter(preview.path)
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
  ipcMain.handle('character:raw', (_, id: string) => characterApi.raw(id))
  ipcMain.handle('character:character', (_, id: string) =>
    characterApi.character(id),
  )
}
