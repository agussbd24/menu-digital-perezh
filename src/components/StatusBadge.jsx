const statusStyles = {
  new: 'border-red-400/30 bg-red-500/15 text-red-200',
  preparing: 'border-perez-orange/30 bg-perez-orange/15 text-perez-gold',
  ready: 'border-perez-teal/30 bg-perez-teal/15 text-perez-cream',
  delivered: 'border-neutral-400/30 bg-neutral-500/15 text-neutral-300',
}

const statusLabels = {
  new: 'Nuevo',
  preparing: 'Preparando',
  ready: 'Listo',
  delivered: 'Entregado',
}

export default function StatusBadge({ status }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1.5 text-xs font-bold uppercase tracking-wide ${
        statusStyles[status] || statusStyles.new
      }`}
    >
      {statusLabels[status] || status}
    </span>
  )
}
