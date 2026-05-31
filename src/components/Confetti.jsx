import { useEffect, useRef, useState } from 'react'

const COLORS = ['#d8660a', '#e7a011', '#f0d95c', '#7ab4c2', '#e8e3dd', '#ff6b6b']
const PARTICLE_COUNT = 40

function createParticle(index) {
  const color = COLORS[Math.floor(Math.random() * COLORS.length)]
  const left = Math.random() * 100
  const delay = Math.random() * 0.5
  const duration = 2 + Math.random() * 2
  const size = 6 + Math.random() * 8
  const shape = Math.random() > 0.5 ? 'circle' : 'square'

  return { id: index, color, left, delay, duration, size, shape }
}

export default function Confetti({ active }) {
  const [particles, setParticles] = useState([])
  const timeoutRef = useRef(null)

  useEffect(() => {
    if (!active) return undefined

    const newParticles = Array.from({ length: PARTICLE_COUNT }, (_, i) =>
      createParticle(i),
    )

    const raf = requestAnimationFrame(() => {
      setParticles(newParticles)
    })

    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => {
      setParticles([])
    }, 4000)

    return () => {
      cancelAnimationFrame(raf)
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [active])

  if (!active || particles.length === 0) return null

  return (
    <div className="fixed inset-0 z-[99999] pointer-events-none overflow-hidden">
      {particles.map((p) => (
        <div
          key={p.id}
          className="confetti-particle"
          style={{
            left: `${p.left}%`,
            top: '-10px',
            width: `${p.size}px`,
            height: `${p.size}px`,
            backgroundColor: p.color,
            borderRadius: p.shape === 'circle' ? '50%' : '2px',
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
          }}
        />
      ))}
    </div>
  )
}
