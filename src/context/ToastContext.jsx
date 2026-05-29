import { useCallback, useMemo, useState } from 'react'
import { ToastContext } from './toastContext.js'

let toastId = 0

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const addToast = useCallback((message, { type = 'success', duration = 3000 } = {}) => {
    const id = ++toastId
    setToasts((current) => [...current, { id, message, type, exiting: false }])

    setTimeout(() => {
      setToasts((current) =>
        current.map((toast) => (toast.id === id ? { ...toast, exiting: true } : toast)),
      )
      setTimeout(() => {
        setToasts((current) => current.filter((toast) => toast.id !== id))
      }, 200)
    }, duration)
  }, [])

  const removeToast = useCallback((id) => {
    setToasts((current) =>
      current.map((toast) => (toast.id === id ? { ...toast, exiting: true } : toast)),
    )
    setTimeout(() => {
      setToasts((current) => current.filter((toast) => toast.id !== id))
    }, 200)
  }, [])

  const value = useMemo(() => ({ toasts, addToast, removeToast }), [toasts, addToast, removeToast])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed bottom-24 left-1/2 z-[100] flex -translate-x-1/2 flex-col items-center gap-3 sm:bottom-6">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            onClick={() => removeToast(toast.id)}
            className={`
              ${toast.exiting ? 'animate-toast-out' : 'animate-toast-in'}
              cursor-pointer rounded-2xl px-5 py-3 font-semibold text-white shadow-2xl
              ${toast.type === 'success' && 'bg-perez-orange/90 backdrop-blur-xl'}
              ${toast.type === 'error' && 'bg-red-500/90 backdrop-blur-xl'}
              ${toast.type === 'info' && 'bg-perez-teal/90 backdrop-blur-xl'}
            `}
          >
            {toast.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}
