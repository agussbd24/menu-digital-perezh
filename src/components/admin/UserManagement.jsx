import { useEffect, useState } from 'react'
import { getUsers, createUser, updateUser, deleteUser } from '../../services/authService.js'
import { Plus, Pencil, Trash2, X, Save, Loader2, Shield, ChefHat, Eye, EyeOff } from 'lucide-react'

const EMPTY_USER = { username: '', password: '', displayName: '', role: 'kitchen' }

export default function UserManagement() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [form, setForm] = useState(EMPTY_USER)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => { loadUsers() }, [])

  async function loadUsers() {
    setLoading(true)
    try {
      const data = await getUsers()
      setUsers(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  function openNew() {
    setEditingUser(null)
    setForm({ ...EMPTY_USER })
    setShowPassword(false)
    setShowForm(true)
  }

  function openEdit(user) {
    setEditingUser(user)
    setForm({ username: user.username, password: '', displayName: user.displayName, role: user.role })
    setShowPassword(false)
    setShowForm(true)
  }

  async function handleSave(e) {
    e.preventDefault()
    setSaving(true)
    setError('')

    try {
      if (!form.displayName.trim()) throw new Error('El nombre es obligatorio')
      if (!editingUser && !form.username.trim()) throw new Error('El usuario es obligatorio')
      if (!editingUser && !form.password.trim()) throw new Error('La contraseña es obligatoria')
      if (editingUser && form.password && form.password.length < 6) throw new Error('La contraseña debe tener al menos 6 caracteres')

      if (editingUser) {
        const updates = { displayName: form.displayName, role: form.role }
        if (form.password) updates.password = form.password
        await updateUser(editingUser.id, updates)
      } else {
        await createUser({ username: form.username, password: form.password, displayName: form.displayName, role: form.role })
      }
      setShowForm(false)
      await loadUsers()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(user) {
    if (!window.confirm(`¿Eliminar al usuario "${user.displayName}"?`)) return
    try {
      await deleteUser(user.id)
      await loadUsers()
    } catch (err) {
      setError(err.message)
    }
  }

  async function toggleActive(user) {
    try {
      await updateUser(user.id, { active: !user.active })
      await loadUsers()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Gestión de Usuarios</h2>
          <p className="mt-1 text-sm text-neutral-400">{users.length} usuarios registrados</p>
        </div>
        <button
          onClick={openNew}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-perez-orange to-perez-orange-dark px-5 py-3 text-sm font-bold text-white shadow-[0_4px_20px_rgba(216,102,10,0.3)] transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
        >
          <Plus size={18} />
          Nuevo Usuario
        </button>
      </div>

      {error && (
        <div className="mb-6 rounded-xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">{error}</div>
      )}

      {loading ? (
        <div className="grid min-h-[40vh] place-items-center text-neutral-400">
          <Loader2 className="animate-spin" size={24} />
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-white/[0.06]">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-white/[0.06] bg-white/[0.02]">
                <th className="px-4 py-3 font-bold text-neutral-400">Usuario</th>
                <th className="px-4 py-3 font-bold text-neutral-400">Usuario</th>
                <th className="px-4 py-3 font-bold text-neutral-400">Rol</th>
                <th className="px-4 py-3 font-bold text-neutral-400">Estado</th>
                <th className="px-4 py-3 font-bold text-neutral-400 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b border-white/[0.03] transition-colors hover:bg-white/[0.03]">
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="grid h-10 w-10 place-items-center rounded-full bg-white/[0.06]">
                        {u.role === 'admin' ? <Shield size={18} className="text-perez-gold" /> : <ChefHat size={18} className="text-perez-teal" />}
                      </div>
                      <span className="font-bold text-white">{u.displayName}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-neutral-300">{u.username}</td>
                  <td className="px-4 py-4">
                    <span className={`rounded-lg px-2.5 py-1 text-xs font-bold ${u.role === 'admin' ? 'bg-perez-orange/10 text-perez-gold' : 'bg-perez-teal/10 text-perez-teal'}`}>
                      {u.role === 'admin' ? 'Administrador' : 'Cocina'}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <button
                      onClick={() => toggleActive(u)}
                      className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-bold cursor-pointer transition-all ${
                        u.active ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                      }`}
                    >
                      {u.active ? <Eye size={14} /> : <EyeOff size={14} />}
                      {u.active ? 'Activo' : 'Inactivo'}
                    </button>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => openEdit(u)} className="grid h-8 w-8 place-items-center rounded-lg text-neutral-400 hover:bg-white/[0.06] hover:text-white cursor-pointer" title="Editar">
                        <Pencil size={15} />
                      </button>
                      <button onClick={() => handleDelete(u)} className="grid h-8 w-8 place-items-center rounded-lg text-neutral-400 hover:bg-red-500/10 hover:text-red-400 cursor-pointer" title="Eliminar">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-3xl border border-white/[0.08] bg-perez-navy-dark p-6 shadow-2xl">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-xl font-bold text-white">
                {editingUser ? 'Editar Usuario' : 'Nuevo Usuario'}
              </h3>
              <button onClick={() => setShowForm(false)} className="grid h-8 w-8 place-items-center rounded-lg text-neutral-400 hover:bg-white/[0.06] hover:text-white cursor-pointer">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-neutral-400">Nombre</label>
                <input
                  type="text"
                  value={form.displayName}
                  onChange={(e) => setForm({ ...form, displayName: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-white/[0.05] px-4 py-3 text-white text-sm outline-none focus:border-perez-orange/40 focus:ring-2 focus:ring-perez-orange/20"
                  placeholder="Nombre del usuario"
                />
              </div>

              {!editingUser && (
                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-neutral-400">Usuario</label>
                  <input
                    type="text"
                    value={form.username}
                    onChange={(e) => setForm({ ...form, username: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-white/[0.05] px-4 py-3 text-white text-sm outline-none focus:border-perez-orange/40 focus:ring-2 focus:ring-perez-orange/20"
                    placeholder="nombredeusuario"
                  />
                </div>
              )}

              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-neutral-400">
                  {editingUser ? 'Nueva Contraseña (dejar vacío para no cambiar)' : 'Contraseña'}
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-white/[0.05] px-4 py-3 pr-12 text-white text-sm outline-none focus:border-perez-orange/40 focus:ring-2 focus:ring-perez-orange/20"
                    placeholder="••••••••"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white cursor-pointer">
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-neutral-400">Rol</label>
                <select
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-white/[0.05] px-4 py-3 text-white text-sm outline-none focus:border-perez-orange/40 focus:ring-2 focus:ring-perez-orange/20"
                >
                  <option value="kitchen">Cocina (solo ver pedidos)</option>
                  <option value="admin">Administrador (control total)</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setShowForm(false)} className="rounded-xl px-5 py-2.5 text-sm font-semibold text-neutral-400 hover:bg-white/[0.06] hover:text-white cursor-pointer">
                  Cancelar
                </button>
                <button type="submit" disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-perez-orange to-perez-orange-dark px-6 py-2.5 text-sm font-bold text-white hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 cursor-pointer">
                  {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                  {editingUser ? 'Guardar' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
