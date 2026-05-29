import { useCallback, useEffect, useState } from 'react'
import { isSupabaseConfigured, supabase } from '../lib/supabaseClient.js'
import { mapOrder } from '../services/orderService.js'

const TRACKING_KEY = 'restobar-tracking-id'
const CACHE_KEY = 'restobar-tracking-cache'

const statusLabels = {
  new: 'Recibido',
  preparing: 'Preparando',
  ready: 'Listo',
  delivered: 'Entregado',
}

const deliveredHideDelay = 5000

function loadCache() {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function loadOrderId() {
  try {
    return localStorage.getItem(TRACKING_KEY)
  } catch {
    return null
  }
}

function clearCache() {
  try {
    localStorage.removeItem(CACHE_KEY)
    localStorage.removeItem(TRACKING_KEY)
  } catch {}
}

function saveCache(order) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(order))
  } catch {}
}

export function useOrderTracking() {
  const [orderId, setOrderId] = useState(loadOrderId)
  const [order, setOrder] = useState(loadCache)
  const [error, setError] = useState(null)
  const [hidden, setHidden] = useState(false)

  const clearTracking = useCallback(() => {
    clearCache()
    setOrderId(null)
    setOrder(null)
    setHidden(false)
  }, [])

  useEffect(() => {
    function onOrderCreated(e) {
      const newOrder = e.detail
      setOrderId(newOrder.id)
      setOrder(newOrder)
      setHidden(false)
      setError(null)
    }

    window.addEventListener('restobar-order-created', onOrderCreated)
    return () => window.removeEventListener('restobar-order-created', onOrderCreated)
  }, [])

  useEffect(() => {
    if (!orderId || !isSupabaseConfigured) return

    let mounted = true

    supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single()
      .then(({ data, error: fetchError }) => {
        if (!mounted) return
        if (fetchError || !data) return
        const mapped = mapOrder(data)
        setOrder(mapped)
        saveCache(mapped)

        if (data.status === 'delivered') {
          setTimeout(() => {
            if (mounted) {
              setHidden(true)
              clearTracking()
            }
          }, deliveredHideDelay)
        }
      })
      .catch(() => {})

    return () => { mounted = false }
  }, [orderId, clearTracking])

  useEffect(() => {
    if (!orderId || !isSupabaseConfigured || hidden) return undefined

    const channel = supabase
      .channel(`tracking-${orderId}`)
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'orders', filter: `id=eq.${orderId}` },
        (payload) => {
          const updatedOrder = mapOrder(payload.new)
          setOrder(updatedOrder)
          saveCache(updatedOrder)

          if (updatedOrder.status === 'delivered') {
            setTimeout(() => {
              setHidden(true)
              clearTracking()
            }, deliveredHideDelay)
          }
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [orderId, hidden, clearTracking])

  return {
    orderId,
    order,
    error,
    hidden,
    statusLabel: order ? statusLabels[order.status] : null,
    clearTracking,
  }
}
