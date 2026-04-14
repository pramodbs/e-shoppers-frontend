// src/auth/ProtectedByRole.jsx
import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { canAccess } from './permissions'

// Paths that any authenticated user can access regardless of role
const OPEN_AUTH_PATHS = ['/cart', '/checkout']

export default function ProtectedByRole({ children }) {
  const { user } = useAuth()
  const location = useLocation()

  // Not logged in at all — always redirect to login with redirect param
  if (!user) return <Navigate to={`/login?redirect=${location.pathname}`} replace />

  const role = user.role || 'USER'

  // If this is a general authenticated path (cart, checkout), allow any role
  if (OPEN_AUTH_PATHS.includes(location.pathname)) {
    return children
  }

  // For role-restricted paths, verify the role has access
  const allowed = canAccess(role, location.pathname)

  // Not authorized for admin-specific route — redirect to home (not login, they ARE logged in)
  return allowed ? children : <Navigate to="/" replace />
}
