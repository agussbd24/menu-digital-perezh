import { useMemo, useState } from 'react'
import { useOrders } from '../../hooks/useOrders.js'
import { formatCurrency } from '../../services/menuData.js'
import {
  Download, FileSpreadsheet, FileText, Loader2, TrendingUp, TrendingDown,
  ShoppingBag, DollarSign, Clock, BarChart3, PieChart, Star, Calendar,
  Users, Hash,
} from 'lucide-react'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'

const DATE_FILTERS = [
  { key: 'today', label: 'Hoy' },
  { key: 'week', label: 'Esta semana' },
  { key: 'month', label: 'Este mes' },
  { key: 'all', label: 'Todo' },
]

const STATUS_LABELS = {
  new: 'Nuevo',
  preparing: 'Preparando',
  ready: 'Listo',
  delivered: 'Entregado',
}

const STATUS_COLORS = {
  new: 'bg-blue-500/15 text-blue-400',
  preparing: 'bg-amber-500/15 text-amber-400',
  ready: 'bg-emerald-500/15 text-emerald-400',
  delivered: 'bg-neutral-500/15 text-neutral-400',
}

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

function getPrevPeriodRange(filter) {
  const now = new Date()
  let start, end
  switch (filter) {
    case 'today': {
      end = startOfDay(now)
      start = new Date(end)
      start.setDate(start.getDate() - 1)
      break
    }
    case 'week': {
      end = startOfWeek(now)
      start = new Date(end)
      start.setDate(start.getDate() - 7)
      break
    }
    case 'month': {
      end = startOfMonth(now)
      start = new Date(end)
      start.setMonth(start.getMonth() - 1)
      break
    }
    default: return null
  }
  return { start, end }
}

function StatCard({ icon: Icon, label, value, sub, color = 'text-white', trend }) {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 transition-all hover:bg-white/[0.04]">
      <div className="flex items-center justify-between">
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-white/[0.06]">
          <Icon size={18} className="text-neutral-400" />
        </div>
        {trend !== undefined && trend !== null && (
          <span className={`flex items-center gap-1 text-xs font-bold ${trend >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            {trend >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
            {Math.abs(trend)}%
          </span>
        )}
      </div>
      <p className="mt-3 text-xs font-bold uppercase tracking-wider text-neutral-400">{label}</p>
      <p className={`mt-1 text-2xl font-bold ${color}`}>{value}</p>
      {sub && <p className="mt-1 text-xs text-neutral-500">{sub}</p>}
    </div>
  )
}

function BarChartSimple({ data, maxVal, colorClass = 'bg-perez-orange', labelFn }) {
  if (!data.length || maxVal === 0) return null
  return (
    <div className="flex items-end gap-1" style={{ height: 140 }}>
      {data.map((d, i) => {
        const pct = Math.round((d.value / maxVal) * 100)
        return (
          <div key={i} className="group relative flex flex-1 flex-col items-end gap-1">
            <div className="w-full flex justify-center">
              <span className="hidden group-hover:inline rounded-lg bg-perez-navy-dark/95 border border-white/10 px-2 py-1 text-[10px] font-bold text-white whitespace-nowrap shadow-lg z-10">
                {labelFn ? labelFn(d) : d.value}
              </span>
            </div>
            <div
              className={`w-full rounded-t-md ${colorClass} transition-all duration-300 min-h-[2px]`}
              style={{ height: `${Math.max(pct, 3)}%` }}
            />
            <span className="text-[10px] font-bold text-neutral-500 truncate max-w-full text-center">{d.label}</span>
          </div>
        )
      })}
    </div>
  )
}

export default function StatsExporter() {
  const { orders, loading } = useOrders({ soundEnabled: false })
  const [dateFilter, setDateFilter] = useState('all')
  const [exporting, setExporting] = useState(false)

  const filtered = useMemo(() => filterByDate(orders, dateFilter), [orders, dateFilter])

  const stats = useMemo(() => {
    if (filtered.length === 0) return null

    const totalRevenue = filtered.reduce((s, o) => s + o.total, 0)
    const avgOrder = totalRevenue / filtered.length
    const totalItems = filtered.reduce((s, o) => s + o.items.reduce((is2, i) => is2 + i.quantity, 0), 0)
    const avgItems = totalItems / filtered.length

    const now = new Date()
    const yesterday = new Date(now)
    yesterday.setDate(yesterday.getDate() - 1)
    const yesterdayOrders = orders.filter((o) => {
      const d = new Date(o.createdAt)
      return d >= startOfDay(yesterday) && d < startOfDay(now)
    })
    const todayOrders = orders.filter((o) => new Date(o.createdAt) >= startOfDay(now))
    const revenueTrend = yesterdayOrders.length > 0
      ? Math.round(((todayOrders.length - yesterdayOrders.length) / yesterdayOrders.length) * 100)
      : 0

    const prevRange = getPrevPeriodRange(dateFilter)
    let prevOrders = []
    let prevRevenue = 0
    let prevAvgOrder = 0
    let periodRevenueTrend = null
    let periodOrderTrend = null
    if (prevRange) {
      prevOrders = orders.filter((o) => {
        const d = new Date(o.createdAt)
        return d >= prevRange.start && d < prevRange.end
      })
      prevRevenue = prevOrders.reduce((s, o) => s + o.total, 0)
      prevAvgOrder = prevOrders.length > 0 ? prevRevenue / prevOrders.length : 0
      periodRevenueTrend = prevRevenue > 0 ? Math.round(((totalRevenue - prevRevenue) / prevRevenue) * 100) : 0
      periodOrderTrend = prevOrders.length > 0 ? Math.round(((filtered.length - prevOrders.length) / prevOrders.length) * 100) : 0
    }

    const statusCounts = { new: 0, preparing: 0, ready: 0, delivered: 0 }
    filtered.forEach((o) => {
      if (statusCounts[o.status] !== undefined) statusCounts[o.status]++
    })

    const productCounts = {}
    filtered.forEach((o) => {
      o.items.forEach((item) => {
        if (!productCounts[item.name]) productCounts[item.name] = { name: item.name, count: 0, revenue: 0 }
        productCounts[item.name].count += item.quantity
        productCounts[item.name].revenue += item.subtotal
      })
    })
    const topProducts = Object.values(productCounts).sort((a, b) => b.count - a.count).slice(0, 10)
    const topByRevenue = Object.values(productCounts).sort((a, b) => b.revenue - a.revenue).slice(0, 5)

    const categoryRevenue = {}
    filtered.forEach((o) => {
      o.items.forEach((item) => {
        const cat = item.category || 'Otros'
        if (!categoryRevenue[cat]) categoryRevenue[cat] = 0
        categoryRevenue[cat] += item.subtotal
      })
    })
    const topCategories = Object.entries(categoryRevenue)
      .map(([name, revenue]) => ({ name, revenue }))
      .sort((a, b) => b.revenue - a.revenue)

    const hourlyOrders = {}
    filtered.forEach((o) => {
      const h = new Date(o.createdAt).getHours()
      hourlyOrders[h] = (hourlyOrders[h] || 0) + 1
    })
    const peakHour = Object.entries(hourlyOrders).sort((a, b) => b[1] - a[1])[0]
    const hourlyData = Array.from({ length: 24 }, (_, i) => ({
      label: `${i}h`,
      value: hourlyOrders[i] || 0,
    }))
    const maxHourly = Math.max(...hourlyData.map((d) => d.value), 1)

    const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']
    const dayOrders = {}
    filtered.forEach((o) => {
      const d = new Date(o.createdAt).getDay()
      dayNames[d] && (dayOrders[dayNames[d]] = (dayOrders[dayNames[d]] || 0) + 1)
    })
    const dayOrder = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']
    const busiestDay = dayOrder.reduce((best, day) => (dayOrders[day] || 0) > (dayOrders[best] || 0) ? day : best, 'Lun')

    const dailyRevenueMap = {}
    filtered.forEach((o) => {
      const d = new Date(o.createdAt)
      const key = `${d.getDate()}/${d.getMonth() + 1}`
      dailyRevenueMap[key] = (dailyRevenueMap[key] || 0) + o.total
    })
    const dailyData = Object.entries(dailyRevenueMap)
      .map(([label, value]) => ({ label, value }))
      .slice(-14)
    const maxDaily = Math.max(...dailyData.map((d) => d.value), 1)

    const tableStats = {}
    filtered.forEach((o) => {
      const t = o.tableNumber || 'Sin mesa'
      if (!tableStats[t]) tableStats[t] = { table: t, orders: 0, revenue: 0, items: 0 }
      tableStats[t].orders++
      tableStats[t].revenue += o.total
      tableStats[t].items += o.items.reduce((s, i) => s + i.quantity, 0)
    })
    const tableList = Object.values(tableStats)
      .map((t) => ({ ...t, avgTicket: t.orders > 0 ? Math.round(t.revenue / t.orders) : 0 }))
      .sort((a, b) => b.revenue - a.revenue)

    const uniqueClients = new Set(filtered.map((o) => o.customerName).filter(Boolean)).size
    const unpaidEstimate = filtered.filter((o) => o.status !== 'delivered').reduce((s, o) => s + o.total, 0)

    const deliveredOrders = filtered.filter((o) => o.deliveredAt && o.createdAt)
    let avgPrepMinutes = 0
    if (deliveredOrders.length > 0) {
      const totalMinutes = deliveredOrders.reduce((s, o) => {
        return s + (new Date(o.deliveredAt).getTime() - new Date(o.createdAt).getTime()) / 60000
      }, 0)
      avgPrepMinutes = Math.round(totalMinutes / deliveredOrders.length)
    }

    return {
      totalRevenue, avgOrder, totalItems, avgItems, totalOrders: filtered.length,
      topProducts, topByRevenue, topCategories, statusCounts, peakHour, busiestDay,
      uniqueClients, unpaidEstimate, revenueTrend, hourlyData, maxHourly,
      dailyData, maxDaily, tableList, avgPrepMinutes, deliveredOrders: deliveredOrders.length,
      periodRevenueTrend, periodOrderTrend, prevRevenue, prevAvgOrder, prevOrdersCount: prevOrders.length,
    }
  }, [filtered, orders, dateFilter])

  function exportCSV() {
    setExporting(true)
    try {
      const rows = filtered.map((o) => ({
        Fecha: new Date(o.createdAt).toLocaleString('es-AR'),
        Mesa: o.tableNumber,
        Cliente: o.customerName || '',
        Items: o.items.map((i) => `${i.quantity}x ${i.name}`).join(', '),
        Total: o.total,
        Estado: STATUS_LABELS[o.status] || o.status,
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

      const ordersData = filtered.map((o) => ({
        Fecha: new Date(o.createdAt).toLocaleString('es-AR'),
        Mesa: o.tableNumber,
        Cliente: o.customerName || '',
        Productos: o.items.map((i) => `${i.quantity}x ${i.name}`).join(', '),
        Subtotal: o.total,
        Notas: o.notes || '',
        Estado: STATUS_LABELS[o.status] || o.status,
      }))
      const ws1 = XLSX.utils.json_to_sheet(ordersData)
      XLSX.utils.book_append_sheet(wb, ws1, 'Pedidos')

      if (stats?.topProducts.length) {
        const ws2 = XLSX.utils.json_to_sheet(stats.topProducts.map((p, i) => ({
          Ranking: i + 1,
          Producto: p.name,
          Unidades: p.count,
          Ingresos: p.revenue,
        })))
        XLSX.utils.book_append_sheet(wb, ws2, 'Top Productos')
      }

      if (stats?.topCategories.length) {
        const ws3 = XLSX.utils.json_to_sheet(stats.topCategories.map((c) => ({
          Categoria: c.name,
          Ingresos: c.revenue,
          '%': stats.totalRevenue > 0 ? Math.round((c.revenue / stats.totalRevenue) * 100) + '%' : '0%',
        })))
        XLSX.utils.book_append_sheet(wb, ws3, 'Por Categoria')
      }

      if (stats?.tableList.length) {
        const ws5 = XLSX.utils.json_to_sheet(stats.tableList.map((t) => ({
          Mesa: t.table,
          Pedidos: t.orders,
          Items: t.items,
          'Ticket Prom': t.avgTicket,
          Ingresos: t.revenue,
        })))
        XLSX.utils.book_append_sheet(wb, ws5, 'Por Mesa')
      }

      const ws4 = XLSX.utils.json_to_sheet([{
        'Total Pedidos': stats?.totalOrders || 0,
        'Ingresos Totales': stats?.totalRevenue || 0,
        'Ticket Promedio': stats?.avgOrder || 0,
        'Total Items': stats?.totalItems || 0,
        'Clientes Unicos': stats?.uniqueClients || 0,
        'Hora Pico': stats?.peakHour ? `${stats.peakHour[0]}:00 (${stats.peakHour[1]} pedidos)` : '-',
        'Dia Mas Obtenido': stats?.busiestDay || '-',
        'Tiempo Prep Prom': stats?.avgPrepMinutes ? `${stats.avgPrepMinutes} min` : '-',
        'Periodo': DATE_FILTERS.find((f) => f.key === dateFilter)?.label || dateFilter,
      }])
      XLSX.utils.book_append_sheet(wb, ws4, 'Resumen')

      XLSX.writeFile(wb, `reporte-perezh-${dateFilter}-${Date.now()}.xlsx`)
    } finally {
      setExporting(false)
    }
  }

  return (
    <div className="max-w-5xl space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white">Estadísticas</h2>
        <p className="mt-1 text-sm text-neutral-400">Analizá el rendimiento de tu restaurante</p>
      </div>

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

      {loading ? (
        <div className="grid min-h-[30vh] place-items-center text-neutral-400">
          <Loader2 className="animate-spin" size={24} />
        </div>
      ) : !stats ? (
        <div className="rounded-2xl border border-dashed border-white/10 p-10 text-center text-neutral-400">
          No hay datos para mostrar en este período
        </div>
      ) : (
        <>
          {/* KPI Cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              icon={DollarSign}
              label="Ingresos Totales"
              value={formatCurrency(stats.totalRevenue)}
              sub={`${stats.totalOrders} pedidos`}
              color="text-perez-gold"
              trend={stats.periodRevenueTrend}
            />
            <StatCard
              icon={ShoppingBag}
              label="Ticket Promedio"
              value={formatCurrency(stats.avgOrder)}
              sub={`${stats.avgItems.toFixed(1)} items por pedido`}
              trend={stats.prevAvgOrder > 0 ? Math.round(((stats.avgOrder - stats.prevAvgOrder) / stats.prevAvgOrder) * 100) : undefined}
            />
            <StatCard
              icon={Star}
              label="Producto Más Vendido"
              value={stats.topProducts[0]?.name || '-'}
              sub={stats.topProducts[0] ? `${stats.topProducts[0].count} unidades` : ''}
              color="text-perez-gold"
            />
            <StatCard
              icon={Clock}
              label="Tiempo Prep. Prom."
              value={stats.avgPrepMinutes > 0 ? `${stats.avgPrepMinutes} min` : '-'}
              sub={stats.avgPrepMinutes > 0 ? `${stats.deliveredOrders} pedidos medidos` : 'Sin datos de entrega'}
            />
          </div>

          {/* Period Comparison */}
          {dateFilter !== 'all' && (
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
              <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-white">
                <Calendar size={18} /> Comparativa con Período Anterior
              </h3>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-xl bg-white/[0.02] p-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-neutral-400">Ingresos</p>
                  <div className="mt-2 flex items-baseline gap-3">
                    <span className="text-2xl font-bold text-white">{formatCurrency(stats.totalRevenue)}</span>
                    {stats.periodRevenueTrend !== null && (
                      <span className={`flex items-center gap-1 text-sm font-bold ${stats.periodRevenueTrend >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                        {stats.periodRevenueTrend >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                        {Math.abs(stats.periodRevenueTrend)}%
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-xs text-neutral-500">Anterior: {formatCurrency(stats.prevRevenue)}</p>
                </div>
                <div className="rounded-xl bg-white/[0.02] p-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-neutral-400">Pedidos</p>
                  <div className="mt-2 flex items-baseline gap-3">
                    <span className="text-2xl font-bold text-white">{stats.totalOrders}</span>
                    {stats.periodOrderTrend !== null && (
                      <span className={`flex items-center gap-1 text-sm font-bold ${stats.periodOrderTrend >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                        {stats.periodOrderTrend >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                        {Math.abs(stats.periodOrderTrend)}%
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-xs text-neutral-500">Anterior: {stats.prevOrdersCount} pedidos</p>
                </div>
                <div className="rounded-xl bg-white/[0.02] p-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-neutral-400">Ticket Promedio</p>
                  <div className="mt-2">
                    <span className="text-2xl font-bold text-white">{formatCurrency(stats.avgOrder)}</span>
                  </div>
                  <p className="mt-1 text-xs text-neutral-500">Anterior: {formatCurrency(stats.prevAvgOrder)}</p>
                </div>
              </div>
            </div>
          )}

          {/* Orders by Status */}
          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
            <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-white">
              <PieChart size={18} /> Estado de Pedidos
            </h3>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {Object.entries(stats.statusCounts).map(([status, count]) => (
                <div key={status} className={`rounded-xl p-4 text-center ${STATUS_COLORS[status]}`}>
                  <p className="text-3xl font-bold">{count}</p>
                  <p className="mt-1 text-sm font-semibold">{STATUS_LABELS[status]}</p>
                  {stats.totalOrders > 0 && (
                    <p className="mt-1 text-xs opacity-60">{Math.round((count / stats.totalOrders) * 100)}%</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Daily Revenue Trend */}
          {stats.dailyData.length > 0 && (
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
              <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-white">
                <BarChart3 size={18} /> Ingresos Diarios
              </h3>
              <BarChartSimple
                data={stats.dailyData}
                maxVal={stats.maxDaily}
                colorClass="bg-gradient-to-t from-perez-orange to-perez-gold"
                labelFn={(d) => `${d.label}: ${formatCurrency(d.value)}`}
              />
            </div>
          )}

          {/* Hourly Distribution */}
          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
            <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-white">
              <Clock size={18} /> Pedidos por Hora del Día
            </h3>
            <BarChartSimple
              data={stats.hourlyData}
              maxVal={stats.maxHourly}
              colorClass="bg-perez-teal"
              labelFn={(d) => `${d.label}: ${d.value} pedidos`}
            />
          </div>

          {/* Top Products + Top by Revenue */}
          <div className="grid gap-6 lg:grid-cols-2">
            {stats.topProducts.length > 0 && (
              <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
                <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-white">
                  <BarChart3 size={18} /> Más Vendidos (por unidades)
                </h3>
                <div className="space-y-3">
                  {stats.topProducts.slice(0, 5).map((p, i) => {
                    const maxCount = stats.topProducts[0]?.count || 1
                    const pct = Math.round((p.count / maxCount) * 100)
                    return (
                      <div key={p.name}>
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-bold text-white">{i + 1}. {p.name}</span>
                          <span className="text-perez-teal font-bold">{p.count} uds</span>
                        </div>
                        <div className="mt-1 h-2 overflow-hidden rounded-full bg-white/[0.06]">
                          <div className="h-full rounded-full bg-gradient-to-r from-perez-orange to-perez-gold transition-all" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {stats.topByRevenue.length > 0 && (
              <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
                <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-white">
                  <DollarSign size={18} /> Mayores Ingresos
                </h3>
                <div className="space-y-3">
                  {stats.topByRevenue.map((p, i) => {
                    const maxRev = stats.topByRevenue[0]?.revenue || 1
                    const pct = Math.round((p.revenue / maxRev) * 100)
                    return (
                      <div key={p.name}>
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-bold text-white">{i + 1}. {p.name}</span>
                          <span className="text-perez-gold font-bold">{formatCurrency(p.revenue)}</span>
                        </div>
                        <div className="mt-1 h-2 overflow-hidden rounded-full bg-white/[0.06]">
                          <div className="h-full rounded-full bg-gradient-to-r from-perez-gold to-perez-orange transition-all" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Revenue by Category */}
          {stats.topCategories.length > 0 && (
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
              <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-white">
                <PieChart size={18} /> Ingresos por Categoría
              </h3>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {stats.topCategories.map((cat) => {
                  const pct = stats.totalRevenue > 0 ? Math.round((cat.revenue / stats.totalRevenue) * 100) : 0
                  return (
                    <div key={cat.name} className="rounded-xl border border-white/[0.04] bg-white/[0.02] p-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-white capitalize">{cat.name}</span>
                        <span className="text-xs font-bold text-perez-gold">{pct}%</span>
                      </div>
                      <p className="mt-1 text-lg font-bold text-perez-gold">{formatCurrency(cat.revenue)}</p>
                      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
                        <div className="h-full rounded-full bg-perez-orange transition-all" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Table Analysis */}
          {stats.tableList.length > 0 && (
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
              <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-white">
                <Hash size={18} /> Análisis por Mesa
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-white/[0.06]">
                      <th className="pb-3 font-bold text-neutral-400">Mesa</th>
                      <th className="pb-3 font-bold text-neutral-400 text-right">Pedidos</th>
                      <th className="pb-3 font-bold text-neutral-400 text-right">Items</th>
                      <th className="pb-3 font-bold text-neutral-400 text-right">Ticket Prom.</th>
                      <th className="pb-3 font-bold text-neutral-400 text-right">Ingresos</th>
                      <th className="pb-3 w-1/5"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.tableList.map((t) => {
                      const maxTableRev = stats.tableList[0]?.revenue || 1
                      const pct = Math.round((t.revenue / maxTableRev) * 100)
                      return (
                        <tr key={t.table} className="border-b border-white/[0.03] transition-colors hover:bg-white/[0.02]">
                          <td className="py-3 font-bold text-white">{t.table}</td>
                          <td className="py-3 text-right text-neutral-300">{t.orders}</td>
                          <td className="py-3 text-right text-neutral-300">{t.items}</td>
                          <td className="py-3 text-right text-neutral-300">{formatCurrency(t.avgTicket)}</td>
                          <td className="py-3 text-right font-bold text-perez-gold">{formatCurrency(t.revenue)}</td>
                          <td className="py-3 pl-3">
                            <div className="h-2 overflow-hidden rounded-full bg-white/[0.06]">
                              <div className="h-full rounded-full bg-gradient-to-r from-perez-orange to-perez-gold transition-all" style={{ width: `${pct}%` }} />
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Summary */}
          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-neutral-400">Total Items Vendidos</p>
                <p className="mt-1 text-xl font-bold text-white">{stats.totalItems}</p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-neutral-400">Clientes Únicos</p>
                <p className="mt-1 text-xl font-bold text-white">{stats.uniqueClients || '-'}</p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-neutral-400">Pedidos Pendientes</p>
                <p className="mt-1 text-xl font-bold text-amber-400">{stats.statusCounts.new + stats.statusCounts.preparing}</p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-neutral-400">Valor en Pedidos Activos</p>
                <p className="mt-1 text-xl font-bold text-white">{formatCurrency(stats.unpaidEstimate)}</p>
              </div>
            </div>
          </div>

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
