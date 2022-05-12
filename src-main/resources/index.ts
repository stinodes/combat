import { ipcMain } from 'electron'
import { dnd } from '../../types/resource'
import { parseResources } from './parse'

export const resources = (() => {
  let path: string = ''
  let data: dnd.ResourceDB = {
    resources: {},
    typeIndex: Object.keys(dnd.ResourceType).reduce(
      (prev, key) => ({ ...prev, [key]: {} }),
      {} as dnd.ResourceDB['typeIndex'],
    ),
  }

  return {
    async load(newPath: string) {
      path = newPath
      data = await parseResources(path)
    },

    path() {
      return path
    },
    resourceForId(id: string): dnd.Resource {
      return data.resources[id]
    },
    resourcesForIds(ids: string[]): dnd.Resource[] {
      return ids.map(this.resourceForId)
    },
    resourceTypes(): dnd.ResourceType[] {
      return Object.keys(data.typeIndex) as dnd.ResourceType[]
    },
    resourcesForType(type: dnd.ResourceType): dnd.Resource[] {
      return this.resourcesForIds(data.typeIndex[type])
    },
  }
})()

export const setupResourcesIPC = () => {
  ipcMain.handle('resources:load', (_, path: string) => resources.load(path))
  ipcMain.handle('resouces:path', () => resources.path())
  ipcMain.handle('resouces:resourceForId', (_, id: string) =>
    resources.resourceForId(id),
  )
  ipcMain.handle('resouces:resourcesForIds', (_, ids: string[]) =>
    resources.resourcesForIds(ids),
  )
  ipcMain.handle('resouces:resourceTypes', () => resources.resourceTypes())
  ipcMain.handle('resouces:resourcesForType', (_, type: dnd.ResourceType) =>
    resources.resourcesForType(type),
  )
}
