import { useState } from 'react'

const categoryIcons = {
  cheeseburgers: (size) => (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 28C12 18.06 19.16 10 28 10H36C44.84 10 52 18.06 52 28H12Z" fill="currentColor" opacity="0.9"/>
      <rect x="10" y="28" width="44" height="6" rx="2" fill="currentColor" opacity="0.6"/>
      <path d="M14 34H50L52 42H12L14 34Z" fill="currentColor" opacity="0.8"/>
      <rect x="12" y="42" width="40" height="5" rx="1.5" fill="currentColor" opacity="0.5"/>
      <path d="M10 47H54C54 47 54 54 54 56C54 58.2 52.2 58 50 58H14C11.8 58 10 58.2 10 56C10 54 10 47 10 47Z" fill="currentColor" opacity="0.7"/>
    </svg>
  ),
  clasicas: (size) => (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M14 30C14 20.6 20.6 14 30 14H34C43.4 14 50 20.6 50 30H14Z" fill="currentColor" opacity="0.9"/>
      <rect x="12" y="30" width="40" height="5" rx="2" fill="currentColor" opacity="0.6"/>
      <path d="M16 35H48L50 44H14L16 35Z" fill="currentColor" opacity="0.8"/>
      <rect x="14" y="44" width="36" height="4" rx="1" fill="currentColor" opacity="0.5"/>
      <path d="M12 48H52C52 48 52 54 52 55C52 56.1 51.1 56 50 56H14C12.9 56 12 56.1 12 55C12 54 12 48 12 48Z" fill="currentColor" opacity="0.7"/>
    </svg>
  ),
  perez: (size) => (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M32 8L38 24H54L41 34L46 52L32 42L18 52L23 34L10 24H26L32 8Z" fill="currentColor" opacity="0.9"/>
    </svg>
  ),
  gourmet: (size) => (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="32" cy="48" rx="18" ry="8" fill="currentColor" opacity="0.5"/>
      <path d="M20 20C20 14.48 24.48 10 30 10H34C39.52 10 44 14.48 44 20V32H20V20Z" fill="currentColor" opacity="0.7"/>
      <rect x="18" y="32" width="28" height="4" rx="2" fill="currentColor" opacity="0.9"/>
      <path d="M22 36H42V42C42 45.3 39.3 48 36 48H28C24.7 48 22 45.3 22 42V36Z" fill="currentColor" opacity="0.6"/>
      <circle cx="32" cy="24" r="3" fill="currentColor" opacity="0.4"/>
    </svg>
  ),
  compartir: (size) => (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 20H48L44 52H20L16 20Z" fill="currentColor" opacity="0.6"/>
      <path d="M14 20C14 16 17 14 20 14H44C47 14 50 16 50 20H14Z" fill="currentColor" opacity="0.9"/>
      <rect x="16" y="20" width="32" height="3" rx="1" fill="currentColor" opacity="0.4"/>
      <path d="M22 28V48M28 26V46M34 28V48M40 26V46" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" opacity="0.5"/>
    </svg>
  ),
  verde: (size) => (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M32 10C32 10 48 18 52 34C56 50 42 58 32 58C22 58 8 50 12 34C16 18 32 10 32 10Z" fill="currentColor" opacity="0.7"/>
      <path d="M32 18V52" stroke="currentColor" strokeWidth="2" opacity="0.4"/>
      <path d="M32 28C38 28 42 32 44 36" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.4"/>
      <path d="M32 38C26 38 22 34 20 30" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.4"/>
    </svg>
  ),
  postres: (size) => (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 36H48V40C48 48.84 40.84 54 32 54C23.16 54 16 48.84 16 40V36Z" fill="currentColor" opacity="0.7"/>
      <rect x="14" y="32" width="36" height="4" rx="2" fill="currentColor" opacity="0.9"/>
      <path d="M18 20C18 14 22 10 28 10H36C42 10 46 14 46 20V32H18V20Z" fill="currentColor" opacity="0.6"/>
      <circle cx="32" cy="16" r="4" fill="currentColor" opacity="0.8"/>
      <path d="M30 8L32 4L34 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.5"/>
    </svg>
  ),
  bebidas: (size) => (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M18 14H46L42 52H22L18 14Z" fill="currentColor" opacity="0.6"/>
      <rect x="16" y="10" width="32" height="4" rx="2" fill="currentColor" opacity="0.9"/>
      <path d="M22 22H42" stroke="currentColor" strokeWidth="2" opacity="0.4"/>
      <circle cx="28" cy="30" r="2" fill="currentColor" opacity="0.5"/>
      <circle cx="36" cy="28" r="1.5" fill="currentColor" opacity="0.4"/>
      <circle cx="30" cy="36" r="1.5" fill="currentColor" opacity="0.4"/>
      <rect x="22" y="52" width="20" height="4" rx="2" fill="currentColor" opacity="0.7"/>
    </svg>
  ),
  tragos: (size) => (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 12L26 36H38L44 12H20Z" fill="currentColor" opacity="0.6"/>
      <rect x="18" y="10" width="28" height="3" rx="1.5" fill="currentColor" opacity="0.9"/>
      <path d="M32 36V50" stroke="currentColor" strokeWidth="3" opacity="0.7"/>
      <ellipse cx="32" cy="52" rx="10" ry="3" fill="currentColor" opacity="0.5"/>
      <circle cx="28" cy="20" r="1.5" fill="currentColor" opacity="0.4"/>
      <circle cx="34" cy="24" r="1" fill="currentColor" opacity="0.3"/>
    </svg>
  ),
  cervezas: (size) => (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="14" y="14" width="30" height="42" rx="4" fill="currentColor" opacity="0.6"/>
      <rect x="44" y="22" width="8" height="18" rx="4" fill="currentColor" opacity="0.5"/>
      <rect x="12" y="10" width="34" height="4" rx="2" fill="currentColor" opacity="0.9"/>
      <path d="M18 22H38" stroke="currentColor" strokeWidth="2" opacity="0.4"/>
      <path d="M18 30H38" stroke="currentColor" strokeWidth="2" opacity="0.4"/>
      <circle cx="24" cy="38" r="2" fill="currentColor" opacity="0.4"/>
      <circle cx="32" cy="36" r="1.5" fill="currentColor" opacity="0.3"/>
      <circle cx="28" cy="44" r="1.5" fill="currentColor" opacity="0.3"/>
    </svg>
  ),
}

const categoryGradients = {
  cheeseburgers: 'from-amber-700 via-orange-600 to-amber-800',
  clasicas: 'from-yellow-700 via-amber-600 to-orange-700',
  perez: 'from-orange-600 via-amber-500 to-yellow-600',
  gourmet: 'from-purple-700 via-fuchsia-600 to-pink-700',
  compartir: 'from-red-600 via-orange-500 to-amber-600',
  verde: 'from-emerald-700 via-teal-600 to-green-700',
  postres: 'from-pink-600 via-rose-500 to-red-500',
  bebidas: 'from-cyan-600 via-blue-500 to-sky-600',
  tragos: 'from-violet-600 via-purple-500 to-indigo-600',
  cervezas: 'from-amber-600 via-yellow-500 to-orange-500',
}

export default function ProductImage({ product, variant = 'card', className = '' }) {
  const [imgLoaded, setImgLoaded] = useState(false)
  const [imgError, setImgError] = useState(false)

  const hasImage = product.image && !imgError
  const gradient = categoryGradients[product.category] || 'from-neutral-700 to-neutral-800'
  const Icon = categoryIcons[product.category]
  const iconSize = variant === 'modal' ? 80 : variant === 'thumb' ? 28 : 48

  if (hasImage && !imgLoaded) {
    return (
      <div className={`relative overflow-hidden ${className}`}>
        <div className="absolute inset-0 skeleton" />
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover"
          loading="lazy"
          onLoad={() => setImgLoaded(true)}
          onError={() => setImgError(true)}
        />
      </div>
    )
  }

  if (hasImage && imgLoaded) {
    return (
      <div className={`relative overflow-hidden ${className}`}>
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover"
          loading="lazy"
        />
      </div>
    )
  }

  return (
    <div className={`relative overflow-hidden bg-gradient-to-br ${gradient} ${className}`}>
      <div className="absolute inset-0 bg-black/10" />
      <div className="absolute inset-0 flex flex-col items-center justify-center text-white/90">
        {Icon && Icon(iconSize)}
        {variant !== 'thumb' && (
          <span className={`mt-2 font-bold text-white/70 text-center px-4 leading-tight ${
            variant === 'modal' ? 'text-lg max-w-[200px]' : 'text-xs max-w-[120px]'
          }`}>
            {product.name}
          </span>
        )}
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
    </div>
  )
}
