import { Bell, BellOff, ChefHat, MonitorUp, BarChart3, Package } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useOrders } from '../hooks/useOrders.js'
import { useCountUpOnView } from '../hooks/useCountUp.js'
import OrderCard from './OrderCard.jsx'
import { SkeletonKitchen } from './Skeleton.jsx'

function AnimatedMetric({ value, label, color, icon: Icon, delay = 0 }) {
  const [ref, count] = useCountUpOnView(value, 800)

  return (
    <div
      ref={ref}
      className={`glass-strong rounded-2xl p-5 transition-all duration-300 hover:scale-[1.02] ${color}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-center gap-2 mb-2">
        {Icon && <Icon size={14} className="opacity-60" />}
        <p className="text-xs font-bold uppercase tracking-wide opacity-70">{label}</p>
      </div>
      <p className="text-4xl font-bold text-white tabular-nums">{count}</p>
    </div>
  )
}

export default function KitchenDashboard() {
  const [soundEnabled, setSoundEnabled] = useState(true)
  const { orders, loading, error, changeStatus } = useOrders({ soundEnabled })

  const metrics = useMemo(
    () => ({
      active: orders.filter((order) => order.status !== 'delivered').length,
      newOrders: orders.filter((order) => order.status === 'new').length,
      preparing: orders.filter((order) => order.status === 'preparing').length,
      ready: orders.filter((order) => order.status === 'ready').length,
      delivered: orders.filter((order) => order.status === 'delivered').length,
    }),
    [orders],
  )

  const activeOrders = useMemo(
    () => orders.filter((order) => order.status !== 'delivered'),
    [orders],
  )

  return (
    <main className="min-h-screen bg-perez-navy text-perez-cream">
      <section className="border-b border-white/[0.06] bg-[radial-gradient(ellipse_at_top_left,rgba(216,102,10,0.12),transparent_40%),#1b2c58]">
        <div className="mx-auto max-w-[1600px] px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="animate-fade-in-up">
              <div className="flex items-center gap-4">
                <a
                  href="/"
                  className="inline-flex items-center gap-2 rounded-xl glass px-3 py-2 text-sm text-neutral-400 transition-all duration-300 hover:text-white hover:scale-105 active:scale-95"
                >
                  <MonitorUp size={16} />
                  Ver menú
                </a>
                <a
                  href="/stats"
                  className="inline-flex items-center gap-2 rounded-xl glass px-3 py-2 text-sm text-neutral-400 transition-all duration-300 hover:text-perez-teal hover:scale-105 active:scale-95"
                >
                  <BarChart3 size={16} />
                  Estadísticas
                </a>
              </div>
              <div className="mt-5 flex items-center gap-4">
                <span className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-perez-orange to-perez-gold text-perez-navy-dark shadow-glow animate-float">
                  <ChefHat size={28} />
                </span>
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.3em] text-perez-gold/70">
                    Realtime
                  </p>
                  <h1 className="text-4xl font-bold sm:text-5xl">Panel Cocina</h1>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-3 lg:min-w-[700px] animate-fade-in-up stagger-2">
              <AnimatedMetric
                value={metrics.active}
                label="Activos"
                icon={Package}
                delay={0}
              />
              <AnimatedMetric
                value={metrics.newOrders}
                label="Nuevos"
                icon={Bell}
                delay={50}
              />
              <AnimatedMetric
                value={metrics.preparing}
                label="Preparando"
                icon={ChefHat}
                delay={100}
              />
              <AnimatedMetric
                value={metrics.ready}
                label="Listos"
                icon={Bell}
                delay={150}
              />
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setSoundEnabled((current) => !current)}
              className="btn-ripple inline-flex items-center gap-2 rounded-xl glass px-4 py-2.5 text-sm font-semibold text-neutral-300 transition-all duration-300 hover:bg-white/10 hover:text-white active:scale-95"
            >
              {soundEnabled ? <Bell size={17} /> : <BellOff size={17} />}
              Sonido {soundEnabled ? 'activo' : 'silenciado'}
            </button>
            <span className="rounded-xl glass px-4 py-2.5 text-sm text-neutral-400">
              Sin refresh · Supabase Realtime
            </span>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1600px] px-4 py-8 sm:px-6 lg:px-8">
        {error && (
          <div className="mb-6 rounded-2xl border border-red-400/20 bg-red-500/10 px-5 py-4 text-sm font-medium text-red-100 animate-fade-in">
            {error}
          </div>
        )}

        {loading ? (
          <SkeletonKitchen />
        ) : activeOrders.length === 0 ? (
          <div className="grid min-h-[50vh] place-items-center rounded-[2rem] border border-dashed border-white/10 glass text-center animate-fade-in">
            <div className="animate-float">
              <div className="mx-auto mb-6 grid h-28 w-28 place-items-center rounded-full bg-gradient-to-br from-perez-orange/10 to-perez-gold/5 ring-1 ring-perez-orange/20">
                <ChefHat className="text-perez-gold/60" size={48} />
              </div>
              <p className="text-3xl font-bold text-white">Sin pedidos por ahora</p>
              <p className="mt-3 max-w-sm text-neutral-400">
                Los nuevos pedidos van a aparecer acá automáticamente en tiempo real.
              </p>
              <div className="mt-6 inline-flex items-center gap-2 rounded-full glass px-4 py-2 text-xs text-neutral-500">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                Conectado a Supabase Realtime
              </div>
            </div>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {activeOrders.map((order, index) => (
              <OrderCard
                key={order.id}
                order={order}
                onStatusChange={changeStatus}
                index={index}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  )
}
