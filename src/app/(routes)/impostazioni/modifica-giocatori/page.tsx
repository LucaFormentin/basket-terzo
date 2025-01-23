import PlayersManager from '@/components/Settings/PlayersManager'
import { PlayersCollection } from '@/lib/classes/PlayerDB'
import { Container } from '@mui/material'

const ModificaGiocatoriPage = async () => {
  const playersCollection = new PlayersCollection()
  const playersEntries = await playersCollection.getEntries()

  if (!playersEntries || playersEntries.length === 0)
    return <p>Crea nuovo giocatore</p>

  return (
    <Container maxWidth='xl' sx={{ my: 1, height: '100%' }}>
      <h1 className='text-3xl font-semibold'>Gestisci Giocatori</h1>
      <PlayersManager initialPlayers={playersEntries} />
    </Container>
  )
}

export default ModificaGiocatoriPage
