import './mobileTable.css'
import { type PlayerInfo } from '@/types/player'
import PlayerRow from './PlayerRow'

type Props = {
  playersData: PlayerInfo[]
}

const PlayersMobileTable = ({ playersData }: Props) => {
  const playersRows = playersData.map((player, index) => (
    <PlayerRow key={index} playerInfo={player} />
  ))

  return <div className='players-list'>{playersRows}</div>
}

export default PlayersMobileTable
