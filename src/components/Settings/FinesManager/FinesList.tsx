import { FirebaseFine } from '@/types/fine'
import React from 'react'
import AddNewFine from './AddNewFine'
import { Collapse, List } from '@mui/material'
import { TransitionGroup } from 'react-transition-group'
import FineListItem from './FineListItem'

type Props = {
  fines: FirebaseFine[]
  onAddNewFine: () => void
  onFineDeleted: () => void
}

const FinesList = ({ fines, ...props }: Props) => {
  const sortedFines = fines.sort(
    ({ penitence: a }, { penitence: b }) =>
      parseInt(b.split('€')[0]) - parseInt(a.split('€')[0])
  )

  return (
    <div className='flex flex-col gap-5 mt-5'>
      <AddNewFine onFineCreated={props.onAddNewFine} />
      <List>
        <TransitionGroup className='fines-list'>
          {sortedFines.map((fine) => (
            <Collapse key={fine.fineId}>
              <FineListItem fine={fine} onDelete={props.onFineDeleted} />
            </Collapse>
          ))}
        </TransitionGroup>
      </List>
    </div>
  )
}

export default FinesList
