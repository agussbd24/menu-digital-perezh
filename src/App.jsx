import { useEffect } from 'react'
import { CartProvider } from './context/CartContext.jsx'
import { ToastProvider } from './context/ToastContext.jsx'
import KitchenPage from './pages/KitchenPage.jsx'
import MenuPage from './pages/MenuPage.jsx'
import StatsPage from './pages/StatsPage.jsx'
import CursorTrail from './components/CursorTrail.jsx'

function ScrollRevealObserver() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    )

    const elements = document.querySelectorAll('.reveal-up')
    elements.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [])

  return null
}

export default function App() {
  const pathname = window.location.pathname

  if (pathname.startsWith('/kitchen')) {
    return (
      <ToastProvider>
        <CartProvider>
          <CursorTrail />
          <ScrollRevealObserver />
          <KitchenPage />
        </CartProvider>
      </ToastProvider>
    )
  }

  if (pathname.startsWith('/stats')) {
    return (
      <ToastProvider>
        <CartProvider>
          <CursorTrail />
          <ScrollRevealObserver />
          <StatsPage />
        </CartProvider>
      </ToastProvider>
    )
  }

  return (
    <ToastProvider>
      <CartProvider>
        <CursorTrail />
        <ScrollRevealObserver />
        <MenuPage />
      </CartProvider>
    </ToastProvider>
  )
}
