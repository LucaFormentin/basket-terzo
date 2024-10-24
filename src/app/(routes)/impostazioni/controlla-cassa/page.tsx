import CashFlowController from '@/components/Settings/CashFlowController'
import { getCashFlow } from '../../lista-multe/actions'
import { Container } from '@mui/material'

const ControllaCassaPage = async () => {
  const cashFlow = await getCashFlow()

  return (
    <Container maxWidth='xl' sx={{ my: 1, height: '100%' }}>
      <h1 className='text-3xl font-semibold'>La Cassa</h1>
      <CashFlowController initialCashFlow={cashFlow} />
    </Container>
  )
}

export default ControllaCassaPage
