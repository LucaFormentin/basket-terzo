import { z } from "zod"

export type BaseFine = {
  fineId: string
  name: string
  penitence: string
}

export type FineDb = BaseFine & {
  date: string
  paid: boolean
  _id: string
}

export type FirebaseFine = {
  key?: string
  _id: string
  name: string
  penitence: string
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