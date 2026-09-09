'use client';
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#1976d2',
      light: '#63a4ff',
      dark: '#004ba0',
      contrastText: '#fff',
    },
  },
  typography: {
    fontFamily: "'Inter Variable', sans-serif",
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '1.5rem',
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: '1.5rem',
        },
      },
    },
    MuiBottomNavigationAction: {
      styleOverrides: {
        root: {
          borderRadius: '1.5rem',
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: ({ ownerState }) => ({
          ...(ownerState.severity === 'info' && {
            backgroundColor: '#60a5fa',
          }),
        }),
      },
    },
  },
});

export default theme;
