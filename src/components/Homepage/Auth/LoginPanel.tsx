import React from 'react'
import { AdminPanelSettingsRounded } from '@mui/icons-material'
import { useUserCtx } from '@/app/context/UserContext'
import { useRouter } from 'next/navigation'
import { useForm } from '@tanstack/react-form'
import { api } from '@/lib/api-client'
import * as motion from 'framer-motion/client'
import toast from 'react-hot-toast'

type Props = {
  onLoginExit: () => void
}

const LoginPanel = (props: Props) => {
  const { setRole } = useUserCtx()
  const router = useRouter()

  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    onSubmit: async (formData) => {
      setRole('ADMIN')
      router.push('/lista-multe')
      toast.success('Loggato come Admin!')
    },
    validators: {
      onSubmitAsync: async ({ value }) => {
        try {
          ;(await api.post('/auth/verify-user', {
            email: value.email,
            password: value.password,
          })) as Response

          return null
        } catch (error) {
          return {
            form: 'Invalid credentials',
            fields: {
              password: 'Password not match with credentials...',
            },
          }
        }
      },
    },
  })

  return (
    <motion.fieldset
      className='panel-container'
      initial={{ opacity: 0, y: 50, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1.0 }}
      exit={{ opacity: 0, y: -50, scale: 0.8 }}
      transition={{ duration: 0.3 }}
    >
      <legend className='mx-auto text-center'>
        <AdminPanelSettingsRounded sx={{ fontSize: 80, margin: 'auto' }} />
        <span>Accedi come ADMIN</span>
      </legend>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          void form.handleSubmit()
        }}
      >
        <form.Field
          name='email'
          children={(field) => (
            <input
              type='email'
              placeholder='Email'
              name={field.name}
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              required
            />
          )}
        />
        <form.Field
          name='password'
          children={(field) => (
            <input
              type='password'
              placeholder='Password'
              name={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              required
            />
          )}
        />
        <form.Subscribe
          selector={(state) => [state.errorMap]}
          children={([errorMap]) =>
            errorMap.onSubmit ? (
              <div>
                <em>Error: {errorMap.onSubmit.toString()}</em>
              </div>
            ) : null
          }
        />
        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
          children={([canSubmit, isSubmitting]) => (
            <button id='login-btn' type='submit' disabled={!canSubmit}>
              {isSubmitting ? '...' : 'Accedi'}
            </button>
          )}
        />
      </form>
      <p className='text-sm underline' onClick={props.onLoginExit}>
        Torna alla home
      </p>
    </motion.fieldset>
  )
}

export default LoginPanel
