# Application Guide

Context-specific guidance for applying the DesignWorks visual system across different mediums.

## Table of Contents
- [Website & Web Apps](#website--web-apps)
- [Presentations](#presentations)
- [Documents & Reports](#documents--reports)
- [Social Media](#social-media)
- [Video & Motion](#video--motion)
- [Print Materials](#print-materials)
- [Email](#email)

---

## Website & Web Apps

### Hero/Header Backgrounds

**Pattern choice by page purpose:**

| Page Type | Recommended Pattern | Why |
|-----------|--------------------|----|
| Homepage | Geometric (Golden Ratio, Fibonacci) | Design expertise, professionalism |
| About/Team | Network/Constellation | Connection, community |
| Services | Swiss Grid + Fibonacci | Precision, methodology |
| Impact/CSR | Symbolic icons (animated) | Storytelling, purpose |
| Pricing | Clean geometric | Trust, clarity |

**Implementation:**

```tsx
// Position as absolute background
<div style={{
  position: 'absolute',
  top: 0, left: 0, right: 0, bottom: 0,
  zIndex: 0,
  pointerEvents: 'none',
  overflow: 'hidden'
}}>
  <YourAnimatedBackground />
</div>

// Content sits above
<div style={{ position: 'relative', zIndex: 1 }}>
  {/* Page content */}
</div>
```

**Opacity guidelines:**
- Text-heavy areas: 0.3–0.4 background opacity
- Hero with large text: 0.5–0.6 background opacity
- Image-free sections: 0.6–0.8 allowed

### Loading States

Use constellation nodes pulsing or stroke-draw animation during load.

```css
.loading-indicator {
  animation: nodePulse 1.5s ease-in-out infinite;
}
```

### Micro-interactions

- Hover on buttons: subtle node glow
- Active states: stroke draw on border
- Success states: green (#16a34a) pulse

---

## Presentations

### Slide Templates

**Title Slide:**
- Full-bleed geometric background (40% opacity)
- Golden ratio rectangles from bottom-right corner
- Logo in top-left safe zone

**Content Slide:**
- Corner accent (top-right or bottom-left)
- Constellation cluster as subtle corner decoration
- Clean reading area in center 80%

**Section Divider:**
- Centered Fibonacci circles
- Section title overlaid
- Higher opacity (60%) acceptable

**Data/Chart Slide:**
- Swiss grid background (very subtle, 10% opacity)
- Use brand colors for chart elements
- Node markers for data points

### PowerPoint/Google Slides Integration

Export patterns as PNG with transparency:
- Resolution: 1920×1080 (16:9)
- Background elements at desired opacity
- Place as slide background image

### Animation in Slides

If the platform supports animation:
- Entrance: fade in from 0% to target opacity
- Exit: fade out
- Avoid: complex SVG animations (use pre-rendered GIF)

---

## Documents & Reports

### Word/Google Docs

**Header decoration:**
- Thin horizontal line with node accent
- Corner geometric element

```
[Node]────────────────────────────────────
```

**Section breaks:**
- Use SVG section divider exported as PNG
- Or simple rule: `────── ● ──────`

**Margins:**
- Left margin accent: subtle vertical line in brand color
- Page numbers: can include small node marker

### PDF Reports

**Cover page:**
- Full geometric background (30% opacity)
- Logo prominently placed
- Title in clear space

**Chapter openers:**
- Corner constellation cluster
- Chapter number with Fibonacci circle background

**Running headers/footers:**
- Minimal: thin line with occasional node
- Keep functional, not distracting

### Infographics

- Use Fibonacci circles as containing shapes
- Connect data points with constellation-style lines
- Node markers for key statistics
- Green (#16a34a) for positive/impact metrics

---

## Social Media

### Platform Specifications

| Platform | Size | Pattern Scale |
|----------|------|---------------|
| Instagram Post | 1080×1080 | 100% |
| Instagram Story | 1080×1920 | Scale up 150% |
| LinkedIn Post | 1200×627 | 100% |
| Twitter/X Post | 1200×675 | 100% |
| Facebook Post | 1200×630 | 100% |

### Post Types

**Announcement/Quote posts:**
- Geometric background (centered)
- Text overlay in clear zone
- High contrast for readability

**Data/Statistic posts:**
- Fibonacci circles framing the number
- Constellation connecting multiple stats

**Behind-the-scenes:**
- Subtle corner accents only
- Let photo content dominate

**Branded templates:**
- Consistent corner element placement
- Logo always in same position

### Stories/Reels

For animated stories:
- Use stroke-draw animation (export as video)
- 3-5 second loops
- Text appears after background draws

### Profile Elements

**Profile picture:**
- Logo on subtle geometric background
- Or logo with single Fibonacci circle

**Cover/Banner:**
- Constellation spread across width
- Key message in clear central zone

---

## Video & Motion

### Intro/Outro Sequences

**Intro (3-5 seconds):**
1. Black screen
2. Stroke-draw logo or geometric pattern
3. Fade to content

**Outro (3-5 seconds):**
1. Content fades
2. Constellation forms
3. Logo/CTA appears in clear space

### Lower Thirds

```
┌─────────────────────────────────┐
│ [Node] Speaker Name             │
│        Title / Company          │
└───●─────────────────────────────┘
```

- Subtle geometric frame
- Node accent at connection point
- Animate: draw on, hold, draw off

### Background Loops

Export as:
- MP4/WebM: 10-30 second seamless loop
- Resolution: 1920×1080 or 4K
- Opacity baked in (30-40%)

### Transitions

- Fade through geometric pattern
- Constellation draws across frame
- Wipe with stroke-draw line

---

## Print Materials

### Business Cards

**Front:**
- Logo + contact info
- Single corner accent

**Back:**
- Full geometric pattern (subtle)
- Or constellation cluster

### Letterhead

**Header:**
- Logo left
- Thin line extending right with end node

**Footer:**
- Contact info
- Minimal geometric accent

### Brochures/Flyers

**Cover:**
- Bold geometric pattern (40% opacity)
- Clear title zone

**Interior:**
- Corner accents only
- Icons for feature callouts
- Constellation for process flows

### Large Format (Banners/Posters)

- Scale patterns proportionally
- Increase stroke weight: 2-3px minimum
- Test print at actual size for visibility

---

## Email

### Email Signatures

```html
<table>
  <tr>
    <td style="border-left: 2px solid #FF6B35; padding-left: 10px;">
      <strong>Name</strong><br>
      Title | DesignWorks Bureau<br>
      email@domain.com
    </td>
  </tr>
</table>
```

### Marketing Emails

**Header image:**
- 600px wide
- Geometric background with logo
- Export as optimized PNG

**Section dividers:**
- Simple horizontal line
- Or exported SVG node divider as PNG

**CTA buttons:**
- Solid #FF6B35 background
- White text
- Slight rounded corners (4px)

### Email-Safe Colors

```
Primary: #FF6B35
Accent: #16a34a
Dark text: #1a1a1a
Light text: #ffffff
Light gray: #f5f5f5
```

---

## Quick Decision Matrix

| Context | Animated? | Pattern Type | Opacity |
|---------|-----------|--------------|---------|
| Website hero | Yes | Geometric or Constellation | 0.5-0.6 |
| Presentation slide | No/Simple | Geometric | 0.3-0.4 |
| Document header | No | Minimal accent | 1.0 (thin line) |
| Social post | Optional | Context-dependent | 0.3-0.5 |
| Video intro | Yes | Stroke-draw | 0.6-0.8 |
| Print cover | No | Geometric | 0.3-0.4 |
| Email header | No | Static PNG | 0.5-0.6 |
