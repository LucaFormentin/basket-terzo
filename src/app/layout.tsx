import * as React from 'react'
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import theme from '@/style/theme'
import { Metadata } from 'next'
import { AppProvider } from './provider'
import { AppContextProvider } from './context/AppContext'
import './globals.css'
import { Inter } from 'next/font/google'
import { UserContextProvider } from './context/UserContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Basket Terzo App',
  description:
    'Applicazione per la gestione delle multe dei giocatori di basket.',
}

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <body className={inter.className}>
        <AppProvider>
          <AppRouterCacheProvider options={{ enableCssLayer: true }}>
            <ThemeProvider theme={theme}>
              <CssBaseline />
              <AppContextProvider>
                <UserContextProvider>{props.children}</UserContextProvider>
              </AppContextProvider>
            </ThemeProvider>
          </AppRouterCacheProvider>
        </AppProvider>
      </body>
    </html>
  )
}
