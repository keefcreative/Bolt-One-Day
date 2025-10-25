# Microsoft Office Theme (.thmx) Research & Discovery

**Date:** October 14, 2025
**Project:** DesignWorks Brand Identity System
**Purpose:** Investigate automated brand application across Microsoft Office ecosystem

---

## Executive Summary

Microsoft Office themes (.thmx files) are significantly more complex than anticipated. A full theme file is not just colors and fonts - it's a comprehensive PowerPoint presentation template with slide masters, layouts, and visual assets. While technically possible to create programmatically, the complexity may not justify the effort for most branding projects.

**Key Finding:** Standard .thmx files are 500KB - 3MB in size and contain 200+ individual XML files and image assets.

---

## What is a .thmx File?

A `.thmx` file is a ZIP archive containing:
- Theme colors and fonts (XML)
- Slide master layouts (PowerPoint-specific)
- Multiple slide layout templates
- Theme variants (color scheme variations)
- Preview thumbnails (JPEG images)
- Relationship mappings between components

### File Structure Analysis

Analyzed Microsoft's official "Badge" theme (644KB):

```
Badge.thmx (ZIP archive)
├── [Content_Types].xml (20KB - defines MIME types for 271 files)
├── _rels/
│   └── .rels
├── docProps/
│   └── thumbnail.jpeg
├── theme/
│   ├── presentation.xml
│   ├── theme/
│   │   ├── theme1.xml (6KB - actual theme definition)
│   │   ├── themeManager.xml
│   │   ├── themeThumbnail.jpeg
│   │   ├── auxiliaryThemeThumbnail.jpeg
│   │   └── auxiliaryThemeThumbnailMedium.jpeg
│   ├── slideMasters/ (master slide templates)
│   │   └── slideMaster1.xml
│   └── slideLayouts/ (11 individual layout files)
│       ├── slideLayout1.xml (Title slide)
│       ├── slideLayout2.xml (Title and content)
│       ├── slideLayout3.xml (Section header)
│       └── ... (8 more layouts)
└── themeVariants/ (7 color variations)
    ├── variant1/ (complete duplicate structure)
    ├── variant2/
    ├── variant3/
    ├── variant4/
    ├── variant5/
    ├── variant6/
    └── variant7/
```

**Total files in Badge.thmx:** 271 files

---

## Core Theme Definition (theme1.xml)

The actual theme colors and fonts are defined in `theme/theme/theme1.xml` (only 6KB). This is the part we can reasonably generate.

### Key Components:

#### 1. Color Scheme (12 colors required)
```xml
<a:clrScheme name="ThemeName">
  <a:dk1>      <!-- Dark 1 - Primary text/lines -->
  <a:lt1>      <!-- Light 1 - Primary background -->
  <a:dk2>      <!-- Dark 2 - Secondary text -->
  <a:lt2>      <!-- Light 2 - Secondary background -->
  <a:accent1>  <!-- Primary brand color -->
  <a:accent2>  <!-- Secondary accent -->
  <a:accent3>  <!-- Tertiary accent -->
  <a:accent4>  <!-- Quaternary accent -->
  <a:accent5>  <!-- Additional accent -->
  <a:accent6>  <!-- Additional accent -->
  <a:hlink>    <!-- Hyperlink color -->
  <a:folHlink> <!-- Followed hyperlink color -->
</a:clrScheme>
```

**Important Discovery:** Dark1/Light1 should use `<a:sysClr>` (system colors) rather than `<a:srgbClr>`:
```xml
<!-- Correct approach -->
<a:dk1>
  <a:sysClr val="windowText" lastClr="000000" />
</a:dk1>
<a:lt1>
  <a:sysClr val="window" lastClr="FFFFFF" />
</a:lt1>
```

#### 2. Font Scheme
```xml
<a:fontScheme name="ThemeName">
  <a:majorFont>  <!-- Headings -->
    <a:latin typeface="FontName" panose="..." pitchFamily="34" charset="0"/>
    <!-- Plus 30+ script-specific font mappings for internationalization -->
  </a:majorFont>
  <a:minorFont>  <!-- Body text -->
    <a:latin typeface="FontName" panose="..." />
    <!-- Plus 30+ script-specific font mappings -->
  </a:minorFont>
</a:fontScheme>
```

**Font Compatibility:** Use Office-standard fonts (Calibri, Arial, etc.) for reliability. Custom fonts like "SF Pro Display" may not be recognized.

#### 3. Format Scheme
Defines default styles for shapes, lines, and effects:
- **Fill Styles** (3 required): Solid fill, gradient 1, gradient 2
- **Line Styles** (3 required): Thin, medium, thick lines
- **Effect Styles** (3 required): Subtle, moderate, intense (shadows/glows)
- **Background Fill Styles** (3 required): Solid, tinted, gradient backgrounds

#### 4. Theme Extensions
Microsoft themes include an extension block:
```xml
<a:extLst>
  <a:ext uri="{05A4C25C-085E-4340-85A3-A5531E510DB2}">
    <thm15:themeFamily xmlns:thm15="http://schemas.microsoft.com/office/thememl/2012/main"
                       name="ThemeName"
                       id="{GUID}"
                       vid="{GUID}" />
  </a:ext>
</a:extLst>
```

---

## What We Attempted

### Approach 1: Minimal Theme (Failed)
Created a basic .thmx with only:
- `theme/theme1.xml` (colors + fonts)
- `[Content_Types].xml`
- `_rels/.rels`

**Result:** 2.6KB file. PowerPoint reported corruption and offered to repair.

**Why it failed:** Missing required PowerPoint components:
- Slide masters
- Slide layouts
- Theme manager
- Presentation.xml

### Approach 2: Using Office-Standard Fonts (Failed)
Switched from "SF Pro Display" to "Calibri" to avoid font recognition issues.

**Result:** Same 2.6KB file, same corruption error.

**Why it failed:** File size indicates structural issues, not just font problems.

---

## Key Discoveries

### 1. Theme File Locations (macOS)
Microsoft Office themes are stored at:
```
/Applications/Microsoft Excel.app/Contents/Resources/Office Themes/
/Applications/Microsoft PowerPoint.app/Contents/Resources/Office Themes/
/Applications/Microsoft Word.app/Contents/Resources/Office Themes/
```

Contains themes like: Atlas.thmx, Badge.thmx, Berlin.thmx, Celestial.thmx, etc.

### 2. Typical File Sizes
- **Simple themes:** 500KB - 800KB
- **Complex themes:** 1MB - 3MB
- **Our minimal attempt:** 2.6KB

The 200x size difference indicates we're missing ~99% of the required structure.

### 3. What Makes Themes Large
- **Slide layouts:** Each theme has 11+ pre-designed slide layouts (title slide, content slide, comparison, etc.)
- **Theme variants:** 7 complete color variations of the entire theme
- **Images:** Thumbnail previews (JPEG) at multiple resolutions
- **Redundancy:** Each variant contains duplicate copies of slide masters and layouts

### 4. Theme vs Template
Important distinction discovered:

| File Type | Extension | Purpose | Complexity |
|-----------|-----------|---------|------------|
| **Theme** | .thmx | Colors + fonts + slide designs | Very high (200+ files) |
| **Template** | .potx/.dotx/.xltx | Pre-styled document starting point | Medium (10-20 files) |

**Conclusion:** Templates are more practical for brand application.

---

## Technical Specifications

### Color Definition Methods

1. **RGB Color:**
```xml
<a:srgbClr val="FF6B35"/>
```

2. **System Color (preferred for dk1/lt1):**
```xml
<a:sysClr val="windowText" lastClr="000000"/>
```

3. **Scheme Color (for referencing other theme colors):**
```xml
<a:schemeClr val="accent1">
  <a:lumMod val="110000"/>  <!-- Luminosity modification -->
  <a:satMod val="105000"/>  <!-- Saturation modification -->
</a:schemeClr>
```

### Effect Measurements
Office uses EMUs (English Metric Units): 914,400 EMUs = 1 inch

**Shadow effect mapping:**
- CSS: `0 20px 60px rgba(0,0,0,0.05)`
- EMU blur: `228600` (60px * 914400 / 240 DPI)
- EMU distance: `76200` (20px * 914400 / 240 DPI)
- Alpha: `5000` (5% = 5000/100000)

### Line Weights
```xml
<a:ln w="6350">   <!-- 0.5pt = 1px equivalent -->
<a:ln w="12700">  <!-- 1pt = 2px equivalent -->
<a:ln w="19050">  <!-- 1.5pt = 3px equivalent -->
```

---

## Why Full .thmx Generation is Impractical

### Complexity Factors:
1. **Slide Master Design:** Requires layout expertise - where should placeholders go?
2. **11+ Slide Layouts:** Each needs custom XML defining text boxes, image areas, footers
3. **Theme Variants:** Manually designing 7 color variations requires color theory expertise
4. **Relationship Files:** Each component needs proper relationship mappings (.rels files)
5. **Content Type Definitions:** 20KB XML file mapping all 271 files to MIME types
6. **Testing:** Must test in PowerPoint, Word, and Excel separately
7. **Maintenance:** Updates to brand colors require regenerating entire structure

### Estimated Development Time:
- **Minimal viable theme:** 20-40 hours
- **Professional quality theme:** 60-100 hours
- **With proper testing:** 100+ hours

---

## Recommended Alternatives

### Option 1: Template Files (.potx, .dotx, .xltx) ⭐ RECOMMENDED
**What:** Pre-styled document files with brand applied

**Pros:**
- Much simpler structure (10-20 files vs 200+)
- Can be created in Office GUI, then saved
- Directly usable - users open template instead of blank file
- Separate files for PowerPoint/Word/Excel (appropriate for each)

**Cons:**
- Need separate template for each Office app
- Not as "automatic" as themes (users must open template)

**How to create:**
1. Open PowerPoint/Word/Excel
2. Design first page/slide with brand colors, fonts, logo
3. Add additional master pages/slides as needed
4. Save As > Template (.potx/.dotx/.xltx)

### Option 2: Color Palette + Style Guide
**What:** PDF/web document with exact brand specifications

**Contents:**
- Hex color codes with Office color picker instructions
- Font names and weights
- Shadow/effect specifications
- Screenshots of correct formatting

**Pros:**
- Simple to create and maintain
- Universal (works for all apps, not just Office)
- Can include print/web specifications too

**Cons:**
- Manual application required
- Relies on user compliance

### Option 3: Partial Theme (Colors + Fonts Only)
**What:** Simplified .thmx with just theme1.xml

**Pros:**
- Defines colors and fonts centrally
- Small file size (under 10KB)
- Can be applied to existing presentations

**Cons:**
- May show "corrupt file" warning (requires "repair")
- No slide layouts (users still design from scratch)
- Uncertain compatibility across Office versions

**Status:** Our 2.6KB theme could potentially work if PowerPoint's auto-repair generates missing components.

### Option 4: Commercial Theme Tools
**Tools to investigate:**
- Microsoft Theme Generator (if exists)
- Third-party Office theme creators
- Template marketplaces (GraphicRiver, Envato)

**Pros:**
- Professional results
- No development time

**Cons:**
- Costs money
- Less control over output

---

## If You Decide to Pursue Full .thmx Creation

### Recommended Approach:

1. **Start with existing theme:**
   - Copy Microsoft's simplest theme (e.g., Badge.thmx)
   - Extract all files
   - Modify only the colors in theme1.xml files
   - Repackage as ZIP with .thmx extension

2. **Modify incrementally:**
   - Test after each change
   - Keep backup of working version
   - Don't modify slide masters until colors/fonts work

3. **Essential files to modify:**
   ```
   theme/theme/theme1.xml           (main theme)
   themeVariants/variant1/theme/theme/theme1.xml
   themeVariants/variant2/theme/theme/theme1.xml
   ... (all 7 variants)
   ```

4. **Files that can stay untouched:**
   - All slideLayout*.xml files
   - All slideMaster*.xml files
   - All relationship files (.rels)
   - Thumbnails (will be regenerated by Office)

### Packaging Requirements:
```bash
# Must use specific ZIP compression
zip -0 -X theme.thmx [Content_Types].xml    # No compression for content types
zip -9 -r -X theme.thmx _rels/ theme/        # Max compression for rest
```

---

## DesignWorks Brand Specifications

For reference, here are the brand colors that would be mapped:

### Color Mapping:
```
dk1 (Dark 1):        #0A0A0A (ink)
lt1 (Light 1):       #FAFAFA (pearl)
dk2 (Dark 2):        #1A1A1A (smoke)
lt2 (Light 2):       #F5F5F5 (silk)
accent1 (Primary):   #FF6B35 (flame) - brand primary
accent2:             #004E64 (ocean)
accent3:             #E5502C (ember)
accent4:             #FF8964 (coral)
accent5:             #2A2A2A (ash)
accent6:             #E8E8E8 (mist)
hlink:               #FF6B35 (flame)
folHlink:            #E5502C (ember)
```

### Typography:
- **Headings:** SF Pro Display (or fallback: Calibri Light)
- **Body:** SF Pro Display (or fallback: Calibri)
- **Design note:** All border-radius should be 0 (sharp edges)

### Effects:
- **Premium shadow:** 0 20px 60px rgba(0,0,0,0.05)
- **Premium-lg shadow:** 0 30px 80px rgba(0,0,0,0.06)
- **Card-hover shadow:** 0 25px 50px rgba(0,0,0,0.08)

---

## Resources & References

### Official Documentation:
- [Office Open XML Spec](http://www.ecma-international.org/publications/standards/Ecma-376.htm)
- [Microsoft: Create PowerPoint themes](https://support.microsoft.com/en-us/office/create-your-own-theme-in-powerpoint-83e68627-2c17-454a-9fd8-62deb81951a6)

### Theme Locations:
- **Windows:** `C:\Program Files\Microsoft Office\Root\Document Themes 16`
- **macOS:** `/Applications/Microsoft [App].app/Contents/Resources/Office Themes/`
- **Custom themes:** `~/AppData/Roaming/Microsoft/Templates/Document Themes` (Win)

### File Format:
- **Container:** ZIP archive (rename .zip to .thmx)
- **Standard:** Office Open XML (ISO/IEC 29500)
- **XML Namespace:** `http://schemas.openxmlformats.org/drawingml/2006/main`

---

## Conclusion

Creating production-ready .thmx files programmatically is **technically feasible but practically impractical** for most branding projects. The complexity-to-benefit ratio is poor.

**For DesignWorks client projects:**
- **Small clients:** Provide style guide PDF with hex codes
- **Medium clients:** Create PowerPoint/Word templates (.potx/.dotx)
- **Large clients:** Consider commercial template development services
- **Enterprise clients:** May warrant custom .thmx development (budget 80-100 hours)

**The minimal theme approach** (our 2.6KB file) could work if PowerPoint's repair function successfully generates missing components. Worth a quick test on a non-critical project, but don't rely on it for client deliverables.

---

## Next Steps (If Pursuing)

- [ ] Test PowerPoint "repair" function on our 2.6KB theme
- [ ] If repair works: Document what PowerPoint auto-generates
- [ ] If repair fails: Extract Badge.thmx and modify only colors
- [ ] Create test suite (PowerPoint, Word, Excel on Mac/Windows)
- [ ] Build automation script if manual approach succeeds
- [ ] Estimate realistic timeline for client projects

---

**Document prepared by:** Claude Code
**Based on:** Analysis of Microsoft Office Badge.thmx (644KB, 271 files)
**Technology:** Office Open XML (ISO/IEC 29500)
