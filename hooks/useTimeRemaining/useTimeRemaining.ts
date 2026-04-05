import { useEffect, useState } from "react"

interface TimeRemaining {
  hours: number
  minutes: number
  seconds: number
  isExpired: boolean
  label: string
}

function calculate(deadlineMs: number): TimeRemaining {
  const diff = deadlineMs - Date.now()

  if (diff <= 0) {
    return { hours: 0, minutes: 0, seconds: 0, isExpired: true, label: "Time's up" }
  }

  const hours = Math.floor(diff / (1000 * 60 * 60))
  const minutes = Math.floor((diff / (1000 * 60)) % 60)
  const seconds = Math.floor((diff / 1000) % 60)

  const parts: string[] = []
  if (hours > 0) parts.push(`${hours}h`)
  if (minutes > 0) parts.push(`${minutes}m`)
  parts.push(`${seconds}s`)

  return { hours, minutes, seconds, isExpired: false, label: parts.join(" ") }
}

export function useTimeRemaining(deadline: Date): TimeRemaining {
  const deadlineMs = deadline.getTime()
  const [remaining, setRemaining] = useState(() => calculate(deadlineMs))

  useEffect(() => {
    const interval = setInterval(() => {
      setRemaining(calculate(deadlineMs))
    }, 1000)

    return () => clearInterval(interval)
  }, [deadlineMs])

  return remaining
}
