import { contextBridge, ipcRenderer } from 'electron'
import { Settings } from '../types/settings'

contextBridge.exposeInMainWorld('api', {
  openDir: () => ipcRenderer.invoke('dialog:openDir'),

  load: (force: boolean) => ipcRenderer.invoke('resources:load', force),
  resourceForId: (id: string) =>
    ipcRenderer.invoke('resources:resourceForId', id),
  resourcesForIds: (ids: string[]) =>
    ipcRenderer.invoke('resources:resourcesForIds', ids),
  resourceTypes: () => ipcRenderer.invoke('resources:resourceTypes'),
  resourcesForType: (type: string) =>
    ipcRenderer.invoke('resources:resourcesForType', type),

  createPreview: () => ipcRenderer.invoke('character:createPreview'),
  previews: () => ipcRenderer.invoke('character:previews'),
  preview: (id: string) => ipcRenderer.invoke('character:preview', id),
  loadCharacter: (id: string) => ipcRenderer.invoke('character:load', id),
  deleteCharacter: (id: string) => ipcRenderer.invoke('character:delete', id),
  raw: (id: string) => ipcRenderer.invoke('character:raw', id),
  character: (id: string) => ipcRenderer.invoke('character:character', id),

  settings: () => ipcRenderer.invoke('settings:settings'),
  setting: (key: string) => ipcRenderer.invoke('settings:setting', key),
  saveSettings: (settings: Settings) =>
    ipcRenderer.invoke('settings:save', settings),
})
