// src/App.jsx
import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Box } from '@mui/material'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import AdsList from './pages/ads/AdsList'
import OffersList from './pages/offers/OffersList'
import AnnouncementsList from './pages/announcements/AnnouncementsList'
import RulesList from './pages/rules/RulesList'
import CategoriesList from './pages/categories/CategoriesList'
import AdminOrders from './pages/orders/AdminOrders'
import AdminUsers from './pages/users/AdminUsers'
import DeliveryDashboard from './pages/delivery/DeliveryDashboard'
import Register from './pages/Register'
import AppHeader from './components/common/AppHeader'
import ProtectedByRole from './auth/ProtectedByRole'

export default function App(){
  return (
    <Box>
      <AppHeader />
      <Box p={2}>
        <Routes>
          {/* Public */}
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />

          {/* Role-aware protected routes */}
          <Route path='/admin'               element={<ProtectedByRole><Dashboard /></ProtectedByRole>} />
          <Route path='/admin/categories'    element={<ProtectedByRole><CategoriesList /></ProtectedByRole>} />
          <Route path='/admin/ads'           element={<ProtectedByRole><AdsList /></ProtectedByRole>} />
          <Route path='/admin/offers'        element={<ProtectedByRole><OffersList /></ProtectedByRole>} />
          <Route path='/admin/announcements' element={<ProtectedByRole><AnnouncementsList /></ProtectedByRole>} />
          <Route path='/admin/rules'         element={<ProtectedByRole><RulesList /></ProtectedByRole>} />
          <Route path='/admin/orders'        element={<ProtectedByRole><AdminOrders /></ProtectedByRole>} />
          <Route path='/admin/users'         element={<ProtectedByRole><AdminUsers /></ProtectedByRole>} />
          <Route path='/delivery'            element={<ProtectedByRole><DeliveryDashboard /></ProtectedByRole>} />

          <Route path='*' element={<Navigate to='/login' replace />} />
        </Routes>
      </Box>
    </Box>
  )
}
