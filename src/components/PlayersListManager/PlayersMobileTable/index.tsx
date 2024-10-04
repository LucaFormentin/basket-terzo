import './mobileTable.css'
import { type PlayerInfo } from '@/types/player'
import PlayerRow from './PlayerRow'
import { motion } from 'framer-motion'

type Props = {
  playersData: PlayerInfo[]
}

const PlayersMobileTable = ({ playersData }: Props) => {
  const playersRows = playersData.map((player, index) => (
    <PlayerRow key={index} playerInfo={player} />
  ))

  return (
    <motion.section
      className='players-list'
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {playersRows}
    </motion.section>
  )
}

export default PlayersMobileTable
