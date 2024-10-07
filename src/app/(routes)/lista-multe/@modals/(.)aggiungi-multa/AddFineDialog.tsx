'use client'

import { usePlayerCtx } from '@/app/context/PlayerContext'
import { api } from '@/lib/api-client'
import { type BaseFine } from '@/types/fine'
import { CloseRounded } from '@mui/icons-material'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  IconButton,
  Radio,
  RadioGroup,
} from '@mui/material'
import { useRouter, useSearchParams } from 'next/navigation'
import { type ChangeEvent, useState } from 'react'
import './dialog.css'

type Props = {
  finesList: BaseFine[]
}

const AddFineDialog = ({ finesList }: Props) => {
  const { updatePlayerStatus } = usePlayerCtx()
  const router = useRouter()
  const params = useSearchParams()
  const [radioGroupValue, setRadioGroupValue] = useState<string | null>(null)

  const closeDialog = () => router.back()

  const handleChange = (e: ChangeEvent<HTMLInputElement>) =>
    setRadioGroupValue((e.target as HTMLInputElement).value)

  const selectFine = () => {
    let firebaseKey = params.get('firebaseKey')

    if (!firebaseKey) return

    try {
      api
        .get(`/players/${firebaseKey}/add-fine`, {
          params: { fineId: radioGroupValue },
        })
        .then(() => {
          updatePlayerStatus(firebaseKey, false)
          closeDialog()
        })
    } catch (error) {
      return
    }
  }

  return (
    <Dialog open onClose={closeDialog}>
      <div className='container'>
        <DialogTitle component={'div'} className='flex items-center'>
          <h6 className='text-xl'>Aggiungi multa</h6>
          <IconButton
            aria-label='close'
            onClick={closeDialog}
            className='ml-auto'
          >
            <CloseRounded />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <RadioGroup
            name='fines'
            value={radioGroupValue}
            onChange={handleChange}
          >
            {finesList.map((fine) => (
              <FormControlLabel
                key={fine.fineId}
                value={fine.fineId}
                label={fine.name}
                control={<Radio />}
              />
            ))}
          </RadioGroup>
        </DialogContent>
        <DialogActions id='actions'>
          <Button onClick={closeDialog}>Annulla</Button>
          <Button
            id='select-fine-btn'
            onClick={selectFine}
            disabled={!radioGroupValue}
          >
            Seleziona
          </Button>
        </DialogActions>
      </div>
    </Dialog>
  )
}

export default AddFineDialog
