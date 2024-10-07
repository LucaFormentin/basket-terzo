'use client'

import AnimatedWrapper from '@/components/AnimatedWrapper'
import Footer from '@/components/Navigation/Footer'
import React from 'react'

const RoutesLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <AnimatedWrapper>{children}</AnimatedWrapper>
      <Footer />
    </>
  )
}

export default RoutesLayout
