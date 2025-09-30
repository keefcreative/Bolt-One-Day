'use client'

import React from 'react'
import { ArrowRight } from 'lucide-react'
import { scrollToElement } from '@/lib/utils'
import { balanceHeadline, balanceDescription, balanceText } from '@/lib/typography-utils'
import finalCtaData from '@/data/designForGood/finalCta.json'

export default function DesignForGoodFinalCta() {
  const { finalCta } = finalCtaData

  return (
    <section className="section-padding bg-ink relative overflow-hidden">
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-60"
        style={{
          backgroundImage: `
            linear-gradient(rgba(20,20,20,0.65), rgba(20,20,20,0.75)),
            url('/images/DFg-cta-background.jpeg')
          `,
          filter: 'saturate(0.8)'
        }}
      />

      {/* Vignette Effect */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.6) 100%)'
        }}
      />

      <div className="container-premium relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          {/* Header */}
          <p className="mb-4 font-medium text-sm tracking-[0.1em] uppercase text-charity">
            {finalCta.eyebrow}
          </p>
          <h2
            className="mb-6 text-section font-playfair font-bold tracking-[-0.03em] text-white headline-balanced"
            dangerouslySetInnerHTML={{ __html: balanceHeadline(finalCta.title) }}
          />
          <p
            className="text-xl font-light text-white/80 mb-8 leading-[1.8] description-balanced"
            dangerouslySetInnerHTML={{ __html: balanceDescription(finalCta.description) }}
          />
          <p
            className="text-lg font-light text-white/90 mb-12 leading-[1.6] body-balanced"
            dangerouslySetInnerHTML={{ __html: balanceText(finalCta.subtitle) }}
          />
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12">
            <button
              onClick={() => scrollToElement(finalCta.primaryCta.href)}
              className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-ink text-white font-medium text-[0.875rem] tracking-[0.05em] uppercase transition-all duration-400 hover:bg-charity hover:border-charity hover:shadow-premium-lg hover:-translate-y-0.5 border border-white/30"
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