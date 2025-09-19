# DesignWorks Bureau Email Style Guide

## Premium HTML Email Design System

This style guide defines the visual language for all DesignWorks Bureau email communications, maintaining consistency with our premium brand aesthetic while ensuring maximum email client compatibility.

---

## Core Design Principles

### 1. Sharp & Modern
- **No rounded corners** - All elements use sharp, clean edges (border-radius: 0)
- **Strong geometric shapes** - Rectangles, squares, precise lines
- **Intentional white space** - Generous padding creates breathing room
- **High contrast** - Clear visual hierarchy through stark contrasts

### 2. Premium & Minimal
- **Less is more** - Every element serves a purpose
- **Quality over quantity** - One powerful message beats multiple weak ones
- **Typography-first** - Let the words do the heavy lifting
- **Subtle sophistication** - Premium feel without ostentation

---

## Color Palette

### Primary Colors
```css
/* Core Brand Colors */
--ink:     #0A0A0A;  /* Primary text, headlines */
--smoke:   #1A1A1A;  /* Secondary headlines */
--ash:     #2A2A2A;  /* Tertiary text */
--pearl:   #FAFAFA;  /* Primary background */
--silk:    #F5F5F5;  /* Secondary background */
--mist:    #E8E8E8;  /* Borders, dividers */
```

### Accent Colors
```css
/* Action & Emphasis */
--flame:   #FF6B35;  /* Primary CTAs, links */
--ember:   #E5502C;  /* CTA hover states */
--coral:   #FF8964;  /* Secondary accents */
--ocean:   #004E64;  /* Alternative CTA */
```

### Email-Safe Implementation
```html
<!-- Primary CTA Button -->
<td style="background-color: #FF6B35;">

<!-- Text on Dark -->
<td style="background-color: #0A0A0A; color: #FAFAFA;">

<!-- Section Background -->
<table style="background-color: #F5F5F5;">
```

---

## Typography

### Font Stack
```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'SF Pro Display', sans-serif;
```

### Type Scale for Email

#### Hero Headlines
```html
<h1 style="
  font-size: 48px;
  line-height: 52px;
  font-weight: 300;
  letter-spacing: -1px;
  color: #0A0A0A;
  margin: 0 0 24px 0;
">Design That Converts</h1>
```

#### Section Headers
```html
<h2 style="
  font-size: 32px;
  line-height: 36px;
  font-weight: 400;
  letter-spacing: -0.5px;
  color: #1A1A1A;
  margin: 0 0 16px 0;
">Why DesignWorks?</h2>
```

#### Subheadings
```html
<h3 style="
  font-size: 20px;
  line-height: 28px;
  font-weight: 600;
  letter-spacing: -0.3px;
  color: #2A2A2A;
  margin: 0 0 12px 0;
">Fast Turnaround</h3>
```

#### Body Text
```html
<p style="
  font-size: 16px;
  line-height: 24px;
  font-weight: 300;
  color: #2A2A2A;
  margin: 0 0 16px 0;
">Professional design without the wait.</p>
```

#### Small Text / Captions
```html
<span style="
  font-size: 14px;
  line-height: 20px;
  font-weight: 400;
  color: #2A2A2A;
">*Terms and conditions apply</span>
```

---

## Layout Structure

### Container Template
```html
<!-- Main Container -->
<table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #FAFAFA;">
  <tr>
    <td align="center">
      <!-- Content Container (600px max) -->
      <table cellpadding="0" cellspacing="0" border="0" width="600" style="background-color: #FFFFFF;">
        <tr>
          <td style="padding: 40px 40px;">
            <!-- Content Here -->
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
```

### Section Spacing
- **Between sections**: 60px
- **Content padding**: 40px (desktop), 24px (mobile)
- **Element spacing**: 24px between major elements
- **Paragraph spacing**: 16px
- **List item spacing**: 12px

---

## Components

### Primary CTA Button
```html
<table cellpadding="0" cellspacing="0" border="0">
  <tr>
    <td align="center" style="background-color: #FF6B35;">
      <a href="#" style="
        display: inline-block;
        padding: 16px 48px;
        font-size: 16px;
        font-weight: 600;
        letter-spacing: -0.3px;
        color: #FFFFFF;
        text-decoration: none;
        text-transform: uppercase;
      ">Start Today</a>
    </td>
  </tr>
</table>
```

### Secondary CTA Button
```html
<table cellpadding="0" cellspacing="0" border="0">
  <tr>
    <td align="center" style="border: 2px solid #0A0A0A;">
      <a href="#" style="
        display: inline-block;
        padding: 14px 48px;
        font-size: 16px;
        font-weight: 600;
        letter-spacing: -0.3px;
        color: #0A0A0A;
        text-decoration: none;
        text-transform: uppercase;
      ">Learn More</a>
    </td>
  </tr>
</table>
```

### Text Link
```html
<a href="#" style="
  color: #FF6B35;
  text-decoration: none;
  font-weight: 600;
  border-bottom: 2px solid #FF6B35;
">View Portfolio →</a>
```

### Divider
```html
<table width="100%" cellpadding="0" cellspacing="0" border="0">
  <tr>
    <td style="padding: 32px 0;">
      <table width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td style="border-top: 1px solid #E8E8E8;"></td>
        </tr>
      </table>
    </td>
  </tr>
</table>
```

### Feature Box
```html
<table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #F5F5F5;">
  <tr>
    <td style="padding: 32px; border-left: 4px solid #FF6B35;">
      <h3 style="
        font-size: 20px;
        font-weight: 600;
        color: #0A0A0A;
        margin: 0 0 12px 0;
      ">48-Hour Delivery</h3>
      <p style="
        font-size: 16px;
        line-height: 24px;
        color: #2A2A2A;
        margin: 0;
      ">Get your designs fast without sacrificing quality.</p>
    </td>
  </tr>
</table>
```

### Statistics Block
```html
<table cellpadding="0" cellspacing="0" border="0" width="100%">
  <tr>
    <td align="center" style="padding: 20px;">
      <div style="
        font-size: 48px;
        font-weight: 300;
        color: #FF6B35;
        letter-spacing: -1px;
        margin: 0 0 8px 0;
      ">500+</div>
      <div style="
        font-size: 14px;
        font-weight: 600;
        color: #2A2A2A;
        text-transform: uppercase;
        letter-spacing: 1px;
      ">Happy Clients</div>
    </td>
  </tr>
</table>
```

---

## Email-Specific Patterns

### Header Template
```html
<table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #0A0A0A;">
  <tr>
    <td align="center" style="padding: 32px 40px;">
      <img src="logo-white.png" alt="DesignWorks Bureau" width="180" style="display: block;">
    </td>
  </tr>
</table>
```

### Footer Template
```html
<table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #F5F5F5;">
  <tr>
    <td align="center" style="padding: 40px;">
      <!-- Social Links -->
      <table cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td style="padding: 0 12px;">
            <a href="#" style="color: #2A2A2A; text-decoration: none;">LinkedIn</a>
          </td>
          <td style="padding: 0 12px;">
            <a href="#" style="color: #2A2A2A; text-decoration: none;">Twitter</a>
          </td>
          <td style="padding: 0 12px;">
            <a href="#" style="color: #2A2A2A; text-decoration: none;">Instagram</a>
          </td>
        </tr>
      </table>

      <!-- Address -->
      <p style="
        font-size: 14px;
        line-height: 20px;
        color: #2A2A2A;
        margin: 24px 0 0 0;
      ">
        DesignWorks Bureau<br>
        1 Ely Road, Ely<br>
        CB6 3JH, United Kingdom
      </p>

      <!-- Unsubscribe -->
      <p style="
        font-size: 12px;
        color: #2A2A2A;
        margin: 16px 0 0 0;
      ">
        <a href="#" style="color: #2A2A2A; text-decoration: underline;">Unsubscribe</a> |
        <a href="#" style="color: #2A2A2A; text-decoration: underline;">Update Preferences</a>
      </p>
    </td>
  </tr>
</table>
```

---

## Mobile Responsiveness

### Media Query
```html
<style>
@media only screen and (max-width: 600px) {
  /* Container */
  table[class="container"] {
    width: 100% !important;
  }

  /* Padding adjustments */
  td[class="mobile-padding"] {
    padding: 24px !important;
  }

  /* Text sizing */
  h1[class="mobile-heading"] {
    font-size: 32px !important;
    line-height: 36px !important;
  }

  /* Button sizing */
  a[class="mobile-button"] {
    padding: 14px 32px !important;
    font-size: 14px !important;
  }

  /* Stack columns */
  td[class="mobile-column"] {
    display: block !important;
    width: 100% !important;
  }
}
</style>
```

---

## Best Practices

### Do's
- ✅ Use table-based layouts for maximum compatibility
- ✅ Inline all CSS styles
- ✅ Use web-safe fallback fonts
- ✅ Test across multiple email clients
- ✅ Keep total email width at 600px max
- ✅ Use absolute URLs for all images
- ✅ Include alt text for all images
- ✅ Keep subject lines under 50 characters
- ✅ Use preheader text strategically

### Don'ts
- ❌ Don't use JavaScript
- ❌ Don't use CSS Grid or Flexbox
- ❌ Don't use background images on body
- ❌ Don't use forms or interactive elements
- ❌ Don't use custom fonts without fallbacks
- ❌ Don't use margins (use padding instead)
- ❌ Don't use CSS animations
- ❌ Don't embed videos directly

---

## Testing Checklist

### Email Clients to Test
- [ ] Gmail (Web, iOS, Android)
- [ ] Apple Mail (macOS, iOS)
- [ ] Outlook (2019, 365, Web)
- [ ] Yahoo Mail
- [ ] Samsung Mail
- [ ] Dark mode rendering

### Pre-Send Validation
- [ ] All links tested and working
- [ ] Images hosted and displaying
- [ ] Fallback text for blocked images
- [ ] Mobile responsive layout verified
- [ ] Spam score checked
- [ ] Subject line and preheader optimized
- [ ] Unsubscribe link present and working

---

## Example Templates

### 1. Welcome Email Structure
```
Header (Logo on dark)
↓
Hero Section (Large headline + subtitle)
↓
Introduction paragraph
↓
3 Key Benefits (Icon + Text blocks)
↓
Primary CTA Button
↓
Social Proof (Stats or testimonial)
↓
Secondary CTA
↓
Footer (Links + Unsubscribe)
```

### 2. Newsletter Structure
```
Header (Logo on white)
↓
Feature Article (Image + Headline + Text)
↓
Divider
↓
3 Secondary Articles (Thumbnail + Title + Link)
↓
CTA Section
↓
Footer
```

### 3. Transactional Email Structure
```
Header (Minimal)
↓
Status Message (Clear, prominent)
↓
Details Table (Clean data presentation)
↓
Next Steps (Clear actions)
↓
Support Information
↓
Footer (Simplified)
```

---

## Implementation Notes

### For Developers
1. Use MJML or similar framework for easier development
2. Test with Litmus or Email on Acid
3. Compress images (keep under 100KB each)
4. Total email size should stay under 102KB
5. Use CDN for image hosting
6. Implement tracking pixels appropriately

### For Designers
1. Design at 600px width
2. Export images at 2x for retina displays
3. Keep important content "above the fold" (first 350px)
4. Use system fonts for live text
5. Ensure 4.5:1 contrast ratio minimum
6. Design for dark mode compatibility

---

## Contact & Support

For questions about this style guide or email template development:
- Email: hello@designworks.com
- Documentation: internal.designworks.com/email-guide

---

*Last Updated: September 2025*
*Version: 1.0*