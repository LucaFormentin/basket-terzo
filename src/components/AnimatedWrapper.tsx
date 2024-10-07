'use client'

import { AnimatePresence } from 'framer-motion'
import React, { PropsWithChildren } from 'react'
import * as motion from 'framer-motion/client'
import { usePathname } from 'next/navigation'

/**
 * AnimatedWrapper component that wraps its children with a starting animation.
 * 
 * This component uses `AnimatePresence` and `motion.section` from Framer Motion
 * to animate every page based on the current pathname.
 * The `motion.section` component gets re-evaluated every time the pathname changes.
 * 
 */
const AnimatedWrapper = ({ children }: PropsWithChildren) => {
  const pathname = usePathname()

  return (
    <AnimatePresence mode='wait'>
      <motion.section
        key={pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className='h-[92vh] overflow-y-auto'
      >
        {children}
      </motion.section>
    </AnimatePresence>
  )
}

export default AnimatedWrapper
