import { useState, useEffect } from 'react'
import { X, Check } from 'lucide-react'
import { useToast } from '../hooks/useToast.js'

export default function TableSelectorModal({ open, onClose }) {
  const { addToast } = useToast()
  const [selectedTable, setSelectedTable] = useState('')

  useEffect(() => {
    if (open) {
      const stored = localStorage.getItem('restobar-table-number') || ''
      setSelectedTable(stored)
    }
  }, [open])

  if (!open) return null

  const handleSelectTable = (tableNum) => {
    setSelectedTable(tableNum)
    localStorage.setItem('restobar-table-number', tableNum)
    
    // Dispatch custom event to notify other components in real-time
    window.dispatchEvent(new CustomEvent('restobar-table-changed', { detail: tableNum }))
    
    addToast(`Mesa ${tableNum} seleccionada`, { type: 'success' })
    setTimeout(() => {
      onClose()
    }, 250)
  }

  const tables = Array.from({ length: 24 }, (_, i) => String(i + 1))

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/80 p-0 backdrop-blur-md sm:items-center sm:p-4 animate-fade-in">
      <div className="absolute inset-0" onClick={onClose} />
      
      <div className="relative max-h-[92vh] w-full max-w-md overflow-y-auto rounded-t-[2.5rem] border border-white/[0.08] bg-perez-navy/95 p-6 shadow-2xl backdrop-blur-2xl sm:rounded-[2.5rem] animate-slide-up flex flex-col no-scrollbar">
        <div className="flex justify-center pt-3 sm:hidden">
          <div className="h-1 w-10 rounded-full bg-white/20" />
        </div>
        <div className="mb-6 flex items-start justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-perez-gold/70">Ubicación</p>
            <h2 className="mt-1 text-2xl font-black text-white">¿En qué mesa estás?</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid h-11 w-11 place-items-center rounded-2xl border border-white/10 glass text-neutral-300 transition-all duration-300 hover:bg-white/10 hover:text-white active:scale-90"
            aria-label="Cerrar mesa"
          >
            <X size={20} />
          </button>
        </div>

        <p className="mb-6 text-sm leading-6 text-neutral-400">
          Seleccioná tu mesa en el grid de abajo para que cocina sepa exactamente a dónde llevar tu pedido de inmediato.
        </p>

        {/* Table grid selector */}
        <div className="grid grid-cols-4 gap-3">
          {tables.map((tableNum) => {
            const isSelected = selectedTable === tableNum
            return (
              <button
                key={tableNum}
                type="button"
                onClick={() => handleSelectTable(tableNum)}
                className={`relative flex aspect-square flex-col items-center justify-center rounded-2xl border text-base font-extrabold transition-all duration-300 cursor-pointer active:scale-95 hover:scale-[1.05] ${
                  isSelected
                    ? 'border-perez-orange bg-perez-orange/20 text-white shadow-glow'
                    : 'border-white/[0.08] bg-white/[0.02] text-neutral-300 hover:border-white/20 hover:bg-white/[0.06] hover:text-white'
                }`}
              >
                <span className="text-xs font-medium opacity-50 mb-0.5">Mesa</span>
                <span className="text-lg">{tableNum}</span>
                {isSelected && (
                  <span className="absolute right-2 top-2 grid h-4 w-4 place-items-center rounded-full bg-perez-orange text-perez-navy-dark text-[8px] animate-scale-in">
                    <Check size={8} strokeWidth={4} />
                  </span>
                )}
              </button>
            )
          })}
        </div>

        <button
          type="button"
          onClick={onClose}
          className="btn-ripple mt-8 w-full rounded-2xl bg-white/5 border border-white/[0.08] py-4 text-sm font-bold text-neutral-300 transition-all duration-300 hover:bg-white/10 hover:text-white active:scale-[0.98]"
        >
          Confirmar
        </button>
      </div>
    </div>
  )
}
