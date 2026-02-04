'use client'

import { ReactNode } from 'react'
import StickyCountdownBanner from './StickyCountdownBanner'
import type { CampaignConfig } from '@/types/campaign'
import { validateCampaignConfig } from '@/lib/validate-campaign'
import campaignData from '@/data/activeCampaign.json'

interface CampaignProviderProps {
  children: ReactNode
}

export default function CampaignProvider({ children }: CampaignProviderProps) {
  // Validate campaign configuration
  const validation = validateCampaignConfig(campaignData)

  console.log('🔧 CampaignProvider validation:', {
    valid: validation.valid,
    errors: validation.errors,
    active: campaignData.active
  })

  if (!validation.valid) {
    console.error('❌ Campaign configuration errors:', validation.errors)

    // Show warning in development
    if (process.env.NODE_ENV === 'development') {
      return (
        <>
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            backgroundColor: '#dc2626',
            color: 'white',
            padding: '1rem',
            zIndex: 9999,
            fontSize: '0.875rem'
          }}>
            <strong>Campaign Config Errors:</strong>
            <ul style={{ margin: '0.5rem 0 0 1.5rem', padding: 0 }}>
              {validation.errors.map((err, i) => (
                <li key={i}>{err.field}: {err.message}</li>
              ))}
            </ul>
          </div>
          {children}
        </>
      )
    }

    // Production: silently fail, just render children
    return <>{children}</>
  }

  const typedCampaignData = validation.data as CampaignConfig
  const campaign = (typedCampaignData as any).classOf2026
  const isCampaignActive = typedCampaignData.active === 'classOf2026' && campaign?.enabled

  return (
    <>
      {isCampaignActive && <StickyCountdownBanner />}
      {children}
    </>
  )
}
