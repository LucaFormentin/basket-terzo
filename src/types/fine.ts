import { z } from "zod"

const FirebaseFineSchema = z.object({
  key: z.string().optional(),
  fineId: z.string(),
  name: z.string(),
  penitence: z.string(),
})

export const FirebaseFineListSchema = z.array(FirebaseFineSchema)

export const PlayerFineSchema = FirebaseFineSchema.extend({
  date: z.string(),
  paid: z.boolean(),
  _id: z.string(),
})

export type FirebaseFine = z.infer<typeof FirebaseFineSchema>

export type PlayerFine = z.infer<typeof PlayerFineSchema>

const FineDbSchema = z.object({
  _id: z.string(),
  fineId: z.string(),
  name: z.string(),
  penitence: z.string(),
  date: z.string(),
  paid: z.boolean(),
})

export const FineDbListSchema = z.array(FineDbSchema)