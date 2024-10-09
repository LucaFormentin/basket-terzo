import { FirebaseFine } from '@/types/fine'
import React from 'react'
import AddNewFine from './AddNewFine'

type Props = {
  fines: FirebaseFine[]
  onAddNewFine: () => void
}

const FinesList = ({ fines, ...props }: Props) => {
  return (
    <div className='flex flex-col gap-5 mt-5'>
      <AddNewFine onFineCreated={props.onAddNewFine} />
      <ul className='fines-list'>
        {fines.map((fine) => (
          <li key={fine.fineId}>
            <p>{fine.name}</p>
            <p>{fine.penitence}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default FinesList
