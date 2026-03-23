export const getThemeOptions = (mode) => ({
  palette: {
    mode,
    primary: {
      main: mode === 'light' ? '#0038A8' : '#4169E1', // Royal Blue
      dark: mode === 'light' ? '#002366' : '#2A4DA7',
      light: mode === 'light' ? '#4A7CFA' : '#6E8CF5',
      contrastText: '#ffffff',
    },
    secondary: {
      main: mode === 'light' ? '#FF8C00' : '#FFA500', // Premium Orange
      dark: mode === 'light' ? '#D97700' : '#CC8400',
      light: mode === 'light' ? '#FFA64D' : '#FFBD80',
      contrastText: mode === 'light' ? '#ffffff' : '#000000',
    },
    background: {
      default: mode === 'light' ? '#F6F7FB' : '#0F1111',
      paper: mode === 'light' ? '#FFFFFF' : '#1E1F1F',
    },
    text: {
      primary: mode === 'light' ? '#1B1B1B' : '#F5F5F5',
      secondary: mode === 'light' ? '#4A4F57' : '#B0B0B0',
    },
  },
  shape: { borderRadius: 10 },
  typography: {
    fontFamily: 'Inter, Poppins, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif',
    h5: { fontWeight: 700 },
    h6: { fontWeight: 700 },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: mode === 'light' ? '#0038A8' : '#1E1F1F',
          backgroundImage: 'none',
          boxShadow: mode === 'light' ? '0 2px 10px rgba(0,0,0,0.1)' : 'none',
          borderBottom: mode === 'dark' ? '1px solid #333' : 'none',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 8, padding: '8px 20px' },
        containedSecondary: {
            boxShadow: 'none',
            '&:hover': { boxShadow: '0 2px 8px rgba(255,140,0,0.4)' }
        }
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: mode === 'light' ? '0 4px 20px rgba(0,0,0,0.05)' : 'none',
          border: mode === 'dark' ? '1px solid #333' : 'none',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          backgroundColor: mode === 'light' ? '#FFFFFF' : '#2A2A2A',
        },
      },
    },
  },
});
