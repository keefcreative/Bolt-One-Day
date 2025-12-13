# DesignWorks Bureau Visual Style Guide

**Version 1.0** | Last Updated: November 2025

This comprehensive style guide documents the premium visual aesthetic and design system for DesignWorks Bureau. Use this guide to create emails, landing pages, and marketing materials that maintain brand consistency.

---

## Table of Contents

1. [Brand Philosophy](#brand-philosophy)
2. [Color System](#color-system)
3. [Typography](#typography)
4. [Spacing & Layout](#spacing--layout)
5. [UI Components](#ui-components)
6. [Buttons & CTAs](#buttons--ctas)
7. [Cards & Containers](#cards--containers)
8. [Navigation Patterns](#navigation-patterns)
9. [Animation & Motion](#animation--motion)
10. [Email Design Guidelines](#email-design-guidelines)
11. [Landing Page Patterns](#landing-page-patterns)
12. [Accessibility](#accessibility)

---

## Brand Philosophy

**Core Principle:** Premium minimalism with sharp edges and sophisticated restraint.

### Design Tenets
- **Sharp Geometry:** Zero border radius throughout—all corners are perfectly sharp
- **Light Typography:** Extensive use of light font weights (300) for elegance
- **Generous Whitespace:** Breathing room is a luxury feature
- **Subtle Interactions:** Smooth, refined transitions using our premium easing curve
- **Design-Conscious Details:** References to Golden Ratio, Rule of Thirds, and Swiss design principles

---

## Color System

### Primary Palette

#### Dark Neutrals
```
Ink      #0A0A0A    Main dark color, used for text and primary backgrounds
Smoke    #1A1A1A    Slightly lighter dark, for secondary elements
Ash      #2A2A2A    Card backgrounds on dark backgrounds
```

#### Light Neutrals
```
Pearl    #FAFAFA    Main page background color
Silk     #F5F5F5    Subtle secondary background
Mist     #E8E8E8    Borders and dividers
```

#### Accent Colors
```
Flame    #FF6B35    Primary brand color, CTAs, and accents
Ember    #E5502C    Hover state for flame
Coral    #FF8964    Lighter accent, success states
Whisper  #FFF9F7    Very light background tint
```

#### Special Purpose
```
Ocean    #16a34a    "Design For Good" variant (green)
Fog      #E8F0F2    Subtle ocean-related backgrounds
Sage     #E8F0EC    Subtle nature-related backgrounds
Charity  #16a34a    Charity/non-profit theme color
```

### Color Usage Guidelines

**Text Colors:**
- Primary text on light backgrounds: `ink` (#0A0A0A)
- Secondary text on light backgrounds: `#6b7280` (medium grey)
- Text on dark backgrounds: `white` or `pearl`
- Muted text on dark: `white/80` (80% opacity white)

**Background Colors:**
- Main page background: `pearl` (#FAFAFA)
- Card backgrounds: `white`
- Dark hero sections: `ink` with gradient to `smoke`
- Accent backgrounds: `whisper` (#FFF9F7)

**Interactive Elements:**
- Primary action: `flame` (#FF6B35)
- Hover state: `ember` (#E5502C) or `coral` (#FF8964)
- Links: Inherit text color, hover to `flame`
- Selection highlight: `flame` background with white text

### Color Combinations

**High Contrast (Preferred):**
- White background + Ink text + Flame accents
- Ink background + White text + Flame accents

**Medium Contrast:**
- Pearl background + Smoke text + Flame accents
- Silk background + Ash text + Coral accents

**Avoid:**
- Flame on coral (insufficient contrast)
- Mist text on Pearl (too low contrast)

---

## Typography

### Font Stacks

**Primary (Sans-serif):**
```css
font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", sans-serif;
```
Use for all body text, UI elements, and most headings.

**Secondary (Serif):**
```css
font-family: "Playfair Display", serif;
```
Use sparingly for elegant emphasis (imported via Google Fonts: weights 400, 500, 600, 700).

### Font Sizes & Hierarchy

#### Hero/Display Sizes
```css
Hero:        clamp(3.5rem, 5vw, 5.5rem)    /* 56-88px, responsive */
             line-height: 1.1
             letter-spacing: -0.02em

Display:     clamp(2.5rem, 4vw, 4.5rem)    /* 40-72px, responsive */
             line-height: 1.2
             letter-spacing: -0.015em

Section:     3.5rem (56px)
             line-height: 1.1
             letter-spacing: -0.02em

Subsection:  clamp(1.5rem, 2.5vw, 3rem)    /* 24-48px, responsive */
             line-height: 1.3
             letter-spacing: -0.015em
```

#### Body Sizes
```css
Large:       clamp(1.25rem, 2vw, 2.25rem)  /* 20-36px */
             line-height: 1.4
             letter-spacing: -0.01em

Body:        1rem (16px)
             line-height: 1.6
             letter-spacing: -0.01em

Stat:        2.5rem (40px)
             line-height: 1.2
             letter-spacing: -0.015em
```

#### Small Sizes
```css
Small:       0.875rem (14px)
             line-height: 1.5
             letter-spacing: 0.05em (for uppercase)

Eyebrow:     0.875rem (14px)
             font-weight: 500
             text-transform: uppercase
             letter-spacing: 0.1em
             color: flame
```

### Font Weights

```
Light:       300    Primary body text weight
Normal:      400    Emphasis within light text
Medium:      500    Buttons, labels, eyebrows
Semibold:    600    Rarely used, strong emphasis only
```

**Guidelines:**
- Use weight 300 as the default for all body text
- Reserve 500+ weights for CTAs, labels, and critical UI elements
- Never use bold (700) in body copy

### Letter Spacing

```
Headlines:    -0.02em to -0.015em    Tighter for impact
Body:         -0.01em               Slightly tighter than default
Buttons:      0.05em to 0.1em       Wider for uppercase text
Eyebrows:     0.1em                 Wide tracking for small caps
```

### Line Height

```
Headlines:    1.1 - 1.3             Tight for visual impact
Body:         1.6 - 1.8             Generous for readability
UI Elements:  1.4 - 1.5             Balanced for controls
```

### Typography Classes (Tailwind)

```css
/* Balanced text wrapping */
.headline-balanced {
  text-wrap: balance;
  leading-tight;
  tracking-tight;
  orphans: 2;
  widows: 2;
}

.body-balanced {
  text-wrap: pretty;
  leading-relaxed;
  orphans: 3;
  widows: 3;
}

.description-balanced {
  text-wrap: balance;
  orphans: 2;
  widows: 2;
}
```

### Character-Based Max Widths

```
prose-narrow:     30ch    Mobile/narrow content (30-40 chars/line)
prose-optimal:    65ch    Optimal readability (65-75 chars/line)
prose-wide:       80ch    Wider content (80 chars/line)
headline:         20ch    Headlines (prevent long single lines)
subhead:          40ch    Subheadings
description:      55ch    Short descriptions
```

### Typography Best Practices

1. **Always use negative letter spacing** on headlines and display text
2. **Use positive letter spacing** on uppercase text (buttons, labels, eyebrows)
3. **Set text-rendering to optimizeLegibility** for all text
4. **Enable font smoothing** with -webkit-font-smoothing: antialiased
5. **Balance headlines** using `text-wrap: balance` to prevent orphans
6. **Limit line length** using character-based max-widths, not pixel widths

---

## Spacing & Layout

### Container System

```css
.container-premium {
  width: 100%;
  max-width: 1600px;
  margin: 0 auto;
  padding-left: 2rem;   /* 32px */
  padding-right: 2rem;  /* 32px */
}

@media (min-width: 768px) {
  .container-premium {
    padding-left: 4rem;   /* 64px */
    padding-right: 4rem;  /* 64px */
  }
}
```

### Section Padding

```css
.section-padding {
  padding-top: 4rem;      /* 64px */
  padding-bottom: 4rem;   /* 64px */
}

@media (min-width: 768px) {
  .section-padding {
    padding-top: 6rem;    /* 96px */
    padding-bottom: 6rem; /* 96px */
  }
}

@media (min-width: 1024px) {
  .section-padding {
    padding-top: 8rem;    /* 128px */
    padding-bottom: 8rem; /* 128px */
  }
}
```

### Spacing Scale

Standard Tailwind spacing + custom premium increments:

```
4   = 1rem  = 16px
6   = 1.5rem = 24px
8   = 2rem   = 32px
12  = 3rem   = 48px
16  = 4rem   = 64px
18  = 4.5rem = 72px   [custom]
22  = 5.5rem = 88px   [custom]
24  = 6rem   = 96px
26  = 6.5rem = 104px  [custom]
30  = 7.5rem = 120px  [custom]
32  = 8rem   = 128px
34  = 8.5rem = 136px  [custom]
38  = 9.5rem = 152px  [custom]
```

### Grid Patterns

**Three Column Grid:**
```css
.services-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0;
}

@media (min-width: 768px) {
  .services-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .services-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

**Pricing Grid:**
```css
display: grid;
grid-template-columns: repeat(3, 1fr);
gap: 2rem;
max-width: 1400px;
margin: 0 auto;
```

### Layout Best Practices

1. **Generous vertical spacing** between sections (128px on desktop)
2. **Asymmetric layouts** preferred over centered grids
3. **Maximum content width** of 1600px for readability
4. **Optimal reading width** of 65ch for body text
5. **Subgrid alignment** for visual rhythm

---

## UI Components

### Borders

**Rule: All borders are 0 border-radius (sharp corners)**

```css
/* This is enforced globally */
border-radius: 0;
```

**Border Styles:**
```css
/* Standard borders */
border: 1px solid #E8E8E8;  /* mist */

/* Subtle borders on dark */
border: 1px solid rgba(255, 255, 255, 0.2);

/* Accent borders */
border: 2px solid #FF6B35;  /* flame */
border-left: 4px solid #FF6B35;  /* accent bar */

/* Bottom border separators */
border-bottom: 1px solid #E8E8E8;
```

### Shadows

```css
/* Premium shadow (default) */
box-shadow: 0 20px 60px rgba(0, 0, 0, 0.05);

/* Premium large shadow */
box-shadow: 0 30px 80px rgba(0, 0, 0, 0.06);

/* Card hover shadow */
box-shadow: 0 25px 50px rgba(0, 0, 0, 0.08);
```

**Usage:**
- Use shadows sparingly
- Prefer borders over shadows for definition
- Reserve shadows for hover states and elevation hierarchy

### Dividers

**Horizontal Rules:**
```html
<!-- Standard divider -->
<div class="h-px bg-mist"></div>

<!-- Gradient divider -->
<div class="h-px bg-gradient-to-r from-transparent via-mist to-transparent"></div>

<!-- Accent divider -->
<div class="w-10 h-px bg-flame mb-3"></div>

<!-- Dark background divider -->
<div class="h-px bg-pearl/20"></div>
```

### Icons

**Icon System:** Lucide React icons with consistent stroke width

```jsx
import { ArrowRight, Check, Star } from 'lucide-react';

<ArrowRight className="w-5 h-5" strokeWidth={1.2} />
<Check className="w-5 h-5" strokeWidth={1.2} />
```

**Guidelines:**
- Use `strokeWidth={1.2}` for refined appearance
- Icons should be `w-4 h-4` (small) or `w-5 h-5` (standard)
- Always include proper spacing (`gap-2` or `gap-3`)
- Match icon color to adjacent text

---

## Buttons & CTAs

### Primary Button

```html
<button class="btn-primary">
  Get Started
  <ArrowRight className="w-5 h-5" />
</button>
```

```css
.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 2rem;              /* 16px 32px */
  background-color: #0A0A0A;       /* ink */
  color: white;
  font-weight: 500;
  font-size: 0.875rem;             /* 14px */
  text-transform: uppercase;
  letter-spacing: 0.05em;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  border: none;
  border-radius: 0;
  cursor: pointer;
}

.btn-primary:hover {
  background-color: #FF6B35;       /* flame */
  transform: translateY(-2px);
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.08);
}
```

### Secondary Button

```html
<button class="btn-secondary">
  Learn More
</button>
```

```css
.btn-secondary {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
  background-color: transparent;
  color: #0A0A0A;                  /* ink */
  font-weight: 500;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border: 1px solid #0A0A0A;
  border-radius: 0;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  cursor: pointer;
}

.btn-secondary:hover {
  background-color: #0A0A0A;       /* ink */
  color: white;
}
```

### Flame Accent Button

```html
<button class="btn-flame">
  Book a Call
</button>
```

```css
.btn-flame {
  /* Same as btn-primary but with flame background */
  background-color: #FF6B35;       /* flame */
  color: white;
}

.btn-flame:hover {
  background-color: #E5502C;       /* ember */
}
```

### Button Sizing

```css
/* Standard */
padding: 1rem 2rem;                /* 16px 32px */

/* Large */
padding: 1.25rem 2.5rem;           /* 20px 40px */

/* Small */
padding: 0.75rem 1.5rem;           /* 12px 24px */
```

### Button Groups

```html
<div class="flex flex-col sm:flex-row gap-6">
  <button class="btn-primary">Primary Action</button>
  <button class="btn-secondary">Secondary Action</button>
</div>
```

**Guidelines:**
- Stack vertically on mobile (`flex-col`)
- Horizontal on tablet+ (`sm:flex-row`)
- Use `gap-6` (24px) between buttons
- Primary action always comes first

---

## Cards & Containers

### Premium Card

```html
<div class="card-premium">
  <!-- Card content -->
</div>
```

```css
.card-premium {
  background-color: white;
  border: 1px solid #E8E8E8;       /* mist */
  padding: 2rem;
  transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
  border-radius: 0;
}

.card-premium:hover {
  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.06);
  transform: translateY(-2px);
}
```

### Service Card (Borderless Grid)

```html
<div class="service-card">
  <h3>Service Title</h3>
  <p>Service description</p>
</div>
```

```css
.service-card {
  padding: 3rem;
  background-color: transparent;
  border-right: 1px solid #E8E8E8;
  border-bottom: 1px solid #E8E8E8;
  transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
  cursor: pointer;
}

.service-card:nth-child(3n) {
  border-right: 0;  /* Remove right border on every 3rd item */
}

.service-card:hover {
  background-color: #FAFAFA;      /* pearl */
  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.06);
  position: relative;
  z-index: 10;
}
```

### Pricing Card

```html
<div class="pricing-card">
  <!-- Optional popular badge -->
  <div class="popular-badge">
    <TrendingUp class="w-4 h-4" />
    Saves Most Time
  </div>

  <div class="text-center mb-8">
    <h4>Plan Name</h4>
    <p class="tagline">One-line tagline</p>
    <div class="price">
      <span class="amount">£4,995</span>
      <span class="period">/month</span>
    </div>
  </div>

  <!-- Features list -->
  <ul class="features-list">
    <li>
      <Check class="w-5 h-5" />
      <span>Feature description</span>
    </li>
  </ul>

  <button class="btn-primary w-full">Get Started</button>
</div>
```

```css
.pricing-card {
  position: relative;
  background: white;
  padding: 2rem;
  border: 1px solid rgba(107, 114, 128, 0.2);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  border-radius: 0;
}

.pricing-card.popular {
  border: 2px solid #FF6B35;
}

.popular-badge {
  position: absolute;
  top: -1rem;
  left: 50%;
  transform: translateX(-50%);
  background-color: #FF6B35;
  color: white;
  padding: 0.5rem 1.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  white-space: nowrap;
}
```

### Testimonial Card

```html
<div class="testimonial-card">
  <blockquote class="quote">
    "The testimonial text goes here..."
  </blockquote>
  <div class="author">
    <div class="name">Jane Doe</div>
    <div class="title">CEO, Company Name</div>
  </div>
</div>
```

```css
.testimonial-card {
  background: white;
  border: 1px solid #E8E8E8;
  padding: 2rem;
  border-radius: 0;
}

.quote {
  font-size: 1.125rem;
  font-weight: 300;
  line-height: 1.7;
  color: #2A2A2A;
  margin-bottom: 1.5rem;
}

.author .name {
  font-weight: 500;
  color: #0A0A0A;
  margin-bottom: 0.25rem;
}

.author .title {
  font-size: 0.875rem;
  font-weight: 300;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
```

---

## Navigation Patterns

### Primary Navigation

```html
<nav class="nav-sticky">
  <div class="container-premium">
    <div class="flex items-center justify-between">
      <!-- Logo -->
      <div class="brand">DesignWorks Bureau</div>

      <!-- Nav Links -->
      <div class="nav-links">
        <a href="#services" class="nav-link">Services</a>
        <a href="#portfolio" class="nav-link active">Portfolio</a>
        <a href="#pricing" class="nav-link">Pricing</a>
      </div>

      <!-- CTA Buttons -->
      <div class="nav-ctas">
        <button class="btn-primary">Design For Good</button>
        <button class="btn-flame">Book a Call</button>
      </div>
    </div>
  </div>

  <!-- Progress indicator -->
  <div class="progress-bar">
    <div class="progress-fill" style="width: 35%;"></div>
  </div>
</nav>
```

```css
.nav-sticky {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 50;
  background-color: rgba(250, 250, 250, 0.8);  /* pearl/80 */
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(232, 232, 232, 0.5);  /* mist/50 */
  padding: 1.5rem 0;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.nav-sticky.scrolled {
  padding: 1rem 0;
}

.nav-link {
  position: relative;
  color: #1A1A1A;                  /* smoke */
  font-weight: 300;
  transition: color 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.nav-link:hover,
.nav-link.active {
  color: #FF6B35;                  /* flame */
}

.nav-link.active::after {
  content: '';
  position: absolute;
  bottom: -0.5rem;
  left: 0;
  right: 0;
  height: 2px;
  background-color: #FF6B35;
  animation: underlineReveal 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.progress-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2px;
  background-color: rgba(232, 232, 232, 0.2);
}

.progress-fill {
  height: 100%;
  background-color: #FF6B35;       /* flame */
  transition: width 0.15s ease-out;
}
```

### Footer Navigation

```html
<footer class="bg-ink text-white section-padding">
  <div class="container-premium">
    <!-- Newsletter CTA -->
    <div class="newsletter-section">
      <h3>Stay Inspired with DesignWorks</h3>
      <p>Get weekly design tips delivered to your inbox.</p>
      <form class="newsletter-form">
        <input type="email" placeholder="Enter your email" />
        <button class="btn-flame">Subscribe</button>
      </form>
    </div>

    <!-- Footer Grid -->
    <div class="footer-grid">
      <!-- Brand column -->
      <div>
        <h4>DesignWorks Bureau</h4>
        <p>Brand description</p>
      </div>

      <!-- Link columns -->
      <div>
        <h5>Main Page</h5>
        <ul>
          <li><a href="#services">Services</a></li>
          <li><a href="#portfolio">Portfolio</a></li>
        </ul>
      </div>
    </div>
  </div>
</footer>
```

---

## Animation & Motion

### Premium Easing Curve

```css
/* Our signature easing - use everywhere */
transition-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
```

### Transition Durations

```css
--fast: 0.2s;
--base: 0.4s;
--slow: 0.8s;
--custom: 0.6s;
```

**Guidelines:**
- Quick interactions: 0.2s (hover state changes)
- Standard: 0.4s (most transitions)
- Dramatic: 0.8s (entrance animations, large movements)

### Fade In Animations

```css
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  opacity: 0;
  animation: fadeIn 0.8s ease forwards;
}

.animate-fade-in-delay-1 {
  opacity: 0;
  animation: fadeIn 0.8s ease 0.2s forwards;
}

.animate-fade-in-delay-2 {
  opacity: 0;
  animation: fadeIn 0.8s ease 0.4s forwards;
}

.animate-fade-in-delay-3 {
  opacity: 0;
  animation: fadeIn 0.8s ease 0.6s forwards;
}
```

**Usage:**
```html
<h1 class="animate-fade-in">Main Heading</h1>
<p class="animate-fade-in-delay-1">Subheading appears second</p>
<button class="animate-fade-in-delay-2">CTA appears third</button>
```

### Underline Reveal

```css
@keyframes underlineReveal {
  from {
    transform: scaleX(0);
    transform-origin: right;
  }
  to {
    transform: scaleX(1);
    transform-origin: left;
  }
}

.animate-underline-reveal {
  animation: underlineReveal 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
```

### Hover Effects

**Standard Button Hover:**
```css
transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);

:hover {
  transform: translateY(-2px);
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.08);
}
```

**Card Hover:**
```css
transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);

:hover {
  transform: translateY(-2px);
  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.06);
}
```

**Link Hover:**
```css
transition: color 0.4s cubic-bezier(0.16, 1, 0.3, 1);

:hover {
  color: #FF6B35;  /* flame */
}
```

### Scroll Animations

```html
<!-- Add to elements that should animate on scroll -->
<div class="animate-fade-in">Content</div>
```

### Carousel/Infinite Scroll

```css
@keyframes loop-horizontally {
  from {
    transform: translateX(-33.333%);
  }
  to {
    transform: translateX(-66.666%);
  }
}

.animate-loop-horizontally {
  animation: loop-horizontally 60s linear infinite;
}

.animate-loop-horizontally:hover {
  animation-play-state: paused;
}
```

### Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation: none !important;
    transition: none !important;
  }
}
```

---

## Email Design Guidelines

### Email-Safe Color Palette

Use hex codes (not CSS variables) in email HTML:

```
Ink:       #0A0A0A    or    #2C2C2C (slightly lighter for email)
Smoke:     #1A1A1A
Ash:       #2A2A2A
Pearl:     #FAFAFA    or    #FBFBFB
Silk:      #F5F5F5
Mist:      #EAEAEA    (slightly darker for email borders)
Flame:     #FF6B35    or    #FF5733 (email-optimized red-orange)
Ember:     #E5502C    or    #FF8C42 (lighter hover state)
Grey:      #5A5A5A    (body text on light backgrounds)
LightGrey: #8F8F8F    (secondary text)
```

### Email Typography

```css
body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
               'Helvetica Neue', Arial, sans-serif;
  font-weight: 300;
  line-height: 1.6;
  color: #2C2C2C;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

h1 {
  font-size: 28px;
  font-weight: 300;
  line-height: 1.2;
  letter-spacing: -0.02em;
  color: #2C2C2C;
}

h2 {
  font-size: 20px;
  font-weight: 400;
  line-height: 1.3;
  letter-spacing: -0.02em;
  color: #2C2C2C;
}

p {
  font-size: 16px;
  font-weight: 300;
  line-height: 1.7;
  color: #5A5A5A;
}

.eyebrow {
  font-size: 12px;
  color: #FF5733;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-weight: 500;
}
```

### Email Layout Structure

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Email Subject | DesignWorks Bureau</title>
  <style>
    /* Inline or embedded styles */
  </style>
</head>
<body style="margin: 0; padding: 20px; background-color: #FBFBFB;">

  <!-- Email Container -->
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #EAEAEA;">

    <!-- Header -->
    <div style="background-color: #2C2C2C; color: #FBFBFB; padding: 40px 30px; text-align: center;">
      <div style="font-size: 12px; color: #FF5733; text-transform: uppercase; letter-spacing: 0.1em; font-weight: 500; margin-bottom: 15px;">
        Eyebrow Text
      </div>
      <h1 style="font-size: 28px; font-weight: 300; margin: 0 0 10px 0; letter-spacing: -0.02em;">
        Email Heading
      </h1>
      <div style="font-size: 14px; color: #EAEAEA; font-weight: 300;">
        Date or Subtitle
      </div>
    </div>

    <!-- Content Sections -->
    <div style="padding: 0;">

      <!-- Section -->
      <div style="padding: 30px; border-bottom: 1px solid #EAEAEA;">
        <h2 style="font-size: 20px; font-weight: 400; color: #2C2C2C; margin: 0 0 15px 0;">
          Section Title
        </h2>
        <p style="font-size: 16px; color: #5A5A5A; margin: 0 0 15px 0; line-height: 1.7;">
          Body text goes here...
        </p>

        <!-- CTA Button -->
        <a href="#" style="display: inline-block; background-color: #FF5733; color: #ffffff; padding: 15px 30px; text-decoration: none; font-size: 14px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.05em; margin: 15px 0;">
          Button Text
        </a>
      </div>

      <!-- Progress Section with Accent -->
      <div style="padding: 30px; background-color: #FBFBFB; border-left: 4px solid #FF5733; border-bottom: 1px solid #EAEAEA;">
        <h2>Progress Update</h2>
        <p>Content with left accent border...</p>
      </div>

    </div>

    <!-- Footer -->
    <div style="background-color: #FBFBFB; padding: 30px; text-align: center; border-top: 1px solid #EAEAEA;">
      <p style="font-size: 12px; color: #8F8F8F; margin: 5px 0;">
        © 2025 DesignWorks Bureau Ltd • Company Number 14847378
      </p>
      <p style="font-size: 12px; color: #8F8F8F; margin: 5px 0;">
        123 Creative Street, London, UK
      </p>
      <p style="font-size: 12px; color: #8F8F8F; margin: 5px 0;">
        <a href="#" style="color: #FF5733; text-decoration: none;">Visit our website</a> •
        <a href="#" style="color: #FF5733; text-decoration: none;">Unsubscribe</a>
      </p>
    </div>

  </div>
</body>
</html>
```

### Email CTA Button

```html
<!-- Bulletproof button -->
<table role="presentation" cellspacing="0" cellpadding="0" border="0">
  <tr>
    <td style="background-color: #FF5733; text-align: center;">
      <a href="https://example.com" style="display: inline-block; background-color: #FF5733; color: #ffffff; padding: 15px 30px; text-decoration: none; font-size: 14px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.05em;">
        Button Text
      </a>
    </td>
  </tr>
</table>

<!-- Simple link styled as button (fallback) -->
<a href="https://example.com" style="display: inline-block; background-color: #FF5733; color: #ffffff; padding: 15px 30px; text-decoration: none; font-size: 14px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.05em;">
  Button Text
</a>
```

### Email Status Indicators

```html
<div style="padding: 10px 0; border-bottom: 1px solid #EAEAEA; display: table; width: 100%;">
  <div style="font-size: 12px; color: #8F8F8F; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 500; display: table-cell; width: 40%; vertical-align: top;">
    Label
  </div>
  <div style="font-size: 16px; color: #2C2C2C; font-weight: 300; display: table-cell; vertical-align: top;">
    Value
  </div>
</div>
```

### Email Best Practices

1. **Max width:** 600px for email containers
2. **Use inline styles** or embedded `<style>` tags (no external CSS)
3. **No border-radius:** Keep sharp corners with `border-radius: 0` (or omit)
4. **Table layouts** for complex structures (better client support)
5. **Test in multiple clients:** Gmail, Outlook, Apple Mail, mobile
6. **Dark mode aware:** Test both light and dark appearances
7. **Alt text:** Include for all images
8. **Mobile responsive:** Use `@media` queries for mobile optimizations

### Email Responsive Design

```html
<style>
  @media only screen and (max-width: 600px) {
    .email-container {
      margin: 10px !important;
      width: auto !important;
    }

    .section {
      padding: 20px !important;
    }

    .email-header {
      padding: 30px 20px !important;
    }

    .email-header h1 {
      font-size: 24px !important;
    }
  }
</style>
```

---

## Landing Page Patterns

### Hero Section (Light Background)

```html
<section class="section-padding bg-pearl min-h-screen flex items-center">
  <div class="container-premium">
    <div class="max-w-[800px]">
      <!-- Eyebrow -->
      <p class="animate-fade-in text-sm font-medium tracking-[0.1em] uppercase text-flame mb-8">
        Premium Design Subscription
      </p>

      <!-- Headline -->
      <h1 class="animate-fade-in-delay-1 text-hero font-light leading-[1.1] mb-8 tracking-[-0.04em] text-ink headline-balanced">
        Unlimited Design.<br />One Fixed Price.
      </h1>

      <!-- Description -->
      <p class="animate-fade-in-delay-2 text-xl font-light text-smoke mb-12 leading-[1.8] max-w-[540px] description-balanced">
        Get a dedicated design team that delivers world-class work, faster than hiring, at a fraction of the cost.
      </p>

      <!-- CTAs -->
      <div class="animate-fade-in-delay-3 flex flex-col sm:flex-row gap-6 mb-16">
        <button class="btn-primary">
          Get Started
          <ArrowRight class="w-5 h-5" />
        </button>
        <button class="btn-secondary">See Our Work</button>
      </div>

      <!-- Stats -->
      <div class="animate-fade-in-delay-3 flex flex-col sm:flex-row gap-16">
        <div>
          <div class="w-10 h-px bg-flame mb-3"></div>
          <div class="text-stat font-light text-ink mb-2">48h</div>
          <div class="text-smoke uppercase tracking-[0.1em] text-sm font-medium">
            Avg. Turnaround
          </div>
        </div>
        <!-- More stats... -->
      </div>
    </div>
  </div>
</section>
```

### Hero Section (Dark Background with Animation)

```html
<section class="pt-[140px] pb-32 px-16 min-h-[90vh] flex items-center relative overflow-hidden">
  <!-- Animated background (see Hero.tsx for full SVG code) -->
  <div class="animated-design-background-dark"></div>

  <!-- Bottom gradient border -->
  <div class="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent z-10"></div>

  <div class="container-premium w-full relative z-10">
    <div class="max-w-[800px]">
      <!-- Eyebrow -->
      <p class="animate-fade-in text-sm font-medium tracking-[0.1em] uppercase text-flame mb-8">
        Premium Design Studio
      </p>

      <!-- Title (white on dark) -->
      <h1 class="animate-fade-in-delay-1 text-hero font-light leading-[1.1] mb-8 tracking-[-0.04em] text-white headline-balanced">
        Design That Drives Results
      </h1>

      <!-- Description (light grey on dark) -->
      <p class="animate-fade-in-delay-2 text-xl font-light text-white/80 mb-12 leading-[1.8] max-w-[540px] description-balanced">
        From startups to enterprises, we deliver world-class design that converts.
      </p>

      <!-- Buttons (adjusted for dark background) -->
      <div class="animate-fade-in-delay-3 flex flex-col sm:flex-row gap-6 mb-16">
        <button class="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-white text-black font-medium text-sm tracking-[0.05em] uppercase transition-all duration-400 hover:bg-flame hover:text-white">
          Get Started
          <ArrowRight class="w-5 h-5" />
        </button>

        <button class="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-transparent border border-white/30 text-white font-medium text-sm tracking-[0.05em] uppercase transition-all duration-400 hover:bg-white hover:text-black">
          Our Work
        </button>
      </div>
    </div>
  </div>
</section>
```

### Services Grid Section

```html
<section class="section-padding bg-white">
  <div class="container-premium">
    <!-- Section Header -->
    <div class="max-w-3xl mb-20">
      <p class="text-sm font-medium tracking-[0.1em] uppercase text-flame mb-6">
        What We Do
      </p>
      <h2 class="text-section font-light text-ink mb-8 headline-balanced">
        Full-Spectrum Design Services
      </h2>
      <p class="text-xl font-light text-smoke leading-relaxed body-balanced">
        From brand identity to digital experiences, we handle every aspect of your visual presence.
      </p>
    </div>

    <!-- Services Grid -->
    <div class="services-grid">
      <div class="service-card">
        <div class="mb-6">
          <div class="w-12 h-12 border border-flame flex items-center justify-center mb-4">
            <Sparkles class="w-6 h-6 text-flame" strokeWidth={1.2} />
          </div>
        </div>
        <h3 class="text-2xl font-light text-ink mb-4 tracking-tight">
          Brand Identity
        </h3>
        <p class="text-smoke font-light leading-relaxed">
          Logos, color systems, typography, and comprehensive brand guidelines.
        </p>
      </div>
      <!-- More service cards... -->
    </div>
  </div>
</section>
```

### Pricing Section

```html
<section class="section-padding bg-silk">
  <div class="container-premium">
    <!-- Problem-focused hero -->
    <div class="text-center max-w-4xl mx-auto mb-20">
      <p class="mb-4 font-medium text-sm tracking-widest uppercase text-flame">
        Pricing That Makes Sense
      </p>
      <h2 class="mb-8 text-5xl font-light tracking-tight text-ink headline-balanced">
        No Surprises. No Hidden Fees.
      </h2>
      <p class="text-xl font-light leading-relaxed text-smoke body-balanced">
        One simple monthly fee for unlimited design work. Pause or cancel anytime.
      </p>
    </div>

    <!-- Pricing Cards Grid -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
      <!-- Pricing card (see Cards section for full markup) -->
    </div>
  </div>
</section>
```

### Testimonial Section

```html
<section class="section-padding bg-pearl">
  <div class="container-premium">
    <div class="text-center max-w-3xl mx-auto mb-16">
      <p class="text-sm font-medium tracking-[0.1em] uppercase text-flame mb-6">
        Client Success
      </p>
      <h2 class="text-section font-light text-ink mb-8 headline-balanced">
        Loved by Forward-Thinking Brands
      </h2>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <!-- Testimonial cards -->
      <div class="card-premium">
        <div class="flex gap-2 mb-4">
          <Star class="w-5 h-5 text-flame fill-flame" />
          <Star class="w-5 h-5 text-flame fill-flame" />
          <Star class="w-5 h-5 text-flame fill-flame" />
          <Star class="w-5 h-5 text-flame fill-flame" />
          <Star class="w-5 h-5 text-flame fill-flame" />
        </div>
        <blockquote class="text-lg font-light text-ash leading-relaxed mb-6">
          "Working with DesignWorks transformed our brand. The quality and speed are unmatched."
        </blockquote>
        <div>
          <div class="font-medium text-ink">Jane Doe</div>
          <div class="text-sm text-smoke uppercase tracking-wide">CEO, Acme Corp</div>
        </div>
      </div>
    </div>
  </div>
</section>
```

### CTA Section

```html
<section class="section-padding bg-ink text-white">
  <div class="container-premium">
    <div class="max-w-4xl mx-auto text-center">
      <h2 class="text-display font-light text-white mb-8 headline-balanced">
        Ready to Transform Your Brand?
      </h2>
      <p class="text-xl font-light text-white/80 mb-12 leading-relaxed description-balanced">
        Join hundreds of companies who trust DesignWorks for their design needs.
      </p>
      <div class="flex flex-col sm:flex-row gap-6 justify-center">
        <button class="btn-primary bg-flame hover:bg-ember">
          Get Started Now
          <ArrowRight class="w-5 h-5" />
        </button>
        <button class="btn-secondary border-white text-white hover:bg-white hover:text-ink">
          Schedule a Demo
        </button>
      </div>
    </div>
  </div>
</section>
```

---

## Accessibility

### Focus States

```css
:focus-visible {
  outline: 2px solid #FF6B35;      /* flame */
  outline-offset: 2px;
}
```

### Text Selection

```css
::selection {
  background-color: #FF6B35;       /* flame */
  color: white;
}
```

### ARIA Labels

```html
<!-- Button with icon only -->
<button aria-label="Close menu">
  <X class="w-6 h-6" />
</button>

<!-- Navigation landmark -->
<nav aria-label="Main navigation">
  <!-- Nav content -->
</nav>

<!-- Section with heading -->
<section aria-labelledby="services-heading">
  <h2 id="services-heading">Our Services</h2>
</section>
```

### Color Contrast

**Minimum Requirements (WCAG AA):**
- Normal text: 4.5:1
- Large text (18px+): 3:1
- UI components: 3:1

**Our Combinations:**
- ✅ Ink (#0A0A0A) on Pearl (#FAFAFA): 19.5:1
- ✅ Flame (#FF6B35) on White: 3.8:1 (passes for large text)
- ✅ White on Ink: 19.5:1
- ⚠️ Flame (#FF6B35) on Pearl: Use for accents only, not body text

### Keyboard Navigation

```css
/* Skip to main content link */
.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  background: #FF6B35;
  color: white;
  padding: 8px;
  text-decoration: none;
  z-index: 100;
}

.skip-link:focus {
  top: 0;
}
```

### Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

### Alt Text Guidelines

```html
<!-- Decorative images -->
<img src="pattern.svg" alt="" role="presentation" />

<!-- Informative images -->
<img src="logo.png" alt="DesignWorks Bureau logo" />

<!-- Icons with adjacent text -->
<button>
  <ArrowRight aria-hidden="true" />
  <span>Get Started</span>
</button>

<!-- Icons without text -->
<button aria-label="Close menu">
  <X aria-hidden="true" />
</button>
```

---

## Quick Reference: Component Checklist

When creating a new email or landing page, ensure you include:

### Email Checklist
- [ ] Max-width 600px container
- [ ] Inline or embedded styles (no external CSS)
- [ ] Sharp corners (border-radius: 0 or omitted)
- [ ] Email-safe colors (hex codes, not CSS variables)
- [ ] Dark header with flame eyebrow and white text
- [ ] Pearl/Silk background for main body
- [ ] CTA button with flame background
- [ ] Footer with company info and legal links
- [ ] Responsive styles for mobile (<600px)
- [ ] Alt text for all images
- [ ] Test in multiple email clients

### Landing Page Checklist
- [ ] Hero section with fade-in animations
- [ ] Eyebrow text (flame, uppercase, tracking-widest)
- [ ] Hero headline (text-hero, font-light, negative letter-spacing)
- [ ] Clear CTAs (btn-primary and btn-secondary)
- [ ] Generous section padding (section-padding class)
- [ ] Container wrapper (container-premium)
- [ ] Sharp corners on all elements
- [ ] Premium easing curve on all transitions
- [ ] Proper heading hierarchy (h1 → h6)
- [ ] Max-width constraints on text blocks (65ch for body)
- [ ] Focus states for keyboard navigation
- [ ] Reduced motion media query

---

## Design System Tokens

### Quick Copy-Paste Values

**Colors (Hex):**
```
ink=#0A0A0A smoke=#1A1A1A ash=#2A2A2A
pearl=#FAFAFA silk=#F5F5F5 mist=#E8E8E8
flame=#FF6B35 ember=#E5502C coral=#FF8964
ocean=#004E64 charity=#16a34a
```

**Font Sizes:**
```
hero=clamp(3.5rem,5vw,5.5rem)
display=clamp(2.5rem,4vw,4.5rem)
section=3.5rem
subsection=clamp(1.5rem,2.5vw,3rem)
body=1rem
small=0.875rem
```

**Spacing:**
```
4=1rem 8=2rem 12=3rem 16=4rem 24=6rem 32=8rem
```

**Transitions:**
```
duration: 0.4s
easing: cubic-bezier(0.16, 1, 0.3, 1)
```

**Shadows:**
```
premium: 0 20px 60px rgba(0,0,0,0.05)
premium-lg: 0 30px 80px rgba(0,0,0,0.06)
card-hover: 0 25px 50px rgba(0,0,0,0.08)
```

---

## Version History

- **v1.0** (November 2025): Initial comprehensive style guide

---

## Support & Questions

For questions about this style guide or design system implementation:
- **Email:** hello@designworksbureau.co.uk
- **Internal Slack:** #design-system
- **GitHub:** Open an issue in the main repository

---

**End of Visual Style Guide**

*This guide is a living document and will be updated as the design system evolves.*
