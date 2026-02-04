# Static Patterns

Non-animated visual patterns for print, documents, and static digital assets.

## Table of Contents
- [Geometric Patterns](#geometric-patterns)
- [Network Patterns](#network-patterns)
- [Symbolic Icons](#symbolic-icons)
- [Decorative Elements](#decorative-elements)
- [Print Considerations](#print-considerations)

---

## Geometric Patterns

### Golden Ratio Composition

Use for: backgrounds, section dividers, hero areas

```svg
<svg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg">
  <!-- Origin point -->
  <circle cx="500" cy="200" r="3" fill="#FF6B35"/>

  <!-- Nested rectangles -->
  <rect x="500" y="200" width="34" height="55" fill="none" stroke="#FF6B35" stroke-width="1"/>
  <rect x="534" y="200" width="55" height="55" fill="none" stroke="rgba(0,0,0,0.2)" stroke-width="1"/>
  <rect x="500" y="145" width="89" height="55" fill="none" stroke="rgba(0,0,0,0.2)" stroke-width="1"/>
  <rect x="411" y="145" width="89" height="89" fill="none" stroke="#FF6B35" stroke-width="1"/>
</svg>
```

### Fibonacci Circles

Use for: logos, icons, focal points

```svg
<svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
  <circle cx="200" cy="200" r="3" fill="none" stroke="#FF6B35" stroke-width="1"/>
  <circle cx="200" cy="200" r="8" fill="none" stroke="rgba(0,0,0,0.2)" stroke-width="1"/>
  <circle cx="200" cy="200" r="21" fill="none" stroke="#FF6B35" stroke-width="1"/>
  <circle cx="200" cy="200" r="42" fill="none" stroke="rgba(0,0,0,0.2)" stroke-width="1"/>
  <circle cx="200" cy="200" r="76" fill="none" stroke="#FF6B35" stroke-width="1"/>
  <circle cx="200" cy="200" r="131" fill="none" stroke="rgba(0,0,0,0.2)" stroke-width="1"/>
</svg>
```

### Rule of Thirds Grid

Use for: layout guides, photo overlays, composition aids

```svg
<svg viewBox="0 0 1200 800" xmlns="http://www.w3.org/2000/svg">
  <!-- Horizontal lines -->
  <line x1="0" y1="266" x2="1200" y2="266" stroke="rgba(0,0,0,0.15)" stroke-width="1"/>
  <line x1="0" y1="533" x2="1200" y2="533" stroke="rgba(0,0,0,0.15)" stroke-width="1"/>

  <!-- Vertical lines -->
  <line x1="400" y1="0" x2="400" y2="800" stroke="#FF6B35" stroke-width="1"/>
  <line x1="800" y1="0" x2="800" y2="800" stroke="#FF6B35" stroke-width="1"/>

  <!-- Power points -->
  <circle cx="400" cy="266" r="6" fill="none" stroke="#FF6B35" stroke-width="1"/>
  <circle cx="800" cy="266" r="6" fill="none" stroke="#FF6B35" stroke-width="1"/>
  <circle cx="400" cy="533" r="6" fill="none" stroke="#FF6B35" stroke-width="1"/>
  <circle cx="800" cy="533" r="6" fill="none" stroke="#FF6B35" stroke-width="1"/>
</svg>
```

### Swiss Grid Pattern

Use for: backgrounds, texture overlays

```svg
<svg viewBox="0 0 600 600" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <pattern id="swissGrid" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
      <rect width="60" height="60" fill="none" stroke="rgba(0,0,0,0.08)" stroke-width="0.5"/>
    </pattern>
  </defs>
  <rect width="600" height="600" fill="url(#swissGrid)"/>

  <!-- Accent lines -->
  <line x1="0" y1="120" x2="600" y2="120" stroke="#FF6B35" stroke-width="1"/>
  <line x1="180" y1="0" x2="180" y2="600" stroke="#FF6B35" stroke-width="1"/>
</svg>
```

---

## Network Patterns

### Constellation Cluster

Use for: corner decorations, connection themes

```svg
<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <!-- Nodes -->
  <circle cx="50" cy="80" r="4" fill="rgba(255,107,53,0.15)" stroke="#FF6B35" stroke-width="1"/>
  <circle cx="120" cy="40" r="3" fill="rgba(255,107,53,0.15)" stroke="#FF6B35" stroke-width="1"/>
  <circle cx="160" cy="100" r="5" fill="rgba(255,107,53,0.15)" stroke="#FF6B35" stroke-width="1"/>
  <circle cx="100" cy="150" r="3" fill="rgba(255,107,53,0.15)" stroke="#FF6B35" stroke-width="1"/>
  <circle cx="40" cy="160" r="4" fill="rgba(255,107,53,0.15)" stroke="#FF6B35" stroke-width="1"/>

  <!-- Connections -->
  <line x1="50" y1="80" x2="120" y2="40" stroke="rgba(255,107,53,0.25)" stroke-width="1"/>
  <line x1="120" y1="40" x2="160" y2="100" stroke="rgba(255,107,53,0.25)" stroke-width="1"/>
  <line x1="160" y1="100" x2="100" y2="150" stroke="rgba(255,107,53,0.25)" stroke-width="1"/>
  <line x1="50" y1="80" x2="100" y2="150" stroke="rgba(255,107,53,0.25)" stroke-width="1"/>
  <line x1="100" y1="150" x2="40" y2="160" stroke="rgba(255,107,53,0.25)" stroke-width="1"/>
</svg>
```

### Node with Glow

Use for: bullet points, list markers, data visualization points

```svg
<circle cx="10" cy="10" r="4"
        fill="rgba(255, 107, 53, 0.15)"
        stroke="#FF6B35"
        stroke-width="1.5"
        style="filter: drop-shadow(0 0 4px #FF6B35);"/>
```

---

## Symbolic Icons

Line-art icons following brand principles. All use `fill="none" stroke="#FF6B35" stroke-width="1"`.

### Heart (Care/Community)

```svg
<path d="M12,21.35l-1.45-1.32C5.4,15.36,2,12.27,2,8.5C2,5.41,4.42,3,7.5,3c1.74,0,3.41,0.81,4.5,2.08
         C13.09,3.81,14.76,3,16.5,3C19.58,3,22,5.41,22,8.5c0,3.77-3.4,6.86-8.55,11.53L12,21.35z"
      fill="none" stroke="#FF6B35" stroke-width="1" stroke-linecap="round"/>
```

### Globe (Global Reach)

```svg
<g fill="none" stroke="#FF6B35" stroke-width="1">
  <circle cx="50" cy="50" r="40"/>
  <line x1="50" y1="10" x2="50" y2="90"/>
  <line x1="10" y1="50" x2="90" y2="50"/>
  <ellipse cx="50" cy="50" rx="20" ry="40"/>
  <line x1="15" y1="30" x2="85" y2="30"/>
  <line x1="15" y1="70" x2="85" y2="70"/>
</g>
```

### House/Shelter (Home)

```svg
<g fill="none" stroke="#FF6B35" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
  <polyline points="20,45 50,15 80,45"/>
  <polyline points="70,25 70,15 78,15 78,35"/>
</g>
```

### Medical Cross (Healthcare)

```svg
<path d="M44,20h12v12h12v12h-12v12h-12v-12h-12v-12h12z"
      fill="none" stroke="#16a34a" stroke-width="1" stroke-linecap="round"/>
```

### Helping Hands (Support)

```svg
<g fill="none" stroke="#FF6B35" stroke-width="1" stroke-linecap="round">
  <!-- Left hand reaching up -->
  <path d="M30,70 L30,45 C30,40 35,35 40,35 L45,35"/>
  <path d="M25,55 L35,45"/>
  <!-- Right hand reaching up -->
  <path d="M70,70 L70,45 C70,40 65,35 60,35 L55,35"/>
  <path d="M75,55 L65,45"/>
</g>
```

---

## Decorative Elements

### Corner Accent

Use for: document corners, slide corners, card decorations

```svg
<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <line x1="0" y1="30" x2="30" y2="0" stroke="#FF6B35" stroke-width="1"/>
  <line x1="0" y1="50" x2="50" y2="0" stroke="rgba(0,0,0,0.2)" stroke-width="1"/>
  <line x1="0" y1="70" x2="70" y2="0" stroke="#FF6B35" stroke-width="1"/>
  <circle cx="15" cy="15" r="3" fill="none" stroke="#FF6B35" stroke-width="1"/>
</svg>
```

### Section Divider

Use for: horizontal rules, section breaks

```svg
<svg viewBox="0 0 400 20" xmlns="http://www.w3.org/2000/svg">
  <line x1="0" y1="10" x2="180" y2="10" stroke="rgba(0,0,0,0.2)" stroke-width="1"/>
  <circle cx="200" cy="10" r="4" fill="none" stroke="#FF6B35" stroke-width="1"/>
  <line x1="220" y1="10" x2="400" y2="10" stroke="rgba(0,0,0,0.2)" stroke-width="1"/>
</svg>
```

### Quote Mark Accent

```svg
<path d="M10,30 Q10,10 30,10 M40,30 Q40,10 60,10"
      fill="none" stroke="#FF6B35" stroke-width="2" stroke-linecap="round"/>
```

---

## Print Considerations

### Color Conversion

| Screen | Print (CMYK approximation) |
|--------|---------------------------|
| #FF6B35 | C:0 M:70 Y:85 K:0 |
| #16a34a | C:75 M:0 Y:80 K:20 |

### Minimum Stroke Weights

| Medium | Minimum Weight |
|--------|---------------|
| Digital | 0.5px |
| Offset print | 0.25pt (0.35px) |
| Laser print | 0.5pt (0.7px) |
| Silkscreen | 1pt (1.4px) |

### Bleed & Safe Zones

- Include 3mm bleed for print
- Keep critical elements 5mm from trim edge
- Convert strokes to outlines for final print files

### File Formats

| Use Case | Format |
|----------|--------|
| Web/digital | SVG (preferred), PNG |
| Print | PDF, AI, EPS |
| Social media | PNG (2x resolution) |
| Documents | SVG embedded or PNG |
