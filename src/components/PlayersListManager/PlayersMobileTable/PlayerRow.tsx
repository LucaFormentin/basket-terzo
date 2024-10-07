import { type PlayerInfo } from '@/types/player'
import { useEffect, useState } from 'react'
import PlayerInfoRow from './PlayerInfoRow'
import PlayerHistoryRow from './PlayerHistoryRow'
import { usePlayerCtx } from '@/app/context/PlayerContext'
import { api } from '@/lib/api-client'
import { FineDbListSchema } from '@/types/fine'

type Props = {
  playerInfo: PlayerInfo
}

const PlayerRow = (props: Props) => {
  const { playerStatus, updatePlayerStatus } = usePlayerCtx()
  const [pInfo, setPInfo] = useState<PlayerInfo>(props.playerInfo)
  const [openHistory, setOpenHistory] = useState(false)

  useEffect(() => {
    if (
      !playerStatus.firebaseKey ||
      playerStatus.firebaseKey !== pInfo.firebaseKey
    )
      return

    if (!playerStatus.isUpdated) {
      api
        .get(`/players/${playerStatus.firebaseKey}/get-history`)
        .then((res: any) => {
          let validatedRes = FineDbListSchema.safeParse(res.data)

          if (!validatedRes.success) return

          let finesList = validatedRes.data

          setPInfo((prevState) => ({
            ...prevState,
            totalFines: finesList.length,
            stillToPay: finesList.filter((fine) => !fine.paid).length,
          }))
        })

      updatePlayerStatus(playerStatus.firebaseKey, true)
    }
  }, [playerStatus])

  return (
    <div className='player-row'>
      <PlayerInfoRow
        info={pInfo}
        openHistory={openHistory}
        toggleHistoryRow={() => setOpenHistory(!openHistory)}
      />
      <PlayerHistoryRow
        openHistory={openHistory}
        playerFirebaseKey={pInfo.firebaseKey || ''}
      />
    </div>
  )
}

export default PlayerRow
