import { useEffect, useRef, useState } from 'react'

export default function CursorTrail() {
  const [dots, setDots] = useState([])
  const [isVisible, setIsVisible] = useState(false)
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 })
  const mousePos = useRef({ x: 0, y: 0 })
  const animFrame = useRef(null)
  const lastUpdate = useRef(0)

  useEffect(() => {
    const isDesktop = window.matchMedia('(pointer: fine)').matches && window.innerWidth > 768
    if (!isDesktop) return

    const handleMouseMove = (e) => {
      mousePos.current = { x: e.clientX, y: e.clientY }
      setCursorPos({ x: e.clientX, y: e.clientY })
      if (!isVisible) setIsVisible(true)
    }

    const handleMouseLeave = () => setIsVisible(false)
    const handleMouseEnter = () => setIsVisible(true)

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    document.addEventListener('mouseleave', handleMouseLeave)
    document.addEventListener('mouseenter', handleMouseEnter)

    const animate = () => {
      const now = Date.now()
      if (now - lastUpdate.current > 50) {
        lastUpdate.current = now
        const { x, y } = mousePos.current
        setDots((prev) => {
          const newDots = [...prev, { x, y, id: now + Math.random() }]
          return newDots.slice(-8)
        })
      }
      animFrame.current = requestAnimationFrame(animate)
    }
    animFrame.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseleave', handleMouseLeave)
      document.removeEventListener('mouseenter', handleMouseEnter)
      if (animFrame.current) cancelAnimationFrame(animFrame.current)
    }
  }, [isVisible])

  if (!isVisible || dots.length === 0) return null

  return (
    <div className="fixed inset-0 z-[99998] pointer-events-none">
      {dots.map((dot, i) => (
        <div
          key={dot.id}
          className="fixed rounded-full bg-perez-gold/30"
          style={{
            left: dot.x - 3,
            top: dot.y - 3,
            width: 6,
            height: 6,
            opacity: (i + 1) / dots.length * 0.4,
            transform: `scale(${(i + 1) / dots.length})`,
            transition: 'opacity 0.3s, transform 0.3s',
          }}
        />
      ))}
      <div
        className="fixed rounded-full border border-perez-gold/40 bg-perez-gold/5"
        style={{
          left: cursorPos.x - 12,
          top: cursorPos.y - 12,
          width: 24,
          height: 24,
          transition: 'left 0.15s ease-out, top 0.15s ease-out',
        }}
      />
    </div>
  )
}
