import { useMemo, useState } from 'react'
import CartDrawer from '../components/CartDrawer.jsx'
import CategoryFilter from '../components/CategoryFilter.jsx'
import CheckoutModal from '../components/CheckoutModal.jsx'
import FloatingCartButton from '../components/FloatingCartButton.jsx'
import Hero from '../components/Hero.jsx'
import Navbar from '../components/Navbar.jsx'
import OrderTracker from '../components/OrderTracker.jsx'
import ProductGrid from '../components/ProductGrid.jsx'
import SearchBar from '../components/SearchBar.jsx'
import { products } from '../services/menuData.js'

export default function MenuPage() {
  const [activeCategory, setActiveCategory] = useState('all')
  const [search, setSearch] = useState('')
  const [cartOpen, setCartOpen] = useState(false)
  const [checkoutOpen, setCheckoutOpen] = useState(false)

  const filteredProducts = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase()

    return products.filter((product) => {
      const matchesCategory = activeCategory === 'all' || product.category === activeCategory
      const matchesSearch =
        normalizedSearch.length === 0 ||
        product.name.toLowerCase().includes(normalizedSearch) ||
        product.description.toLowerCase().includes(normalizedSearch)

      return matchesCategory && matchesSearch
    })
  }, [activeCategory, search])

  const openCheckout = () => {
    setCartOpen(false)
    setCheckoutOpen(true)
  }

  return (
    <main className="min-h-screen bg-perez-navy text-perez-cream">
      <Navbar onCartOpen={() => setCartOpen(true)} />
      <Hero />

      <section className="relative z-10 mx-auto max-w-7xl px-4 pb-32 pt-10 sm:px-6 lg:px-8">
        <div className="mb-8 grid gap-5 lg:grid-cols-[1fr_auto] lg:items-end">
          <div className="animate-fade-in-up">
              <p className="text-xs font-bold uppercase tracking-[0.35em] text-perez-gold/70">
                Carta digital
              </p>
              <h2 className="mt-3 text-4xl font-bold sm:text-5xl text-white">Elegí tu próximo antojo</h2>
          </div>
          <div className="w-full lg:w-[420px] animate-fade-in-up stagger-2">
            <SearchBar value={search} onChange={setSearch} />
          </div>
        </div>

        <div className="sticky top-[72px] z-20 mb-8 border-y border-white/[0.06] bg-perez-navy/85 py-4 backdrop-blur-2xl animate-fade-in-up stagger-3">
          <CategoryFilter activeCategory={activeCategory} onChange={setActiveCategory} />
        </div>

        <ProductGrid products={filteredProducts} />
      </section>

      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        onCheckout={openCheckout}
      />
      <CheckoutModal
        open={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        onSuccess={() => setCartOpen(false)}
      />
      <FloatingCartButton onClick={() => setCartOpen(true)} />
      <OrderTracker />
    </main>
  )
}
