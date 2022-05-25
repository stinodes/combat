import { ipcMain } from 'electron'
import { Resource, ResourceDB, ResourceType } from '../../types/dnd'
import { settingsApi } from '../settings'
import { parseResources } from './parse'

export const resources = (() => {
  let loaded = false
  let data: ResourceDB = {
    resources: {},
    typeIndex: Object.keys(ResourceType).reduce(
      (prev, key) => ({ ...prev, [key]: {} }),
      {} as ResourceDB['typeIndex'],
    ),
  }

  return {
    async load() {
      data = await parseResources({
        path: settingsApi.setting('path'),
        indexes: settingsApi.setting('indexes'),
      })
      loaded = true
    },

    resourceForId<M = {}>(id: string): Resource<M> {
      return data.resources[id] as Resource<M>
    },
    resourcesForIds(ids: string[]): Resource[] {
      return ids.map(this.resourceForId)
    },
    resourceTypes(): ResourceType[] {
      return Object.keys(data.typeIndex) as ResourceType[]
    },
    resourcesForType(type: ResourceType): Resource[] {
      return this.resourcesForIds(data.typeIndex[type])
    },
    loaded() {
      return loaded
    },
  }
})()

export const setupResourcesIPC = () => {
  ipcMain.handle('resources:load', _ => resources.load())
  ipcMain.handle('resources:resourceForId', (_, id: string) =>
    resources.resourceForId(id),
  )
  ipcMain.handle('resources:resourcesForIds', (_, ids: string[]) =>
    resources.resourcesForIds(ids),
  )
  ipcMain.handle('resources:resourceTypes', () => resources.resourceTypes())
  ipcMain.handle('resources:resourcesForType', (_, type: ResourceType) =>
    resources.resourcesForType(type),
  )
}
