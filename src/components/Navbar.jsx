import { ChefHat, BarChart3, ShoppingBag, UtensilsCrossed } from 'lucide-react'
import { useCart } from '../hooks/useCart.js'

export default function Navbar({ onCartOpen }) {
  const { totalItems } = useCart()

  return (
    <header className="sticky top-0 z-40 border-b border-white/5 glass-strong">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <a href="/" className="group flex items-center gap-3" aria-label="Volver al menú">
          <span className="grid h-12 w-12 place-items-center rounded-2xl border border-perez-orange/30 bg-gradient-to-br from-perez-orange/20 to-perez-gold/10 text-perez-gold shadow-glow transition-all duration-300 group-hover:scale-105 group-hover:from-perez-orange/30 group-hover:to-perez-gold/20">
            <UtensilsCrossed size={22} />
          </span>
          <span>
            <span className="block text-xs font-bold uppercase tracking-[0.35em] text-perez-gold/70">
              PÉREZ H
            </span>
            <span className="block text-lg font-bold text-perez-cream">Menú Digital</span>
          </span>
        </a>

        <nav className="flex items-center gap-3">
          <a
            href="/stats"
            className="hidden items-center gap-2 rounded-full border border-white/10 glass px-4 py-2.5 text-sm font-semibold text-neutral-300 transition-all duration-300 hover:border-perez-teal/40 hover:bg-perez-teal/10 hover:text-perez-cream sm:flex"
          >
            <BarChart3 size={17} />
            Estadísticas
          </a>
          <a
            href="/kitchen"
            className="hidden items-center gap-2 rounded-full border border-white/10 glass px-4 py-2.5 text-sm font-semibold text-neutral-300 transition-all duration-300 hover:border-perez-orange/40 hover:bg-perez-orange/10 hover:text-perez-gold sm:flex"
          >
            <ChefHat size={17} />
            Cocina
          </a>
          <button
            type="button"
            onClick={onCartOpen}
            className="relative grid h-12 w-12 place-items-center rounded-2xl bg-perez-cream text-perez-navy-dark shadow-soft transition-all duration-300 hover:scale-105 hover:bg-perez-gold"
            aria-label="Abrir carrito"
          >
            <ShoppingBag size={20} />
            {totalItems > 0 && (
              <span className="absolute -right-1.5 -top-1.5 grid h-6 min-w-6 place-items-center rounded-full bg-gradient-to-r from-perez-orange to-perez-gold px-1.5 text-xs font-bold text-perez-navy-dark ring-4 ring-perez-navy animate-bounce-in">
                {totalItems}
              </span>
            )}
          </button>
        </nav>
      </div>
    </header>
  )
}
