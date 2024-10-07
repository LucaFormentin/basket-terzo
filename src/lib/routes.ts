import { GavelRounded, HomeRounded, SettingsRounded } from '@mui/icons-material'
import path from 'path'

export const ROUTES: {
  href: string
  label: string
  icon: React.ElementType
}[] = [
  {
    href: '/',
    label: 'Home',
    icon: HomeRounded,
  },
  {
    href: '/lista-multe',
    label: 'Multe',
    icon: GavelRounded,
  },
  {
    href: '/impostazioni',
    label: 'Impostazioni',
    icon: SettingsRounded,
  },
]

export const playersListFilePath = path.join(
  process.cwd(),
  'src/data',
  'players.json'
)

export const finesListFilePath = path.join(
  process.cwd(),
  'src/data',
  'fines.json'
)
