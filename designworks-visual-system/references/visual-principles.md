# Visual Principles

Core visual rules extracted from the DesignWorks Bureau brand identity.

## Table of Contents
- [Color Palette](#color-palette)
- [Line Art Philosophy](#line-art-philosophy)
- [Opacity System](#opacity-system)
- [Mathematical Foundations](#mathematical-foundations)
- [Glow & Depth Effects](#glow--depth-effects)

---

## Color Palette

### Primary Colors

| Name | Hex | RGB | Usage |
|------|-----|-----|-------|
| **Flame Orange** | `#FF6B35` | `rgb(255, 107, 53)` | Primary brand accent, main strokes, emphasis |
| **Impact Green** | `#16a34a` | `rgb(22, 163, 74)` | Secondary accent for impact/social themes |

### Neutral Strokes (Dark Backgrounds)

| Opacity Level | Value | Usage |
|---------------|-------|-------|
| High emphasis | `rgba(255,255,255,0.4)` | Important secondary lines |
| Medium | `rgba(255,255,255,0.3)` | Standard secondary strokes |
| Low | `rgba(255,255,255,0.2)` | Subtle grid lines, backgrounds |
| Very low | `rgba(255,255,255,0.1)` | Dense pattern fills |

### Neutral Strokes (Light Backgrounds)

| Opacity Level | Value | Usage |
|---------------|-------|-------|
| High emphasis | `rgba(0,0,0,0.3)` | Important secondary lines |
| Medium | `rgba(0,0,0,0.2)` | Standard secondary strokes |
| Low | `rgba(0,0,0,0.15)` | Subtle grid lines |
| Very low | `rgba(0,0,0,0.08)` | Dense pattern fills |

### Color Application Rules

1. **Primary color (#FF6B35) appears on:**
   - Key structural lines (every 3rd-4th element)
   - Focal points and emphasis nodes
   - Origin dots and anchor points

2. **Secondary neutrals appear on:**
   - Supporting grid lines
   - Connection lines between nodes
   - Background pattern fills

3. **Ratio guideline:** ~30% primary color, ~70% neutral strokes

---

## Line Art Philosophy

### Core Principles

1. **Strokes only, never fills** — All shapes are outlined, not solid
2. **Thin is premium** — 1px strokes convey precision and elegance
3. **SVG format always** — Vector ensures crisp scaling at any size
4. **Rounded caps** — Use `stroke-linecap="round"` for softer feel

### Stroke Weights

| Element Type | Weight | Example |
|--------------|--------|---------|
| Primary lines | 1px | Main shapes, key connections |
| Grid patterns | 0.5px | Swiss grid, dense backgrounds |
| Emphasis lines | 1.5px | Node outlines with glow |
| Heavy accent | 2px | Rare, only for extreme emphasis |

### SVG Attributes Template

```svg
<!-- Primary element -->
<path d="..."
      fill="none"
      stroke="#FF6B35"
      stroke-width="1"
      stroke-linecap="round"
      stroke-linejoin="round"/>

<!-- Secondary element -->
<line x1="..." y1="..." x2="..." y2="..."
      fill="none"
      stroke="rgba(255,255,255,0.3)"
      stroke-width="1"
      stroke-linecap="round"/>
```

---

## Opacity System

### Element Opacity (Overall)

| Layer/Purpose | Opacity | Notes |
|---------------|---------|-------|
| Background visual container | 0.4–0.6 | Keeps content readable |
| Front layer elements | 0.6–0.8 | Most visible |
| Mid layer elements | 0.4–0.5 | Depth illusion |
| Back layer elements | 0.2–0.3 | Subtle depth |
| Edge clusters/decorative | 0.4–0.6 | Peripheral interest |

### Stroke Opacity Within Elements

| Emphasis | Primary Color | Neutral |
|----------|--------------|---------|
| High | 100% (`#FF6B35`) | 30–40% |
| Medium | 80% | 20–30% |
| Low | 60% | 10–20% |

### Node Fill Opacity

Nodes use semi-transparent fills for glow effect:

```svg
<!-- Node with glow-ready fill -->
<circle cx="100" cy="100" r="4"
        fill="rgba(255, 107, 53, 0.15)"
        stroke="#FF6B35"
        stroke-width="1.5"/>
```

---

## Mathematical Foundations

### Golden Ratio Rectangles

Sequence: 1, 1.618, 2.618, 4.236, 6.854...

```
Starting from origin (e.g., 1200, 400):
- rect-1: 55 × 89
- rect-2: 89 × 89
- rect-3: 144 × 89
- rect-4: 144 × 144
- rect-5: 233 × 144
- rect-6: 233 × 233
- rect-7: 377 × 233
- rect-8: 377 × 377
```

### Fibonacci Circles

Radii sequence: 3, 8, 21, 42, 76, 131, 220, 364, 598...

Alternate primary/secondary colors for visual rhythm.

### Rule of Thirds Grid

```
Vertical lines: 33.3%, 66.6% of width
Horizontal lines: 33.3%, 66.6% of height
Intersection points: mark with small circles (r=6)
```

### Swiss Modular Grid

60×60 pixel base unit. Pattern fill with very low opacity (0.08–0.1).

---

## Glow & Depth Effects

### CSS Drop Shadow for Nodes

```css
.node {
  filter: drop-shadow(0 0 6px #FF6B35);
}

.node-subtle {
  filter: drop-shadow(0 0 4px #FF6B35);
}

.connection-line {
  filter: drop-shadow(0 0 3px #FF6B35);
}
```

### Ambient Glow Orbs

Large, blurred circles that provide atmospheric depth:

```css
.glow-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.15–0.2;
  pointer-events: none;
}
```

Typical sizes: 300px–500px diameter.

### Layer Blur for Parallax Depth

| Layer | Blur | Creates |
|-------|------|---------|
| Back | 3px | Distant, soft |
| Mid | 1px | Intermediate |
| Front | 0px | Sharp, close |
