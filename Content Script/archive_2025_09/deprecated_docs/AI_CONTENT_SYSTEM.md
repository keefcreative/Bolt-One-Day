# AI-Powered Content Improvement System

## Overview
An advanced AI system that analyzes and improves content to match your brand voice using OpenAI or Anthropic Claude.

## Features

### 🤖 1. AI Content Analysis
Analyzes existing content and suggests improvements:
- Identifies weak brand voice elements
- Removes corporate jargon
- Adds power words and signature phrases
- Improves sentence structure and flow
- Estimates score improvements

### ✨ 2. AI Content Generation
Generates new content from scratch:
- Hero headlines and descriptions
- Call-to-action variations
- Customer testimonials
- Feature descriptions
- Problem/solution statements

### 🎯 3. Brand Voice Integration
The AI is trained on your specific brand voice:
- **Voice Pillars**: Honest, Principled, Human, Balanced
- **Personality**: Gary Vaynerchuk meets Rory Sutherland
- **Signature Phrases**: "No drama", "Design that works", etc.
- **Power Words**: Start, build, create, transform
- **Forbidden Jargon**: Automatically replaced

## Setup

### 1. Add API Key
Add to `.env.local`:
```bash
# For OpenAI (GPT-4)
OPENAI_API_KEY=your-api-key-here

# OR for Anthropic (Claude)
ANTHROPIC_API_KEY=your-api-key-here
```

### 2. Commands

#### Analyze Existing Content
```bash
# Analyze single file
npm run ai:analyze ../data/hero.json

# Analyze all files
npm run ai:analyze ../data

# Output:
# - Detailed analysis of each text field
# - Suggested improvements with explanations
# - Score improvement estimates
# - HTML/Markdown reports
```

#### Generate New Content
```bash
# Generate hero section
node ai_content_improver.js generate hero "Premium design for startups"

# Generate CTA variations
node ai_content_improver.js generate cta "Start your design subscription"

# Generate testimonial
node ai_content_improver.js generate testimonial "Happy customer story"

# Generate feature description
node ai_content_improver.js generate feature "Unlimited revisions"
```

#### Improve Specific Fields
```bash
# Improve a specific field in a file
node ai_content_improver.js improve ../data/services.json services.title
```

## Example Improvements

### Before (Score: 20%)
> "We leverage cutting-edge synergies to deliver seamless design solutions that revolutionize your brand ecosystem."

### After (Score: 85%)
> "We've helped 200+ startups look like Fortune 500 companies. No contracts, no drama, just great design that converts visitors into customers. Start today and see designs in 48 hours."

### What Changed:
- ✅ Removed jargon: "leverage", "synergies", "seamless", "revolutionize"
- ✅ Added specific proof: "200+ startups"
- ✅ Added signature phrase: "no drama"
- ✅ Made it outcome-focused: "converts visitors into customers"
- ✅ Added specific timeline: "48 hours"
- ✅ Used "we" and "you" for human touch

## AI Prompting Strategy

The system uses a sophisticated prompt that includes:

1. **Brand Voice Training**: Complete brand guidelines
2. **Writing Style**: Gary Vaynerchuk's directness + Rory Sutherland's psychology
3. **Specific Rules**: 
   - Short sentences mixed with longer ones
   - Start with action verbs
   - Focus on customer benefit
   - Use "you" frequently
   - Include specific numbers
   - End with clear value

## Integration with Review System

The AI improvements can be:
1. **Previewed**: See all changes before applying
2. **Reviewed**: Accept/reject each suggestion
3. **Applied**: Update files automatically
4. **Rolled Back**: Undo if needed

```bash
# Full workflow
npm run ai:analyze          # Get AI suggestions
npm run review:preview       # Preview changes
npm run review              # Interactive approval
npm run rollback            # Undo if needed
```

## Expected Results

With AI-powered improvements:
- **Before**: 3-40% brand voice scores
- **After**: 70-95% brand voice scores
- **Time Saved**: Hours of manual copywriting
- **Consistency**: Uniform voice across all content

## Cost Estimation

- **OpenAI GPT-4**: ~$0.01-0.03 per content field
- **Anthropic Claude**: ~$0.01-0.02 per content field
- **Full site analysis**: ~$1-3
- **ROI**: Massive time savings vs manual copywriting

## Mock Mode

If no API key is configured, the system runs in mock mode with realistic examples showing what the AI would generate. This is useful for:
- Testing the system
- Understanding capabilities
- Training team members
- Demo purposes

## Best Practices

1. **Start Small**: Test with one file first
2. **Review Carefully**: AI suggestions need human oversight
3. **Iterate**: Run multiple passes for best results
4. **Customize**: Adjust brand_voice_config.json as needed
5. **Track Changes**: Use git to track all modifications

## Limitations

- Requires API key (OpenAI or Anthropic)
- API costs apply for real usage
- AI suggestions should be reviewed by humans
- Works best with English content
- May need fine-tuning for specific industries

---

*The AI Content System transforms your content from corporate jargon to compelling brand voice that converts.*