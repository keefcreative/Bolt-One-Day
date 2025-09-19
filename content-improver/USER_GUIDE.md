# 📘 User Guide - AI Content & Image Management System

## Table of Contents
1. [Getting Started](#getting-started)
2. [Content Analysis Workflow](#content-analysis-workflow)
3. [AI Enhancement Workflow](#ai-enhancement-workflow)
4. [Image Generation Workflow](#image-generation-workflow)
5. [Complete Automation](#complete-automation)
6. [Best Practices](#best-practices)
7. [Examples & Recipes](#examples--recipes)
8. [FAQ](#faq)

---

## 🚀 Getting Started

### First Time Setup

1. **Install the system:**
```bash
cd "Bolt-One-Day/Content Script"
npm install
```

2. **Configure your brand:**
Edit `brand_voice_config.json` with your brand values

3. **Add API keys:**
Create `.env.local` in parent directory with required keys

4. **Test the system:**
```bash
npm run analyze
```

### Daily Workflow

```bash
# Morning: Check brand consistency
npm run analyze

# Review suggestions
npm run review:preview

# Apply improvements
npm run review:approve

# Generate new visuals
node freepik_client.js workflow "Portfolio"
```

---

## 📊 Content Analysis Workflow

### Step 1: Analyze Your Content

```bash
npm run analyze
```

This command will:
- Scan all website content files
- Check against brand voice guidelines
- Generate consistency scores
- Create detailed reports

**Output locations:**
- HTML Report: `reports/analysis.html`
- Markdown: `reports/analysis.md`
- JSON Data: `reports/analysis.json`

### Step 2: Review the Analysis

```bash
npm run review:preview
```

Opens an interactive dashboard showing:
- Overall brand score (target: 80+/100)
- Section-by-section breakdown
- Specific issues identified
- AI-generated suggestions

### Step 3: Understanding Scores

| Score Range | Meaning | Action Required |
|------------|---------|-----------------|
| 80-100 | Excellent | Minor tweaks only |
| 60-79 | Good | Some improvements needed |
| 40-59 | Fair | Significant revisions |
| 0-39 | Poor | Major rewrite recommended |

### Common Issues Detected

1. **Jargon Usage** - Corporate speak that alienates readers
2. **Passive Voice** - Reduces impact and clarity
3. **Long Sentences** - Hard to read and understand
4. **Missing CTAs** - No clear next steps
5. **Inconsistent Tone** - Switching between formal/casual

---

## 🤖 AI Enhancement Workflow

### Using OpenAI Assistant

The system uses your configured OpenAI Assistant for brand-consistent improvements.

```bash
# Test the assistant
node assistant_content_improver.js test

# Enhance specific content
node assistant_content_improver.js improve "Your text here"
```

### Enhancement Types

#### 1. Hero Content
```javascript
// For main headlines and taglines
const enhanced = await improver.improveContent(text, 'hero');
```

#### 2. Service Descriptions
```javascript
// For explaining what you offer
const enhanced = await improver.improveContent(text, 'service');
```

#### 3. Call-to-Actions
```javascript
// For conversion-focused copy
const enhanced = await improver.improveContent(text, 'cta');
```

### Batch Processing

```bash
# Process all content at once
node integrated_workflow.js
```

This will:
1. Analyze all content
2. Generate improvements
3. Create review dashboard
4. Wait for approval
5. Apply changes

---

## 🎨 Image Generation Workflow

### Choosing the Right Tool

| Need | Use | Why |
|------|-----|-----|
| Text on screens | Freepik Stock | Real photos = readable text |
| Custom scenes with text | Freepik DALL-E 3 | Better text rendering |
| Abstract/artistic | Replicate Flux | Creative freedom |
| Quick mockups | Freepik Mockups | Professional templates |

### Freepik Suite (Recommended)

#### Basic Generation
```bash
# Generate single image
node freepik_client.js generate "Modern office with MacBook"

# Search stock assets
node freepik_client.js search "laptop mockup"

# Complete workflow
node freepik_client.js workflow "Portfolio"
```

#### Advanced Options
```javascript
const client = new FreepikClient();

// For readable text
const result = await client.generateImage(prompt, {
  model: 'dalle3',      // Best for text
  aspect_ratio: '16:9', // Wide format
  style: 'photo'        // Photorealistic
});

// For artistic style
const result = await client.generateImage(prompt, {
  model: 'mystic',      // Artistic model
  style: 'illustration'
});
```

### Replicate Flux

```bash
# Generate portfolio images
node generate_real_images.js
```

Best for:
- Environmental shots
- Abstract concepts
- When text isn't critical

### Smart Prompt Engineering

```bash
# Generate optimized prompts
node prompt_engineer.js
```

The system automatically:
- Adds brand colors (#F97316 orange)
- Includes professional photography terms
- Avoids common AI artifacts
- Optimizes for your use case

---

## 🔄 Complete Automation

### One-Command Workflow

```bash
node integrated_workflow.js
```

This runs the complete 5-step process:

1. **Analyze** - Scans all content
2. **Recommend** - Generates AI suggestions  
3. **Review** - Creates approval dashboard
4. **Implement** - Applies changes
5. **Validate** - Confirms improvements

### Scheduling Automation

Add to your crontab or task scheduler:

```bash
# Daily brand check at 9 AM
0 9 * * * cd /path/to/Content\ Script && npm run analyze

# Weekly full workflow
0 10 * * 1 cd /path/to/Content\ Script && node integrated_workflow.js
```

### CI/CD Integration

Add to your deployment pipeline:

```yaml
# GitHub Actions example
- name: Check Brand Voice
  run: |
    cd "Content Script"
    npm install
    npm run analyze
    if [ $SCORE -lt 80 ]; then
      echo "Brand score too low"
      exit 1
    fi
```

---

## ✨ Best Practices

### Content Writing

1. **Keep it conversational** - Write like you talk
2. **Use active voice** - "We create" not "is created by"
3. **Short sentences** - Average 15-20 words
4. **Clear CTAs** - "Start your project" not "Learn more"
5. **Show personality** - Your brand voice matters

### Image Generation

1. **Be specific** - Detailed prompts = better results
2. **Include context** - "professional office" not just "office"
3. **Specify lighting** - "natural window light" improves quality
4. **Add brand elements** - Include your orange (#F97316) accent
5. **Avoid text in AI** - Use stock photos for readable text

### Workflow Optimization

1. **Batch process** - Analyze everything at once
2. **Review before applying** - Always check AI suggestions
3. **Test incrementally** - Start with one section
4. **Document changes** - Keep track of what worked
5. **Iterate regularly** - Continuous improvement

---

## 🎯 Examples & Recipes

### Recipe 1: Portfolio Update

```bash
# 1. Generate new mockup
node freepik_client.js generate "MacBook Pro showing portfolio website, orange notebook beside, minimal desk"

# 2. Analyze portfolio text
node content_analyzer.js --file portfolio.tsx

# 3. Apply improvements
node assistant_content_improver.js improve portfolio

# 4. Validate changes
npm run analyze
```

### Recipe 2: New Service Launch

```bash
# 1. Write initial copy
echo "Your service description" > new_service.txt

# 2. Enhance with AI
node ai_content_improver.js < new_service.txt

# 3. Generate hero image
node freepik_client.js workflow "New Service"

# 4. Final validation
node brand_voice_validator.js analyze new_service.txt
```

### Recipe 3: Brand Consistency Audit

```bash
# 1. Full analysis
npm run analyze

# 2. Generate detailed report
node report_generator.js --format=html --aggressive

# 3. Review low-scoring sections
open reports/analysis.html

# 4. Batch improve
node integrated_workflow.js --threshold=60
```

### Recipe 4: A/B Testing Copy

```javascript
// Generate variations
const improver = new AssistantContentImprover();

const variations = await Promise.all([
  improver.improveContent(original, 'hero', { tone: 'bold' }),
  improver.improveContent(original, 'hero', { tone: 'friendly' }),
  improver.improveContent(original, 'hero', { tone: 'professional' })
]);

// Test each variation
variations.forEach((text, i) => {
  console.log(`Variation ${i + 1}: Score ${validator.analyze(text)}`);
});
```

---

## ❓ FAQ

### General Questions

**Q: How much does this cost to run?**
A: Typical monthly cost:
- OpenAI: $5-10 (content analysis)
- Freepik: $5-15 (images)
- Total: ~$10-25/month for active use

**Q: Can I use this without all the APIs?**
A: Yes, each component works independently:
- Content analysis works without image generation
- Freepik works without OpenAI
- Basic validation works without any APIs

**Q: How do I know if improvements are working?**
A: Track these metrics:
- Brand score increase (target: 80+)
- Engagement metrics on website
- Conversion rates
- User feedback

### Technical Questions

**Q: Why does text look gibberish in AI images?**
A: Diffusion models (Flux) struggle with text. Solutions:
- Use Freepik stock photos (real text)
- Use DALL-E 3 model (better text rendering)
- Add text overlay in post-production

**Q: Can I customize the brand voice rules?**
A: Yes! Edit `brand_voice_config.json`:
```json
{
  "customRules": {
    "industry": "tech",
    "audience": "startups",
    "formality": 0.3
  }
}
```

**Q: How do I add new content types?**
A: Extend the analyzer:
```javascript
// In content_analyzer.js
contentTypes.blog = {
  idealLength: 1500,
  tone: 'informative',
  structure: 'problem-solution'
};
```

### Troubleshooting

**Q: "API key not found" error**
A: Check `.env.local` is in parent directory (not Content Script)

**Q: Images not generating**
A: Verify:
- API key is valid
- You have credits remaining
- Network connection is stable

**Q: Low brand scores consistently**
A: Try:
- Reviewing brand guidelines
- Running aggressive mode
- Checking for technical jargon
- Simplifying sentence structure

**Q: Assistant not responding correctly**
A: Ensure:
- Assistant ID is correct in `.env.local`
- Assistant is configured with your brand voice
- Using v2 API with proper headers

---

## 📚 Additional Resources

### Documentation
- [README.md](README.md) - Technical overview
- [API Documentation](docs/API.md) - Developer reference
- [Brand Config](brand_voice_config.json) - Your settings

### Support Files
- [System Status](reports/COMPLETE_SYSTEM_STATUS.md) - Current metrics
- [Workflow Architecture](WORKFLOW_ARCHITECTURE.md) - System design
- [AI System](AI_CONTENT_SYSTEM.md) - AI implementation

### Getting Help
- Review this guide first
- Check generated reports for specific issues
- Contact: team@designworks.com

---

## 🎓 Advanced Tips

### Performance Optimization
```bash
# Process in parallel
node integrated_workflow.js --parallel --batch-size=10

# Use caching
node content_analyzer.js --cache --ttl=3600

# Limit scope
npm run analyze -- --files="hero,services"
```

### Custom Integrations
```javascript
// Webhook on content change
app.post('/content-updated', async (req, res) => {
  const analysis = await analyzer.analyze(req.body.content);
  if (analysis.score < 80) {
    const improved = await improver.improve(req.body.content);
    res.json({ improved, score: analysis.score });
  }
});
```

### Monitoring & Analytics
```javascript
// Track improvement metrics
const metrics = {
  before: await analyzer.analyze(original),
  after: await analyzer.analyze(improved),
  improvement: ((after.score - before.score) / before.score) * 100
};
console.log(`Improvement: ${metrics.improvement.toFixed(1)}%`);
```

---

**Remember:** This system is a tool to enhance your content, not replace human creativity. Always review AI suggestions before implementing.

*Last updated: 2025-08-28 | Version 1.0.0*