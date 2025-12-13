'use client'

import React, { useState } from 'react'
import { Check, Star, AlertTriangle, Clock, Users, TrendingUp } from 'lucide-react'
import { balanceHeadline, balanceDescription } from '@/lib/typography-utils'
import { scrollToElement } from '@/lib/scroll-utils'
import { useCampaignSpots } from '@/hooks/useCampaignSpots'
import brandedPricingData from '@/data/brandedPricing.json'
import type { CampaignConfig } from '@/types/campaign'
import campaignData from '@/data/activeCampaign.json'

const typedCampaignData = campaignData as CampaignConfig

export default function BrandedPricingSection() {
  const [isEnterprisePlus, setIsEnterprisePlus] = useState(false)
  const { hero, plans, enterprisePlus } = brandedPricingData

  // Get real-time campaign spots from Stripe
  const campaignSpots = useCampaignSpots('classOf2025')

  // Check if Class of 2025 campaign is active
  const isCampaignActive = typedCampaignData.active === 'classOf2025' && typedCampaignData.classOf2025.enabled

  // Use dynamic spots if available, fallback to static config during loading
  const spotsRemaining = campaignSpots.loading
    ? typedCampaignData.classOf2025.spotsRemaining
    : campaignSpots.spotsRemaining

  const handleGetStarted = async (plan: typeof plans[0] | typeof enterprisePlus) => {
    if ('isCustom' in plan && plan.isCustom) {
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

  const cardStyle = (isPopular: boolean) => ({
    position: 'relative' as const,
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
          <h2
            className="mb-8 text-5xl font-light tracking-tight headline-balanced"
            style={{ color: '#2c2c2c' }}
            dangerouslySetInnerHTML={{ __html: balanceHeadline(hero.title) }}
          />

          <div className="text-center max-w-3xl mx-auto">
            <p className="text-xl font-light leading-relaxed mb-6 body-balanced" style={{ color: '#6b7280' }}
               dangerouslySetInnerHTML={{ __html: balanceDescription(hero.description[0]) }} />
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

              // CAMPAIGN LOGIC: Check if this is Business plan during campaign
              const isBusinessPlan = plan.name === "Business"
              const isCampaignBusiness = isBusinessPlan && isCampaignActive

              // Override stripe price ID for campaign
              if (isCampaignBusiness && typedCampaignData.classOf2025.pricing.stripePriceId) {
                currentPlan = {
                  ...currentPlan,
                  stripePriceId: typedCampaignData.classOf2025.pricing.stripePriceId
                }
              }

              // Determine dynamic styling
              const cardBg = isCampaignBusiness ? '#1A1A1A' : 'white' // smoke : white
              const textColor = isCampaignBusiness ? 'white' : '#2c2c2c'
              const secondaryTextColor = isCampaignBusiness ? '#E5E5E5' : '#6b7280'
              const cardBorder = isCampaignBusiness
                ? '2px solid #ff6b35'
                : (currentPlan.popular ? '2px solid #ff6b35' : '1px solid rgba(107, 114, 128, 0.2)')

              // Determine pricing
              const displayPrice = isCampaignBusiness ? typedCampaignData.classOf2025.pricing.amount : currentPlan.price
              const originalPrice = isCampaignBusiness ? currentPlan.price : null

              // Badge content
              const badgeContent = isCampaignBusiness
                ? `CLASS OF 2025 - ${spotsRemaining} SPOTS LEFT`
                : (currentPlan.popular ? 'Saves Most Time' : null)

              return (
                <div key={index} style={{
                  ...cardStyle(currentPlan.popular || isCampaignBusiness),
                  backgroundColor: cardBg,
                  border: cardBorder,
                  display: 'flex',
                  flexDirection: 'column'
                }}>
                  {badgeContent && (
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
                      <TrendingUp style={{ width: '16px', height: '16px' }} strokeWidth={1.2} />
                      {badgeContent}
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

                  <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <h4 style={{
                      fontSize: '1.5rem',
                      fontWeight: '300',
                      marginBottom: '0.5rem',
                      letterSpacing: '-0.025em',
                      color: textColor
                    }}>
                      {currentPlan.name}
                    </h4>
                    <p style={{
                      fontSize: '1.125rem',
                      fontWeight: '500',
                      marginBottom: '1.5rem',
                      color: '#ff6b35'
                    }}>
                      {currentPlan.tagline}
                    </p>

                    {/* Price with optional strikethrough */}
                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '1.5rem'
                    }}>
                      {originalPrice && (
                        <span style={{
                          fontSize: '1rem',
                          fontWeight: '300',
                          color: secondaryTextColor,
                          textDecoration: 'line-through',
                          opacity: 0.7,
                          marginBottom: '0.25rem'
                        }}>
                          {originalPrice}
                        </span>
                      )}

                      <div style={{ display: 'flex', alignItems: 'baseline' }}>
                        <span style={{
                          fontSize: '3rem',
                          fontWeight: '300',
                          letterSpacing: '-0.025em',
                          color: textColor
                        }}>
                          {displayPrice}
                        </span>
                        <span style={{
                          marginLeft: '0.5rem',
                          fontWeight: '300',
                          color: secondaryTextColor
                        }}>
                          {currentPlan.period}
                        </span>
                      </div>

                      {isCampaignBusiness && (
                        <span style={{
                          fontSize: '0.75rem',
                          fontWeight: '600',
                          color: '#ff6b35',
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                          marginTop: '0.5rem'
                        }}>
                          Save {typedCampaignData.classOf2025.pricing.savings}
                        </span>
                      )}
                    </div>

                    <p style={{
                      fontSize: '0.875rem',
                      fontWeight: '300',
                      padding: '0.5rem 1rem',
                      display: 'inline-block',
                      border: '1px solid rgba(107, 114, 128, 0.2)',
                      color: secondaryTextColor,
                      backgroundColor: isCampaignBusiness ? 'rgba(255, 255, 255, 0.05)' : '#faf9f7'
                    }}>
                      {currentPlan.bestFor}
                    </p>
                  </div>

                  {/* Problems solved section */}
                  <div style={{ marginBottom: '2rem' }}>
                    <h5 style={{
                      fontWeight: '500',
                      marginBottom: '1rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      color: textColor
                    }}>
                      <div style={{ width: '8px', height: '8px', backgroundColor: '#ff6b35' }}></div>
                      Problems This Solves:
                    </h5>
                    <ul style={{
                      listStyle: 'none',
                      padding: 0,
                      margin: 0,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.75rem'
                    }}>
                      {currentPlan.problemsSolved.slice(0, 3).map((problem, problemIndex) => (
                        <li key={problemIndex} style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '0.75rem'
                        }}>
                          <Check
                            style={{
                              width: '20px',
                              height: '20px',
                              marginTop: '0.125rem',
                              flexShrink: 0,
                              color: '#ff6b35'
                            }}
                            strokeWidth={1.2}
                          />
                          <span style={{
                            fontSize: '0.875rem',
                            fontWeight: '300',
                            lineHeight: '1.625',
                            color: secondaryTextColor
                          }}>
                            {problem}
                          </span>
                        </li>
                      ))}
                    </ul>

                    {/* Campaign-specific urgency note */}
                    {isCampaignBusiness && (
                      <p style={{
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        color: '#ff6b35',
                        marginTop: '1rem',
                        padding: '0.75rem',
                        backgroundColor: 'rgba(255, 107, 53, 0.1)',
                        border: '1px solid rgba(255, 107, 53, 0.3)',
                        fontStyle: 'italic'
                      }}>
                        Lock in this rate for life. Price increases Jan 1, 2026.
                      </p>
                    )}
                  </div>

                  {/* What's included */}
                  <div style={{ marginBottom: '2rem', flexGrow: 1 }}>
                    <h5 style={{
                      fontWeight: '500',
                      marginBottom: '1rem',
                      color: textColor
                    }}>
                      What's Included:
                    </h5>
                    <ul style={{
                      listStyle: 'none',
                      padding: 0,
                      margin: 0,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.5rem'
                    }}>
                      {currentPlan.features.map((feature, featureIndex) => {
                        // For Enterprise+, highlight the additional features (beyond original 6)
                        const isAdditionalFeature = isEnterprise && isEnterprisePlus && featureIndex >= 6

                        return (
                          <li key={featureIndex} style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '0.75rem'
                          }}>
                            <div style={{
                              width: '6px',
                              height: '6px',
                              backgroundColor: isAdditionalFeature ? '#ff6b35' : 'rgba(107, 114, 128, 0.4)',
                              marginTop: '8px',
                              flexShrink: 0
                            }}></div>
                            <span style={{
                              fontSize: '0.875rem',
                              fontWeight: isAdditionalFeature ? '500' : '300',
                              color: isAdditionalFeature ? textColor : secondaryTextColor
                            }}>
                              {feature}
                            </span>
                          </li>
                        )
                      })}
                    </ul>
                  </div>

                  <button
                    onClick={() => handleGetStarted(currentPlan)}
                    style={{
                      width: '100%',
                      padding: '1rem 1.5rem',
                      fontWeight: '500',
                      fontSize: '0.875rem',
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      transition: 'all 0.3s ease',
                      backgroundColor: currentPlan.popular || isCampaignBusiness ? '#ff6b35' : '#2c2c2c',
                      color: 'white',
                      border: 'none',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => {
                      (e.target as HTMLButtonElement).style.backgroundColor = '#e55a2b'
                    }}
                    onMouseLeave={(e) => {
                      (e.target as HTMLButtonElement).style.backgroundColor =
                        (currentPlan.popular || isCampaignBusiness) ? '#ff6b35' : '#2c2c2c'
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
                (e.target as HTMLButtonElement).style.color = '#e55a2b'
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLButtonElement).style.color = '#ff6b35'
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