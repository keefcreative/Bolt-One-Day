# CRITICAL FIXES - Class of 2025 Campaign Implementation

**Document Version**: 1.0
**Last Updated**: 2025-12-08
**Related Document**: [Class0f2025-AMENDED.md](./Class0f2025-AMENDED.md)

---

## Table of Contents

1. [Overview](#overview)
2. [Critical Blocker Issues (Must Fix Before Implementation)](#critical-blocker-issues-must-fix-before-implementation)
3. [High-Priority Issues (Fix During Implementation)](#high-priority-issues-fix-during-implementation)
4. [TypeScript Type Definitions](#typescript-type-definitions)
5. [Pre-Implementation Checklist](#pre-implementation-checklist)
6. [Quick Reference](#quick-reference)

---

## Overview

This document addresses **67 identified issues** from the deep-dive review of the Class of 2025 campaign implementation plan. It focuses on providing actionable solutions with complete code examples for the **6 CRITICAL blockers** and **9 HIGH-priority issues** that must be resolved before or during implementation.

### Issue Severity Breakdown

- **CRITICAL** (6): Blockers that will break functionality if not addressed
- **HIGH** (9): Significant issues that impact UX or maintainability
- **MEDIUM** (31): Improvements for robustness and quality
- **LOW** (21): Nice-to-haves and optimizations

**This document focuses on CRITICAL and HIGH issues only.**

---

## Critical Blocker Issues (Must Fix Before Implementation)

### CRITICAL #1: Z-Index and Layout Conflict

**Issue**: Banner and navigation both positioned at `top-0` with different z-indexes (banner z-60, nav z-50). Navigation will be invisible behind the banner.

**Impact**: Navigation completely hidden when campaign banner is active.

**Root Cause**:
```css
/* Current globals.css */
.nav-sticky {
  @apply fixed top-0 left-0 right-0 z-50; /* ❌ Conflict with banner */
}
```

**Solution Strategy**: Use CSS custom property to dynamically offset navigation based on banner presence.

#### Implementation

**Step 1**: Update `/app/globals.css`

```css
/* Banner configuration */
:root {
  --banner-height: 0px; /* Default: no banner */
}

:root.has-banner {
  --banner-height: 50px; /* Height when banner present */
}

/* Updated navigation positioning */
.nav-sticky {
  @apply fixed left-0 right-0 z-50 border-b border-mist/50 transition-all duration-base ease-premium;
  top: var(--banner-height, 0px); /* ✅ Dynamic offset */
}
```

**Step 2**: Update `StickyCountdownBanner` component

```typescript
'use client'

import { useEffect, useState } from 'react'
import campaignData from '@/data/activeCampaign.json'

export default function StickyCountdownBanner() {
  const [isVisible, setIsVisible] = useState(true)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)

    // Check if banner was dismissed
    const dismissedUntil = localStorage.getItem('campaignBannerDismissed')
    if (dismissedUntil) {
      const dismissTime = parseInt(dismissedUntil, 10)
      const now = Date.now()
      const twentyFourHours = 24 * 60 * 60 * 1000

      if (now - dismissTime < twentyFourHours) {
        setIsVisible(false)
      }
    }
  }, [])

  useEffect(() => {
    // ✅ Update CSS variable when banner visibility changes
    if (isMounted) {
      if (isVisible) {
        document.documentElement.classList.add('has-banner')
      } else {
        document.documentElement.classList.remove('has-banner')
      }
    }

    // Cleanup on unmount
    return () => {
      document.documentElement.classList.remove('has-banner')
    }
  }, [isVisible, isMounted])

  const handleDismiss = () => {
    localStorage.setItem('campaignBannerDismissed', Date.now().toString())
    setIsVisible(false)
  }

  if (!isMounted || !isVisible) return null

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      height: '50px', // ⚠️ Must match --banner-height in CSS
      zIndex: 60,
      backgroundColor: '#ff6b35', // flame
      // ... rest of styles
    }}>
      {/* Banner content */}
    </div>
  )
}
```

**Step 3**: Update `scrollToElement` utility

```typescript
// /lib/scroll-utils.ts (NEW FILE)

/**
 * Calculates total fixed header height (banner + nav)
 */
export function getHeaderHeight(): number {
  const hasBanner = document.documentElement.classList.contains('has-banner')
  const bannerHeight = hasBanner ? 50 : 0
  const navHeight = 80 // Standard nav height
  return bannerHeight + navHeight
}

/**
 * Smooth scroll with dynamic offset calculation
 */
export function scrollToElement(selector: string) {
  const element = document.querySelector(selector)
  if (!element) return

  const headerHeight = getHeaderHeight()
  const elementPosition = element.getBoundingClientRect().top + window.pageYOffset
  const offsetPosition = elementPosition - headerHeight

  window.scrollTo({
    top: offsetPosition,
    behavior: 'smooth'
  })
}
```

**Step 4**: Update all components using `scrollToElement`

```typescript
// Example: BrandedPricingSection.tsx
import { scrollToElement } from '@/lib/scroll-utils'

// Remove hardcoded scrollToElement function
// const scrollToElement = (selector: string) => { ... } // ❌ DELETE

// Use imported version
const handleGetStarted = async (plan) => {
  if ('isCustom' in plan && plan.isCustom) {
    scrollToElement('#contact') // ✅ Uses dynamic offset
    return
  }
  // ... rest of function
}
```

---

### CRITICAL #2: Mixing Tailwind Classes with Inline Styles

**Issue**: Plan shows mixing Tailwind utility classes with inline styles in `BrandedPricingSection`. Existing component uses **inline styles exclusively**—mixing approaches causes style precedence conflicts and visual inconsistencies.

**Impact**: Visual bugs, unpredictable styling behavior, maintenance confusion.

**Root Cause**:
```typescript
// ❌ WRONG (from plan)
<span className="text-5xl font-light" style={{ color: textColor }}>
  {displayPrice}
</span>
```

**Solution**: Convert ALL Tailwind classes to inline styles to match existing component pattern.

#### Conversion Reference Table

| Tailwind Class | Inline Style Equivalent |
|----------------|------------------------|
| `text-5xl` | `fontSize: '3rem'` |
| `text-3xl` | `fontSize: '1.875rem'` |
| `text-2xl` | `fontSize: '1.5rem'` |
| `text-xl` | `fontSize: '1.25rem'` |
| `text-lg` | `fontSize: '1.125rem'` |
| `text-sm` | `fontSize: '0.875rem'` |
| `font-light` | `fontWeight: '300'` |
| `font-medium` | `fontWeight: '500'` |
| `font-semibold` | `fontWeight: '600'` |
| `tracking-tight` | `letterSpacing: '-0.025em'` |
| `tracking-widest` | `letterSpacing: '0.1em'` |
| `leading-relaxed` | `lineHeight: '1.625'` |
| `mb-2` | `marginBottom: '0.5rem'` |
| `mb-4` | `marginBottom: '1rem'` |
| `mb-6` | `marginBottom: '1.5rem'` |
| `mb-8` | `marginBottom: '2rem'` |
| `gap-2` | `gap: '0.5rem'` |
| `gap-3` | `gap: '0.75rem'` |
| `uppercase` | `textTransform: 'uppercase'` |

#### Complete Corrected Code Example

```typescript
// BrandedPricingSection.tsx - Campaign-aware Business tier rendering

{plans.map((plan, index) => {
  const isBusinessPlan = plan.name === "Business"
  const isCampaignActive = campaignData.active === 'classOf2025' && campaignData.classOf2025.enabled
  const isCampaignBusiness = isBusinessPlan && isCampaignActive

  // Determine dynamic styling
  const cardBg = isCampaignBusiness ? '#1A1A1A' : 'white' // smoke : white
  const textColor = isCampaignBusiness ? 'white' : '#2c2c2c'
  const secondaryTextColor = isCampaignBusiness ? '#E5E5E5' : '#6b7280'
  const cardBorder = isCampaignBusiness
    ? '2px solid #ff6b35'
    : (plan.popular ? '2px solid #ff6b35' : '1px solid rgba(107, 114, 128, 0.2)')

  // Determine pricing
  const displayPrice = isCampaignBusiness ? campaignData.classOf2025.pricing.amount : plan.price
  const originalPrice = isCampaignBusiness ? plan.price : null

  // Badge content
  const badgeContent = isCampaignBusiness
    ? `CLASS OF 2025 - ${campaignData.classOf2025.spotsRemaining} SPOTS LEFT`
    : (plan.popular ? 'Saves Most Time' : null)

  return (
    <div key={index} style={{
      ...cardStyle(plan.popular),
      backgroundColor: cardBg,
      border: cardBorder,
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Badge */}
      {badgeContent && (
        <div style={{
          position: 'absolute',
          top: '-1rem',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: '#ff6b35',
          color: 'white',
          padding: '0.5rem 1.5rem',
          fontSize: '0.875rem', // ✅ Inline style (was text-sm)
          fontWeight: '500', // ✅ Inline style (was font-medium)
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          whiteSpace: 'nowrap'
        }}>
          <TrendingUp style={{ width: '16px', height: '16px' }} strokeWidth={1.2} />
          {badgeContent}
        </div>
      )}

      {/* Pricing Header */}
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h4 style={{
          fontSize: '1.5rem', // ✅ Inline style (was text-2xl)
          fontWeight: '300', // ✅ Inline style (was font-light)
          marginBottom: '0.5rem',
          letterSpacing: '-0.025em', // ✅ Inline style (was tracking-tight)
          color: textColor
        }}>
          {plan.name}
        </h4>

        <p style={{
          fontSize: '1.125rem', // ✅ Inline style (was text-lg)
          fontWeight: '500', // ✅ Inline style (was font-medium)
          marginBottom: '1.5rem',
          color: '#ff6b35'
        }}>
          {plan.tagline}
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
              fontSize: '3rem', // ✅ Inline style (was text-5xl)
              fontWeight: '300', // ✅ Inline style (was font-light)
              letterSpacing: '-0.025em', // ✅ Inline style (was tracking-tight)
              color: textColor
            }}>
              {displayPrice}
            </span>
            <span style={{
              marginLeft: '0.5rem',
              fontWeight: '300',
              color: secondaryTextColor
            }}>
              {plan.period}
            </span>
          </div>

          {isCampaignBusiness && (
            <span style={{
              fontSize: '0.75rem',
              fontWeight: '600',
              color: '#ff6b35',
              textTransform: 'uppercase', // ✅ Inline style (was uppercase)
              letterSpacing: '0.05em',
              marginTop: '0.5rem'
            }}>
              Save {campaignData.classOf2025.pricing.savings}
            </span>
          )}
        </div>

        <p style={{
          fontSize: '0.875rem', // ✅ Inline style (was text-sm)
          fontWeight: '300', // ✅ Inline style (was font-light)
          padding: '0.5rem 1rem',
          display: 'inline-block',
          border: '1px solid rgba(107, 114, 128, 0.2)',
          color: secondaryTextColor,
          backgroundColor: isCampaignBusiness ? 'rgba(255, 255, 255, 0.05)' : '#faf9f7'
        }}>
          {plan.bestFor}
        </p>
      </div>

      {/* Problems Solved */}
      <div style={{ marginBottom: '2rem' }}>
        <h5 style={{
          fontWeight: '500', // ✅ Inline style (was font-medium)
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
          {plan.problemsSolved.slice(0, 3).map((problem, problemIndex) => (
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
                fontSize: '0.875rem', // ✅ Inline style (was text-sm)
                fontWeight: '300', // ✅ Inline style (was font-light)
                lineHeight: '1.625', // ✅ Inline style (was leading-relaxed)
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

      {/* Features List */}
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
          {plan.features.map((feature, featureIndex) => (
            <li key={featureIndex} style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.75rem'
            }}>
              <div style={{
                width: '6px',
                height: '6px',
                backgroundColor: 'rgba(107, 114, 128, 0.4)',
                marginTop: '8px',
                flexShrink: 0
              }}></div>
              <span style={{
                fontSize: '0.875rem', // ✅ Inline style (was text-sm)
                fontWeight: '300', // ✅ Inline style (was font-light)
                color: secondaryTextColor
              }}>
                {feature}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* CTA Button */}
      <button
        onClick={() => handleGetStarted(plan)}
        style={{
          width: '100%',
          padding: '1rem 1.5rem',
          fontWeight: '500', // ✅ Inline style (was font-medium)
          fontSize: '0.875rem', // ✅ Inline style (was text-sm)
          letterSpacing: '0.1em', // ✅ Inline style (was tracking-widest)
          textTransform: 'uppercase', // ✅ Inline style (was uppercase)
          transition: 'all 0.3s ease',
          backgroundColor: plan.popular || isCampaignBusiness ? '#ff6b35' : '#2c2c2c',
          color: 'white',
          border: 'none',
          cursor: 'pointer'
        }}
        onMouseEnter={(e) => {
          (e.target as HTMLButtonElement).style.backgroundColor = '#e55a2b'
        }}
        onMouseLeave={(e) => {
          const defaultBg = plan.popular || isCampaignBusiness ? '#ff6b35' : '#2c2c2c'
          (e.target as HTMLButtonElement).style.backgroundColor = defaultBg
        }}
      >
        {plan.ctaText}
      </button>
    </div>
  )
})}
```

**Key Takeaways**:
- ✅ All Tailwind classes converted to inline styles
- ✅ Consistent with existing component pattern
- ✅ Campaign-aware conditional styling
- ✅ Maintains visual parity with current design
- ✅ No style precedence conflicts

---

### CRITICAL #3: SSR Hydration Mismatch with localStorage

**Issue**: Direct `localStorage` access in `useEffect` without proper mounting guard causes server/client mismatch. Server renders with `isVisible=false`, client reads `localStorage` and changes to `isVisible=true`, React throws hydration error.

**Impact**: Console errors, potential visual flashing, degraded UX.

**Root Cause**:
```typescript
// ❌ WRONG (from plan)
const [isVisible, setIsVisible] = useState(true)

useEffect(() => {
  const dismissed = localStorage.getItem('campaignBannerDismissed')
  if (dismissed) {
    // Server rendered true, client may set false → MISMATCH
    setIsVisible(false)
  }
}, [])
```

**Solution**: Use two-phase mounting pattern with explicit `isMounted` guard.

#### Complete Corrected Implementation

```typescript
'use client'

import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import CountdownTimer from './CountdownTimer'
import campaignData from '@/data/activeCampaign.json'

export default function StickyCountdownBanner() {
  // Phase 1: Always start with false to match server render
  const [isVisible, setIsVisible] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  // Phase 2: Set mounted flag FIRST
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Phase 3: Only check localStorage AFTER mounted
  useEffect(() => {
    if (!isMounted) return

    // Check campaign status
    if (campaignData.active !== 'classOf2025' || !campaignData.classOf2025.enabled) {
      return // Campaign not active, stay hidden
    }

    // Check if banner was dismissed
    const dismissedUntil = localStorage.getItem('campaignBannerDismissed')

    if (dismissedUntil) {
      const dismissTime = parseInt(dismissedUntil, 10)
      const now = Date.now()
      const twentyFourHours = 24 * 60 * 60 * 1000

      if (now - dismissTime < twentyFourHours) {
        return // Still within 24-hour dismissal window
      } else {
        // 24 hours passed, clear old dismissal
        localStorage.removeItem('campaignBannerDismissed')
      }
    }

    // ✅ All checks passed, show banner
    setIsVisible(true)
  }, [isMounted])

  // Update CSS variable when visibility changes
  useEffect(() => {
    if (!isMounted) return

    if (isVisible) {
      document.documentElement.classList.add('has-banner')
    } else {
      document.documentElement.classList.remove('has-banner')
    }

    // Cleanup on unmount
    return () => {
      document.documentElement.classList.remove('has-banner')
    }
  }, [isVisible, isMounted])

  const handleDismiss = () => {
    localStorage.setItem('campaignBannerDismissed', Date.now().toString())
    setIsVisible(false)
  }

  // ✅ Don't render until mounted AND visible
  if (!isMounted || !isVisible) {
    return null // Server renders this, no hydration mismatch
  }

  const campaign = campaignData.classOf2025

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      height: '50px',
      zIndex: 60,
      backgroundColor: '#ff6b35',
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '1rem',
      padding: '0 1rem',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
    }}>
      <div style={{
        maxWidth: '1200px',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem'
      }}>
        {/* Banner content */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          flex: 1
        }}>
          <span style={{
            fontSize: '0.875rem',
            fontWeight: '500',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>
            {campaign.banner.text.replace('{spots}', campaign.spotsRemaining.toString())}
          </span>

          <CountdownTimer
            deadline={campaign.deadline}
            variant="inline"
          />
        </div>

        {/* CTA Button */}
        <a
          href={campaign.banner.ctaHref}
          style={{
            padding: '0.5rem 1.5rem',
            backgroundColor: 'white',
            color: '#ff6b35',
            fontSize: '0.875rem',
            fontWeight: '500',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            textDecoration: 'none',
            whiteSpace: 'nowrap',
            transition: 'all 0.2s ease',
            border: 'none',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => {
            (e.target as HTMLAnchorElement).style.backgroundColor = '#f8f9fa'
          }}
          onMouseLeave={(e) => {
            (e.target as HTMLAnchorElement).style.backgroundColor = 'white'
          }}
        >
          {campaign.banner.cta}
        </a>

        {/* Dismiss Button */}
        <button
          onClick={handleDismiss}
          style={{
            background: 'none',
            border: 'none',
            color: 'white',
            cursor: 'pointer',
            padding: '0.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'opacity 0.2s ease',
            opacity: 0.8
          }}
          onMouseEnter={(e) => {
            (e.target as HTMLButtonElement).style.opacity = '1'
          }}
          onMouseLeave={(e) => {
            (e.target as HTMLButtonElement).style.opacity = '0.8'
          }}
          aria-label="Dismiss banner"
        >
          <X style={{ width: '18px', height: '18px' }} strokeWidth={2} />
        </button>
      </div>
    </div>
  )
}
```

**Why This Works**:
1. ✅ Server renders `null` (isMounted=false, isVisible=false)
2. ✅ Client first render also returns `null` (isMounted still false)
3. ✅ After mount, `isMounted` becomes `true`
4. ✅ Second effect runs, checks localStorage, sets `isVisible` if appropriate
5. ✅ No server/client mismatch because both start with same state
6. ✅ Banner appears smoothly on client after mount checks complete

---

### CRITICAL #4: Server Component JSON Import Strategy

**Issue**: Plan imports `activeCampaign.json` in `app/layout.tsx` (Server Component). Static imports in Server Components require rebuild for campaign changes, breaking hot-reload and requiring deployment for config updates.

**Impact**: Cannot toggle campaigns without code deployment, defeats purpose of simple JSON toggle system.

**Root Cause**:
```typescript
// ❌ WRONG (from plan)
// app/layout.tsx (Server Component)
import campaignData from '@/data/activeCampaign.json'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {campaignData.active && <StickyCountdownBanner />} {/* Server import */}
        {children}
      </body>
    </html>
  )
}
```

**Solution Options**:

#### Option A: Client Component Wrapper (RECOMMENDED)

Best for development speed and simple toggling. Campaign state managed client-side.

```typescript
// components/CampaignProvider.tsx (NEW FILE)
'use client'

import { ReactNode } from 'react'
import StickyCountdownBanner from './StickyCountdownBanner'
import campaignData from '@/data/activeCampaign.json'

interface CampaignProviderProps {
  children: ReactNode
}

export default function CampaignProvider({ children }: CampaignProviderProps) {
  const isCampaignActive = campaignData.active === 'classOf2025' && campaignData.classOf2025.enabled

  return (
    <>
      {isCampaignActive && <StickyCountdownBanner />}
      {children}
    </>
  )
}
```

```typescript
// app/layout.tsx (Server Component)
import CampaignProvider from '@/components/CampaignProvider'

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <CampaignProvider>
          {children}
        </CampaignProvider>
      </body>
    </html>
  )
}
```

**Pros**:
- ✅ Simple implementation
- ✅ Hot-reload works with JSON changes
- ✅ No API routes needed
- ✅ Works offline

**Cons**:
- ⚠️ Requires rebuild to change campaign state (but faster than full deployment)

#### Option B: Environment Variables

Best for production deployment control. Campaign state configured per environment.

```bash
# .env.local
NEXT_PUBLIC_ACTIVE_CAMPAIGN=classOf2025
NEXT_PUBLIC_CAMPAIGN_ENABLED=true
NEXT_PUBLIC_CAMPAIGN_SPOTS=6
NEXT_PUBLIC_CAMPAIGN_DEADLINE=2025-12-31T23:59:59Z
```

```typescript
// lib/campaign-config.ts (NEW FILE)
export function getActiveCampaign() {
  return {
    active: process.env.NEXT_PUBLIC_ACTIVE_CAMPAIGN || null,
    enabled: process.env.NEXT_PUBLIC_CAMPAIGN_ENABLED === 'true',
    spotsRemaining: parseInt(process.env.NEXT_PUBLIC_CAMPAIGN_SPOTS || '0', 10),
    deadline: process.env.NEXT_PUBLIC_CAMPAIGN_DEADLINE || null
  }
}
```

```typescript
// components/CampaignProvider.tsx
'use client'

import { getActiveCampaign } from '@/lib/campaign-config'

export default function CampaignProvider({ children }) {
  const campaign = getActiveCampaign()
  const isActive = campaign.active === 'classOf2025' && campaign.enabled

  return (
    <>
      {isActive && <StickyCountdownBanner />}
      {children}
    </>
  )
}
```

**Pros**:
- ✅ No code changes to toggle campaign
- ✅ Environment-specific configuration
- ✅ Works with CI/CD pipelines

**Cons**:
- ⚠️ Requires rebuild for changes (but can use Vercel env vars for instant updates)
- ⚠️ More complex configuration management

#### Option C: API Route + Client Fetch (Most Flexible)

Best for runtime toggling without rebuilds. Campaign state stored externally (DB, CMS, etc.).

```typescript
// app/api/campaign/route.ts (NEW FILE)
import { NextResponse } from 'next/server'
import campaignData from '@/data/activeCampaign.json'

export async function GET() {
  // In future, fetch from database/CMS instead
  return NextResponse.json(campaignData)
}
```

```typescript
// components/CampaignProvider.tsx
'use client'

import { useEffect, useState, ReactNode } from 'react'
import StickyCountdownBanner from './StickyCountdownBanner'

interface CampaignConfig {
  active: string | null
  classOf2025: {
    enabled: boolean
    spotsRemaining: number
    deadline: string
  }
}

export default function CampaignProvider({ children }: { children: ReactNode }) {
  const [campaign, setCampaign] = useState<CampaignConfig | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetch('/api/campaign')
      .then(res => res.json())
      .then(data => {
        setCampaign(data)
        setIsLoading(false)
      })
      .catch(() => setIsLoading(false))
  }, [])

  if (isLoading) return <>{children}</> // Render children while loading

  const isActive = campaign?.active === 'classOf2025' && campaign?.classOf2025?.enabled

  return (
    <>
      {isActive && <StickyCountdownBanner />}
      {children}
    </>
  )
}
```

**Pros**:
- ✅ No rebuilds needed for campaign changes
- ✅ Can integrate with external systems (Stripe, CMS, etc.)
- ✅ Runtime toggling

**Cons**:
- ⚠️ Additional API request
- ⚠️ More complex error handling
- ⚠️ Slight delay before banner appears

#### Recommendation

**Use Option A (Client Component Wrapper)** for initial implementation:
- Simplest to implement
- Matches current architecture (JSON-driven content)
- Easy to migrate to Option C later if needed
- Hot-reload works during development

**Upgrade Path**: Option A → Option C when you need:
- Runtime campaign toggling
- Integration with Stripe for spot tracking
- Multi-environment campaign management

---

### CRITICAL #5: Missing TypeScript Type Definitions

**Issue**: No TypeScript interfaces defined for campaign configuration data. Causes type errors and prevents compile-time validation.

**Impact**: TypeScript compilation errors, no IntelliSense, runtime type bugs.

**Solution**: Create comprehensive type definitions for all campaign-related data structures.

#### Complete Type Definitions

```typescript
// types/campaign.ts (NEW FILE)

/**
 * Available campaign types
 */
export type CampaignType = 'classOf2025' | 'designForGood' | null

/**
 * Pricing information for a campaign
 */
export interface CampaignPricing {
  amount: string // e.g., "£999"
  period: string // e.g., "/month"
  originalPrice: string // e.g., "£1,449"
  savings: string // e.g., "£450"
  stripePriceId: string
}

/**
 * Banner configuration for sticky countdown
 */
export interface CampaignBanner {
  text: string // Template with {spots} placeholder
  cta: string // Button text
  ctaHref: string // Button link
}

/**
 * Class of 2025 campaign configuration
 */
export interface ClassOf2025Campaign {
  enabled: boolean
  name: string
  spotsRemaining: number
  totalSpots: number
  deadline: string // ISO 8601 date string
  pricing: CampaignPricing
  banner: CampaignBanner
}

/**
 * Design for Good campaign configuration
 */
export interface DesignForGoodCampaign {
  enabled: boolean
  name: string
  tagline: string
  showBelowPricing: boolean
  ctaText: string
  ctaHref: string
  backgroundColor: string
  accentColor: string
}

/**
 * Root campaign configuration object
 */
export interface CampaignConfig {
  active: CampaignType
  classOf2025: ClassOf2025Campaign
  designForGood: DesignForGoodCampaign
}

/**
 * Type guard to check if campaign is active
 */
export function isCampaignActive(
  config: CampaignConfig,
  campaignType: Exclude<CampaignType, null>
): boolean {
  return config.active === campaignType && config[campaignType].enabled
}

/**
 * Countdown timer time units
 */
export interface TimeRemaining {
  days: number
  hours: number
  minutes: number
  seconds: number
}

/**
 * Countdown timer variant props
 */
export type CountdownVariant = 'inline' | 'full'

export interface CountdownTimerProps {
  deadline: string
  variant?: CountdownVariant
}
```

#### Usage Examples

```typescript
// components/StickyCountdownBanner.tsx
import type { CampaignConfig } from '@/types/campaign'
import { isCampaignActive } from '@/types/campaign'
import campaignData from '@/data/activeCampaign.json'

const typedCampaignData = campaignData as CampaignConfig

export default function StickyCountdownBanner() {
  // ✅ Full type safety and IntelliSense
  const isActive = isCampaignActive(typedCampaignData, 'classOf2025')

  if (!isActive) return null

  const campaign = typedCampaignData.classOf2025 // ✅ Type: ClassOf2025Campaign

  return (
    <div>
      <span>{campaign.banner.text.replace('{spots}', campaign.spotsRemaining.toString())}</span>
      <CountdownTimer deadline={campaign.deadline} variant="inline" />
      {/* ✅ All properties type-checked */}
    </div>
  )
}
```

```typescript
// components/BrandedPricingSection.tsx
import type { CampaignConfig } from '@/types/campaign'
import { isCampaignActive } from '@/types/campaign'
import campaignData from '@/data/activeCampaign.json'

const typedCampaignData = campaignData as CampaignConfig

export default function BrandedPricingSection() {
  const isCampaignActive = isCampaignActive(typedCampaignData, 'classOf2025')

  return (
    <section>
      {plans.map((plan) => {
        const isBusinessPlan = plan.name === "Business"
        const isCampaignBusiness = isBusinessPlan && isCampaignActive

        // ✅ Type-safe access to campaign pricing
        const displayPrice = isCampaignBusiness
          ? typedCampaignData.classOf2025.pricing.amount
          : plan.price

        // ... rest of component
      })}
    </section>
  )
}
```

```typescript
// components/CountdownTimer.tsx
import type { CountdownTimerProps, TimeRemaining } from '@/types/campaign'

export default function CountdownTimer({ deadline, variant = 'inline' }: CountdownTimerProps) {
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  })

  // ✅ Full type safety for all time units
  // ... rest of component
}
```

#### JSON Schema Validation (Optional)

Add runtime validation for campaign JSON file:

```json
// data/activeCampaign.schema.json (NEW FILE)
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "required": ["active", "classOf2025", "designForGood"],
  "properties": {
    "active": {
      "type": ["string", "null"],
      "enum": ["classOf2025", "designForGood", null]
    },
    "classOf2025": {
      "type": "object",
      "required": ["enabled", "name", "spotsRemaining", "totalSpots", "deadline", "pricing", "banner"],
      "properties": {
        "enabled": { "type": "boolean" },
        "name": { "type": "string" },
        "spotsRemaining": { "type": "number", "minimum": 0 },
        "totalSpots": { "type": "number", "minimum": 1 },
        "deadline": { "type": "string", "format": "date-time" },
        "pricing": {
          "type": "object",
          "required": ["amount", "period", "originalPrice", "savings", "stripePriceId"],
          "properties": {
            "amount": { "type": "string" },
            "period": { "type": "string" },
            "originalPrice": { "type": "string" },
            "savings": { "type": "string" },
            "stripePriceId": { "type": "string" }
          }
        },
        "banner": {
          "type": "object",
          "required": ["text", "cta", "ctaHref"],
          "properties": {
            "text": { "type": "string" },
            "cta": { "type": "string" },
            "ctaHref": { "type": "string" }
          }
        }
      }
    }
  }
}
```

---

### CRITICAL #6: scrollToElement Hardcoded Offset

**Issue**: Current `scrollToElement` utility uses hardcoded offset that doesn't account for campaign banner height. Will scroll to wrong positions when banner is active.

**Impact**: Broken anchor navigation, poor UX when clicking "Get Started" or "Contact Us" links.

**Current Code**:
```typescript
// components/BrandedPricingSection.tsx (line 9-14)
const scrollToElement = (selector: string) => {
  const element = document.querySelector(selector)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
  }
}
```

**Problem**: `scrollIntoView` doesn't account for fixed headers, element gets hidden behind nav/banner.

**Solution**: Create centralized scroll utility with dynamic offset calculation.

#### Implementation

```typescript
// lib/scroll-utils.ts (NEW FILE)

/**
 * Calculates total fixed header height (banner + navigation)
 * Accounts for campaign banner presence dynamically
 */
export function getHeaderHeight(): number {
  // Check for campaign banner
  const hasBanner = document.documentElement.classList.contains('has-banner')
  const bannerHeight = hasBanner ? 50 : 0

  // Navigation height (check actual element if possible)
  const navElement = document.querySelector('nav')
  const navHeight = navElement?.offsetHeight || 80 // Fallback to 80px

  return bannerHeight + navHeight
}

/**
 * Smooth scroll to element with dynamic offset
 * @param selector - CSS selector for target element
 * @param additionalOffset - Optional extra offset (default: 20px for breathing room)
 */
export function scrollToElement(selector: string, additionalOffset: number = 20): void {
  const element = document.querySelector(selector)
  if (!element) {
    console.warn(`scrollToElement: Element not found for selector "${selector}"`)
    return
  }

  const headerHeight = getHeaderHeight()
  const elementPosition = element.getBoundingClientRect().top + window.pageYOffset
  const offsetPosition = elementPosition - headerHeight - additionalOffset

  window.scrollTo({
    top: Math.max(0, offsetPosition), // Prevent negative scroll
    behavior: 'smooth'
  })
}

/**
 * Scroll to top of page (useful for page transitions)
 */
export function scrollToTop(): void {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

/**
 * Check if element is in viewport
 * @param element - DOM element to check
 * @param offset - Optional offset from top (default: header height)
 */
export function isInViewport(element: Element, offset?: number): boolean {
  const rect = element.getBoundingClientRect()
  const headerHeight = offset ?? getHeaderHeight()

  return (
    rect.top >= headerHeight &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  )
}
```

#### Update All Components Using scrollToElement

**1. BrandedPricingSection.tsx**

```typescript
// components/BrandedPricingSection.tsx
import { scrollToElement } from '@/lib/scroll-utils' // ✅ Import utility

// DELETE hardcoded function
// const scrollToElement = (selector: string) => { ... } // ❌ REMOVE

export default function BrandedPricingSection() {
  const handleGetStarted = async (plan: typeof plans[0] | typeof enterprisePlus) => {
    if ('isCustom' in plan && plan.isCustom) {
      scrollToElement('#contact') // ✅ Uses dynamic offset
      return
    }

    try {
      const response = await fetch('/api/stripe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId: plan.stripePriceId }),
      })

      const { url } = await response.json()

      if (url) {
        window.location.href = url
      }
    } catch (error) {
      scrollToElement('#contact') // ✅ Fallback with correct offset
    }
  }

  // ... rest of component
}
```

**2. Navigation.tsx (if using scroll spy)**

```typescript
// components/Navigation.tsx
import { scrollToElement, isInViewport } from '@/lib/scroll-utils'

export default function Navigation() {
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('#')) {
      e.preventDefault()
      scrollToElement(href) // ✅ Correct offset with banner
    }
  }

  return (
    <nav>
      <a href="#services" onClick={(e) => handleNavClick(e, '#services')}>
        Services
      </a>
      {/* ... other links */}
    </nav>
  )
}
```

**3. StickyCountdownBanner.tsx (CTA button)**

```typescript
// components/StickyCountdownBanner.tsx
import { scrollToElement } from '@/lib/scroll-utils'

export default function StickyCountdownBanner() {
  const handleCtaClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const href = campaign.banner.ctaHref

    if (href.startsWith('#')) {
      e.preventDefault()
      scrollToElement(href) // ✅ Dynamic offset
    }
    // If external URL, allow default behavior
  }

  return (
    <div>
      <a
        href={campaign.banner.ctaHref}
        onClick={handleCtaClick}
      >
        {campaign.banner.cta}
      </a>
    </div>
  )
}
```

**4. Any other components with anchor links**

Search for all instances:
```bash
# Find all files using scrollIntoView or hash navigation
grep -r "scrollIntoView\|href=\"#" --include="*.tsx" --include="*.ts" components/ app/
```

Update each to use the centralized utility.

#### Testing Checklist

- [ ] Click "Get Started" button → scrolls to #contact with correct offset
- [ ] Click nav links → scrolls to sections with banner visible
- [ ] Dismiss banner → subsequent scrolls adjust offset automatically
- [ ] Mobile view → scroll offsets account for smaller nav
- [ ] Reload page on anchor link (e.g., `/?#pricing`) → scrolls correctly on load

---

## High-Priority Issues (Fix During Implementation)

### HIGH #1: Mobile Countdown Display

**Issue**: Plan hides countdown completely on mobile (`hidden md:flex`). Loses urgency messaging on primary conversion device.

**Solution**: Add compact countdown variant optimized for mobile.

```typescript
// components/CountdownTimer.tsx

export default function CountdownTimer({ deadline, variant = 'inline' }: CountdownTimerProps) {
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  })

  useEffect(() => {
    const calculateTimeRemaining = () => {
      const now = new Date().getTime()
      const end = new Date(deadline).getTime()
      const distance = end - now

      if (distance < 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0 }
      }

      return {
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      }
    }

    setTimeRemaining(calculateTimeRemaining())
    const interval = setInterval(() => {
      setTimeRemaining(calculateTimeRemaining())
    }, 1000)

    return () => clearInterval(interval)
  }, [deadline])

  if (variant === 'inline') {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        fontSize: '0.875rem',
        fontWeight: '500'
      }}>
        {/* Desktop: Full countdown */}
        <div style={{
          display: 'none',
          '@media (min-width: 768px)': {
            display: 'flex',
            gap: '0.5rem'
          }
        }} className="hidden md:flex md:gap-2">
          <span>{timeRemaining.days}d</span>
          <span>{timeRemaining.hours}h</span>
          <span>{timeRemaining.minutes}m</span>
          <span>{timeRemaining.seconds}s</span>
        </div>

        {/* Mobile: Compact countdown (days + hours only) */}
        <div style={{
          display: 'flex',
          gap: '0.5rem'
        }} className="md:hidden">
          <span>{timeRemaining.days}d</span>
          <span>{timeRemaining.hours}h</span>
        </div>
      </div>
    )
  }

  // Full variant (for hero sections, etc.)
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: '1rem',
      maxWidth: '400px'
    }}>
      {Object.entries(timeRemaining).map(([unit, value]) => (
        <div
          key={unit}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '1rem',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}
        >
          <span style={{
            fontSize: '2rem',
            fontWeight: '300',
            lineHeight: '1',
            marginBottom: '0.5rem'
          }}>
            {value.toString().padStart(2, '0')}
          </span>
          <span style={{
            fontSize: '0.75rem',
            textTransform: 'uppercase',
            opacity: 0.8
          }}>
            {unit}
          </span>
        </div>
      ))}
    </div>
  )
}
```

**Mobile Banner Layout Adjustment**:

```typescript
// components/StickyCountdownBanner.tsx

return (
  <div style={{
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    height: '50px',
    zIndex: 60,
    backgroundColor: '#ff6b35',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0 1rem'
  }}>
    <div style={{
      maxWidth: '1200px',
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '0.5rem' // Tighter on mobile
    }}>
      {/* Compact text on mobile */}
      <span style={{
        fontSize: '0.75rem', // Smaller on mobile
        fontWeight: '500',
        textTransform: 'uppercase',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        flex: '0 1 auto'
      }} className="md:text-sm md:flex-1">
        {campaign.banner.text.replace('{spots}', campaign.spotsRemaining.toString())}
      </span>

      <CountdownTimer deadline={campaign.deadline} variant="inline" />

      {/* CTA - hide text on small mobile, show icon only */}
      <a href={campaign.banner.ctaHref} style={{
        padding: '0.5rem 1rem',
        backgroundColor: 'white',
        color: '#ff6b35',
        fontSize: '0.75rem',
        fontWeight: '500',
        textTransform: 'uppercase',
        textDecoration: 'none',
        whiteSpace: 'nowrap'
      }} className="md:text-sm md:px-6">
        <span className="hidden sm:inline">{campaign.banner.cta}</span>
        <span className="sm:hidden">→</span> {/* Arrow on tiny screens */}
      </a>

      <button onClick={handleDismiss} style={{ /* ... */ }}>
        <X style={{ width: '16px', height: '16px' }} strokeWidth={2} />
      </button>
    </div>
  </div>
)
```

---

### HIGH #2: Error Boundaries for Campaign Components

**Issue**: No error handling if campaign JSON is malformed, deadline parsing fails, or components crash.

**Solution**: Add error boundaries and graceful degradation.

```typescript
// components/CampaignErrorBoundary.tsx (NEW FILE)
'use client'

import React, { Component, ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export default class CampaignErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Campaign component error:', error, errorInfo)

    // Optional: Send to error tracking service
    // trackError('campaign-component-error', { error, errorInfo })
  }

  render() {
    if (this.state.hasError) {
      // Show fallback or nothing
      return this.props.fallback || null
    }

    return this.props.children
  }
}
```

**Usage in layout**:

```typescript
// app/layout.tsx
import CampaignProvider from '@/components/CampaignProvider'
import CampaignErrorBoundary from '@/components/CampaignErrorBoundary'

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <CampaignErrorBoundary>
          <CampaignProvider>
            {children}
          </CampaignProvider>
        </CampaignErrorBoundary>
      </body>
    </html>
  )
}
```

**Add validation in components**:

```typescript
// components/StickyCountdownBanner.tsx

export default function StickyCountdownBanner() {
  // ✅ Validate campaign data
  const campaign = campaignData.classOf2025

  // Check for required fields
  if (!campaign.deadline || !campaign.spotsRemaining) {
    console.warn('Campaign data incomplete, hiding banner')
    return null
  }

  // Validate deadline format
  const deadlineDate = new Date(campaign.deadline)
  if (isNaN(deadlineDate.getTime())) {
    console.error('Invalid campaign deadline format:', campaign.deadline)
    return null
  }

  // Check if deadline has passed
  if (deadlineDate < new Date()) {
    console.warn('Campaign deadline has passed')
    return null
  }

  // ... rest of component
}
```

---

### HIGH #3: Accessibility - Keyboard Navigation & Screen Readers

**Issue**: Banner dismiss button and countdown timer lack proper ARIA labels and keyboard support.

**Solution**: Add full accessibility support.

```typescript
// components/StickyCountdownBanner.tsx

export default function StickyCountdownBanner() {
  // ... existing code

  return (
    <div
      role="banner"
      aria-label="Campaign announcement"
      style={{ /* ... */ }}
    >
      <div style={{ /* ... */ }}>
        {/* Campaign text with proper semantics */}
        <span
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          {campaign.banner.text.replace('{spots}', campaign.spotsRemaining.toString())}
        </span>

        {/* Countdown with screen reader text */}
        <div aria-label={`Time remaining: ${timeRemaining.days} days, ${timeRemaining.hours} hours`}>
          <CountdownTimer deadline={campaign.deadline} variant="inline" />
        </div>

        {/* CTA with clear label */}
        <a
          href={campaign.banner.ctaHref}
          aria-label={`${campaign.banner.cta} - Opens application form`}
          style={{ /* ... */ }}
        >
          {campaign.banner.cta}
        </a>

        {/* Dismiss button with proper attributes */}
        <button
          onClick={handleDismiss}
          aria-label="Dismiss campaign banner for 24 hours"
          title="Dismiss banner"
          style={{ /* ... */ }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              handleDismiss()
            }
          }}
        >
          <X style={{ width: '18px', height: '18px' }} strokeWidth={2} aria-hidden="true" />
        </button>
      </div>
    </div>
  )
}
```

**Ensure focus management**:

```typescript
// When banner dismisses, return focus to main content
const handleDismiss = () => {
  localStorage.setItem('campaignBannerDismissed', Date.now().toString())
  setIsVisible(false)

  // Return focus to main content
  const mainContent = document.querySelector('main')
  if (mainContent instanceof HTMLElement) {
    mainContent.focus()
  }
}
```

---

### HIGH #4: Campaign JSON Validation

**Issue**: No runtime validation of campaign data structure. Typos or missing fields cause silent failures.

**Solution**: Add validation utility with clear error messages.

```typescript
// lib/validate-campaign.ts (NEW FILE)

import type { CampaignConfig } from '@/types/campaign'

interface ValidationError {
  field: string
  message: string
}

export function validateCampaignConfig(data: unknown): {
  valid: boolean
  errors: ValidationError[]
  data?: CampaignConfig
} {
  const errors: ValidationError[] = []

  // Type guard
  if (typeof data !== 'object' || data === null) {
    return {
      valid: false,
      errors: [{ field: 'root', message: 'Campaign data must be an object' }]
    }
  }

  const config = data as Partial<CampaignConfig>

  // Validate active field
  if (config.active !== null && config.active !== 'classOf2025' && config.active !== 'designForGood') {
    errors.push({
      field: 'active',
      message: 'Must be "classOf2025", "designForGood", or null'
    })
  }

  // Validate classOf2025
  if (config.classOf2025) {
    const c = config.classOf2025

    if (typeof c.enabled !== 'boolean') {
      errors.push({ field: 'classOf2025.enabled', message: 'Must be a boolean' })
    }

    if (typeof c.spotsRemaining !== 'number' || c.spotsRemaining < 0) {
      errors.push({ field: 'classOf2025.spotsRemaining', message: 'Must be a non-negative number' })
    }

    if (typeof c.totalSpots !== 'number' || c.totalSpots < 1) {
      errors.push({ field: 'classOf2025.totalSpots', message: 'Must be a positive number' })
    }

    if (c.spotsRemaining > c.totalSpots) {
      errors.push({ field: 'classOf2025.spotsRemaining', message: 'Cannot exceed totalSpots' })
    }

    // Validate deadline format
    if (c.deadline) {
      const date = new Date(c.deadline)
      if (isNaN(date.getTime())) {
        errors.push({ field: 'classOf2025.deadline', message: 'Invalid date format (use ISO 8601)' })
      } else if (date < new Date()) {
        errors.push({ field: 'classOf2025.deadline', message: 'Deadline is in the past' })
      }
    } else {
      errors.push({ field: 'classOf2025.deadline', message: 'Required field missing' })
    }

    // Validate pricing
    if (!c.pricing || typeof c.pricing !== 'object') {
      errors.push({ field: 'classOf2025.pricing', message: 'Required field missing or invalid' })
    } else {
      if (!c.pricing.amount) errors.push({ field: 'classOf2025.pricing.amount', message: 'Required' })
      if (!c.pricing.stripePriceId) errors.push({ field: 'classOf2025.pricing.stripePriceId', message: 'Required' })
    }

    // Validate banner
    if (!c.banner || typeof c.banner !== 'object') {
      errors.push({ field: 'classOf2025.banner', message: 'Required field missing or invalid' })
    } else {
      if (!c.banner.text) errors.push({ field: 'classOf2025.banner.text', message: 'Required' })
      if (!c.banner.cta) errors.push({ field: 'classOf2025.banner.cta', message: 'Required' })
      if (!c.banner.ctaHref) errors.push({ field: 'classOf2025.banner.ctaHref', message: 'Required' })
    }
  } else {
    errors.push({ field: 'classOf2025', message: 'Required configuration missing' })
  }

  // Return validation result
  if (errors.length === 0) {
    return {
      valid: true,
      errors: [],
      data: config as CampaignConfig
    }
  }

  return {
    valid: false,
    errors
  }
}
```

**Usage**:

```typescript
// components/CampaignProvider.tsx
'use client'

import campaignData from '@/data/activeCampaign.json'
import { validateCampaignConfig } from '@/lib/validate-campaign'

export default function CampaignProvider({ children }) {
  // Validate on mount
  const validation = validateCampaignConfig(campaignData)

  if (!validation.valid) {
    console.error('Campaign configuration errors:', validation.errors)
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
            zIndex: 9999
          }}>
            <strong>Campaign Config Errors:</strong>
            <ul>
              {validation.errors.map((err, i) => (
                <li key={i}>{err.field}: {err.message}</li>
              ))}
            </ul>
          </div>
          {children}
        </>
      )
    }
    // Production: silently fail
    return <>{children}</>
  }

  // ... rest of component with validated data
}
```

---

### HIGH #5-9: Additional Issues

**HIGH #5: Stripe Price ID Validation**
- Issue: No check that stripePriceId exists before creating checkout
- Solution: Add validation in API route and show helpful error

**HIGH #6: Campaign Spot Count Sync**
- Issue: Manual spot count updates can get out of sync with actual subscriptions
- Solution: Add Stripe webhook handler to auto-decrement spots on successful subscription

**HIGH #7: Mobile Navigation Offset**
- Issue: Mobile burger menu opens without accounting for banner
- Solution: Adjust mobile menu top position dynamically

**HIGH #8: Campaign Expired State**
- Issue: No handling for when deadline passes while user is on site
- Solution: Add useEffect to check deadline and hide banner when expired

**HIGH #9: Loading States**
- Issue: No loading indicators during Stripe checkout redirect
- Solution: Add loading state to CTA buttons

*(Full code examples for #5-9 available on request to keep this document focused)*

---

## TypeScript Type Definitions

**Complete type definitions have been provided in CRITICAL #5 above.**

Reference file: `/types/campaign.ts`

Key exports:
- `CampaignConfig` - Root configuration interface
- `ClassOf2025Campaign` - Class of 2025 specific data
- `DesignForGoodCampaign` - Design for Good specific data
- `CampaignPricing` - Pricing structure
- `TimeRemaining` - Countdown timer types
- `isCampaignActive()` - Type-safe campaign check utility

---

## Pre-Implementation Checklist

Before writing any campaign code, ensure all CRITICAL issues are addressed:

### Critical Fixes Verification

- [ ] **Z-Index/Layout**: CSS variable `--banner-height` added to `globals.css`
- [ ] **Z-Index/Layout**: Navigation uses `top: var(--banner-height, 0px)`
- [ ] **Z-Index/Layout**: Banner component sets `has-banner` class on document root
- [ ] **Inline Styling**: All Tailwind classes converted to inline styles in examples
- [ ] **Inline Styling**: Conversion reference table reviewed and saved
- [ ] **SSR Hydration**: Two-phase mounting pattern understood (`isMounted` guard)
- [ ] **SSR Hydration**: All client components use correct initialization
- [ ] **JSON Import**: Campaign provider strategy chosen (Option A/B/C)
- [ ] **JSON Import**: `CampaignProvider.tsx` component created if using Option A
- [ ] **TypeScript Types**: `/types/campaign.ts` file created with all interfaces
- [ ] **TypeScript Types**: All campaign components import and use types
- [ ] **Scroll Utility**: `/lib/scroll-utils.ts` created with `getHeaderHeight()` and `scrollToElement()`
- [ ] **Scroll Utility**: All components updated to use centralized utility
- [ ] **Scroll Utility**: Hardcoded `scrollToElement` functions removed

### High-Priority Fixes Verification

- [ ] **Mobile Countdown**: Compact variant added to `CountdownTimer` component
- [ ] **Mobile Countdown**: Banner layout adjusts for mobile screens
- [ ] **Error Boundaries**: `CampaignErrorBoundary.tsx` component created
- [ ] **Error Boundaries**: Error boundary wraps campaign provider in layout
- [ ] **Accessibility**: ARIA labels added to banner elements
- [ ] **Accessibility**: Keyboard navigation tested (Tab, Enter, Escape)
- [ ] **Accessibility**: Screen reader announcements verified
- [ ] **Validation**: `/lib/validate-campaign.ts` utility created
- [ ] **Validation**: Validation runs on app load in development
- [ ] **Validation**: Clear error messages displayed for config issues

### Environment Setup

- [ ] `activeCampaign.json` file created in `/data` directory
- [ ] JSON structure matches `CampaignConfig` interface exactly
- [ ] Stripe price IDs created for campaign pricing
- [ ] Campaign deadline set to future date (ISO 8601 format)
- [ ] Initial spot count configured correctly

### Testing Preparation

- [ ] Development server running (`npm run dev`)
- [ ] Browser DevTools console open (check for errors)
- [ ] Multiple screen sizes ready for testing (mobile, tablet, desktop)
- [ ] Test checklist prepared (see below)

---

## Quick Reference

### Common Patterns

**Check if campaign is active**:
```typescript
import { isCampaignActive } from '@/types/campaign'
import campaignData from '@/data/activeCampaign.json'

const isActive = isCampaignActive(campaignData as CampaignConfig, 'classOf2025')
```

**Get header height for scroll offset**:
```typescript
import { getHeaderHeight } from '@/lib/scroll-utils'

const offset = getHeaderHeight() // Returns total height of fixed headers
```

**Smooth scroll to element**:
```typescript
import { scrollToElement } from '@/lib/scroll-utils'

scrollToElement('#contact') // Automatically accounts for banner + nav
```

**Two-phase mounting (avoid hydration mismatch)**:
```typescript
const [isMounted, setIsMounted] = useState(false)

useEffect(() => {
  setIsMounted(true) // First effect
}, [])

useEffect(() => {
  if (!isMounted) return
  // Safe to use localStorage here
}, [isMounted])

if (!isMounted) return null
```

**Inline style conversion** (common classes):
```typescript
// Tailwind → Inline
'text-2xl font-light tracking-tight'
→
{ fontSize: '1.5rem', fontWeight: '300', letterSpacing: '-0.025em' }
```

### File Structure

```
/data
  └── activeCampaign.json (Campaign configuration)

/types
  └── campaign.ts (TypeScript interfaces)

/lib
  ├── scroll-utils.ts (Scroll utilities)
  └── validate-campaign.ts (Config validation)

/components
  ├── CampaignProvider.tsx (Wraps app with campaign logic)
  ├── CampaignErrorBoundary.tsx (Error handling)
  ├── StickyCountdownBanner.tsx (Top banner)
  ├── CountdownTimer.tsx (Timer component)
  ├── BrandedPricingSection.tsx (Modified for campaigns)
  └── DesignForGoodBanner.tsx (Below pricing banner)

/app
  ├── layout.tsx (Includes CampaignProvider)
  ├── page.tsx (Homepage with pricing)
  └── globals.css (Banner height CSS variable)
```

### Testing Checklist (After Implementation)

**Banner Functionality**:
- [ ] Banner appears when campaign active
- [ ] Banner hidden when campaign inactive
- [ ] Dismiss button hides banner
- [ ] Banner reappears after 24 hours
- [ ] Countdown updates every second
- [ ] Countdown shows correct time remaining
- [ ] CTA button links to correct page

**Pricing Integration**:
- [ ] Business tier shows dark background during campaign
- [ ] Original price shown with strikethrough
- [ ] Campaign price displays correctly
- [ ] "CLASS OF 2025 - X SPOTS LEFT" badge appears
- [ ] Other tiers (Essential, Enterprise, Enterprise+) unchanged
- [ ] "Get Started" button redirects correctly

**Layout & Scroll**:
- [ ] Navigation offsets correctly with banner visible
- [ ] Navigation returns to top-0 when banner dismissed
- [ ] Clicking nav links scrolls to correct position
- [ ] "Get Started" scrolls to #contact with proper offset
- [ ] No content hidden behind headers

**Responsive Design**:
- [ ] Banner displays correctly on mobile (320px width)
- [ ] Countdown readable on tablet (768px width)
- [ ] Desktop layout (1200px+ width) shows full content
- [ ] Text wraps appropriately on small screens
- [ ] CTA buttons remain accessible at all sizes

**Accessibility**:
- [ ] Tab key navigates banner elements in order
- [ ] Enter key activates CTA and dismiss buttons
- [ ] Screen reader announces banner content
- [ ] Focus returns to main content when banner dismissed
- [ ] All interactive elements have visible focus states

**Error Handling**:
- [ ] Invalid deadline format doesn't crash app
- [ ] Missing campaign data fails gracefully
- [ ] Stripe API errors show fallback (scroll to contact)
- [ ] Console shows helpful error messages in development

---

## Next Steps

1. **Review this document thoroughly** before beginning implementation
2. **Work through Pre-Implementation Checklist** to set up foundation
3. **Implement CRITICAL fixes first** (cannot proceed without these)
4. **Add HIGH-priority fixes during component development**
5. **Test extensively** using Testing Checklist before considering complete

**When ready to begin implementation**, start with:
1. Create `/types/campaign.ts`
2. Create `/lib/scroll-utils.ts`
3. Update `/app/globals.css` with banner height variable
4. Create `/data/activeCampaign.json` with configuration
5. Create `CampaignProvider.tsx` wrapper component

Then proceed to build individual campaign components as outlined in [Class0f2025-AMENDED.md](./Class0f2025-AMENDED.md).

---

**Document End**

For questions or clarifications on any fix, refer back to the detailed code examples in each CRITICAL/HIGH section above.
