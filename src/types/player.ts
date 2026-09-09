import { z } from "zod"
import { PlayerFineSchema, type PlayerFine } from "./fine"

export const PlayerBaseInfoSchema = z.object({
  number: z.number(),
  firstName: z.string(),
  lastName: z.string(),
})

export type PlayerBaseInfo = z.infer<typeof PlayerBaseInfoSchema>

export const PlayerFinesListSchema = z.preprocess(
  (value) => {
    if (value == null) return []
    if (Array.isArray(value)) return value.filter(Boolean)
    if (typeof value === 'object') return Object.values(value)
    return value
  },
  z.array(PlayerFineSchema)
)

const FirebasePlayerSchema = PlayerBaseInfoSchema.extend({
  key: z.string().nullable(),
  _id: z.string(),
  finesList: PlayerFinesListSchema,
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
