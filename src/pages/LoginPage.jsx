import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.js'
import { Lock, User, Eye, EyeOff } from 'lucide-react'

export default function LoginPage() {
  const { login, loading } = useAuth()
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!username.trim() || !password.trim()) {
      setError('Completá todos los campos')
      return
    }

    try {
      const user = await login(username.trim(), password)
      if (user.role === 'admin') {
        navigate('/admin', { replace: true })
      } else {
        navigate('/kitchen', { replace: true })
      }
    } catch (err) {
      setError(err.message || 'Credenciales incorrectas')
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-perez-navy-dark px-4">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src="https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=1920"
          alt=""
          className="h-full w-full object-cover opacity-10 scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-perez-navy-dark/70 via-perez-navy-dark/90 to-perez-navy-dark" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center">
          <div className="relative mb-4">
            <div className="absolute -inset-3 rounded-full bg-gradient-to-r from-perez-orange/20 via-perez-gold/20 to-perez-orange/20 blur-xl animate-pulse" />
            <div className="relative h-24 w-24 overflow-hidden rounded-full border-2 border-white/10 bg-perez-navy shadow-[0_0_60px_rgba(216,102,10,0.25)]">
              <img src="/logo-perezh.png" alt="PÉREZ H" className="h-full w-full object-cover" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white">Panel de Control</h1>
          <p className="mt-2 text-sm text-perez-cream/50">Ingresá tus credenciales para acceder</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="glass-strong rounded-3xl border border-white/[0.08] p-8">
          {error && (
            <div className="mb-6 rounded-xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm font-medium text-red-200">
              {error}
            </div>
          )}

          <div className="space-y-5">
            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-neutral-400">
                Usuario
              </label>
              <div className="relative">
                <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/[0.05] py-3.5 pl-12 pr-4 text-white placeholder-neutral-500 outline-none transition-all duration-300 focus:border-perez-orange/40 focus:bg-white/[0.08] focus:ring-2 focus:ring-perez-orange/20"
                  placeholder="Tu usuario"
                  autoComplete="username"
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
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-8 w-full rounded-xl bg-gradient-to-r from-perez-orange to-perez-orange-dark py-4 text-lg font-bold text-white shadow-[0_8px_30px_rgba(216,102,10,0.3)] transition-all duration-300 hover:shadow-[0_12px_40px_rgba(216,102,10,0.45)] hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Ingresando...
              </span>
            ) : (
              'Ingresar'
            )}
          </button>

          <div className="mt-6 text-center">
            <a href="/" className="text-sm text-neutral-500 transition-colors hover:text-perez-cream">
              ← Volver al menú
            </a>
          </div>
        </form>
      </div>
    </main>
  )
}
