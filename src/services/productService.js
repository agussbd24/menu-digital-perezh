import { isSupabaseConfigured, supabase } from '../lib/supabaseClient.js'
import { products as fallbackProducts, categories as fallbackCategories, standardAddons } from './menuData.js'

const STORAGE_KEY = 'restobar-mock-products'

function loadLocalProducts() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function saveLocalProducts(products) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products))
}

function mapProduct(row) {
  return {
    id: row.id,
    category: row.category,
    name: row.name,
    description: row.description || '',
    price: Number(row.price),
    image: row.image || null,
    badge: row.badge || null,
    available: row.available !== false,
    sortOrder: row.sort_order ?? 0,
    addons: row.addons || [],
  }
}

function mapProductToRow(product) {
  return {
    id: product.id,
    category: product.category,
    name: product.name,
    description: product.description || '',
    price: product.price,
    image: product.image || null,
    badge: product.badge || null,
    available: product.available !== false,
    sort_order: product.sortOrder ?? 0,
    addons: product.addons || [],
  }
}

export async function fetchProducts() {
  if (!isSupabaseConfigured) {
    const local = loadLocalProducts()
    return local || fallbackProducts
  }

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('sort_order', { ascending: true })

  if (error) {
    console.error('Error fetching products:', error)
    return fallbackProducts
  }

  if (!data || data.length === 0) {
    return fallbackProducts
  }

  return data.map(mapProduct)
}

export async function fetchAvailableProducts() {
  const all = await fetchProducts()
  return all.filter((p) => p.available)
}

export async function createProduct(product) {
  if (!isSupabaseConfigured) {
    const products = loadLocalProducts() || [...fallbackProducts]
    products.push(product)
    saveLocalProducts(products)
    return product
  }

  const { data, error } = await supabase
    .from('products')
    .insert([mapProductToRow(product)])
    .select()
    .single()

  if (error) throw error
  return mapProduct(data)
}

export async function updateProduct(productId, updates) {
  if (!isSupabaseConfigured) {
    const products = loadLocalProducts() || [...fallbackProducts]
    const idx = products.findIndex((p) => p.id === productId)
    if (idx !== -1) {
      products[idx] = { ...products[idx], ...updates }
      saveLocalProducts(products)
    }
    return { id: productId, ...updates }
  }

  const payload = mapProductToRow({ id: productId, ...updates })
  payload.updated_at = new Date().toISOString()

  const { data, error } = await supabase
    .from('products')
    .update(payload)
    .eq('id', productId)
    .select()
    .single()

  if (error) throw error
  return mapProduct(data)
}

export async function deleteProduct(productId) {
  if (!isSupabaseConfigured) {
    const products = loadLocalProducts() || [...fallbackProducts]
    saveLocalProducts(products.filter((p) => p.id !== productId))
    return
  }

  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', productId)

  if (error) throw error
}

export { fallbackCategories, standardAddons }
