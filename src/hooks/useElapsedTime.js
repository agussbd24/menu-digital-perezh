import { useEffect, useMemo, useState } from 'react'

function formatElapsed(ms) {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000))
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60

  if (minutes < 60) {
    return `${minutes}m ${seconds.toString().padStart(2, '0')}s`
  }

  const hours = Math.floor(minutes / 60)
  const restMinutes = minutes % 60

  return `${hours}h ${restMinutes}m`
}

export function useElapsedTime(createdAt) {
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    const interval = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(interval)
  }, [])

  return useMemo(() => formatElapsed(now - new Date(createdAt).getTime()), [createdAt, now])
}
