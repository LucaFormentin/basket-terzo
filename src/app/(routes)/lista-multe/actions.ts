import { File } from '@/lib/classes/FileHandler'
import { getFirebaseEntries, pushDataToFirebase } from '@/lib/firebase/services'
import { finesListFilePath, playersListFilePath } from '@/lib/routes'
import { generateRandomStr } from '@/lib/utils/helpers'
import { type BaseFine } from '@/types/fine'
import type { PlayerInfo, BasePlayer, FirebasePlayer } from '@/types/player'

const getPlayers = async (): Promise<BasePlayer[] | null> => {
  const playersListFile = new File(playersListFilePath)
  const players: BasePlayer[] = (await playersListFile.read()) as any[]

  return players
}

export const getFines = async (): Promise<BaseFine[] | null> => {
  const finesListFile = new File(finesListFilePath)
  const fines: BaseFine[] = (await finesListFile.read()) as any[]

  return fines
}

const createPlayer = (playerName: string): FirebasePlayer => ({
  _id: generateRandomStr(16),
  player: playerName,
  finesList: [],
})

const initPlayersInFirebase = (players: BasePlayer[]) => {
  players.forEach(async (player) => {
    let newPlayer = createPlayer(`${player.lastName}_${player.number}`)
    await pushDataToFirebase(newPlayer)
  })
}

export const getPlayersInfo = async (): Promise<PlayerInfo[] | null> => {
  const players = await getPlayers()

  if (!players) return null

  let fbEntries = (await getFirebaseEntries()) as FirebasePlayer[]

  if (!fbEntries || fbEntries.length === 0) {
    initPlayersInFirebase(players)
  }

  fbEntries = (await getFirebaseEntries()) as FirebasePlayer[]

  return players.map((player) => {
    let playerIdentifier = `${player.lastName}_${player.number}`
    let playerInDb = fbEntries.find((entry) => entry.player === playerIdentifier)

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
