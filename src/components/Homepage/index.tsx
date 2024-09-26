import { ArrowForwardRounded } from '@mui/icons-material'
import { Box, Button } from '@mui/material'
import Image from 'next/image'
import Link from 'next/link'

type Props = {}

const Homepage = (props: Props) => {
  return (
    <div className='grid content-center place-content-center min-h-screen gap-20'>
      <div className='flex flex-col items-center justify-center'>
        <Image
          src={'/assets/logo-lg.png'}
          alt='main-logo'
          width={256}
          height={256}
        />
        <h1 className='text-5xl font-bold text-center'>Basket Terzo</h1>
        <h1 className='text-base text-center'>Web App</h1>
      </div>
      <Button
        component={Link}
        href='/lista-multe'
        endIcon={<ArrowForwardRounded />}
        className='w-3/4 mx-auto rounded ring-2 ring-blue-500 p-4 bg-blue-500/50 ring-offset-4 ring-offset-black'
      >
        Gestisci Multe
      </Button>
    </div>
  )
}

export default Homepage
