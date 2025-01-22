import { GavelRounded, HomeRounded, SettingsRounded } from '@mui/icons-material'

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