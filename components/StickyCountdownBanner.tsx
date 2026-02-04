'use client'

import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import { useCampaignSpots } from '@/hooks/useCampaignSpots'
import type { CampaignConfig } from '@/types/campaign'
import campaignData from '@/data/activeCampaign.json'
import { isBannerDismissed, dismissBanner } from '@/lib/campaign-banner-config'

const typedCampaignData = campaignData as CampaignConfig

// Countdown timer component with seconds
function CountdownDisplay({ deadline, isHovering }: { deadline: string; isHovering: boolean }) {
  const [timeRemaining, setTimeRemaining] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    const calculateTime = () => {
      const now = new Date().getTime()
      const end = new Date(deadline).getTime()
      const distance = end - now

      if (distance < 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 }

      return {
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      }
    }

    setTimeRemaining(calculateTime())

    // Update every second
    const interval = setInterval(() => {
      setTimeRemaining(calculateTime())
    }, 1000)

    return () => clearInterval(interval)
  }, [deadline])

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '0.25rem'
    }}>
      <div style={{
        fontVariantNumeric: 'tabular-nums',
        fontWeight: '500',
        letterSpacing: '-0.01em',
        fontSize: '1rem',
        color: isHovering ? '#0A0A0A' : '#FF6B35',
        transition: 'color 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
      }}>
        {timeRemaining.days}D {timeRemaining.hours}H {timeRemaining.minutes}M {timeRemaining.seconds}S
      </div>
      <span style={{
        fontSize: '0.625rem',
        fontWeight: '300',
        color: isHovering ? 'rgba(255, 255, 255, 1)' : 'rgba(255, 255, 255, 0.5)',
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
        transition: 'color 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
      }}>
        Remaining
      </span>
    </div>
  )
}

export default function StickyCountdownBanner() {
  const [isVisible, setIsVisible] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [isHovering, setIsHovering] = useState(false)

  // Get real-time campaign spots
  const campaignSpots = useCampaignSpots('classOf2026')

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (!isMounted) return

    const campaign = (typedCampaignData as any).classOf2026
    console.log('🎯 Campaign Banner Debug:', {
      active: typedCampaignData.active,
      enabled: campaign?.enabled,
      deadline: campaign?.deadline
    })

    if (typedCampaignData.active !== 'classOf2026' || !campaign?.enabled) {
      console.warn('❌ Campaign not active or not enabled')
      return
    }

    const deadlineDate = new Date(campaign.deadline)
    const now = new Date()
    if (deadlineDate < now) {
      console.warn('❌ Campaign deadline has passed:', deadlineDate, 'Current:', now)
      return
    }

    // Check time-based dismissal (configured in campaign-banner-config.ts)
    const dismissalStatus = isBannerDismissed()
    console.log('🔍 Banner dismissal status:', dismissalStatus)

    if (dismissalStatus.isDismissed) {
      console.warn(`❌ Banner dismissed for ${dismissalStatus.hoursRemaining} more hours (until ${dismissalStatus.expiresAt?.toLocaleString()})`)
      return
    } else if (dismissalStatus.expiresAt) {
      console.log('✨ Dismissal period expired, showing banner again')
    }

    console.log('✅ Showing campaign banner')
    setIsVisible(true)
  }, [isMounted])

  useEffect(() => {
    if (!isMounted) return

    if (isVisible) {
      document.documentElement.classList.add('has-banner')
    } else {
      document.documentElement.classList.remove('has-banner')
    }

    return () => {
      document.documentElement.classList.remove('has-banner')
    }
  }, [isVisible, isMounted])

  const handleDismiss = (e: React.MouseEvent) => {
    e.stopPropagation()

    // Dismiss banner using centralized config
    const expiresAt = dismissBanner()
    console.log(`⏰ Banner dismissed until ${expiresAt.toLocaleString()}`)

    setIsVisible(false)

    const mainContent = document.querySelector('main')
    if (mainContent instanceof HTMLElement) {
      mainContent.focus()
    }
  }

  if (!isMounted || !isVisible) {
    return null
  }

  const campaign = (typedCampaignData as any).classOf2026

  // Use dynamic spots if available, fallback to static config
  const spotsRemaining = campaignSpots.loading ? campaign.spotsRemaining : campaignSpots.spotsRemaining

  // Hide banner if campaign is unavailable
  if (!campaignSpots.loading && !campaignSpots.available) {
    return null
  }

  // Parse banner text and replace {spots} placeholder
  const bannerText = campaign.banner?.text || 'Class of 2026: {spots} spots left – Lock in £999/mo before Mar 31'
  const bannerTextWithSpots = bannerText.replace('{spots}', spotsRemaining.toString())

  const handleBannerClick = () => {
    window.location.href = campaign.banner?.ctaHref || '/class-of-2026'
  }

  return (
    <div
      role="banner"
      aria-label="Class of 2026 campaign announcement - Click to learn more"
      onClick={handleBannerClick}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      style={{
        position: 'sticky',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 60,
        background: isHovering
          ? 'linear-gradient(135deg, #FF6B35 0%, #E55A2B 100%)'
          : 'linear-gradient(135deg, #0A0A0A 0%, #1A1A1A 100%)',
        borderBottom: '1px solid rgba(255, 107, 53, 0.3)',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.3)',
        textDecoration: 'none',
        display: 'block',
        cursor: 'pointer',
        transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
      }}
    >
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '0.75rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '2rem',
        position: 'relative'
      }}>
        {/* Centered Content Group */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '2rem'
        }}>
          {/* LEFT: Urgency Indicator with Spots - 1x width */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            minWidth: '120px'
          }}>
            {/* Pulsing dot */}
            <div style={{
              position: 'relative',
              width: '10px',
              height: '10px'
            }}>
              <div style={{
                position: 'absolute',
                width: '10px',
                height: '10px',
                backgroundColor: '#FF6B35',
                borderRadius: '50%'
              }} />
              <div style={{
                position: 'absolute',
                width: '10px',
                height: '10px',
                backgroundColor: '#FF6B35',
                borderRadius: '50%',
                animation: 'ping 1s cubic-bezier(0, 0, 0.2, 1) infinite',
                opacity: 0.75
              }} />
            </div>

            {/* Spots remaining */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.125rem'
            }}>
              <span style={{
                fontSize: '1rem',
                fontWeight: '500',
                color: isHovering ? '#0A0A0A' : '#FF6B35',
                letterSpacing: '-0.01em',
                transition: 'color 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
              }}>
                {spotsRemaining} SPOT{spotsRemaining !== 1 ? 'S' : ''}
              </span>
              <span style={{
                fontSize: '0.625rem',
                fontWeight: '300',
                color: isHovering ? 'rgba(255, 255, 255, 1)' : 'rgba(255, 255, 255, 0.5)',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                transition: 'color 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
              }}>
                Remaining
              </span>
            </div>
          </div>

          {/* Vertical Divider */}
          <div style={{
            width: '1px',
            height: '2.5rem',
            backgroundColor: isHovering ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 107, 53, 0.3)',
            transition: 'background-color 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
          }} />

          {/* CENTER: Main Message - 2x width */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.125rem',
            textAlign: 'center',
            minWidth: '240px'
          }}>
            <p style={{
              fontSize: '0.875rem',
              fontWeight: '300',
              color: isHovering ? 'rgba(255, 255, 255, 1)' : 'rgba(255, 255, 255, 0.9)',
              letterSpacing: '-0.01em',
              lineHeight: '1.2',
              transition: 'color 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
              margin: '0'
            }}>
              {bannerTextWithSpots}
            </p>
          </div>

          {/* Vertical Divider */}
          <div style={{
            width: '1px',
            height: '2.5rem',
            backgroundColor: isHovering ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 107, 53, 0.3)',
            transition: 'background-color 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
          }} />

          {/* RIGHT: Countdown Timer - 1x width */}
          <div style={{
            minWidth: '120px',
            display: 'flex',
            justifyContent: 'center'
          }}>
            <CountdownDisplay deadline={campaign.deadline} isHovering={isHovering} />
          </div>
        </div>

        {/* Close Button - Absolute positioned on far right */}
        <button
          onClick={handleDismiss}
          aria-label="Dismiss campaign banner"
          style={{
            position: 'absolute',
            right: '1.5rem',
            background: 'none',
            border: 'none',
            color: 'white',
            cursor: 'pointer',
            padding: '0.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: 0.3,
            transition: 'opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
          onMouseEnter={(e) => {
            (e.target as HTMLButtonElement).style.opacity = '1'
          }}
          onMouseLeave={(e) => {
            (e.target as HTMLButtonElement).style.opacity = '0.3'
          }}
        >
          <X style={{ width: '18px', height: '18px' }} strokeWidth={1.5} />
        </button>
      </div>

      {/* Add ping animation keyframes */}
      <style jsx>{`
        @keyframes ping {
          75%, 100% {
            transform: scale(2);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  )
}
