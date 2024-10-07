'use client'

import React from 'react'

const ListaMulteLayout = ({
  children,
  modals,
}: {
  children: React.ReactNode
  modals: React.ReactNode
}) => {
  return (
    <>
      {children}
      {modals}
    </>
  )
}

export default ListaMulteLayout
