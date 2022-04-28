import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { dnd } from '../../../types/resource'
import { AppState } from '../../store'

const LOCAL_STORAGE_KEY = 'resource-dir'

type ResourceState = {
  pending: boolean
  resourcePath: string
  data: null | dnd.ResourceDB
}

const initialState: ResourceState = {
  resourcePath: localStorage.getItem(LOCAL_STORAGE_KEY) || '',
  pending: false,
  data: null,
}

export const setResourcePath = createAsyncThunk(
  'resources/path',
  (path: string) => {
    localStorage.setItem(LOCAL_STORAGE_KEY, path)
    return path
  },
)

export const readResources = createAsyncThunk<
  dnd.ResourceDB,
  void,
  { state: AppState }
>('resources/read-resources', async (_, { getState }) => {
  const path = resourcePathSelector(getState())
  const resources = await window.api.parseResources(path)
  return resources
})

const slice = createSlice({
  name: 'resources',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(setResourcePath.fulfilled, (state, action) => {
      state.resourcePath = action.payload
    })
    builder.addCase(readResources.pending, state => {
      state.pending = true
    })
    builder.addCase(readResources.fulfilled, (state, action) => {
      state.pending = false
      state.data = action.payload
    })
  },
})

export const resourceSelector = (state: AppState): ResourceState =>
  state.resources
export const resourcesPendingSelector = (state: AppState): boolean =>
  resourceSelector(state).pending
export const resourcePathSelector = (state: AppState): string =>
  resourceSelector(state).resourcePath
export const resourceTypesSelector = (state: AppState): dnd.ResourceType[] => {
  const index = resourceSelector(state).data?.typeIndex
  if (!index) return []
  return Object.keys(index) as dnd.ResourceType[]
}

export const resourcesByTypeSelector =
  (type: dnd.ResourceType) =>
  (state: AppState): { [id: dnd.ID]: dnd.Resource } => {
    const ids = resourceSelector(state).data?.typeIndex[type]
    const resources = resourceSelector(state).data?.resources
    if (!resources || !ids) return {}
    return ids.reduce((prev, id) => {
      prev[id] = resources[id]
      return prev
    }, {} as { [id: dnd.ID]: dnd.Resource })
  }

export const resourceByIdSelector = (id: null | dnd.ID) => (state: AppState) =>
  !id ? null : resourceSelector(state).data?.resources[id]

export const resourcesByIdSelector = (ids: dnd.ID[]) => (state: AppState) =>
  ids.map(id => resourceByIdSelector(id)(state))

export const resourceReducer = slice.reducer
