import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.js'
import { login as authLogin } from '../services/authService.js'
import { Shield, Lock, Eye, EyeOff, X } from 'lucide-react'

export default function AdminGuard({ children }) {
  const { user, isAuthenticated, loading } = useAuth()
  const [showReAuth, setShowReAuth] = useState(false)
  const [reAuthUser, setReAuthUser] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [logging, setLogging] = useState(false)

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

  if (user?.role === 'admin' && !reAuthUser) {
    return children
  }

  if (user?.role !== 'admin' && !reAuthUser && !showReAuth) {
    setShowReAuth(true)
  }

  async function handleReAuth(e) {
    e.preventDefault()
    setError('')
    setLogging(true)

    try {
      if (!username.trim() || !password.trim()) {
        throw new Error('Completá todos los campos')
      }
      const loggedUser = await authLogin(username.trim(), password)
      if (loggedUser.role !== 'admin') {
        throw new Error('Se requiere cuenta de administrador')
      }
      setReAuthUser(loggedUser)
      setShowReAuth(false)
    } catch (err) {
      setError(err.message || 'Credenciales incorrectas')
    } finally {
      setLogging(false)
    }
  }

  function handleCancel() {
    setShowReAuth(false)
    setReAuthUser(null)
    setUsername('')
    setPassword('')
    setError('')
  }

  if (reAuthUser) {
    return children
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-perez-navy-dark px-4">
      <div className="absolute inset-0">
        <img
          src="https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=1920"
          alt=""
          className="h-full w-full object-cover opacity-10 scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-perez-navy-dark/70 via-perez-navy-dark/90 to-perez-navy-dark" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="mb-8 flex flex-col items-center">
          <div className="relative mb-4">
            <div className="absolute -inset-3 rounded-full bg-gradient-to-r from-perez-orange/20 via-perez-gold/20 to-perez-orange/20 blur-xl animate-pulse" />
            <div className="relative grid h-24 w-24 place-items-center rounded-full border-2 border-white/10 bg-perez-navy shadow-[0_0_60px_rgba(216,102,10,0.25)]">
              <Shield size={40} className="text-perez-gold" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white">Acceso Admin</h1>
          <p className="mt-2 text-sm text-perez-cream/50">
            Ingresá credenciales de administrador para continuar
          </p>
        </div>

        <div className="glass-strong rounded-3xl border border-white/[0.08] p-8">
          {error && (
            <div className="mb-6 rounded-xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm font-medium text-red-200">
              {error}
            </div>
          )}

          <form onSubmit={handleReAuth} className="space-y-5">
            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-neutral-400">
                Usuario
              </label>
              <div className="relative">
                <Shield size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/[0.05] py-3.5 pl-12 pr-4 text-white placeholder-neutral-500 outline-none transition-all duration-300 focus:border-perez-orange/40 focus:bg-white/[0.08] focus:ring-2 focus:ring-perez-orange/20"
                  placeholder="Usuario admin"
                  autoComplete="username"
                  autoFocus
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-neutral-400">
                Contraseña
              </label>
              <div className="relative">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/[0.05] py-3.5 pl-12 pr-12 text-white placeholder-neutral-500 outline-none transition-all duration-300 focus:border-perez-orange/40 focus:bg-white/[0.08] focus:ring-2 focus:ring-perez-orange/20"
                  placeholder="••••••••"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500 transition-colors hover:text-white cursor-pointer"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={handleCancel}
                className="flex-1 rounded-xl border border-white/10 bg-white/[0.05] py-3.5 text-sm font-semibold text-neutral-400 transition-all hover:bg-white/[0.08] hover:text-white cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={logging}
                className="flex-1 rounded-xl bg-gradient-to-r from-perez-orange to-perez-orange-dark py-3.5 text-sm font-bold text-white shadow-[0_8px_30px_rgba(216,102,10,0.3)] transition-all duration-300 hover:shadow-[0_12px_40px_rgba(216,102,10,0.45)] hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {logging ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Verificando...
                  </span>
                ) : (
                  'Ingresar'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
