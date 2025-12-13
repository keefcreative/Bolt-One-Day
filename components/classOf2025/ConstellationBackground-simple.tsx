'use client'

import { useEffect, useRef } from 'react'

export default function ConstellationBackground() {
  const constellationRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Simple parallax effect with increased intensity
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2
      const y = (e.clientY / window.innerHeight - 0.5) * 2

      // Move constellation layers with stronger effect
      const layers = document.querySelectorAll('.constellation-layer')
      layers.forEach((layer) => {
        const depth = parseFloat((layer as HTMLElement).dataset.depth || '0')
        const moveX = x * 50 * depth  // Increased from 20 to 50
        const moveY = y * 50 * depth
        ;(layer as HTMLElement).style.transform = `translate(${moveX}px, ${moveY}px)`
      })

      // Move clusters with stronger effect
      const clusters = document.querySelectorAll('.cluster')
      clusters.forEach((cluster, index) => {
        const depth = 0.15 + index * 0.05
        const moveX = x * 30 * depth  // Increased from 10 to 30
        const moveY = y * 30 * depth
        ;(cluster as HTMLElement).style.transform = `translate(${moveX}px, ${moveY}px)`
      })
    }

    document.addEventListener('mousemove', handleMouseMove)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  return (
    <>
      <div
        className="constellation-background absolute inset-0 pointer-events-none"
        ref={constellationRef}
      >
        {/* Test element to verify it's rendering */}
        <div
          className="constellation-layer absolute top-1/2 left-1/2 w-32 h-32 bg-flame/50 rounded-full -translate-x-1/2 -translate-y-1/2"
          data-depth="0.5"
        />
        <div
          className="cluster absolute top-1/4 right-1/4 w-24 h-24 bg-ember/30 rounded-full"
        />
      </div>

      <style jsx global>{`
        .constellation-background {
          z-index: 1;
        }
      `}</style>
    </>
  )
}
