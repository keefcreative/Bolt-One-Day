'use client'

import React, { useState } from 'react'
import { Check, Star, AlertTriangle, Clock, Users, TrendingUp } from 'lucide-react'
import brandedPricingData from '@/data/brandedPricing.json'

// Utility function for smooth scrolling (replace with your actual import)
const scrollToElement = (selector) => {
  const element = document.querySelector(selector)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
  }
}

export default function BrandedPricingSection() {
  const [isEnterprisePlus, setIsEnterprisePlus] = useState(false)
  const { hero, plans, enterprisePlus } = brandedPricingData

  const handleGetStarted = async (plan: typeof plans[0] | typeof enterprisePlus) => {
    if (plan.isCustom) {
      scrollToElement('#contact')
      return
    }

    try {
      const response = await fetch('/api/stripe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId: plan.stripePriceId,
        }),
      })

      const { url } = await response.json()
      
      if (url) {
        window.location.href = url
      }
    } catch (error) {
      // Error creating checkout session
      // Fallback to contact form
      scrollToElement('#contact')
    }
  }

  const sectionStyle = {
    padding: '5rem 0',
    backgroundColor: '#faf9f7'
  }

  const containerStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 2rem'
  }

  const cardStyle = (isPopular) => ({
    position: 'relative',
    background: 'white',
    padding: '2rem',
    border: isPopular ? '2px solid #ff6b35' : '1px solid rgba(107, 114, 128, 0.2)',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.3s ease'
  })

  return (
    <section id="pricing" style={sectionStyle}>
      <div style={containerStyle}>
        {/* Problem-focused hero section */}
        <div className="text-center max-w-4xl mx-auto mb-20">
          <p className="mb-4 font-medium text-sm tracking-widest uppercase" style={{ color: '#ff6b35' }}>
            {hero.eyebrow}
          </p>
          <h2 className="mb-8 text-5xl font-light tracking-tight" style={{ color: '#2c2c2c' }}>
            {hero.title.replace('<br />', '')}
          </h2>
          
          <div className="text-center max-w-3xl mx-auto">
            <p className="text-xl font-light leading-relaxed mb-6" style={{ color: '#6b7280' }} 
               dangerouslySetInnerHTML={{ __html: hero.description[0] }} />
            <p className="text-xl font-medium leading-relaxed" style={{ color: '#2c2c2c' }}>
              {hero.description[1]}
            </p>
          </div>
        </div>

        {/* Solution-focused pricing cards */}
        <div className="mb-16">
          <h3 className="text-3xl font-light text-center mb-16 tracking-tight" style={{ color: '#2c2c2c' }}>
            {hero.sectionTitle}
          </h3>
          
          <div className="grid grid-cols-3 gap-8 max-w-7xl mx-auto mb-16">
            {plans.map((plan, index) => {
              // Determine if this is Enterprise plan and get appropriate data
              const isEnterprise = plan.name === "Enterprise"
              let currentPlan = plan
              
              if (isEnterprise && isEnterprisePlus) {
                currentPlan = {
                  ...plan,
                  name: "Enterprise+",
                  price: enterprisePlus.price,
                  tagline: enterprisePlus.tagline,
                  ctaText: enterprisePlus.ctaText,
                  bestFor: enterprisePlus.bestFor,
                  stripePriceId: enterprisePlus.stripePriceId,
                  problemsSolved: enterprisePlus.problemsSolved,
                  features: enterprisePlus.features
                }
              }

              return (
                <div key={index} style={{...cardStyle(currentPlan.popular), display: 'flex', flexDirection: 'column'}}>
                  {currentPlan.popular && (
                    <div style={{
                      position: 'absolute',
                      top: '-1rem',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      backgroundColor: '#ff6b35',
                      color: 'white',
                      padding: '0.5rem 1.5rem',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      whiteSpace: 'nowrap'
                    }}>
                      <TrendingUp className="w-4 h-4" strokeWidth={1.2} />
                      Saves Most Time
                    </div>
                  )}

                  {/* SQUARED EDGE TOGGLE SWITCH */}
                  {isEnterprise && (
                    <div style={{
                      position: 'absolute',
                      top: '-1rem',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      display: 'flex',
                      backgroundColor: '#f8f9fa',
                      border: '1px solid rgba(107, 114, 128, 0.2)',
                      whiteSpace: 'nowrap'
                    }}>
                      <button
                        onClick={() => setIsEnterprisePlus(false)}
                        style={{
                          padding: '0.5rem 1.5rem',
                          fontSize: '0.875rem',
                          fontWeight: '500',
                          backgroundColor: !isEnterprisePlus ? '#ff6b35' : 'transparent',
                          color: !isEnterprisePlus ? 'white' : '#6b7280',
                          border: 'none',
                          cursor: 'pointer',
                          boxShadow: !isEnterprisePlus ? 'none' : 'inset 0 2px 4px rgba(0, 0, 0, 0.1)',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        Enterprise
                      </button>
                      <button
                        onClick={() => setIsEnterprisePlus(true)}
                        style={{
                          padding: '0.5rem 1.5rem',
                          fontSize: '0.875rem',
                          fontWeight: '500',
                          backgroundColor: isEnterprisePlus ? '#ff6b35' : 'transparent',
                          color: isEnterprisePlus ? 'white' : '#6b7280',
                          border: 'none',
                          cursor: 'pointer',
                          boxShadow: isEnterprisePlus ? 'none' : 'inset 0 2px 4px rgba(0, 0, 0, 0.1)',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        Enterprise+
                      </button>
                    </div>
                  )}

                  <div className="text-center mb-8">
                    <h4 className="text-2xl font-light mb-2 tracking-tight" style={{ color: '#2c2c2c' }}>
                      {currentPlan.name}
                    </h4>
                    <p className="text-lg font-medium mb-6" style={{ color: '#ff6b35' }}>
                      {currentPlan.tagline}
                    </p>
                    <div className="flex items-baseline justify-center mb-6">
                      <span className="text-5xl font-light tracking-tight" style={{ color: '#2c2c2c' }}>
                        {currentPlan.price}
                      </span>
                      <span className="ml-2 font-light" style={{ color: '#6b7280' }}>
                        {currentPlan.period}
                      </span>
                    </div>
                    <p className="text-sm font-light px-4 py-2 inline-block border" style={{ 
                      color: '#6b7280',
                      backgroundColor: '#faf9f7',
                      borderColor: 'rgba(107, 114, 128, 0.2)'
                    }}>
                      {currentPlan.bestFor}
                    </p>
                  </div>

                  {/* Problems solved section */}
                  <div className="mb-8">
                    <h5 className="font-medium mb-4 flex items-center gap-2" style={{ color: '#2c2c2c' }}>
                      <div style={{ width: '8px', height: '8px', backgroundColor: '#ff6b35' }}></div>
                      Problems This Solves:
                    </h5>
                    <ul className="space-y-3">
                      {currentPlan.problemsSolved.slice(0, 3).map((problem, problemIndex) => (
                        <li key={problemIndex} className="flex items-start gap-3">
                          <Check className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: '#ff6b35' }} strokeWidth={1.2} />
                          <span className="text-sm font-light leading-relaxed" style={{ color: '#6b7280' }}>
                            {problem}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* What's included */}
                  <div className="mb-8 flex-grow">
                    <h5 className="font-medium mb-4" style={{ color: '#2c2c2c' }}>What's Included:</h5>
                    <ul className="space-y-2">
                      {currentPlan.features.map((feature, featureIndex) => {
                        // For Enterprise+, highlight the additional features (beyond original 6)
                        const isAdditionalFeature = isEnterprise && isEnterprisePlus && featureIndex >= 6
                        
                        return (
                          <li key={featureIndex} className="flex items-start gap-3">
                            <div style={{ 
                              width: '6px', 
                              height: '6px', 
                              backgroundColor: isAdditionalFeature ? '#ff6b35' : 'rgba(107, 114, 128, 0.4)',
                              marginTop: '8px',
                              flexShrink: 0
                            }}></div>
                            <span 
                              className="text-sm font-light" 
                              style={{ 
                                color: isAdditionalFeature ? '#2c2c2c' : '#6b7280',
                                fontWeight: isAdditionalFeature ? '500' : '300'
                              }}
                            >
                              {feature}
                            </span>
                          </li>
                        )
                      })}
                    </ul>
                  </div>

                  <button
                    onClick={() => handleGetStarted(currentPlan)}
                    className="w-full py-4 px-6 font-medium text-sm tracking-widest uppercase transition-all duration-300"
                    style={{
                      backgroundColor: currentPlan.popular ? '#ff6b35' : '#2c2c2c',
                      color: 'white',
                      border: 'none',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = currentPlan.popular ? '#e55a2b' : '#ff6b35'
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = currentPlan.popular ? '#ff6b35' : '#2c2c2c'
                    }}
                  >
                    {currentPlan.ctaText}
                  </button>
                </div>
              )
            })}
          </div>
          
          {/* Value proposition after plans */}
          <div className="bg-white border-2 p-8 mb-16" style={{ borderColor: 'rgba(255, 107, 53, 0.2)' }}>
            <h3 className="text-2xl font-light mb-3 tracking-tight text-center" style={{ color: '#2c2c2c' }}>
              The math is simple: One designer's salary = 12 months of unlimited design
            </h3>
            <p className="font-light text-lg leading-relaxed text-center" style={{ color: '#6b7280' }}>
              Why gamble on hiring when you can guarantee results? Start scaling your brand today.
            </p>
          </div>
        </div>

        {/* Additional info */}
        <div className="text-center">
          <p className="font-light text-lg leading-relaxed" style={{ color: '#6b7280' }}>
            Every plan includes unlimited revisions and a dedicated project manager who actually cares about your success.{' '}
            <button
              onClick={() => scrollToElement('#contact')}
              className="underline font-medium"
              style={{ 
                color: '#ff6b35',
                border: 'none',
                background: 'none',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.target.style.color = '#e55a2b'
              }}
              onMouseLeave={(e) => {
                e.target.style.color = '#ff6b35'
              }}
            >
              Need something bigger? Let's talk.
            </button>
          </p>
        </div>
      </div>
    </section>
  )
}