"use client"

import { useEffect, useState } from "react"

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
  expired: boolean
}

function calcTimeLeft(endsAt: string): TimeLeft {
  const diff = new Date(endsAt).getTime() - Date.now()
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true }

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
    expired: false,
  }
}

export function CountdownTimer({ endsAt, compact }: { endsAt: string; compact?: boolean }) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calcTimeLeft(endsAt))

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calcTimeLeft(endsAt))
    }, 1000)
    return () => clearInterval(timer)
  }, [endsAt])

  if (timeLeft.expired) {
    return <span className="badge badge-danger">Closed</span>
  }

  if (compact) {
    if (timeLeft.days > 0) return <span className="badge badge-warning">{timeLeft.days}d {timeLeft.hours}h left</span>
    if (timeLeft.hours > 0) return <span className="badge badge-warning">{timeLeft.hours}h {timeLeft.minutes}m left</span>
    return <span className="badge badge-danger">{timeLeft.minutes}m {timeLeft.seconds}s left</span>
  }

  return (
    <div className="countdown">
      {timeLeft.days > 0 && (
        <>
          <div className="countdown-unit">
            <span className="countdown-value">{String(timeLeft.days).padStart(2, "0")}</span>
            <span className="countdown-label">Days</span>
          </div>
          <span className="countdown-separator">:</span>
        </>
      )}
      <div className="countdown-unit">
        <span className="countdown-value">{String(timeLeft.hours).padStart(2, "0")}</span>
        <span className="countdown-label">Hrs</span>
      </div>
      <span className="countdown-separator">:</span>
      <div className="countdown-unit">
        <span className="countdown-value">{String(timeLeft.minutes).padStart(2, "0")}</span>
        <span className="countdown-label">Min</span>
      </div>
      <span className="countdown-separator">:</span>
      <div className="countdown-unit">
        <span className="countdown-value">{String(timeLeft.seconds).padStart(2, "0")}</span>
        <span className="countdown-label">Sec</span>
      </div>
    </div>
  )
}
