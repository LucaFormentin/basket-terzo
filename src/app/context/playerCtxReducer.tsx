export type ReducerStateType = {
  playerStatus: {
    firebaseKey: string | null
    isUpdated: boolean
  }
}

type ReducerActionType = {
  type: 'UPDATE_PLAYER_STATUS'
  payload?: any
}

export const reducerInitialState: ReducerStateType = {
  playerStatus: {
    firebaseKey: null,
    isUpdated: true,
  },
}

export const playerCtxReducer = (
  state: ReducerStateType,
  action: ReducerActionType
) => {
  switch (action.type) {
    case 'UPDATE_PLAYER_STATUS':
      let { firebaseKey, isUpdated } = action.payload

      return {
        playerStatus: { firebaseKey, isUpdated },
      }
    default:
      return state
  }
}
