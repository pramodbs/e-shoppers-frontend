// src/auth/ProtectedByRole.jsx
import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { canAccess } from './permissions'

export default function ProtectedByRole({ children }){
  const { user } = useAuth()
  const location = useLocation()

  if (!user) return <Navigate to="/login" replace />

  const role = user.role || 'USER'
  const allowed = canAccess(role, location.pathname)

  return allowed ? children : <Navigate to="/login" replace />
}
