import { isSupabaseConfigured, supabase } from '../lib/supabaseClient.js'

const CONFIG_KEY = 'restobar-site-config'

function loadLocalConfig() {
  try {
    const raw = localStorage.getItem(CONFIG_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function saveLocalConfig(config) {
  localStorage.setItem(CONFIG_KEY, JSON.stringify(config))
}

const DEFAULT_CONFIG = {
  restaurant_name: 'Pérez H',
  tagline: 'La mejor hamburguesa en el país de la mejor carne.',
  hero_description: 'Disponibilalo en nuestro menú digital',
  whatsapp_links: [
    { name: 'PALERMO', url: 'https://api.whatsapp.com/send/?phone=1136429912' },
    { name: 'MICROCENTRO', url: 'https://api.whatsapp.com/send/?phone=5491144221293' },
  ],
  delivery_links: [
    { name: 'PEDIDOS YA', url: 'https://www.pedidosya.com.ar/cadenas/perez-h' },
    { name: 'RAPPI', url: 'https://www.rappi.com.ar/restaurantes/delivery/3451-perez-h' },
    { name: 'MERCADO PAGO', url: 'https://www.mercadolibre.com.ar/landing/restaurantes' },
  ],
  social_instagram: 'https://www.instagram.com/perez.hamburguesas/',
  social_tiktok: 'https://www.tiktok.com/@perez.hamburguesas',
  menu_url: 'https://menu-digital-perezh.pages.dev/menu',
}

export async function fetchSiteConfig() {
  if (!isSupabaseConfigured) {
    const local = loadLocalConfig()
    return local || { ...DEFAULT_CONFIG }
  }

  const { data, error } = await supabase
    .from('site_config')
    .select('*')

  if (error || !data || data.length === 0) {
    return { ...DEFAULT_CONFIG }
  }

  const config = {}
  data.forEach((row) => {
    config[row.key] = row.value
  })

  return { ...DEFAULT_CONFIG, ...config }
}

export async function updateSiteConfig(key, value) {
  if (!isSupabaseConfigured) {
    const config = loadLocalConfig() || { ...DEFAULT_CONFIG }
    config[key] = value
    saveLocalConfig(config)
    return config
  }

  const { error } = await supabase
    .from('site_config')
    .upsert([{ key, value, updated_at: new Date().toISOString() }], { onConflict: 'key' })

  if (error) throw error
}

export async function updateSiteConfigBulk(updates) {
  if (!isSupabaseConfigured) {
    const config = loadLocalConfig() || { ...DEFAULT_CONFIG }
    Object.assign(config, updates)
    saveLocalConfig(config)
    return config
  }

  const rows = Object.entries(updates).map(([key, value]) => ({
    key,
    value,
    updated_at: new Date().toISOString(),
  }))

  const { error } = await supabase
    .from('site_config')
    .upsert(rows, { onConflict: 'key' })

  if (error) throw error
}

export { DEFAULT_CONFIG }
