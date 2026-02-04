---
name: designworks-visual-system
description: |
  Comprehensive brand visual system for DesignWorks Bureau. Creates on-brand static and animated visuals across all applications: website backgrounds, presentations, social media, documents, video assets, and print materials.

  MANDATORY TRIGGERS: DesignWorks, brand visual, animated background, constellation, line art animation, geometric pattern, on-brand graphic, visual identity, brand animation, SVG animation, stroke animation

  Use when creating any visual asset that should reflect the DesignWorks Bureau brand identity, whether static or animated.
---

# DesignWorks Bureau Visual System

A unified visual language built on three pillars: **line art aesthetics**, **mathematical foundations**, and **choreographed motion**.

## Brand Metaphors

DesignWorks Bureau visuals embody two metaphors:

- **The Connector** — Networks, relationships, bridges, systems thinking
- **The Craftsperson** — Tools, precision, intentional making, refinement

Combined: **Precise Connections** — systematic, purposeful, elegantly constructed.

## Brand DNA at a Glance

| Element | Value |
|---------|-------|
| Primary Color | `#FF6B35` (Flame Orange) |
| Accent Color | `#16a34a` (Impact Green) |
| Stroke Weight | 1px (never filled shapes) |
| Complexity | Minimal (60-70% negative space) |
| Human Figures | Never abstract — photography only |

## Reference Guides

### The Three Layers

| Layer | Reference | Purpose |
|-------|-----------|---------|
| **Vocabulary** | [references/visual-world.md](references/visual-world.md) | What symbols/objects can appear |
| **Grammar** | [references/content-mapping.md](references/content-mapping.md) | How to choose visuals for content |
| **Style** | [references/visual-principles.md](references/visual-principles.md) | How everything should look |

### Implementation Guides

| Need | Reference |
|------|-----------|
| Animation techniques | [references/animation-patterns.md](references/animation-patterns.md) |
| Static graphics | [references/static-patterns.md](references/static-patterns.md) |
| Context applications | [references/application-guide.md](references/application-guide.md) |
| Example implementations | [references/sample-assets.md](references/sample-assets.md) |

## Visual Creation Workflow

### Step 1: Map the Content

Use the [content-mapping.md](references/content-mapping.md) worksheet:

```
1. What is the primary message? → Determines symbol category
2. What emotion should it evoke? → Determines visual register
3. Where will it appear? → Determines format/complexity
```

### Step 2: Select Scene Template

Choose from the five scene templates in [visual-world.md](references/visual-world.md):

- "The System" — Process, methodology, capabilities
- "The Connection" — Partnerships, collaboration, community
- "The Craft" — Quality, attention to detail, expertise
- "The Breakthrough" — Innovation, results, transformation
- "The Overview" — Ecosystem views, portfolio, full-service

### Step 3: Choose Symbols

Select from approved symbol categories:
- Mathematical Constructs (grids, ratios, Fibonacci)
- Network Elements (nodes, connections, clusters)
- Craft Tools (compass arcs, rulers, Bezier curves)
- Transformation Symbols (emergence, ascending, ripples)

### Step 4: Apply Register

Set the emotional tone:
- **Precision & Craft** — Extra negative space, grid foundation, slow animation
- **Impact & Purpose** — Transformation symbols, green accents, reveals
- **Innovation & Edge** — Network clusters, dynamic angles, faster timing

### Step 5: Implement

Follow the technical guidelines in [visual-principles.md](references/visual-principles.md) and [animation-patterns.md](references/animation-patterns.md).

## Quick Reference

### Colors

```
Primary:    #FF6B35 (Flame Orange)
Accent:     #16a34a (Impact Green)
Dark mode:  rgba(255,255,255, 0.1–0.4)
Light mode: rgba(0,0,0, 0.08–0.3)
```

### Forbidden Elements

- Abstract human figures (use photography)
- Filled shapes (use strokes only)
- Dense/cluttered compositions
- Thick strokes (>2px)
- Trendy effects (gradients, shadows)

### SVG Template

```svg
<svg viewBox="0 0 [width] [height]" xmlns="http://www.w3.org/2000/svg">
  <g class="[category]-section">
    <path d="..." fill="none" stroke="#FF6B35" stroke-width="1" stroke-linecap="round"/>
  </g>
</svg>
```

## Output Checklist

Before delivering any brand visual:

- [ ] Content mapped (message → symbols → register)
- [ ] Uses approved colors only
- [ ] Stroke-based (no fills except glow at 0.15 opacity)
- [ ] 1px stroke weight
- [ ] Minimal complexity (60-70% negative space)
- [ ] No abstract human figures
- [ ] Dark/light variant if applicable
- [ ] Reduced-motion fallback for animations
- [ ] Mobile-responsive
