const PptxGenJS = require('pptxgenjs');
const fs = require('fs');
const path = require('path');

// Read all data files
const hero = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/hero.json'), 'utf8'));
const logoCarousel = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/logoCarousel.json'), 'utf8'));
const services = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/services.json'), 'utf8'));
const weBelieve = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/weBelieve.json'), 'utf8'));
const teamCollective = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/team-collective.json'), 'utf8'));
const designProcess = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/premiumDesignProcess.json'), 'utf8'));
const testimonials = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/testimonials.json'), 'utf8'));
const pricing = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/brandedPricing.json'), 'utf8'));
const cta = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/premiumCta.json'), 'utf8'));
const faq = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/premiumFaq.json'), 'utf8'));
const solutions = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/solutions.json'), 'utf8'));

// Create new presentation
const pres = new PptxGenJS();

pres.author = 'DesignWorks';
pres.company = 'DesignWorks Agency';
pres.subject = 'DesignWorks Premium Brand Template';
pres.title = 'DesignWorks Brand Guidelines';

// Custom slide dimensions: 16" × 9" (16:9 ratio)
pres.defineLayout({ name: 'CUSTOM_16x9', width: 16, height: 9 });
pres.layout = 'CUSTOM_16x9';

// Brand colors - EXACT from website
const colors = {
  ink: '0A0A0A',        // Primary text/buttons
  smoke: '1A1A1A',      // Secondary text
  ash: '2A2A2A',        // Tertiary
  pearl: 'FAFAFA',      // Primary bg
  silk: 'F5F5F5',       // Secondary bg
  mist: 'E8E8E8',       // Borders
  flame: 'FF6B35',      // Accent ONLY (not primary)
  ember: 'E5502C',
  coral: 'FF8964',
  whisper: 'FFF9F7',
  ocean: '004E64',
  fog: 'E8F0F2',
  sage: 'E8F0EC',
  white: 'FFFFFF'
};

// Define master slide - minimal with subtle branding
pres.defineSlideMaster({
  title: 'MASTER_SLIDE',
  background: { color: colors.pearl },
  objects: [{
    text: {
      text: 'DESIGNWORKS',
      options: {
        x: 13.6, y: 8.4, w: 2.2, h: 0.3,
        fontSize: 10, color: colors.mist, bold: false, align: 'right', fontFace: 'Segoe UI'
      }
    }
  }]
});

// =========================
// SLIDE 1: TITLE SLIDE
// =========================
let slide = pres.addSlide({ masterName: 'MASTER_SLIDE' });
slide.background = { color: colors.pearl };

slide.addText('DesignWorks', {
  x: 1, y: 2.5, w: 14, h: 1.4,
  fontSize: 110, bold: false, color: colors.ink, fontFace: 'Segoe UI'
});

slide.addText('Premium Brand Template', {
  x: 1, y: 4.1, w: 10, h: 0.5,
  fontSize: 28, bold: false, color: colors.smoke, fontFace: 'Segoe UI'
});

// Subtle accent line (not box)
slide.addShape(pres.ShapeType.rect, {
  x: 1, y: 4.9, w: 2, h: 0.02,
  fill: { color: colors.flame }
});

slide.addText('Design That Actually Converts Visitors', {
  x: 1, y: 5.3, w: 10, h: 0.8,
  fontSize: 20, bold: false, color: colors.smoke, fontFace: 'Segoe UI', lineSpacing: 32
});

// =========================
// SLIDE 2: COLOR PALETTE
// =========================
slide = pres.addSlide({ masterName: 'MASTER_SLIDE' });

slide.addText('01 — FOUNDATION', {
  x: 1, y: 0.6, w: 14, h: 0.3,
  fontSize: 12, bold: true, color: colors.flame, fontFace: 'Segoe UI', charSpacing: 2
});

slide.addText('Color Palette', {
  x: 1, y: 1.2, w: 14, h: 0.9,
  fontSize: 64, bold: false, color: colors.ink, fontFace: 'Segoe UI'
});

// Primary colors - larger, no borders
const primaryColors = [
  { name: 'Ink', hex: colors.ink, desc: 'Primary text & buttons' },
  { name: 'Smoke', hex: colors.smoke, desc: 'Secondary text' },
  { name: 'Ash', hex: colors.ash, desc: 'Tertiary elements' }
];

primaryColors.forEach((color, i) => {
  const xPos = 1 + (i * 4.3);
  // No border, just solid color block
  slide.addShape(pres.ShapeType.rect, {
    x: xPos, y: 2.8, w: 3.8, h: 3.8,
    fill: { color: color.hex },
    line: { type: 'none' }
  });
  slide.addText(color.name, {
    x: xPos, y: 6.8, w: 3.8, h: 0.35,
    fontSize: 20, bold: false, color: colors.ink, fontFace: 'Segoe UI'
  });
  slide.addText(`#${color.hex}`, {
    x: xPos, y: 7.2, w: 3.8, h: 0.3,
    fontSize: 14, color: colors.smoke, fontFace: 'Segoe UI'
  });
});

// Accent color - Flame (used sparingly)
slide.addShape(pres.ShapeType.rect, {
  x: 12, y: 2.8, w: 3, h: 2,
  fill: { color: colors.flame },
  line: { type: 'none' }
});
slide.addText('Flame', {
  x: 12, y: 3.3, w: 3, h: 0.4,
  fontSize: 24, bold: false, color: colors.white, align: 'center', fontFace: 'Segoe UI'
});
slide.addText('Accent only', {
  x: 12, y: 3.7, w: 3, h: 0.3,
  fontSize: 12, color: 'FFFFFF', align: 'center', fontFace: 'Segoe UI', italic: true
});
slide.addText('#FF6B35', {
  x: 12, y: 5, w: 3, h: 0.3,
  fontSize: 14, color: colors.smoke, align: 'center', fontFace: 'Segoe UI'
});

// Neutrals stacked vertically
const neutrals = [
  { name: 'Pearl', hex: colors.pearl, desc: 'Primary BG' },
  { name: 'Silk', hex: colors.silk, desc: 'Secondary BG' },
  { name: 'Mist', hex: colors.mist, desc: 'Borders' }
];

neutrals.forEach((color, i) => {
  const yPos = 5.5 + (i * 0.6);
  slide.addShape(pres.ShapeType.rect, {
    x: 12, y: yPos, w: 1.2, h: 0.5,
    fill: { color: color.hex },
    line: { color: colors.mist, width: 1 }
  });
  slide.addText(`${color.name} — ${color.desc}`, {
    x: 13.3, y: yPos + 0.1, w: 1.7, h: 0.3,
    fontSize: 11, color: colors.smoke, fontFace: 'Segoe UI'
  });
});

// =========================
// SLIDE 3: TYPOGRAPHY
// =========================
slide = pres.addSlide({ masterName: 'MASTER_SLIDE' });

slide.addText('02 — FOUNDATION', {
  x: 1, y: 0.6, w: 14, h: 0.3,
  fontSize: 12, bold: true, color: colors.flame, fontFace: 'Segoe UI', charSpacing: 2
});

slide.addText('Typography System', {
  x: 1, y: 1.2, w: 14, h: 0.9,
  fontSize: 64, bold: false, color: colors.ink, fontFace: 'Segoe UI'
});

slide.addText('Light font weight (300) is default.\nSharp letter-spacing.\nNo rounded corners.', {
  x: 1, y: 2.3, w: 14, h: 0.8,
  fontSize: 16, bold: false, color: colors.smoke, fontFace: 'Segoe UI', lineSpacing: 26
});

// Typography samples - showing actual light weight
const typeSamples = [
  { label: 'Hero', size: 88, sample: 'Premium Design', weight: false },
  { label: 'Section', size: 56, sample: 'Our Services', weight: false },
  { label: 'Card Title', size: 28, sample: 'Brand Identity', weight: false },
  { label: 'Body', size: 20, sample: 'Creating systems that work', weight: false }
];

let yPos = 3.6;
typeSamples.forEach((item) => {
  slide.addText(item.label.toUpperCase(), {
    x: 1, y: yPos, w: 2.5, h: 0.3,
    fontSize: 10, color: colors.flame, bold: true, fontFace: 'Segoe UI', charSpacing: 2
  });
  slide.addText(`${item.size}pt  •  Light`, {
    x: 3.8, y: yPos, w: 2.5, h: 0.3,
    fontSize: 11, color: colors.mist, fontFace: 'Segoe UI'
  });
  slide.addText(item.sample, {
    x: 6.5, y: yPos - 0.1, w: 8.5, h: 0.9,
    fontSize: item.size,
    bold: item.weight, color: colors.ink, fontFace: 'Segoe UI'
  });
  yPos += 1.1;
});

// =========================
// SLIDE 4: BUTTONS
// =========================
slide = pres.addSlide({ masterName: 'MASTER_SLIDE' });

slide.addText('03 — COMPONENTS', {
  x: 1, y: 0.6, w: 14, h: 0.3,
  fontSize: 12, bold: true, color: colors.flame, fontFace: 'Segoe UI', charSpacing: 2
});

slide.addText('Button System', {
  x: 1, y: 1.2, w: 14, h: 0.9,
  fontSize: 64, bold: false, color: colors.ink, fontFace: 'Segoe UI'
});

slide.addText('Primary buttons use INK (not flame).\nFlame is for hover states only.\nNo border radius, uppercase text.', {
  x: 1, y: 2.3, w: 14, h: 0.8,
  fontSize: 16, bold: false, color: colors.smoke, fontFace: 'Segoe UI', lineSpacing: 26
});

// Primary button - INK background (actual website style)
slide.addShape(pres.ShapeType.rect, {
  x: 1, y: 3.5, w: 4.5, h: 0.8,
  fill: { color: colors.ink },
  line: { type: 'none' }
});
slide.addText(hero.hero.primaryButton.text.toUpperCase(), {
  x: 1, y: 3.5, w: 4.5, h: 0.8,
  fontSize: 14, bold: false, color: colors.white, align: 'center', valign: 'middle', fontFace: 'Segoe UI', charSpacing: 1
});
slide.addText('Primary Button', {
  x: 1, y: 4.5, w: 4.5, h: 0.3,
  fontSize: 11, color: colors.smoke, italic: true, fontFace: 'Segoe UI'
});
slide.addText('bg-ink  •  hover:bg-flame  •  hover:-translate-y-0.5', {
  x: 1, y: 4.85, w: 4.5, h: 0.25,
  fontSize: 9, color: colors.mist, fontFace: 'Segoe UI'
});

// Secondary button - transparent with border
slide.addShape(pres.ShapeType.rect, {
  x: 6, y: 3.5, w: 4.5, h: 0.8,
  fill: { color: colors.pearl },
  line: { color: colors.ink, width: 1 }
});
slide.addText(hero.hero.secondaryButton.text.toUpperCase(), {
  x: 6, y: 3.5, w: 4.5, h: 0.8,
  fontSize: 14, bold: false, color: colors.ink, align: 'center', valign: 'middle', fontFace: 'Segoe UI', charSpacing: 1
});
slide.addText('Secondary Button', {
  x: 6, y: 4.5, w: 4.5, h: 0.3,
  fontSize: 11, color: colors.smoke, italic: true, fontFace: 'Segoe UI'
});
slide.addText('border-ink  •  hover:bg-ink  •  hover:text-white', {
  x: 6, y: 4.85, w: 4.5, h: 0.25,
  fontSize: 9, color: colors.mist, fontFace: 'Segoe UI'
});

// Hover state example
slide.addShape(pres.ShapeType.rect, {
  x: 11, y: 3.5, w: 4, h: 0.8,
  fill: { color: colors.flame },
  line: { type: 'none' },
  shadow: { type: 'outer', blur: 20, offset: 8, angle: 90, opacity: 0.15, color: '000000' }
});
slide.addText('HOVER STATE', {
  x: 11, y: 3.5, w: 4, h: 0.8,
  fontSize: 14, bold: false, color: colors.white, align: 'center', valign: 'middle', fontFace: 'Segoe UI', charSpacing: 1
});
slide.addText('on hover', {
  x: 11, y: 4.5, w: 4, h: 0.3,
  fontSize: 11, color: colors.smoke, italic: true, fontFace: 'Segoe UI'
});

// =========================
// HOMEPAGE COMPONENT SLIDES
// =========================

// HERO SECTION
slide = pres.addSlide({ masterName: 'MASTER_SLIDE' });
slide.addText('04 — HOMEPAGE', {
  x: 1, y: 0.6, w: 14, h: 0.3,
  fontSize: 12, bold: true, color: colors.flame, fontFace: 'Segoe UI', charSpacing: 2
});
slide.addText('Hero Section', {
  x: 1, y: 1.2, w: 14, h: 0.9,
  fontSize: 64, bold: false, color: colors.ink, fontFace: 'Segoe UI'
});

// Dark gradient background like website
slide.addShape(pres.ShapeType.rect, {
  x: 0, y: 2.5, w: 16, h: 5.5,
  fill: { color: colors.ink }
});

slide.addText(hero.hero.eyebrow.toUpperCase(), {
  x: 1.5, y: 3.2, w: 13, h: 0.3,
  fontSize: 12, color: colors.flame, bold: true, fontFace: 'Segoe UI', charSpacing: 2
});

slide.addText(hero.hero.title, {
  x: 1.5, y: 3.8, w: 9, h: 1.6,
  fontSize: 56, bold: false, color: colors.white, fontFace: 'Segoe UI', lineSpacing: 62
});

slide.addText(hero.hero.description, {
  x: 1.5, y: 5.6, w: 8, h: 0.8,
  fontSize: 18, color: 'E8E8E8', fontFace: 'Segoe UI', lineSpacing: 28
});

// White primary button on dark bg
slide.addShape(pres.ShapeType.rect, {
  x: 1.5, y: 6.7, w: 3, h: 0.6,
  fill: { color: colors.white }
});
slide.addText(hero.hero.primaryButton.text.toUpperCase(), {
  x: 1.5, y: 6.7, w: 3, h: 0.6,
  fontSize: 12, bold: false, color: colors.ink, align: 'center', valign: 'middle', fontFace: 'Segoe UI', charSpacing: 1
});

// Stats on right
let statY = 3.2;
hero.stats.items.slice(0, 2).forEach((stat) => {
  slide.addShape(pres.ShapeType.rect, {
    x: 11.5, y: statY - 0.1, w: 0.8, h: 0.02,
    fill: { color: colors.flame }
  });
  slide.addText(stat.number, {
    x: 11.5, y: statY + 0.1, w: 3.5, h: 0.6,
    fontSize: 40, color: colors.white, bold: false, fontFace: 'Segoe UI'
  });
  slide.addText(stat.label.toUpperCase(), {
    x: 11.5, y: statY + 0.7, w: 3.5, h: 0.3,
    fontSize: 11, color: 'B0B0B0', fontFace: 'Segoe UI', charSpacing: 2
  });
  statY += 1.5;
});

// SERVICES
slide = pres.addSlide({ masterName: 'MASTER_SLIDE' });
slide.addText('05 — HOMEPAGE', {
  x: 1, y: 0.6, w: 14, h: 0.3,
  fontSize: 12, bold: true, color: colors.flame, fontFace: 'Segoe UI', charSpacing: 2
});
slide.addText('Services Grid', {
  x: 1, y: 1.2, w: 14, h: 0.9,
  fontSize: 64, bold: false, color: colors.ink, fontFace: 'Segoe UI'
});

slide.addText(services.services.eyebrow.toUpperCase(), {
  x: 1, y: 2.4, w: 14, h: 0.3,
  fontSize: 10, color: colors.flame, bold: true, fontFace: 'Segoe UI', charSpacing: 2
});
slide.addText(services.services.title, {
  x: 1, y: 2.8, w: 14, h: 0.6,
  fontSize: 32, color: colors.ink, bold: false, fontFace: 'Segoe UI'
});

// Services grid - 3 columns, no gaps, border-right and border-bottom
for (let i = 0; i < 3; i++) {
  const service = services.services.items[i];
  const xPos = 0.5 + (i * 5);

  // Card with specific borders only
  slide.addShape(pres.ShapeType.rect, {
    x: xPos, y: 3.8, w: 5, h: 3.8,
    fill: { color: colors.silk },
    line: { type: 'none' }
  });

  // Right border (except last column)
  if (i < 2) {
    slide.addShape(pres.ShapeType.rect, {
      x: xPos + 4.99, y: 3.8, w: 0.02, h: 3.8,
      fill: { color: colors.mist }
    });
  }

  // Bottom border
  slide.addShape(pres.ShapeType.rect, {
    x: xPos, y: 7.59, w: 5, h: 0.02,
    fill: { color: colors.mist }
  });

  slide.addText(service.number, {
    x: xPos + 0.5, y: 4.3, w: 4, h: 0.4,
    fontSize: 20, color: colors.flame, bold: false, fontFace: 'Segoe UI'
  });

  slide.addText(service.title, {
    x: xPos + 0.5, y: 4.8, w: 4, h: 0.5,
    fontSize: 24, color: colors.ink, bold: false, fontFace: 'Segoe UI'
  });

  const desc = service.description.length > 120 ? service.description.substring(0, 120) + '...' : service.description;
  slide.addText(desc, {
    x: xPos + 0.5, y: 5.5, w: 4, h: 1.4,
    fontSize: 13, color: colors.smoke, fontFace: 'Segoe UI', lineSpacing: 20
  });

  // Hover indicator bar at bottom
  slide.addShape(pres.ShapeType.rect, {
    x: xPos, y: 7.56, w: 5, h: 0.05,
    fill: { color: colors.flame }
  });
}

// TESTIMONIALS
slide = pres.addSlide({ masterName: 'MASTER_SLIDE' });
slide.addText('06 — HOMEPAGE', {
  x: 1, y: 0.6, w: 14, h: 0.3,
  fontSize: 12, bold: true, color: colors.flame, fontFace: 'Segoe UI', charSpacing: 2
});
slide.addText('Testimonials', {
  x: 1, y: 1.2, w: 14, h: 0.9,
  fontSize: 64, bold: false, color: colors.ink, fontFace: 'Segoe UI'
});

const firstTestimonial = testimonials.testimonials.items[0];
slide.addShape(pres.ShapeType.rect, {
  x: 2, y: 2.8, w: 12, h: 4.5,
  fill: { color: colors.silk },
  line: { type: 'none' },
  shadow: { type: 'outer', blur: 30, offset: 10, angle: 90, opacity: 0.06, color: '000000' }
});

const quote = firstTestimonial.quote.length > 200 ? firstTestimonial.quote.substring(0, 200) + '...' : firstTestimonial.quote;
slide.addText(`"${quote}"`, {
  x: 3, y: 3.5, w: 10, h: 2.2,
  fontSize: 22, color: colors.ink, italic: true, fontFace: 'Segoe UI', lineSpacing: 36, align: 'center'
});

slide.addText(`— ${firstTestimonial.author}`, {
  x: 3, y: 6, w: 10, h: 0.4,
  fontSize: 16, color: colors.smoke, bold: false, align: 'center', fontFace: 'Segoe UI'
});
slide.addText(`${firstTestimonial.position}, ${firstTestimonial.company}`, {
  x: 3, y: 6.4, w: 10, h: 0.3,
  fontSize: 13, color: colors.mist, align: 'center', fontFace: 'Segoe UI'
});

// PRICING
slide = pres.addSlide({ masterName: 'MASTER_SLIDE' });
slide.addText('07 — HOMEPAGE', {
  x: 1, y: 0.6, w: 14, h: 0.3,
  fontSize: 12, bold: true, color: colors.flame, fontFace: 'Segoe UI', charSpacing: 2
});
slide.addText('Pricing', {
  x: 1, y: 1.2, w: 14, h: 0.9,
  fontSize: 64, bold: false, color: colors.ink, fontFace: 'Segoe UI'
});

slide.addText(pricing.hero.eyebrow.toUpperCase(), {
  x: 1, y: 2.4, w: 14, h: 0.3,
  fontSize: 10, color: colors.flame, bold: true, fontFace: 'Segoe UI', charSpacing: 2
});

// 3 pricing cards
for (let i = 0; i < 3; i++) {
  const plan = pricing.plans[i];
  const xPos = 0.8 + (i * 5);
  const isPopular = plan.popular;

  slide.addShape(pres.ShapeType.rect, {
    x: xPos, y: 3.2, w: 4.7, h: 4.5,
    fill: { color: isPopular ? colors.whisper : colors.pearl },
    line: { color: isPopular ? colors.flame : colors.mist, width: isPopular ? 2 : 1 },
    shadow: isPopular ? { type: 'outer', blur: 25, offset: 8, angle: 90, opacity: 0.08, color: colors.flame } : undefined
  });

  if (isPopular) {
    slide.addText('POPULAR', {
      x: xPos + 0.4, y: 3.6, w: 3.9, h: 0.3,
      fontSize: 11, color: colors.flame, bold: true, align: 'center', fontFace: 'Segoe UI', charSpacing: 2
    });
  }

  slide.addText(plan.name, {
    x: xPos + 0.4, y: isPopular ? 4.1 : 3.8, w: 3.9, h: 0.5,
    fontSize: 26, color: colors.ink, bold: false, fontFace: 'Segoe UI'
  });

  slide.addText(plan.price, {
    x: xPos + 0.4, y: isPopular ? 4.7 : 4.4, w: 3.9, h: 0.7,
    fontSize: 48, color: colors.flame, bold: false, fontFace: 'Segoe UI'
  });

  slide.addText(plan.period, {
    x: xPos + 0.4, y: isPopular ? 5.4 : 5.1, w: 3.9, h: 0.3,
    fontSize: 14, color: colors.smoke, fontFace: 'Segoe UI'
  });

  slide.addText(plan.tagline, {
    x: xPos + 0.4, y: isPopular ? 5.8 : 5.5, w: 3.9, h: 0.6,
    fontSize: 13, color: colors.smoke, italic: true, fontFace: 'Segoe UI', lineSpacing: 20
  });

  // CTA button - INK for popular, outline for others
  slide.addShape(pres.ShapeType.rect, {
    x: xPos + 0.4, y: 6.8, w: 3.9, h: 0.6,
    fill: { color: isPopular ? colors.ink : colors.pearl },
    line: isPopular ? { type: 'none' } : { color: colors.ink, width: 1 }
  });
  slide.addText(plan.ctaText.toUpperCase(), {
    x: xPos + 0.4, y: 6.8, w: 3.9, h: 0.6,
    fontSize: 12, color: isPopular ? colors.white : colors.ink,
    align: 'center', valign: 'middle', fontFace: 'Segoe UI', charSpacing: 1
  });
}

// CTA SECTION
slide = pres.addSlide({ masterName: 'MASTER_SLIDE' });
slide.addText('08 — HOMEPAGE', {
  x: 1, y: 0.6, w: 14, h: 0.3,
  fontSize: 12, bold: true, color: colors.flame, fontFace: 'Segoe UI', charSpacing: 2
});
slide.addText('Call to Action', {
  x: 1, y: 1.2, w: 14, h: 0.9,
  fontSize: 64, bold: false, color: colors.ink, fontFace: 'Segoe UI'
});

// Dark INK background
slide.addShape(pres.ShapeType.rect, {
  x: 1, y: 2.8, w: 14, h: 4.5,
  fill: { color: colors.ink }
});

slide.addText(cta.eyebrow.toUpperCase(), {
  x: 1, y: 3.4, w: 14, h: 0.3,
  fontSize: 11, color: colors.flame, bold: true, align: 'center', fontFace: 'Segoe UI', charSpacing: 2
});

slide.addText(cta.title, {
  x: 2, y: 3.9, w: 12, h: 1.2,
  fontSize: 48, bold: false, color: colors.white, align: 'center', fontFace: 'Segoe UI', lineSpacing: 56
});

slide.addText(cta.description, {
  x: 3, y: 5.3, w: 10, h: 0.7,
  fontSize: 18, color: 'B0B0B0', align: 'center', fontFace: 'Segoe UI', lineSpacing: 28
});

// Flame CTA button on dark background
slide.addShape(pres.ShapeType.rect, {
  x: 6, y: 6.3, w: 4, h: 0.7,
  fill: { color: colors.flame }
});
slide.addText(cta.cta.text.toUpperCase(), {
  x: 6, y: 6.3, w: 4, h: 0.7,
  fontSize: 14, color: colors.white, align: 'center', valign: 'middle', fontFace: 'Segoe UI', charSpacing: 1
});

// FOOTER
slide = pres.addSlide({ masterName: 'MASTER_SLIDE' });
slide.addText('09 — HOMEPAGE', {
  x: 1, y: 0.6, w: 14, h: 0.3,
  fontSize: 12, bold: true, color: colors.flame, fontFace: 'Segoe UI', charSpacing: 2
});
slide.addText('Footer', {
  x: 1, y: 1.2, w: 14, h: 0.9,
  fontSize: 64, bold: false, color: colors.ink, fontFace: 'Segoe UI'
});

slide.addShape(pres.ShapeType.rect, {
  x: 0, y: 3, w: 16, h: 3.5,
  fill: { color: colors.ink }
});

slide.addText('DesignWorks', {
  x: 1.5, y: 3.6, w: 5, h: 0.6,
  fontSize: 28, color: colors.white, bold: false, fontFace: 'Segoe UI'
});

slide.addText('Design Without The Drama', {
  x: 1.5, y: 4.3, w: 5, h: 0.4,
  fontSize: 16, color: '808080', fontFace: 'Segoe UI'
});

slide.addText('About  •  Services  •  Portfolio  •  Contact  •  Pricing', {
  x: 7, y: 4, w: 7.5, h: 0.4,
  fontSize: 13, color: '808080', fontFace: 'Segoe UI'
});

slide.addText('© 2025 DesignWorks. All rights reserved.', {
  x: 1.5, y: 5.6, w: 13, h: 0.3,
  fontSize: 12, color: '606060', align: 'center', fontFace: 'Segoe UI'
});

// CLOSING SLIDE
slide = pres.addSlide({ masterName: 'MASTER_SLIDE' });
slide.background = { color: colors.ink };

slide.addText('DesignWorks', {
  x: 1, y: 3.2, w: 14, h: 1.6,
  fontSize: 90, bold: false, color: colors.white, align: 'center', fontFace: 'Segoe UI'
});

slide.addText('Design That Actually Converts', {
  x: 1, y: 5.2, w: 14, h: 0.6,
  fontSize: 26, bold: false, color: '808080', align: 'center', fontFace: 'Segoe UI'
});

slide.addShape(pres.ShapeType.rect, {
  x: 6.4, y: 6.2, w: 3.2, h: 0.03,
  fill: { color: colors.flame }
});

slide.addText('www.designworks.agency', {
  x: 1, y: 6.8, w: 14, h: 0.5,
  fontSize: 18, color: '606060', align: 'center', fontFace: 'Segoe UI'
});

// Save presentation
pres.writeFile({ fileName: 'DesignWorks-Brand-Template.pptx' })
  .then(() => {
    console.log('✓ PowerPoint template created successfully!');
    console.log('  File: DesignWorks-Brand-Template.pptx');
    console.log('  Slides: 10 (Premium brand guidelines matching website aesthetic)');
    console.log('  Dimensions: 16" × 9"');
    console.log('  Styling: Light weights, sharp corners, INK primary buttons, Flame accents only');
    console.log('  Layout: Border-right/bottom grids, subtle shadows, actual website patterns');
    console.log('  Ready to use!');
  })
  .catch(err => {
    console.error('Error creating PowerPoint:', err);
  });
