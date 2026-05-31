import { useCallback, useEffect, useMemo, useState } from 'react'
import { CartContext } from './cartContext.js'

const STORAGE_KEY = 'restobar-cart'

function loadCart() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

function saveCart(items) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  } catch {
    // silently fail
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(loadCart)

  useEffect(() => {
    saveCart(items)
  }, [items])

  const addItem = useCallback((product, selectedAddons = [], notes = '') => {
    setItems((current) => {
      const addonsPrice = selectedAddons.reduce((sum, a) => sum + a.price, 0)
      const finalPrice = product.price + addonsPrice
      
      const sortedAddonIds = [...selectedAddons].map(a => a.id).sort().join(',')
      const cartId = `${product.id}${sortedAddonIds ? '-' + sortedAddonIds : ''}${notes.trim() ? '-' + encodeURIComponent(notes.trim()).slice(0, 30) : ''}`

      const existing = current.find((item) => item.cartId === cartId)

      if (existing) {
        return current.map((item) =>
          item.cartId === cartId ? { ...item, quantity: item.quantity + 1 } : item,
        )
      }

      return [
        ...current,
        {
          ...product,
          cartId,
          price: finalPrice,
          basePrice: product.price,
          selectedAddons,
          notes: notes.trim(),
          quantity: 1
        }
      ]
    })
  }, [])

  const increaseItem = useCallback((cartIdOrId) => {
    setItems((current) =>
      current.map((item) =>
        (item.cartId === cartIdOrId || item.id === cartIdOrId) ? { ...item, quantity: item.quantity + 1 } : item,
      ),
    )
  }, [])

  const decreaseItem = useCallback((cartIdOrId) => {
    setItems((current) =>
      current
        .map((item) =>
          (item.cartId === cartIdOrId || item.id === cartIdOrId) ? { ...item, quantity: item.quantity - 1 } : item,
        )
        .filter((item) => item.quantity > 0),
    )
  }, [])

  const removeItem = useCallback((cartIdOrId) => {
    setItems((current) => current.filter((item) => item.cartId !== cartIdOrId && item.id !== cartIdOrId))
  }, [])

  const clearCart = useCallback(() => {
    setItems([])
  }, [])

  const subtotal = useMemo(
    () => items.reduce((total, item) => total + item.price * item.quantity, 0),
    [items],
  )

  const totalItems = useMemo(
    () => items.reduce((total, item) => total + item.quantity, 0),
    [items],
  )

  const value = useMemo(
    () => ({
      items,
      subtotal,
      total: subtotal,
      totalItems,
      addItem,
      increaseItem,
      decreaseItem,
      removeItem,
      clearCart,
    }),
    [items, subtotal, totalItems, addItem, increaseItem, decreaseItem, removeItem, clearCart],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
