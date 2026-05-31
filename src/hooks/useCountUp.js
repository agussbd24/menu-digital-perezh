import { useEffect, useRef, useState } from 'react'

export function useCountUp(end, duration = 1200, startOnView = true) {
  const [count, setCount] = useState(0)
  const [hasStarted, setHasStarted] = useState(!startOnView)
  const animFrame = useRef(null)

  useEffect(() => {
    if (!hasStarted) return

    if (end === 0) {
      return
    }

    let startTime = null

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(eased * end))

      if (progress < 1) {
        animFrame.current = requestAnimationFrame(animate)
      }
    }

    animFrame.current = requestAnimationFrame(animate)
    return () => {
      if (animFrame.current) cancelAnimationFrame(animFrame.current)
    }
  }, [end, duration, hasStarted])

  return {
    count,
    start: () => setHasStarted(true),
  }
}

export function useCountUpOnView(end, duration = 1200) {
  const [ref, setRef] = useState(null)
  const [hasStarted, setHasStarted] = useState(false)
  const [count, setCount] = useState(0)
  const animFrame = useRef(null)

  useEffect(() => {
    if (!ref) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasStarted(true)
          observer.disconnect()
        }
      },
      { threshold: 0.3 },
    )
    observer.observe(ref)
    return () => observer.disconnect()
  }, [ref])

  useEffect(() => {
    if (!hasStarted || end === 0) return

    let startTime = null

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(eased * end))

      if (progress < 1) {
        animFrame.current = requestAnimationFrame(animate)
      }
    }

    animFrame.current = requestAnimationFrame(animate)
    return () => {
      if (animFrame.current) cancelAnimationFrame(animFrame.current)
    }
  }, [end, duration, hasStarted])

  return [setRef, count]
}
