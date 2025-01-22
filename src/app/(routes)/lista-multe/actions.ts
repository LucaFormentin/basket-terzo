import { FinesCollection } from '@/lib/classes/FineDB'
import { PlayersCollection } from '@/lib/classes/PlayerDB'
import { type FirebaseFine } from '@/types/fine'
import type { PlayerInfo } from '@/types/player'

/**
 * Retrieves a list of fines from the FinesCollection in FirebaseDB.
 *
 * @returns {Promise<FirebaseFine[]>} A promise that resolves to an array of FirebaseFine objects.
 */
export const getFines = async (): Promise<FirebaseFine[]> => {
  const finesCollection = new FinesCollection()
  const fines = await finesCollection.getEntries()

  return fines
}

export const getPlayersInfo = async (): Promise<PlayerInfo[] | null> => {
  const playersCollection = new PlayersCollection()
  const players = await playersCollection.getEntries()

  if (!players || players.length === 0) return null

  const playersData: PlayerInfo[] = players.map((player) => {   
    let finesCounter = player.finesList?.length || 0
    let stillToPay = player.finesList?.filter((fine) => !fine.paid).length || 0

    return {
      firebaseKey: player.key,
      firstName: player.firstName,
      lastName: player.lastName,
      number: player.number,
      totalFines: finesCounter,
      stillToPay
    }
  })

  return playersData
}