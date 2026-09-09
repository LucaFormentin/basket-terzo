import { usePlayerCtx } from "@/app/context/PlayerContext"
import { api } from "@/lib/api-client"
import { type PlayerFine } from "@/types/fine"
import { Collapse } from "@mui/material"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import toast from 'react-hot-toast'
import PlayerHistoryTable from "./PlayerHistoryTable"

type Props = {
  openHistory: boolean
  playerFirebaseKey: string
}

const PlayerHistoryRow = (props: Props) => {
  const queryClient = useQueryClient()
  const { updatePlayerStatus } = usePlayerCtx()

  const { status, data, error } = useQuery<{ data: PlayerFine[] }>({
    queryKey: ['finesList', props.playerFirebaseKey],
    queryFn: () => api.get(`/players/${props.playerFirebaseKey}/get-history`),
    enabled: !!props.playerFirebaseKey && props.openHistory,
  })

  const refreshPlayerData = async () => {
    updatePlayerStatus(props.playerFirebaseKey, false)

    try {
      await queryClient.invalidateQueries({
        queryKey: ['finesList', props.playerFirebaseKey],
      })
    } catch {
      toast.error('Operazione completata, ma i dati non sono stati aggiornati')
    }
  }

  const convertToPaidFine = async (fineObjId: string) => {
    try {
      await api.get(`/players/${props.playerFirebaseKey}/convert-to-paid`, {
        params: { fineObjId },
      })
    } catch {
      toast.error('Errore durante il pagamento della multa')
      return
    }

    toast.success('Multa segnata come pagata!')
    await refreshPlayerData()
  }

  const deleteFine = async (fineObjId: string) => {
    try {
      await api.get(`/players/${props.playerFirebaseKey}/delete-fine`, {
        params: { fineObjId },
      })
    } catch {
      toast.error('Errore durante l’eliminazione della multa')
      return
    }

    toast.success('Multa eliminata!')
    await refreshPlayerData()
  }

  const renderFeedback = () => {
    switch (status) {
      case 'pending':
        return <span>Caricamento...</span>
      case 'error':
        return <span>Errore: {error.message}</span>
      case 'success':
        return data.data.length === 0 && <span>Nessuna multa trovata!</span>
    }
  }

  const renderTable = (finesList: PlayerFine[] | [] = []) => {
    // render table only when data is fetched successfully or list is not empty
    if (status !== 'success' || finesList.length === 0) return

    return (
      <PlayerHistoryTable
        finesList={finesList}
        onConvertToPaidFine={convertToPaidFine}
        onDeleteFine={deleteFine}
      />
    )
  }

  return (
    <Collapse in={props.openHistory} timeout='auto' unmountOnExit>
      <div className='player-history'>
        <h6 className="text-sm font-bold">Cronologia</h6>
        {renderFeedback()}
        {renderTable(data?.data)}
      </div>
    </Collapse>
  )
}

export default PlayerHistoryRow
