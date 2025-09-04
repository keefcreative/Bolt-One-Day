# Content Script Cleanup Plan

## Current System Analysis

### ✅ ACTIVE FILES (Keep)

#### Core System (Currently in Use)
- `assistant_section_processor.js` - **PRIMARY**: Processes entire sections with OpenAI Assistant
- `brand_voice_validator.js` - Rules-based brand voice analysis
- `brand_voice_config.json` - Brand voice configuration
- `content_analyzer.js` - Analyzes content for issues
- `implement_changes.js` - Applies approved changes to website

#### Documentation (Keep & Update)
- `OPENAI_ASSISTANT_INSTRUCTIONS.md` - Assistant instructions (ACTIVE)
- `README.md` - Main documentation
- `package.json` - Dependencies

#### Reports & Improvements (Keep Recent)
- `improvements/sections/*.html` - Current review pages
- `improvements/unified_dashboard.html` - Master dashboard
- Recent improvement JSONs in `improvements/`

---

### 🗑️ FILES TO ARCHIVE/DELETE

#### Obsolete Improvement Systems (Replaced by assistant_section_processor.js)
- `ai_content_improver.js` - OLD, replaced
- `better_improve.js` - Experimental, not needed
- `content_improver_workflow.js` - OLD workflow
- `length_aware_improver.js` - Merged into unified
- `longform_improver.js` - Merged into unified
- `quick_improve.js` - Merged into unified
- `selective_improver.js` - Merged into unified
- `unified_content_system.js` - Replaced by assistant version
- `unified_content_system_enhanced.js` - Replaced by assistant version
- `unified_assistant_system.js` - Replaced by assistant_section_processor.js

#### Test & Development Files
- `test_assistant_direct.js` - Development test file
- All files in `archive/test_files/`
- `assistant_content_improver.js` - OLD assistant implementation

#### Image Generation (Separate System)
- `freepik_client.js` - Image generation (separate concern)
- `generate_real_images.js` - Image generation
- `image_generator.js` - Image generation
- `image_workflow.js` - Image generation
- `prompt_engineer.js` - Image prompts
- `utils/replicate_client.js` - Image API

#### Old Documentation
- `AI_CONTENT_SYSTEM.md` - Outdated
- `CLEANUP_SUMMARY.md` - Previous cleanup
- `REPORTING_SYSTEM.md` - OLD system docs
- `SYSTEM_INTEGRATION.md` - OLD integration docs
- `TROUBLESHOOTING.md` - OLD troubleshooting
- `USER_GUIDE.md` - Needs updating
- `WORKFLOW_ARCHITECTURE.md` - OLD architecture
- `WORKFLOW_GUIDE.md` - OLD workflow

#### Other Files
- `Brand Voice Guide – DesignWorks Bureau.docx` - Source document, keep elsewhere
- `integrated_workflow.js` - OLD workflow
- `report_generator.js` - OLD reporting
- `report_templates.js` - OLD templates

---

## Recommended New Structure

```
/Content Script/
├── 📁 active/
│   ├── assistant_section_processor.js    # Main system
│   ├── brand_voice_validator.js          # Analysis
│   ├── content_analyzer.js               # Analysis
│   ├── implement_changes.js              # Implementation
│   └── brand_voice_config.json           # Config
│
├── 📁 improvements/
│   ├── sections/                         # Review pages
│   └── unified_dashboard.html            # Dashboard
│
├── 📁 reports/
│   └── [keep recent reports]
│
├── 📁 archive_2025_09/                   # Archive old files
│   ├── old_improvers/
│   ├── old_workflows/
│   ├── image_generation/
│   └── deprecated_docs/
│
├── 📁 docs/
│   ├── README.md                         # Updated main docs
│   └── OPENAI_ASSISTANT_INSTRUCTIONS.md  # Assistant config
│
└── package.json
```

## Cleanup Commands

```bash
# 1. Create archive directory
mkdir -p archive_2025_09/old_improvers
mkdir -p archive_2025_09/old_workflows  
mkdir -p archive_2025_09/image_generation
mkdir -p archive_2025_09/deprecated_docs

# 2. Move old improvers
mv *_improver.js archive_2025_09/old_improvers/
mv quick_improve.js archive_2025_09/old_improvers/
mv better_improve.js archive_2025_09/old_improvers/
mv unified_*.js archive_2025_09/old_improvers/

# 3. Move old workflows
mv integrated_workflow.js archive_2025_09/old_workflows/
mv content_improver_workflow.js archive_2025_09/old_workflows/
mv ai_content_improver.js archive_2025_09/old_workflows/

# 4. Move image generation (if not needed)
mv *image*.js archive_2025_09/image_generation/
mv freepik_client.js archive_2025_09/image_generation/
mv prompt_engineer.js archive_2025_09/image_generation/

# 5. Move old docs
mv *_SYSTEM.md archive_2025_09/deprecated_docs/
mv *_GUIDE.md archive_2025_09/deprecated_docs/
mv *_ARCHITECTURE.md archive_2025_09/deprecated_docs/

# 6. Create active directory
mkdir -p active
mv assistant_section_processor.js active/
mv brand_voice_validator.js active/
mv content_analyzer.js active/
mv implement_changes.js active/
mv brand_voice_config.json active/
```

## Files to Keep Active

1. **assistant_section_processor.js** - Your main content improvement system
2. **brand_voice_validator.js** - Validates brand voice
3. **content_analyzer.js** - Analyzes for issues
4. **implement_changes.js** - Applies approved changes
5. **brand_voice_config.json** - Configuration

## Summary

- **28 files to archive** (old systems)
- **5 core files to keep** (active system)
- **Documentation to update** (README)
- **Reports/improvements to preserve** (recent work)