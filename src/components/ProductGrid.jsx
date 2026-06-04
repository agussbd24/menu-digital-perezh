import { useMemo } from 'react'
import ProductListItem from './ProductListItem.jsx'
import { categories } from '../services/menuData.js'

function EmptySearchSVG() {
  return (
    <svg width='120' height='120' viewBox='0 0 120 120' fill='none' xmlns='http://www.w3.org/2000/svg' className='animate-float'>
      <circle cx='52' cy='52' r='36' stroke='rgba(231,160,17,0.2)' strokeWidth='2' fill='rgba(231,160,17,0.03)' />
      <circle cx='52' cy='52' r='20' stroke='rgba(231,160,17,0.15)' strokeWidth='1.5' fill='none' strokeDasharray='4 4' />
      <line x1='78' y1='78' x2='100' y2='100' stroke='rgba(231,160,17,0.3)' strokeWidth='3' strokeLinecap='round' />
      <circle cx='52' cy='52' r='4' fill='rgba(231,160,17,0.4)' />
      <path d='M44 48 C44 44, 60 44, 60 48' stroke='rgba(216,102,10,0.3)' strokeWidth='1.5' fill='none' strokeLinecap='round' />
      <circle cx='38' cy='50' r='2' fill='rgba(231,160,17,0.2)' />
      <circle cx='66' cy='50' r='2' fill='rgba(231,160,17,0.2)' />
    </svg>
  )
}

export default function ProductGrid({ products }) {
  const groupedProducts = useMemo(() => {
    const groups = {}
    products.forEach((product) => {
      if (!groups[product.category]) {
        groups[product.category] = []
      }
      groups[product.category].push(product)
    })
    return groups
  }, [products])

  if (products.length === 0) {
    return (
      <div className='rounded-[2rem] border border-dashed border-white/10 glass px-6 py-20 text-center animate-fade-in'>
        <div className='mx-auto mb-6 opacity-60'>
          <EmptySearchSVG />
        </div>
        <p className='text-xl font-bold text-white'>No encontramos productos</p>
        <p className='mt-2 text-sm text-neutral-400'>Probá con otra búsqueda o categoría.</p>
      </div>
    )
  }

  return (
    <div className='space-y-12'>
      {categories
        .filter((cat) => cat.id !== 'all' && groupedProducts[cat.id])
        .map((category) => (
          <section key={category.id} className='menu-section'>
            <div className='menu-section-header mb-6'>
              <h2 className='text-xs sm:text-sm font-bold uppercase tracking-[0.3em] text-perez-gold/80'>
                {category.label}
              </h2>
              <div className='menu-section-line mt-3' />
            </div>
            <div className='divide-y divide-white/[0.06]'>
              {groupedProducts[category.id].map((product) => (
                <ProductListItem key={product.id} product={product} />
              ))}
            </div>
          </section>
        ))}
    </div>
  )
}
