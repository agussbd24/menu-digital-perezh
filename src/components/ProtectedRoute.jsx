import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.js'

export default function ProtectedRoute({ children, requiredRole }) {
  const { isAuthenticated, user, loading } = useAuth()

  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center bg-perez-navy text-perez-cream">
        <div className="flex items-center gap-3 text-lg">
          <span className="h-5 w-5 animate-spin rounded-full border-2 border-perez-gold border-t-transparent" />
          Verificando acceso...
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (requiredRole && user?.role !== requiredRole && user?.role !== 'admin') {
    return <Navigate to="/login" replace />
  }

  return children
}
