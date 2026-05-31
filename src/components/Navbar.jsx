import { ChefHat, BarChart3, ShoppingBag } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useCart } from '../hooks/useCart.js'

export default function Navbar({ onCartOpen }) {
  const { totalItems } = useCart()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-500 ${
        scrolled
          ? 'navbar-scrolled border-b border-white/[0.08]'
          : 'border-b border-white/5 glass-strong'
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <a href="/" className="group flex items-center gap-3" aria-label="Volver al menú">
          <span className="grid h-12 w-12 place-items-center rounded-full border border-perez-orange/20 bg-perez-navy-dark/80 shadow-glow transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_0_30px_rgba(216,102,10,0.3)] overflow-hidden">
            <img src="/logo-perezh.png" alt="PÉREZ H" className="h-full w-full object-cover" />
          </span>
          <span>
            <span className="block text-xs font-bold uppercase tracking-[0.35em] text-perez-gold/70">
              PÉREZ H
            </span>
            <span className="block text-lg font-bold text-perez-cream transition-colors group-hover:text-white">
              Menú Digital
            </span>
          </span>
        </a>

        <nav className="flex items-center gap-3">
          <a
            href="/stats"
            className="hidden items-center gap-2 rounded-full border border-white/10 glass px-4 py-2.5 text-sm font-semibold text-neutral-300 transition-all duration-300 hover:border-perez-teal/40 hover:bg-perez-teal/10 hover:text-perez-cream hover:scale-105 active:scale-95 sm:flex"
          >
            <BarChart3 size={17} />
            Estadísticas
          </a>
          <a
            href="/kitchen"
            className="hidden items-center gap-2 rounded-full border border-white/10 glass px-4 py-2.5 text-sm font-semibold text-neutral-300 transition-all duration-300 hover:border-perez-orange/40 hover:bg-perez-orange/10 hover:text-perez-gold hover:scale-105 active:scale-95 sm:flex"
          >
            <ChefHat size={17} />
            Cocina
          </a>
          <button
            type="button"
            onClick={onCartOpen}
            className="relative grid h-12 w-12 place-items-center rounded-2xl bg-perez-cream text-perez-navy-dark shadow-soft transition-all duration-300 hover:scale-110 hover:bg-perez-gold hover:shadow-glow active:scale-95"
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
