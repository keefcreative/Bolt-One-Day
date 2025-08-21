'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import logoCarouselData from '@/data/logoCarousel.json'

export default function LogoCarousel() {
  const { logoCarousel } = logoCarouselData
  const carouselRef = useRef<HTMLDivElement>(null)


  // Duplicate logos for seamless loop
  const duplicatedLogos = [...logoCarousel.logos, ...logoCarousel.logos, ...logoCarousel.logos]

  useEffect(() => {
    const carousel = carouselRef.current
    if (!carousel) return

    // Set initial position to start from the middle set
    carousel.style.transform = 'translateX(-33.333%)'
  }, [])

  return (
    <section className="py-16 bg-white overflow-hidden">
      <div className="container-premium">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="mb-4 font-medium text-flame text-sm tracking-[0.1em] uppercase">
            {logoCarousel.eyebrow}
          </p>
          <h2 className="text-2xl font-light text-ink">
            {logoCarousel.title}
          </h2>
        </div>

        {/* Logo Carousel */}
        <div className="relative">
          {/* Gradient overlays for fade effect */}
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
          
          {/* Carousel container */}
          <div className="overflow-hidden">
            <div 
              ref={carouselRef}
              className="flex items-center gap-16 animate-loop-horizontally"
              style={{
                width: `${duplicatedLogos.length * 128}px`,
                animationDuration: '60s'
              }}
            >
              {duplicatedLogos.map((logo, index) => (
                <div
                  key={`${logo.name}-${index}`}
                  className="flex-shrink-0 w-32 h-16 flex items-center justify-center logo-item"
                  style={{ minWidth: '128px' }}
                >
                  <Image
                    src={logo.src}
                    alt={logo.alt}
                    width={100}
                    height={40}
                    className="object-contain transition-all duration-500 filter grayscale hover:grayscale-0"
                    style={{
                      filter: 'grayscale(100%) opacity(0.6)',
                      width: 'auto',
                      height: 'auto',
                      maxWidth: '100px',
                      maxHeight: '40px'
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom text */}
        <div className="text-center mt-12">
          <p className="text-smoke font-light">
            {logoCarousel.subtitle}
          </p>
        </div>
      </div>

    </section>
  )
}