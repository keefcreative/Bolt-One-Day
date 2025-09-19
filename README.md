# Bolt-One-Day: Next.js Design Agency Website

A premium Next.js 13.5 design agency website featuring a comprehensive content improvement system and two main sections: a main landing page for premium design subscription services and a dedicated "Design for Good" offering for non-profits.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Content Improvement System](#content-improvement-system)
- [Quick Start](#quick-start)
- [Available Commands](#available-commands)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Configuration](#configuration)
- [Documentation](#documentation)

## Overview

This project combines a modern Next.js website with an integrated AI-powered content improvement system. The website serves two primary audiences:

1. **Main Landing Page**: Premium design subscription service for startups and businesses
2. **Design for Good**: Specialized non-profit design services with discounted pricing

The integrated content system automatically analyzes, improves, and maintains content quality across the entire website using AI-powered workflows.

## Features

### Website Features
- **Modern Design System**: Custom Tailwind CSS with sharp edges aesthetic
- **Responsive Design**: Optimized for all devices and screen sizes
- **Premium Components**: Built with Radix UI and shadcn/ui
- **Performance Optimized**: Next.js 13.5 with App Router
- **SEO Ready**: Comprehensive meta tags and structured data
- **Form Handling**: React Hook Form with Zod validation
- **Payment Integration**: Stripe for subscription management
- **CRM Integration**: Brevo for lead management and email marketing

### Content System Features
- **Automated Content Analysis**: AI-powered quality assessment
- **Brand Voice Consistency**: Maintains consistent tone across all content
- **Interactive Review Dashboard**: Web-based approval workflow
- **Safe Implementation**: Automatic backups and rollback capabilities
- **Quality Scoring**: Comprehensive content quality metrics
- **SEO Optimization**: Content optimization for search engines

## Content Improvement System

### Quick Overview

The Content Improvement System is an integrated AI-powered platform that:
- Analyzes all website content for quality and consistency
- Generates AI-powered improvements using OpenAI GPT models
- Provides an interactive review dashboard for approval
- Safely applies changes with automatic backups
- Tracks quality improvements over time

### System Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Next.js App   │◄──►│ Integration API │◄──►│ Content System  │
│  (Main Site)    │    │   (/api/content)│    │ (AI Processor)  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  Data Layer     │    │ Status Tracking │    │ Review Dashboard│
│ (JSON Files)    │    │  & Monitoring   │    │  & Approval     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Quick Start with Content System

```bash
# 1. Install and setup
npm install
cd content-improver && npm install

# 2. Configure environment
cp .env.example .env.local
# Add your OPENAI_API_KEY to .env.local

# 3. Run the content system
cd content-improver
npm run content  # Interactive dashboard

# Or run automated workflow
npm run workflow  # Complete automated process
```

### Content System Commands

```bash
# Analysis
npm run analyze:all          # Analyze all content files
npm run status               # Check system status

# AI Improvements
npm run improve:pending      # Generate AI improvements
npm run review               # Open review dashboard

# Implementation
npm run implement:approved   # Apply approved changes
npm run history              # View change history

# Complete Workflow
npm run workflow             # Run full automated process
npm run workflow:continue    # Continue from last step
```

## Quick Start

### Prerequisites
- Node.js 18+ 
- npm 8+
- OpenAI API key (for content system)

### Installation

1. **Clone and Install**
```bash
git clone <repository-url>
cd Bolt-One-Day
npm install
```

2. **Environment Setup**
```bash
# Copy environment template
cp .env.example .env.local

# Add required variables
OPENAI_API_KEY=your_openai_api_key_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_key
STRIPE_SECRET_KEY=your_stripe_secret
BREVO_API_KEY=your_brevo_key
```

3. **Content System Setup**
```bash
cd content-improver
npm install
npm test  # Verify installation
```

4. **Start Development**
```bash
# Main application
npm run dev

# Content system (separate terminal)
cd content-improver
npm run status
```

## Available Commands

### Main Application
```bash
npm run dev           # Start development server (localhost:3000)
npm run build         # Build production bundle
npm run start         # Start production server
npm run lint          # Run ESLint
npm run type-check    # TypeScript compilation check
```

### Content Improvement System
```bash
# Interactive Mode
npm run content       # Interactive CLI dashboard

# Analysis & Status
npm run status        # Current workflow status
npm run analyze:all   # Analyze all content files
npm run next          # Show next recommended action

# AI Processing
npm run improve:pending    # Generate AI improvements
npm run improve:assistant  # Use OpenAI Assistant mode

# Review & Approval
npm run review            # Open web review dashboard
npm run dashboard         # Open content dashboard

# Implementation
npm run implement         # Apply specific changes
npm run implement:approved # Apply all approved changes
npm run rollback          # Rollback recent changes

# Workflow Automation
npm run workflow          # Complete automated workflow
npm run workflow:continue # Continue from last step

# Utilities
npm run history      # View change history
npm run clean        # Clean generated files
npm run reset        # Reset workflow status
npm run help         # Show all available commands
```

## Tech Stack

### Frontend & Backend
- **Framework**: Next.js 13.5 with App Router
- **Language**: TypeScript with strict mode
- **Styling**: Tailwind CSS with custom design system
- **Components**: Radix UI primitives with shadcn/ui
- **Forms**: React Hook Form with Zod validation
- **State Management**: React Context and hooks

### Content System
- **AI Processing**: OpenAI GPT-4 for content improvements
- **Analysis Engine**: Custom brand voice validation
- **Workflow Management**: Node.js with ES modules
- **Review Interface**: Web-based dashboard
- **Data Storage**: JSON files with automatic backups

### Integrations
- **Payments**: Stripe for subscription management
- **CRM**: Brevo for customer management and email marketing
- **Analytics**: Built-in content quality tracking

## Project Structure

```
/
├── app/                      # Next.js App Router
│   ├── api/
│   │   └── content/         # Content system API endpoints
│   ├── design-for-good/     # Non-profit section
│   └── page.tsx             # Main landing page
├── components/              # React components
│   ├── designForGood/      # Non-profit specific components
│   └── ui/                 # shadcn/ui components
├── content-improver/       # AI Content System
│   ├── src/
│   │   ├── core/           # Workflow management
│   │   ├── analyzers/      # Content analysis
│   │   └── validators/     # Brand voice validation
│   ├── improvements/       # Generated improvements
│   └── reports/           # Analysis reports
├── data/                   # Content JSON files
├── docs/                   # System documentation
├── lib/                    # Utility libraries
│   ├── content-integration.ts # Content system bridge
│   └── shared-config.ts   # Configuration management
└── types/                  # TypeScript definitions
    └── content.ts         # Content system types
```

## Configuration

### Environment Variables

**Required:**
- `OPENAI_API_KEY` - For AI-powered content improvements
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Stripe payments
- `STRIPE_SECRET_KEY` - Stripe server-side operations
- `BREVO_API_KEY` - Customer management and emails

**Optional:**
- `CONTENT_SYSTEM_ENABLED=true` - Enable/disable content system
- `CONTENT_QUALITY_THRESHOLD=75` - Minimum content quality score
- `CONTENT_REVIEW_REQUIRED=true` - Require manual review
- `FREEPIK_API_KEY` - For image generation (optional)
- `REPLICATE_API_TOKEN` - For AI image generation (optional)

### Brand Voice Configuration

Customize your brand voice in `/content-improver/brand-voice-config.json`:

```json
{
  "brandName": "DesignWorks Bureau",
  "tone": {
    "professional": 8,
    "friendly": 9,
    "confident": 8
  },
  "vocabulary": {
    "preferred": ["create", "build", "craft", "deliver"],
    "avoid": ["leverage", "synergy", "paradigm shift"]
  }
}
```

## Documentation

### Complete Documentation
- **[Content System Overview](docs/CONTENT_SYSTEM.md)** - Complete system overview and architecture
- **[User Guide](docs/USER_GUIDE.md)** - Step-by-step usage instructions
- **[API Reference](docs/API_REFERENCE.md)** - Complete API documentation
- **[Developer Guide](docs/DEVELOPER_GUIDE.md)** - Development and customization
- **[Configuration Guide](docs/CONFIGURATION.md)** - Environment and system configuration

### Project Documentation
- **[CLAUDE.md](CLAUDE.md)** - Claude Code integration instructions
- **[Deployment Guide](DEPLOYMENT-GUIDE.md)** - Production deployment
- **[Project Structure](PROJECT-STRUCTURE.md)** - Detailed project organization
- **[Brevo Setup](BREVO-SETUP-GUIDE.md)** - CRM integration setup

### Quick Reference

**Content System Health Check:**
```bash
cd content-improver
npm test && npm run status
```

**Full Content Workflow:**
```bash
cd content-improver
npm run workflow
```

**Emergency Rollback:**
```bash
cd content-improver
npm run history
npm run rollback --backup-id <id>
```

## Getting Help

1. **Check System Status**: `cd content-improver && npm run status`
2. **View Logs**: Check `content-improver/logs/` for detailed logs
3. **Test Configuration**: `cd content-improver && npm test`
4. **Interactive Help**: `cd content-improver && npm run help`

For detailed information, see the comprehensive documentation in the `/docs` directory.

## Development Workflow

1. **Start Development Servers**
```bash
# Terminal 1: Main application
npm run dev

# Terminal 2: Content system monitoring
cd content-improver && npm run status
```

2. **Content Improvement Cycle**
```bash
# Analyze current content
npm run analyze:all

# Generate improvements
npm run improve:pending

# Review and approve
npm run review

# Apply approved changes
npm run implement:approved
```

3. **Quality Assurance**
```bash
# Check content quality
npm run status

# Validate changes
npm run history

# Monitor metrics
open content-improver/reports/analysis.html
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test with `npm test` and `npm run type-check`
5. Run content analysis if modifying content
6. Submit a pull request

## License

Proprietary - DesignWorks Bureau

---

**Built with ❤️ by DesignWorks Bureau**

*For more information about the integrated content improvement system, see the [complete documentation](docs/CONTENT_SYSTEM.md).*