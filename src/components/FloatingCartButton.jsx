import { ShoppingBag } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useCart } from '../hooks/useCart.js'
import { formatCurrency } from '../services/menuData.js'

export default function FloatingCartButton({ onClick }) {
  const { totalItems, total } = useCart()
  const [animate, setAnimate] = useState(false)

  useEffect(() => {
    if (totalItems > 0) {
      setAnimate(true)
      const timer = setTimeout(() => setAnimate(false), 400)
      return () => clearTimeout(timer)
    }
  }, [totalItems])

  if (totalItems === 0) {
    return null
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={`fixed bottom-6 z-30 flex items-center justify-between rounded-2xl bg-gradient-to-r from-perez-orange to-perez-gold px-5 py-4 font-bold text-perez-navy-dark shadow-floating transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_25px_60px_rgba(216,102,10,0.4)] active:scale-[0.98] sm:hidden animate-fade-in-up left-[5rem] right-[4.5rem] ${
        animate ? 'animate-cart-pop' : ''
      }`}
    >
      <span className="inline-flex items-center gap-2">
        <ShoppingBag size={20} className="transition-transform duration-300" />
        <span className="bg-neutral-950/10 px-2 py-0.5 rounded-lg tabular-nums font-bold">{totalItems}</span>
      </span>
      <span className="text-lg tabular-nums">{formatCurrency(total)}</span>
    </button>
  )
}
