'use client'

import React from 'react'
import { useState, useEffect } from 'react'
import { Menu, X, ArrowLeft } from 'lucide-react'
import { useScrollSpy } from '@/hooks/useScrollSpy'
import { scrollToElement } from '@/lib/utils'
import { usePathname, useRouter } from 'next/navigation'
import navigationData from '@/data/navigation.json'
import Image from 'next/image'

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)
  
  const pathname = usePathname()
  const router = useRouter()
  const isDesignForGood = pathname === '/design-for-good'
  const isHomePage = pathname === '/'
  
  // Dynamic navigation items based on current page
  const dynamicNavItems = isDesignForGood ? [
    { label: "Our Mission", href: "#dfg-mission" },
    { label: "How It Works", href: "#dfg-process" },
    { label: "The Deal", href: "#dfg-pricing" },
    { label: "Meet the Founder", href: "#dfg-founder" },
    { label: "Got Questions?", href: "#dfg-faq" },
    { label: "Start Today", href: "#dfg-cta" }
  ] : navigationData.items
  
  // Dynamic section IDs for scroll spy
  const sectionIds = dynamicNavItems.map(item => item.href.replace('#', ''))
  const activeSection = useScrollSpy(sectionIds, 100)
  
  // Ensure we have valid navigation data
  if (!navigationData || !navigationData.items) {
    return (
      <nav
        className="nav-sticky py-6 transition-all duration-300"
        style={{
          background: 'rgba(10, 10, 10, 0.85)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <div className="container-premium">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative w-16 h-16 animate-logo-glow-rotate">
                <svg viewBox="0 0 99.21 99.21" className="w-full h-full animate-logo-float">
                  <path
                    className="fill-flame"
                    d="M36.21,22.68c-7.47,0-13.53,6.06-13.53,13.53v27.64c0,7.47,6.06,13.53,13.53,13.53h25.36c7.47,0,13.53-6.06,13.53-13.53V22.68h-38.89ZM48.53,69.52c0,1.17-.81,1.62-1.81,1l-12.63-7.82c-1-.62-1.81-2.07-1.81-3.24v-13.92c0-1.17.81-1.62,1.81-1l12.63,7.82c1,.62,1.81,2.07,1.81,3.24v13.92ZM56.84,64.86c0,1.17-.83,2.59-1.86,3.17l-3.46,1.95c-1.03.58-1.86.09-1.86-1.08v-13.91c0-1.17-.81-2.62-1.81-3.24l-5.45-3.37c-1-.62-1.81-2.07-1.81-3.24v-4.24c0-1.17.81-1.62,1.81-1l12.63,7.81c1,.62,1.81,2.07,1.81,3.24v13.92ZM65.51,59.83c0,1.17-.82,2.6-1.84,3.2l-3.86,2.25c-1.02.59-1.84.12-1.84-1.05v-13.91c0-1.17-.81-2.62-1.81-3.24l-5.09-3.15c-1-.62-1.81-2.07-1.81-3.24v-4.83c0-1.17.81-1.62,1.81-1l12.63,7.81c1,.62,1.81,2.07,1.81,3.24v13.92ZM65.51,31.38v8.96c0,1.17-.81,1.62-1.81,1l-3.83-2.37c-1-.62-1.81-2.07-1.81-3.24v-4.35c0-1.17.96-2.12,2.14-2.12h5.32v2.12Z"
                  />
                </svg>
              </div>
              <span className="font-light text-2xl tracking-tight text-pearl">Loading...</span>
            </div>
          </div>
        </div>
      </nav>
    )
  }

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
      
      // Calculate scroll progress
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight
      const scrolled = (winScroll / height) * 100
      setScrollProgress(scrolled)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // Initial call
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleNavClick = (href: string) => {
    scrollToElement(href)
    setIsOpen(false)
  }
  
  const handleLogoClick = () => {
    if (isHomePage) {
      scrollToElement('#hero')
    } else {
      router.push('/')
    }
  }
  
  const handleDesignForGoodClick = () => {
    if (isDesignForGood) {
      router.push('/')
    } else {
      router.push('/design-for-good')
    }
  }

  return (
    <>
      <nav
        className={`nav-sticky ${isScrolled ? 'py-4' : 'py-6'} transition-all duration-300`}
        style={{
          background: 'rgba(10, 10, 10, 0.85)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <div className="container-premium">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div
              className="flex items-center gap-3 cursor-pointer group"
              onClick={handleLogoClick}
            >
              <div className="relative w-16 h-16 animate-logo-glow-rotate">
                <svg viewBox="0 0 99.21 99.21" className="w-full h-full animate-logo-float">
                  <path
                    className="fill-flame transition-colors duration-300"
                    d="M36.21,22.68c-7.47,0-13.53,6.06-13.53,13.53v27.64c0,7.47,6.06,13.53,13.53,13.53h25.36c7.47,0,13.53-6.06,13.53-13.53V22.68h-38.89ZM48.53,69.52c0,1.17-.81,1.62-1.81,1l-12.63-7.82c-1-.62-1.81-2.07-1.81-3.24v-13.92c0-1.17.81-1.62,1.81-1l12.63,7.82c1,.62,1.81,2.07,1.81,3.24v13.92ZM56.84,64.86c0,1.17-.83,2.59-1.86,3.17l-3.46,1.95c-1.03.58-1.86.09-1.86-1.08v-13.91c0-1.17-.81-2.62-1.81-3.24l-5.45-3.37c-1-.62-1.81-2.07-1.81-3.24v-4.24c0-1.17.81-1.62,1.81-1l12.63,7.81c1,.62,1.81,2.07,1.81,3.24v13.92ZM65.51,59.83c0,1.17-.82,2.6-1.84,3.2l-3.86,2.25c-1.02.59-1.84.12-1.84-1.05v-13.91c0-1.17-.81-2.62-1.81-3.24l-5.09-3.15c-1-.62-1.81-2.07-1.81-3.24v-4.83c0-1.17.81-1.62,1.81-1l12.63,7.81c1,.62,1.81,2.07,1.81,3.24v13.92ZM65.51,31.38v8.96c0,1.17-.81,1.62-1.81,1l-3.83-2.37c-1-.62-1.81-2.07-1.81-3.24v-4.35c0-1.17.96-2.12,2.14-2.12h5.32v2.12Z"
                  />
                </svg>
              </div>
              <span className="font-light text-2xl tracking-tight text-pearl group-hover:text-flame transition-colors duration-300">
                {navigationData.brand.name}
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {/* Regular Navigation Items */}
              {dynamicNavItems.map((item) => (
                <button
                  key={item.href}
                  onClick={() => handleNavClick(item.href)}
                  className={`nav-link ${
                    activeSection === item.href.replace('#', '') ? 'active' : ''
                  }`}
                >
                  {item.label}
                </button>
              ))}
              
              {/* Two Button CTAs */}
              <div className="flex items-center gap-4 ml-4">
                {/* Design For Good / Back to Main Button */}
                <button
                  onClick={handleDesignForGoodClick}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-ink text-white font-medium text-sm uppercase tracking-wider transition-all duration-base ease-premium hover:shadow-card-hover hover:-translate-y-0.5"
                  style={{ 
                    transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                    backgroundColor: isDesignForGood ? '#16a34a' : '#0A0A0A'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = isDesignForGood ? '#15803d' : '#16a34a'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = isDesignForGood ? '#16a34a' : '#0A0A0A'
                  }}
                >
                  {isDesignForGood && <ArrowLeft className="w-4 h-4" />}
                  {isDesignForGood ? 'Back to Main' : navigationData.cta.text}
                </button>
                
                {/* Book a Call - External Link */}
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

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 text-pearl"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-6 h-6" strokeWidth={1.2} /> : <Menu className="w-6 h-6" strokeWidth={1.2} />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isOpen && (
            <div className="md:hidden mt-6 pb-6">
              <div className="flex flex-col space-y-4">
                {/* Regular Navigation Items */}
                {dynamicNavItems.map((item) => (
                  <button
                    key={item.href}
                    onClick={() => handleNavClick(item.href)}
                    className={`nav-link text-left ${
                      activeSection === item.href.replace('#', '') ? 'active' : ''
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
                  
                {/* Mobile Two Buttons */}
                <div className="flex flex-col gap-3 mt-4">
                  {/* Design For Good / Back to Main Button */}
                  <button
                    onClick={handleDesignForGoodClick}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-ink text-white font-medium text-sm uppercase tracking-wider transition-all duration-base ease-premium hover:-translate-y-0.5 hover:shadow-card-hover w-full"
                    style={{ 
                      transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                      backgroundColor: isDesignForGood ? '#16a34a' : '#0A0A0A'
                    }}
                  >
                    {isDesignForGood && <ArrowLeft className="w-4 h-4" />}
                    {isDesignForGood ? 'Back to Main' : navigationData.cta.text}
                  </button>
                  
                  {/* Book a Call - External Link */}
                  <a
                    href={navigationData.tertiaryCta.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-flame text-white font-medium text-sm uppercase tracking-wider transition-all duration-base ease-premium hover:-translate-y-0.5 hover:shadow-card-hover w-full"
                  >
                    {navigationData.tertiaryCta.text}
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Progress Indicator */}
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/10">
          <div
            className="h-full transition-all duration-150 ease-out"
            style={{
              width: `${scrollProgress}%`,
              backgroundColor: isDesignForGood ? '#16a34a' : '#FF6B35'
            }}
          />
        </div>
      </nav>
    </>
  )
}