import { Heart, Minus, Plus, ShoppingBag } from 'lucide-react'
import { useState } from 'react'
import { useCart } from '../hooks/useCart.js'
import { useToast } from '../hooks/useToast.js'
import { formatCurrency } from '../services/menuData.js'

export default function ProductCard({ product, index = 0 }) {
  const { items, addItem, increaseItem, decreaseItem } = useCart()
  const { addToast } = useToast()
  const [favorite, setFavorite] = useState(() => {
    try {
      const stored = localStorage.getItem('restobar-favorites')
      return stored ? JSON.parse(stored).includes(product.id) : false
    } catch {
      return false
    }
  })
  const [imgLoaded, setImgLoaded] = useState(false)

  const cartItem = items.find((item) => item.id === product.id)
  const quantity = cartItem ? cartItem.quantity : 0

  const toggleFavorite = (e) => {
    e.stopPropagation()
    const newState = !favorite
    setFavorite(newState)

    try {
      const stored = localStorage.getItem('restobar-favorites')
      const favorites = stored ? JSON.parse(stored) : []
      if (newState) {
        localStorage.setItem('restobar-favorites', JSON.stringify([...favorites, product.id]))
      } else {
        localStorage.setItem(
          'restobar-favorites',
          JSON.stringify(favorites.filter((id) => id !== product.id)),
        )
      }
    } catch {
      // silently fail
    }
  }

  const handleAdd = () => {
    addItem(product)
    addToast(`${product.name} agregado al carrito`, { type: 'success' })
  }

  return (
    <article
      className="animate-fade-in-up group overflow-hidden rounded-[2rem] border border-white/[0.08] bg-white/[0.03] shadow-card transition-all duration-500 hover:-translate-y-2 hover:border-perez-orange/30 hover:bg-white/[0.06] hover:shadow-glow card-hover"
      style={{ animationDelay: `${index * 0.06}s` }}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-neutral-900">
        {!imgLoaded && <div className="absolute inset-0 skeleton" />}
        <img
          src={product.image}
          alt={product.name}
          className={`h-full w-full object-cover transition-all duration-700 group-hover:scale-110 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
          loading="lazy"
          onLoad={() => setImgLoaded(true)}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-500 group-hover:from-black/70" />

        <button
          type="button"
          onClick={toggleFavorite}
          className={`absolute left-4 top-4 grid h-10 w-10 place-items-center rounded-full backdrop-blur-xl transition-all duration-300 active:scale-90 ${
            favorite
              ? 'bg-rose-500/90 text-white shadow-lg shadow-rose-500/30 animate-scale-in'
              : 'glass text-neutral-300 hover:bg-white/15 hover:text-white hover:scale-110'
          }`}
          aria-label={favorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
        >
          <Heart size={18} fill={favorite ? 'currentColor' : 'none'} />
        </button>

        {product.badge && (
          <span className="absolute right-4 top-4 rounded-full bg-gradient-to-r from-perez-orange/90 to-perez-gold/90 px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-perez-navy-dark backdrop-blur-sm shadow-lg">
            {product.badge}
          </span>
        )}

        <div className="absolute bottom-4 left-4 right-4">
          <span className="text-2xl font-bold text-white drop-shadow-lg transition-transform duration-300 group-hover:scale-105 group-hover:drop-shadow-[0_0_10px_rgba(231,160,17,0.3)]">
            {formatCurrency(product.price)}
          </span>
        </div>
      </div>

      <div className="p-5">
        <div className="mb-4">
          <h3 className="text-xl font-bold text-white transition-colors duration-300 group-hover:text-perez-gold">
            {product.name}
          </h3>
          <p className="mt-2 min-h-[2.5rem] text-sm leading-6 text-neutral-400 transition-colors duration-300 group-hover:text-neutral-300">
            {product.description}
          </p>
        </div>

        <div className="flex items-center justify-between gap-4">
          {quantity > 0 ? (
            <div className="inline-flex items-center rounded-2xl border border-perez-orange/30 bg-perez-orange/10 animate-scale-in">
              <button
                type="button"
                onClick={() => decreaseItem(product.id)}
                className="grid h-11 w-11 place-items-center text-perez-gold transition-all duration-200 hover:text-white hover:scale-110 active:scale-90"
                aria-label={`Disminuir ${product.name}`}
              >
                <Minus size={18} />
              </button>
              <span className="min-w-[2.75rem] text-center text-base font-bold text-white tabular-nums">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => increaseItem(product.id)}
                className="grid h-11 w-11 place-items-center text-perez-gold transition-all duration-200 hover:text-white hover:scale-110 active:scale-90"
                aria-label={`Aumentar ${product.name}`}
              >
                <Plus size={18} />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleAdd}
              className="btn-ripple inline-flex items-center gap-2 rounded-2xl bg-perez-cream px-5 py-3 text-sm font-bold text-perez-navy-dark shadow-soft transition-all duration-300 hover:scale-105 hover:bg-perez-gold hover:shadow-glow active:scale-95"
            >
              <ShoppingBag size={17} />
              Agregar
            </button>
          )}
        </div>
      </div>
    </article>
  )
}
