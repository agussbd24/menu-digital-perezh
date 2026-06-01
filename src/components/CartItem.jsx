import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react'
import { useState, useRef } from 'react'
import { useCountUp } from '../hooks/useCountUp.js'
import { formatCurrency } from '../services/menuData.js'

export default function CartItem({ item, onIncrease, onDecrease, onRemove }) {
  const [dragX, setDragX] = useState(0)
  const [dragging, setDragging] = useState(false)
  const startX = useRef(0)

  const animatedQty = useCountUp(item.quantity, 250)
  const subtotal = item.price * item.quantity
  const animatedSubtotal = useCountUp(subtotal, 250)

  const handleTouchStart = (e) => {
    startX.current = e.touches[0].clientX
    setDragging(true)
  }

  const handleTouchMove = (e) => {
    if (!dragging) return
    const delta = e.touches[0].clientX - startX.current
    if (delta < 0) setDragX(delta)
  }

  const handleTouchEnd = () => {
    setDragging(false)
    if (dragX < -100) {
      onRemove(item.cartId)
    }
    setDragX(0)
  }

  return (
    <div className="relative overflow-hidden rounded-2xl">
      {dragX < -60 && (
        <div className="absolute inset-0 flex items-center justify-end rounded-2xl bg-red-500/20 pr-6">
          <Trash2 className="text-red-400" size={20} />
        </div>
      )}
      <div
        className="animate-slide-in-right relative rounded-2xl border border-white/[0.06] bg-white/[0.03] p-4 transition-all duration-300 hover:bg-white/[0.06]"
        style={{
          animationDelay: `${0 * 0.05}s`,
          transform: `translateX(${dragX}px)`,
          transition: dragging ? 'none' : 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="flex gap-4">
          <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl ring-1 ring-white/5 bg-neutral-800 flex items-center justify-center">
            <img
              src={item.image}
              alt={item.name}
              className="h-full w-full object-cover"
              loading="lazy"
              onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
            />
            <div className="hidden items-center justify-center h-full w-full">
              <ShoppingBag className="text-neutral-600" size={20} />
            </div>
          </div>
          <div className="min-w-0 flex-1 flex flex-col justify-between">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <h3 className="font-bold text-white truncate">{item.name}</h3>
                {item.selectedAddons && item.selectedAddons.length > 0 && (
                  <div className="mt-1 flex flex-wrap gap-1">
                    {item.selectedAddons.map((addon) => (
                      <span key={addon.id} className="rounded bg-white/5 border border-white/5 px-2 py-0.5 text-[11px] text-neutral-400 font-semibold">
                        + {addon.name}
                      </span>
                    ))}
                  </div>
                )}
                {item.notes && (
                  <p className="mt-1 text-xs text-perez-gold italic truncate">
                    "{item.notes}"
                  </p>
                )}
                <p className="mt-2 text-sm font-semibold text-perez-gold tabular-nums">
                  {formatCurrency(item.price)}
                </p>
              </div>
              <button
                type="button"
                onClick={() => onRemove(item.cartId)}
                className="grid h-11 w-11 shrink-0 place-items-center rounded-xl text-neutral-400 transition-all duration-300 hover:bg-red-500/10 hover:text-red-300 active:scale-90 cursor-pointer"
                aria-label={`Eliminar ${item.name}`}
              >
                <Trash2 size={17} />
              </button>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <div className="inline-flex items-center rounded-xl border border-white/10 bg-black/20">
                <button
                  type="button"
                  onClick={() => onDecrease(item.cartId)}
                  className="grid h-11 w-11 place-items-center text-neutral-300 transition-all duration-200 hover:text-white hover:scale-110 active:scale-90 cursor-pointer"
                  aria-label={`Disminuir ${item.name}`}
                >
                  <Minus size={16} />
                </button>
                <span className="min-w-[2.5rem] text-center text-sm font-bold text-white tabular-nums">
                  {animatedQty}
                </span>
                <button
                  type="button"
                  onClick={() => onIncrease(item.cartId)}
                  className="grid h-11 w-11 place-items-center text-neutral-300 transition-all duration-200 hover:text-white hover:scale-110 active:scale-90 cursor-pointer"
                  aria-label={`Aumentar ${item.name}`}
                >
                  <Plus size={16} />
                </button>
              </div>
              <span className="font-bold text-white tabular-nums">
                {formatCurrency(animatedSubtotal)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
