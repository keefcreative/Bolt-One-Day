# Brand Voice Reporting & Review System

## Overview
A comprehensive system for analyzing, reporting, and improving brand voice consistency across JSON content files.

## Quick Start

### 1. Basic Analysis
```bash
npm run analyze                 # Simple console output
npm run analyze:report          # Detailed console report
```

### 2. Generate Reports
```bash
npm run analyze:html            # Generate HTML report (reports/analysis.html)
npm run analyze:md              # Generate Markdown report (reports/analysis.md)
```

### 3. Review & Improve Voice
```bash
npm run review:preview          # Preview all suggested improvements
npm run review                  # Interactive review mode
npm run update:voice            # Apply improvements automatically
npm run rollback                # Undo last changes if needed
```

## Features

### 📊 Reporting Capabilities
- **Multiple Formats**: HTML, Markdown, JSON, Console
- **Executive Summary**: Key metrics at a glance
- **Voice Pillar Breakdown**: Scores for Honest, Principled, Human, Balanced
- **File-by-File Analysis**: Detailed breakdown per file
- **Priority Recommendations**: Actionable improvement suggestions
- **Jargon Tracking**: Identifies corporate jargon with replacements

### 🔍 Review System
- **Preview Mode**: See all changes before applying
- **Interactive Review**: Approve/reject each change individually
- **Batch Processing**: Handle multiple files efficiently
- **Visual Diffs**: Side-by-side comparison of changes
- **Change History**: Track all approved modifications

### 🔄 Safety Features
- **Automatic Backups**: Created before any changes
- **Rollback Capability**: Easy restoration to previous state
- **Change Tracking**: Complete audit trail in `approved_changes.json`

## Report Interpretation

### Overall Score Ranges
- **80-100%**: ✅ Excellent - Strong brand voice consistency
- **60-79%**: ⚠️ Good - Some improvements needed
- **40-59%**: ⚠️ Fair - Significant improvements recommended
- **0-39%**: ❌ Poor - Major voice alignment needed

### Voice Pillars
- **Honest**: Plain language, no jargon, transparent
- **Principled**: Values-driven, ethical, trustworthy
- **Human**: Empathetic, conversational, relatable
- **Balanced**: Professional yet approachable

## Advanced Usage

### Custom Analysis
```bash
# Analyze specific directory
node content_analyzer.js /path/to/data --report html --output custom-report.html

# Preview changes for specific file
node voice_review.js --preview /path/to/file.json

# Interactive review for directory
node voice_review.js --interactive /path/to/data/
```

### Workflow Example
1. **Analyze**: `npm run analyze:html`
2. **Review Report**: Open `reports/analysis.html`
3. **Preview Changes**: `npm run review:preview`
4. **Interactive Review**: `npm run review`
5. **Apply Approved**: Select 'y' for changes you want
6. **Verify**: Re-run analysis to see improvements
7. **Rollback if Needed**: `npm run rollback`

## Files Generated

- `reports/analysis.html` - Beautiful HTML report
- `reports/analysis.md` - Markdown documentation
- `approved_changes.json` - Change history tracking
- `rollback.json` - Rollback information (temporary)
- `*.backup.json` - Backup files before modifications

## Integration with CI/CD

The system can be integrated into your CI/CD pipeline:

```yaml
# Example GitHub Action
- name: Analyze Brand Voice
  run: |
    cd "Content Script"
    npm install
    npm run analyze:md
    
- name: Upload Report
  uses: actions/upload-artifact@v2
  with:
    name: brand-voice-report
    path: Content Script/reports/analysis.md
```

## Troubleshooting

### Low Scores
If you see very low scores (< 10%), this typically means:
1. Content uses corporate jargon
2. Missing signature brand phrases
3. Lack of power words in CTAs
4. Inconsistent tone across files

### No Changes Found
If preview shows no changes, either:
1. Content already meets brand voice standards
2. Threshold is set too low (default is 80%)
3. File has minimal text content

## Next Steps

1. **Regular Analysis**: Run weekly to maintain consistency
2. **Team Training**: Share reports with content creators
3. **Continuous Improvement**: Update brand_voice_config.json as voice evolves
4. **Metrics Tracking**: Monitor score improvements over time

---

*System created for DesignWorks Bureau - maintaining brand voice consistency at scale*