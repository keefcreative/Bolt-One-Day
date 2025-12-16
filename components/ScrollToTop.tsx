'use client'

import { useState, useEffect } from 'react'
import { ChevronUp } from 'lucide-react'

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener('scroll', toggleVisibility, { passive: true })
    toggleVisibility() // Initial check

    return () => {
      window.removeEventListener('scroll', toggleVisibility)
    }
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  return (
    <button
      onClick={scrollToTop}
      className={`fixed right-8 z-40 w-14 h-14 bg-flame text-white flex items-center justify-center transition-all duration-300 ease-premium hover:bg-ember hover:shadow-card-hover hover:-translate-y-0.5 ${
        isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-16 pointer-events-none'
      }`}
      style={{
        top: '50%',
        transform: isVisible ? 'translateY(-50%)' : 'translateY(-50%) translateX(4rem)'
      }}
      aria-label="Scroll to top"
    >
      <ChevronUp className="w-6 h-6" strokeWidth={2} />
    </button>
  )
}
