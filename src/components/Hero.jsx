import { useState } from 'react'

export default function Hero() {
  const [heroImgLoaded, setHeroImgLoaded] = useState(false)

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1551782450-a2132b4ba21d?auto=format&fit=crop&w=1800&q=90"
          alt="Hamburguesa premium sobre mesa oscura"
          className={`h-full w-full object-cover scale-110 img-blur-load ${heroImgLoaded ? 'loaded' : ''}`}
          onLoad={() => setHeroImgLoaded(true)}
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(27,44,88,0.3)_0%,rgba(27,44,88,0.6)_40%,rgba(27,44,88,0.9)_70%,rgba(27,44,88,1)_100%)]" />
        <div className="absolute inset-0 bg-gradient-to-r from-perez-navy-dark/60 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-perez-navy via-transparent to-transparent opacity-50" />
      </div>

      <div className="relative mx-auto flex min-h-[30vh] max-w-7xl items-end px-4 pb-8 pt-20 sm:min-h-[50vh] sm:px-6 sm:pb-14 sm:pt-28 lg:px-8">
        <div className="max-w-3xl">
          <div className="mb-6 inline-flex items-center gap-3 rounded-full border border-perez-orange/30 glass px-5 py-2.5 text-sm font-medium text-perez-cream animate-fade-in-up stagger-1">
            <img src="/logo-perezh.png" alt="PÉREZ H" className="h-7 w-7 rounded-full object-cover" />
            Pedí desde tu mesa
          </div>
          <h1 className="max-w-2xl text-4xl font-bold leading-[0.95] text-white sm:text-6xl lg:text-7xl animate-fade-in-up stagger-2">
            <span className="text-gradient">PÉREZ H</span>
            <br />
            <span className="text-perez-cream/90">Menú Digital</span>
          </h1>
          <p className="mt-6 max-w-xl text-base leading-7 text-neutral-300 sm:text-lg animate-fade-in-up stagger-3">
            Elegí tus favoritos, sumá observaciones y enviá el pedido directo a cocina. Las mejores hamburguesas, desde tu mesa.
          </p>
        </div>
      </div>
    </section>
  )
}
