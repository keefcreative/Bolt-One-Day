# CLASS OF 2025 CAMPAIGN - FINAL IMPLEMENTATION PLAN

**Date:** 2025-12-08
**Status:** Ready for Implementation
**Phase 0 Verification:** ✅ Complete
**Architecture:** Refined with sticky banner approach

---

## 📋 EXECUTIVE SUMMARY

### Core Strategy (Refined)
✅ Keep existing homepage (15 sections, current flow)
✅ Add slim sticky countdown banner above navigation (dismissible)
✅ **Modify existing BrandedPricingSection** to be campaign-aware (Business tier transforms)
✅ Add Design for Good banner below pricing (conditional)
✅ Hero & testimonials already fixed (no action needed)
✅ Only ONE campaign active at a time
✅ Simple JSON-based campaign toggle system

### Why This Approach is Better
- **Less intrusive:** Slim sticky banner vs large section banners
- **Always visible:** Countdown creates constant urgency
- **Non-disruptive:** Doesn't push content down like section banners
- **Mobile-friendly:** Banner at top, burger nav below
- **Easy to manage:** Single JSON file controls everything
- **Flexible:** Can swap between campaigns instantly

---

## ✅ VERIFICATION RESULTS

### What's Already Fixed
- **Testimonials:** Using authentic `SingleTestimonial` component with real client feedback
- **Hero Stats:** Already updated to legitimate metrics (250+ projects, 12+ brands, 48h delivery)
- **Pricing Structure:** Ready for campaign tiers
- **Design for Good Page:** Already exists at `/design-for-good`
- **Color Tokens:** All campaign colors verified (ink, flame, sage, charity)
- **Z-Index System:** Navigation uses z-50, toast uses z-100

### Notes for Future
- **Testimonials:** Add more client testimonials as they're collected (authentic only)
- **Current component:** `SingleTestimonial` displays one testimonial at a time
- **Data source:** [data/testimonials.json](../data/testimonials.json)

---

## 🎯 REFINED ARCHITECTURE

### Visual Flow
```
┌──────────────────────────────────────────────────────────┐
│ 🔥 Class of 2025: 6 spots | 23d 14h 32m [Apply] [×]      │ ← Sticky banner (z-60, dismissible)
├──────────────────────────────────────────────────────────┤
│ ☰ Navigation (Logo + Links + CTA)                        │ ← Sticky nav (z-50, burger on mobile)
└──────────────────────────────────────────────────────────┘

Hero
LogoCarousel
Services
WeBelieve
Team
Portfolio
Process
Testimonial

┌──────────────────────────────────────────────────────────┐
│                    PRICING SECTION                        │ ← BrandedPricingSection (campaign-aware)
│  ┌────────────┐  ┌─────────────────┐  ┌────────────┐    │
│  │ Essential  │  │ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ │  │ Enterprise │    │
│  │  £799/mo   │  │ ▓ Business    ▓ │  │ £2,500/mo  │    │
│  │            │  │ ▓ £999/mo     ▓ │  │            │    │
│  │ Light card │  │ ▓ CLASS 2025  ▓ │  │ Light card │    │
│  │            │  │ ▓ DARK CARD   ▓ │  │ +Ent+ tog  │    │
│  └────────────┘  └─────────────────┘  └────────────┘    │
│                      ↑ Business tier transforms during    │
│                        campaign (dark bg, £999 price)     │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│  ❤️  DESIGN FOR GOOD BANNER                               │ ← Only during DFG campaign
│  Nonprofits: £1,499/mo first year • 8 spots [Apply Now]  │
└──────────────────────────────────────────────────────────┘

SingleProject
Solutions
PremiumCta
FAQ
Contact
Footer
```

### User Journey
1. **Land on site** → See sticky countdown banner (instant urgency)
2. **Scroll anywhere** → Banner stays visible (persistent FOMO)
3. **Close banner** → Remembered for 24 hours (respects choice, but tries again tomorrow)
4. **Reach pricing** → See campaign-specific pricing tier
5. **Below pricing** → DFG banner for nonprofit audience (only during DFG campaign)
6. **Rest of page** → Standard conversion funnel intact

---

## 🔧 CAMPAIGN TOGGLE SYSTEM

### New File: `data/activeCampaign.json`

```json
{
  "active": "classOf2025",
  "classOf2025": {
    "enabled": true,
    "name": "Class of 2025",
    "spotsRemaining": 6,
    "totalSpots": 10,
    "deadline": "2025-12-31T23:59:59Z",
    "pricing": {
      "amount": "£999",
      "period": "/month",
      "originalPrice": "£2,499"
    },
    "banner": {
      "text": "Class of 2025: {spots} spots left",
      "cta": "Apply Now",
      "ctaHref": "/class-of-2025"
    },
    "stripePriceId": "price_TO_BE_CREATED"
  },
  "designForGood": {
    "enabled": false,
    "name": "Design for Good",
    "spotsRemaining": 8,
    "totalSpots": 10,
    "deadline": "2026-01-31T23:59:59Z",
    "pricing": {
      "amount": "£1,499",
      "period": "/month",
      "originalPrice": "£1,999"
    },
    "banner": {
      "text": "Design for Good: {spots} nonprofit spots left",
      "cta": "Learn More",
      "ctaHref": "/design-for-good"
    },
    "stripePriceId": "price_TO_BE_CREATED"
  }
}
```

### How to Switch Campaigns

**To activate Class of 2025:**
```json
{
  "active": "classOf2025",
  "classOf2025": { "enabled": true, ... }
}
```

**To activate Design for Good:**
```json
{
  "active": "designForGood",
  "designForGood": { "enabled": true, ... }
}
```

**To deactivate all campaigns:**
```json
{
  "active": null
}
```

**To update spots remaining:**
- Just edit the `spotsRemaining` number
- Save and redeploy (or hot reload in dev)

---

## 🎨 NEW COMPONENTS TO BUILD

### 1. StickyCountdownBanner Component
**Location:** `/components/StickyCountdownBanner.tsx`

**Specs:**
- Height: ~50-60px (slim, non-intrusive)
- Position: `fixed top-0 left-0 right-0 z-60`
- Background: Dark for Class of 2025 (ink), light for DFG (sage)
- Dismissible: Close button with 24-hour localStorage memory
- Responsive: Full width on desktop, stays at top on mobile
- Animation: Slide down on mount, slide up on close

**Features:**
- Reads from `data/activeCampaign.json`
- Only renders if `active` campaign is set
- Inline countdown timer (compact format: `23d 14h 32m 15s`)
- Dynamic text with spot count replacement
- Close button (×) on right side
- CTA button with campaign link

**Component Code Structure:**
```tsx
'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import Link from 'next/link'
import CountdownTimer from './CountdownTimer'
import campaignData from '@/data/activeCampaign.json'

export default function StickyCountdownBanner() {
  const [isVisible, setIsVisible] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    // Check if banner was dismissed in last 24 hours
    const dismissedAt = localStorage.getItem('campaign-banner-dismissed')
    if (dismissedAt) {
      const hoursSinceDismissed = (Date.now() - parseInt(dismissedAt)) / (1000 * 60 * 60)
      if (hoursSinceDismissed < 24) {
        return // Don't show if dismissed within 24 hours
      }
    }
    setIsVisible(true)
    setIsMounted(true)
  }, [])

  const handleClose = () => {
    setIsVisible(false)
    localStorage.setItem('campaign-banner-dismissed', Date.now().toString())
  }

  if (!campaignData.active || !isMounted) return null

  const activeCampaign = campaignData[campaignData.active]
  if (!activeCampaign?.enabled) return null

  const bannerText = activeCampaign.banner.text.replace(
    '{spots}',
    activeCampaign.spotsRemaining.toString()
  )

  const bgClass = campaignData.active === 'classOf2025'
    ? 'bg-ink text-white border-flame/20'
    : 'bg-sage text-ink border-charity/20'

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-60 border-b ${bgClass} transition-transform duration-300 ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <div className="container-premium py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Left: Text + Countdown */}
          <div className="flex items-center gap-4 flex-1">
            <span className="text-sm font-medium tracking-wide">
              🔥 {bannerText}
            </span>
            <div className="hidden md:block">
              <CountdownTimer
                deadline={activeCampaign.deadline}
                variant="inline"
              />
            </div>
          </div>

          {/* Right: CTA + Close */}
          <div className="flex items-center gap-3">
            <Link
              href={activeCampaign.banner.ctaHref}
              className="px-4 py-2 bg-flame text-white text-xs font-medium tracking-wider uppercase hover:bg-ember transition-colors"
            >
              {activeCampaign.banner.cta}
            </Link>
            <button
              onClick={handleClose}
              className="p-1 hover:opacity-70 transition-opacity"
              aria-label="Close banner"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
```

---

### 2. CountdownTimer Component (Enhanced)
**Location:** `/components/CountdownTimer.tsx`

**Specs:**
- Two variants: `"inline"` (slim banner) and `"full"` (large display)
- Inline: Compact format `23d 14h 32m 15s` in single line
- Full: Large display with labels below each unit
- Updates every second
- Shows zeros when deadline passed
- Type-safe with TypeScript interfaces

**Component Code:**
```tsx
'use client'

import { useState, useEffect } from 'react'

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

interface CountdownTimerProps {
  deadline: string
  variant?: 'inline' | 'full'
}

export default function CountdownTimer({ deadline, variant = 'full' }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft())

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)

    return () => clearInterval(timer)
  }, [deadline])

  function calculateTimeLeft(): TimeLeft {
    const difference = +new Date(deadline) - +new Date()

    if (difference > 0) {
      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      }
    }

    return { days: 0, hours: 0, minutes: 0, seconds: 0 }
  }

  if (variant === 'inline') {
    return (
      <div className="text-sm font-mono tabular-nums opacity-90">
        {timeLeft.days}d {String(timeLeft.hours).padStart(2, '0')}h{' '}
        {String(timeLeft.minutes).padStart(2, '0')}m{' '}
        {String(timeLeft.seconds).padStart(2, '0')}s
      </div>
    )
  }

  return (
    <div className="flex gap-6 justify-center">
      <TimeUnit value={timeLeft.days} label="Days" />
      <TimeUnit value={timeLeft.hours} label="Hours" />
      <TimeUnit value={timeLeft.minutes} label="Mins" />
      <TimeUnit value={timeLeft.seconds} label="Secs" />
    </div>
  )
}

interface TimeUnitProps {
  value: number
  label: string
}

function TimeUnit({ value, label }: TimeUnitProps) {
  return (
    <div className="flex flex-col items-center">
      <div className="text-4xl font-light text-white tabular-nums">
        {String(value).padStart(2, '0')}
      </div>
      <div className="text-xs text-white/60 uppercase tracking-wider mt-1">
        {label}
      </div>
    </div>
  )
}
```

---

### 3. Modify BrandedPricingSection Component (Campaign-Aware)
**Location:** `/components/BrandedPricingSection.tsx` (MODIFY EXISTING)

**Strategy:**
- Import `activeCampaign.json`
- Check if `active === 'classOf2025'` and campaign is enabled
- When campaign active AND current plan is "Business": Transform the Business tier
- All other tiers (Essential, Enterprise, Enterprise+) remain unchanged

**Business Tier Transformation During Campaign:**

**Standard Business Tier (No Campaign):**
- Badge: "Saves Most Time" (TrendingUp icon)
- Price: £1,449/mo
- Background: White card
- Features: Current Business features
- CTA: Current Business CTA

**Business Tier During Class of 2025 Campaign:**
- Badge: "CLASS OF 2025 - X SPOTS LEFT"
- Price: £999/mo with strikethrough (was £1,449 - Save 31%)
- Background: Dark (bg-smoke with text-white) - stands out dramatically
- Features: Same Business features + "Locked rate through Dec 2025"
- CTA: "Apply for Class of 2025" → `/class-of-2025`

**Implementation Logic:**
```tsx
// At top of component
import campaignData from '@/data/activeCampaign.json'

// Inside component
const isCampaignActive = campaignData.active === 'classOf2025' && campaignData.classOf2025.enabled

// In the map loop for plans
{plans.map((plan, index) => {
  const isBusinessPlan = plan.name === "Business"
  const isCampaignBusiness = isBusinessPlan && isCampaignActive

  // Determine pricing
  const displayPrice = isCampaignBusiness ? campaignData.classOf2025.pricing.amount : plan.price
  const originalPrice = isCampaignBusiness ? plan.price : null

  // Determine badge
  const badgeContent = isCampaignBusiness
    ? `CLASS OF 2025 - ${campaignData.classOf2025.spotsRemaining} SPOTS LEFT`
    : (plan.popular ? 'Saves Most Time' : null)

  // Determine styling
  const cardBg = isCampaignBusiness ? '#1A1A1A' : 'white'  // smoke color
  const textColor = isCampaignBusiness ? 'white' : '#2c2c2c'
  const cardBorder = isCampaignBusiness ? '2px solid #ff6b35' : (plan.popular ? '2px solid #ff6b35' : '1px solid rgba(107, 114, 128, 0.2)')

  // Determine features
  const features = isCampaignBusiness
    ? [...plan.features, 'Locked rate through Dec 2025']
    : plan.features

  // Determine CTA
  const ctaText = isCampaignBusiness ? 'Apply for Class of 2025' : plan.ctaText
  const ctaAction = isCampaignBusiness
    ? () => window.location.href = '/class-of-2025'
    : () => handleGetStarted(plan)

  return (
    <div key={index} style={{
      ...cardStyle(plan.popular || isCampaignBusiness),
      background: cardBg,
      border: cardBorder,
      // ... rest of styling
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
          fontSize: '0.875rem',
          fontWeight: '500',
        }}>
          {badgeContent}
        </div>
      )}

      {/* Pricing Display */}
      <div className="flex items-baseline justify-center mb-6">
        <span className="text-5xl font-light tracking-tight" style={{ color: textColor }}>
          {displayPrice}
        </span>
        <span className="ml-2 font-light" style={{ color: isCampaignBusiness ? 'rgba(250, 250, 250, 0.6)' : '#6b7280' }}>
          {plan.period}
        </span>
      </div>

      {/* Show savings for campaign */}
      {isCampaignBusiness && originalPrice && (
        <p className="text-sm text-center mb-4" style={{ color: 'rgba(250, 250, 250, 0.7)' }}>
          <span style={{ textDecoration: 'line-through' }}>{originalPrice}/mo</span>
          {' '}- Save 31%
        </p>
      )}

      {/* Features list */}
      <ul className="space-y-2">
        {features.map((feature, featureIndex) => {
          // Highlight the "Locked rate" feature for campaign
          const isLockedRate = feature.includes('Locked rate')

          return (
            <li key={featureIndex} className="flex items-start gap-3">
              <div style={{
                width: '6px',
                height: '6px',
                backgroundColor: (isCampaignBusiness && isLockedRate) ? '#ff6b35' : 'rgba(107, 114, 128, 0.4)',
                marginTop: '8px',
                flexShrink: 0
              }}></div>
              <span
                className="text-sm font-light"
                style={{
                  color: isCampaignBusiness ? (isLockedRate ? 'white' : 'rgba(250, 250, 250, 0.8)') : '#6b7280',
                  fontWeight: (isCampaignBusiness && isLockedRate) ? '500' : '300'
                }}
              >
                {feature}
              </span>
            </li>
          )
        })}
      </ul>

      {/* CTA Button */}
      <button
        onClick={ctaAction}
        className="w-full py-4 px-6 font-medium text-sm tracking-widest uppercase transition-all duration-300"
        style={{
          backgroundColor: isCampaignBusiness || plan.popular ? '#ff6b35' : '#2c2c2c',
          color: 'white',
          border: 'none',
          cursor: 'pointer'
        }}
      >
        {ctaText}
      </button>
    </div>
  )
})}
```

**Key Changes Summary:**
1. Import campaign data at component level
2. Detect when Business tier + campaign is active
3. Apply dark styling (bg-smoke, text-white) to Business card only
4. Replace "MOST POPULAR" badge with "CLASS OF 2025 - X SPOTS LEFT"
5. Show £999 price with strikethrough £1,449 and savings
6. Add "Locked rate through Dec 2025" to features
7. Change CTA to link to `/class-of-2025` page
8. Essential, Enterprise, Enterprise+ remain completely unchanged

---

### 4. DesignForGoodBanner Component
**Location:** `/components/DesignForGoodBanner.tsx`

**Specs:**
- Full-width banner (not sticky)
- Positioned BELOW pricing section on homepage
- Only renders when `active === "designForGood"`
- Light background (sage) with charity green accents
- Heart icon on left
- Content in center
- CTA button on right
- Horizontal layout (compact, not as prominent as pricing)

**Component Code:**
```tsx
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowRight, Heart } from 'lucide-react'
import campaignData from '@/data/activeCampaign.json'

export default function DesignForGoodBanner() {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Only render if Design for Good is the active campaign
  if (!isMounted || campaignData.active !== 'designForGood') return null

  const campaign = campaignData.designForGood
  if (!campaign?.enabled) return null

  return (
    <section className="bg-sage border-y border-charity/20">
      <div className="container-premium py-12">
        <div className="grid grid-cols-1 lg:grid-cols-[auto_1fr_auto] gap-8 items-center">

          {/* Icon/Badge */}
          <div className="flex items-center justify-center lg:justify-start">
            <div className="w-16 h-16 bg-charity flex items-center justify-center">
              <Heart className="w-8 h-8 text-white" />
            </div>
          </div>

          {/* Content */}
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="text-xs font-medium tracking-[0.1em] uppercase text-charity">
                Design for Good Initiative
              </span>
              <span className="text-xs text-smoke/60">
                • {campaign.spotsRemaining} nonprofit spots remaining
              </span>
            </div>

            <h2 className="text-[2rem] font-light text-ink mb-2 tracking-[-0.02em]">
              Strategic Design for Nonprofits Making Real Impact
            </h2>

            <p className="text-base font-light text-smoke/80 max-w-2xl">
              {campaign.pricing.amount}{campaign.pricing.period} first year, then {campaign.pricing.originalPrice}{campaign.pricing.period} lifetime.
              Annual cohort for {campaign.totalSpots} organizations ready to elevate their mission.
            </p>
          </div>

          {/* CTA */}
          <div className="flex flex-col gap-3">
            <Link
              href={campaign.banner.ctaHref}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-ink text-white font-medium text-sm tracking-[0.05em] uppercase transition-all hover:bg-charity whitespace-nowrap"
            >
              Apply Now
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href={`${campaign.banner.ctaHref}#mission`}
              className="text-sm text-charity hover:text-ink transition-colors text-center"
            >
              Learn More →
            </Link>
          </div>

        </div>
      </div>
    </section>
  )
}
```

---

## 📄 FILE UPDATES

### 1. Update `app/page.tsx`

**Changes:**
- Import DesignForGoodBanner component
- Add DFG banner below pricing section
- **NO pricing swap needed** - BrandedPricingSection is campaign-aware

```tsx
import dynamic from 'next/dynamic'
import Hero from '@/components/Hero'
import LogoCarousel from '@/components/LogoCarousel'
import Services from '@/components/Services'
import WeBelieve from '@/components/WeBelieve'
import TeamCollective from '@/components/TeamCollective'
import PortfolioServer from '@/components/PortfolioServer'
import SingleTestimonial from '@/components/SingleTestimonial'
import BrandedPricingSection from '@/components/BrandedPricingSection'  // Now campaign-aware
import DesignForGoodBanner from '@/components/DesignForGoodBanner'  // NEW
import SingleProject from '@/components/SingleProject'
import Solutions from '@/components/Solutions'
import { PremiumCta } from '@/components/PremiumCta'
import { PremiumFaq } from '@/components/PremiumFaq'
import { PremiumDesignProcess } from '@/components/PremiumDesignProcess'
import Contact from '@/components/Contact'
import Footer from '@/components/Footer'

const Navigation = dynamic(() => import('@/components/Navigation'), {
  ssr: false
})

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navigation />

      <section id="hero">
        <Hero />
      </section>

      <LogoCarousel />

      <section id="services">
        <Services />
      </section>

      <section id="we-believe">
        <WeBelieve />
      </section>

      <section id="team">
        <TeamCollective />
      </section>

      <section id="portfolio">
        <PortfolioServer />
      </section>

      <section id="process">
        <PremiumDesignProcess />
      </section>

      <section id="testimonial">
        <SingleTestimonial />
      </section>

      {/* Pricing Section - Campaign-aware, Business tier transforms during campaign */}
      <section id="pricing">
        <BrandedPricingSection />
      </section>

      {/* Design for Good Banner - Only shows during DFG campaign */}
      <DesignForGoodBanner />

      <section id="single-project">
        <SingleProject />
      </section>

      <section id="solutions">
        <Solutions />
      </section>

      <section id="cta">
        <PremiumCta />
      </section>

      <section id="faq">
        <PremiumFaq />
      </section>

      <section id="contact">
        <Contact />
      </section>

      <Footer />
    </main>
  )
}
```

---

### 2. Update `app/layout.tsx`

**Changes:**
- Import StickyCountdownBanner
- Render above everything (including navigation)
- Add padding-top to body when banner is active

```tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import StickyCountdownBanner from '@/components/StickyCountdownBanner'  // NEW
import campaignData from '@/data/activeCampaign.json'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'DesignWorks - Strategic Design Partners',
  description: 'Strategic design partnerships for businesses ready to dominate their market.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Add top padding when banner is active
  const hasBanner = campaignData.active && campaignData[campaignData.active]?.enabled
  const bodyClass = hasBanner ? 'pt-[50px]' : ''  // Banner height

  return (
    <html lang="en">
      <body className={`${inter.className} ${bodyClass}`}>
        <StickyCountdownBanner />
        {children}
      </body>
    </html>
  )
}
```

---

### 3. Update `app/globals.css`

**Changes:**
- Add z-index utility for campaign banner
- Adjust navigation z-index if needed

```css
/* Add to existing utilities section */

/* Z-Index Layering System */
.z-60 {
  z-index: 60;  /* Campaign banner - above nav */
}

.nav-sticky {
  @apply fixed top-0 left-0 right-0 z-50 border-b border-mist/50 transition-all duration-base ease-premium;
}

/* Ensure toast notifications stay on top */
/* Already at z-100 in toast.tsx */
```

---

### 4. Create `/app/class-of-2025/page.tsx`

**New dedicated landing page with:**
- Dark hero with countdown
- Detailed cohort explanation
- Benefits breakdown
- Social proof / case studies
- Dark pricing variant (`<ClassOf2025Pricing variant="dark" />`)
- FAQ specific to campaign
- Application form or Calendly booking

**Structure:**
```tsx
import dynamic from 'next/dynamic'
import Footer from '@/components/Footer'
import ClassOf2025Pricing from '@/components/ClassOf2025Pricing'
import { PremiumFaq } from '@/components/PremiumFaq'
import Contact from '@/components/Contact'

const Navigation = dynamic(() => import('@/components/Navigation'), {
  ssr: false
})

export default function ClassOf2025Page() {
  return (
    <main className="min-h-screen bg-ink">
      <Navigation />

      {/* Dark Hero with Countdown */}
      <section className="section-padding bg-ink text-white">
        <div className="container-premium text-center">
          <p className="mb-4 font-medium text-flame text-sm tracking-[0.1em] uppercase">
            Limited Opportunity
          </p>
          <h1 className="text-hero font-light tracking-[-0.03em] text-white mb-6">
            Class of 2025:<br />
            10 Companies Who'll<br />
            Dominate Next Year
          </h1>
          <p className="text-xl font-light text-pearl/80 leading-[1.6] max-w-3xl mx-auto mb-12">
            Lock in £999/month through December 2025. Strategic design partnership
            for businesses ready to lead their market.
          </p>
          {/* Countdown here */}
        </div>
      </section>

      {/* Why This Matters */}
      <section className="section-padding bg-smoke text-white">
        {/* Content about cohort model, urgency, value... */}
      </section>

      {/* Dark Pricing */}
      <ClassOf2025Pricing variant="dark" />

      {/* FAQ */}
      <section className="bg-ink">
        <PremiumFaq />
      </section>

      {/* Contact/Application */}
      <Contact />

      <Footer />
    </main>
  )
}
```

---

## 🎨 Z-INDEX LAYERING SYSTEM

### Current Z-Index Usage
- **Toast notifications:** `z-100` (highest priority)
- **Navigation:** `z-50` (sticky, always visible)
- **Navigation menu (Radix UI):** `z-[1]` (dropdown menus)
- **Background elements:** `z-0` (Hero, DFG animation)

### New Z-Index Assignment
- **Campaign Banner:** `z-60` (above nav, below toast)

**Why z-60?**
- ✅ Above navigation (z-50) - banner appears above nav
- ✅ Below toast (z-100) - important notifications still show
- ✅ Leaves room (z-70-90) for future modals/overlays

**Visual Layering:**
```
z-100: Toast notifications (highest)
z-60:  Campaign banner ← NEW
z-50:  Navigation
z-1:   Dropdown menus
z-0:   Page content
```

---

## 🎯 IMPLEMENTATION CHECKLIST

### Phase 1: Core Setup ✓
- [x] Phase 0 verification complete
- [x] Architecture refined with sticky banner approach
- [x] Testimonials verified (authentic)
- [x] Hero stats verified (legitimate)
- [x] Color tokens verified (all exist)
- [x] Z-index system audited

### Phase 2: Campaign Config System
- [ ] Create `data/activeCampaign.json` with full config
- [ ] Add TypeScript interface for campaign data
- [ ] Test JSON import in components

### Phase 3: Build Sticky Banner
- [ ] Create `StickyCountdownBanner.tsx`
- [ ] Add localStorage dismiss logic (24-hour memory)
- [ ] Test banner visibility toggle
- [ ] Test responsive design (mobile burger nav)
- [ ] Verify z-index layering (banner above nav)

### Phase 4: Build Countdown Timer
- [ ] Create `CountdownTimer.tsx` with two variants
- [ ] Implement inline variant (slim banner)
- [ ] Implement full variant (large display)
- [ ] Test countdown accuracy
- [ ] Test zero state (after deadline)

### Phase 5: Modify BrandedPricingSection (Campaign-Aware)
- [ ] Import `activeCampaign.json` in `BrandedPricingSection.tsx`
- [ ] Add campaign detection logic (`isCampaignActive`)
- [ ] Add Business tier transformation logic
- [ ] Apply dark styling (bg-smoke) to Business tier during campaign
- [ ] Replace "MOST POPULAR" badge with "CLASS OF 2025 - X SPOTS LEFT"
- [ ] Show campaign price (£999) with strikethrough original (£1,449)
- [ ] Add "Locked rate through Dec 2025" to Business features
- [ ] Change Business CTA to link to `/class-of-2025`
- [ ] Test tier transformation (Essential/Enterprise unchanged)
- [ ] Test responsive design for dark Business card

### Phase 6: Build DFG Banner
- [ ] Create `DesignForGoodBanner.tsx`
- [ ] Add conditional rendering logic
- [ ] Test placement below pricing
- [ ] Verify only shows during DFG campaign

### Phase 7: Integration
- [ ] Update `app/page.tsx` (add DFG banner import)
- [ ] Update `app/layout.tsx` (sticky banner, padding)
- [ ] Update `app/globals.css` (z-60 utility)
- [ ] Test banner + navigation interaction
- [ ] Verify sticky behavior on scroll
- [ ] Test Business tier transformation with campaign toggle

### Phase 8: Campaign Landing Page
- [ ] Create `app/class-of-2025/page.tsx`
- [ ] Build dark hero with countdown
- [ ] Add cohort explanation section
- [ ] Add dark pricing variant
- [ ] Add campaign-specific FAQ
- [ ] Add application form/contact

### Phase 9: Stripe Integration
- [ ] Create Stripe price ID for Class of 2025 (£999/mo)
- [ ] Create Stripe price ID for Design for Good (£1,499/mo)
- [ ] Update `activeCampaign.json` with real IDs
- [ ] Test checkout flow for campaign tiers

### Phase 10: Testing & Polish
- [ ] Test campaign toggle (switch between campaigns)
- [ ] Test banner dismiss (24-hour memory)
- [ ] Test countdown timer accuracy
- [ ] Test pricing conditional swap
- [ ] Test DFG banner visibility
- [ ] Test mobile responsive (banner + burger nav)
- [ ] Test z-index conflicts
- [ ] Test with real users
- [ ] Review copy for consistency

---

## 🎯 CAMPAIGN MANAGEMENT WORKFLOW

### To Launch Class of 2025 Campaign

1. **Update campaign config:**
   ```json
   // data/activeCampaign.json
   {
     "active": "classOf2025",
     "classOf2025": {
       "enabled": true,
       "spotsRemaining": 10,
       "deadline": "2025-12-31T23:59:59Z"
     }
   }
   ```

2. **Create Stripe product:**
   - Price: £999/month
   - Copy price ID to config

3. **Deploy:**
   - Push to Git
   - Deploy to production
   - Verify banner appears
   - Test countdown timer

4. **As spots fill:**
   - Decrement `spotsRemaining` in config
   - Redeploy

5. **When campaign ends:**
   - Set `active: null` in config
   - Banner disappears automatically
   - Pricing reverts to standard

### To Launch Design for Good Campaign

1. **Update campaign config:**
   ```json
   {
     "active": "designForGood",
     "designForGood": {
       "enabled": true,
       "spotsRemaining": 10
     }
   }
   ```

2. **DFG banner appears below pricing**
3. **Sticky banner shows DFG countdown**
4. **Pricing remains standard (or swap to DFG-specific variant)**

---

## 📱 MOBILE CONSIDERATIONS

### Sticky Banner + Navigation
- **Desktop:** Banner at top, nav below, both sticky
- **Mobile:** Banner at top (~50px), burger nav below (~60px)
- **Total top offset:** ~110px on mobile
- **Solution:** Use `scroll-margin-top` on section anchors to account for both

### Banner Close Button
- **Desktop:** Full text + countdown visible
- **Mobile:** Abbreviated text, countdown hidden, close button prominent
- **Dismissal:** Same 24-hour localStorage logic

### Pricing Section
- **Desktop:** 3 columns side-by-side
- **Mobile:** Stacked vertically, featured tier (Class of 2025) first

### DFG Banner
- **Desktop:** Horizontal layout (icon | content | CTA)
- **Mobile:** Vertical stack (icon top, content center, CTA bottom)

---

## 🚀 WHAT THIS ACHIEVES

### ✅ Maximum Urgency
- Sticky banner creates constant FOMO
- Countdown always visible (can't be ignored)
- Spot count decreases as campaign progresses

### ✅ Minimal Disruption
- Slim banner doesn't overwhelm page
- Dismissible with 24-hour memory (respects user)
- Existing page flow stays intact
- Just swap pricing section during campaign

### ✅ Easy Management
- Single JSON file controls everything
- Manual spot updates (simple, no backend needed)
- Switch campaigns by changing one field
- Turn off by setting `active: null`

### ✅ Flexible & Scalable
- Same system works for any future campaign
- Can run Class of 2025 this year, Class of 2026 next year
- DFG campaign can run independently
- A/B test different banner messaging

### ✅ Professional UX
- Non-intrusive but effective
- Mobile-friendly (banner + burger nav)
- Respects user choice (dismissible)
- Clean design matches existing aesthetic

---

## 🎨 DESIGN SPECIFICATIONS

### Sticky Banner
- **Height:** 50-60px
- **Background (Class of 2025):** `bg-ink` (#0A0A0A)
- **Background (DFG):** `bg-sage` (#E8F0EC)
- **Text (Class of 2025):** `text-white`
- **Text (DFG):** `text-ink`
- **Accent:** `text-flame` (#FF6B35)
- **Border:** `border-b border-flame/20` or `border-charity/20`
- **CTA Button:** `bg-flame hover:bg-ember` (#FF6B35 → #E5502C)

### Campaign Pricing (Light Variant)
- **Background:** `bg-pearl` (#FAFAFA)
- **Cards:** `bg-white border border-mist`
- **Featured card:** `border-2 border-flame`
- **Badge:** `bg-flame text-white`

### Campaign Pricing (Dark Variant)
- **Background:** `bg-ink` (#0A0A0A)
- **Cards:** `bg-smoke border border-white/10`
- **Featured card:** `border-2 border-flame`
- **Text:** `text-white`

### DFG Banner
- **Background:** `bg-sage` (#E8F0EC)
- **Icon background:** `bg-charity` (#16a34a)
- **Text:** `text-ink`
- **CTA:** `bg-ink hover:bg-charity`

---

## 💡 FUTURE ENHANCEMENTS

### Phase 11+ (Post-Launch)
- [ ] Add email capture for waitlist when spots full
- [ ] Track banner impressions/conversions in analytics
- [ ] A/B test banner messaging
- [ ] Auto-sync spot count with Stripe subscriptions
- [ ] Add "Sold Out" state when spots reach zero
- [ ] Create admin dashboard for campaign management
- [ ] Add animation/pulse effect to countdown in final hours
- [ ] Create campaign performance reports

---

## 📝 TESTIMONIALS EXPANSION (FUTURE)

### Current State ✅
- Component: `SingleTestimonial`
- Data: [data/testimonials.json](../data/testimonials.json)
- Status: Using authentic client feedback

### When Adding New Testimonials
1. Get written permission from client
2. Verify authenticity of quote and attribution
3. Add to data file with real details
4. Optional: Add client logo to LogoCarousel

### Guidelines
- ✅ Only use testimonials with written permission
- ✅ Verify all company names and titles
- ✅ Use real client names (no generic names)
- ✅ Include specific results when possible
- ❌ Never fabricate or embellish
- ❌ Don't use stock photos

---

## 🎯 BOTTOM LINE

### What You Get
✅ **Persistent urgency** - Sticky banner with countdown
✅ **Scarcity messaging** - "X spots left" always visible
✅ **Non-intrusive UX** - Dismissible, slim, respects user
✅ **Easy management** - One JSON file controls campaigns
✅ **Flexible campaigns** - Switch between Class of 2025 / DFG
✅ **Mobile-friendly** - Works with burger navigation
✅ **Clean integration** - Doesn't disrupt existing flow

### Changes Required
1. Create 1 config file (`activeCampaign.json`)
2. Create 3 new components (sticky banner, countdown timer, DFG banner)
3. **Modify 1 existing component** (`BrandedPricingSection` - add campaign awareness)
4. Update 3 files (`page.tsx`, `layout.tsx`, `globals.css`)
5. Create 1 campaign page (`/class-of-2025`)
6. Add 1 z-index utility (z-60)

### What's Already Done
✅ Hero stats verified (legitimate)
✅ Testimonials verified (authentic)
✅ Design for Good page exists
✅ Pricing structure ready
✅ Color system complete
✅ Z-index audit complete

---

## 🚀 READY TO BUILD

**Next Steps:**
1. Review this complete plan
2. Confirm architecture decisions
3. Proceed with Phase 2: Campaign Config System

**Questions Before Starting?**
- Campaign deadline dates?
- Initial spot counts?
- Stripe price IDs (or create during implementation)?
- Any copy/messaging adjustments?

**When you're ready, we'll start with Phase 2: Building the campaign config system!**
