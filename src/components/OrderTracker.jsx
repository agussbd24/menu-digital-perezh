import { useEffect, useRef, useState } from 'react'
import { X } from 'lucide-react'
import { useOrderTracking } from '../hooks/useOrderTracking.js'
import { formatCurrency } from '../services/menuData.js'

const steps = [
  { key: 'new', label: 'Recibido', icon: '📋' },
  { key: 'preparing', label: 'Preparando', icon: '👨‍🍳' },
  { key: 'ready', label: 'Listo', icon: '✅' },
  { key: 'delivered', label: 'Entregado', icon: '🎉' },
]

const dotColors = {
  new: 'bg-perez-orange',
  preparing: 'bg-perez-gold',
  ready: 'bg-perez-orange',
  delivered: 'bg-perez-teal',
}

const lineColors = {
  new: 'bg-perez-orange/30',
  preparing: 'bg-perez-gold/30',
  ready: 'bg-perez-orange/30',
  delivered: 'bg-perez-teal/30',
}

function getStepIndex(status) {
  return steps.findIndex((s) => s.key === status)
}

export default function OrderTracker() {
  const { orderId, order, error, hidden, statusLabel, clearTracking } = useOrderTracking()
  const [expanded, setExpanded] = useState(false)
  const lastOrderId = useRef(null)

  useEffect(() => {
    if (order && order.id !== lastOrderId.current) {
      lastOrderId.current = order.id
      setExpanded(false)
    }
  }, [order])

  if (hidden || !orderId || (!order && !error)) return null

  const currentStep = order ? getStepIndex(order.status) : 0

  return (
    <>
      {expanded && (
        <div
          className="fixed inset-0 z-[55] bg-black/60 backdrop-blur-sm animate-fade-in"
          onClick={() => setExpanded(false)}
        />
      )}

      <div
        className={`fixed z-[56] transition-all duration-300 ease-out ${
          expanded
            ? 'bottom-4 right-4 left-4 sm:left-auto sm:w-[340px] animate-slide-up'
            : 'bottom-6 right-6'
        }`}
      >
        {expanded ? (
          <div className="rounded-2xl border border-white/[0.1] bg-neutral-900/95 p-5 shadow-2xl backdrop-blur-xl">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-xs font-bold uppercase tracking-wider text-perez-gold/70">Tu pedido</p>
              <button
                type="button"
                onClick={() => setExpanded(false)}
                className="grid h-8 w-8 place-items-center rounded-xl text-neutral-400 hover:bg-white/10 hover:text-white"
              >
                <X size={16} />
              </button>
            </div>

            <div className="mb-4 space-y-2">
              {order.items.map((item, i) => (
                <div key={i} className="flex justify-between text-sm">
                  <span className="text-neutral-300">
                    {item.quantity}x {item.name}
                  </span>
                  <span className="text-neutral-100">{formatCurrency(item.subtotal)}</span>
                </div>
              ))}
              <div className="border-t border-white/[0.08] pt-2 flex justify-between text-sm font-bold">
                <span className="text-white">Total</span>
                <span className="text-white">{formatCurrency(order.total)}</span>
              </div>
            </div>

            <div className="space-y-0">
              {steps.map((step, index) => {
                const isActive = index === currentStep
                const isDone = index < currentStep

                return (
                  <div key={step.key} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <span
                        className={`h-3 w-3 rounded-full ${
                          isActive
                            ? `${dotColors[step.key]} animate-pulse`
                            : isDone
                              ? dotColors[step.key]
                              : 'bg-neutral-700'
                        }`}
                      />
                      {index < steps.length - 1 && (
                        <span
                          className={`w-0.5 flex-1 min-h-[24px] ${
                            isDone ? lineColors[step.key] : 'bg-neutral-800'
                          }`}
                        />
                      )}
                    </div>
                    <div className="pb-4">
                      <p
                        className={`text-sm font-semibold ${
                          isActive ? 'text-white' : isDone ? 'text-neutral-400' : 'text-neutral-600'
                        }`}
                      >
                        {step.icon} {step.label}
                      </p>
                      {isActive && (
                        <p className="text-xs text-neutral-500 mt-0.5">En curso...</p>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>

            <button
              type="button"
              onClick={() => setExpanded(false)}
              className="mt-2 w-full rounded-xl border border-white/[0.08] bg-white/[0.03] py-2.5 text-xs font-semibold text-neutral-400 transition-colors hover:bg-white/[0.08] hover:text-white"
            >
              Minimizar
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setExpanded(true)}
            className="inline-flex items-center gap-2.5 rounded-full border border-white/[0.1] bg-neutral-900/90 px-4 py-2.5 text-sm font-semibold text-white shadow-xl backdrop-blur-xl transition-transform hover:scale-105 active:scale-95 animate-fade-in"
          >
            <span
              className={`h-2 w-2 rounded-full ${order ? dotColors[order.status] : 'bg-neutral-500'} animate-pulse`}
            />
            {error ? 'Error' : statusLabel}
          </button>
        )}
      </div>
    </>
  )
}
