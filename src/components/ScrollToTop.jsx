import { ArrowUp } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > 400)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  if (!visible) return null

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="fixed bottom-6 right-6 z-30 grid h-12 w-12 place-items-center rounded-full border border-white/10 bg-neutral-900/80 text-neutral-300 shadow-xl backdrop-blur-xl transition-all duration-300 hover:scale-110 hover:text-white hover:border-perez-orange/30 hover:bg-neutral-900 active:scale-95 sm:bottom-8 sm:right-8 animate-fade-in"
      aria-label="Volver arriba"
    >
      <ArrowUp size={20} />
    </button>
  )
}
