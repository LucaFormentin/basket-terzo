import { z } from "zod"
import { PlayerFineSchema, type PlayerFine } from "./fine"

export const PlayerBaseInfoSchema = z.object({
  number: z.number(),
  firstName: z.string(),
  lastName: z.string(),
})

export type PlayerBaseInfo = z.infer<typeof PlayerBaseInfoSchema>

const FirebasePlayerSchema = PlayerBaseInfoSchema.extend({
  key: z.string().nullable(),
  _id: z.string(),
  finesList: z.array(PlayerFineSchema).nullish(),
})

export const FirebasePlayerListSchema = z.array(FirebasePlayerSchema)
export type FirebasePlayer = z.infer<typeof FirebasePlayerSchema>

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