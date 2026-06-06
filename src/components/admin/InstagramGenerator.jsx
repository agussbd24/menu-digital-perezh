import { useState, useEffect } from 'react'
import { fetchProducts, fallbackCategories } from '../../services/productService.js'
import { generateImage, generateInstagramCopy } from '../../services/aiImageService.js'
import { formatCurrency } from '../../services/menuData.js'
import { Camera, Sparkles, Download, Copy, RefreshCw, Check, Loader2 } from 'lucide-react'

export default function InstagramGenerator() {
  const [products, setProducts] = useState([])
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [style, setStyle] = useState('professional')
  const [generating, setGenerating] = useState(false)
  const [generatedImage, setGeneratedImage] = useState(null)
  const [generatedCopy, setGeneratedCopy] = useState('')
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState('')
  const [loadingProducts, setLoadingProducts] = useState(false)

  useEffect(() => {
    let mounted = true
    setLoadingProducts(true)
    fetchProducts()
      .then((data) => {
        if (mounted) setProducts(data.filter((p) => p.available))
      })
      .catch(() => {})
      .finally(() => {
        if (mounted) setLoadingProducts(false)
      })
    return () => { mounted = false }
  }, [])

  async function handleGenerate() {
    if (!selectedProduct) return

    setGenerating(true)
    setError('')
    setGeneratedImage(null)

    try {
      const copy = generateInstagramCopy(
        selectedProduct.name,
        selectedProduct.description,
        selectedProduct.price,
        style,
      )
      setGeneratedCopy(copy)

      const blob = await generateImage(selectedProduct.name, selectedProduct.description, style)
      const objectUrl = URL.createObjectURL(blob)
      setGeneratedImage({ objectUrl, blob })
    } catch (err) {
      console.error('Error generating image:', err)
      setError('Error al generar la imagen. Intentá de nuevo en unos segundos.')
    } finally {
      setGenerating(false)
    }
  }

  function handleCopy() {
    navigator.clipboard.writeText(generatedCopy)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function handleDownload() {
    if (!generatedImage) return
    const link = document.createElement('a')
    link.href = generatedImage.objectUrl
    link.download = `instagram-${selectedProduct.id}-${style}.png`
    link.click()
  }

  function handleRegenerate() {
    setGeneratedImage(null)
    setGeneratedCopy('')
    setTimeout(() => handleGenerate(), 100)
  }

  const categories = fallbackCategories.filter((c) => c.id !== 'all')

  return (
    <div className="max-w-5xl space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white">Generador de Posts para Instagram</h2>
        <p className="mt-1 text-sm text-neutral-400">
          Generá contenido con IA para tus redes sociales — 100% gratuito
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr]">
        {/* Left: Product selector + settings */}
        <div className="space-y-6">
          {/* Style selector */}
          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
            <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-neutral-400">Estilo del Post</h3>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setStyle('professional')}
                className={`rounded-xl p-4 text-left transition-all cursor-pointer ${
                  style === 'professional'
                    ? 'border-2 border-perez-orange/40 bg-perez-orange/10'
                    : 'border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04]'
                }`}
              >
                <p className="font-bold text-white">Profesional</p>
                <p className="mt-1 text-xs text-neutral-400">Editorial, luces cálidas, plating premium</p>
              </button>
              <button
                onClick={() => setStyle('casual')}
                className={`rounded-xl p-4 text-left transition-all cursor-pointer ${
                  style === 'casual'
                    ? 'border-2 border-perez-orange/40 bg-perez-orange/10'
                    : 'border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04]'
                }`}
              >
                <p className="font-bold text-white">Casual</p>
                <p className="mt-1 text-xs text-neutral-400">Vibrante, Instagram style, food porn</p>
              </button>
            </div>
          </div>

          {/* Product selector */}
          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
            <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-neutral-400">Seleccioná un Producto</h3>
            <div className="max-h-[400px] space-y-2 overflow-y-auto pr-1">
              {categories.map((cat) => {
                const catProducts = products.filter((p) => p.category === cat.id)
                if (catProducts.length === 0) return null
                return (
                  <div key={cat.id}>
                    <p className="mb-2 mt-3 text-xs font-bold uppercase tracking-wider text-perez-gold/60">{cat.label}</p>
                    {catProducts.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => { setSelectedProduct(p); setGeneratedImage(null); setGeneratedCopy('') }}
                        className={`w-full rounded-xl p-3 text-left transition-all cursor-pointer ${
                          selectedProduct?.id === p.id
                            ? 'border-2 border-perez-orange/40 bg-perez-orange/10'
                            : 'border border-transparent hover:bg-white/[0.04]'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-white text-sm">{p.name}</span>
                          <span className="text-xs font-bold text-perez-gold">{formatCurrency(p.price)}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Generate button */}
          <button
            onClick={handleGenerate}
            disabled={!selectedProduct || generating}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 px-6 py-4 text-base font-bold text-white shadow-[0_8px_30px_rgba(236,72,153,0.3)] transition-all hover:shadow-[0_12px_40px_rgba(236,72,153,0.4)] hover:scale-[1.02] active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            {generating ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Generando...
              </>
            ) : (
              <>
                <Sparkles size={20} />
                Generar Post de Instagram
              </>
            )}
          </button>

          {error && (
            <div className="rounded-xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">{error}</div>
          )}
        </div>

        {/* Right: Preview */}
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
          <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-neutral-400">Preview del Post</h3>

          {!generatedImage && !generating && (
            <div className="grid min-h-[400px] place-items-center rounded-xl border border-dashed border-white/10 text-center">
              <div className="text-neutral-500">
                <Camera size={48} className="mx-auto mb-3 opacity-30" />
                <p className="text-sm">Elegí un producto y generá el post</p>
              </div>
            </div>
          )}

          {generating && (
            <div className="grid min-h-[400px] place-items-center">
              <div className="flex flex-col items-center gap-3 text-neutral-400">
                <Loader2 className="animate-spin" size={32} />
                <p className="text-sm font-bold">Generando imagen con IA...</p>
                <p className="text-xs text-neutral-500">Esto puede tomar 15-30 segundos</p>
                <p className="text-xs text-neutral-600">Usando Flux vía Puter.js (100% gratuito)</p>
              </div>
            </div>
          )}

          {generatedImage && !generating && (
            <div className="space-y-4">
              {/* Instagram-style preview */}
              <div className="overflow-hidden rounded-xl border border-white/[0.08]">
                {/* Header */}
                <div className="flex items-center gap-3 bg-white/[0.04] px-4 py-3">
                  <div className="h-8 w-8 overflow-hidden rounded-full bg-gradient-to-br from-perez-orange to-perez-gold p-[2px]">
                    <img src="/logo-perezh.png" alt="" className="h-full w-full rounded-full object-cover" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">perez.hamburguesas</p>
                    <p className="text-[10px] text-neutral-500">Publicidad</p>
                  </div>
                </div>

                {/* Image */}
                <img
                  src={generatedImage.objectUrl}
                  alt={selectedProduct?.name}
                  className="w-full aspect-square object-cover"
                />

                {/* Actions */}
                <div className="flex items-center gap-4 bg-white/[0.04] px-4 py-3">
                  <button className="text-neutral-400 hover:text-red-400 cursor-pointer">
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>
                  </button>
                  <svg className="h-6 w-6 text-neutral-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
                  <svg className="h-6 w-6 text-neutral-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" /></svg>
                </div>

                {/* Copy */}
                <div className="border-t border-white/[0.06] bg-white/[0.02] px-4 py-3">
                  <p className="whitespace-pre-wrap text-xs leading-relaxed text-neutral-300">{generatedCopy}</p>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex gap-3">
                <button
                  onClick={handleCopy}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.06] px-4 py-3 text-sm font-bold text-neutral-300 transition-all hover:bg-white/[0.1] hover:text-white cursor-pointer"
                >
                  {copied ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
                  {copied ? '¡Copiado!' : 'Copiar Texto'}
                </button>
                <button
                  onClick={handleDownload}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-perez-orange to-perez-orange-dark px-4 py-3 text-sm font-bold text-white transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                >
                  <Download size={16} />
                  Descargar Imagen
                </button>
              </div>
              <button
                onClick={handleRegenerate}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-semibold text-neutral-400 transition-all hover:bg-white/[0.08] hover:text-white cursor-pointer"
              >
                <RefreshCw size={16} />
                Regenerar con otro estilo
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
