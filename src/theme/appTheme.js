import { createTheme } from '@mui/material/styles'

export const royal = {
  main: '#4169E1',      // Royal Blue
  dark: '#1F3AA6',
  light: '#6E8CF5',
  contrastText: '#ffffff'
}

export const accent = {
  main: '#FFB000',      // warm yellow/orange accent for CTAs
  dark: '#D99100',
  light: '#FFD166',
  contrastText: '#1b1b1b'
}

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: royal,
    secondary: accent,
    background: {
      default: '#f6f7fb',
      paper: '#ffffff'
    },
    text: {
      primary: '#1b1b1b',
      secondary: '#4a4f57'
    }
  },
  shape: { borderRadius: 10 },
  typography: {
    fontFamily: 'Inter, Poppins, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif',
    h5: { fontWeight: 700 },
    button: { textTransform: 'none', fontWeight: 600 }
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        colorPrimary: { backgroundColor: royal.main }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 8 }
      }
    },
    MuiCard: {
      styleOverrides: { root: { borderRadius: 12 } }
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: { backgroundColor: '#ffffff' }
      }
    },
  }
})

export default theme
