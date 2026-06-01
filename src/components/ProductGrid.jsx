import ProductCard from './ProductCard.jsx'

function EmptySearchSVG() {
  return (
    <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="animate-float">
      <circle cx="52" cy="52" r="36" stroke="rgba(231,160,17,0.2)" strokeWidth="2" fill="rgba(231,160,17,0.03)" />
      <circle cx="52" cy="52" r="20" stroke="rgba(231,160,17,0.15)" strokeWidth="1.5" fill="none" strokeDasharray="4 4" />
      <line x1="78" y1="78" x2="100" y2="100" stroke="rgba(231,160,17,0.3)" strokeWidth="3" strokeLinecap="round" />
      <circle cx="52" cy="52" r="4" fill="rgba(231,160,17,0.4)" />
      <path d="M44 48 C44 44, 60 44, 60 48" stroke="rgba(216,102,10,0.3)" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <circle cx="38" cy="50" r="2" fill="rgba(231,160,17,0.2)" />
      <circle cx="66" cy="50" r="2" fill="rgba(231,160,17,0.2)" />
    </svg>
  )
}

export default function ProductGrid({ products }) {
  if (products.length === 0) {
    return (
      <div className="rounded-[2rem] border border-dashed border-white/10 glass px-6 py-20 text-center animate-fade-in">
        <div className="mx-auto mb-6 opacity-60">
          <EmptySearchSVG />
        </div>
        <p className="text-xl font-bold text-white">No encontramos productos</p>
        <p className="mt-2 text-sm text-neutral-400">Probá con otra búsqueda o categoría.</p>
      </div>
    )
  }

  return (
    <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {products.map((product, index) => (
        <ProductCard key={product.id} product={product} index={index} />
      ))}
    </div>
  )
}
