import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { CssBaseline } from '@mui/material'
import App from './App'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import { AppThemeProvider } from './context/ThemeContext'
import { PrimeReactProvider } from 'primereact/api'
import 'primereact/resources/themes/lara-light-indigo/theme.css'
import 'primereact/resources/primereact.min.css'
import 'primeicons/primeicons.css'
import 'primeflex/primeflex.css'
import './styles/brand.css'

const root = createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <PrimeReactProvider>
        <AppThemeProvider>
          <AuthProvider>
            <CartProvider>
              <CssBaseline />
              <App />
            </CartProvider>
          </AuthProvider>
        </AppThemeProvider>
      </PrimeReactProvider>
    </BrowserRouter>
  </React.StrictMode>
)
