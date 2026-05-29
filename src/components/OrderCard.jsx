import { Clock3, StickyNote, Table2, User } from 'lucide-react'
import { useElapsedTime } from '../hooks/useElapsedTime.js'
import { formatCurrency } from '../services/menuData.js'
import StatusBadge from './StatusBadge.jsx'

const statusOptions = [
  { value: 'new', label: 'Nuevo', color: 'hover:border-red-400/40 hover:bg-red-500/10 hover:text-red-200' },
  { value: 'preparing', label: 'Preparando', color: 'hover:border-perez-orange/40 hover:bg-perez-orange/10 hover:text-perez-gold' },
  { value: 'ready', label: 'Listo', color: 'hover:border-perez-teal/40 hover:bg-perez-teal/10 hover:text-perez-teal' },
  { value: 'delivered', label: 'Entregado', color: 'hover:border-neutral-400/40 hover:bg-neutral-500/10 hover:text-neutral-200' },
]

export default function OrderCard({ order, onStatusChange }) {
  const elapsed = useElapsedTime(order.createdAt)
  const createdTime = new Intl.DateTimeFormat('es-AR', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(order.createdAt))

  const isUrgent = elapsed.includes('h')

  return (
    <article
      className={`animate-fade-in-up rounded-[1.75rem] border p-6 shadow-card transition-all duration-300 ${
        isUrgent
          ? 'border-perez-orange/30 bg-perez-orange/10'
          : 'border-white/[0.08] bg-white/[0.03]'
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-neutral-400">
            <Table2 size={16} />
            <span className="text-xs font-bold uppercase tracking-wide">Mesa</span>
          </div>
          <h3 className="mt-1 text-4xl font-bold text-white">{order.tableNumber}</h3>
          {order.customerName && (
            <div className="mt-2 flex items-center gap-2 text-neutral-400">
              <User size={14} />
              <span className="text-sm">{order.customerName}</span>
            </div>
          )}
        </div>
        <StatusBadge status={order.status} />
      </div>

      <div className="mt-5 flex flex-wrap gap-2 text-sm text-neutral-300">
        <span className="inline-flex items-center gap-2 rounded-xl glass px-3 py-1.5">
          <Clock3 size={14} />
          {createdTime}
        </span>
        <span className="rounded-xl glass px-3 py-1.5">{elapsed}</span>
      </div>

      <div className="mt-5 space-y-3">
        {order.items.map((item) => (
          <div
            key={`${order.id}-${item.id}`}
            className="flex justify-between gap-4 rounded-xl bg-white/[0.02] p-3"
          >
            <div>
              <p className="font-bold text-white">
                {item.quantity}x {item.name}
              </p>
              <p className="mt-0.5 text-xs text-neutral-500">{formatCurrency(item.price)} c/u</p>
            </div>
            <span className="font-bold text-neutral-100">{formatCurrency(item.subtotal)}</span>
          </div>
        ))}
      </div>

      {order.notes && (
        <div className="mt-5 rounded-2xl border border-perez-orange/20 bg-perez-orange/10 p-4 text-sm">
          <div className="mb-2 flex items-center gap-2 font-bold text-perez-gold">
            <StickyNote size={16} />
            Observaciones
          </div>
          <p className="leading-6 text-perez-cream/80">{order.notes}</p>
        </div>
      )}

      <div className="mt-5 flex items-center justify-between border-t border-white/[0.06] pt-4">
        <span className="text-sm text-neutral-400">Total</span>
        <strong className="text-xl text-gradient">{formatCurrency(order.total)}</strong>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-2">
        {statusOptions.map((status) => (
          <button
            key={status.value}
            type="button"
            disabled={order.status === status.value}
            onClick={() => onStatusChange(order.id, status.value)}
            className={`rounded-xl border border-white/10 px-3 py-2.5 text-sm font-bold text-neutral-300 transition-all duration-300 disabled:cursor-default disabled:border-perez-orange/30 disabled:bg-gradient-to-r disabled:from-perez-orange disabled:to-perez-gold disabled:text-perez-navy-dark ${status.color}`}
          >
            {status.label}
          </button>
        ))}
      </div>
    </article>
  )
}
