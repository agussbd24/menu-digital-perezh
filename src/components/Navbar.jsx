import { ChefHat, BarChart3, ShoppingBag, Shield, LogOut } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useCart } from '../hooks/useCart.js'
import { useAuth } from '../hooks/useAuth.js'
import TableSelectorModal from './TableSelectorModal.jsx'

export default function Navbar({ onCartOpen }) {
  const { totalItems } = useCart()
  const { isAuthenticated, isAdmin, user, logout } = useAuth()
  const location = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const [tableNumber, setTableNumber] = useState('')
  const [tableModalOpen, setTableModalOpen] = useState(false)
  const [animateCart, setAnimateCart] = useState(false)

  const isPrivatePanel = ['/kitchen', '/stats', '/admin'].some((p) => location.pathname.startsWith(p))

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setTableNumber(localStorage.getItem('restobar-table-number') || '')
    const handleTableChange = (e) => setTableNumber(e.detail || '')
    window.addEventListener('restobar-table-changed', handleTableChange)
    return () => window.removeEventListener('restobar-table-changed', handleTableChange)
  }, [])

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
            {isAuthenticated && isPrivatePanel && (
              <>
                <a
                  href="/kitchen"
                  className={`hidden items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-semibold transition-all duration-300 hover:scale-105 active:scale-95 sm:flex ${
                    location.pathname.startsWith('/kitchen')
                      ? 'border-perez-orange/40 bg-perez-orange/10 text-perez-gold'
                      : 'border-white/10 glass text-neutral-300 hover:border-perez-orange/40 hover:bg-perez-orange/10 hover:text-perez-gold'
                  }`}
                >
                  <ChefHat size={17} />
                  Cocina
                </a>
                <a
                  href="/stats"
                  className={`hidden items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-semibold transition-all duration-300 hover:scale-105 active:scale-95 sm:flex ${
                    location.pathname.startsWith('/stats')
                      ? 'border-perez-teal/40 bg-perez-teal/10 text-perez-cream'
                      : 'border-white/10 glass text-neutral-300 hover:border-perez-teal/40 hover:bg-perez-teal/10 hover:text-perez-cream'
                  }`}
                >
                  <BarChart3 size={17} />
                  Estadísticas
                </a>
                {isAdmin && (
                  <a
                    href="/admin"
                    className={`hidden items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-semibold transition-all duration-300 hover:scale-105 active:scale-95 sm:flex ${
                      location.pathname.startsWith('/admin')
                        ? 'border-perez-gold/40 bg-perez-gold/10 text-perez-gold'
                        : 'border-white/10 glass text-neutral-300 hover:border-perez-gold/40 hover:bg-perez-gold/10 hover:text-perez-gold'
                    }`}
                  >
                    <Shield size={17} />
                    Admin
                  </a>
                )}
                <button
                  onClick={logout}
                  className="hidden items-center gap-2 rounded-full border border-white/10 glass px-4 py-2.5 text-sm font-semibold text-neutral-300 transition-all duration-300 hover:border-red-400/40 hover:bg-red-500/10 hover:text-red-400 hover:scale-105 active:scale-95 sm:flex cursor-pointer"
                  title="Cerrar sesión"
                >
                  <LogOut size={17} />
                </button>
              </>
            )}

            {!isPrivatePanel && (
              <>
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
              </>
            )}

            {!isPrivatePanel && (
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
            )}
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
