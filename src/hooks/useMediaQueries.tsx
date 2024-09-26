import { useMediaQuery, useTheme } from '@mui/material'

/**
 * Custom hook that provides media query functionality and actions for mobile devices.
 * @returns An object containing the following properties:
 *   - isMobile: A boolean indicating whether the current device is a mobile device.
 */
const useMediaQueries = () => {
  const theme = useTheme()
  const { breakpoints } = theme

  const isMobile = useMediaQuery(breakpoints.down('sm'))

  return { isMobile }
}

export default useMediaQueries
