import { Bell, BellOff, ChefHat, Loader2, MonitorUp, BarChart3 } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useOrders } from '../hooks/useOrders.js'
import OrderCard from './OrderCard.jsx'

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
                  className="inline-flex items-center gap-2 rounded-xl glass px-3 py-2 text-sm text-neutral-400 transition-all duration-300 hover:text-white"
                >
                  <MonitorUp size={16} />
                  Ver menú
                </a>
                <a
                  href="/stats"
                  className="inline-flex items-center gap-2 rounded-xl glass px-3 py-2 text-sm text-neutral-400 transition-all duration-300 hover:text-perez-teal"
                >
                  <BarChart3 size={16} />
                  Estadísticas
                </a>
              </div>
              <div className="mt-5 flex items-center gap-4">
                <span className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-perez-orange to-perez-gold text-perez-navy-dark shadow-glow">
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
              <div className="glass-strong rounded-2xl p-5">
                <p className="text-xs font-bold uppercase tracking-wide text-neutral-500">Activos</p>
                <p className="mt-2 text-4xl font-bold text-white">{metrics.active}</p>
              </div>
              <div className="rounded-2xl border border-red-400/20 bg-red-500/10 p-5">
                <p className="text-xs font-bold uppercase tracking-wide text-red-200/70">Nuevos</p>
                <p className="mt-2 text-4xl font-bold text-red-100">{metrics.newOrders}</p>
              </div>
              <div className="rounded-2xl border border-perez-orange/20 bg-perez-orange/10 p-5">
                <p className="text-xs font-bold uppercase tracking-wide text-perez-gold/70">Preparando</p>
                <p className="mt-2 text-4xl font-bold text-perez-cream">{metrics.preparing}</p>
              </div>
              <div className="rounded-2xl border border-perez-teal/20 bg-perez-teal/10 p-5">
                <p className="text-xs font-bold uppercase tracking-wide text-perez-teal/70">Listos</p>
                <p className="mt-2 text-4xl font-bold text-perez-cream">{metrics.ready}</p>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setSoundEnabled((current) => !current)}
              className="inline-flex items-center gap-2 rounded-xl glass px-4 py-2.5 text-sm font-semibold text-neutral-300 transition-all duration-300 hover:bg-white/10 hover:text-white"
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
          <div className="mb-6 rounded-2xl border border-red-400/20 bg-red-500/10 px-5 py-4 text-sm font-medium text-red-100">
            {error}
          </div>
        )}

        {loading ? (
          <div className="grid min-h-[50vh] place-items-center text-neutral-300">
            <div className="flex items-center gap-3">
              <Loader2 className="animate-spin" />
              Cargando pedidos...
            </div>
          </div>
        ) : activeOrders.length === 0 ? (
          <div className="grid min-h-[50vh] place-items-center rounded-[2rem] border border-dashed border-white/10 glass text-center animate-fade-in">
            <div>
              <div className="mx-auto mb-4 grid h-24 w-24 place-items-center rounded-full bg-neutral-800/50">
                <ChefHat className="text-neutral-500" size={40} />
              </div>
              <p className="text-3xl font-bold">Sin pedidos por ahora</p>
              <p className="mt-3 text-neutral-400">Los nuevos pedidos van a aparecer acá automáticamente.</p>
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
