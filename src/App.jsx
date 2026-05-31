import { CartProvider } from './context/CartContext.jsx'
import { ToastProvider } from './context/ToastContext.jsx'
import KitchenPage from './pages/KitchenPage.jsx'
import MenuPage from './pages/MenuPage.jsx'
import StatsPage from './pages/StatsPage.jsx'
import CursorTrail from './components/CursorTrail.jsx'

export default function App() {
  const pathname = window.location.pathname

  if (pathname.startsWith('/kitchen')) {
    return (
      <ToastProvider>
        <CartProvider>
          <CursorTrail />
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
          <StatsPage />
        </CartProvider>
      </ToastProvider>
    )
  }

  return (
    <ToastProvider>
      <CartProvider>
        <CursorTrail />
        <MenuPage />
      </CartProvider>
    </ToastProvider>
  )
}
