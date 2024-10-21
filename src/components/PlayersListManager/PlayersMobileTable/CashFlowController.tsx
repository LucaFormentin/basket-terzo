import { type CashFlowT } from '@/app/api/players/get-cash-flow/route'
import { usePlayerCtx } from '@/app/context/PlayerContext'
import { api } from '@/lib/api-client'
import { Collapse } from '@mui/material'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import Image from 'next/image'
import { useEffect, useState } from 'react'

const CashFlowController = () => {
  const [isCollOpen, setIsCollOpen] = useState(false)
  const { playerStatus } = usePlayerCtx()

  const queryClient = useQueryClient()
  const { status, data, error } = useQuery<{ data: CashFlowT }>({
    queryKey: ['cashFlow'],
    queryFn: () => api.get('/players/get-cash-flow'),
  })

  useEffect(() => {
    if (isCollOpen || !playerStatus.isUpdated) {
      queryClient.invalidateQueries({
        queryKey: ['cashFlow'],
      })
    }
  }, [playerStatus, isCollOpen])

  const renderQueryRes = () => {
    switch (status) {
      case 'pending':
        return <span>Calcolando il flusso di cassa... Attendi...</span>
      case 'error':
        return <span>Errore: {error.message}</span>
      case 'success':
        return renderCashFlow()
    }
  }

  const renderCashFlow = () => {
    return (
      <>
        <div className='flex items-center justify-center gap-3 w-full'>
          <div className='bg-blue-800/40 p-4 rounded-3xl w-full'>
            <p>Soldi mancanti:</p>
            <p className='font-semibold text-xl'>{data?.data.missingCash} €</p>
          </div>
          <div className='bg-blue-800/40 p-4 rounded-3xl w-full'>
            <p>Soldi incassati:</p>
            <p className='font-semibold text-xl'>
              {data?.data.collectedCash} €
            </p>
          </div>
        </div>
        <div className='p-4 rounded-3xl w-full flex items-center justify-center gap-5 bg-blue-800'>
          <Image
            src={'/assets/earning.png'}
            alt='earnings'
            width={80}
            height={80}
          />
          <div>
            <p>Totale Cassa:</p>
            <p className='font-bold text-5xl'>{data?.data.totalCash} €</p>
          </div>
        </div>
      </>
    )
  }

  return (
    <div className='flex flex-col gap-2 items-center justify-center'>
      <button
        className='bg-blue-800 rounded-3xl p-4'
        onClick={() => setIsCollOpen(!isCollOpen)}
      >
        Controlla stato cassa
      </button>
      <Collapse in={isCollOpen} timeout={'auto'} sx={{ width: '100%' }}>
        <div className='bg-blue-950 rounded-3xl p-4 flex flex-col gap-3 items-center justify-center'>
          {renderQueryRes()}
        </div>
      </Collapse>
    </div>
  )
}

export default CashFlowController
