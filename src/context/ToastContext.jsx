import { CheckCircle2, XCircle, Info, X } from 'lucide-react'
import { useCallback, useMemo, useState } from 'react'
import { ToastContext } from './toastContext.js'

let toastId = 0

const TOAST_ICONS = {
  success: CheckCircle2,
  error: XCircle,
  info: Info,
}

const TOAST_STYLES = {
  success: 'from-perez-orange/90 to-perez-gold/90',
  error: 'from-red-500/90 to-red-600/90',
  info: 'from-perez-teal/90 to-perez-teal/80',
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const addToast = useCallback((message, { type = 'success', duration = 3500 } = {}) => {
    const id = ++toastId
    setToasts((current) => [...current, { id, message, type, duration, exiting: false }])

    setTimeout(() => {
      setToasts((current) =>
        current.map((toast) => (toast.id === id ? { ...toast, exiting: true } : toast)),
      )
      setTimeout(() => {
        setToasts((current) => current.filter((toast) => toast.id !== id))
      }, 300)
    }, duration)
  }, [])

  const removeToast = useCallback((id) => {
    setToasts((current) =>
      current.map((toast) => (toast.id === id ? { ...toast, exiting: true } : toast)),
    )
    setTimeout(() => {
      setToasts((current) => current.filter((toast) => toast.id !== id))
    }, 300)
  }, [])

  const value = useMemo(() => ({ toasts, addToast, removeToast }), [toasts, addToast, removeToast])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed bottom-24 left-1/2 z-[100] flex -translate-x-1/2 flex-col items-center gap-3 sm:bottom-6">
        {toasts.map((toast) => {
          const Icon = TOAST_ICONS[toast.type] || CheckCircle2
          return (
            <div
              key={toast.id}
              className={`
                ${toast.exiting ? 'animate-toast-out' : 'animate-toast-in'}
                group relative flex items-center gap-3 overflow-hidden rounded-2xl border border-white/10
                bg-gradient-to-r ${TOAST_STYLES[toast.type]}
                px-5 py-3.5 font-semibold text-white shadow-2xl backdrop-blur-xl
              `}
            >
              <Icon size={19} className="shrink-0" />
              <span className="pr-2 text-sm">{toast.message}</span>
              <button
                type="button"
                onClick={() => removeToast(toast.id)}
                className="ml-1 shrink-0 rounded-lg p-1 text-white/60 transition-colors hover:bg-white/10 hover:text-white"
              >
                <X size={14} />
              </button>
              <div className="absolute bottom-0 left-0 h-0.5 bg-white/30 timer-progress" style={{ width: '100%', animationDuration: `${toast.duration}ms` }} />
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}
