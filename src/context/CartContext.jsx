// src/context/CartContext.jsx
import React, { createContext, useContext, useState, useCallback } from 'react'
import api from '../services/api'

const CartCtx = createContext()

export function CartProvider({ children }) {
  const [cartCount, setCartCount] = useState(0)
  const [adding, setAdding] = useState(false)

  // Fetch count from server (called after login or on mount if authenticated)
  const refreshCart = useCallback(async () => {
    try {
      const { data } = await api.get('/user/myCart')
      const items = data.cartData || []
      setCartCount(items.length)
    } catch {
      // Not authenticated or network error — silently reset
      setCartCount(0)
    }
  }, [])

  // Add to cart — returns { success, message }
  const addToCart = useCallback(async (productId, quantity = 1) => {
    setAdding(true)
    try {
      await api.post('/user/cart/add', { productId, quantity })
      setCartCount(prev => prev + 1)
      return { success: true, message: 'Added to cart!' }
    } catch (err) {
      const msg = err?.response?.data?.message || err?.response?.data || 'Failed to add to cart'
      return { success: false, message: typeof msg === 'string' ? msg : 'Failed to add to cart' }
    } finally {
      setAdding(false)
    }
  }, [])

  const clearCart = useCallback(() => setCartCount(0), [])

  return (
    <CartCtx.Provider value={{ cartCount, addToCart, refreshCart, clearCart, adding }}>
      {children}
    </CartCtx.Provider>
  )
}

export const useCart = () => useContext(CartCtx)
