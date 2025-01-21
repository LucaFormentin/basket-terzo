'use client'

import { api } from '@/lib/api-client'
import { type CashFlowT } from '@/types/player'
import { SyncRounded } from '@mui/icons-material'
import { Button } from '@mui/material'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import Image from 'next/image'

const CashFlowController = () => {
  const queryClient = useQueryClient()

  const getCashFlow = async (): Promise<{ data: CashFlowT }> => {
    const res = (await api.get(`/cash/${Date.now()}/get-cash-flow`, {
      cache: 'no-store',
    })) as any
    return { data: res.data as CashFlowT }
  }

  const { status, data, error } = useQuery<{ data: CashFlowT }>({
    queryKey: ['cashFlow'],
    queryFn: () => getCashFlow(),
  })

  const refreshCashFlow = () => {
    queryClient.invalidateQueries({
      queryKey: ['cashFlow'],
    })
  }

  return (
    <>
      <div className='flex flex-col items-center justify-center'>
        <div className='bg-blue-950 rounded-3xl w-full my-4 p-4 flex flex-col gap-3 items-center justify-center'>
          <div className='flex items-center justify-center gap-3 w-full'>
            <div className='bg-blue-800/40 p-4 rounded-3xl w-full'>
              <p>Soldi mancanti:</p>
              <p className='font-semibold text-xl'>
                {data?.data.missing ?? '...'} €
              </p>
            </div>
            <div className='bg-blue-800/40 p-4 rounded-3xl w-full'>
              <p>Soldi incassati:</p>
              <p className='font-semibold text-xl'>
                {data?.data.collected ?? '...'} €
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
                {data?.data.total ?? '...'} €
              </p>
            </div>
          </div>
        </div>
      </div>
      <Button
        startIcon={<SyncRounded />}
        className='bg-green-800 text-white p-2 rounded-3xl w-full'
        onClick={() => refreshCashFlow()}
      >
        Aggiorna Cassa
      </Button>
    </>
  )
}

export default CashFlowController
