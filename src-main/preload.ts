import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('api', {
  openDir: () => ipcRenderer.invoke('dialog:openDir'),

  load: (path: string) => ipcRenderer.invoke('data:load', path),
  path: () => ipcRenderer.invoke('data:path'),
  resourceForId: (id: string) => ipcRenderer.invoke('data:resourceForId', id),
  resourcesForIds: (ids: string[]) =>
    ipcRenderer.invoke('data:resourceForId', ids),
  resourceTypes: () => ipcRenderer.invoke('data:resourceTypes'),
  resourcesForType: (type: string) =>
    ipcRenderer.invoke('data:resourcesForType', type),

  createPreview: () => ipcRenderer.invoke('character:createPreview'),
  previews: () => ipcRenderer.invoke('character:previews'),
  preview: (id: string) => ipcRenderer.invoke('character:preview', id),
  loadCharacter: (id: string) => ipcRenderer.invoke('character:load', id),
  character: (id: string) => ipcRenderer.invoke('character:character', id),
})
