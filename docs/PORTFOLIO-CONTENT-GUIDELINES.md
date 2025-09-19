# Portfolio Content Guidelines

## Overview
This document defines the content structure and limits for portfolio projects to ensure consistent display across bento cards and modal views.

## Schema Structure

### Required Fields

| Field | Min | Max | Recommended | Notes |
|-------|-----|-----|-------------|-------|
| **title** | 1 | 50 chars | 35 chars | Project name |
| **briefDescription** | 80 chars | 120 chars | 100 chars | For bento cards |
| **description** | 150 chars | 300 chars | 200 chars | For modal view |
| **category** | 1 | 25 chars | 20 chars | E.g., "Brand Identity" |
| **client** | 1 | - | - | Company name |
| **year** | 4 digits | 4 digits | - | YYYY format |
| **duration** | 1 | - | - | E.g., "8 weeks" |
| **challenge** | 100 words | 250 words | 150 words | Problem statement |
| **solution** | 100 words | 250 words | 150 words | How we solved it |
| **results** | 3 items | 7 items | 5 items | Max 75 chars each |
| **tags** | 3 items | 10 items | 6 items | Service categories |
| **image** | Required | - | - | Main project image |

### Optional Fields

| Field | Min | Max | Recommended | Notes |
|-------|-----|-----|-------------|-------|
| **services** | 3 items | 8 items | 5 items | Specific services |
| **brandMessage** | 50 words | 100 words | 75 words | Key takeaway |
| **whatWeLearned** | 50 words | 100 words | 75 words | Project insights |
| **industry** | - | - | - | From enum list |
| **location** | - | - | - | Geographic location |
| **projectType** | - | - | - | From enum list |
| **testimonial** | - | - | - | Client feedback |
| **liveUrl** | - | - | - | Project website |
| **caseStudyUrl** | - | - | - | Detailed case study |

## Display Rules

### Bento Card Display
Cards show limited content to maintain clean design:

1. **Featured Card (Large)**
   - Title (full)
   - Brief description (80-120 chars)
   - Category
   - Tags: Maximum 5
   - Featured badge

2. **Medium Cards**
   - Title (full)
   - Brief description (80-120 chars)
   - Category
   - Tags: Maximum 3

3. **Small Cards**
   - Title (full)
   - Brief description (80-120 chars)
   - Category
   - Tags: Maximum 2

### Modal Display
The modal shows comprehensive project details:

- Full description (150-300 chars)
- All metadata fields
- Complete challenge & solution (100-250 words each)
- All results (3-7 items)
- All tags/services
- Optional fields (if present)
- Image gallery with auto-cycling

## Content Writing Tips

### Brief Description (Card Display)
- Focus on the core deliverable
- Use action-oriented language
- Avoid technical jargon
- Example: "Complete brand transformation for tech consultancy with modern identity system."

### Full Description (Modal Display)
- Expand on the brief with context
- Include the impact or outcome
- Maintain professional tone
- Example: "Complete brand transformation for a leading tech consultancy, creating a modern identity that reflects their innovative approach and expertise."

### Challenge Section
- Start with the client's situation
- Identify specific pain points
- Explain why change was needed
- Keep it relatable and clear
- 100-250 words

### Solution Section
- Describe your approach
- Highlight key deliverables
- Explain strategic decisions
- Focus on value provided
- 100-250 words

### Results
- Use quantifiable metrics when possible
- Mix hard numbers with qualitative outcomes
- Keep each point concise (max 75 chars)
- Examples:
  - "40% increase in qualified leads"
  - "Featured in TechCrunch"
  - "Successfully positioned for Series B"

## File Naming Convention

Portfolio projects should follow this naming pattern:
```
YYYY-MM-DD_project-slug.json
```

Example: `2024-08-01_techflow-rebrand.json`

## Image Requirements

### Main Image
- Path: `/images/portfolio/[project-id].jpg`
- Recommended: 1600x1200px minimum
- Format: JPG, PNG, or WebP

### Gallery Images
- Path: `/images/portfolio/[project-id]/[image-name].jpg`
- Minimum: 4 images for modal gallery
- Auto-detected from folder

## Categories (Enum)
- Brand Identity
- Web Design
- Mobile App
- E-commerce
- Marketing Campaign
- Packaging
- Digital Product
- Print Design
- Brand Identity & Implementation
- Social Media
- Email Design

## Industries (Enum)
- Technology
- Retail
- Healthcare
- Finance
- Education
- Non-Profit
- Hospitality
- Construction
- Beauty & Wellness
- Food & Beverage
- Entertainment
- Real Estate
- Sports & Fitness
- Automotive
- Professional Services

## Project Types (Enum)
- Complete Brand System
- Rebrand
- Website Redesign
- New Product Launch
- Marketing Campaign
- Digital Transformation
- Visual Identity
- UX Design
- Content Strategy
- Packaging System

## Validation

Projects are automatically validated when loaded. The system will:
1. Check all required fields
2. Verify content limits
3. Auto-generate brief descriptions if missing
4. Truncate overlong content
5. Report warnings for non-optimal content

Use the validation report to ensure your content meets guidelines before publishing.

## Example Project JSON

```json
{
  "id": "techflow-rebrand",
  "title": "TechFlow Solutions Rebrand",
  "category": "Brand Identity",
  "briefDescription": "Complete brand transformation for tech consultancy with modern identity system.",
  "description": "Complete brand transformation for a leading tech consultancy, creating a modern identity that reflects their innovative approach and expertise.",
  "createdDate": "2024-08-01",
  "featured": true,
  "draft": false,
  "priority": 1,
  "image": "/images/portfolio/techflow-rebrand.jpg",
  "tags": ["Brand Identity", "Logo Design", "Guidelines", "Stationery", "Digital Assets"],
  "client": "TechFlow Solutions",
  "year": "2024",
  "duration": "8 weeks",
  "industry": "Technology",
  "location": "San Francisco, CA",
  "projectType": "Rebrand",
  "challenge": "TechFlow Solutions needed a complete brand overhaul to position themselves as a premium tech consultancy and attract enterprise clients. Their existing brand felt outdated and didn't communicate the innovation and reliability required in their competitive space.",
  "solution": "We developed a modern, tech-forward brand identity that communicates reliability and innovation. The new brand system includes a flexible logo system, comprehensive guidelines, and templates that scale across all touchpoints from business cards to large-scale presentations.",
  "results": [
    "40% increase in qualified enterprise leads",
    "25% higher close rate on sales calls",
    "Improved brand recognition in target market",
    "Successfully positioned for Series B funding"
  ],
  "services": [
    "Brand Strategy",
    "Logo Design",
    "Visual Identity System",
    "Brand Guidelines",
    "Collateral Design"
  ],
  "brandMessage": "A strong brand identity is more than aesthetics—it's a business tool that drives growth and positions companies for success in competitive markets.",
  "whatWeLearned": "Tech companies need brands that balance innovation with reliability. The key is creating flexible systems that can evolve with rapid business growth.",
  "liveUrl": "https://techflowsolutions.com",
  "images": [
    "/images/portfolio/techflow-rebrand/logo-variations.jpg",
    "/images/portfolio/techflow-rebrand/brand-guidelines.jpg",
    "/images/portfolio/techflow-rebrand/stationery-mockup.jpg",
    "/images/portfolio/techflow-rebrand/digital-applications.jpg"
  ]
}
```