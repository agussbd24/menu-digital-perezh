import { Search, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

export default function SearchBar({ value, onChange }) {
  const inputRef = useRef(null)
  const [localValue, setLocalValue] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => {
      onChange(localValue)
    }, 200)

    return () => clearTimeout(timer)
  }, [localValue, onChange])

  return (
    <div className="relative">
      <Search
        className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500"
        size={19}
      />
      <input
        ref={inputRef}
        type="text"
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        placeholder="Buscar hamburguesas, papas, bebidas..."
        className="h-13 w-full rounded-2xl border border-white/[0.08] glass pl-12 pr-12 text-white outline-none transition-all duration-300 placeholder:text-neutral-500 focus:border-perez-orange/40 focus:bg-white/[0.06] focus:ring-4 focus:ring-perez-orange/10"
      />
      {localValue && (
        <button
          type="button"
          onClick={() => {
            setLocalValue('')
            onChange('')
            inputRef.current?.focus()
          }}
          className="absolute right-4 top-1/2 -translate-y-1/2 grid h-7 w-7 place-items-center rounded-full text-neutral-400 transition-colors hover:bg-white/10 hover:text-white"
        >
          <X size={16} />
        </button>
      )}
    </div>
  )
}
