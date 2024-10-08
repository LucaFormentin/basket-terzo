'use client'

import { FirebaseFine } from '@/types/fine'
import React from 'react'
import './fines-manager.css'
import { api } from '@/lib/api-client'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import NoFinesFound from './NoFinesFound'
import FinesList from './FinesList'

const FinesManager = () => {
  const queryClient = useQueryClient()
  const { status, data, error } = useQuery<{ finesList: FirebaseFine[] }>({
    queryKey: ['fines'],
    queryFn: () => api.get('/fines/get-all'),
  })

  const revalidateQuery = () => {
    queryClient.invalidateQueries({
      queryKey: ['fines'],
    })
  }

  const renderStatusFeedback = () => {
    switch (status) {
      case 'pending':
        return <span>Caricamento...</span>
      case 'error':
        return <span>Errore: {error.message}</span>
      case 'success':
        let noFinesFound = !data.finesList || data.finesList.length === 0
        return noFinesFound ? (
          <NoFinesFound onAddNewFine={revalidateQuery} />
        ) : null
    }
  }

  const renderFinesList = (finesList: FirebaseFine[] | [] = []) => {
    if (status !== 'success' || finesList.length === 0) return

    return <FinesList fines={finesList} onAddNewFine={revalidateQuery} />
  }

  return (
    <>
      {renderStatusFeedback()}
      {renderFinesList(data?.finesList)}
    </>
  )
}

export default FinesManager
