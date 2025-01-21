'use client'

import { createContext, useContext, useReducer, type ReactNode } from 'react'
import {
  playerCtxReducer,
  reducerInitialState,
  type ReducerStateType,
} from './playerCtxReducer'

type PlayerContextType = ReducerStateType & {
  updatePlayerStatus: (firebaseKey: string, isUpdated: boolean) => void
}

const PlayerContext = createContext<PlayerContextType | null>(null)

export const usePlayerCtx = () => {
  const ctx = useContext(PlayerContext)

  if (!ctx) {
    throw new Error('usePlayerCtx must be used within a PlayerContextProvider')
  }

  return ctx
}

/**
 * 
 * @param param0 testiamo la documentazione JsDoc
 * @returns 
 */

export const PlayerContextProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(playerCtxReducer, reducerInitialState)

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

  return <PlayerContext.Provider value={ctxValue}>{children}</PlayerContext.Provider>
}
