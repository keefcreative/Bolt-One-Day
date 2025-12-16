'use client'

import { useEffect, useState } from 'react'
import { useCampaignSpots } from '@/hooks/useCampaignSpots'
import Footer from '@/components/Footer'
import campaignData from '@/data/activeCampaign.json'
import v2Content from '@/data/activeCampaignV2.json'
import type { CampaignConfig } from '@/types/campaign'

// Import section components
import CampaignNavbar from '@/components/classOf2025/CampaignNavbar'
import HeroSection from '@/components/classOf2025/HeroSection'
import CompetitiveRealitySection from '@/components/classOf2025/CompetitiveRealitySection'
import WhatYouGetSection from '@/components/classOf2025/WhatYouGetSection'
import WhyLimitSection from '@/components/classOf2025/WhyLimitSection'
import InvestmentSection from '@/components/classOf2025/InvestmentSection'
import TestimonialsSection from '@/components/classOf2025/TestimonialsSection'
import FAQSection from '@/components/classOf2025/FAQSection'
import FinalCTASection from '@/components/classOf2025/FinalCTASection'
import ScrollToTop from '@/components/ScrollToTop'

const typedCampaignData = campaignData as CampaignConfig

export default function ClassOf2025V2Page() {
  const [isMounted, setIsMounted] = useState(false)
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false)
  const [checkoutError, setCheckoutError] = useState<string | null>(null)

  // Get real-time campaign spots from Stripe
  const campaignSpots = useCampaignSpots('classOf2025')

  useEffect(() => {
    setIsMounted(true)

    // Enable smooth scrolling for the page
    document.documentElement.style.scrollBehavior = 'smooth'

    return () => {
      document.documentElement.style.scrollBehavior = ''
    }
  }, [])

  const campaign = typedCampaignData.classOf2025
  const v2Data = v2Content.classOf2025V2

  // Use dynamic spots if available, fallback to static config
  const spotsRemaining = campaignSpots.loading
    ? campaign.spotsRemaining
    : campaignSpots.spotsRemaining
  const totalSpots = campaignSpots.loading
    ? campaign.totalSpots
    : campaignSpots.totalSpots
  const isCampaignAvailable = campaignSpots.loading ? true : campaignSpots.available

  const handleBookCallClick = () => {
    window.open(campaign.urls?.discoveryCall || 'https://meet.brevo.com/designworksbureau/class-of-2025-discovery-call', '_blank')
  }

  const handleEnrollClick = async () => {
    await handleCheckoutClick()
  }

  const handleCheckoutClick = async () => {
    setIsCheckoutLoading(true)
    setCheckoutError(null)

    try {
      const response = await fetch('/api/stripe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId: campaign.pricing.stripePriceId,
          campaign: 'classOf2025',
          successUrl: `${window.location.origin}/success?campaign=classOf2025&session_id={CHECKOUT_SESSION_ID}`,
          cancelUrl: `${window.location.origin}/class-of-2025-v2`,
        }),
      })

      const result = await response.json()

      if (response.status === 409) {
        setCheckoutError(result.message || 'All spots have been filled')
        return
      }

      if (response.status === 410) {
        setCheckoutError(result.message || 'This campaign has ended')
        return
      }

      if (result.error) {
        console.error('Checkout error:', result.error)
        setCheckoutError(result.message || 'Unable to process checkout')
        return
      }

      if (result.url) {
        window.location.href = result.url
      }
    } catch (error) {
      console.error('Error creating checkout session:', error)
      setCheckoutError('Network error. Please try again.')
    } finally {
      setIsCheckoutLoading(false)
    }
  }

  if (!isMounted) {
    return null
  }

  return (
    <>
      <CampaignNavbar />
      <ScrollToTop />
      <main className="bg-ink text-pearl">
        {/* Section 1: Hero */}
        <HeroSection
        campaign={campaign}
        v2Content={v2Data.hero}
        spotsRemaining={spotsRemaining}
        onBookCallClick={handleBookCallClick}
        onEnrollClick={handleEnrollClick}
      />

      {/* Section 2: The Competitive Reality */}
      <CompetitiveRealitySection problems={v2Data.problems} />

      {/* Section 3: What You Get (Enhanced Benefits) */}
      <WhatYouGetSection benefits={v2Data.benefits} />

      {/* Section 4: Testimonials */}
      <TestimonialsSection testimonial={v2Data.testimonial} />

      {/* Section 5: Why Limit to 10 Companies */}
      <WhyLimitSection cohortReasons={v2Data.cohortReasons} />

      {/* Section 6: Investment & Savings */}
      <InvestmentSection
        campaign={campaign}
        spotsRemaining={spotsRemaining}
        isCampaignAvailable={isCampaignAvailable}
        comparisonTable={v2Data.comparisonTable}
        onCheckoutClick={handleCheckoutClick}
        onBookCallClick={handleBookCallClick}
        isCheckoutLoading={isCheckoutLoading}
        checkoutError={checkoutError}
      />

      {/* Section 8: FAQ */}
      <FAQSection faqs={v2Data.faqs} discoveryCallUrl={campaign.urls?.discoveryCall} />

      {/* Section 9: Final CTA */}
      <FinalCTASection
        campaign={campaign}
        spotsRemaining={spotsRemaining}
        totalSpots={totalSpots}
        onBookCallClick={handleBookCallClick}
        onEnrollClick={handleEnrollClick}
        finalCTA={v2Data.finalCTA}
      />

        {/* Footer */}
        <Footer />
      </main>
    </>
  )
}
