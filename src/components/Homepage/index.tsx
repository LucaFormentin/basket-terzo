'use client'

import Image from 'next/image'
import DefaultPanel from './DefaultPanel'
import { useState } from 'react'
import LoginPanel from './Auth/LoginPanel'
import './home-panels.css'
import { AnimatePresence } from 'framer-motion'

const Homepage = () => {
  const [showLoginPanel, setShowLoginPanel] = useState(false)

  return (
    <div className='grid content-center place-content-center min-h-screen gap-10'>
      <div className='flex flex-col items-center justify-center'>
        <Image
          src={'/assets/logo-lg.png'}
          alt='main-logo'
          width={256}
          height={256}
        />
        <h1 className='text-5xl font-bold text-center'>Basket Terzo</h1>
        <h1 className='text-base text-center'>Web App</h1>
      </div>
      <AnimatePresence mode='wait'>
        {showLoginPanel ? (
          <LoginPanel key='login-panel' onLoginExit={() => setShowLoginPanel(false)} />
        ) : (
          <DefaultPanel key='default-panel' onAdminClick={() => setShowLoginPanel(true)} />
        )}
      </AnimatePresence>
    </div>
  )
}

export default Homepage
