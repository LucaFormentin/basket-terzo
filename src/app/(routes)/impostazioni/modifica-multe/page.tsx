import { Container } from '@mui/material'
import FinesManager from '@/components/Settings/FinesManager'

const ModificaMultePage = async () => {
  return (
    <Container maxWidth='xl' sx={{ my: 1, height: '100%' }}>
      <h1 className='text-3xl font-semibold'>Gestisci Multe</h1>
      <FinesManager />
    </Container>
  )
}

export default ModificaMultePage
