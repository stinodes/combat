import { configureStore } from '@reduxjs/toolkit'
import { useDispatch } from 'react-redux'
import { resourceReducer } from './resources/redux'

export const store = configureStore({ reducer: { resources: resourceReducer } })

export type AppState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export const useAppDispatch = () => useDispatch<AppDispatch>()
