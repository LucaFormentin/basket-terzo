import { type FineDb } from "./fine"

export type BasePlayer = {
  number: string
  firstName: string
  lastName: string
}

export type FirebasePlayer = {
  key?: string
  _id: string
  player: string
  finesList: FineDb[]
}

export type PlayerInfo = BasePlayer & {
  totalFines: number
  stillToPay: number
  firebaseKey: string | null
}