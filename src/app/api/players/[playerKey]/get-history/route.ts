import { PlayerFinesC } from "@/lib/classes/Player"

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
  { params }: { params: Promise<{ playerKey: string }> }
) {
  const { playerKey: playerFirebaseKey } = await params

  const playerFinesC = new PlayerFinesC(playerFirebaseKey)
  const playerFines = await playerFinesC.getPlayerFinesList()

  return Response.json({ data: playerFines || [] })
}
