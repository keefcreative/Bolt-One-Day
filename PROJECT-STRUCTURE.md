# DesignWorks Bureau - Project Structure

```
Bolt-One-Day/                                    # Project root directory
├── .bolt/                                       # Bolt.new configuration
│   ├── config.json
│   ├── ignore
│   └── prompt
├── .claude/                                     # Claude Code settings
│   └── settings.local.json
├── .next/                                       # Next.js build output (auto-generated)
│   ├── cache/                                   # Build cache & optimized images
│   ├── server/                                  # Server-side build files
│   ├── static/                                  # Static assets & chunks
│   └── types/                                   # TypeScript definitions
├── app/                                         # Next.js 13 App Router
│   ├── api/                                     # API Routes
│   │   ├── brevo-conversations-webhook/         # ✨ Enhanced Brevo chat webhooks
│   │   │   └── route.ts
│   │   ├── contact/                             # Contact form API
│   │   │   └── route.ts
│   │   ├── stripe/                              # Stripe payment API
│   │   │   └── route.ts
│   │   ├── stripe-webhook/                      # Stripe webhook handler
│   │   │   └── route.ts
│   │   ├── test-brevo/                          # Brevo integration testing
│   │   │   └── route.ts
│   │   ├── test-stripe/                         # Stripe integration testing
│   │   │   └── route.ts
│   │   └── test-trello/                         # Trello integration testing (legacy)
│   │       └── route.ts
│   ├── cookie-policy/                           # Legal pages
│   │   └── page.tsx
│   ├── design-for-good/                         # Non-profit design services page
│   │   └── page.tsx
│   ├── privacy-policy/
│   │   └── page.tsx
│   ├── terms-of-service/
│   │   └── page.tsx
│   ├── globals.css                              # Global styles
│   ├── layout.tsx                               # ✨ Root layout with Brevo chat widget
│   ├── not-found.tsx                            # 404 page
│   └── page.tsx                                 # Homepage
├── components/                                  # React components
│   ├── designForGood/                           # Non-profit specific components
│   │   ├── DesignForGoodAdvantage.tsx
│   │   ├── DesignForGoodAnimation.tsx
│   │   ├── DesignForGoodComparison.tsx
│   │   ├── DesignForGoodFaq.tsx
│   │   ├── DesignForGoodFinalCta.tsx
│   │   ├── DesignForGoodFounder.tsx
│   │   ├── DesignForGoodHero.tsx
│   │   ├── DesignForGoodMission.tsx
│   │   ├── DesignForGoodPricing.tsx
│   │   ├── DesignForGoodProblems.tsx
│   │   └── DesignForGoodProcess.tsx
│   ├── legal/                                   # Legal page components
│   │   └── LegalPageLayout.tsx
│   ├── ui/                                      # shadcn/ui component library
│   │   ├── accordion.tsx
│   │   ├── alert-dialog.tsx
│   │   ├── [40+ UI components...]
│   │   └── tooltip.tsx
│   ├── BrandedPricingSection.tsx                # Main page components
│   ├── Contact.tsx                              # Contact form with Brevo integration
│   ├── Footer.tsx
│   ├── Hero-anime-background.tsx                # Alternative hero component
│   ├── Hero.tsx
│   ├── LogoCarousel.tsx
│   ├── Navigation.tsx
│   ├── Portfolio-OLD-BACKUP.tsx                 # Backup of old portfolio
│   ├── PortfolioClient.tsx                      # Portfolio client-side logic
│   ├── PortfolioModal.tsx                       # Portfolio modal viewer
│   ├── PortfolioServer.tsx                      # Portfolio server component
│   ├── PremiumCta.tsx
│   ├── PremiumDesignProcess.tsx
│   ├── PremiumFaq.tsx
│   ├── Process.tsx
│   ├── Services.tsx
│   ├── SingleProject.tsx
│   ├── Solutions.tsx
│   ├── Team.tsx
│   ├── Testimonials.tsx
│   └── WeBelieve.tsx
├── data/                                        # JSON data files for content
│   ├── designForGood/                           # Non-profit page data
│   │   ├── advantage.json
│   │   ├── comparison.json
│   │   ├── faq.json
│   │   ├── finalCta.json
│   │   ├── founder.json
│   │   ├── hero.json
│   │   ├── mission.json
│   │   ├── pricing.json
│   │   ├── problems.json
│   │   └── process.json
│   ├── legal/                                   # Legal pages content
│   │   ├── cookie-policy.json
│   │   ├── privacy-policy.json
│   │   └── terms-of-service.json
│   ├── portfolio/                               # Portfolio project data
│   │   ├── projects/                            # Individual project files
│   │   │   ├── 2024-04-15_foodieapp-discovery.json
│   │   │   ├── 2024-05-01_healthhub-platform.json
│   │   │   ├── 2024-05-15_ecomarket-marketplace.json
│   │   │   ├── 2024-06-01_financeflow-dashboard.json
│   │   │   ├── 2024-06-15_artisan-studios-portfolio.json
│   │   │   ├── 2024-07-01_innovatetech-campaign.json
│   │   │   ├── 2024-07-15_bloom-beauty-ecommerce.json
│   │   │   └── 2024-08-01_techflow-rebrand.json
│   │   └── index-OLD-BACKUP.json
│   ├── brandedPricing.json                      # Pricing section data
│   ├── brevo-automation-config.json             # ✨ Brevo automation workflows
│   ├── contact.json                             # Contact page data
│   ├── hero.json                                # Hero section data
│   ├── logoCarousel.json                        # Logo carousel data
│   ├── navigation.json                          # Navigation menu data
│   ├── premiumCta.json                          # CTA section data
│   ├── premiumDesignProcess.json                # Design process data
│   ├── premiumFaq.json                          # FAQ data
│   ├── pricing.json                             # Legacy pricing data
│   ├── services.json                            # Services section data
│   ├── singleProject.json                       # Single project component data
│   ├── solutions.json                           # Solutions section data
│   ├── subscription_plans_rows.csv              # Subscription plans (CSV)
│   ├── team.json                                # Team section data
│   ├── testimonials.json                        # Testimonials data
│   └── weBelieve.json                           # We Believe section data
├── hooks/                                       # Custom React hooks
│   ├── use-toast.ts                             # Toast notification hook
│   └── useScrollSpy.ts                          # Navigation scroll spy hook
├── lib/                                         # Utility libraries
│   ├── brevo.ts                                 # ✨ Enhanced Brevo CRM integration
│   ├── portfolioLoader.ts                       # Dynamic portfolio loading
│   ├── stripe.ts                                # Stripe payment integration
│   ├── trello.ts                                # Legacy Trello integration
│   └── utils.ts                                 # General utility functions
├── public/                                      # Static assets
│   └── images/                                  # Image assets
│       ├── design-for-good/                     # Non-profit page images
│       │   ├── after-image.jpg
│       │   └── before-image.jpg
│       ├── founders/                            # Team founder images
│       │   └── keith-hodgetts.jpg
│       ├── logos/                               # Company logos for carousel
│       │   ├── amazon.png
│       │   ├── apple.png
│       │   ├── google.png
│       │   ├── meta.png
│       │   ├── microsoft.png
│       │   ├── netflix.png
│       │   ├── spotify.png
│       │   └── tesla.png
│       ├── portfolio/                           # Portfolio project images
│       │   ├── [project-folders]/               # Individual project image sets
│       │   │   └── [01-04-project-images.jpg]
│       │   └── [project-hero-images.jpg]        # Main project images
│       ├── team/                                # Team member photos
│       │   ├── emma-rodriguez.jpg
│       │   ├── lisa-thompson.jpg
│       │   ├── marcus-chen.jpg
│       │   └── sarah-mitchell.jpg
│       ├── testimonials/                        # Client testimonial photos
│       │   ├── james-wilson.jpg
│       │   └── sarah-johnson.jpg
│       └── premium-cta-background.jpg           # CTA section background
├── .env.example                                 # Environment variables template
├── .env.local                                   # Local environment variables (not in git)
├── .eslintrc.json                               # ESLint configuration
├── .gitignore                                   # Git ignore rules
├── BREVO-ADVANCED-CLIENT-ACQUISITION-GUIDE.md  # ✨ Comprehensive marketing automation guide
├── BREVO-SETUP-GUIDE.md                        # ✨ Brevo integration setup instructions
├── CLAUDE.md                                    # Claude Code project instructions
├── DEPLOYMENT-GUIDE.md                          # ✨ Production deployment guide
├── DEPLOYMENT-TODO.md                           # ✨ Deployment checklist
├── PRD-Email-Template-System.md                # Email template system requirements
├── animated_logotype.html                       # Test files and demos
├── components.json                              # shadcn/ui configuration
├── creative-report.html
├── email.html
├── next-env.d.ts                                # Next.js TypeScript definitions
├── next.config.js                               # Next.js configuration
├── package-lock.json                            # Dependency lock file
├── package.json                                 # Node.js dependencies & scripts
├── postcss.config.js                            # PostCSS configuration
├── tailwind.config.ts                           # ✨ Tailwind CSS config with premium design system
├── trello-status-email-outlook.html             # Legacy email templates
├── trello-status-email.html
└── tsconfig.json                                # TypeScript configuration
```

## Key Features & Architecture

### 🎯 **Core Technology Stack**
- **Framework**: Next.js 13.5 with App Router
- **UI Components**: Radix UI primitives via shadcn/ui
- **Styling**: Tailwind CSS with custom premium design system
- **Forms**: React Hook Form with Zod validation
- **Type Safety**: Full TypeScript implementation

### 🚀 **Enhanced Integrations**
- **Brevo CRM**: Native chat widget + advanced automation
- **Stripe**: Payment processing + webhook handling  
- **Portfolio System**: Dynamic project loading from JSON
- **Contact Management**: Multi-channel lead capture & nurturing

### 🎨 **Design System**
- **Colors**: Custom premium palette (ink, smoke, flame, pearl, etc.)
- **Typography**: Responsive font scales (hero, display, section)
- **Sharp Edges**: No border-radius for modern aesthetic
- **Animations**: Custom fade-in variants and reveals

### 📊 **Data Architecture**
- **JSON-Driven Content**: All content managed via JSON files
- **Dynamic Portfolio**: Automatically loads projects from `/data/portfolio/projects/`
- **Modular Components**: Each section has corresponding data file
- **Type-Safe Data**: TypeScript interfaces for all data structures

### 🔧 **Development Features**
- **Hot Reloading**: Next.js development server
- **Code Quality**: ESLint + TypeScript strict mode
- **Path Aliases**: `@/*` for clean imports
- **Environment Variables**: Comprehensive `.env` setup

### 📈 **Business Logic**
- **Lead Scoring**: Behavioral tracking and qualification
- **Multi-Channel Follow-up**: Email + SMS + Chat integration
- **Client Journey Mapping**: From visitor to customer
- **Analytics Integration**: Conversion tracking and optimization

### ✨ **Recent Enhancements**
- **Native Brevo Chat**: Replaced custom chatbot with Brevo's widget
- **Advanced Webhooks**: Real-time conversation tracking
- **Marketing Automation**: 4-phase client acquisition system
- **Deployment Ready**: Comprehensive Vercel deployment guides

This structure supports a complete design agency website with advanced marketing automation, lead generation, and client acquisition capabilities.