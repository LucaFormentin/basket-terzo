'use client'

import { type ReactNode } from 'react'

const ListaMulteLayout = ({
  children,
  modals,
}: {
  children: ReactNode
  modals: ReactNode
}) => {
  return (
    <section className='overflow-y-auto pb-20'>
      {children}
      {modals}
    </section>
  )
}

export default ListaMulteLayout
