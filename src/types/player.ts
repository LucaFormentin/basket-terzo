import { type PlayerFine } from "./fine"

export type BasePlayer = {
  number: string
  firstName: string
  lastName: string
}

export type FirebasePlayer = {
  key?: string
  _id: string
  player: string
  finesList: PlayerFine[]
}

export type PlayerInfo = BasePlayer & {
  totalFines: number
  stillToPay: number
  firebaseKey: string | null
}

export type CashFlowT = {
  missingCash: number
  collectedCash: number
  totalCash: number
}