import { FirebaseFine } from '@/types/fine'
import React from 'react'
import AddNewFine from './AddNewFine'

type Props = {
  fines: FirebaseFine[]
  onAddNewFine: () => void
}

const FinesList = ({ fines, ...props }: Props) => {
  return (
    <div className='flex flex-col gap-10 mt-10'>
      <AddNewFine onFineCreated={props.onAddNewFine} />
      <ul className='fines-list'>
        {fines.map((fine) => (
          <li key={fine._id}>
            <p>{fine.name}</p>
            <p>{fine.penitence}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default FinesList
