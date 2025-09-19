# Content Improver v2.0

AI-Powered Content Improvement System for DesignWorks Bureau

## Overview

The Content Improver is a sophisticated system that uses OpenAI's Assistant API to analyze, improve, and implement content changes across the DesignWorks Bureau website. It maintains brand voice consistency while enhancing content quality.

## Quick Start

```bash
# Install dependencies
npm install

# Run system check
npm run test

# Start interactive CLI
npm run content

# View help
npm run help
```

## Architecture

### Directory Structure
```
content-improver/
├── src/
│   ├── core/          # Main processing logic
│   ├── validators/    # Brand voice validation
│   ├── analyzers/     # Content analysis
│   ├── cli/          # Command line interface
│   └── config/       # Configuration files
├── improvements/     # Generated improvements
├── reports/         # Analysis reports
└── archive/         # Deprecated files
```

### Core Components

#### 🤖 Core Processing (`src/core/`)
- **`assistant_section_processor.js`** - Primary content improvement engine using OpenAI Assistant
- **`workflow_manager.js`** - Orchestrates full content improvement workflows
- **`status_tracker.js`** - Tracks progress across all content sections
- **`implement_changes.js`** - Applies approved changes to actual website files
- **`implementation_log.js`** - Maintains history of all changes

#### 🔍 Analysis (`src/analyzers/`)
- **`content_analyzer.js`** - Analyzes content for issues and improvement opportunities
- **`report_generator.js`** - Generates detailed HTML and markdown reports
- **`report_templates.js`** - Report formatting and templates

#### ✅ Validation (`src/validators/`)
- **`brand_voice_validator.js`** - Ensures content matches DesignWorks Bureau brand voice

#### 💻 Interface (`src/cli/`)
- **`content_cli.js`** - Interactive command line dashboard
- **`content_dashboard.html`** - Web-based progress dashboard

## Usage

### Main Commands

```bash
# Interactive CLI dashboard
npm run content

# View current status
npm run status

# Run complete workflow
npm run workflow
```

### Step-by-Step Workflow

```bash
# 1. Analyze all content sections
npm run analyze:all

# 2. Improve analyzed sections
npm run improve:pending

# 3. Review improvements
npm run review

# 4. Apply approved changes
npm run implement:approved
```

### Utilities

```bash
# Show next recommended action
npm run next

# View change history
npm run history

# Reset all status (caution!)
npm run reset

# Clean generated files
npm run clean
```

## Configuration

### Environment Variables
Create `.env.local` in the root directory:
```bash
OPENAI_API_KEY=your_openai_api_key
OPENAI_BRANDVOICE_ASSISTANT_ID=asst_0GsBgIUHApbshi9n1SSBISKg
```

### Brand Voice Configuration
Brand voice rules are defined in `src/config/brand_voice_config.json` with:
- Voice pillars (Honest, Principled, Human, Balanced)
- Power words and jargon detection
- Signature phrases
- Tone guidelines

## Content Sections Tracked

The system tracks 13 main content sections:
- Navigation, Hero, Logo Carousel
- Services, Solutions, Premium Design Process
- Pricing, Testimonials, Team
- We Believe, Premium FAQ, Premium CTA, Contact

Plus Design for Good specific sections:
- Hero, Mission, Problems, Process
- Advantage, Comparison, Pricing, FAQ, Final CTA

## Workflow States

Each section progresses through:
1. **Pending** - Awaiting analysis
2. **Analyzed** - Issues identified, ready for improvement
3. **Improved** - Enhanced by AI assistant
4. **Reviewed** - Approved for implementation
5. **Implemented** - Live on website

## Reports & Reviews

### Analysis Reports
- Content quality assessment
- Brand voice consistency scoring
- Readability analysis
- Issue identification

### Improvement Reviews
- Before/after comparisons
- Interactive approval interface
- Change highlighting
- Implementation preview

## Advanced Features

### Assistant Integration
- Uses specialized OpenAI Assistant trained on DesignWorks Bureau brand
- Maintains context across related content sections
- Applies consistent improvement patterns

### Smart Implementation
- Automatic backup before changes
- Rollback capabilities
- Change history logging
- File integrity verification

### Progress Tracking
- Visual progress indicators
- Section-by-section status
- Workflow state management
- Completion timestamps

## Migration from v1.0

This system was reorganized from the original "Content Script" directory. All functionality has been preserved while improving organization and maintainability.

Key changes:
- Modular architecture with clear separation of concerns
- Updated import paths and dependencies  
- Enhanced CLI interface
- Comprehensive archive system
- Improved documentation

See `MIGRATION_REPORT.md` for complete migration details.

## Development

### Adding New Analyzers
1. Create analyzer in `src/analyzers/`
2. Implement standard analysis interface
3. Update `content_analyzer.js` to include new analyzer

### Adding New Validators
1. Create validator in `src/validators/`
2. Implement validation interface
3. Register with main validation system

### Testing
```bash
# System check
npm run test

# Test brand voice validator
node src/validators/brand_voice_validator.js test
```

## Troubleshooting

### Common Issues
1. **OpenAI API Key**: Ensure `.env.local` has valid API key
2. **File Paths**: Check that `data/` directory exists at repo root
3. **Permissions**: Verify write access to `improvements/` and `reports/`

### Debug Mode
Set `DEBUG=true` in environment for verbose logging.

## Support

For issues or questions, reference:
- `MIGRATION_REPORT.md` - Complete system reorganization details
- `OPENAI_ASSISTANT_INSTRUCTIONS.md` - Assistant configuration
- `improvements/` directory - Recent improvement examples

---

**Content Improver v2.0** - Professional content improvement with AI precision.