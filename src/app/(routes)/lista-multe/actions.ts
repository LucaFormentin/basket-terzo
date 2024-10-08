import { File } from '@/lib/classes/FileHandler'
import { PlayersCollection } from '@/lib/classes/PlayerDB'
import { finesListFilePath, playersListFilePath } from '@/lib/routes'
import { type BaseFine } from '@/types/fine'
import type { PlayerInfo, BasePlayer } from '@/types/player'

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
