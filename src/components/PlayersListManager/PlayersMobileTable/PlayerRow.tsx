import { type PlayerInfo } from '@/types/player'
import { useEffect, useState } from 'react'
import PlayerInfoRow from './PlayerInfoRow'
import PlayerHistoryRow from './PlayerHistoryRow'
import { usePlayerCtx } from '@/app/context/PlayerContext'
import { api } from '@/lib/api-client'
import { FineDbListSchema } from '@/types/fine'
import { useQuery, useQueryClient } from '@tanstack/react-query'

type Props = {
  playerInfo: PlayerInfo
}

const PlayerRow = (props: Props) => {
  const { playerStatus, updatePlayerStatus } = usePlayerCtx()
  const [openHistory, setOpenHistory] = useState(false)
  const queryClient = useQueryClient()

  const getPlayerInfo = async (): Promise<{ data: PlayerInfo }> => {
    const res = (await api.get(
      `/players/${props.playerInfo.firebaseKey}/get-history`
    )) as any

    let validatedRes = FineDbListSchema.safeParse(res.data)

    if (!validatedRes.success)
      throw new Error('Errore nella validazione dei dati.')

    let finesList = validatedRes.data

    let playerInfo = {
      ...props.playerInfo,
      totalFines: finesList.length,
      stillToPay: finesList.filter((fine) => !fine.paid).length,
    }

    return { data: playerInfo }
  }

  const { status, data, error } = useQuery<{ data: PlayerInfo }>({
    queryKey: ['playerInfo', props.playerInfo.firebaseKey],
    queryFn: () => getPlayerInfo(),
    enabled: !!props.playerInfo.firebaseKey,
  })

  useEffect(() => {
    if (
      !playerStatus.firebaseKey ||
      playerStatus.firebaseKey !== props.playerInfo.firebaseKey
    )
      return

    // update player info only if it's not already updated
    if (!playerStatus.isUpdated) {
      queryClient.invalidateQueries({
        queryKey: ['playerInfo', playerStatus.firebaseKey],
      })

      updatePlayerStatus(playerStatus.firebaseKey, true)
    }
  }, [playerStatus])

  if (status === 'pending') return <></>

  if (status === 'error')
    return <span className='text-red-700'>Errore: {error.message}</span>

  return (
    <div className='player-row'>
      <PlayerInfoRow
        info={data.data}
        openHistory={openHistory}
        toggleHistoryRow={() => setOpenHistory(!openHistory)}
      />
      <PlayerHistoryRow
        openHistory={openHistory}
        playerFirebaseKey={data.data.firebaseKey || ''}
      />
    </div>
  )
}

export default PlayerRow
