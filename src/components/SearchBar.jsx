import { Search, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

export default function SearchBar({ value, onChange }) {
  const inputRef = useRef(null)
  const [localValue, setLocalValue] = useState(value)
  const [isFocused, setIsFocused] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      onChange(localValue)
    }, 200)

    return () => clearTimeout(timer)
  }, [localValue, onChange])

  return (
    <div className={`relative transition-all duration-300 ${isFocused ? 'scale-[1.02]' : ''}`}>
      <Search
        className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 ${
          isFocused ? 'text-perez-gold' : 'text-neutral-500'
        }`}
        size={19}
      />
      <input
        ref={inputRef}
        type="text"
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder="Buscar hamburguesas, papas, bebidas..."
        className="h-13 w-full rounded-2xl border border-white/[0.08] glass pl-12 pr-12 text-base text-white outline-none transition-all duration-300 placeholder:text-neutral-500 focus:border-perez-orange/40 focus:bg-white/[0.06] focus:ring-4 focus:ring-perez-orange/10 focus:shadow-[0_0_20px_rgba(216,102,10,0.1)]"
      />
      {localValue && (
        <button
          type="button"
          onClick={() => {
            setLocalValue('')
            onChange('')
            inputRef.current?.focus()
          }}
          className="absolute right-3 top-1/2 -translate-y-1/2 grid h-11 w-11 place-items-center rounded-full text-neutral-400 transition-all duration-200 hover:bg-white/10 hover:text-white active:scale-90"
        >
          <X size={16} />
        </button>
      )}
    </div>
  )
}
