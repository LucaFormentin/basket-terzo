import { Container } from '@mui/material'
import FinesManager from '@/components/Settings/FinesManager'
import { FinesCollection } from '@/lib/classes/FineDB'

const ModificaMultePage = async () => {
  const finesCollection = new FinesCollection()
  const fines = await finesCollection.getEntries()

  return (
    <Container maxWidth='xl' sx={{ my: 1, height: '100%' }}>
      <h1 className='text-3xl font-semibold'>Gestisci Multe</h1>
      <FinesManager initialFines={fines} />
    </Container>
  )
}

export default ModificaMultePage
