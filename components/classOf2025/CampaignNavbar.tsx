'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import navigationData from '@/data/navigation.json'

export default function CampaignNavbar() {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // Initial call

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <nav
      className={`fixed left-0 right-0 ${isScrolled ? 'py-4' : 'py-6'} transition-all duration-300`}
      style={{
        top: 'var(--banner-height, 0px)',
        zIndex: 40,
        background: 'rgba(10, 10, 10, 0.85)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      }}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="inline-flex items-center gap-3 group no-underline"
          >
            <div className="relative w-16 h-16 animate-logo-glow-rotate">
              <svg viewBox="0 0 99.21 99.21" className="w-full h-full animate-logo-float">
                <path
                  className="fill-flame transition-colors duration-300"
                  d="M36.21,22.68c-7.47,0-13.53,6.06-13.53,13.53v27.64c0,7.47,6.06,13.53,13.53,13.53h25.36c7.47,0,13.53-6.06,13.53-13.53V22.68h-38.89ZM48.53,69.52c0,1.17-.81,1.62-1.81,1l-12.63-7.82c-1-.62-1.81-2.07-1.81-3.24v-13.92c0-1.17.81-1.62,1.81-1l12.63,7.82c1,.62,1.81,2.07,1.81,3.24v13.92ZM56.84,64.86c0,1.17-.83,2.59-1.86,3.17l-3.46,1.95c-1.03.58-1.86.09-1.86-1.08v-13.91c0-1.17-.81-2.62-1.81-3.24l-5.45-3.37c-1-.62-1.81-2.07-1.81-3.24v-4.24c0-1.17.81-1.62,1.81-1l12.63,7.81c1,.62,1.81,2.07,1.81,3.24v13.92ZM65.51,59.83c0,1.17-.82,2.6-1.84,3.2l-3.86,2.25c-1.02.59-1.84.12-1.84-1.05v-13.91c0-1.17-.81-2.62-1.81-3.24l-5.09-3.15c-1-.62-1.81-2.07-1.81-3.24v-4.83c0-1.17.81-1.62,1.81-1l12.63,7.81c1,.62,1.81,2.07,1.81,3.24v13.92ZM65.51,31.38v8.96c0,1.17-.81,1.62-1.81,1l-3.83-2.37c-1-.62-1.81-2.07-1.81-3.24v-4.35c0-1.17.96-2.12,2.14-2.12h5.32v2.12Z"
                />
              </svg>
            </div>
            <span className="text-2xl font-light tracking-tight text-pearl group-hover:text-flame transition-colors duration-300">
              {navigationData.brand.name}
            </span>
          </Link>

          {/* Let's Talk CTA Button */}
          <a
            href={navigationData.tertiaryCta.href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-flame text-white font-medium text-sm uppercase tracking-wider transition-all duration-base ease-premium hover:bg-ember hover:text-white hover:shadow-card-hover hover:-translate-y-0.5"
          >
            {navigationData.tertiaryCta.text}
          </a>
        </div>
      </div>
    </nav>
  )
}
