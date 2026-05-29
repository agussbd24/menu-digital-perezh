import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { isSupabaseConfigured, supabase } from '../lib/supabaseClient.js'
import { fetchOrders, mapOrder, updateOrderStatus } from '../services/orderService.js'

const statusPriority = {
  new: 0,
  preparing: 1,
  ready: 2,
  delivered: 3,
}

function playNotificationTone() {
  const AudioContext = window.AudioContext || window.webkitAudioContext

  if (!AudioContext) {
    return
  }

  const audioContext = new AudioContext()
  const oscillator = audioContext.createOscillator()
  const gain = audioContext.createGain()

  oscillator.type = 'sine'
  oscillator.frequency.setValueAtTime(880, audioContext.currentTime)
  oscillator.frequency.exponentialRampToValueAtTime(1320, audioContext.currentTime + 0.12)
  gain.gain.setValueAtTime(0.001, audioContext.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.22, audioContext.currentTime + 0.02)
  gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.4)
  oscillator.connect(gain)
  gain.connect(audioContext.destination)
  oscillator.start()
  oscillator.stop(audioContext.currentTime + 0.42)
}

export function useOrders({ soundEnabled = true } = {}) {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(isSupabaseConfigured)
  const [error, setError] = useState(null)
  const soundEnabledRef = useRef(soundEnabled)
  const knownOrderIds = useRef(new Set())

  useEffect(() => {
    soundEnabledRef.current = soundEnabled
  }, [soundEnabled])

  useEffect(() => {
    let mounted = true

    async function loadOrders() {
      if (!isSupabaseConfigured) {
        setError('Faltan variables de entorno de Supabase.')
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        const data = await fetchOrders()

        if (!mounted) {
          return
        }

        knownOrderIds.current = new Set(data.map((order) => order.id))
        setOrders(data)
      } catch (loadError) {
        if (mounted) {
          setError(loadError.message)
        }
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    loadOrders()

    return () => {
      mounted = false
    }
  }, [])

  useEffect(() => {
    if (!isSupabaseConfigured) {
      return undefined
    }

    const channel = supabase
      .channel('orders-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            const order = mapOrder(payload.new)
            const isUnknown = !knownOrderIds.current.has(order.id)
            knownOrderIds.current.add(order.id)
            setOrders((current) => [order, ...current.filter((item) => item.id !== order.id)])

            if (isUnknown && soundEnabledRef.current) {
              try {
                playNotificationTone()
              } catch {
                // Browsers can block audio until the operator interacts with the page.
              }
            }
          }

          if (payload.eventType === 'UPDATE') {
            const updatedOrder = mapOrder(payload.new)
            setOrders((current) =>
              current.map((order) => (order.id === updatedOrder.id ? updatedOrder : order)),
            )
          }

          if (payload.eventType === 'DELETE') {
            setOrders((current) => current.filter((order) => order.id !== payload.old.id))
          }
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const sortedOrders = useMemo(
    () =>
      [...orders].sort((a, b) => {
        const statusDelta = statusPriority[a.status] - statusPriority[b.status]

        if (statusDelta !== 0) {
          return statusDelta
        }

        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      }),
    [orders],
  )

  const changeStatus = useCallback(
    async (orderId, status) => {
      const previousOrders = orders
      setOrders((current) =>
        current.map((order) => (order.id === orderId ? { ...order, status } : order)),
      )

      try {
        await updateOrderStatus(orderId, status)
      } catch (statusError) {
        setOrders(previousOrders)
        setError(statusError.message)
      }
    },
    [orders],
  )

  return {
    orders: sortedOrders,
    loading,
    error,
    changeStatus,
  }
}
