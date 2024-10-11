import { FirebaseFine } from '@/types/fine'
import React, { useEffect, useState } from 'react'
import AddNewFine from './AddNewFine'
import { Collapse, List } from '@mui/material'
import { TransitionGroup } from 'react-transition-group'
import { DeleteRounded } from '@mui/icons-material'
import * as motion from 'framer-motion/client'
import { useMotionValue, useTransform } from 'framer-motion'
import { cn } from '@/lib/utils/helpers'
import { api } from '@/lib/api-client'
import toast from 'react-hot-toast'

type Props = {
  fines: FirebaseFine[]
  onAddNewFine: () => void
  onFineDeleted: () => void
}

type FineItemProps = {
  fine: FirebaseFine
  onDelete: () => void
}

const MAX_DELETE_DRAG = 70

const FineItem = ({ fine, onDelete }: FineItemProps) => {
  const [dragDistance, setDragDistance] = useState(0)
  const x = useMotionValue(0)
  const xInput = [-200, -100, 0]
  const deleteBtnBg = useTransform(x, xInput, ['#ff0000', '#aa1111', '#551111'])
  const deleteBtnScale = useTransform(x, xInput, [1.5, 1.2, 1.0])

  useEffect(() => {
    if (dragDistance < -MAX_DELETE_DRAG) {
      handleDragEnd()
    }
  }, [dragDistance])

  const handleDragEnd = async () => {
    try {
      const res = await api.get(`/fines/${fine.fineId}/delete`) as { data: string }
      toast.success(res.data)

      onDelete()
    } catch (error) {
      toast.error('Impossible eliminare la multa...')
      return
    }
  }

  return (
    <li key={fine.fineId} className='relative'>
      <motion.div
        style={{ x: x as any }}
        drag='x'
        dragConstraints={{ left: 0, right: 0 }}
        onDrag={(_, info) => setDragDistance(info.point.x)}
        onDragEnd={(_, info) => setDragDistance(info.point.x)}
        className='relative z-20 flex items-center bg-blue-950 border-2 rounded-3xl border-blue-800 px-4 p-1'
      >
        <div>
          <h3>{fine.name}</h3>
          <p>{fine.penitence}</p>
        </div>
      </motion.div>
      <motion.div
        className={cn(
          'absolute z-0  right-1 top-0 bottom-0',
          ' flex items-center justify-end my-auto px-4',
          'rounded-3xl w-[99%] h-full'
        )}
        style={{ background: deleteBtnBg as any }}
      >
        <motion.div style={{ scale: deleteBtnScale as any }}>
          <DeleteRounded />
        </motion.div>
      </motion.div>
    </li>
  )
}

const FinesList = ({ fines, ...props }: Props) => {
  return (
    <div className='flex flex-col gap-5 mt-5'>
      <AddNewFine onFineCreated={props.onAddNewFine} />
      <List>
        <TransitionGroup className='fines-list'>
          {fines.map((fine) => (
            <Collapse key={fine.fineId}>
              <FineItem fine={fine} onDelete={props.onFineDeleted} />
            </Collapse>
          ))}
        </TransitionGroup>
      </List>
    </div>
  )
}

export default FinesList
