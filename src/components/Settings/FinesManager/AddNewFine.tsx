import { api } from '@/lib/api-client'
import { Collapse } from '@mui/material'
import { useForm } from '@tanstack/react-form'
import React, { useState } from 'react'
import toast from 'react-hot-toast'

type Props = {
  onFineCreated: () => void
}

const AddNewFine = (props: Props) => {
  const [isFormOpen, setIsFormOpen] = useState(false)

  const form = useForm({
    defaultValues: {
      name: '',
      penitence: '',
    },
    onSubmit: async (formData) => {
      try {
        api.post('/fines/create', formData.value).finally(() => {
          toast.success('Multa creata!')
          setIsFormOpen(false)

          // revalidate fines list query
          props.onFineCreated()
        })
      } catch (error) {
        toast.error('Errore nella creazione della multa')
      }
    },
  })

  return (
    <div className='flex flex-col gap-2 items-center justify-center'>
      <button
        className='bg-blue-800 rounded-3xl p-4'
        onClick={() => setIsFormOpen(!isFormOpen)}
      >
        Aggiungi multa
      </button>
      <Collapse in={isFormOpen} timeout='auto' unmountOnExit>
        <div className='panel-container'>
          <span>Inserisci i dati della multa</span>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              e.stopPropagation()
              void form.handleSubmit()
            }}
          >
            <form.Field
              name='name'
              children={(field) => (
                <input
                  type='text'
                  placeholder='Nome multa'
                  name={field.name}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  required
                />
              )}
            />
            <form.Field
              name='penitence'
              children={(field) => (
                <input
                  type='text'
                  placeholder='Penitenza'
                  name={field.name}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  required
                />
              )}
            />
            <form.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
              children={([canSubmit, isSubmitting]) => (
                <button id='submit-btn' type='submit' disabled={!canSubmit}>
                  {isSubmitting ? '...' : 'Crea'}
                </button>
              )}
            />
          </form>
        </div>
      </Collapse>
    </div>
  )
}

export default AddNewFine
