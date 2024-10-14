'use client'

import { FirebaseFine } from '@/types/fine'
import React from 'react'
import './fines-manager.css'
import { api } from '@/lib/api-client'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import NoFinesFound from './NoFinesFound'
import FinesList from './FinesList'

type Props = {
  initialFines: FirebaseFine[] // initial data from server
}

const FinesManager = ({ initialFines }: Props) => {
  const queryClient = useQueryClient()
  const { status, data, error } = useQuery<{ finesList: FirebaseFine[] }>({
    queryKey: ['fines'],
    queryFn: () => api.get('/fines/get-all'),
    initialData: { finesList: initialFines },
  })

  const revalidateQuery = () => {
    queryClient.invalidateQueries({
      queryKey: ['fines'],
    })
  }

  const renderStatusFeedback = () => {
    // no pending status because initial data is provided
    switch (status) {
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

    return (
      <FinesList
        fines={finesList}
        onAddNewFine={revalidateQuery}
        onFineDeleted={revalidateQuery}
      />
    )
  }

  return (
    <>
      {renderStatusFeedback()}
      {renderFinesList(data?.finesList)}
    </>
  )
}

export default FinesManager
