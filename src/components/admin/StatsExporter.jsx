import { useMemo, useState } from 'react'
import { useOrders } from '../../hooks/useOrders.js'
import { formatCurrency, products as allProducts } from '../../services/menuData.js'
import { Download, FileSpreadsheet, FileText, Loader2 } from 'lucide-react'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'

const DATE_FILTERS = [
  { key: 'today', label: 'Hoy' },
  { key: 'week', label: 'Esta semana' },
  { key: 'month', label: 'Este mes' },
  { key: 'all', label: 'Todo' },
]

function startOfDay(date) {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  return d
}

function startOfWeek(date) {
  const d = new Date(date)
  const day = d.getDay()
  d.setDate(d.getDate() - day + (day === 0 ? -6 : 1))
  d.setHours(0, 0, 0, 0)
  return d
}

function startOfMonth(date) {
  const d = new Date(date)
  d.setDate(1)
  d.setHours(0, 0, 0, 0)
  return d
}

function filterByDate(orders, filter) {
  const now = new Date()
  switch (filter) {
    case 'today': return orders.filter((o) => new Date(o.createdAt) >= startOfDay(now))
    case 'week': return orders.filter((o) => new Date(o.createdAt) >= startOfWeek(now))
    case 'month': return orders.filter((o) => new Date(o.createdAt) >= startOfMonth(now))
    default: return orders
  }
}

export default function StatsExporter() {
  const { orders, loading } = useOrders({ soundEnabled: false })
  const [dateFilter, setDateFilter] = useState('all')
  const [exporting, setExporting] = useState(false)

  const filtered = useMemo(() => filterByDate(orders, dateFilter), [orders, dateFilter])

  const summary = useMemo(() => {
    if (filtered.length === 0) return null

    const totalRevenue = filtered.reduce((s, o) => s + o.total, 0)
    const avgOrder = totalRevenue / filtered.length

    const productCounts = {}
    filtered.forEach((o) => {
      o.items.forEach((item) => {
        if (!productCounts[item.name]) productCounts[item.name] = { name: item.name, count: 0, revenue: 0 }
        productCounts[item.name].count += item.quantity
        productCounts[item.name].revenue += item.subtotal
      })
    })
    const topProducts = Object.values(productCounts).sort((a, b) => b.count - a.count).slice(0, 10)

    return { totalRevenue, avgOrder, topProducts, totalOrders: filtered.length }
  }, [filtered])

  function exportCSV() {
    setExporting(true)
    try {
      const rows = filtered.map((o) => ({
        Fecha: new Date(o.createdAt).toLocaleString('es-AR'),
        Mesa: o.tableNumber,
        Cliente: o.customerName || '',
        Items: o.items.map((i) => `${i.quantity}x ${i.name}`).join(', '),
        Total: o.total,
        Estado: o.status,
      }))

      const ws = XLSX.utils.json_to_sheet(rows)
      const csv = XLSX.utils.sheet_to_csv(ws)
      const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8' })
      saveAs(blob, `pedidos-perezh-${dateFilter}-${Date.now()}.csv`)
    } finally {
      setExporting(false)
    }
  }

  function exportExcel() {
    setExporting(true)
    try {
      const wb = XLSX.utils.book_new()

      // Hoja 1: Pedidos
      const ordersData = filtered.map((o) => ({
        Fecha: new Date(o.createdAt).toLocaleString('es-AR'),
        Mesa: o.tableNumber,
        Cliente: o.customerName || '',
        Productos: o.items.map((i) => `${i.quantity}x ${i.name}`).join(', '),
        Subtotal: o.total,
        Notas: o.notes || '',
        Estado: o.status,
      }))
      const ws1 = XLSX.utils.json_to_sheet(ordersData)
      XLSX.utils.book_append_sheet(wb, ws1, 'Pedidos')

      // Hoja 2: Top Productos
      if (summary?.topProducts.length) {
        const ws2 = XLSX.utils.json_to_sheet(summary.topProducts.map((p, i) => ({
          Ranking: i + 1,
          Producto: p.name,
          Unidades: p.count,
          Ingresos: p.revenue,
        })))
        XLSX.utils.book_append_sheet(wb, ws2, 'Top Productos')
      }

      // Hoja 3: Resumen
      const ws3 = XLSX.utils.json_to_sheet([{
        'Total Pedidos': summary?.totalOrders || 0,
        'Ingresos Totales': summary?.totalRevenue || 0,
        'Ticket Promedio': summary?.avgOrder || 0,
        'Período': DATE_FILTERS.find((f) => f.key === dateFilter)?.label || dateFilter,
      }])
      XLSX.utils.book_append_sheet(wb, ws3, 'Resumen')

      XLSX.writeFile(wb, `reporte-perezh-${dateFilter}-${Date.now()}.xlsx`)
    } finally {
      setExporting(false)
    }
  }

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white">Exportar Métricas</h2>
        <p className="mt-1 text-sm text-neutral-400">Descargá los datos de pedidos en CSV o Excel</p>
      </div>

      {/* Date filter */}
      <div className="flex gap-2">
        {DATE_FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setDateFilter(f.key)}
            className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition-all cursor-pointer ${
              dateFilter === f.key
                ? 'bg-perez-orange/20 text-perez-gold border border-perez-orange/30'
                : 'glass text-neutral-400 hover:text-white border border-transparent'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Summary */}
      {loading ? (
        <div className="grid min-h-[30vh] place-items-center text-neutral-400">
          <Loader2 className="animate-spin" size={24} />
        </div>
      ) : !summary ? (
        <div className="rounded-2xl border border-dashed border-white/10 p-10 text-center text-neutral-400">
          No hay pedidos para exportar en este período
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
              <p className="text-xs font-bold uppercase tracking-wider text-neutral-400">Pedidos</p>
              <p className="mt-2 text-3xl font-bold text-white">{summary.totalOrders}</p>
            </div>
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
              <p className="text-xs font-bold uppercase tracking-wider text-neutral-400">Ingresos</p>
              <p className="mt-2 text-3xl font-bold text-perez-gold">{formatCurrency(summary.totalRevenue)}</p>
            </div>
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
              <p className="text-xs font-bold uppercase tracking-wider text-neutral-400">Ticket Prom.</p>
              <p className="mt-2 text-3xl font-bold text-white">{formatCurrency(summary.avgOrder)}</p>
            </div>
          </div>

          {/* Top products */}
          {summary.topProducts.length > 0 && (
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
              <h3 className="mb-4 text-lg font-bold text-white">Top Productos</h3>
              <div className="space-y-3">
                {summary.topProducts.map((p, i) => (
                  <div key={p.name} className="flex items-center gap-3">
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-perez-orange/10 text-xs font-bold text-perez-gold">{i + 1}</span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-bold text-white">{p.name}</p>
                    </div>
                    <span className="text-sm font-bold text-perez-teal">{p.count} uds</span>
                    <span className="text-sm font-bold text-perez-gold">{formatCurrency(p.revenue)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Export buttons */}
          <div className="flex gap-4">
            <button
              onClick={exportCSV}
              disabled={exporting}
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.06] px-6 py-3 text-sm font-bold text-neutral-300 transition-all hover:bg-white/[0.1] hover:text-white cursor-pointer"
            >
              {exporting ? <Loader2 size={16} className="animate-spin" /> : <FileText size={16} />}
              Descargar CSV
            </button>
            <button
              onClick={exportExcel}
              disabled={exporting}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 px-6 py-3 text-sm font-bold text-white transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              {exporting ? <Loader2 size={16} className="animate-spin" /> : <FileSpreadsheet size={16} />}
              Descargar Excel
            </button>
          </div>
        </>
      )}
    </div>
  )
}
