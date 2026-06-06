import { useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { CartProvider } from './context/CartContext.jsx'
import { ToastProvider } from './context/ToastContext.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import KitchenPage from './pages/KitchenPage.jsx'
import LandingPage from './pages/LandingPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import MenuPage from './pages/MenuPage.jsx'
import StatsPage from './pages/StatsPage.jsx'
import AdminPage from './pages/AdminPage.jsx'
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

    const observeAll = () => {
      document.querySelectorAll('.reveal-up:not(.visible)').forEach((el) => observer.observe(el))
    }

    observeAll()

    const mutationObserver = new MutationObserver(observeAll)
    mutationObserver.observe(document.body, { childList: true, subtree: true })

    return () => {
      observer.disconnect()
      mutationObserver.disconnect()
    }
  }, [])

  return null
}

function AppLayout({ children }) {
  return (
    <ToastProvider>
      <CartProvider>
        <CursorTrail />
        <ScrollRevealObserver />
        {children}
      </CartProvider>
    </ToastProvider>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<AppLayout><LandingPage /></AppLayout>} />
          <Route path="/menu" element={<AppLayout><MenuPage /></AppLayout>} />
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/kitchen"
            element={
              <AppLayout>
                <ProtectedRoute>
                  <KitchenPage />
                </ProtectedRoute>
              </AppLayout>
            }
          />
          <Route
            path="/stats"
            element={
              <AppLayout>
                <ProtectedRoute>
                  <StatsPage />
                </ProtectedRoute>
              </AppLayout>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="*"
            element={
              <AppLayout>
                <LandingPage />
              </AppLayout>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
