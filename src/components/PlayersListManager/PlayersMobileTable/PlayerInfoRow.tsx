import { IconButton } from '@mui/material'
import {
  GavelRounded,
  KeyboardArrowDownRounded,
  KeyboardArrowUpRounded,
} from '@mui/icons-material'
import { type PlayerInfo } from '@/types/player'
import { usePlayerCtx } from '@/app/context/PlayerContext'
import { cn } from '@/lib/utils/helpers'
import Link from 'next/link'
import { useUserCtx } from '@/app/context/UserContext'

type Props = {
  info: PlayerInfo
  openHistory: boolean
  toggleHistoryRow: () => void
}

const PlayerInfoRow = ({ info, ...props }: Props) => {
  const { playerStatus } = usePlayerCtx()
  const { role } = useUserCtx()

  const stillToPaySpan = (
    <span className={cn(info.stillToPay > 0 ? 'bg-red-600' : 'bg-gray-700')}>
      {!playerStatus.isUpdated ? '...' : info.stillToPay}
    </span>
  )

  const paidSpan = (
    <span
      className={cn(
        info.totalFines - info.stillToPay > 0 ? 'bg-green-700' : 'bg-gray-700'
      )}
    >
      {info.totalFines - info.stillToPay}
    </span>
  )

  return (
    <div className='player-info-row'>
      <div>
        <IconButton size='small' onClick={props.toggleHistoryRow}>
          {props.openHistory ? (
            <KeyboardArrowUpRounded />
          ) : (
            <KeyboardArrowDownRounded />
          )}
        </IconButton>
      </div>
      <div className='player-number'>
        <img src={'/assets/jersey-circle.png'} alt={`${info.number}`} />
        <span>{info.number}</span>
      </div>
      <div className='player-name'>
        <span>{info.lastName}</span>
        <span>{info.firstName}</span>
      </div>
      <div className='player-fines'>
        {stillToPaySpan}
        {paidSpan}
      </div>
      {role === 'ADMIN' && (
        <IconButton
          LinkComponent={Link}
          href={`/lista-multe/aggiungi-multa?firebaseKey=${info.firebaseKey}`}
        >
          <GavelRounded />
        </IconButton>
      )}
    </div>
  )
}

export default PlayerInfoRow
