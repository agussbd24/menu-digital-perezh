import { useEffect, useState } from 'react'
import { fetchSiteConfig, updateSiteConfigBulk } from '../../services/siteConfigService.js'
import { Save, Loader2, Plus, Trash2 } from 'lucide-react'

export default function SiteConfigPanel() {
  const [config, setConfig] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    loadConfig()
  }, [])

  async function loadConfig() {
    setLoading(true)
    try {
      const data = await fetchSiteConfig()
      setConfig(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleSave() {
    setSaving(true)
    setError('')
    try {
      await updateSiteConfigBulk(config)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  function updateField(key, value) {
    setConfig((prev) => ({ ...prev, [key]: value }))
  }

  function addDeliveryLink() {
    const links = config.delivery_links || []
    updateField('delivery_links', [...links, { name: '', url: '' }])
  }

  function removeDeliveryLink(index) {
    const links = config.delivery_links || []
    updateField('delivery_links', links.filter((_, i) => i !== index))
  }

  function updateDeliveryLink(index, field, value) {
    const links = [...(config.delivery_links || [])]
    links[index] = { ...links[index], [field]: value }
    updateField('delivery_links', links)
  }

  function addWhatsappLink() {
    const links = config.whatsapp_links || []
    updateField('whatsapp_links', [...links, { name: '', url: '' }])
  }

  function removeWhatsappLink(index) {
    const links = config.whatsapp_links || []
    updateField('whatsapp_links', links.filter((_, i) => i !== index))
  }

  function updateWhatsappLink(index, field, value) {
    const links = [...(config.whatsapp_links || [])]
    links[index] = { ...links[index], [field]: value }
    updateField('whatsapp_links', links)
  }

  if (loading) {
    return (
      <div className="grid min-h-[40vh] place-items-center text-neutral-400">
        <Loader2 className="animate-spin" size={24} />
      </div>
    )
  }

  return (
    <div className="max-w-3xl space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Configuración del Sitio</h2>
          <p className="mt-1 text-sm text-neutral-400">Editá los textos y links que aparecen en el menú público</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-perez-orange to-perez-orange-dark px-5 py-3 text-sm font-bold text-white transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 cursor-pointer"
        >
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          {saved ? '¡Guardado!' : 'Guardar Cambios'}
        </button>
      </div>

      {error && (
        <div className="rounded-xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">{error}</div>
      )}

      {/* General */}
      <section className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
        <h3 className="mb-4 text-lg font-bold text-white">Información General</h3>
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-neutral-400">Nombre del Restaurante</label>
            <input
              type="text"
              value={config.restaurant_name || ''}
              onChange={(e) => updateField('restaurant_name', e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/[0.05] px-4 py-3 text-white text-sm outline-none transition-all focus:border-perez-orange/40 focus:ring-2 focus:ring-perez-orange/20"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-neutral-400">Tagline</label>
            <input
              type="text"
              value={config.tagline || ''}
              onChange={(e) => updateField('tagline', e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/[0.05] px-4 py-3 text-white text-sm outline-none transition-all focus:border-perez-orange/40 focus:ring-2 focus:ring-perez-orange/20"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-neutral-400">URL del Menú (para QR)</label>
            <input
              type="text"
              value={config.menu_url || ''}
              onChange={(e) => updateField('menu_url', e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/[0.05] px-4 py-3 text-white text-sm outline-none transition-all focus:border-perez-orange/40 focus:ring-2 focus:ring-perez-orange/20"
            />
          </div>
        </div>
      </section>

      {/* Delivery Links */}
      <section className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-bold text-white">Links de Delivery</h3>
          <button
            onClick={addDeliveryLink}
            className="inline-flex items-center gap-1.5 rounded-lg bg-white/[0.06] px-3 py-1.5 text-xs font-bold text-neutral-300 transition-colors hover:bg-white/[0.1] hover:text-white cursor-pointer"
          >
            <Plus size={14} /> Agregar
          </button>
        </div>
        <div className="space-y-3">
          {(config.delivery_links || []).map((link, i) => (
            <div key={i} className="flex items-center gap-3">
              <input
                type="text"
                value={link.name}
                onChange={(e) => updateDeliveryLink(i, 'name', e.target.value)}
                className="w-40 rounded-xl border border-white/10 bg-white/[0.05] px-3 py-2.5 text-white text-sm outline-none focus:border-perez-orange/40 focus:ring-2 focus:ring-perez-orange/20"
                placeholder="Nombre"
              />
              <input
                type="text"
                value={link.url}
                onChange={(e) => updateDeliveryLink(i, 'url', e.target.value)}
                className="flex-1 rounded-xl border border-white/10 bg-white/[0.05] px-3 py-2.5 text-white text-sm outline-none focus:border-perez-orange/40 focus:ring-2 focus:ring-perez-orange/20"
                placeholder="https://..."
              />
              <button
                onClick={() => removeDeliveryLink(i)}
                className="grid h-9 w-9 place-items-center rounded-lg text-neutral-500 hover:bg-red-500/10 hover:text-red-400 cursor-pointer"
              >
                <Trash2 size={15} />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* WhatsApp Links */}
      <section className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-bold text-white">Links de WhatsApp</h3>
          <button
            onClick={addWhatsappLink}
            className="inline-flex items-center gap-1.5 rounded-lg bg-white/[0.06] px-3 py-1.5 text-xs font-bold text-neutral-300 transition-colors hover:bg-white/[0.1] hover:text-white cursor-pointer"
          >
            <Plus size={14} /> Agregar
          </button>
        </div>
        <div className="space-y-3">
          {(config.whatsapp_links || []).map((link, i) => (
            <div key={i} className="flex items-center gap-3">
              <input
                type="text"
                value={link.name}
                onChange={(e) => updateWhatsappLink(i, 'name', e.target.value)}
                className="w-40 rounded-xl border border-white/10 bg-white/[0.05] px-3 py-2.5 text-white text-sm outline-none focus:border-perez-orange/40 focus:ring-2 focus:ring-perez-orange/20"
                placeholder="Sucursal"
              />
              <input
                type="text"
                value={link.url}
                onChange={(e) => updateWhatsappLink(i, 'url', e.target.value)}
                className="flex-1 rounded-xl border border-white/10 bg-white/[0.05] px-3 py-2.5 text-white text-sm outline-none focus:border-perez-orange/40 focus:ring-2 focus:ring-perez-orange/20"
                placeholder="https://api.whatsapp.com/send/?phone=..."
              />
              <button
                onClick={() => removeWhatsappLink(i)}
                className="grid h-9 w-9 place-items-center rounded-lg text-neutral-500 hover:bg-red-500/10 hover:text-red-400 cursor-pointer"
              >
                <Trash2 size={15} />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Social Links */}
      <section className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
        <h3 className="mb-4 text-lg font-bold text-white">Redes Sociales</h3>
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-neutral-400">Instagram URL</label>
            <input
              type="text"
              value={config.social_instagram || ''}
              onChange={(e) => updateField('social_instagram', e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/[0.05] px-4 py-3 text-white text-sm outline-none transition-all focus:border-perez-orange/40 focus:ring-2 focus:ring-perez-orange/20"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-neutral-400">TikTok URL</label>
            <input
              type="text"
              value={config.social_tiktok || ''}
              onChange={(e) => updateField('social_tiktok', e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/[0.05] px-4 py-3 text-white text-sm outline-none transition-all focus:border-perez-orange/40 focus:ring-2 focus:ring-perez-orange/20"
            />
          </div>
        </div>
      </section>
    </div>
  )
}
