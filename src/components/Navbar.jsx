import { ChefHat, BarChart3, ShoppingBag } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useCart } from '../hooks/useCart.js'
import TableSelectorModal from './TableSelectorModal.jsx'

export default function Navbar({ onCartOpen }) {
  const { totalItems } = useCart()
  const [scrolled, setScrolled] = useState(false)
  const [tableNumber, setTableNumber] = useState('')
  const [tableModalOpen, setTableModalOpen] = useState(false)
  const [animateCart, setAnimateCart] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)

  useEffect(() => {
    const handleOpen = () => setModalOpen(true)
    const handleClose = () => setModalOpen(false)
    window.addEventListener('restobar-modal-open', handleOpen)
    window.addEventListener('restobar-modal-close', handleClose)
    return () => {
      window.removeEventListener('restobar-modal-open', handleOpen)
      window.removeEventListener('restobar-modal-close', handleClose)
    }
  }, [])

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    // Initial load
    setTableNumber(localStorage.getItem('restobar-table-number') || '')

    // Listener for when table changes elsewhere (like CheckoutModal or TableSelectorModal)
    const handleTableChange = (e) => {
      setTableNumber(e.detail || '')
    }

    window.addEventListener('restobar-table-changed', handleTableChange)
    return () => window.removeEventListener('restobar-table-changed', handleTableChange)
  }, [])

  // Cart bag indicator animation
  useEffect(() => {
    if (totalItems > 0) {
      setAnimateCart(true)
      const timer = setTimeout(() => setAnimateCart(false), 500)
      return () => clearTimeout(timer)
    }
  }, [totalItems])

  return (
    <>
      <header
        className={`sticky top-0 z-40 transition-all duration-500 ${
          modalOpen ? '-translate-y-full opacity-0 pointer-events-none' : ''
        } ${
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
            <span className="hidden sm:block">
              <span className="block text-xs font-bold uppercase tracking-[0.35em] text-perez-gold/70">
                PÉREZ H
              </span>
              <span className="block text-lg font-bold text-perez-cream transition-colors group-hover:text-white">
                Menú Digital
              </span>
            </span>
          </a>

          <nav className="flex items-center gap-3">
            {/* Dining table selector */}
            {tableNumber ? (
              <button
                type="button"
                onClick={() => setTableModalOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2.5 text-xs sm:text-sm font-extrabold text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.1)] transition-all duration-300 hover:scale-105 hover:bg-emerald-500/20 hover:border-emerald-500/40 active:scale-95 cursor-pointer"
              >
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                Mesa {tableNumber}
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setTableModalOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-full border border-perez-gold/30 bg-perez-gold/5 px-4 py-2.5 text-xs sm:text-sm font-extrabold text-perez-gold transition-all duration-300 hover:scale-105 hover:bg-perez-gold/15 active:scale-95 cursor-pointer"
              >
                <span className="h-2 w-2 rounded-full bg-perez-gold/40" />
                Elegir Mesa
              </button>
            )}

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
              className={`relative grid h-12 w-12 place-items-center rounded-2xl bg-perez-cream text-perez-navy-dark shadow-soft transition-all duration-500 hover:scale-110 hover:bg-perez-gold hover:shadow-glow active:scale-95 cursor-pointer ${
                animateCart ? 'animate-bounce-in scale-110 bg-perez-gold shadow-glow' : ''
              }`}
              aria-label="Abrir carrito"
            >
              <ShoppingBag size={20} />
              {totalItems > 0 && (
                <span className="absolute -right-1.5 -top-1.5 grid h-6 min-w-6 place-items-center rounded-full bg-gradient-to-r from-perez-orange to-perez-gold px-1.5 text-xs font-bold text-perez-navy-dark ring-4 ring-perez-navy animate-badge-pulse">
                  {totalItems}
                </span>
              )}
            </button>
          </nav>
        </div>
      </header>

      <TableSelectorModal 
        open={tableModalOpen} 
        onClose={() => setTableModalOpen(false)} 
      />
    </>
  )
}
