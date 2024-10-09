import { child, get, push, ref, set, update } from 'firebase/database'
import { database } from './config'
import type { FirebasePlayer } from '@/types/player'
import { PlayerFine } from '@/types/fine'

export const getFirebaseEntries = async (): Promise<FirebasePlayer[]> => {
  const dbRef = ref(database, process.env.FIREBASE_DB_COLLECTION)
  const snapshot = await get(dbRef)

  if (!snapshot.exists()) return []

  const players = snapshot.val()

  return Object.entries(players).map(([key, value]) => ({
    ...(value as FirebasePlayer),
    key,
  })) as FirebasePlayer[]
}

export const pushDataToFirebase = async (data: any) => {
  const dbRef = ref(database, process.env.FIREBASE_DB_COLLECTION)
  const newDataRef = push(dbRef)
  await set(newDataRef, data)
}

export const updateFinesList = async (playerKey: string, newFine: PlayerFine) => {
  const playerRef = ref(
    database,
    `${process.env.FIREBASE_DB_COLLECTION}/${playerKey}`
  )

  try {
    const snapshot = await get(playerRef)

    if (!snapshot.exists()) return

    const playerData = snapshot.val()
    const currentFinesList = playerData.finesList || []
    const updatedFinesList = [...currentFinesList, newFine]

    await update(playerRef, { finesList: updatedFinesList })
  } catch (error) {
    throw new Error(`Error updating finesList: ${playerKey}`)
  }
}

export const getFinesListByKey = async (playerKey: string) => {
  const playerRef = ref(
    database,
    `${process.env.FIREBASE_DB_COLLECTION}/${playerKey}`
  )

  try {
    const snapshot = await get(playerRef)

    if (!snapshot.exists()) return null

    const playerData = snapshot.val()
    return playerData.finesList || []
  } catch (error) {
    throw new Error(`Error retrieving finesList: ${playerKey}`)
  }
}

export const convertToPaid = async (playerKey: string, fineObjId: string) => {
  const playerRef = ref(
    database,
    `${process.env.FIREBASE_DB_COLLECTION}/${playerKey}`
  )

  try {
    const snapshot = await get(playerRef)

    if (!snapshot.exists()) return

    const playerData = snapshot.val() as FirebasePlayer
    const finesList = playerData.finesList || []

    const fineIndex = finesList.findIndex((fine) => fine._id === fineObjId)

    if (fineIndex === -1) return

    finesList[fineIndex].paid = true
    await update(playerRef, { finesList })
  } catch (error) {
    throw new Error(`Error updating fine status: ${playerKey}`)
  }
}
