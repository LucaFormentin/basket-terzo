'use client'

import { type PlayerInfo } from '@/types/player'
import PlayersMobileTable from './PlayersMobileTable'

type Props = {
  playersData: PlayerInfo[]
}

const PlayersList = (props: Props) => {
  return <PlayersMobileTable playersData={props.playersData} />
}

export default PlayersList
