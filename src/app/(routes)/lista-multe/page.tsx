import Container from '@mui/material/Container'
import { getPlayersInfo } from './actions'
import PlayersList from '@/components/PlayersListManager/PlayersList'
import { AnimatePresence } from 'framer-motion'

export default async function ListMultePage() {
  const playersData = await getPlayersInfo()

  if (!playersData) return <p>Nessun giocatore trovato!</p>

  return (
    <AnimatePresence mode='wait'>
      <Container maxWidth='xl' sx={{ my: 1 }}>
        <PlayersList playersData={playersData} />
      </Container>
    </AnimatePresence>
  )
}
