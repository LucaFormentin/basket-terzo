import AddFineDialog from './AddFineDialog'
import { getFines } from '../../actions'

const AggiungiMultaPage = async () => {
  const finesList = await getFines()

  if (!finesList) return

  return <AddFineDialog finesList={finesList} />
}

export default AggiungiMultaPage
