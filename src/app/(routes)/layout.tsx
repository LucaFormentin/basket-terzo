'use client'

import Footer from '@/components/Navigation/Footer'
import useMiddleware from '@/hooks/useMiddleware'
import React from 'react'

const RoutesLayout = ({ children }: { children: React.ReactNode }) => {
  const canAccess = useMiddleware()

  if (!canAccess) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        Verifica accesso...
      </div>
    )
  }

  return (
    <>
      <section className='h-dvh overflow-y-auto pb-28'>{children}</section>
      <Footer />
    </>
  )
}

export default RoutesLayout
