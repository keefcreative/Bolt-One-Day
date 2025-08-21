'use client'

import React from 'react'
import { ArrowRight } from 'lucide-react'
import { scrollToElement } from '@/lib/utils'
import finalCtaData from '@/data/designForGood/finalCta.json'

export default function DesignForGoodFinalCta() {
  const { finalCta } = finalCtaData

  return (
    <section className="section-padding bg-ink">
      <div className="container-premium">
        <div className="text-center max-w-4xl mx-auto">
          {/* Header */}
          <p className="mb-4 font-medium text-sm tracking-[0.1em] uppercase" style={{ color: '#16a34a' }}>
            {finalCta.eyebrow}
          </p>
          <h2 className="mb-6 text-section font-playfair font-bold tracking-[-0.03em] text-white">
            {finalCta.title}
          </h2>
          <p className="text-xl font-light text-white/80 mb-8 leading-[1.8]">
            {finalCta.description}
          </p>
          <p className="text-lg font-light text-white/90 mb-12 leading-[1.6]">
            {finalCta.subtitle}
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12">
            <button
              onClick={() => scrollToElement(finalCta.primaryCta.href)}
              className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-ink text-white font-medium text-[0.875rem] tracking-[0.05em] uppercase transition-all duration-400 hover:shadow-premium-lg hover:-translate-y-0.5 border border-white/30"
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#16a34a'
                e.target.style.borderColor = '#16a34a'
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#0A0A0A'
                e.target.style.borderColor = 'rgba(255, 255, 255, 0.3)'
              }}
            >
              {finalCta.primaryCta.text}
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" strokeWidth={1.2} />
            </button>
            
            <a
              href={finalCta.secondaryCta.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-transparent border border-white/30 text-white font-medium text-[0.875rem] tracking-[0.05em] uppercase transition-all duration-400 hover:bg-white hover:text-ink"
            >
              {finalCta.secondaryCta.text}
            </a>
          </div>

          {/* Guarantees */}
          <div className="flex flex-wrap justify-center gap-8 text-white/70 font-light">
            {finalCta.guarantees.map((guarantee, index) => (
              <span key={index}>{guarantee}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}