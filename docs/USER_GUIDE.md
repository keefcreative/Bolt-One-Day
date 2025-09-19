# Content Improvement System User Guide

## Table of Contents

- [Getting Started](#getting-started)
- [Dashboard Overview](#dashboard-overview)
- [Step-by-Step Workflows](#step-by-step-workflows)
- [Using the Review Dashboard](#using-the-review-dashboard)
- [Applying Changes](#applying-changes)
- [Troubleshooting](#troubleshooting)
- [Best Practices](#best-practices)
- [FAQ](#faq)

## Getting Started

### Prerequisites

Before using the Content Improvement System, ensure you have:
- Next.js development environment set up
- OpenAI API key configured
- Content-improver system installed

### Initial Setup

1. **Verify System Installation**
```bash
# From the main project directory
npm run dev

# In a new terminal, check the content system
cd content-improver
npm run status
```

2. **Check System Health**
```bash
# Test all components
npm test

# View current configuration
npm run content
```

3. **Access the Web Interface**
- Open your browser to `http://localhost:3000`
- The content system APIs are available at `/api/content/*`

## Dashboard Overview

### Interactive CLI Dashboard

Start the interactive dashboard for the easiest experience:

```bash
cd content-improver
npm run content
```

The dashboard provides:
- **System Status**: Current workflow stage and progress
- **Quality Metrics**: Overall content scores and trends
- **Quick Actions**: One-click access to common operations
- **File Overview**: Status of all content files
- **Recent Activity**: Log of recent improvements and changes

### Web-Based Status

You can also check status through the web API:

```bash
curl http://localhost:3000/api/content/status
```

This returns comprehensive system information including:
- Health status
- Workflow progress
- Quality scores
- File statistics
- Configuration summary

## Step-by-Step Workflows

### Workflow 1: Complete Automated Process

**Best for**: Regular maintenance and bulk improvements

```bash
cd content-improver
npm run workflow
```

**What happens:**
1. **Analysis Phase**: Scans all JSON files in `/data` directory
2. **Improvement Phase**: Generates AI-powered enhancements
3. **Review Phase**: Opens browser dashboard for approval
4. **Implementation Phase**: Applies approved changes
5. **Validation Phase**: Confirms changes were successful

**Expected time**: 5-15 minutes depending on content volume

### Workflow 2: Step-by-Step Manual Process

**Best for**: First-time users or when you want more control

#### Step 1: Analyze Content
```bash
npm run analyze:all
```

**Output**: Analysis results showing:
- Quality scores for each content section
- Identified issues and problems
- Recommendations for improvement
- Brand voice compliance scores

#### Step 2: Generate Improvements
```bash
npm run improve:pending
```

**Output**: AI-generated suggestions for:
- Text improvements
- Structure changes
- SEO optimizations
- Brand voice adjustments

#### Step 3: Review Improvements
```bash
npm run review
```

**Output**: Opens web dashboard where you can:
- View before/after comparisons
- Approve or reject individual changes
- Add reviewer notes
- Bulk approve/reject sections

#### Step 4: Apply Changes
```bash
npm run implement:approved
```

**Output**: Applies all approved improvements and:
- Creates backup files
- Updates original JSON files
- Logs all changes
- Provides rollback information

### Workflow 3: Targeted Improvements

**Best for**: Working on specific content sections

```bash
# Analyze specific files
npm run analyze -- hero.json services.json

# Improve specific sections
npm run improve:assistant hero services

# Apply changes for specific sections
npm run implement -- --sections hero,services
```

## Using the Review Dashboard

### Accessing the Dashboard

The review dashboard automatically opens during the review phase, or you can open it manually:

```bash
npm run review:dashboard
```

### Dashboard Features

#### Section Cards
Each content section is displayed as a card showing:
- **Section name** (e.g., "Hero", "Services")
- **Current status** (Pending, Approved, Rejected)
- **Last improvement date**
- **Quality score** (if available)

#### Review Actions
For each section, you can:
- **View**: See detailed before/after comparison
- **Approve**: Accept all improvements for this section
- **Reject**: Decline all improvements for this section

#### Detailed Review View
Click "View" to see:
- **Original text** with issues highlighted
- **Improved text** with changes marked
- **Explanation** of why changes were suggested
- **Confidence score** for each improvement
- **Individual approval** for specific changes

#### Bulk Operations
- **Approve All**: Accept all pending improvements
- **Reject All**: Decline all pending improvements
- **Filter by Quality**: Show only sections below certain quality threshold

### Making Review Decisions

#### When to Approve
- Changes align with your brand voice
- Improvements clearly enhance readability
- SEO suggestions are relevant
- Technical issues are fixed

#### When to Reject
- Changes alter your intended meaning
- Tone doesn't match your brand
- Suggestions are too generic
- Changes remove important details

#### Partial Approval
You can approve some improvements while rejecting others within the same section.

## Applying Changes

### Automatic Application

After reviewing improvements in the dashboard:

```bash
npm run implement:approved
```

This will:
1. Create timestamped backups of original files
2. Apply all approved improvements
3. Validate file integrity
4. Log all changes
5. Update system status

### Manual Application

Apply specific improvements:

```bash
# Apply specific improvement IDs
npm run implement -- --ids improvement_001,improvement_002

# Apply improvements for specific sections
npm run implement -- --sections hero,services
```

### Safety Features

#### Automatic Backups
Every time changes are applied:
- Original files are backed up to `content-improver/backups/`
- Backups are timestamped for easy identification
- Up to 10 backups are kept per file

#### Rollback Capability
If you need to undo changes:

```bash
# View backup history
npm run history

# Rollback to previous version (when implemented)
npm run rollback -- --backup-id 2024-01-15_10-30-00
```

#### Validation Checks
Before applying changes, the system:
- Validates JSON syntax
- Checks file permissions
- Verifies backup creation
- Confirms data integrity

## Troubleshooting

### Common Issues

#### "System Not Available"
**Problem**: Content-improver system not found
**Solutions**:
```bash
# Check if system is installed
ls -la content-improver/

# Reinstall if necessary
cd content-improver && npm install

# Verify package.json exists
cat content-improver/package.json
```

#### "OpenAI API Error"
**Problem**: Issues with AI-powered improvements
**Solutions**:
```bash
# Check API key configuration
grep OPENAI_API_KEY .env.local

# Test API key validity
cd content-improver
node -e "console.log(process.env.OPENAI_API_KEY ? 'Key found' : 'Key missing')"

# Verify API quota
# Check your OpenAI dashboard for usage limits
```

#### "Permission Denied"
**Problem**: Cannot write to files or directories
**Solutions**:
```bash
# Check file permissions
ls -la data/

# Fix permissions if needed
chmod -R 755 data/
chmod -R 755 content-improver/
```

#### "Low Quality Scores"
**Problem**: Consistently low content quality ratings
**Solutions**:
1. Review your brand voice configuration
2. Check for technical jargon in content
3. Simplify sentence structure
4. Add clear calls-to-action
5. Run analysis in debug mode for detailed feedback

### Debug Mode

Enable detailed logging for troubleshooting:

```bash
# Enable debug output
DEBUG=content-improver:* npm run workflow

# Or for specific components
DEBUG=content-improver:analyzer npm run analyze:all
```

### Getting Help

If you encounter persistent issues:

1. **Check System Status**
```bash
npm run status
```

2. **View Recent Logs**
```bash
cat content-improver/logs/latest.log
```

3. **Test Individual Components**
```bash
npm run test
npm run analyze -- --file data/hero.json
npm run improve:assistant -- hero
```

4. **Reset System State** (use with caution)
```bash
npm run reset
```

## Best Practices

### Content Writing Guidelines

#### Before Using the System
1. **Write naturally**: Use conversational tone
2. **Be specific**: Avoid vague terms like "solutions" or "services"
3. **Include benefits**: Focus on what users gain
4. **Use active voice**: "We create" instead of "is created"
5. **Add personality**: Let your brand voice show

#### Using AI Improvements
1. **Review everything**: Never auto-apply without review
2. **Maintain authenticity**: Reject changes that don't sound like you
3. **Consider context**: AI might miss nuanced meaning
4. **Iterate gradually**: Start with small improvements
5. **Track results**: Monitor how changes affect user engagement

### Workflow Optimization

#### Regular Maintenance
```bash
# Weekly quality check
npm run analyze:all

# Monthly comprehensive review
npm run workflow

# After major content updates
npm run status && npm run workflow
```

#### Content Strategy
1. **Establish baseline**: Run initial analysis to understand current quality
2. **Set targets**: Aim for quality scores above 80
3. **Focus on high-impact sections**: Prioritize hero, services, and pricing
4. **Monitor trends**: Track quality improvements over time
5. **Document changes**: Keep notes on what works for your brand

### Quality Metrics

#### Understanding Scores

| Score Range | Quality Level | Recommended Action |
|-------------|---------------|-------------------|
| 90-100 | Excellent | Minor refinements only |
| 80-89 | Very Good | Selective improvements |
| 70-79 | Good | Address major issues |
| 60-69 | Fair | Significant revision needed |
| Below 60 | Poor | Complete rewrite recommended |

#### Key Quality Indicators
- **Clarity**: How easy is the content to understand?
- **Engagement**: Does it capture and hold attention?
- **Brand Voice**: Does it sound like your brand?
- **SEO**: Is it optimized for search engines?
- **Accessibility**: Can all users easily consume it?

## FAQ

### General Questions

**Q: How often should I run the content improvement system?**
A: For active websites, run analysis weekly and full improvements monthly. For stable content, quarterly reviews are usually sufficient.

**Q: Will the AI change my brand voice?**
A: No, when properly configured, the AI preserves your brand voice while improving clarity and effectiveness. Always review changes before applying.

**Q: Can I undo changes if I don't like them?**
A: Yes, every change creates automatic backups. You can restore previous versions from the backups directory.

**Q: How long does the process take?**
A: Analysis: 2-5 minutes, AI improvements: 5-10 minutes, Review: 10-30 minutes (depending on changes), Application: 1-2 minutes.

### Technical Questions

**Q: What happens to my original files?**
A: Original files are automatically backed up before any changes. The system never overwrites files without creating backups.

**Q: Can I run this on a production website?**
A: The system only modifies JSON data files, not the live website. Changes take effect when you deploy the updated files.

**Q: Does this work with different content management systems?**
A: Currently optimized for JSON-based content. For other CMSs, you'd need to export content to JSON format first.

**Q: What if I have very long content?**
A: The system handles content of all sizes, but very long content may be processed in chunks and take longer to improve.

### Troubleshooting Questions

**Q: Why are no improvements being generated?**
A: Check that your OpenAI API key is valid, you have available quota, and your content actually has room for improvement.

**Q: The review dashboard won't open**
A: Ensure you have write permissions in the content-improver directory and no other processes are using the port.

**Q: Changes aren't being applied**
A: Verify file permissions and that you've approved changes in the review dashboard before running the implement command.

---

## Getting Support

### Self-Help Resources
1. Check the [Configuration Guide](CONFIGURATION.md) for setup issues
2. Review the [Developer Guide](DEVELOPER_GUIDE.md) for technical details
3. Examine the [API Reference](API_REFERENCE.md) for integration questions

### System Diagnostics
```bash
# Comprehensive system check
cd content-improver
npm run status
npm test

# Check specific components
npm run analyze -- --debug
npm run improve:assistant -- --test
```

### Contact Information
For persistent issues or feature requests, consult your development team or the system documentation.

---

*Remember: The Content Improvement System is designed to enhance your content, not replace human creativity and judgment. Always review AI suggestions in the context of your brand and audience.*