'use client'

import React, { useState } from 'react'
import { Check, ArrowRight, X } from 'lucide-react'
import { scrollToElement } from '@/lib/utils'
import { balanceHeadline, balanceText } from '@/lib/typography-utils'
import pricingData from '@/data/designForGood/pricing.json'

export default function DesignForGoodPricing() {
  const { pricing } = pricingData
  const [isLoading, setIsLoading] = useState(false)
  const plan = pricing.plans[0] // Get first plan

  const handleCheckout = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/stripe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId: plan.stripePriceIdFirstYear,
          successUrl: `${window.location.origin}/design-for-good/success`,
          cancelUrl: `${window.location.origin}/design-for-good#pricing`,
        }),
      })

      const { url } = await response.json()

      if (url) {
        window.location.href = url
      }
    } catch (error) {
      scrollToElement('#contact')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section id="pricing" className="section-padding bg-ink">
      <div className="container-premium">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="mb-4 font-medium text-sm tracking-[0.1em] uppercase text-charity">
            {pricing.eyebrow}
          </p>
          <h2
            className="mb-6 text-section font-playfair font-bold tracking-[-0.03em] text-white headline-balanced"
            dangerouslySetInnerHTML={{ __html: balanceHeadline(pricing.title) }}
          />

          {/* Description Paragraphs */}
          <div className="max-w-3xl mx-auto space-y-4">
            {pricing.description.map((paragraph, index) => (
              <p
                key={index}
                className={`${index === 0 ? 'text-lg' : 'text-xl font-medium'} font-light text-white/90 leading-[1.7]`}
                dangerouslySetInnerHTML={{ __html: paragraph }}
              />
            ))}
          </div>
        </div>

        {/* Single Pricing Card */}
        <div className="max-w-5xl mx-auto">
          <div className="bg-white relative">

            {/* Top Section - Plan Name, Tagline, Description */}
            <div className="text-center pt-16 pb-12 px-8">
              <h4 className="text-4xl font-playfair font-bold text-ink mb-4">{plan.name}</h4>
              <p className="text-xl text-charity font-medium mb-4">{plan.tagline}</p>
              <p className="text-base text-smoke font-light max-w-2xl mx-auto leading-relaxed">{plan.description}</p>
            </div>

            {/* Pricing Display - Centered, Large */}
            <div className="text-center pb-12 px-8">
              <div className="flex items-center justify-center gap-16 mb-8">
                {/* Regular Price */}
                <div>
                  <div className="text-xs uppercase tracking-wider text-smoke mb-2">{plan.standardPriceLabel || 'Regular Price'}</div>
                  <div className="text-2xl font-light text-smoke">{plan.standardPrice}{plan.period}</div>
                </div>

                {/* First Year Price - LARGE */}
                <div>
                  <div className="text-sm uppercase tracking-wider text-charity font-semibold mb-3">{plan.firstYearDiscount}</div>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-8xl font-light text-ink" style={{ lineHeight: '1' }}>{plan.firstYearPrice}</span>
                    <span className="text-lg text-smoke font-light">{plan.period}</span>
                  </div>
                </div>

                {/* Then Price */}
                <div>
                  <div className="text-xs uppercase tracking-wider text-smoke mb-2">{plan.lifetimePriceLabel || `Then ${plan.lifetimeDiscount}`}</div>
                  <div className="text-2xl font-light text-ink">{plan.lifetimePrice}{plan.period}</div>
                </div>
              </div>
            </div>

            {/* Two Column Section */}
            <div className="grid md:grid-cols-2 gap-16 px-12 pb-12">
              {/* Left Column - Problems */}
              <div>
                <h5 className="text-2xl font-playfair font-bold text-ink mb-8">What You'll Stop Struggling With:</h5>
                <div className="space-y-5">
                  {plan.problemsSolved.map((problem, index) => (
                    <div key={index} className="flex items-start gap-4">
                      <X className="w-6 h-6 mt-0.5 flex-shrink-0 text-charity" strokeWidth={2} />
                      <span className="text-base text-smoke font-light leading-relaxed">{problem}</span>
                    </div>
                  ))}
                </div>

                {/* Perfect For Box */}
                <div className="mt-10 p-6 bg-silk/50 border-l-4 border-l-charity">
                  <p className="text-sm font-semibold text-ink mb-2">Perfect for:</p>
                  <p className="text-sm text-smoke font-light leading-relaxed">{plan.bestFor}</p>
                </div>
              </div>

              {/* Right Column - Features */}
              <div>
                <h5 className="text-2xl font-playfair font-bold text-ink mb-8">What's Included:</h5>
                <div className="space-y-5">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-4">
                      <Check className="w-6 h-6 mt-0.5 flex-shrink-0 text-charity" strokeWidth={2} />
                      <span className="text-base text-ink font-light leading-relaxed">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* CTAs Section */}
            <div className="px-12 pb-12">
              <div className="grid md:grid-cols-2 gap-4 mb-8">
                <button
                  onClick={handleCheckout}
                  disabled={isLoading}
                  className="inline-flex items-center justify-center gap-3 px-8 py-5 bg-ink text-white font-semibold text-sm tracking-wider uppercase transition-all duration-300 hover:bg-charity disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Loading...' : plan.ctaText}
                  {!isLoading && <ArrowRight className="w-5 h-5" strokeWidth={2} />}
                </button>

                <a
                  href="https://meet.brevo.com/designworksbureau"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-8 py-5 bg-white border-2 border-ink text-ink font-semibold text-sm tracking-wider uppercase transition-all duration-300 hover:bg-ink hover:text-white"
                >
                  {pricing.cta.secondary}
                </a>
              </div>

              {/* Guarantees */}
              <div className="text-center">
                <div className="flex flex-wrap justify-center gap-8 text-sm text-smoke font-light">
                  {pricing.guarantees.map((guarantee, index) => (
                    <span key={index} className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-charity" strokeWidth={2} />
                      {guarantee}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        {pricing.additionalInfo && (
          <div className="text-center mt-8 text-white/80">
            <p className="text-lg font-light">
              {pricing.additionalInfo.text}{' '}
              <button
                onClick={() => scrollToElement(pricing.additionalInfo.linkAction)}
                className="text-charity hover:text-white underline font-medium transition-colors"
              >
                {pricing.additionalInfo.linkText}
              </button>
            </p>
          </div>
        )}
      </div>
    </section>
  )
}
