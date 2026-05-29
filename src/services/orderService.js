import { isSupabaseConfigured, supabase } from '../lib/supabaseClient.js'

function ensureSupabase() {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error('Supabase no está configurado. Revisá VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY.')
  }
}

export function mapOrder(row) {
  return {
    id: row.id,
    tableNumber: row.table_number,
    customerName: row.customer_name,
    items: row.items ?? [],
    total: Number(row.total ?? 0),
    notes: row.notes ?? '',
    status: row.status,
    createdAt: row.created_at,
    deliveredAt: row.delivered_at ?? null,
  }
}

export async function createOrder(payload) {
  ensureSupabase()

  const { data, error } = await supabase
    .from('orders')
    .insert([
      {
        table_number: String(payload.tableNumber).trim(),
        customer_name: payload.customerName?.trim() || null,
        items: payload.items,
        total: payload.total,
        notes: payload.notes?.trim() || null,
        status: 'new',
      },
    ])
    .select()
    .single()

  if (error) {
    throw error
  }

  return mapOrder(data)
}

export async function fetchOrders() {
  ensureSupabase()

  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    throw error
  }

  return data.map(mapOrder)
}

export async function updateOrderStatus(orderId, status) {
  ensureSupabase()

  const update = { status }
  if (status === 'delivered') {
    update.delivered_at = new Date().toISOString()
  }

  const { data, error } = await supabase
    .from('orders')
    .update(update)
    .eq('id', orderId)
    .select()
    .single()

  if (error) {
    throw error
  }

  return mapOrder(data)
}
