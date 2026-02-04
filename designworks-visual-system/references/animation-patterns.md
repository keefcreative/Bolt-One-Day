# Animation Patterns

Core animation techniques for the DesignWorks Bureau visual system.

## Table of Contents
- [Stroke Drawing Animation](#stroke-drawing-animation)
- [Floating & Drifting](#floating--drifting)
- [Parallax Depth](#parallax-depth)
- [Pulsing & Scaling](#pulsing--scaling)
- [Sequenced Reveals](#sequenced-reveals)
- [Particle Systems](#particle-systems)
- [Timing Guidelines](#timing-guidelines)

---

## Stroke Drawing Animation

Lines "draw themselves" on screen using stroke-dasharray/dashoffset.

### Setup

```css
.draw-path {
  stroke-dasharray: 1000;  /* Total path length (adjust per path) */
  stroke-dashoffset: 1000; /* Start hidden */
}
```

### Animation

```css
@keyframes drawLine {
  0% { stroke-dashoffset: 1000; }
  100% { stroke-dashoffset: 0; }
}

.draw-path {
  animation: drawLine 2s ease-out forwards;
}
```

### Staggered Drawing (Multiple Paths)

```css
.path-1 { animation: drawLine 1.5s ease-out 0s forwards; }
.path-2 { animation: drawLine 1.5s ease-out 0.3s forwards; }
.path-3 { animation: drawLine 1.5s ease-out 0.6s forwards; }
```

### Looping Draw with Visibility

For continuous loops where elements appear and disappear:

```css
@keyframes drawAndFade {
  0% { stroke-dashoffset: 1000; opacity: 1; }
  30% { stroke-dashoffset: 0; opacity: 1; }
  40% { stroke-dashoffset: 0; opacity: 1; }
  50% { stroke-dashoffset: 0; opacity: 0; }
  100% { stroke-dashoffset: 1000; opacity: 0; }
}
```

---

## Floating & Drifting

Organic, ambient movement that makes visuals feel alive.

### Basic Float (Nodes/Particles)

```css
@keyframes nodeFloat {
  0%, 100% { transform: translate(0, 0); }
  25% { transform: translate(24px, -24px); }
  50% { transform: translate(-12px, 24px); }
  75% { transform: translate(-24px, -12px); }
}

.node {
  animation: nodeFloat 60s ease-in-out infinite;
}
```

### Layer Drift (Constellation Layers)

```css
/* Back layer - slowest, largest movement */
@keyframes driftBack {
  0%, 100% { transform: translate(0, 0) scale(1); }
  25% { transform: translate(60px, -50px) scale(1.08); }
  50% { transform: translate(-50px, 60px) scale(0.92); }
  75% { transform: translate(-60px, -55px) scale(1.04); }
}

/* Mid layer */
@keyframes driftMid {
  0%, 100% { transform: translate(0, 0) scale(1) rotateZ(0deg); }
  33% { transform: translate(-55px, 48px) scale(1.06) rotateZ(5deg); }
  66% { transform: translate(48px, -40px) scale(0.94) rotateZ(-5deg); }
}

/* Front layer - fastest, smallest movement */
@keyframes driftFront {
  0%, 100% { transform: translate(0, 0) scale(1); }
  30% { transform: translate(40px, -55px) scale(1.03); }
  60% { transform: translate(-48px, 45px) scale(0.97); }
}

.layer-back { animation: driftBack 80s ease-in-out infinite; }
.layer-mid { animation: driftMid 60s ease-in-out infinite; }
.layer-front { animation: driftFront 45s ease-in-out infinite; }
```

### Glow Orb Float

```css
@keyframes orbFloat {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(240px, -120px) scale(1.5); }
  66% { transform: translate(-180px, 150px) scale(0.7); }
}

.glow-orb {
  animation: orbFloat 25s ease-in-out infinite;
}
```

---

## Parallax Depth

Mouse-driven depth effect for layered elements.

### JavaScript Implementation

```javascript
const setupParallax = (intensity = 100) => {
  const layers = document.querySelectorAll('.parallax-layer');

  document.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 2;
    const y = (e.clientY / window.innerHeight - 0.5) * 2;

    layers.forEach(layer => {
      const depth = parseFloat(layer.dataset.depth || 0);
      const moveX = x * intensity * depth;
      const moveY = y * intensity * depth;
      layer.style.transform = `translate(${moveX}px, ${moveY}px)`;
    });
  });
};
```

### HTML Structure

```html
<div class="parallax-layer" data-depth="0.1"><!-- Back --></div>
<div class="parallax-layer" data-depth="0.3"><!-- Mid --></div>
<div class="parallax-layer" data-depth="0.5"><!-- Front --></div>
```

### Depth Values

| Layer | data-depth | Movement | Blur |
|-------|------------|----------|------|
| Back | 0.1 | Minimal | 3px |
| Mid | 0.3 | Moderate | 1px |
| Front | 0.5 | Maximum | 0px |

---

## Pulsing & Scaling

Rhythmic breathing effect for nodes and key elements.

### Node Pulse

```css
@keyframes nodePulse {
  0%, 100% {
    opacity: 0.2;
    transform: scale(0.8);
  }
  50% {
    opacity: 1;
    transform: scale(2);
  }
}

.node {
  animation: nodePulse 3s ease-in-out infinite;
}
```

### Staggered Pulse (Multiple Nodes)

```javascript
nodes.forEach((node, index) => {
  const delay = index * 0.3;
  node.style.animation = `nodePulse 3s ease-in-out infinite ${delay}s`;
});
```

### Subtle Pulse (Less Dramatic)

```css
@keyframes subtlePulse {
  0%, 100% { opacity: 0.6; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.1); }
}
```

---

## Sequenced Reveals

Elements appear in choreographed order.

### Visibility Keyframes Pattern

```css
/* Element visible from 0-12.5% of cycle */
@keyframes section1Visibility {
  0% { opacity: 1; }
  10.9% { opacity: 1; }
  12.5% { opacity: 0; }
  100% { opacity: 0; }
}

/* Element visible from 10-25% of cycle */
@keyframes section2Visibility {
  0% { opacity: 0; }
  10.9% { opacity: 0; }
  11% { opacity: 1; }
  23.4% { opacity: 1; }
  25% { opacity: 0; }
  100% { opacity: 0; }
}
```

### Combined Draw + Visibility

```css
.element {
  animation:
    sectionVisibility 32s infinite,
    drawLine 32s linear infinite;
}
```

### Timeline Planning

For a 32-second loop with 6 sections:
- Section 1: 0–5.3s (0–16.6%)
- Section 2: 5.3–10.6s (16.6–33.3%)
- Section 3: 10.6–16s (33.3–50%)
- And so on...

---

## Particle Systems

Floating ambient particles throughout the visual.

### HTML Structure

```html
<div class="particles" id="particles"></div>
```

### JavaScript Generation

```javascript
const createParticles = (container, count = 35) => {
  for (let i = 0; i < count; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';

    const size = Math.random() * 3 + 1;
    particle.style.width = size + 'px';
    particle.style.height = size + 'px';
    particle.style.left = Math.random() * 100 + '%';
    particle.style.top = Math.random() * 100 + '%';

    const duration = 30 + Math.random() * 20;
    const delay = Math.random() * -30;
    particle.style.animation = `particleFloat ${duration}s ease-in-out infinite ${delay}s`;

    container.appendChild(particle);
  }
};
```

### Particle Styles

```css
.particle {
  position: absolute;
  background: radial-gradient(circle, rgba(255, 107, 53, 0.8) 0%, transparent 70%);
  border-radius: 50%;
  pointer-events: none;
}

@keyframes particleFloat {
  0%, 100% {
    transform: translate(0, 0) scale(1);
    opacity: 0;
  }
  10% { opacity: 0.9; }
  50% { transform: translate(120px, -120px) scale(2); }
  90% { opacity: 0.9; }
}
```

---

## Timing Guidelines

### Duration Ranges

| Animation Type | Duration | Notes |
|----------------|----------|-------|
| Stroke draw | 1–3s | Per element |
| Node pulse | 2–4s | Breathing rhythm |
| Layer drift | 45–80s | Slow, ambient |
| Particle float | 30–50s | Varied per particle |
| Glow orb | 20–30s | Dramatic movement |
| Full sequence loop | 24–40s | All elements cycle |

### Easing Functions

| Effect | Easing | Why |
|--------|--------|-----|
| Drawing | `ease-out` | Natural pen feel |
| Floating | `ease-in-out` | Organic, smooth |
| Pulse | `ease-in-out` | Breathing |
| Parallax | `ease-out` (CSS transition) | Responsive feel |

### Stagger Delays

- Nodes: 0.3s apart
- Grid lines: 0.1s apart
- Major sections: 2–5s apart

### Reduced Motion

**Always include:**

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
  }

  .animated-element {
    animation: none;
    opacity: 0.3;
    stroke-dashoffset: 0;
  }
}
```
