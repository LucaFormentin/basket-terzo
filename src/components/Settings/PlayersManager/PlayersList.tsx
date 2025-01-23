import { FirebasePlayer } from '@/types/player'
import { List } from '@mui/material'
import React from 'react'
import AddNewPlayer from './AddNewPlayer'

type Props = {
  list: FirebasePlayer[]
  onAddNewPlayer: () => void
}

const PlayersList = ({ list, ...props }: Props) => {
  const sortedPlayersByNumber = list.sort((a, b) => a.number - b.number)

  return (
    <div className='flex flex-col gap-5 mt-5'>
      <AddNewPlayer onPlayerCreated={props.onAddNewPlayer} />
      <List>
        {sortedPlayersByNumber.map((player) => (
          <p key={player._id}>{player.lastName}</p>
        ))}
      </List>
    </div>
  )
}

export default PlayersList
