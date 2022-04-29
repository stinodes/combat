import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('api', {
  test: () => console.log('context bridge test.'),
  openDir: () => ipcRenderer.invoke('dialog:openDir'),
  parseResources: (path: string) =>
    ipcRenderer.invoke('data:parseResources', path),
  openCharacter: (path: string) =>
    ipcRenderer.invoke('data:openCharacter', path),
  createCharacterPreview: () =>
    ipcRenderer.invoke('data:createCharacterPreview'),
})
