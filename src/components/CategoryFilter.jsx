import { categories } from '../services/menuData.js'

export default function CategoryFilter({ activeCategory, onChange }) {
  return (
    <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
      {categories.map((category) => {
        const isActive = activeCategory === category.id
        return (
          <button
            key={category.id}
            type="button"
            onClick={() => onChange(category.id)}
            className={`
              shrink-0 rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-300
              ${
                isActive
                  ? 'bg-gradient-to-r from-perez-orange to-perez-gold text-perez-navy-dark shadow-glow'
                  : 'border border-white/10 glass text-neutral-300 hover:border-white/20 hover:bg-white/5 hover:text-white'
              }
            `}
          >
            {category.label}
          </button>
        )
      })}
    </div>
  )
}
