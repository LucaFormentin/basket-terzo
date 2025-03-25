import { CashC, FineC, PlayerFinesC } from '@/lib/firebase/FirebaseUtils'
import { generateRandomStr } from '@/lib/utils/helpers'
import type { PlayerFine } from '@/types/fine'
import moment from 'moment'

const createNewFine = async (fineId: string): Promise<PlayerFine> => {
  const finesC = new FineC()
  const finesData = await finesC.getFines()

  const fine = finesData.find((fine) => fine.fineId === fineId)

  if (!fine) throw new Error('Multa non trovata')

  const { key, ...fineData } = fine
  let date = moment(new Date().toISOString()).format('YYYY-MM-DD')

  let newFine: PlayerFine = {
    ...fineData,
    date,
    paid: false,
    _id: generateRandomStr(16),
  }

  return newFine
}

/**
 * Handles the GET request for adding a fine to a player.
 *
 * @param request - The request object.
 * @param params - The parameters object containing the player name.
 * @param params.player - The name of the player.
 * @returns A JSON response indicating that a new fine has been added.
 */
export async function GET(
  request: Request,
  { params }: { params: { playerKey: string } }
) {
  const playerFirebaseKey = params.playerKey
  const { searchParams } = new URL(request.url)
  const fineId = searchParams.get('fineId') as string

  const newFineToInsert = await createNewFine(fineId)

  // update player's fines list
  const playerFinesC = new PlayerFinesC(playerFirebaseKey)
  await playerFinesC.addFine(newFineToInsert)

  // update cash flow
  const newFineAmount = parseInt(newFineToInsert.penitence.split('€')[0])
  const cashC = new CashC()
  await cashC.updateOnFineAdd(newFineAmount)

  return Response.json({ data: 'Nuova multa aggiunta!' })
}
