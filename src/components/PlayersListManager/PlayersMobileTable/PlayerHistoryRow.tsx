import { useAppCtx } from "@/app/context/AppContext"
import { api } from "@/lib/api-client"
import { type FineDb } from "@/types/fine"
import { Collapse } from "@mui/material"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import PlayerHistoryTable from "./PlayerHistoryTable"

type Props = {
  openHistory: boolean
  playerFirebaseKey: string
}

const PlayerHistoryRow = (props: Props) => {
  const queryClient = useQueryClient()
  const { updatePlayerStatus } = useAppCtx()

  const { status, data, error } = useQuery<{ data: FineDb[] }>({
    queryKey: ['finesList', props.playerFirebaseKey],
    queryFn: () => api.get(`/players/${props.playerFirebaseKey}/get-history`),
    enabled: !!props.playerFirebaseKey && props.openHistory,
  })

  const convertToPaidFine = (fineObjId: string) => {
    api
      .get(`/players/${props.playerFirebaseKey}/convert-to-paid`, {
        params: { fineObjId },
      })
      .finally(() => {
        // invalidate query to refetch data in the history
        queryClient.invalidateQueries({
          queryKey: ['finesList', props.playerFirebaseKey],
        })

        // update player status to refetch data in the info row
        updatePlayerStatus(props.playerFirebaseKey, false)
      })
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

  const renderTable = (finesList: FineDb[] | [] = []) => {
    // render table only when data is fetched successfully or list is not empty
    if (status !== 'success' || finesList.length === 0) return

    return (
      <PlayerHistoryTable
        finesList={finesList}
        onConvertToPaidFine={convertToPaidFine}
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
