const statusStyles = {
  new: 'border-red-400/30 bg-red-500/15 text-red-200 shadow-[0_0_12px_rgba(239,68,68,0.15)]',
  preparing: 'border-perez-orange/30 bg-perez-orange/15 text-perez-gold shadow-[0_0_12px_rgba(216,102,10,0.15)]',
  ready: 'border-perez-teal/30 bg-perez-teal/15 text-perez-cream shadow-[0_0_12px_rgba(122,180,194,0.15)]',
  delivered: 'border-neutral-400/30 bg-neutral-500/15 text-neutral-300',
}

const statusLabels = {
  new: 'Nuevo',
  preparing: 'Preparando',
  ready: 'Listo',
  delivered: 'Entregado',
}

const statusDots = {
  new: 'bg-red-400',
  preparing: 'bg-perez-orange',
  ready: 'bg-perez-teal',
  delivered: 'bg-neutral-400',
}

export default function StatusBadge({ status }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold uppercase tracking-wide transition-all duration-300 ${
        statusStyles[status] || statusStyles.new
      }`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${statusDots[status] || statusDots.new} ${status === 'new' ? 'animate-pulse' : ''}`} />
      {statusLabels[status] || status}
    </span>
  )
}
