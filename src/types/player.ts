import { z } from "zod"
import { type PlayerFine } from "./fine"

export const PlayerBaseInfoSchema = z.object({
  number: z.number(),
  firstName: z.string(),
  lastName: z.string(),
})

export type PlayerBaseInfo = z.infer<typeof PlayerBaseInfoSchema>

export type FirebasePlayer = PlayerBaseInfo & {
  key: string | null
  _id: string
  finesList: PlayerFine[]
}

export type PlayerInfo = PlayerBaseInfo & {
  totalFines: number
  stillToPay: number
  firebaseKey: string | null
}

export type CashFlowT = {
  missing: number
  collected: number
  total: number
}