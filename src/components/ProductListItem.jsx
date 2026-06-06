import { useState } from 'react'
import { useCart } from '../hooks/useCart.js'
import { formatCurrency } from '../services/menuData.js'
import ProductModal from './ProductModal.jsx'

export default function ProductListItem({ product, index = 0 }) {
  const { items } = useCart()
  const [modalOpen, setModalOpen] = useState(false)

  const quantity = items
    .filter((item) => item.id === product.id)
    .reduce((sum, item) => sum + item.quantity, 0)

  const handleRowClick = () => {
    setModalOpen(true)
    window.dispatchEvent(new CustomEvent('restobar-modal-open'))
  }

  return (
    <>
      <button
        type='button'
        onClick={handleRowClick}
        className='menu-list-item reveal-up group w-full text-left py-5 px-2 sm:px-4 transition-all duration-500 cursor-pointer'
        style={{ transitionDelay: (index * 50) + 'ms' }}
      >
        <div className='flex items-baseline gap-3'>
          <div className='flex items-baseline gap-2 min-w-0 flex-1'>
            <h3 className='text-lg sm:text-xl font-bold text-white/90 truncate transition-all duration-500 group-hover:text-perez-gold group-hover:tracking-wide'>
              {product.name}
            </h3>
            {product.badge && (
              <span className='shrink-0 text-[11px] font-semibold uppercase tracking-wider text-perez-gold/70 transition-colors duration-500 group-hover:text-perez-gold'>
                {product.badge}
              </span>
            )}
            {quantity > 0 && (
              <span className='shrink-0 inline-flex items-center justify-center h-5 min-w-[20px] rounded-full bg-perez-orange/90 px-1.5 text-[10px] font-bold text-perez-navy-dark animate-scale-in'>
                {quantity}
              </span>
            )}
          </div>

          <div className='flex items-baseline gap-2 shrink-0'>
            <span className='menu-price-leader hidden sm:block' />
            <span className='text-base sm:text-lg font-bold text-perez-gold/90 tabular-nums whitespace-nowrap transition-all duration-500 group-hover:text-perez-gold group-hover:scale-105'>
              {formatCurrency(product.price)}
            </span>
          </div>
        </div>

        <p className='mt-1.5 text-sm leading-7 text-neutral-400/80 line-clamp-2 max-w-2xl transition-all duration-500 group-hover:text-neutral-300 group-hover:leading-7'>
          {product.description}
        </p>
      </button>

      <ProductModal
        product={product}
        open={modalOpen}
        onClose={() => { setModalOpen(false); window.dispatchEvent(new CustomEvent('restobar-modal-close')) }}
      />
    </>
  )
}
