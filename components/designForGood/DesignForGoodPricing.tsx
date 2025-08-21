'use client'

import React from 'react'
import { Check, ArrowRight } from 'lucide-react'
import { scrollToElement } from '@/lib/utils'
import pricingData from '@/data/designForGood/pricing.json'

export default function DesignForGoodPricing() {
  const { pricing } = pricingData

  return (
    <section id="pricing" className="section-padding bg-ink">
      <div className="container-premium">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="mb-4 font-medium text-sm tracking-[0.1em] uppercase" style={{ color: '#16a34a' }}>
            {pricing.eyebrow}
          </p>
          <h2 className="mb-6 text-section font-playfair font-bold tracking-[-0.03em] text-white">
            {pricing.title}
          </h2>
          <p className="text-lg font-light text-white/80 leading-[1.6] max-w-2xl mx-auto">
            {pricing.description}
          </p>
        </div>

        {/* Pricing Card */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-white p-12 relative">
            {/* Plan Name */}
            <div className="text-center mb-8">
              <h3 className="text-2xl font-playfair font-bold text-ink mb-4">{pricing.plan.name}</h3>
              
              {/* Pricing */}
              <div className="space-y-4">
                {/* Standard Price (crossed out) */}
                <div className="text-smoke">
                  <span className="text-sm uppercase tracking-wider">Standard Price</span>
                  <div className="text-2xl font-light line-through">{pricing.plan.standardPrice}</div>
                </div>
                
                {/* First Year Price */}
                <div>
                  <span className="text-sm uppercase tracking-wider text-smoke">First Year ({pricing.plan.firstYearDiscount})</span>
                  <div className="flex items-baseline justify-center gap-2">
                    <span className="text-5xl font-light text-ink">{pricing.plan.firstYearPrice}</span>
                    <span className="text-smoke">{pricing.plan.period}</span>
                  </div>
                </div>
                
                {/* Lifetime Price */}
                <div className="text-smoke">
                  <span className="text-sm uppercase tracking-wider">Lifetime ({pricing.plan.lifetimeDiscount})</span>
                  <div className="text-2xl font-light">{pricing.plan.lifetimePrice}</div>
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="mb-8">
              <h4 className="text-lg font-playfair font-bold text-ink mb-6 text-center">Everything You Need to Succeed</h4>
              <div className="space-y-4">
                {pricing.features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <Check className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: '#16a34a' }} strokeWidth={2} />
                    <div>
                      <div className="font-medium text-ink">{feature.title}</div>
                      <div className="text-sm text-smoke font-light">{feature.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Guarantees */}
            <div className="text-center mb-8">
              <div className="flex flex-wrap justify-center gap-4 text-sm text-smoke">
                {pricing.guarantees.map((guarantee, index) => (
                  <span key={index}>{guarantee}</span>
                ))}
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => scrollToElement('#contact')}
                className="flex-1 inline-flex items-center justify-center gap-3 px-8 py-4 bg-ink text-white font-medium text-sm tracking-[0.05em] uppercase transition-all duration-400 hover:shadow-premium-lg hover:-translate-y-0.5"
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#16a34a'
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = '#0A0A0A'
                }}
              >
                {pricing.cta.primary}
                <ArrowRight className="w-5 h-5" strokeWidth={1.2} />
              </button>
              
              <a
                href="https://calendly.com/designworks/consultation"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-3 px-8 py-4 bg-transparent border border-ink text-ink font-medium text-sm tracking-[0.05em] uppercase transition-all duration-400 hover:bg-ink hover:text-white"
              >
                {pricing.cta.secondary}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}