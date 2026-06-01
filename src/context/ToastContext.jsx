import { CheckCircle2, XCircle, Info, X } from 'lucide-react'
import { useCallback, useMemo, useState, useRef } from 'react'
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

function ToastItem({ toast, onRemove }) {
  const [dragX, setDragX] = useState(0)
  const [dragging, setDragging] = useState(false)
  const startX = useRef(0)

  const handleTouchStart = (e) => {
    startX.current = e.touches[0].clientX
    setDragging(true)
  }

  const handleTouchMove = (e) => {
    if (!dragging) return
    const delta = e.touches[0].clientX - startX.current
    setDragX(delta)
  }

  const handleTouchEnd = () => {
    setDragging(false)
    if (Math.abs(dragX) > 80) {
      onRemove(toast.id)
    }
    setDragX(0)
  }

  const Icon = TOAST_ICONS[toast.type] || CheckCircle2

  return (
    <div
      className={`
        ${toast.exiting ? 'animate-toast-out' : 'animate-toast-in'}
        group relative flex items-center gap-3 overflow-hidden rounded-2xl border border-white/10
        bg-gradient-to-r ${TOAST_STYLES[toast.type]}
        px-5 py-3.5 font-semibold text-white shadow-2xl backdrop-blur-xl
      `}
      style={{ transform: `translateX(${dragX}px)`, opacity: dragX !== 0 ? Math.max(0, 1 - Math.abs(dragX) / 200) : 1, transition: dragging ? 'none' : 'transform 0.2s ease-out, opacity 0.2s ease-out' }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <Icon size={19} className="shrink-0" />
      <span className="pr-2 text-sm">{toast.message}</span>
      <button
        type="button"
        onClick={() => onRemove(toast.id)}
        className="ml-1 shrink-0 rounded-lg p-1 text-white/60 transition-colors hover:bg-white/10 hover:text-white"
      >
        <X size={14} />
      </button>
      <div className="absolute bottom-0 left-0 h-0.5 bg-white/30 timer-progress" style={{ width: '100%', animationDuration: `${toast.duration}ms` }} />
    </div>
  )
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
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
        ))}
      </div>
    </ToastContext.Provider>
  )
}
