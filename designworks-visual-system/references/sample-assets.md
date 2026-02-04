# Sample Assets

Reference implementations of the DesignWorks Bureau visual system. Study these examples to understand how the brand vocabulary, mapping, and aesthetic principles come together in practice.

---

## Sample 1: Hero Animated Background

**File:** `components/Hero-anime-background.tsx`
**Scene Template:** "The Craft"
**Register:** Precision & Craft dominant

### What It Demonstrates

This background showcases design expertise through mathematical/geometric constructs:

| Element | Symbol Category | Purpose |
|---------|-----------------|---------|
| Golden Ratio Rectangles | Mathematical Construct | Design methodology, natural harmony |
| Fibonacci Circles | Mathematical Construct | Organic structure, growth |
| Rule of Thirds Grid | Mathematical Construct | Composition mastery |
| Typography Baseline Grid | Craft Tool | Attention to detail |
| Swiss Modular Grid | Mathematical Construct | Organization, systems |
| Color Theory Circles | Mathematical Construct | Design knowledge |

### Technical Implementation

- **Structure:** Single SVG with grouped sections
- **Colors:** #FF6B35 primary, rgba white/black secondary
- **Stroke:** 1px throughout, 0.5px for dense grids
- **Opacity:** 0.6 overall, varies by element (0.2–0.4 for grids)
- **Animation:** CSS stroke-dashoffset drawing, sequenced reveals
- **Dark/Light:** Two variants with inverted neutral strokes

### Mapping Analysis

| Dimension | Choice Made |
|-----------|-------------|
| Message | "We understand design principles deeply" |
| Emotion | Confident, Authoritative |
| Context | Homepage hero, extended engagement |
| Complexity | Moderate (multiple elements, but clean arrangement) |

---

## Sample 2: Constellation Background

**File:** `components/classOf2025/ConstellationBackground.tsx`
**Scene Template:** "The Connection"
**Register:** Innovation & Edge dominant

### What It Demonstrates

This background represents network thinking and community through constellation metaphors:

| Element | Symbol Category | Purpose |
|---------|-----------------|---------|
| 3-layer node system | Network Element | Depth, complexity made clear |
| Edge breakaway clusters | Network Element | Extended community, satellite groups |
| Connection lines | Network Element | Relationships, flow |
| Floating particles | Ambient element | Energy, life |
| Glow orbs | Ambient element | Atmosphere, warmth |
| Parallax movement | Interaction | Depth, engagement |

### Technical Implementation

- **Structure:** Multiple SVG layers + HTML particles
- **Colors:** #FF6B35 nodes with rgba(255,107,53,0.15) fill for glow
- **Layers:** Back (blur 3px, opacity 0.25), Mid (blur 1px, opacity 0.5), Front (sharp, opacity 0.8)
- **Animation:**
  - Nodes: pulse (3s) + float (60s)
  - Layers: drift (45-80s) with scale and rotation
  - Particles: float (30-50s)
  - Orbs: dramatic movement (25s)
- **Interaction:** Mouse-based parallax with intensity 100

### Mapping Analysis

| Dimension | Choice Made |
|-----------|-------------|
| Message | "Connected community, relationships matter" |
| Emotion | Exciting, Forward-thinking, Warm |
| Context | Campaign page hero, moderate engagement |
| Complexity | Rich (multiple layers, interactive) |

---

## Sample 3: Design For Good Animation

**File:** `components/designForGood/DesignForGoodAnimation.tsx`
**Scene Template:** "The Breakthrough"
**Register:** Impact & Purpose dominant

### What It Demonstrates

This background tells a story of social impact through symbolic iconography:

| Element | Symbol Category | Purpose |
|---------|-----------------|---------|
| Heart outline | Transformation Symbol | Care, compassion |
| Roof/house | Transformation Symbol | Shelter, home, security |
| Medical cross | Transformation Symbol | Healthcare, wellbeing |
| Globe with lines | Transformation Symbol | Global reach, world impact |
| Helping hands | Transformation Symbol | Support, assistance |
| Community figures | Network Element | People, togetherness |

### Technical Implementation

- **Structure:** Single SVG with 6 symbolic sections
- **Colors:** #16a34a (green) for impact symbols, #FF6B35 for shelter/hands
- **Stroke:** 1px throughout
- **Animation:**
  - 32-second total cycle
  - Stroke-dashoffset drawing for each element
  - Sequenced visibility (each symbol appears, draws, fades)
  - Hands include upward movement transformation
- **Timing:** Choreographed reveals with percentage-based keyframes

### Mapping Analysis

| Dimension | Choice Made |
|-----------|-------------|
| Message | "Design creates meaningful impact" |
| Emotion | Inspiring, Purposeful, Warm |
| Context | Impact/CSR page hero, extended engagement |
| Complexity | Moderate (sequential, not simultaneous) |

---

## Cross-Sample Patterns

### Consistent Elements

All three samples share:

1. **1px stroke weight** — Never thicker
2. **#FF6B35 as primary accent** — Brand color consistency
3. **No filled shapes** — Only strokes (except glow fills at 0.15 opacity)
4. **Reduced motion fallback** — All include `@media (prefers-reduced-motion)`
5. **Mobile responsiveness** — All scale/simplify for small screens
6. **Pointer-events: none** — Don't interfere with content interaction
7. **Position: absolute** — Sit behind content as true backgrounds

### Variation Points

Where samples differ (intentionally):

| Aspect | Sample 1 | Sample 2 | Sample 3 |
|--------|----------|----------|----------|
| Primary register | Craft | Innovation | Impact |
| Animation style | Draw sequences | Continuous motion | Draw + fade cycles |
| Interaction | None | Parallax | None |
| Color emphasis | Orange only | Orange only | Orange + Green |
| Complexity | Moderate | Rich | Moderate |
| Human presence | None | None | Implied (hands) |

---

## Using Samples as Reference

When creating new visuals:

1. **Identify closest sample** — Which example matches your content/emotion?
2. **Study the structure** — How is the SVG organized? What groups exist?
3. **Note the timing** — What durations and easings are used?
4. **Check the details** — Stroke weights, opacities, colors
5. **Adapt, don't copy** — Use the patterns, but create fresh compositions

### Sample → New Visual Workflow

```
1. Map your content (use content-mapping.md)
2. Identify the closest sample
3. Open the sample file for reference
4. Sketch your new composition using sample's structure
5. Apply aesthetic guidelines (visual-principles.md)
6. Implement with animation patterns (animation-patterns.md)
7. Test against output checklist
```
