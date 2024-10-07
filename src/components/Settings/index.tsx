'use client'

import useMiddleware from '@/hooks/useMiddleware'
import {
  GavelRounded,
  GroupRounded,
  KeyboardArrowRightRounded,
} from '@mui/icons-material'
import React, { useEffect } from 'react'
import * as motion from 'framer-motion/client'
import Link from 'next/link'
import { cn } from '@/lib/utils/helpers'

type MenuItemProps = {
  href: string
  label: string
  icon: React.ElementType
  color?: string
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

  return (
    <section className='w-full h-full flex flex-col gap-4'>
      <MenuItem
        href='/impostazioni/modifica-multe'
        label='Modifica Multe'
        icon={GavelRounded}
        color='bg-yellow-600'
      />
      <MenuItem
        href='/impostazioni/modifica-giocatori'
        label='Modifica Giocatori'
        icon={GroupRounded}
      />
    </section>
  )
}

export default Settings
