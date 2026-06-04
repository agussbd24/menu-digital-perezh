import { useState, useEffect, useRef } from 'react'

export default function Hero() {
  const [heroImgLoaded, setHeroImgLoaded] = useState(false)
  const [scrollY, setScrollY] = useState(0)
  const heroRef = useRef(null)

  useEffect(() => {
    const handleScroll = () => {
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect()
        if (rect.bottom > 0) {
          setScrollY(window.scrollY)
        }
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const parallaxOffset = scrollY * 0.3

  return (
    <section ref={heroRef} className='relative overflow-hidden'>
      <div className='absolute inset-0'>
        <img
          src='https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=1800'
          alt='Hamburguesa premium sobre mesa oscura'
          className={'h-full w-full object-cover scale-110 img-blur-load transition-transform duration-100 ' + (heroImgLoaded ? 'loaded' : '')}
          style={{ transform: 'scale(1.1) translateY(' + parallaxOffset + 'px)' }}
          onLoad={() => setHeroImgLoaded(true)}
        />
        <div className='absolute inset-0 bg-[linear-gradient(180deg,rgba(27,44,88,0.3)_0%,rgba(27,44,88,0.6)_40%,rgba(27,44,88,0.9)_70%,rgba(27,44,88,1)_100%)]' />
        <div className='absolute inset-0 bg-gradient-to-r from-perez-navy-dark/60 via-transparent to-transparent' />
        <div className='absolute inset-0 bg-gradient-to-t from-perez-navy via-transparent to-transparent opacity-50' />
        <div className='absolute inset-0' style={{ boxShadow: 'inset 0 0 150px 60px rgba(0,0,0,0.4)' }} />
      </div>

      <div className='relative mx-auto flex min-h-[30vh] max-w-7xl items-end px-4 pb-8 pt-20 sm:min-h-[50vh] sm:px-6 sm:pb-14 sm:pt-28 lg:px-8'>
        <div className='max-w-3xl'>
          <div className='mb-6 inline-flex items-center gap-3 rounded-full border border-perez-orange/30 glass px-5 py-2.5 text-sm font-medium text-perez-cream animate-fade-in-up stagger-1'>
            <img src='/logo-perezh.png' alt='PEREZ H' className='h-7 w-7 rounded-full object-cover' />
            Pedí desde tu mesa
          </div>
          <h1 className='max-w-2xl text-4xl font-bold leading-[0.95] text-white sm:text-6xl lg:text-7xl animate-fade-in-up stagger-2'>
            <span className='text-gradient'>PEREZ H</span>
            <br />
            <span className='text-perez-cream/90'>Menú Digital</span>
          </h1>
          <p className='mt-6 max-w-xl text-base leading-7 text-neutral-300 sm:text-lg animate-fade-in-up stagger-3'>
            Elegí tus favoritos, sumá observaciones y enviá el pedido directo a cocina. Las mejores hamburguesas, desde tu mesa.
          </p>
        </div>
      </div>
    </section>
  )
}
