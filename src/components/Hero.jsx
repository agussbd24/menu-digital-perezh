import { useEffect, useRef, useState } from 'react'
import { Clock3, Sparkles, Wifi } from 'lucide-react'

export default function Hero() {
  const imageRef = useRef(null)
  const [heroImgLoaded, setHeroImgLoaded] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (imageRef.current) {
        const scrollY = window.scrollY
        imageRef.current.style.transform = `translateY(${scrollY * 0.25}px) scale(1.1)`
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0">
        <img
          ref={imageRef}
          src="https://images.unsplash.com/photo-1551782450-a2132b4ba21d?auto=format&fit=crop&w=1800&q=90"
          alt="Hamburguesa premium sobre mesa oscura"
          className={`h-full w-full object-cover scale-110 will-change-transform img-blur-load ${heroImgLoaded ? 'loaded' : ''}`}
          onLoad={() => setHeroImgLoaded(true)}
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(27,44,88,0.3)_0%,rgba(27,44,88,0.6)_40%,rgba(27,44,88,0.9)_70%,rgba(27,44,88,1)_100%)]" />
        <div className="absolute inset-0 bg-gradient-to-r from-perez-navy-dark/60 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-perez-navy via-transparent to-transparent opacity-50" />
      </div>

      <div className="relative mx-auto flex min-h-[60vh] max-w-7xl items-end px-4 pb-10 pt-24 sm:min-h-[65vh] sm:px-6 sm:pb-14 sm:pt-32 lg:px-8">
        <div className="max-w-3xl">
          <div className="mb-6 inline-flex items-center gap-3 rounded-full border border-perez-orange/30 glass px-5 py-2.5 text-sm font-medium text-perez-cream animate-fade-in-up stagger-1">
            <img src="/logo-perezh.png" alt="PÉREZ H" className="h-7 w-7 rounded-full object-cover" />
            Pedí desde tu mesa
          </div>
          <h1 className="max-w-2xl text-5xl font-bold leading-[0.95] text-white sm:text-6xl lg:text-7xl animate-fade-in-up stagger-2">
            <span className="text-gradient">PÉREZ H</span>
            <br />
            <span className="text-perez-cream/90">Menú Digital</span>
          </h1>
          <p className="mt-6 max-w-xl text-base leading-7 text-neutral-300 sm:text-lg animate-fade-in-up stagger-3">
            Elegí tus favoritos, sumá observaciones y enviá el pedido directo a cocina. Las mejores hamburguesas, desde tu mesa.
          </p>
          <div className="mt-8 grid max-w-2xl gap-3 sm:mt-10 sm:grid-cols-3 animate-fade-in-up stagger-4">
            <div className="glass-strong group rounded-2xl p-4 sm:p-5 transition-all duration-300 hover:border-perez-orange/30 hover:bg-perez-orange/10 hover:scale-[1.03] hover:shadow-glow cursor-default">
              <Clock3 className="mb-2.5 text-perez-gold transition-transform duration-300 group-hover:scale-110" size={22} />
              <p className="text-sm font-bold text-perez-cream">Pedido ágil</p>
              <p className="mt-1 text-[13px] text-neutral-400">Sin esperar al mozo</p>
            </div>
            <div className="glass-strong group rounded-2xl p-4 sm:p-5 transition-all duration-300 hover:border-perez-gold/30 hover:bg-perez-gold/10 hover:scale-[1.03] hover:shadow-glow cursor-default">
              <Wifi className="mb-2.5 text-perez-gold transition-transform duration-300 group-hover:scale-110 group-hover:animate-pulse" size={22} />
              <p className="text-sm font-bold text-perez-cream">Realtime</p>
              <p className="mt-1 text-[13px] text-neutral-400">Cocina recibe al instante</p>
            </div>
            <div className="glass-strong group rounded-2xl p-4 sm:p-5 transition-all duration-300 hover:border-perez-teal/30 hover:bg-perez-teal/10 hover:scale-[1.03] hover:shadow-glow cursor-default">
              <Sparkles className="mb-2.5 text-perez-teal transition-transform duration-300 group-hover:scale-110" size={22} />
              <p className="text-sm font-bold text-perez-cream">Premium UX</p>
              <p className="mt-1 text-[13px] text-neutral-400">Mobile-first y fluido</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
