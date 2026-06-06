import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.js'
import ProductTable from '../components/admin/ProductTable.jsx'
import SiteConfigPanel from '../components/admin/SiteConfigPanel.jsx'
import UserManagement from '../components/admin/UserManagement.jsx'
import QRGenerator from '../components/admin/QRGenerator.jsx'
import StatsExporter from '../components/admin/StatsExporter.jsx'
import InstagramGenerator from '../components/admin/InstagramGenerator.jsx'
import {
  LayoutDashboard,
  UtensilsCrossed,
  Settings,
  Users,
  QrCode,
  Download,
  Camera,
  LogOut,
  ChevronLeft,
  ChefHat,
} from 'lucide-react'

const TABS = [
  { key: 'products', label: 'Productos', icon: UtensilsCrossed },
  { key: 'config', label: 'Configuración', icon: Settings },
  { key: 'users', label: 'Usuarios', icon: Users },
  { key: 'qr', label: 'QR', icon: QrCode },
  { key: 'export', label: 'Exportar', icon: Download },
  { key: 'instagram', label: 'Instagram IA', icon: Camera },
]

export default function AdminPage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('products')
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const renderContent = () => {
    switch (activeTab) {
      case 'products': return <ProductTable />
      case 'config': return <SiteConfigPanel />
      case 'users': return <UserManagement />
      case 'qr': return <QRGenerator />
      case 'export': return <StatsExporter />
      case 'instagram': return <InstagramGenerator />
      default: return <ProductTable />
    }
  }

  return (
    <div className="flex min-h-screen bg-perez-navy text-perez-cream">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col border-r border-white/[0.06] bg-perez-navy-dark/95 backdrop-blur-xl transition-all duration-300 ${
          sidebarOpen ? 'w-64' : 'w-20'
        }`}
      >
        {/* Logo */}
        <div className="flex h-20 items-center justify-between border-b border-white/[0.06] px-4">
          {sidebarOpen && (
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 overflow-hidden rounded-full border border-perez-orange/20 bg-perez-navy">
                <img src="/logo-perezh.png" alt="PÉREZ H" className="h-full w-full object-cover" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-perez-gold/70">Admin</p>
                <p className="text-sm font-bold text-white">Panel</p>
              </div>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="grid h-9 w-9 place-items-center rounded-lg text-neutral-400 transition-colors hover:bg-white/[0.06] hover:text-white cursor-pointer"
          >
            <ChevronLeft size={18} className={`transition-transform duration-300 ${sidebarOpen ? '' : 'rotate-180'}`} />
          </button>
        </div>

        {/* Nav items */}
        <nav className="flex-1 space-y-1 px-3 py-4">
          {TABS.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.key
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-perez-orange/15 text-perez-gold border border-perez-orange/20'
                    : 'text-neutral-400 hover:bg-white/[0.04] hover:text-white border border-transparent'
                }`}
                title={tab.label}
              >
                <Icon size={20} />
                {sidebarOpen && <span>{tab.label}</span>}
              </button>
            )
          })}
        </nav>

        {/* User info + logout */}
        <div className="border-t border-white/[0.06] p-3">
          {sidebarOpen && (
            <div className="mb-3 px-3">
              <p className="truncate text-xs font-bold text-neutral-400">{user?.displayName}</p>
              <p className="truncate text-[11px] text-neutral-500">{user?.email}</p>
            </div>
          )}
          <button
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-neutral-400 transition-all duration-200 hover:bg-red-500/10 hover:text-red-400 cursor-pointer"
            title="Cerrar sesión"
          >
            <LogOut size={20} />
            {sidebarOpen && <span>Cerrar sesión</span>}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
        {/* Top bar */}
        <header className="sticky top-0 z-40 flex h-20 items-center justify-between border-b border-white/[0.06] bg-perez-navy/80 px-8 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <a
              href="/"
              className="inline-flex items-center gap-2 rounded-xl glass px-3 py-2 text-sm text-neutral-400 transition-all duration-300 hover:text-white"
            >
              <ChevronLeft size={16} />
              Menú
            </a>
            <a
              href="/kitchen"
              className="inline-flex items-center gap-2 rounded-xl glass px-3 py-2 text-sm font-semibold text-neutral-400 transition-all duration-300 hover:text-white"
            >
              <ChefHat size={16} />
              Cocina
            </a>
          </div>
          <div className="flex items-center gap-4">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-perez-orange/10 border border-perez-orange/20 overflow-hidden">
              <img src="/logo-perezh.png" alt="" className="h-full w-full object-cover" />
            </span>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-perez-gold/70">Dashboard</p>
              <p className="text-lg font-bold">{TABS.find((t) => t.key === activeTab)?.label}</p>
            </div>
          </div>
        </header>

        {/* Tab content */}
        <div className="p-8">
          {renderContent()}
        </div>
      </main>
    </div>
  )
}
