import ProductCard from './ProductCard.jsx'

export default function ProductGrid({ products }) {
  if (products.length === 0) {
    return (
      <div className="rounded-[2rem] border border-dashed border-white/10 glass px-6 py-20 text-center animate-fade-in">
        <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-full bg-neutral-800/50">
          <svg
            className="text-neutral-500"
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
        </div>
        <p className="text-xl font-bold text-white">No encontramos productos</p>
        <p className="mt-2 text-sm text-neutral-400">Probá con otra búsqueda o categoría.</p>
      </div>
    )
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {products.map((product, index) => (
        <ProductCard key={product.id} product={product} index={index} />
      ))}
    </div>
  )
}
