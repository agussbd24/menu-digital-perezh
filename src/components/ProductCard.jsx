import { Minus, Plus, ShoppingBag } from 'lucide-react'
import { useState } from 'react'
import { useCart } from '../hooks/useCart.js'
import { useCountUp } from '../hooks/useCountUp.js'
import { formatCurrency } from '../services/menuData.js'
import ProductModal from './ProductModal.jsx'

export default function ProductCard({ product, index = 0 }) {
  const { items, increaseItem, decreaseItem } = useCart()
  const [modalOpen, setModalOpen] = useState(false)
  const [imgLoaded, setImgLoaded] = useState(false)
  const [imgError, setImgError] = useState(false)

  const quantity = items
    .filter((item) => item.id === product.id)
    .reduce((sum, item) => sum + item.quantity, 0)

  const animatedQuantity = useCountUp(quantity, 300)
  const cartItem = items.find((item) => item.id === product.id)

  const handleCardClick = () => {
    setModalOpen(true)
    window.dispatchEvent(new CustomEvent('restobar-modal-open'))
  }

  return (
    <>
      <article
        onClick={handleCardClick}
        className="reveal-up group overflow-hidden rounded-2xl sm:rounded-[2rem] border border-white/[0.08] bg-white/[0.03] shadow-card transition-all duration-500 hover:-translate-y-2 hover:border-perez-orange/30 hover:bg-white/[0.06] hover:shadow-glow card-hover cursor-pointer"
      >
        <div className="relative aspect-[4/3] overflow-hidden bg-neutral-900">
          {!imgLoaded && !imgError && <div className="absolute inset-0 skeleton" />}
          {imgError ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-perez-navy-dark to-neutral-900 text-center p-4">
              <ShoppingBag className="mb-3 text-perez-orange/50" size={40} />
              <span className="text-sm font-bold text-perez-cream/80">{product.name}</span>
              <span className="mt-1 text-xs text-neutral-500">{formatCurrency(product.price)}</span>
            </div>
          ) : (
            <img
              src={product.image}
              alt={product.name}
              className={`h-full w-full object-cover transition-all duration-700 group-hover:scale-110 img-blur-load ${imgLoaded ? 'loaded' : ''}`}
              loading="lazy"
              onLoad={() => setImgLoaded(true)}
              onError={() => setImgError(true)}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-500 group-hover:from-black/70" />

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

        <div className="p-4 sm:p-5">
          <div className="mb-4">
            <h3 className="line-clamp-1 text-xl font-bold text-white transition-colors duration-300 group-hover:text-perez-gold">
              {product.name}
            </h3>
            <p className="mt-2 min-h-[2.5rem] text-sm leading-6 text-neutral-400 transition-colors duration-300 group-hover:text-neutral-300 line-clamp-2">
              {product.description}
            </p>
          </div>

          <div className="flex items-center justify-between gap-4">
            {quantity > 0 ? (
              <div
                className="inline-flex items-center rounded-2xl border border-perez-orange/30 bg-perez-orange/10 animate-scale-in"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  type="button"
                  onClick={() => decreaseItem(cartItem.cartId)}
                  className="grid h-11 w-11 place-items-center text-perez-gold transition-all duration-200 hover:text-white hover:scale-110 active:scale-90 cursor-pointer"
                  aria-label={`Disminuir ${product.name}`}
                >
                  <Minus size={18} />
                </button>
                <span className="min-w-[2.75rem] text-center text-base font-bold text-white tabular-nums">
                  {animatedQuantity}
                </span>
                <button
                  type="button"
                  onClick={() => increaseItem(cartItem.cartId)}
                  className="grid h-11 w-11 place-items-center text-perez-gold transition-all duration-200 hover:text-white hover:scale-110 active:scale-90 cursor-pointer"
                  aria-label={`Aumentar ${product.name}`}
                >
                  <Plus size={18} />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  setModalOpen(true)
                  window.dispatchEvent(new CustomEvent('restobar-modal-open'))
                }}
                className="btn-ripple inline-flex items-center justify-center gap-2.5 rounded-2xl bg-perez-cream px-6 py-4 text-[15px] font-bold text-perez-navy-dark shadow-soft transition-all duration-300 hover:scale-105 hover:bg-perez-gold hover:shadow-glow active:scale-95 cursor-pointer w-full sm:w-auto sm:px-5 sm:py-3 sm:text-sm"
              >
                <ShoppingBag size={20} />
                Ver y agregar
              </button>
            )}
          </div>
        </div>
      </article>

      <ProductModal
        product={product}
        open={modalOpen}
        onClose={() => { setModalOpen(false); window.dispatchEvent(new CustomEvent('restobar-modal-close')) }}
      />
    </>
  )
}
