import { useRef, useEffect, useState } from 'react'
import { categories } from '../services/menuData.js'

export default function CategoryFilter({ activeCategory, onChange }) {
  const scrollRef = useRef(null)
  const [indicator, setIndicator] = useState({ left: 0, width: 0 })
  const btnRefs = useRef({})
  const isFirstRender = useRef(true)

  useEffect(() => {
    const btn = btnRefs.current[activeCategory]
    if (btn && scrollRef.current) {
      setIndicator({
        left: btn.offsetLeft,
        width: btn.offsetWidth,
      })
      if (isFirstRender.current) {
        isFirstRender.current = false
        return
      }
      btn.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
    }
  }, [activeCategory])

  return (
    <div className="relative">
      <div
        ref={scrollRef}
        className="no-scrollbar relative flex gap-2 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-1"
      >
      {categories.map((category) => {
        const isActive = activeCategory === category.id
        return (
          <button
            key={category.id}
            ref={(el) => { btnRefs.current[category.id] = el }}
            type="button"
            onClick={() => onChange(category.id)}
            className={`
              shrink-0 snap-center rounded-full px-5 py-3 text-sm font-semibold transition-all duration-300 active:scale-95
              ${
                isActive
                  ? 'text-white'
                  : 'text-neutral-400 hover:text-neutral-200 hover:bg-white/5'
              }
            `}
          >
            {category.label}
          </button>
        )
      })}
      <div
        className="absolute bottom-0 h-[3px] rounded-full bg-gradient-to-r from-perez-orange to-perez-gold shadow-[0_0_8px_rgba(216,102,10,0.4)] transition-all duration-300 ease-out"
        style={{ left: indicator.left, width: indicator.width }}
      />
      </div>
      <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-perez-navy to-transparent sm:hidden" />
    </div>
  )
}
