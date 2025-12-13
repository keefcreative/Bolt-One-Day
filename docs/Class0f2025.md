THE STREAMLINED STRATEGY
Core Concept:
✅ Keep existing homepage (14 sections, current flow)
✅ Add two campaign banners (prominent, urgent)
✅ Fix critical trust issues (fake metrics, testimonials)
✅ Adjust positioning language (strategic vs commodity)
✅ Keep dedicated campaign pages (/class-of-2025, /design-for-good)
HOMEPAGE MODIFICATIONS (MINIMAL)
Current Structure:
1. Navigation
2. Hero
3. LogoCarousel
4. Services
5. WeBelieve
6. TeamCollective
7. PortfolioServer
8. PremiumDesignProcess
9. TestimonialsSimple
10. BrandedPricingSection
11. SingleProject
12. Solutions
13. PremiumCta
14. PremiumFaq
15. Contact
16. Footer
Proposed Modifications:
1. Insert Campaign Banners (NEW)
Insert AFTER Hero (position 3):
<Hero />

{/* Class of 2025 Campaign Banner */}
<ClassOf2025Banner />

{/* Design for Good Campaign Banner */}
<DesignForGoodBanner />

<LogoCarousel />
Why Here?
Immediately after hero (high visibility)
Before they scroll to services/portfolio
First call-to-action they encounter
Urgent messaging front and center
2. Fix Hero Data (Critical)
Current Issues (/data/hero.json):
"50+ Happy Clients" (fake)
"99% Client Happiness" (unverifiable)
Proposed Changes:
{
  "stats": [
    {
      "value": "5",
      "label": "Brands Transformed"
    },
    {
      "value": "100%",
      "label": "Client Retention"
    },
    {
      "value": "25+",
      "label": "Years Experience"
    }
  ]
}
Also Update:
Headline: Keep current OR adjust to emphasize strategy
Subheadline: Add strategic positioning language
CTA: Primary → "Join Class of 2025" | Secondary → "View Portfolio"
3. Fix Testimonials (Critical)
Options:
A) Remove TestimonialsSimple entirely (safest if testimonials are fake/suspicious)
B) Replace with real testimonials (if you have written permission)
C) Replace with "Class of 2024 Results" (outcome-focused, not quote-based)
Recommended: Option A for now (remove until you have real ones)
4. Update BrandedPricing Section
Add Class of 2025 as FIRST pricing tier:
<BrandedPricingSection 
  showClassOf2025={true}  // New prop
  showDesignForGood={true} // New prop
/>
Three tiers shown:
Class of 2025 (£999/month, locked, "6 spots left")
Standard (£2,499/month, current offering)
Design for Good (£1,499/month, nonprofit)
5. Minor Copy Adjustments
Services Section:
Keep current services
Add strategic language: "Strategy-backed [Service Name]"
Emphasize outcomes over deliverables where possible
WeBelieve Section:
Keep current content
Ensure it emphasizes experience + strategy (check if already does)
PremiumCta:
Update CTA text to reference campaigns
"Join Class of 2025" or "Start Your Strategic Transformation"
NEW COMPONENTS TO BUILD
1. ClassOf2025Banner Component
Location: /components/ClassOf2025Banner.tsx Design:
<section className="relative overflow-hidden bg-ink border-y border-flame/20">
  <div className="container-premium py-12">
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-8 items-center">
      
      {/* Left: Content */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <span className="text-xs font-medium tracking-[0.1em] uppercase text-flame">
            Limited Availability
          </span>
          <span className="text-xs text-white/60">
            • 6 spots remaining
          </span>
        </div>
        
        <h2 className="text-[2.5rem] font-light text-white mb-3 tracking-[-0.02em]">
          Class of 2025: 10 Companies Who'll Dominate Next Year
        </h2>
        
        <p className="text-lg font-light text-white/80 mb-6 max-w-2xl">
          Lock in £999/month through December 2025. Strategic design partnership 
          for businesses ready to lead their market.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <Link 
            href="/class-of-2025"
            className="btn-primary"
          >
            Apply for Class of 2025
            <ArrowRight className="w-5 h-5" />
          </Link>
          
          <Link 
            href="/class-of-2025#details"
            className="btn-ghost text-white"
          >
            Learn More
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
      
      {/* Right: Countdown Timer */}
      <div className="lg:border-l lg:border-white/10 lg:pl-12">
        <div className="text-white/60 text-xs uppercase tracking-wider mb-4 text-center">
          Offer Ends In
        </div>
        <CountdownTimer deadline="2025-12-31T23:59:59" />
      </div>
      
    </div>
  </div>
  
  {/* Decorative gradient */}
  <div className="absolute inset-0 bg-gradient-to-r from-flame/5 to-transparent pointer-events-none" />
</section>
Key Features:
Dark background (stands out from main site)
Countdown timer (urgency)
"6 spots remaining" (scarcity)
Clear CTAs (Apply vs Learn More)
Prominent but not overwhelming
2. DesignForGoodBanner Component
Location: /components/DesignForGoodBanner.tsx Design:
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
            • 8 nonprofit spots remaining
          </span>
        </div>
        
        <h2 className="text-[2rem] font-light text-ink mb-2 tracking-[-0.02em]">
          Strategic Design for Nonprofits Making Real Impact
        </h2>
        
        <p className="text-base font-light text-smoke/80 max-w-2xl">
          First year £1,499/month, then £1,999/month lifetime. 
          Annual cohort for 10 organizations ready to elevate their mission.
        </p>
      </div>
      
      {/* CTA */}
      <div className="flex flex-col gap-3">
        <Link 
          href="/design-for-good"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-ink text-white font-medium text-sm tracking-[0.05em] uppercase transition-all hover:bg-charity whitespace-nowrap"
        >
          Apply Now
          <ArrowRight className="w-4 h-4" />
        </Link>
        
        <Link 
          href="/design-for-good#mission"
          className="text-sm text-charity hover:text-ink transition-colors text-center"
        >
          Learn More →
        </Link>
      </div>
      
    </div>
  </div>
</section>
Key Features:
Light background with green accents (differentiates from Class of 2025)
Horizontal layout (less prominent than B2B banner)
Clear nonprofit positioning
"8 spots remaining" (separate count from B2B)
Direct link to /design-for-good page
3. CountdownTimer Component
Location: /components/CountdownTimer.tsx Design:
'use client'

import { useState, useEffect } from 'react'

export default function CountdownTimer({ deadline }: { deadline: string }) {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft())
  
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)
    
    return () => clearInterval(timer)
  }, [])
  
  function calculateTimeLeft() {
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
  
  return (
    <div className="flex gap-6 justify-center">
      <TimeUnit value={timeLeft.days} label="Days" />
      <TimeUnit value={timeLeft.hours} label="Hours" />
      <TimeUnit value={timeLeft.minutes} label="Mins" />
      <TimeUnit value={timeLeft.seconds} label="Secs" />
    </div>
  )
}

function TimeUnit({ value, label }: { value: number; label: string }) {
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
UPDATED PAGE STRUCTURE
app/page.tsx (Modified):
export default function Home() {
  return (
    <main className="min-h-screen">
      <Navigation />
      
      <section id="hero">
        <Hero />
      </section>
      
      {/* NEW: Campaign Banners */}
      <ClassOf2025Banner />
      <DesignForGoodBanner />
      
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
      
      {/* OPTIONAL: Remove or replace testimonials */}
      {/* <section id="testimonials">
        <TestimonialsSimple />
      </section> */}
      
      <section id="pricing">
        <BrandedPricingSection />
      </section>
      
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
DATA FILE UPDATES
1. /data/hero.json (Fix fake metrics)
{
  "hero": {
    "eyebrow": "Strategic Design Partners",
    "title": "Strategy First.<br />Design Second.<br />Results Always.",
    "subtitle": "Experience + Creative Strategy for brands that refuse to blend in",
    "description": "We don't just execute your vision—we help you see what's possible. Strategic design partnerships for businesses ready to dominate their market.",
    "stats": [
      {
        "value": "5",
        "label": "Brands Transformed"
      },
      {
        "value": "100%",
        "label": "Client Retention"
      },
      {
        "value": "25+",
        "label": "Years Experience"
      }
    ],
    "primaryCta": {
      "text": "Join Class of 2025",
      "href": "/class-of-2025"
    },
    "secondaryCta": {
      "text": "View Portfolio",
      "href": "#portfolio"
    }
  }
}
2. /data/brandedPricing.json (Add campaigns)
Add two new pricing tiers at the beginning:
{
  "pricing": {
    "eyebrow": "Investment Options",
    "title": "Choose Your Path",
    "tiers": [
      {
        "name": "Class of 2025",
        "tagline": "Limited Time Opportunity",
        "price": "£999",
        "period": "/month",
        "description": "Locked rate through December 2025. Annual cohort for 10 strategic partners.",
        "badge": "6 SPOTS LEFT",
        "features": [
          "Strategic design partnership",
          "Monthly strategy sessions",
          "Unlimited design requests",
          "Priority turnaround",
          "Locked pricing through Dec 2025"
        ],
        "cta": {
          "text": "Apply Now",
          "href": "/class-of-2025"
        },
        "featured": true
      },
      {
        "name": "Design for Good",
        "tagline": "For Nonprofits",
        "price": "£1,499",
        "period": "/month",
        "description": "First year rate. Then £1,999/month lifetime discount.",
        "badge": "8 SPOTS LEFT",
        "features": [
          "Strategic nonprofit design",
          "Fundraising & impact materials",
          "Monthly strategy sessions",
          "Grant application support",
          "Lifetime 20% discount"
        ],
        "cta": {
          "text": "Apply Now",
          "href": "/design-for-good"
        }
      },
      {
        "name": "Standard",
        "tagline": "Ongoing Partnership",
        "price": "£2,499",
        "period": "/month",
        "description": "Full strategic design partnership. No time limits, no commitments.",
        "features": [
          "Strategic design partnership",
          "Monthly strategy sessions",
          "Unlimited design requests",
          "Priority turnaround",
          "Pause or cancel anytime"
        ],
        "cta": {
          "text": "Get Started",
          "href": "#contact"
        }
      }
    ]
  }
}
3. /data/premiumCta.json (Update messaging)
{
  "cta": {
    "title": "Ready to Dominate 2025?",
    "description": "Join Class of 2025 and lock in strategic design partnership at £999/month through December 2025.",
    "primaryButton": {
      "text": "Apply for Class of 2025",
      "href": "/class-of-2025"
    },
    "secondaryButton": {
      "text": "View Standard Pricing",
      "href": "#pricing"
    },
    "urgency": "Only 6 spots remaining for 2025 cohort"
  }
}
CAMPAIGN PAGES (KEEP DEDICATED)
1. /class-of-2025/page.tsx (Create new)
Full B2B campaign page
Detailed explanation of cohort model
Application form
Countdown timer
Case studies
FAQ specific to campaign
2. /design-for-good/page.tsx (Fix existing)
Remove "founding members" language
Fix tone (professional, not slangy)
Add annual cohort positioning
Keep existing structure otherwise
Fix pricing messaging
VISUAL HIERARCHY
Homepage User Journey:
1. Land on homepage
   ↓
2. See hero (strategic positioning)
   ↓
3. Immediately see Class of 2025 banner ← URGENT, PROMINENT
   (Dark background, countdown, "6 spots left")
   ↓
4. See Design for Good banner ← SECONDARY
   (Light background, different audience)
   ↓
5. Continue scrolling existing content
   (Logo carousel, services, portfolio, etc.)
   ↓
6. Hit pricing section → See both campaigns again
   ↓
7. CTA section → Class of 2025 reinforcement
   ↓
8. FAQ → Address objections
   ↓
9. Contact
WHAT THIS ACHIEVES
✅ Minimal Disruption
Keeps your existing homepage flow
No major restructuring required
Just insert two banner components
Update a few data files
✅ Maximum Impact
Campaign visibility immediately after hero
Urgency front and center (countdown)
Clear differentiation (dark vs light banners)
Multiple touchpoints (banners + pricing + CTA)
✅ Flexible & Scalable
Can turn banners on/off with props
Can adjust messaging easily (data-driven)
Can run different campaigns each year
Can A/B test banner designs
✅ Maintains Current Conversion Path
Existing users still see familiar structure
Services, portfolio, process all intact
Just adds urgency layer on top
Dedicated campaign pages for deep dives
IMPLEMENTATION CHECKLIST
Phase 1: Critical Fixes (Do FIRST)
 Fix hero.json (remove fake metrics)
 Remove or replace testimonials
 Remove fake portfolio projects
Phase 2: Campaign Banners (Main Work)
 Create ClassOf2025Banner component
 Create DesignForGoodBanner component
 Create CountdownTimer component
 Insert banners in app/page.tsx
 Update brandedPricing.json
Phase 3: Campaign Pages
 Create /class-of-2025/page.tsx
 Fix /design-for-good (remove "founding members")
 Add application forms to both
Phase 4: Polish
 Update premiumCta.json
 Update navigation CTAs
 Test countdown timer
 Test responsive design
 Update FAQ if needed
BANNER PROMINENCE OPTIONS
If you want to control when/how banners show:
Option A: Always Show Both (Recommended)
<ClassOf2025Banner />
<DesignForGoodBanner />
Option B: Alternate Randomly
{Math.random() > 0.5 ? (
  <>
    <ClassOf2025Banner />
    <DesignForGoodBanner />
  </>
) : (
  <>
    <DesignForGoodBanner />
    <ClassOf2025Banner />
  </>
)}
Option C: Show Based on User Behavior
{/* Show Class of 2025 primarily, DFG secondary */}
<ClassOf2025Banner size="large" />
<DesignForGoodBanner size="compact" />
Option D: Feature One Campaign
{/* Only show Class of 2025 until 10 spots fill */}
<ClassOf2025Banner />
{/* Then switch to Design for Good */}
BOTTOM LINE
This approach:
✅ Keeps your current homepage intact
✅ Adds strategic campaign visibility
✅ Minimal code changes required
✅ Maximum conversion impact
✅ Easy to update/iterate
You get:
Urgency (countdown timers)
Scarcity ("X spots left")
Clear CTAs (Apply Now)
Multiple touchpoints (banner + pricing + CTA)
Flexible campaigns (can update yearly)
Changes required:
Create 3 new components (banners + countdown)
Fix 3 data files (hero, pricing, cta)
Remove testimonials section
Insert banners in homepage
Create/fix campaign pages