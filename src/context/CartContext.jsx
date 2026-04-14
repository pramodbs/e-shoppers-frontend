// src/context/CartContext.jsx
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react'
import api from '../services/api'

const CartCtx = createContext()

export function CartProvider({ children }) {
  const [cartCount, setCartCount] = useState(0)
  const [adding, setAdding] = useState(false)

  // Helper to get guest cart
  const getGuestCart = () => {
    try {
      return JSON.parse(localStorage.getItem('esh_guest_cart') || '[]')
    } catch {
      return []
    }
  }

  // Fetch count from server or guest cart
  const refreshCart = useCallback(async () => {
    const u = localStorage.getItem('esh_user')
    if (u) {
      try {
        const { data } = await api.get('/user/myCart')
        const items = data.cartData || []
        const total = items.reduce((acc, item) => acc + (item.quantity || 0), 0)
        setCartCount(total)
      } catch {
        setCartCount(0)
      }
    } else {
      const gCart = getGuestCart()
      const total = gCart.reduce((acc, item) => acc + (item.quantity || 0), 0)
      setCartCount(total)
    }
  }, [])

  // Add to cart — returns { success, message }
  // productObj parameter used for guest cart to store metadata
  const addToCart = useCallback(async (product, quantity = 1) => {
    setAdding(true)
    const u = localStorage.getItem('esh_user')
    const productId = typeof product === 'object' ? product.id : product

    if (u) {
      try {
        await api.post('/user/cart/add', { productId, quantity })
        setCartCount(prev => prev + quantity)
        return { success: true, message: 'Added to cart!' }
      } catch (err) {
        const msg = err?.response?.data?.message || err?.response?.data || 'Failed to add to cart'
        return { success: false, message: typeof msg === 'string' ? msg : 'Failed to add to cart' }
      } finally {
        setAdding(false)
      }
    } else {
      // Guest logic
      const gCart = getGuestCart()
      const existingIdx = gCart.findIndex(it => it.productId === productId)
      
      if (existingIdx > -1) {
        gCart[existingIdx].quantity += quantity
      } else {
        // Store metadata if available
        gCart.push({
          productId,
          quantity,
          productName: product.title || 'Product',
          price: product.price || 0,
          imageName: product.imageName || ''
        })
      }
      
      localStorage.setItem('esh_guest_cart', JSON.stringify(gCart))
      setCartCount(prev => prev + quantity)
      setAdding(false)
      return { success: true, message: 'Added to guest cart!' }
    }
  }, [])

  // Move items from localStorage to server
  const syncCart = useCallback(async () => {
    const gCart = getGuestCart()
    if (gCart.length === 0) return
    
    try {
      // Seqentially add items to server; Promise.all is also fine but sequential is safer for backends
      for (const item of gCart) {
        await api.post('/user/cart/add', { productId: item.productId, quantity: item.quantity })
      }
      localStorage.removeItem('esh_guest_cart')
      await refreshCart()
    } catch (err) {
      console.error("Failed to sync guest cart", err)
    }
  }, [refreshCart])

  const clearCart = useCallback(() => {
    setCartCount(0)
    localStorage.removeItem('esh_guest_cart')
  }, [])
                                                  
  useEffect(() => {
    refreshCart()
  }, [refreshCart])
                                                  
  return (
    <CartCtx.Provider value={{ cartCount, addToCart, refreshCart, clearCart, syncCart, adding }}>
      {children}
    </CartCtx.Provider>
  )
}

export const useCart = () => useContext(CartCtx)
