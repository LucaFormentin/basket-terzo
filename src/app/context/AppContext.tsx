'use client'

import { createContext, useContext, useReducer, type ReactNode } from 'react'
import {
  appCtxReducer,
  reducerInitialState,
  type ReducerStateType,
} from './appCtxReducer'

type AppContextType = ReducerStateType & {
  updatePlayerStatus: (firebaseKey: string, isUpdated: boolean) => void
}

const AppContext = createContext<AppContextType | null>(null)

export const useAppCtx = () => {
  const ctx = useContext(AppContext)

  if (!ctx) {
    throw new Error('useAppCtx must be used within a AppContextProvider')
  }

  return ctx
}

export const AppContextProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(appCtxReducer, reducerInitialState)

  const updatePlayer = (firebaseKey: string, isUpdated: boolean) => {
    dispatch({
      type: 'UPDATE_PLAYER_STATUS',
      payload: { firebaseKey, isUpdated },
    })
  }

  const ctxValue = {
    playerStatus: state.playerStatus,
    updatePlayerStatus: updatePlayer,
  }

  return <AppContext.Provider value={ctxValue}>{children}</AppContext.Provider>
}
