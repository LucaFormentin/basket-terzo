'use client'

import useMiddleware from '@/hooks/useMiddleware'
import {
  GavelRounded,
  GroupRounded,
  KeyboardArrowRightRounded,
  PaidRounded,
} from '@mui/icons-material'
import React, { useEffect } from 'react'
import * as motion from 'framer-motion/client'
import Link from 'next/link'
import { cn } from '@/lib/utils/helpers'
import { useUserCtx } from '@/app/context/UserContext'

type MenuItemProps = {
  href: string
  label: string
  icon: React.ElementType
  color?: string
  disabled?: boolean
}

const MenuItem = (props: MenuItemProps) => {
  const [isAnimationStarted, setIsAnimationStarted] = React.useState(false)

  useEffect(() => {
    setIsAnimationStarted(false)
  }, [])

  return (
    <motion.div
      key={props.href}
      {...(isAnimationStarted && {
        initial: { x: 0 },
        animate: { x: 1000 },
        exit: { x: 1000 },
        transition: { duration: 0.5 },
        onAnimationComplete: () => setIsAnimationStarted(false),
      })}
      className={cn(props.disabled && 'pointer-events-none opacity-50')}
    >
      <Link
        className='border-2 border-blue-800 rounded-lg p-4 flex items-center'
        href={props.href}
        onClick={() => setIsAnimationStarted(true)}
      >
        <div className={cn('rounded-lg p-4', props.color ?? 'bg-blue-800')}>
          <props.icon />
        </div>
        <span className='ml-4 font-semibold text-lg'>{props.label}</span>
        <div className='ml-auto rounded-lg bg-blue-500 p-4'>
          <KeyboardArrowRightRounded />
        </div>
      </Link>
    </motion.div>
  )
}

const Settings = () => {
  // useMiddleware()
  const { role } = useUserCtx()

  return (
    <section className='w-full h-full flex flex-col gap-4'>
      {role === 'ADMIN' && (
        <>
          <MenuItem
            href='/impostazioni/modifica-multe'
            label='Gestisci Multe'
            icon={GavelRounded}
            color='bg-yellow-600'
          />
          <MenuItem
            href='/impostazioni/modifica-giocatori'
            label='Gestisci Giocatori'
            icon={GroupRounded}
            disabled
          />
        </>
      )}
      <MenuItem
        href='/impostazioni/controlla-cassa'
        label='Controlla Cassa'
        icon={PaidRounded}
        color='bg-green-600'
      />
    </section>
  )
}

export default Settings
