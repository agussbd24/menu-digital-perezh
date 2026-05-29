import { ShoppingBag } from 'lucide-react'
import { useCart } from '../hooks/useCart.js'
import { formatCurrency } from '../services/menuData.js'

export default function FloatingCartButton({ onClick }) {
  const { totalItems, total } = useCart()

  if (totalItems === 0) {
    return null
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className="fixed bottom-6 left-4 right-4 z-30 flex items-center justify-between rounded-2xl bg-gradient-to-r from-perez-orange to-perez-gold px-6 py-4 font-bold text-perez-navy-dark shadow-floating transition-all duration-300 hover:-translate-y-1 sm:hidden animate-fade-in-up"
    >
      <span className="inline-flex items-center gap-2">
        <ShoppingBag size={20} />
        <span className="bg-neutral-950/10 px-2 py-0.5 rounded-lg">{totalItems}</span>
      </span>
      <span className="text-lg">{formatCurrency(total)}</span>
    </button>
  )
}
