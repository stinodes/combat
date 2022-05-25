import { ipcMain } from 'electron'
import Store from 'electron-store'
import { Resource, ResourceDB, ResourceType } from '../../types/dnd'
import { settingsApi } from '../settings'
import { parseResources } from './parse'

const store = new Store()

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
    async load(reload: boolean) {
      console.log(reload, settingsApi.setting('autoReload'))
      if (reload || settingsApi.setting('autoReload')) {
        data = await parseResources({
          path: settingsApi.setting('path'),
          indexes: settingsApi.setting('indexes'),
        })

        store.set('resources', data)
      }

      const storeContent = store.get('resources', data) as void | ResourceDB
      if (storeContent) data = storeContent

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
  ipcMain.handle('resources:load', (_, force: boolean) => resources.load(force))
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
