import Store from 'electron-store'
import { ipcMain } from 'electron'
import { Settings } from '../../types/settings'
import { resources } from '../resources'

const store = new Store()

const defaults: Settings = {
  resourceStats: [{ label: 'Ki', name: 'ki points:points', color: '#FE9920' }],
}

export const settingsApi = (() => {
  let settings: Settings = (store.get('settings') || defaults) as {
    [key: string]: string
  }
  return {
    settings() {
      return settings
    },
    setting<R extends Settings[keyof Settings]>(key: keyof Settings): R {
      return settings[key] as R
    },
    saveSettings(newSettings: Settings) {
      settings = newSettings
      store.set('settings', newSettings)
      resources.load()
    },
  }
})()

export const setupSettingsIpc = () => {
  ipcMain.handle('settings:settings', settingsApi.settings)
  ipcMain.handle('settings:setting', (_, name: keyof Settings) =>
    settingsApi.setting(name),
  )
  ipcMain.handle('settings:save', (_, settings: Settings) =>
    settingsApi.saveSettings(settings),
  )
}
