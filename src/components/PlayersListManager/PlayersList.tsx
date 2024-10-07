'use client'

import { type PlayerInfo } from '@/types/player'
import PlayersMobileTable from './PlayersMobileTable'
import useMiddleware from '@/hooks/useMiddleware'

type Props = {
  playersData: PlayerInfo[]
}

const PlayersList = (props: Props) => {
  useMiddleware()

  return <PlayersMobileTable playersData={props.playersData} />
}

export default PlayersList
