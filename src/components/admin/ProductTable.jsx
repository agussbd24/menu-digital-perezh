import { useEffect, useState } from 'react'
import { fetchProducts, createProduct, updateProduct, deleteProduct, fallbackCategories } from '../../services/productService.js'
import { formatCurrency } from '../../services/menuData.js'
import { Plus, Pencil, Trash2, Eye, EyeOff, X, Save, Loader2 } from 'lucide-react'

const EMPTY_PRODUCT = {
  id: '',
  category: 'cheeseburgers',
  name: '',
  description: '',
  price: 0,
  image: '',
  badge: '',
  available: true,
  sortOrder: 0,
}

export default function ProductTable() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [filterCategory, setFilterCategory] = useState('all')
  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [form, setForm] = useState(EMPTY_PRODUCT)
  const [error, setError] = useState('')

  useEffect(() => {
    loadProducts()
  }, [])

  async function loadProducts() {
    setLoading(true)
    try {
      const data = await fetchProducts()
      setProducts(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const filtered = filterCategory === 'all'
    ? products
    : products.filter((p) => p.category === filterCategory)

  function openNew() {
    setEditingProduct(null)
    setForm({ ...EMPTY_PRODUCT, id: 'product-' + Date.now() })
    setShowForm(true)
  }

  function openEdit(product) {
    setEditingProduct(product)
    setForm({ ...product })
    setShowForm(true)
  }

  async function handleSave(e) {
    e.preventDefault()
    setSaving(true)
    setError('')

    try {
      if (!form.name.trim()) throw new Error('El nombre es obligatorio')
      if (!form.id.trim()) throw new Error('El ID es obligatorio')
      if (form.price < 0) throw new Error('El precio no puede ser negativo')

      if (editingProduct) {
        await updateProduct(editingProduct.id, form)
      } else {
        await createProduct(form)
      }
      setShowForm(false)
      await loadProducts()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(product) {
    if (!window.confirm(`¿Eliminar "${product.name}"?`)) return
    try {
      await deleteProduct(product.id)
      await loadProducts()
    } catch (err) {
      setError(err.message)
    }
  }

  async function toggleAvailable(product) {
    try {
      await updateProduct(product.id, { available: !product.available })
      await loadProducts()
    } catch (err) {
      setError(err.message)
    }
  }

  const categories = fallbackCategories.filter((c) => c.id !== 'all')

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Productos del Menú</h2>
          <p className="mt-1 text-sm text-neutral-400">{products.length} productos en total</p>
        </div>
        <button
          onClick={openNew}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-perez-orange to-perez-orange-dark px-5 py-3 text-sm font-bold text-white shadow-[0_4px_20px_rgba(216,102,10,0.3)] transition-all duration-300 hover:shadow-[0_8px_30px_rgba(216,102,10,0.4)] hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
        >
          <Plus size={18} />
          Nuevo Producto
        </button>
      </div>

      {/* Category filter */}
      <div className="mb-6 flex flex-wrap gap-2">
        <button
          onClick={() => setFilterCategory('all')}
          className={`rounded-lg px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
            filterCategory === 'all'
              ? 'bg-perez-orange/20 text-perez-gold border border-perez-orange/30'
              : 'glass text-neutral-400 hover:text-white border border-transparent'
          }`}
        >
          Todos ({products.length})
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setFilterCategory(cat.id)}
            className={`rounded-lg px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
              filterCategory === cat.id
                ? 'bg-perez-orange/20 text-perez-gold border border-perez-orange/30'
                : 'glass text-neutral-400 hover:text-white border border-transparent'
            }`}
          >
            {cat.label} ({products.filter((p) => p.category === cat.id).length})
          </button>
        ))}
      </div>

      {error && (
        <div className="mb-6 rounded-xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {error}
        </div>
      )}

      {/* Table */}
      {loading ? (
        <div className="grid min-h-[40vh] place-items-center text-neutral-400">
          <Loader2 className="animate-spin" size={24} />
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-white/[0.06]">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-white/[0.06] bg-white/[0.02]">
                <th className="px-4 py-3 font-bold text-neutral-400">Producto</th>
                <th className="px-4 py-3 font-bold text-neutral-400">Categoría</th>
                <th className="px-4 py-3 font-bold text-neutral-400">Precio</th>
                <th className="px-4 py-3 font-bold text-neutral-400">Badge</th>
                <th className="px-4 py-3 font-bold text-neutral-400">Estado</th>
                <th className="px-4 py-3 font-bold text-neutral-400 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((product) => (
                <tr
                  key={product.id}
                  className="border-b border-white/[0.03] transition-colors hover:bg-white/[0.03]"
                >
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      {product.image ? (
                        <img src={product.image} alt="" className="h-10 w-10 rounded-lg object-cover" />
                      ) : (
                        <div className="grid h-10 w-10 place-items-center rounded-lg bg-white/[0.05] text-neutral-500">
                          🍔
                        </div>
                      )}
                      <div>
                        <p className="font-bold text-white">{product.name}</p>
                        <p className="text-xs text-neutral-500 truncate max-w-[200px]">{product.description}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className="rounded-lg bg-white/[0.06] px-2.5 py-1 text-xs font-bold text-neutral-300">
                      {categories.find((c) => c.id === product.category)?.label || product.category}
                    </span>
                  </td>
                  <td className="px-4 py-4 font-bold text-perez-gold">{formatCurrency(product.price)}</td>
                  <td className="px-4 py-4">
                    {product.badge ? (
                      <span className="rounded-lg bg-perez-orange/10 px-2.5 py-1 text-xs font-bold text-perez-gold">
                        {product.badge}
                      </span>
                    ) : (
                      <span className="text-neutral-600">—</span>
                    )}
                  </td>
                  <td className="px-4 py-4">
                    <button
                      onClick={() => toggleAvailable(product)}
                      className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-bold cursor-pointer transition-all ${
                        product.available
                          ? 'bg-emerald-500/10 text-emerald-400'
                          : 'bg-red-500/10 text-red-400'
                      }`}
                    >
                      {product.available ? <Eye size={14} /> : <EyeOff size={14} />}
                      {product.available ? 'Disponible' : 'Oculto'}
                    </button>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEdit(product)}
                        className="grid h-8 w-8 place-items-center rounded-lg text-neutral-400 transition-colors hover:bg-white/[0.06] hover:text-white cursor-pointer"
                        title="Editar"
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        onClick={() => handleDelete(product)}
                        className="grid h-8 w-8 place-items-center rounded-lg text-neutral-400 transition-colors hover:bg-red-500/10 hover:text-red-400 cursor-pointer"
                        title="Eliminar"
                      >
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
          <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl border border-white/[0.08] bg-perez-navy-dark p-6 shadow-2xl">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-xl font-bold text-white">
                {editingProduct ? 'Editar Producto' : 'Nuevo Producto'}
              </h3>
              <button
                onClick={() => setShowForm(false)}
                className="grid h-8 w-8 place-items-center rounded-lg text-neutral-400 hover:bg-white/[0.06] hover:text-white cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-neutral-400">ID</label>
                  <input
                    type="text"
                    value={form.id}
                    onChange={(e) => setForm({ ...form, id: e.target.value })}
                    disabled={Boolean(editingProduct)}
                    className="w-full rounded-xl border border-white/10 bg-white/[0.05] px-4 py-3 text-white text-sm outline-none transition-all focus:border-perez-orange/40 focus:ring-2 focus:ring-perez-orange/20 disabled:opacity-50"
                    placeholder="mi-producto"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-neutral-400">Nombre</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-white/[0.05] px-4 py-3 text-white text-sm outline-none transition-all focus:border-perez-orange/40 focus:ring-2 focus:ring-perez-orange/20"
                    placeholder="Nombre del producto"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-neutral-400">Descripción</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={3}
                  className="w-full rounded-xl border border-white/10 bg-white/[0.05] px-4 py-3 text-white text-sm outline-none transition-all focus:border-perez-orange/40 focus:ring-2 focus:ring-perez-orange/20 resize-none"
                  placeholder="Descripción del producto"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-neutral-400">Categoría</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-white/[0.05] px-4 py-3 text-white text-sm outline-none transition-all focus:border-perez-orange/40 focus:ring-2 focus:ring-perez-orange/20"
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-neutral-400">Precio (ARS)</label>
                  <input
                    type="number"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                    min={0}
                    className="w-full rounded-xl border border-white/10 bg-white/[0.05] px-4 py-3 text-white text-sm outline-none transition-all focus:border-perez-orange/40 focus:ring-2 focus:ring-perez-orange/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-neutral-400">Badge</label>
                  <input
                    type="text"
                    value={form.badge}
                    onChange={(e) => setForm({ ...form, badge: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-white/[0.05] px-4 py-3 text-white text-sm outline-none transition-all focus:border-perez-orange/40 focus:ring-2 focus:ring-perez-orange/20"
                    placeholder="Ej: Popular, Premium"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-neutral-400">Imagen URL</label>
                  <input
                    type="text"
                    value={form.image}
                    onChange={(e) => setForm({ ...form, image: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-white/[0.05] px-4 py-3 text-white text-sm outline-none transition-all focus:border-perez-orange/40 focus:ring-2 focus:ring-perez-orange/20"
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <label className="flex items-center gap-2 text-sm text-neutral-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.available}
                    onChange={(e) => setForm({ ...form, available: e.target.checked })}
                    className="h-4 w-4 rounded accent-perez-orange"
                  />
                  Disponible en el menú
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="rounded-xl px-5 py-2.5 text-sm font-semibold text-neutral-400 transition-colors hover:bg-white/[0.06] hover:text-white cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-perez-orange to-perez-orange-dark px-6 py-2.5 text-sm font-bold text-white transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 cursor-pointer"
                >
                  {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                  {editingProduct ? 'Guardar Cambios' : 'Crear Producto'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
