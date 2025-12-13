'use client'

import { Heart } from 'lucide-react'
import type { CampaignConfig } from '@/types/campaign'
import campaignData from '@/data/activeCampaign.json'

const typedCampaignData = campaignData as CampaignConfig

export default function DesignForGoodBanner() {
  // Check if Design for Good campaign is active and should show below pricing
  const isActive = typedCampaignData.active === 'designForGood' &&
                   typedCampaignData.designForGood.enabled &&
                   typedCampaignData.designForGood.showBelowPricing

  if (!isActive) {
    return null
  }

  const campaign = typedCampaignData.designForGood

  return (
    <div style={{
      width: '100%',
      backgroundColor: campaign.backgroundColor,
      padding: '3rem 2rem',
      borderTop: `4px solid ${campaign.accentColor}`,
      borderBottom: `4px solid ${campaign.accentColor}`
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1.5rem',
        textAlign: 'center'
      }}>
        {/* Icon and Title */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem'
        }}>
          <Heart
            style={{
              width: '32px',
              height: '32px',
              color: campaign.accentColor
            }}
            strokeWidth={1.5}
            fill={campaign.accentColor}
          />
          <h3 style={{
            fontSize: '2rem',
            fontWeight: '300',
            letterSpacing: '-0.025em',
            color: '#2c2c2c',
            margin: 0
          }}>
            {campaign.name}
          </h3>
        </div>

        {/* Tagline */}
        <p style={{
          fontSize: '1.25rem',
          fontWeight: '300',
          lineHeight: '1.6',
          color: '#2c2c2c',
          maxWidth: '600px',
          margin: 0
        }}>
          {campaign.tagline}
        </p>

        {/* CTA Button */}
        <a
          href={campaign.ctaHref}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '1rem 2rem',
            backgroundColor: campaign.accentColor,
            color: 'white',
            fontSize: '0.875rem',
            fontWeight: '500',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            textDecoration: 'none',
            transition: 'all 0.3s ease',
            border: 'none',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => {
            const el = e.target as HTMLAnchorElement
            Object.assign(el.style, {
              transform: 'translateY(-2px)',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
            })
          }}
          onMouseLeave={(e) => {
            const el = e.target as HTMLAnchorElement
            Object.assign(el.style, {
              transform: 'translateY(0)',
              boxShadow: 'none'
            })
          }}
        >
          {campaign.ctaText}
        </a>
      </div>
    </div>
  )
}
