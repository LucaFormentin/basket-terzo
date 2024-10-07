import Settings from '@/components/Settings'
import Container from '@mui/material/Container'

export default async function ImpostazioniPage() {
  return (
    <Container maxWidth='xl' sx={{ my: 1, height: '100%' }}>
      <Settings />
    </Container>
  )
}
