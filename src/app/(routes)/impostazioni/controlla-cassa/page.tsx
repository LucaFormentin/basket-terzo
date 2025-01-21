import CashFlowController from '@/components/Settings/CashFlowController'
import { Container } from '@mui/material'

const ControllaCassaPage = async () => {
  return (
    <Container maxWidth='xl' sx={{ my: 1, height: '100%' }}>
      <h1 className='text-3xl font-semibold'>La Cassa</h1>
      <CashFlowController />
    </Container>
  )
}

export default ControllaCassaPage
