import { File } from '@/lib/classes/FileHandler'
import { FinesCollection } from '@/lib/classes/FineDB'
import { PlayersCollection } from '@/lib/classes/PlayerDB'
import { playersListFilePath } from '@/lib/routes'
import { type FirebaseFine } from '@/types/fine'
import type { PlayerInfo, BasePlayer, CashFlowT } from '@/types/player'

const getPlayers = async (): Promise<BasePlayer[] | null> => {
  const playersListFile = new File(playersListFilePath)
  const players: BasePlayer[] = (await playersListFile.read()) as any[]

  return players
}

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

/**
 * Retrieves player information including fines data from the database.
 *
 * @returns {Promise<PlayerInfo[] | null>} A promise that resolves to an array of player information objects or null if no players are found.
 *
 * The function performs the following steps:
 * 1. Fetches the list of players using the `getPlayers` function.
 * 2. If no players are found, returns null.
 * 3. Initializes a new `PlayersCollection` instance.
 * 4. Retrieves entries from the `PlayersCollection`.
 * 5. If no entries are found, initializes the players in the collection.
 * 7. Maps the players to include fines data from the database.
 *
 * Each player object in the returned array includes also:
 * - `totalFines`: The total number of fines the player has.
 * - `stillToPay`: The number of fines that are still unpaid.
 * - `firebaseKey`: The key of the player entry in the database, or null if not found.
 */
export const getPlayersInfo = async (): Promise<PlayerInfo[] | null> => {
  const players = await getPlayers()

  if (!players) return null

  const playersCollection = new PlayersCollection()

  let fbEntries = await playersCollection.getEntries()

  if (!fbEntries || fbEntries.length === 0) {
    playersCollection.initPlayers(players)
  }

  fbEntries = await playersCollection.getEntries()

  return players.map((player) => {
    let playerIdentifier = `${player.lastName}_${player.number}`
    let playerInDb = fbEntries.find(
      (entry) => entry.player === playerIdentifier
    )

    let playerFinesCounter = playerInDb?.finesList?.length || 0
    let stillToPay =
      playerInDb?.finesList?.filter((fine) => !fine.paid).length || 0

    return {
      ...player,
      totalFines: playerFinesCounter,
      stillToPay,
      firebaseKey: playerInDb?.key || null,
    }
  }) as PlayerInfo[]
}

export const getCashFlow = async (): Promise<CashFlowT> => {
  const playersCollection = new PlayersCollection()
  const playersData = await playersCollection.getEntries()

  const cashFlow = playersData.reduce<CashFlowT>(
    (acc, player) => {
      if (!player.finesList) return acc

      player.finesList.forEach((fine) => {
        const fineAmount = parseInt(fine.penitence.split('€')[0])

        if (isNaN(fineAmount)) return

        if (fine.paid) {
          acc.collectedCash += fineAmount
        } else {
          acc.missingCash += fineAmount
        }

        acc.totalCash += fineAmount
      })

      return acc
    },
    { missingCash: 0, collectedCash: 0, totalCash: 0 }
  )

  return cashFlow
}
