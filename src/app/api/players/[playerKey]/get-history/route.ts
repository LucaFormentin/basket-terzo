import { PlayersCollection } from '@/lib/classes/PlayerDB'

/**
 * Retrieves the list of fines for a specific player.
 *
 * @param request - The HTTP request object.
 * @param params - The parameters object containing the player name.
 * @param params.player - The name of the player.
 * @returns A JSON response containing the fines list of the player.
 */
export async function GET(
  request: Request,
  { params }: { params: { playerKey: string } }
) {
  const playerFirebaseKey = params.playerKey

  const playersCollection = new PlayersCollection()

  const playerFines = await playersCollection.getFinesListByKey(
    playerFirebaseKey
  )

  return Response.json({ data: playerFines || [] })
}
