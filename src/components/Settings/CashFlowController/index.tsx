'use client'

import { usePlayerCtx } from '@/app/context/PlayerContext'
import { api } from '@/lib/api-client'
import { CashFlowT } from '@/types/player'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import Image from 'next/image'
import { useEffect } from 'react'

type Props = {
  initialCashFlow: CashFlowT
}

const CashFlowController = (props: Props) => {
  const { playerStatus } = usePlayerCtx()
  const queryClient = useQueryClient()
  const { status, data, error } = useQuery<{ data: CashFlowT }>({
    queryKey: ['cashFlow'],
    queryFn: () => api.get('/players/get-cash-flow'),
    initialData: { data: props.initialCashFlow },
    refetchOnMount: 'always',
  })

  useEffect(() => {
    if (!playerStatus.isUpdated) {
      queryClient.invalidateQueries({
        queryKey: ['cashFlow'],
      })
    }
  }, [playerStatus])

  return (
    <div className='flex flex-col items-center justify-center'>
      <div className='bg-blue-950 rounded-3xl w-full my-4 p-4 flex flex-col gap-3 items-center justify-center'>
        <div className='flex items-center justify-center gap-3 w-full'>
          <div className='bg-blue-800/40 p-4 rounded-3xl w-full'>
            <p>Soldi mancanti:</p>
            <p className='font-semibold text-xl'>
              {data?.data.missingCash ?? '...'} €
            </p>
          </div>
          <div className='bg-blue-800/40 p-4 rounded-3xl w-full'>
            <p>Soldi incassati:</p>
            <p className='font-semibold text-xl'>
              {data?.data?.collectedCash ?? '...'} €
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
            <p className='font-bold text-5xl'>
              {data?.data?.totalCash ?? '...'} €
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CashFlowController
