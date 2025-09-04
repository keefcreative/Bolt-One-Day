'use client'

import React from 'react'
import { useState, useEffect } from 'react'
import { Menu, X, ArrowLeft } from 'lucide-react'
import { useScrollSpy } from '@/hooks/useScrollSpy'
import { scrollToElement } from '@/lib/utils'
import { usePathname, useRouter } from 'next/navigation'
import navigationData from '@/data/navigation.json'

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
    { label: "Your Investment", href: "#dfg-pricing" },
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
      <nav className="nav-sticky py-6 transition-all duration-300 bg-pearl/80 backdrop-blur-md">
        <div className="container-premium">
          <div className="flex items-center justify-between">
            <div className="font-semibold text-xl text-ink">Loading...</div>
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
      <nav className={`nav-sticky ${isScrolled ? 'py-4' : 'py-6'} transition-all duration-300 bg-pearl/80 backdrop-blur-md`}>
        <div className="container-premium">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div 
              className="font-semibold text-xl text-ink cursor-pointer hover:text-flame transition-colors duration-300"
              onClick={handleLogoClick}
            >
              {navigationData.brand.name}
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
              className="md:hidden p-2"
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
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-mist/20">
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