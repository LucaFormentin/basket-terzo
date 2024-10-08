import AddNewFine from './AddNewFine'

type Props = {
  onAddNewFine: () => void
}

const NoFinesFound = (props: Props) => {
  return (
    <div className='flex flex-col items-center justify-center h-full gap-4'>
      <p>Nessuna multa trovata!</p>
      <AddNewFine onFineCreated={props.onAddNewFine} />
    </div>
  )
}

export default NoFinesFound
