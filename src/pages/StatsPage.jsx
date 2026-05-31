import {
  Clock3,
  ChefHat,
  DollarSign,
  ShoppingBag,
  TrendingUp,
  Minus,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react'
import { useMemo, useState } from 'react'
import { useOrders } from '../hooks/useOrders.js'
import { formatCurrency } from '../services/menuData.js'
import { products } from '../services/menuData.js'
import Footer from '../components/Footer.jsx'

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
  const diff = d.getDate() - day + (day === 0 ? -6 : 1)
  d.setDate(diff)
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
    case 'today':
      return orders.filter((o) => new Date(o.createdAt) >= startOfDay(now))
    case 'week':
      return orders.filter((o) => new Date(o.createdAt) >= startOfWeek(now))
    case 'month':
      return orders.filter((o) => new Date(o.createdAt) >= startOfMonth(now))
    default:
      return orders
  }
}

function getYesterdayRange() {
  const now = new Date()
  const yesterdayStart = startOfDay(new Date(now))
  yesterdayStart.setDate(yesterdayStart.getDate() - 1)
  const yesterdayEnd = startOfDay(new Date(now))
  return { start: yesterdayStart, end: yesterdayEnd }
}

function getTodayRange() {
  const now = new Date()
  return { start: startOfDay(now), end: now }
}

function ComparisonBadge({ current, previous }) {
  if (previous === 0 && current === 0) return <Minus size={14} className="text-neutral-500" />
  if (previous === 0)
    return <ArrowUpRight size={14} className="text-emerald-400" />
  const pct = ((current - previous) / previous) * 100
  if (pct > 0)
    return (
      <span className="inline-flex items-center gap-0.5 text-xs font-bold text-emerald-400">
        <ArrowUpRight size={14} />+{Math.round(pct)}%
      </span>
    )
  if (pct < 0)
    return (
      <span className="inline-flex items-center gap-0.5 text-xs font-bold text-red-400">
        <ArrowDownRight size={14} />{Math.round(pct)}%
      </span>
    )
  return <Minus size={14} className="text-neutral-500" />
}

export default function StatsPage() {
  const { orders, loading, error } = useOrders({ soundEnabled: false })
  const [dateFilter, setDateFilter] = useState('all')

  const filteredOrders = useMemo(
    () => filterByDate(orders, dateFilter),
    [orders, dateFilter],
  )

  const stats = useMemo(() => {
    if (filteredOrders.length === 0) {
      return {
        totalOrders: 0,
        totalRevenue: 0,
        avgOrderValue: 0,
        avgPrepTime: 0,
        topProducts: [],
        ordersByStatus: { new: 0, preparing: 0, ready: 0, delivered: 0 },
        ordersByHour: [],
        revenueByDay: [],
        ordersByTable: [],
        salesByCategory: [],
        recentOrders: [],
        comparison: { todayOrders: 0, yesterdayOrders: 0, todayRevenue: 0, yesterdayRevenue: 0 },
      }
    }

    const totalRevenue = filteredOrders.reduce((sum, order) => sum + order.total, 0)
    const avgOrderValue = totalRevenue / filteredOrders.length

    const deliveredOrders = filteredOrders.filter(
      (o) => o.status === 'delivered' && o.deliveredAt,
    )
    const avgPrepTime =
      deliveredOrders.length > 0
        ? deliveredOrders.reduce((sum, o) => {
            const created = new Date(o.createdAt).getTime()
            const delivered = new Date(o.deliveredAt).getTime()
            return sum + (delivered - created)
          }, 0) /
          deliveredOrders.length /
          60000
        : 0

    const productCounts = {}
    filteredOrders.forEach((order) => {
      order.items.forEach((item) => {
        if (!productCounts[item.name]) {
          productCounts[item.name] = { name: item.name, count: 0, revenue: 0 }
        }
        productCounts[item.name].count += item.quantity
        productCounts[item.name].revenue += item.subtotal
      })
    })
    const topProducts = Object.values(productCounts)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)

    const ordersByStatus = { new: 0, preparing: 0, ready: 0, delivered: 0 }
    filteredOrders.forEach((order) => {
      ordersByStatus[order.status] = (ordersByStatus[order.status] || 0) + 1
    })

    const hourCounts = {}
    filteredOrders.forEach((order) => {
      const hour = new Date(order.createdAt).getHours()
      hourCounts[hour] = (hourCounts[hour] || 0) + 1
    })
    const ordersByHour = Array.from({ length: 24 }, (_, i) => ({
      hour: i,
      count: hourCounts[i] || 0,
    }))

    const dayCounts = {}
    const dayRevenues = {}
    for (let i = 6; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      const key = d.toISOString().slice(0, 10)
      dayCounts[key] = 0
      dayRevenues[key] = 0
    }
    filteredOrders.forEach((order) => {
      const key = new Date(order.createdAt).toISOString().slice(0, 10)
      if (key in dayCounts) {
        dayCounts[key]++
        dayRevenues[key] += order.total
      }
    })
    const revenueByDay = Object.entries(dayCounts).map(([date, count]) => ({
      date,
      count,
      revenue: dayRevenues[date],
      label: new Intl.DateTimeFormat('es-AR', { weekday: 'short', day: 'numeric' }).format(
        new Date(date + 'T12:00:00'),
      ),
    }))

    const tableCounts = {}
    filteredOrders.forEach((order) => {
      const t = order.tableNumber || '-'
      if (!tableCounts[t]) tableCounts[t] = { table: t, count: 0, revenue: 0 }
      tableCounts[t].count++
      tableCounts[t].revenue += order.total
    })
    const ordersByTable = Object.values(tableCounts)
      .sort((a, b) => b.count - a.count)
      .slice(0, 8)

    const categoryMap = {}
    products.forEach((p) => {
      categoryMap[p.id] = p.category
    })
    const catCounts = {}
    filteredOrders.forEach((order) => {
      order.items.forEach((item) => {
        const cat = categoryMap[item.id] || 'otros'
        if (!catCounts[cat]) catCounts[cat] = { category: cat, count: 0, revenue: 0 }
        catCounts[cat].count += item.quantity
        catCounts[cat].revenue += item.subtotal
      })
    })
    const categoryLabels = {
      hamburguesas: 'Hamburguesas',
      entradas: 'Entradas',
      papas: 'Papas',
      bebidas: 'Bebidas',
      postres: 'Postres',
      otros: 'Otros',
    }
    const salesByCategory = Object.values(catCounts)
      .map((c) => ({ ...c, label: categoryLabels[c.category] || c.category }))
      .sort((a, b) => b.revenue - a.revenue)

    const { start: todayStart, end: todayEnd } = getTodayRange()
    const { start: yesterdayStart, end: yesterdayEnd } = getYesterdayRange()
    const todayOrders = orders.filter(
      (o) => new Date(o.createdAt) >= todayStart && new Date(o.createdAt) <= todayEnd,
    )
    const yesterdayOrders = orders.filter(
      (o) => new Date(o.createdAt) >= yesterdayStart && new Date(o.createdAt) < yesterdayEnd,
    )
    const comparison = {
      todayOrders: todayOrders.length,
      yesterdayOrders: yesterdayOrders.length,
      todayRevenue: todayOrders.reduce((s, o) => s + o.total, 0),
      yesterdayRevenue: yesterdayOrders.reduce((s, o) => s + o.total, 0),
    }

    const recentOrders = filteredOrders.slice(0, 10)

    return {
      totalOrders: filteredOrders.length,
      totalRevenue,
      avgOrderValue,
      avgPrepTime,
      topProducts,
      ordersByStatus,
      ordersByHour,
      revenueByDay,
      ordersByTable,
      salesByCategory,
      recentOrders,
      comparison,
    }
  }, [filteredOrders, orders])

  const maxHourCount = useMemo(
    () => Math.max(...stats.ordersByHour.map((h) => h.count), 1),
    [stats.ordersByHour],
  )

  const maxDayRevenue = useMemo(
    () => Math.max(...stats.revenueByDay.map((d) => d.revenue), 1),
    [stats.revenueByDay],
  )

  const maxCatRevenue = useMemo(
    () => Math.max(...stats.salesByCategory.map((c) => c.revenue), 1),
    [stats.salesByCategory],
  )

  return (
    <main className="min-h-screen bg-perez-navy text-perez-cream">
      <section className="border-b border-white/[0.06] bg-[radial-gradient(ellipse_at_top_right,rgba(122,180,194,0.1),transparent_40%),#1b2c58]">
        <div className="mx-auto max-w-[1600px] px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="animate-fade-in-up">
              <div className="flex items-center gap-4">
                <a
                  href="/"
                  className="inline-flex items-center gap-2 rounded-xl glass px-3 py-2 text-sm text-neutral-400 transition-all duration-300 hover:text-white"
                >
                  <ShoppingBag size={16} />
                  Ver menú
                </a>
                <a
                  href="/kitchen"
                  className="inline-flex items-center gap-2 rounded-xl glass px-3 py-2 text-sm text-neutral-400 transition-all duration-300 hover:text-perez-gold"
                >
                  <ChefHat size={16} />
                  Cocina
                </a>
              </div>
              <div className="mt-5 flex items-center gap-4">
                <span className="grid h-14 w-14 place-items-center rounded-full bg-perez-navy-dark/80 border border-perez-teal/20 shadow-lg shadow-perez-teal/30 overflow-hidden">
                  <img src="/logo-perezh.png" alt="PÉREZ H" className="h-full w-full object-cover" />
                </span>
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.3em] text-perez-teal/70">
                    Analytics
                  </p>
                  <h1 className="text-4xl font-bold sm:text-5xl">Estadísticas</h1>
                </div>
              </div>
            </div>

            <div className="flex gap-2 animate-fade-in-up stagger-2">
              {DATE_FILTERS.map((f) => (
                <button
                  key={f.key}
                  type="button"
                  onClick={() => setDateFilter(f.key)}
                  className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-300 ${
                    dateFilter === f.key
                      ? 'bg-perez-orange/20 text-perez-gold border border-perez-orange/30'
                      : 'glass text-neutral-400 hover:text-white'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1600px] px-4 py-8 sm:px-6 lg:px-8">
        {error && (
          <div className="mb-6 rounded-2xl border border-red-400/20 bg-red-500/10 px-5 py-4 text-sm font-medium text-red-100">
            {error}
          </div>
        )}

        {loading ? (
          <div className="grid min-h-[50vh] place-items-center text-neutral-300">
            <div className="flex items-center gap-3">
              <Clock3 className="animate-spin" />
              Cargando estadísticas...
            </div>
          </div>
        ) : (
          <>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              <div className="glass-strong rounded-[1.75rem] p-6 animate-fade-in-up stagger-1 card-hover">
                <div className="mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-perez-orange/10">
                  <ShoppingBag className="text-perez-gold" size={22} />
                </div>
                <p className="text-sm font-bold text-neutral-400">Total Pedidos</p>
                <div className="mt-2 flex items-center gap-3">
                  <p className="text-4xl font-bold text-white tabular-nums">{stats.totalOrders}</p>
                  <ComparisonBadge
                    current={stats.comparison.todayOrders}
                    previous={stats.comparison.yesterdayOrders}
                  />
                </div>
              </div>

              <div className="glass-strong rounded-[1.75rem] p-6 animate-fade-in-up stagger-2 card-hover">
                <div className="mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-perez-orange/10">
                  <DollarSign className="text-perez-gold" size={22} />
                </div>
                <p className="text-sm font-bold text-neutral-400">Ingresos Totales</p>
                <div className="mt-2 flex items-center gap-3">
                  <p className="text-4xl font-bold text-gradient">
                    {formatCurrency(stats.totalRevenue)}
                  </p>
                  <ComparisonBadge
                    current={stats.comparison.todayRevenue}
                    previous={stats.comparison.yesterdayRevenue}
                  />
                </div>
              </div>

              <div className="glass-strong rounded-[1.75rem] p-6 animate-fade-in-up stagger-3 card-hover">
                <div className="mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-perez-teal/10">
                  <TrendingUp className="text-perez-teal" size={22} />
                </div>
                <p className="text-sm font-bold text-neutral-400">Ticket Promedio</p>
                <p className="mt-2 text-4xl font-bold text-white">
                  {formatCurrency(stats.avgOrderValue)}
                </p>
              </div>

              <div className="glass-strong rounded-[1.75rem] p-6 animate-fade-in-up stagger-4 card-hover">
                <div className="mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-perez-orange/10">
                  <Clock3 className="text-perez-orange" size={22} />
                </div>
                <p className="text-sm font-bold text-neutral-400">Tiempo Prom.</p>
                <p className="mt-2 text-4xl font-bold text-white">
                  {stats.avgPrepTime > 0 ? `${Math.round(stats.avgPrepTime)} min` : '-'}
                </p>
              </div>
            </div>

            <div className="mt-8 grid gap-6 lg:grid-cols-2">
              <div className="glass-strong rounded-[1.75rem] p-6 animate-fade-in-up stagger-3">
                <h3 className="mb-6 text-xl font-bold">Pedidos por Hora</h3>
                <div className="flex items-end gap-1 h-48">
                  {stats.ordersByHour.map((h) => (
                    <div key={h.hour} className="flex flex-col items-center flex-1 gap-1">
                      <div className="w-full flex justify-center">
                        <div
                          className="w-full max-w-[24px] rounded-t-lg bg-gradient-to-t from-perez-teal/60 to-perez-teal/30 transition-all duration-500"
                          style={{ height: `${(h.count / maxHourCount) * 140}px`, minHeight: h.count > 0 ? '4px' : '0px' }}
                        />
                      </div>
                      {h.hour % 3 === 0 && (
                        <span className="text-[10px] text-neutral-500 mt-1">{h.hour}h</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass-strong rounded-[1.75rem] p-6 animate-fade-in-up stagger-4">
                <h3 className="mb-6 text-xl font-bold">Ingresos por Día</h3>
                <div className="flex items-end gap-2 h-48">
                  {stats.revenueByDay.map((d) => (
                    <div key={d.date} className="flex flex-col items-center flex-1 gap-1">
                      <div className="w-full flex justify-center">
                        <div
                          className="w-full max-w-[32px] rounded-t-lg bg-gradient-to-t from-perez-gold/60 to-perez-gold/30 transition-all duration-500"
                          style={{
                            height: `${(d.revenue / maxDayRevenue) * 140}px`,
                            minHeight: d.revenue > 0 ? '4px' : '0px',
                          }}
                        />
                      </div>
                      <span className="text-[10px] text-neutral-500 mt-1 whitespace-nowrap">
                        {d.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8 grid gap-6 lg:grid-cols-2">
              <div className="glass-strong rounded-[1.75rem] p-6 animate-fade-in-up stagger-3">
                <h3 className="mb-6 text-xl font-bold">Productos Más Vendidos</h3>
                {stats.topProducts.length === 0 ? (
                  <p className="text-neutral-400">Sin datos disponibles</p>
                ) : (
                  <div className="space-y-4">
                    {stats.topProducts.map((product, index) => (
                      <div key={product.name} className="flex items-center gap-4">
                        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-perez-orange/20 to-perez-gold/5 text-sm font-bold text-perez-gold">
                          {index + 1}
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between">
                            <p className="truncate font-bold text-white">{product.name}</p>
                            <span className="ml-4 shrink-0 text-sm font-bold text-perez-gold">
                              {product.count} uds
                            </span>
                          </div>
                          <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/5">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-perez-orange to-perez-gold transition-all duration-500"
                              style={{
                                width: `${(product.count / stats.topProducts[0].count) * 100}%`,
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="glass-strong rounded-[1.75rem] p-6 animate-fade-in-up stagger-4">
                <h3 className="mb-6 text-xl font-bold">Ventas por Categoría</h3>
                {stats.salesByCategory.length === 0 ? (
                  <p className="text-neutral-400">Sin datos disponibles</p>
                ) : (
                  <div className="space-y-4">
                    {stats.salesByCategory.map((cat, index) => (
                      <div key={cat.category} className="flex items-center gap-4">
                        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-perez-teal/20 to-perez-teal/5 text-sm font-bold text-perez-teal">
                          {index + 1}
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between">
                            <p className="truncate font-bold text-white">{cat.label}</p>
                            <span className="ml-4 shrink-0 text-sm font-bold text-perez-teal">
                              {formatCurrency(cat.revenue)}
                            </span>
                          </div>
                          <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/5">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-perez-teal to-perez-teal transition-all duration-500"
                              style={{
                                width: `${(cat.revenue / maxCatRevenue) * 100}%`,
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="mt-8 grid gap-6 lg:grid-cols-2">
              <div className="glass-strong rounded-[1.75rem] p-6 animate-fade-in-up stagger-4">
                <h3 className="mb-6 text-xl font-bold">Pedidos por Mesa</h3>
                {stats.ordersByTable.length === 0 ? (
                  <p className="text-neutral-400">Sin datos disponibles</p>
                ) : (
                  <div className="space-y-3">
                    {stats.ordersByTable.map((t) => (
                      <div
                        key={t.table}
                        className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3"
                      >
                        <div className="flex items-center gap-3">
                          <span className="grid h-9 w-9 place-items-center rounded-lg bg-perez-orange/10 text-sm font-bold text-perez-gold">
                            {t.table}
                          </span>
                          <span className="text-sm font-semibold text-neutral-300">
                            {t.count} pedidos
                          </span>
                        </div>
                        <span className="text-sm font-bold text-perez-gold">
                          {formatCurrency(t.revenue)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="glass-strong rounded-[1.75rem] p-6 animate-fade-in-up stagger-5">
                <h3 className="mb-6 text-xl font-bold">Pedidos por Estado</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-2xl border border-red-400/20 bg-red-500/10 p-5">
                    <p className="text-sm font-bold text-red-200/70">Nuevos</p>
                    <p className="mt-2 text-4xl font-bold text-red-100">
                      {stats.ordersByStatus.new}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-perez-orange/20 bg-perez-orange/10 p-5">
                    <p className="text-sm font-bold text-perez-gold/70">Preparando</p>
                    <p className="mt-2 text-4xl font-bold text-perez-cream">
                      {stats.ordersByStatus.preparing}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-perez-teal/20 bg-perez-teal/10 p-5">
                    <p className="text-sm font-bold text-perez-teal/70">Listos</p>
                    <p className="mt-2 text-4xl font-bold text-perez-cream">
                      {stats.ordersByStatus.ready}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-neutral-400/20 bg-neutral-500/10 p-5">
                    <p className="text-sm font-bold text-neutral-200/70">Entregados</p>
                    <p className="mt-2 text-4xl font-bold text-neutral-100">
                      {stats.ordersByStatus.delivered}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {stats.recentOrders.length > 0 && (
              <div className="mt-8 glass-strong rounded-[1.75rem] p-6 animate-fade-in-up stagger-5">
                <h3 className="mb-6 text-xl font-bold">Pedidos Recientes</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-white/[0.06] text-neutral-400">
                        <th className="pb-3 font-bold">Mesa</th>
                        <th className="pb-3 font-bold">Cliente</th>
                        <th className="pb-3 font-bold">Productos</th>
                        <th className="pb-3 font-bold">Total</th>
                        <th className="pb-3 font-bold">Estado</th>
                        <th className="pb-3 font-bold">Hora</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.recentOrders.map((order) => (
                        <tr
                          key={order.id}
                          className="border-b border-white/[0.03] transition-colors hover:bg-white/[0.04]"
                        >
                          <td className="py-4 font-bold text-white">{order.tableNumber}</td>
                          <td className="py-4 text-neutral-300">{order.customerName || '-'}</td>
                          <td className="py-4 text-neutral-300">{order.items.length} items</td>
                          <td className="py-4 font-bold text-perez-gold">
                            {formatCurrency(order.total)}
                          </td>
                          <td className="py-4">
                            <span
                              className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${
                                order.status === 'new'
                                  ? 'bg-red-500/15 text-red-200'
                                  : order.status === 'preparing'
                                    ? 'bg-perez-orange/15 text-perez-gold'
                                    : order.status === 'ready'
                                      ? 'bg-perez-teal/15 text-perez-cream'
                                      : 'bg-neutral-500/15 text-neutral-300'
                              }`}
                            >
                              {order.status}
                            </span>
                          </td>
                          <td className="py-4 text-neutral-400">
                            {new Intl.DateTimeFormat('es-AR', {
                              hour: '2-digit',
                              minute: '2-digit',
                            }).format(new Date(order.createdAt))}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </section>
      <Footer />
    </main>
  )
}
