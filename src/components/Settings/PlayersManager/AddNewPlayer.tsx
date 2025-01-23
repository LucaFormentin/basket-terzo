import { api } from '@/lib/api-client'
import { PlayerBaseInfoSchema } from '@/types/player'
import { Collapse } from '@mui/material'
import { useForm } from '@tanstack/react-form'
import { useState } from 'react'
import toast from 'react-hot-toast'

type Props = {
  onPlayerCreated: () => void
}

const AddNewPlayer = (props: Props) => {
  const [isFormOpen, setIsFormOpen] = useState(false)

  const playerCreactionForm = useForm({
    defaultValues: {
      firstName: '',
      lastName: '',
      number: 0,
    },
    onSubmit: async (formData) => {
      try {
        const parsedData = PlayerBaseInfoSchema.safeParse(formData.value)

        if (!parsedData.success) throw new Error('Invalid form data')

        api.post('/players/create-new', formData.value).finally(() => {
          toast.success('Giocatore creato!')
          setIsFormOpen(false)
          playerCreactionForm.reset()

          // revalidate players list query
          props.onPlayerCreated()
        })
      } catch (error) {
        toast.error('Errore nella creazione del giocatore')
      }
    },
  })

  return (
    <div className='flex flex-col gap-2 items-center justify-center'>
      <button
        className='bg-blue-800 rounded-3xl p-2'
        onClick={() => setIsFormOpen(!isFormOpen)}
      >
        Crea giocatore
      </button>
      <Collapse in={isFormOpen} timeout='auto' unmountOnExit>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            void playerCreactionForm.handleSubmit()
          }}
        >
          <playerCreactionForm.Field
            name='firstName'
            children={(field) => (
              <input
                type='text'
                placeholder='Nome'
                name={field.name}
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                required
              />
            )}
          />
          <playerCreactionForm.Field
            name='lastName'
            children={(field) => (
              <input
                type='text'
                placeholder='Cognome'
                name={field.name}
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                required
              />
            )}
          />
          <playerCreactionForm.Field
            name='number'
            children={(field) => (
              <input
                type='number'
                placeholder='Numero'
                name={field.name}
                value={field.state.value}
                onChange={(e) => field.handleChange(parseInt(e.target.value))}
                required
              />
            )}
          />
          <playerCreactionForm.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting]}
            children={([canSubmit, isSubmitting]) => (
              <button id='submit-btn' type='submit' disabled={!canSubmit}>
                {isSubmitting ? '...' : 'Crea'}
              </button>
            )}
          />
        </form>
      </Collapse>
    </div>
  )
}

export default AddNewPlayer
