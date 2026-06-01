import { useState, useEffect, useRef, useCallback } from 'react'
import { X, Minus, Plus, ShoppingBag } from 'lucide-react'
import { useCart } from '../hooks/useCart.js'
import { useToast } from '../hooks/useToast.js'
import { formatCurrency, standardAddons } from '../services/menuData.js'

export default function ProductModal({ product, open, onClose }) {
  const { addItem } = useCart()
  const { addToast } = useToast()
  const [selectedAddons, setSelectedAddons] = useState([])
  const [notes, setNotes] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [imgError, setImgError] = useState(false)
  const [dragY, setDragY] = useState(0)
  const [dragging, setDragging] = useState(false)
  const touchStart = useRef({ y: 0, time: 0 })

  const handleTouchStart = useCallback((e) => {
    touchStart.current = { y: e.touches[0].clientY, time: Date.now() }
    setDragging(true)
  }, [])

  const handleTouchMove = useCallback((e) => {
    if (!dragging) return
    const delta = e.touches[0].clientY - touchStart.current.y
    if (delta > 0) setDragY(delta)
  }, [dragging])

  const handleTouchEnd = useCallback(() => {
    setDragging(false)
    if (dragY > 120) {
      onClose()
    }
    setDragY(0)
  }, [dragY, onClose])

  useEffect(() => {
    if (open) {
      setSelectedAddons([])
      setNotes('')
      setQuantity(1)
    }
  }, [open, product])

  if (!open || !product) return null

  // Determine applicable addons based on product category
  let applicableAddons = []
  const cat = product.category
  if (['cheeseburgers', 'clasicas', 'perez', 'gourmet'].includes(cat)) {
    applicableAddons = standardAddons.burgers
  } else if (cat === 'compartir' && (product.id.includes('papas') || product.id.includes('aros'))) {
    applicableAddons = standardAddons.papas
  } else if (['bebidas', 'tragos', 'cervezas'].includes(cat)) {
    applicableAddons = standardAddons.bebidas
  }

  const handleToggleAddon = (addon) => {
    setSelectedAddons((current) =>
      current.some((a) => a.id === addon.id)
        ? current.filter((a) => a.id !== addon.id)
        : [...current, addon]
    )
  }

  const basePriceWithAddons = product.price + selectedAddons.reduce((sum, a) => sum + a.price, 0)
  const totalPrice = basePriceWithAddons * quantity

  const handleAdd = () => {
    // Add to cart with quantity
    for (let i = 0; i < quantity; i++) {
      addItem(product, selectedAddons, notes)
    }
    
    addToast(`${product.name} agregado al carrito`, { type: 'success' })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/80 p-0 backdrop-blur-md sm:items-center sm:p-4 animate-fade-in">
      <div
        className="absolute inset-0"
        onClick={onClose}
      />
      <div
        className="relative max-h-[92vh] w-full max-w-2xl overflow-hidden rounded-t-[2.5rem] border border-white/[0.08] bg-perez-navy/95 shadow-2xl backdrop-blur-2xl sm:rounded-[2.5rem] animate-slide-up flex flex-col"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)', transform: `translateY(${dragY}px)`, opacity: dragY > 0 ? Math.max(0, 1 - dragY / 400) : 1, transition: dragging ? 'none' : 'transform 0.3s ease-out, opacity 0.3s ease-out' }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        
        {/* Drag indicator */}
        <div className="flex justify-center pt-3 sm:hidden">
          <div className="h-1 w-10 rounded-full bg-white/20" />
        </div>

        {/* Hero image and close button */}
        <div className="relative aspect-[16/9] w-full shrink-0 bg-neutral-900">
          {imgError ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-perez-navy-dark to-neutral-900 text-center p-6">
              <ShoppingBag className="mb-4 text-perez-orange/40" size={56} />
              <span className="text-2xl font-bold text-perez-cream/80">{product.name}</span>
            </div>
          ) : (
            <img
              src={product.image}
              alt={product.name}
              className="h-full w-full object-cover"
              onError={() => setImgError(true)}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-perez-navy via-transparent to-transparent" />
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-full border border-white/10 bg-black/40 text-neutral-300 transition-all duration-300 hover:bg-white/20 hover:text-white hover:scale-110 active:scale-90"
            aria-label="Cerrar modal"
          >
            <X size={20} />
          </button>
          
          {product.badge && (
            <span className="absolute left-4 top-4 rounded-full bg-gradient-to-r from-perez-orange to-perez-gold px-3.5 py-1.5 text-xs font-bold uppercase tracking-wide text-perez-navy-dark shadow-lg">
              {product.badge}
            </span>
          )}
        </div>

        {/* Scrollable content area */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
          <div>
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">{product.name}</h2>
            <p className="mt-3 text-base leading-7 text-neutral-300">{product.description}</p>
            <div className="mt-4 flex items-center justify-between border-b border-white/[0.06] pb-4">
              <span className="text-sm font-bold uppercase tracking-widest text-perez-gold/70">Precio unitario base</span>
              <span className="text-2xl font-black text-white">{formatCurrency(product.price)}</span>
            </div>
          </div>

          {/* Applicable addons */}
          {applicableAddons.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <span>Personalizá tu pedido</span>
                <span className="rounded-full bg-perez-orange/10 px-2.5 py-0.5 text-xs text-perez-gold border border-perez-orange/20 font-medium">Opcional</span>
              </h3>
              <div className="grid gap-3 sm:grid-cols-2">
                {applicableAddons.map((addon) => {
                  const isSelected = selectedAddons.some((a) => a.id === addon.id)
                  return (
                    <button
                      key={addon.id}
                      type="button"
                      onClick={() => handleToggleAddon(addon)}
                      className={`flex items-center justify-between rounded-2xl border px-5 py-4 text-left transition-all duration-300 cursor-pointer ${
                        isSelected
                          ? 'border-perez-orange bg-perez-orange/10 text-white shadow-glow'
                          : 'border-white/[0.08] bg-white/[0.02] text-neutral-300 hover:border-white/20 hover:bg-white/[0.05]'
                      }`}
                    >
                      <span className="font-semibold text-sm">{addon.name}</span>
                      <span className={`text-xs font-bold ${addon.price === 0 ? 'text-neutral-500' : isSelected ? 'text-perez-gold' : 'text-neutral-400'}`}>
                        {addon.price === 0 ? 'Sin costo' : `+ ${formatCurrency(addon.price)}`}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* Observations */}
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-white">Notas o aclaraciones</h3>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows="3"
              placeholder="Ej: sin cebolla, panceta bien cocida, aderezo aparte..."
              className="w-full resize-none rounded-2xl border border-white/[0.08] glass px-5 py-4 text-sm text-white outline-none transition-all duration-300 placeholder:text-neutral-500 focus:border-perez-orange/40 focus:ring-4 focus:ring-perez-orange/10"
            />
          </div>
        </div>

        {/* Sticky bottom actions bar */}
        <div className="shrink-0 border-t border-white/[0.08] bg-perez-navy/95 backdrop-blur-xl px-20 py-4 sm:px-6 sm:py-6 space-y-3 sm:space-y-0 sm:flex sm:items-center sm:gap-4" style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom, 0px))' }}>
          {/* Quantity Selector */}
          <div className="flex items-center justify-center gap-3 rounded-2xl border border-white/[0.08] bg-black/20 p-2 sm:self-start">
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="grid h-12 w-12 place-items-center rounded-xl text-perez-gold transition-all duration-200 hover:bg-white/5 hover:text-white active:scale-90"
            >
              <Minus size={20} />
            </button>
            <span className="min-w-[2.5rem] text-center text-xl font-black text-white tabular-nums">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity((q) => q + 1)}
              className="grid h-12 w-12 place-items-center rounded-xl text-perez-gold transition-all duration-200 hover:bg-white/5 hover:text-white active:scale-90"
            >
              <Plus size={20} />
            </button>
          </div>

          {/* Action button */}
          <button
            type="button"
            onClick={handleAdd}
            className="btn-ripple flex h-14 w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-perez-orange to-perez-gold px-6 text-base font-black text-perez-navy-dark shadow-glow transition-all duration-300 hover:scale-[1.01] hover:from-perez-orange-dark hover:to-perez-orange hover:shadow-floating active:scale-95"
          >
            <ShoppingBag size={20} />
            Agregar al Pedido · {formatCurrency(totalPrice)}
          </button>
        </div>
      </div>
    </div>
  )
}
