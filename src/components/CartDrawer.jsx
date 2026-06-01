import { Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useCart } from '../hooks/useCart.js'
import { useCountUp } from '../hooks/useCountUp.js'
import { formatCurrency } from '../services/menuData.js'
import CartItem from './CartItem.jsx'

export default function CartDrawer({ open, onClose, onCheckout }) {
  const { items, total, totalItems, increaseItem, decreaseItem, removeItem } = useCart()
  const [animateTotal, setAnimateTotal] = useState(false)
  const animatedTotal = useCountUp(total, 350)

  useEffect(() => {
    if (total > 0) {
      setAnimateTotal(true)
      const timer = setTimeout(() => setAnimateTotal(false), 400)
      return () => clearTimeout(timer)
    }
  }, [total])

  return (
    <div
      className={`fixed inset-0 z-50 transition-all duration-300 ${
        open ? 'pointer-events-auto' : 'pointer-events-none'
      }`}
      aria-hidden={!open}
    >
      <div
        className={`absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300 ${
          open ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
      />
      <aside
        className={`absolute right-0 top-0 flex h-full w-full max-w-md flex-col border-l border-white/[0.06] bg-perez-navy/95 backdrop-blur-2xl shadow-2xl transition-transform duration-500 ease-out ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-4 sm:p-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-perez-gold/70">
              Tu pedido
            </p>
            <h2 className="mt-1 text-2xl font-bold text-white">
              {totalItems} {totalItems === 1 ? 'producto' : 'productos'}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid h-11 w-11 place-items-center rounded-2xl border border-white/10 glass text-neutral-300 transition-all duration-300 hover:bg-white/10 hover:text-white active:scale-90"
            aria-label="Cerrar carrito"
          >
            <X size={20} />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="grid flex-1 place-items-center px-8 text-center animate-fade-in">
            <div className="animate-float">
              <div className="mx-auto mb-5 grid h-24 w-24 place-items-center rounded-full bg-gradient-to-br from-neutral-800/50 to-neutral-800/30 ring-1 ring-white/5">
                <ShoppingBag className="text-neutral-500" size={36} />
              </div>
              <p className="text-xl font-bold text-white">Carrito vacío</p>
              <p className="mt-2 text-sm text-neutral-400">Sumá productos del menú para continuar.</p>
            </div>
          </div>
        ) : (
          <div className="flex-1 space-y-3 overflow-y-auto p-5 pb-8">
            {items.map((item) => (
              <CartItem
                key={item.cartId}
                item={item}
                onIncrease={increaseItem}
                onDecrease={decreaseItem}
                onRemove={removeItem}
              />
            ))}
          </div>
        )}

        <div className="border-t border-white/[0.06] px-6 pb-6 pt-6" style={{ paddingBottom: 'max(1.5rem, env(safe-area-inset-bottom, 0px))' }}>
          <div className="mb-3 flex items-center justify-between text-neutral-400">
            <span>Subtotal</span>
            <span className="tabular-nums">{formatCurrency(animatedTotal)}</span>
          </div>
          <div className="mb-6 flex items-center justify-between text-2xl font-bold text-white">
            <span>Total</span>
            <span className={`text-gradient tabular-nums inline-block ${animateTotal ? 'animate-cart-pop' : ''}`}>{formatCurrency(animatedTotal)}</span>
          </div>
          <button
            type="button"
            disabled={items.length === 0}
            onClick={onCheckout}
            className="btn-ripple h-14 w-full rounded-2xl bg-gradient-to-r from-perez-orange to-perez-gold px-5 py-4 text-base font-bold text-perez-navy-dark shadow-glow transition-all duration-300 hover:-translate-y-0.5 hover:from-perez-orange-dark hover:to-perez-orange hover:shadow-floating active:scale-[0.98] disabled:cursor-not-allowed disabled:from-perez-navy-light disabled:to-perez-navy-light disabled:text-neutral-400 disabled:shadow-none disabled:hover:translate-y-0"
          >
            Confirmar mesa y enviar
          </button>
        </div>
      </aside>
    </div>
  )
}
