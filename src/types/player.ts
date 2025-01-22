import { type PlayerFine } from "./fine"

type BaseInfo = {
  number: number
  firstName: string
  lastName: string
}

export type FirebasePlayer = BaseInfo & {
  key: string
  _id: string
  finesList: PlayerFine[]
}

export type PlayerInfo = BaseInfo & {
  totalFines: number
  stillToPay: number
  firebaseKey: string | null
}

export type CashFlowT = {
  missing: number
  collected: number
  total: number
}