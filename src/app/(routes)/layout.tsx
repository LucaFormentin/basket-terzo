'use client'

import Footer from '@/components/Navigation/Footer'
import React from 'react'

const RoutesLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      {children}
      <Footer />
    </>
  )
}

export default RoutesLayout
