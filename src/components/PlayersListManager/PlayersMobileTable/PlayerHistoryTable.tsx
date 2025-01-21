import { useUserCtx } from '@/app/context/UserContext'
import { type PlayerFine } from '@/types/fine'
import { DeleteRounded, DoneRounded } from '@mui/icons-material'
import { Chip, IconButton } from '@mui/material'
import React from 'react'

type Props = {
  finesList: PlayerFine[]
  onConvertToPaidFine: (fineObjId: string) => void
  onDeleteFine: (fineObjId: string) => void
}

const PlayerHistoryTable = (props: Props) => {
  const { role } = useUserCtx()

  let finesList = props.finesList.sort((a, b) => {
    if (a.paid && !b.paid) return 1
    if (!a.paid && b.paid) return -1
    return 0
  })

  const renderList = () => {
    return finesList.map((fine) => {
      let paidStatusChip = fine.paid ? (
        <Chip label='Pagata' color='success' size='small' />
      ) : role === 'ADMIN' ? (
        <div className='flex w-full'>
          <Chip
            label='Da pagare'
            color='error'
            size='small'
            onDelete={() => props.onConvertToPaidFine(fine._id)}
            deleteIcon={<DoneRounded />}
          />
          <IconButton
            size='small'
            className='flex ml-auto'
            onClick={() => props.onDeleteFine(fine._id)}
          >
            <DeleteRounded />
          </IconButton>
        </div>
      ) : (
        <Chip label='Da pagare' color='error' size='small' />
      )

      return (
        <div key={fine._id} className='player-history-table-row'>
          <div className='tr-info'>
            <span>{fine.date}</span>
            <span>
              {fine.name} - {fine.penitence}
            </span>
          </div>
          <div className='paid-status-chip'>{paidStatusChip}</div>
        </div>
      )
    })
  }

  return <>{renderList()}</>
}

export default PlayerHistoryTable
