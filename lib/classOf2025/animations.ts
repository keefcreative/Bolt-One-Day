import { useEffect, useRef, useState, RefObject } from 'react'

/**
 * Hook for scroll-triggered fade-in animations using Intersection Observer
 */
export function useScrollReveal(threshold = 0.1) {
  const ref = useRef<HTMLElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          // Disconnect after reveal for performance
          observer.disconnect()
        }
      },
      { threshold }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [threshold])

  return { ref, isVisible }
}

/**
 * Hook for mouse parallax effect (subtle movement based on mouse position)
 */
export function useMouseParallax(intensity = 5) {
  const [offset, setOffset] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * intensity
      const y = (e.clientY / window.innerHeight - 0.5) * intensity
      setOffset({ x, y })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [intensity])

  return offset
}

/**
 * Hook for staggered animations (e.g., card reveals with delay)
 */
export function useStaggeredReveal(count: number, delayMs = 200) {
  const [visibleIndices, setVisibleIndices] = useState<Set<number>>(new Set())
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Trigger staggered reveals
          for (let i = 0; i < count; i++) {
            setTimeout(() => {
              setVisibleIndices((prev) => {
                const newSet = new Set(prev)
                newSet.add(i)
                return newSet
              })
            }, i * delayMs)
          }
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [count, delayMs])

  return { ref, visibleIndices }
}

/**
 * Hook for scroll progress tracking (useful for timeline animations)
 */
export function useScrollProgress(ref: RefObject<HTMLElement>) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) return

      const element = ref.current
      const rect = element.getBoundingClientRect()
      const elementHeight = element.offsetHeight
      const viewportHeight = window.innerHeight

      // Calculate how much of the element has been scrolled through
      const scrolled = Math.max(0, viewportHeight - rect.top)
      const maxScroll = elementHeight + viewportHeight
      const percentage = Math.min(100, (scrolled / maxScroll) * 100)

      setProgress(percentage)
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll() // Initial call

    return () => window.removeEventListener('scroll', handleScroll)
  }, [ref])

  return progress
}

/**
 * Utility function to generate staggered animation delays
 */
export function getStaggerDelay(index: number, baseDelay = 0.2): string {
  return `${baseDelay * index}s`
}
