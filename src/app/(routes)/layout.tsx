'use client'

import Footer from '@/components/Navigation/Footer'
import { type ReactNode } from 'react'

const RoutesLayout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      {children}
      <Footer />
    </>
  )
}

export default RoutesLayout
