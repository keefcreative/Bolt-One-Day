'use client'

import { useEffect, useState } from 'react'
import type { CountdownTimerProps, TimeRemaining } from '@/types/campaign'

export default function CountdownTimer({ deadline, variant = 'inline' }: CountdownTimerProps) {
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  })

  useEffect(() => {
    const calculateTimeRemaining = (): TimeRemaining => {
      const now = new Date().getTime()
      const end = new Date(deadline).getTime()
      const distance = end - now

      if (distance < 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0 }
      }

      return {
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      }
    }

    // Set initial time
    setTimeRemaining(calculateTimeRemaining())

    // Update every second
    const interval = setInterval(() => {
      setTimeRemaining(calculateTimeRemaining())
    }, 1000)

    return () => clearInterval(interval)
  }, [deadline])

  if (variant === 'inline') {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        fontSize: '0.875rem',
        fontWeight: '500'
      }}>
        {/* Full countdown on all screen sizes - shows seconds */}
        <span>{timeRemaining.days}d</span>
        <span>{timeRemaining.hours}h</span>
        <span>{timeRemaining.minutes}m</span>
        <span>{timeRemaining.seconds}s</span>
      </div>
    )
  }

  // Full variant (for hero sections, etc.)
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: '1rem',
      maxWidth: '400px'
    }}>
      {Object.entries(timeRemaining).map(([unit, value]) => (
        <div
          key={unit}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '1rem',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}
        >
          <span style={{
            fontSize: '2rem',
            fontWeight: '300',
            lineHeight: '1',
            marginBottom: '0.5rem'
          }}>
            {value.toString().padStart(2, '0')}
          </span>
          <span style={{
            fontSize: '0.75rem',
            textTransform: 'uppercase',
            opacity: 0.8
          }}>
            {unit}
          </span>
        </div>
      ))}
    </div>
  )
}
