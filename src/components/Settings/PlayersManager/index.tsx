'use client'

import { api } from '@/lib/api-client'
import { FirebasePlayer } from '@/types/player'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import React from 'react'
import PlayersList from './PlayersList'

type Props = {
  initialPlayers: FirebasePlayer[]
}

const PlayersManager = ({ initialPlayers }: Props) => {
  const queryClient = useQueryClient()
  const { status, data, error } = useQuery<{ data: any }>({
    queryKey: ['players'],
    queryFn: () => api.get('/players/get-all'),
    initialData: { data: initialPlayers },
  })

  const revalidateQuery = () => {
    queryClient.invalidateQueries({
      queryKey: ['players'],
    })
  }

  const renderPlayersList = (playersList: FirebasePlayer[] | [] = []) => {
    if (status !== 'success' || playersList.length === 0) return

    return <PlayersList list={playersList} onAddNewPlayer={revalidateQuery} />
  }

  return <>{renderPlayersList(data?.data)}</>
}

export default PlayersManager
