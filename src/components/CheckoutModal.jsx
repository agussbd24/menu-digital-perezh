import { useEffect, useMemo, useState, useRef, useCallback } from 'react'
import { CheckCircle2, Loader2, Send, X } from 'lucide-react'
import { useCart } from '../hooks/useCart.js'
import { createOrder } from '../services/orderService.js'
import { formatCurrency } from '../services/menuData.js'
import Confetti from './Confetti.jsx'

function getInitialTableNumber() {
  const params = new URLSearchParams(window.location.search)
  return params.get('table') || params.get('mesa') || localStorage.getItem('restobar-table-number') || ''
}

export default function CheckoutModal({ open, onClose, onSuccess }) {
  const { items, total, clearCart } = useCart()
  const [tableNumber, setTableNumber] = useState(getInitialTableNumber)
  const [customerName, setCustomerName] = useState('')
  const [notes, setNotes] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [createdOrder, setCreatedOrder] = useState(null)
  const [showConfetti, setShowConfetti] = useState(false)
  const [dragY, setDragY] = useState(0)
  const [dragging, setDragging] = useState(false)
  const touchStart = useRef({ y: 0 })

  const handleTouchStart = useCallback((e) => {
    touchStart.current = { y: e.touches[0].clientY }
    setDragging(true)
  }, [])

  const handleTouchMove = useCallback((e) => {
    if (!dragging) return
    const delta = e.touches[0].clientY - touchStart.current.y
    if (delta > 0) setDragY(delta)
  }, [dragging])

  const handleTouchEnd = useCallback(() => {
    setDragging(false)
    if (dragY > 120) onClose()
    setDragY(0)
  }, [dragY, onClose])

  useEffect(() => {
    if (open) {
      setTableNumber(localStorage.getItem('restobar-table-number') || getInitialTableNumber())
    }
  }, [open])

  const normalizedItems = useMemo(
    () =>
      items.map((item) => ({
        id: item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        subtotal: item.price * item.quantity,
      })),
    [items],
  )

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    if (!tableNumber.trim()) {
      setError('Ingresá el número de mesa para enviar el pedido.')
      return
    }

    if (items.length === 0) {
      setError('El carrito está vacío.')
      return
    }

    try {
      setSubmitting(true)
      const order = await createOrder({
        tableNumber,
        customerName,
        notes,
        items: normalizedItems,
        total,
      })
      setCreatedOrder(order)
      setShowConfetti(true)
      try {
        localStorage.setItem('restobar-table-number', tableNumber)
        window.dispatchEvent(new CustomEvent('restobar-table-changed', { detail: tableNumber }))
        localStorage.setItem('restobar-tracking-id', order.id)
        localStorage.setItem('restobar-tracking-cache', JSON.stringify(order))
        window.dispatchEvent(new CustomEvent('restobar-order-created', { detail: order }))
      } catch { /* storage may be unavailable */ }
      clearCart()
      onSuccess?.()
    } catch (submitError) {
      setError(submitError.message)
    } finally {
      setSubmitting(false)
    }
  }

  const closeAndReset = () => {
    setCreatedOrder(null)
    setShowConfetti(false)
    setError('')
    onClose()
  }

  if (!open) {
    return null
  }

  return (
    <>
      <Confetti active={showConfetti} onComplete={() => setShowConfetti(false)} />
      <div className="fixed inset-0 z-[60] grid place-items-end bg-black/80 p-0 backdrop-blur-sm sm:place-items-center sm:p-4 animate-fade-in">
        <div
          className="max-h-[94vh] w-full max-w-lg overflow-y-auto rounded-t-[2rem] border border-white/[0.08] bg-perez-navy/95 px-5 py-6 shadow-2xl backdrop-blur-2xl sm:rounded-[2rem] sm:p-6 animate-slide-up"
          style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)', transform: `translateY(${dragY}px)`, opacity: dragY > 0 ? Math.max(0, 1 - dragY / 400) : 1, transition: dragging ? 'none' : 'transform 0.3s ease-out, opacity 0.3s ease-out' }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="flex justify-center pt-3 sm:hidden">
            <div className="h-1 w-10 rounded-full bg-white/20" />
          </div>
          <div className="mb-6 flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-perez-gold/70">
                Checkout
              </p>
              <h2 className="mt-1 text-2xl font-bold text-white">
                {createdOrder ? 'Pedido enviado' : 'Confirmá tu pedido'}
              </h2>
            </div>
            <button
              type="button"
              onClick={closeAndReset}
              className="grid h-11 w-11 place-items-center rounded-2xl border border-white/10 glass text-neutral-300 transition-all duration-300 hover:bg-white/10 hover:text-white active:scale-90"
              aria-label="Cerrar checkout"
            >
              <X size={20} />
            </button>
          </div>

          {createdOrder ? (
            <div className="py-10 text-center animate-bounce-in">
              <div className="mx-auto mb-5 grid h-24 w-24 place-items-center rounded-full bg-gradient-to-br from-perez-orange/20 to-perez-gold/10 ring-2 ring-perez-gold/30 animate-pulse-glow">
                <CheckCircle2 className="text-perez-gold" size={44} />
              </div>
              <p className="text-2xl font-bold text-white">Cocina ya recibió tu orden</p>
              <p className="mt-3 text-neutral-400">
                Mesa {createdOrder.tableNumber} · Total {formatCurrency(createdOrder.total)}
              </p>
              <div className="mt-4 inline-flex items-center gap-2 rounded-full glass px-4 py-2 text-xs text-neutral-500">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                Notificación enviada a cocina
              </div>
              <button
                type="button"
                onClick={closeAndReset}
                className="btn-ripple mt-8 w-full rounded-2xl bg-perez-cream px-5 py-4 font-bold text-perez-navy-dark transition-all duration-300 hover:bg-perez-gold hover:scale-[1.02] active:scale-95"
              >
                Volver al menú
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="animate-fade-in-up">
                <label className="mb-2 block text-sm font-bold text-neutral-200">Número de mesa</label>
                <input
                  value={tableNumber}
                  onChange={(event) => setTableNumber(event.target.value)}
                  inputMode="numeric"
                  placeholder="Ej: 12"
                  className="h-14 w-full rounded-2xl border border-white/[0.08] glass px-5 py-4 text-white outline-none transition-all duration-300 placeholder:text-neutral-500 focus:border-perez-orange/40 focus:ring-4 focus:ring-perez-orange/10 focus:scale-[1.01]"
                />
              </div>
              <div className="animate-fade-in-up stagger-1">
                <label className="mb-2 block text-sm font-bold text-neutral-200">Nombre opcional</label>
                <input
                  value={customerName}
                  onChange={(event) => setCustomerName(event.target.value)}
                  placeholder="Para identificar tu pedido"
                  className="h-14 w-full rounded-2xl border border-white/[0.08] glass px-5 py-4 text-white outline-none transition-all duration-300 placeholder:text-neutral-500 focus:border-perez-orange/40 focus:ring-4 focus:ring-perez-orange/10 focus:scale-[1.01]"
                />
              </div>
              <div className="animate-fade-in-up stagger-2">
                <label className="mb-2 block text-sm font-bold text-neutral-200">
                  Observaciones opcionales
                </label>
                <textarea
                  value={notes}
                  onChange={(event) => setNotes(event.target.value)}
                  rows="4"
                  placeholder="Sin cebolla, punto de cocción, alergias..."
                  className="w-full resize-none rounded-2xl border border-white/[0.08] glass px-5 py-4 text-white outline-none transition-all duration-300 placeholder:text-neutral-500 focus:border-perez-orange/40 focus:ring-4 focus:ring-perez-orange/10 focus:scale-[1.01]"
                />
              </div>

              <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 animate-fade-in-up stagger-3">
                <div className="mb-4 flex items-center justify-between text-sm text-neutral-300">
                  <span>{items.length} productos</span>
                  <strong className="text-white">{formatCurrency(total)}</strong>
                </div>
                <div className="space-y-3">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between gap-4 text-sm">
                      <span className="text-neutral-300">
                        {item.quantity}x {item.name}
                      </span>
                      <span className="font-semibold text-neutral-100 tabular-nums">
                        {formatCurrency(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {error && (
                <div className="rounded-2xl border border-red-400/20 bg-red-500/10 px-5 py-4 text-sm font-medium text-red-200 animate-fade-in">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="btn-ripple inline-flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-perez-orange to-perez-gold px-5 py-4 font-bold text-perez-navy-dark shadow-glow transition-all duration-300 hover:-translate-y-0.5 hover:from-perez-orange-dark hover:to-perez-orange hover:shadow-floating active:scale-[0.98] disabled:cursor-wait disabled:from-perez-navy-light disabled:to-perez-navy-light disabled:text-neutral-400 disabled:shadow-none disabled:hover:translate-y-0"
              >
                {submitting ? <Loader2 className="animate-spin" size={19} /> : <Send size={19} />}
                Enviar pedido
              </button>
            </form>
          )}
        </div>
      </div>
    </>
  )
}
