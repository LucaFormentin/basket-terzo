import { File } from '@/lib/classes/FileHandler'
import { PlayersCollection } from '@/lib/classes/PlayerDB'
import { finesListFilePath } from '@/lib/routes'
import { generateRandomStr } from '@/lib/utils/helpers'
import type { BaseFine, FineDb } from '@/types/fine'
import moment from 'moment'

const createNewFine = async (fineId: string): Promise<FineDb> => {
  const finesFile = new File(finesListFilePath)
  const finesData = (await finesFile.read()) as BaseFine[]

  const fine = finesData.find((fine) => fine.fineId === fineId)

  if (!fine) throw new Error('Multa non trovata')

  let date = moment(new Date().toISOString()).format('YYYY-MM-DD')
  let newFine: FineDb = {
    ...fine,
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

  const playersCollection = new PlayersCollection()
  await playersCollection.updateFinesList(playerFirebaseKey, newFineToInsert)

  return Response.json({ data: 'Nuova multa aggiunta!' })
}
