import { CartProvider } from './context/CartContext.jsx'
import { ToastProvider } from './context/ToastContext.jsx'
import KitchenPage from './pages/KitchenPage.jsx'
import MenuPage from './pages/MenuPage.jsx'
import StatsPage from './pages/StatsPage.jsx'

export default function App() {
  const pathname = window.location.pathname

  if (pathname.startsWith('/kitchen')) {
    return (
      <ToastProvider>
        <CartProvider>
          <KitchenPage />
        </CartProvider>
      </ToastProvider>
    )
  }

  if (pathname.startsWith('/stats')) {
    return (
      <ToastProvider>
        <CartProvider>
          <StatsPage />
        </CartProvider>
      </ToastProvider>
    )
  }

  return (
    <ToastProvider>
      <CartProvider>
        <MenuPage />
      </CartProvider>
    </ToastProvider>
  )
}
