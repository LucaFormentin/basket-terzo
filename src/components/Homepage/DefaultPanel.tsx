import { useUserCtx } from '@/app/context/UserContext'
import {
  AccessibilityRounded,
  AdminPanelSettingsRounded,
} from '@mui/icons-material'
import { Button } from '@mui/material'
import Link from 'next/link'
import React from 'react'
import * as motion from 'framer-motion/client'

type Props = {
  onAdminClick: () => void
}

const DefaultPanel = (props: Props) => {
  const { setRole } = useUserCtx()

  return (
    <motion.div
      className='panel-container'
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <span>Accedi come:</span>
      <Button
        endIcon={<AdminPanelSettingsRounded />}
        className='bg-blue-800 p-4 rounded-3xl w-3/4'
        onClick={props.onAdminClick}
      >
        <span className='capitalize text-base font-normal'>Admin</span>
      </Button>
      <Button
        component={Link}
        href='/lista-multe'
        endIcon={<AccessibilityRounded />}
        className='bg-blue-800 p-4 rounded-3xl w-3/4'
        onClick={() => setRole('GUEST')}
      >
        <span className='capitalize text-base font-normal'>Ospite</span>
      </Button>
    </motion.div>
  )
}

export default DefaultPanel
