import { z } from "zod"

export type FirebaseFine = {
  key?: string
  fineId: string
  name: string
  penitence: string
}

export type PlayerFine = FirebaseFine & {
  date: string
  paid: boolean
  _id: string
}

const FineDbSchema = z.object({
  _id: z.string(),
  fineId: z.string(),
  name: z.string(),
  penitence: z.string(),
  date: z.string(),
  paid: z.boolean(),
})

export const FineDbListSchema = z.array(FineDbSchema)