import { Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react'
import { useCart } from '../hooks/useCart.js'
import { formatCurrency } from '../services/menuData.js'

export default function CartDrawer({ open, onClose, onCheckout }) {
  const { items, total, totalItems, increaseItem, decreaseItem, removeItem } = useCart()

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
        <div className="flex items-center justify-between border-b border-white/[0.06] p-6">
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
            className="grid h-11 w-11 place-items-center rounded-2xl border border-white/10 glass text-neutral-300 transition-all duration-300 hover:bg-white/10 hover:text-white"
            aria-label="Cerrar carrito"
          >
            <X size={20} />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="grid flex-1 place-items-center px-8 text-center animate-fade-in">
            <div>
              <div className="mx-auto mb-4 grid h-20 w-20 place-items-center rounded-full bg-neutral-800/50">
                <ShoppingBag className="text-neutral-500" size={32} />
              </div>
              <p className="text-xl font-bold text-white">Carrito vacío</p>
              <p className="mt-2 text-sm text-neutral-400">Sumá productos del menú para continuar.</p>
            </div>
          </div>
        ) : (
          <div className="flex-1 space-y-3 overflow-y-auto p-5">
            {items.map((item, index) => (
              <div
                key={item.id}
                className="animate-slide-in-right rounded-2xl border border-white/[0.06] bg-white/[0.03] p-4 transition-all duration-300 hover:bg-white/[0.06]"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="flex gap-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-20 w-20 rounded-xl object-cover"
                    loading="lazy"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-bold text-white">{item.name}</h3>
                        <p className="mt-1 text-sm font-semibold text-perez-gold">
                          {formatCurrency(item.price)}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="grid h-9 w-9 shrink-0 place-items-center rounded-xl text-neutral-400 transition-all duration-300 hover:bg-red-500/10 hover:text-red-300"
                        aria-label={`Eliminar ${item.name}`}
                      >
                        <Trash2 size={17} />
                      </button>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <div className="inline-flex items-center rounded-xl border border-white/10 bg-black/20">
                        <button
                          type="button"
                          onClick={() => decreaseItem(item.id)}
                          className="grid h-10 w-10 place-items-center text-neutral-300 transition-colors hover:text-white"
                          aria-label={`Disminuir ${item.name}`}
                        >
                          <Minus size={16} />
                        </button>
                        <span className="min-w-[2.5rem] text-center text-sm font-bold text-white">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => increaseItem(item.id)}
                          className="grid h-10 w-10 place-items-center text-neutral-300 transition-colors hover:text-white"
                          aria-label={`Aumentar ${item.name}`}
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                      <span className="font-bold text-white">
                        {formatCurrency(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="border-t border-white/[0.06] p-6">
          <div className="mb-3 flex items-center justify-between text-neutral-400">
            <span>Subtotal</span>
            <span>{formatCurrency(total)}</span>
          </div>
          <div className="mb-6 flex items-center justify-between text-2xl font-bold text-white">
            <span>Total</span>
            <span className="text-gradient">{formatCurrency(total)}</span>
          </div>
          <button
            type="button"
            disabled={items.length === 0}
            onClick={onCheckout}
            className="h-14 w-full rounded-2xl bg-gradient-to-r from-perez-orange to-perez-gold px-5 py-4 text-base font-bold text-perez-navy-dark shadow-glow transition-all duration-300 hover:-translate-y-0.5 hover:from-perez-orange-dark hover:to-perez-orange disabled:cursor-not-allowed disabled:from-perez-navy-light disabled:to-perez-navy-light disabled:text-neutral-400 disabled:shadow-none"
          >
            Confirmar mesa y enviar
          </button>
        </div>
      </aside>
    </div>
  )
}
