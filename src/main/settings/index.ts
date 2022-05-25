import Store from 'electron-store'
import { ipcMain } from 'electron'
import { Settings } from '../../types/settings'
import { resources } from '../resources'

const store = new Store()

const defaults: Settings = {
  path: '',
  indexes: [],
  resourceStats: [{ label: 'Ki', name: 'ki points:points', color: '#FE9920' }],
  autoReload: true,
}

export const settingsApi = (() => {
  let settings: Settings = {
    ...defaults,
    ...((store.get('settings') as Settings) || {}),
  }
  return {
    settings() {
      return settings
    },
    setting<R extends Settings[keyof Settings]>(key: keyof Settings): R {
      return settings[key] as R
    },
    saveSettings(newSettings: Settings) {
      let reload =
        newSettings.path !== settings.path ||
        newSettings.indexes !== settings.indexes
      settings = newSettings
      store.set('settings', newSettings)
      reload && resources.load(true)
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
