import { isSupabaseConfigured, supabase } from '../lib/supabaseClient.js'

const AUTH_KEY = 'perezh-auth-user'

function sha256(message) {
  const msgBuffer = new TextEncoder().encode(message)
  return crypto.subtle.digest('SHA-256', msgBuffer).then((hashBuffer) => {
    return Array.from(new Uint8Array(hashBuffer))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('')
  })
}

function getStoredUser() {
  try {
    const raw = localStorage.getItem(AUTH_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function storeUser(user) {
  localStorage.setItem(AUTH_KEY, JSON.stringify(user))
}

function clearUser() {
  localStorage.removeItem(AUTH_KEY)
}

export function getCurrentUser() {
  return getStoredUser()
}

export async function login(email, password) {
  if (!isSupabaseConfigured) {
    // Mock login for offline mode
    if (email === 'admin@perezh.com' && password === 'admin123') {
      const user = { id: 'mock-admin', email, displayName: 'Administrador', role: 'admin' }
      storeUser(user)
      return user
    }
    if (email === 'cocina@perezh.com' && password === 'cocina123') {
      const user = { id: 'mock-kitchen', email, displayName: 'Cocina', role: 'kitchen' }
      storeUser(user)
      return user
    }
    throw new Error('Credenciales incorrectas')
  }

  const passwordHash = await sha256(password)

  const { data, error } = await supabase
    .from('system_users')
    .select('*')
    .eq('email', email.toLowerCase().trim())
    .eq('password_hash', passwordHash)
    .eq('active', true)
    .single()

  if (error || !data) {
    throw new Error('Credenciales incorrectas')
  }

  const user = {
    id: data.id,
    email: data.email,
    displayName: data.display_name,
    role: data.role,
  }

  storeUser(user)
  return user
}

export function logout() {
  clearUser()
}

export async function getUsers() {
  if (!isSupabaseConfigured) {
    return [
      { id: 'mock-admin', email: 'admin@perezh.com', displayName: 'Administrador', role: 'admin', active: true },
      { id: 'mock-kitchen', email: 'cocina@perezh.com', displayName: 'Cocina', role: 'kitchen', active: true },
    ]
  }

  const { data, error } = await supabase
    .from('system_users')
    .select('*')
    .order('created_at', { ascending: true })

  if (error) throw error

  return data.map((u) => ({
    id: u.id,
    email: u.email,
    displayName: u.display_name,
    role: u.role,
    active: u.active,
    createdAt: u.created_at,
  }))
}

export async function createUser({ email, password, displayName, role }) {
  if (!isSupabaseConfigured) {
    return {
      id: 'mock-' + Math.random().toString(36).slice(2, 9),
      email,
      displayName,
      role,
      active: true,
    }
  }

  const passwordHash = await sha256(password)

  const { data, error } = await supabase
    .from('system_users')
    .insert([{
      email: email.toLowerCase().trim(),
      password_hash: passwordHash,
      display_name: displayName,
      role: role || 'kitchen',
      active: true,
    }])
    .select()
    .single()

  if (error) throw error

  return {
    id: data.id,
    email: data.email,
    displayName: data.display_name,
    role: data.role,
    active: data.active,
  }
}

export async function updateUser(userId, updates) {
  if (!isSupabaseConfigured) {
    return { id: userId, ...updates }
  }

  const payload = {}
  if (updates.displayName) payload.display_name = updates.displayName
  if (updates.role) payload.role = updates.role
  if (updates.active !== undefined) payload.active = updates.active
  payload.updated_at = new Date().toISOString()

  if (updates.password) {
    payload.password_hash = await sha256(updates.password)
  }

  const { data, error } = await supabase
    .from('system_users')
    .update(payload)
    .eq('id', userId)
    .select()
    .single()

  if (error) throw error

  return {
    id: data.id,
    email: data.email,
    displayName: data.display_name,
    role: data.role,
    active: data.active,
  }
}

export async function deleteUser(userId) {
  if (!isSupabaseConfigured) return

  const { error } = await supabase
    .from('system_users')
    .delete()
    .eq('id', userId)

  if (error) throw error
}
