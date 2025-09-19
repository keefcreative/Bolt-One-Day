# Content Script System

## Overview

AI-powered content improvement system for DesignWorks Bureau using OpenAI Assistant API to enforce brand voice consistency.

**Brand Voice**: Gary Vaynerchuk's directness + Rory Sutherland's psychology  
**Assistant ID**: `asst_0GsBgIUHApbshi9n1SSBISKg`

## Active System Files

All active files are in the `/active` directory:

- **`assistant_section_processor.js`** - Main system that processes entire website sections
- **`brand_voice_validator.js`** - Rules-based brand voice analysis
- **`content_analyzer.js`** - Analyzes content for issues and opportunities
- **`implement_changes.js`** - Applies approved changes to website
- **`brand_voice_config.json`** - Brand voice configuration

## Quick Start

```bash
# Setup
npm install

# 1. Analyze current content
npm run analyze

# 2. Improve content using OpenAI Assistant
npm run improve:assistant

# 3. Review improvements in browser
npm run review:dashboard
# Opens improvements/unified_dashboard.html

# 4. Implement approved changes
npm run implement
```

## Environment Variables

Create `.env.local`:
```
OPENAI_API_KEY=your_key_here
OPENAI_BRANDVOICE_ASSISTANT_ID=asst_0GsBgIUHApbshi9n1SSBISKg
```

## How It Works

### 1. Analysis Phase
- Reads JSON data files from website
- Validates against brand voice rules
- Identifies jargon, weak CTAs, generic language
- Generates detailed report

### 2. Improvement Phase  
- Sends entire JSON sections to OpenAI Assistant
- Assistant processes ALL text fields maintaining structure
- Preserves word count (±2 words) to maintain layout
- Returns improved JSON with brand voice applied

### 3. Review Phase
- HTML dashboard shows original vs improved content
- Side-by-side comparison with change explanations
- Approve/reject individual changes
- Track conversion impact

### 4. Implementation Phase
- Applies approved changes to website data files
- Creates backup of original content
- Updates production JSON files

## Brand Voice Pillars

1. **HONEST** - No BS, plain language
2. **PRINCIPLED** - Design is a right, not luxury  
3. **HUMAN** - Real stories, empathy
4. **BALANCED** - Urgency with reassurance

## Key Transformations

**Never Use** → **Always Use**
- "leverage" → "use"
- "elevate" → "improve" 
- "transform" → "change"
- "seamless" → "easy"
- "innovative" → "new"
- "Get Started" → "Start Today"

## Word Count Constraints

Critical for maintaining layout:
- Headlines: EXACT match
- Short text (<20 words): ±2 words
- Medium text (20-50 words): ±5 words  
- Long text (>50 words): ±10%

## Stats Display Context

When processing metrics like:
```json
{
  "number": "48h",
  "label": "Average Delivery"
}
```

These display TOGETHER on the website. The label should complement, not repeat the number.

✅ GOOD: "48h" + "Average Delivery"  
❌ BAD: "48h" + "48-Hour Turnaround"

## Workflow Commands

```bash
# Full workflow
npm run full-workflow

# Individual steps
npm run analyze                    # Analyze current content
npm run improve:assistant          # Process with AI
npm run review:dashboard          # Open review interface
npm run implement                 # Apply changes

# Development
npm run test:assistant            # Test assistant connection
```

## Output Files

- `reports/` - Analysis reports (markdown + JSON)
- `improvements/` - AI improvements for review
- `improvements/sections/` - Individual section review pages
- `improvements/unified_dashboard.html` - Main review dashboard

## Archived Files

Old systems moved to `archive_2025_09/`:
- Old improver scripts
- Previous workflows
- Image generation system
- Deprecated documentation

## System Architecture

```
1. Read website JSON data
2. Analyze with brand_voice_validator.js
3. Send to OpenAI Assistant (entire sections)
4. Generate review HTML pages
5. Manual approve/reject
6. Apply approved changes
```

## Troubleshooting

### Assistant Returns JSON
This is correct - the assistant processes entire JSON files and returns improved JSON.

### Word Count Issues
Check assistant instructions include word count constraints.

### Timeout Errors
System processes one section at a time to avoid timeouts.

### Stats Redundancy
Assistant instructions explain number+label context to prevent redundant labels.

## Support

For issues or improvements, check:
- `/active/OPENAI_ASSISTANT_INSTRUCTIONS.md` - Assistant configuration
- `.env.local` - API keys configuration
- `improvements/unified_dashboard.html` - Review interface