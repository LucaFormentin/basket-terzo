import { CashC, FineC, PlayerC, PlayerFinesC } from '@/lib/firebase/FirebaseUtils'

// API per testare l'utilizzo di classi in JavaSscript
export async function GET(request: Request) {
  const playerCollection = new PlayerC()
  const fineCollection = new FineC()
  const cashCollection = new CashC()

  const players = await playerCollection.getPlayer()
  // const f = await fineCollection.getFines()

  // hardcoded player key
  const player = new PlayerFinesC('-O7hPdrm19gd0qSBivJM')
  const playerFinesList = await player.getPlayerFinesList()

  const cashFlow = await cashCollection.getCashFlow()

  const output = {
    cFlow: cashFlow
  }

  return Response.json({ data: output })
}
