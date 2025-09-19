#!/usr/bin/env node

/**
 * AI-Powered Content Updater
 * Updates JSON content files based on AI analysis and suggestions
 * Usage: node content-updater.js [command] [options]
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import BrandVoiceValidator from './brand_voice_validator.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

class ContentUpdater {
  constructor() {
    this.backupDir = './data-backups';
    this.ensureBackupDir();
    this.voiceValidator = new BrandVoiceValidator();
  }

  // Ensure backup directory exists
  ensureBackupDir() {
    if (!fs.existsSync(this.backupDir)) {
      fs.mkdirSync(this.backupDir, { recursive: true });
    }
  }

  // Create backup before making changes
  createBackup(filePath) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const fileName = path.basename(filePath, '.json');
    const backupPath = path.join(this.backupDir, `${fileName}-${timestamp}.json`);
    
    fs.copyFileSync(filePath, backupPath);
    console.log(`📁 Backup created: ${backupPath}`);
    return backupPath;
  }

  // Update meta descriptions based on content - adapted for your marketing site
  async updateMetaDescriptions(contentDir = './data') {
    console.log('🔄 Updating meta descriptions...\n');
    
    const files = this.getJsonFiles(contentDir);
    let updatedCount = 0;

    for (const filePath of files) {
      try {
        const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        
        if (this.shouldUpdateMetaDescription(content, filePath)) {
          this.createBackup(filePath);
          
          const updated = this.addMetaDescriptions(content, filePath);
          
          if (updated) {
            fs.writeFileSync(filePath, JSON.stringify(content, null, 2));
            console.log(`✅ Updated meta descriptions for: ${path.basename(filePath)}`);
            updatedCount++;
          }
        }
      } catch (error) {
        console.error(`❌ Error updating ${filePath}:`, error.message);
      }
    }

    console.log(`🎉 Updated ${updatedCount} files with meta descriptions`);
  }

  // Check if file needs meta description updates
  shouldUpdateMetaDescription(content, filePath) {
    // Focus on main page content files
    const needsMeta = ['hero', 'services', 'portfolio', 'pricing', 'contact'];
    return needsMeta.some(type => filePath.includes(type));
  }

  // Add meta descriptions to content objects
  addMetaDescriptions(content, filePath) {
    let updated = false;
    
    const addMeta = (obj, path = '') => {
      if (typeof obj !== 'object' || obj === null) return;
      
      Object.entries(obj).forEach(([key, value]) => {
        if (key === 'title' && typeof value === 'string' && value.length > 0) {
          const metaKey = 'metaDescription';
          const parentObj = path ? this.getNestedObject(content, path) : content;
          
          if (!parentObj[metaKey] || parentObj[metaKey].length < 50) {
            parentObj[metaKey] = this.generateMetaFromTitle(value);
            console.log(`   Added meta: "${parentObj[metaKey]}"`);
            updated = true;
          }
        } else if (Array.isArray(value)) {
          value.forEach((item, index) => {
            const newPath = path ? `${path}.${key}[${index}]` : `${key}[${index}]`;
            addMeta(item, newPath);
          });
        } else if (typeof value === 'object') {
          const newPath = path ? `${path}.${key}` : key;
          addMeta(value, newPath);
        }
      });
    };
    
    addMeta(content);
    return updated;
  }

  // Get nested object by path
  getNestedObject(obj, path) {
    return path.split('.').reduce((current, key) => {
      if (key.includes('[') && key.includes(']')) {
        const arrayKey = key.split('[')[0];
        const index = parseInt(key.split('[')[1].split(']')[0]);
        return current[arrayKey][index];
      }
      return current[key];
    }, obj);
  }

  // Generate meta description from title
  generateMetaFromTitle(title) {
    const templates = [
      `Discover ${title.toLowerCase()} with our expert design team. Get started today.`,
      `Learn more about ${title.toLowerCase()} and how we can help your business grow.`,
      `Professional ${title.toLowerCase()} services designed to elevate your brand.`,
      `${title} - Expert solutions tailored to your business needs.`
    ];
    
    const selected = templates[Math.floor(Math.random() * templates.length)];
    return selected.length > 155 ? selected.substring(0, 152) + '...' : selected;
  }

  // Optimize slugs for SEO
  async optimizeSlugs(contentDir = './content') {
    console.log('🔄 Optimizing slugs...\n');
    
    const files = this.getJsonFiles(contentDir);
    let updatedCount = 0;

    for (const filePath of files) {
      try {
        const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        
        if (content.slug && this.shouldOptimizeSlug(content.slug)) {
          this.createBackup(filePath);
          
          const newSlug = this.optimizeSlug(content.slug);
          content.slug = newSlug;
          
          fs.writeFileSync(filePath, JSON.stringify(content, null, 2));
          console.log(`✅ Optimized slug for: ${path.basename(filePath)}`);
          console.log(`   New slug: "${newSlug}"\n`);
          updatedCount++;
        }
      } catch (error) {
        console.error(`❌ Error updating ${filePath}:`, error.message);
      }
    }

    console.log(`🎉 Optimized ${updatedCount} slugs`);
  }

  // Check if slug needs optimization
  shouldOptimizeSlug(slug) {
    return slug.includes('_') || slug.includes(' ') || slug !== slug.toLowerCase();
  }

  // Optimize slug format
  optimizeSlug(slug) {
    return slug
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // Remove special chars
      .replace(/[\s_]+/g, '-') // Replace spaces/underscores with hyphens
      .replace(/-+/g, '-') // Remove multiple hyphens
      .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
  }

  // Add missing required fields
  async addMissingFields(contentDir = './content') {
    console.log('🔄 Adding missing required fields...\n');
    
    const files = this.getJsonFiles(contentDir);
    const requiredFields = {
      title: 'Untitled',
      slug: '',
      description: '',
      date: new Date().toISOString().split('T')[0],
      published: true,
      type: 'page'
    };

    let updatedCount = 0;

    for (const filePath of files) {
      try {
        const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        let needsUpdate = false;
        
        for (const [field, defaultValue] of Object.entries(requiredFields)) {
          if (content[field] === undefined || content[field] === null || content[field] === '') {
            if (field === 'slug' && content.title) {
              content[field] = this.optimizeSlug(content.title);
            } else {
              content[field] = defaultValue;
            }
            needsUpdate = true;
            console.log(`📝 Added missing field "${field}" to ${path.basename(filePath)}`);
          }
        }
        
        if (needsUpdate) {
          this.createBackup(filePath);
          fs.writeFileSync(filePath, JSON.stringify(content, null, 2));
          updatedCount++;
        }
      } catch (error) {
        console.error(`❌ Error updating ${filePath}:`, error.message);
      }
    }

    console.log(`🎉 Updated ${updatedCount} files with missing fields`);
  }

  // Standardize date formats
  async standardizeDates(contentDir = './content') {
    console.log('🔄 Standardizing date formats...\n');
    
    const files = this.getJsonFiles(contentDir);
    let updatedCount = 0;

    for (const filePath of files) {
      try {
        const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        
        if (content.date && !this.isValidDateFormat(content.date)) {
          this.createBackup(filePath);
          
          const standardizedDate = this.standardizeDate(content.date);
          content.date = standardizedDate;
          
          fs.writeFileSync(filePath, JSON.stringify(content, null, 2));
          console.log(`✅ Standardized date for: ${path.basename(filePath)}`);
          console.log(`   New date: "${standardizedDate}"\n`);
          updatedCount++;
        }
      } catch (error) {
        console.error(`❌ Error updating ${filePath}:`, error.message);
      }
    }

    console.log(`🎉 Standardized ${updatedCount} dates`);
  }

  // Check if date format is valid (YYYY-MM-DD)
  isValidDateFormat(dateString) {
    return /^\d{4}-\d{2}-\d{2}$/.test(dateString);
  }

  // Standardize date to YYYY-MM-DD format
  standardizeDate(dateString) {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return new Date().toISOString().split('T')[0];
      }
      return date.toISOString().split('T')[0];
    } catch {
      return new Date().toISOString().split('T')[0];
    }
  }

  // Improve content readability
  async improveReadability(contentDir = './content') {
    console.log('🔄 Improving content readability...\n');
    
    const files = this.getJsonFiles(contentDir);
    let updatedCount = 0;

    for (const filePath of files) {
      try {
        const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        let needsUpdate = false;
        
        if (content.content) {
          this.createBackup(filePath);
          
          const improvedContent = this.improveTextReadability(content.content);
          if (improvedContent !== content.content) {
            content.content = improvedContent;
            needsUpdate = true;
          }
        }
        
        if (content.title) {
          const improvedTitle = this.improveTitleCase(content.title);
          if (improvedTitle !== content.title) {
            content.title = improvedTitle;
            needsUpdate = true;
          }
        }
        
        if (needsUpdate) {
          fs.writeFileSync(filePath, JSON.stringify(content, null, 2));
          console.log(`✅ Improved readability for: ${path.basename(filePath)}`);
          updatedCount++;
        }
      } catch (error) {
        console.error(`❌ Error updating ${filePath}:`, error.message);
      }
    }

    console.log(`🎉 Improved readability for ${updatedCount} files`);
  }

  // Improve text readability
  improveTextReadability(text) {
    return text
      // Fix double spaces
      .replace(/\s{2,}/g, ' ')
      // Fix spacing around punctuation
      .replace(/\s+([,.!?;:])/g, '$1')
      .replace(/([.!?])\s*([A-Z])/g, '$1 $2')
      // Capitalize first letter of sentences
      .replace(/(^|[.!?]\s+)([a-z])/g, (match, p1, p2) => p1 + p2.toUpperCase())
      .trim();
  }

  // Improve title case
  improveTitleCase(title) {
    const smallWords = ['a', 'an', 'and', 'as', 'at', 'but', 'by', 'for', 'if', 'in', 'nor', 'of', 'on', 'or', 'so', 'the', 'to', 'up', 'yet'];
    
    return title
      .toLowerCase()
      .split(' ')
      .map((word, index) => {
        if (index === 0 || !smallWords.includes(word)) {
          return word.charAt(0).toUpperCase() + word.slice(1);
        }
        return word;
      })
      .join(' ');
  }

  // Get all JSON files recursively
  getJsonFiles(dir) {
    const files = [];
    
    function traverse(currentDir) {
      const items = fs.readdirSync(currentDir);
      
      for (const item of items) {
        const fullPath = path.join(currentDir, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
          traverse(fullPath);
        } else if (item.endsWith('.json')) {
          files.push(fullPath);
        }
      }
    }
    
    traverse(dir);
    return files;
  }

  // Run all updates
  async runAllUpdates(contentDir = './content') {
    console.log('🚀 Running all content updates...\n');
    
    await this.addMissingFields(contentDir);
    await this.updateMetaDescriptions(contentDir);
    await this.optimizeSlugs(contentDir);
    await this.standardizeDates(contentDir);
    await this.improveReadability(contentDir);
    await this.improveBrandVoice(contentDir);
    
    console.log('\n🎉 All updates completed!');
    console.log(`📁 Backups stored in: ${this.backupDir}`);
  }
  
  // Improve brand voice consistency
  async improveBrandVoice(contentDir = './data') {
    console.log('🎯 Improving brand voice consistency...\n');
    
    const files = this.getJsonFiles(contentDir);
    let improvedCount = 0;
    
    for (const filePath of files) {
      try {
        const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        const fileName = path.basename(filePath);
        
        // Detect content type
        const contentType = this.detectContentType(fileName, content);
        
        // Check if voice improvement is needed
        const combinedText = this.extractAllText(content);
        if (combinedText.length > 50) {
          const voiceAnalysis = this.voiceValidator.validateContent(combinedText, contentType);
          
          if (voiceAnalysis.scores.overall < 0.8) {
            this.createBackup(filePath);
            
            const improved = this.applyVoiceImprovements(content, contentType);
            
            if (improved) {
              fs.writeFileSync(filePath, JSON.stringify(improved, null, 2));
              console.log(`✅ Improved brand voice for: ${fileName} (${contentType})`);
              improvedCount++;
            }
          }
        }
      } catch (error) {
        console.error(`❌ Error updating ${filePath}:`, error.message);
      }
    }
    
    console.log(`🎯 Improved brand voice in ${improvedCount} files`);
  }
  
  // Apply voice improvements to content
  applyVoiceImprovements(content, contentType) {
    const improved = JSON.parse(JSON.stringify(content)); // Deep clone
    
    // Process all text fields
    this.processTextFields(improved, (text, key) => {
      // Apply voice improvements
      let improvedText = this.voiceValidator.improveVoice(text, contentType);
      
      // Additional improvements based on field type
      if (key === 'title' || key === 'headline') {
        improvedText = this.improveHeadline(improvedText);
      } else if (key === 'cta' || key.includes('button')) {
        improvedText = this.improveCTA(improvedText);
      } else if (key === 'description' || key === 'subtitle') {
        improvedText = this.improveDescription(improvedText, contentType);
      }
      
      return improvedText;
    });
    
    return improved;
  }
  
  // Process all text fields in an object
  processTextFields(obj, processor) {
    Object.keys(obj).forEach(key => {
      if (typeof obj[key] === 'string' && obj[key].length > 0) {
        obj[key] = processor(obj[key], key);
      } else if (Array.isArray(obj[key])) {
        obj[key].forEach(item => {
          if (typeof item === 'object') {
            this.processTextFields(item, processor);
          }
        });
      } else if (typeof obj[key] === 'object' && obj[key] !== null) {
        this.processTextFields(obj[key], processor);
      }
    });
  }
  
  // Improve headlines with brand voice
  improveHeadline(text) {
    // Ensure headlines are punchy and direct
    if (text.length > 60) {
      // Shorten to core message
      const words = text.split(' ');
      if (words.length > 8) {
        text = words.slice(0, 8).join(' ');
      }
    }
    
    // Remove ending punctuation for headlines
    text = text.replace(/[.!?]+$/, '');
    
    return text;
  }
  
  // Improve CTAs with action words
  improveCTA(text) {
    const weakCTAs = {
      'Learn More': 'Get Started Now',
      'Click Here': 'Start Your Journey',
      'Submit': 'Make It Happen',
      'Continue': 'Move Forward',
      'Read More': 'Discover More',
      'Contact': 'Let\'s Talk',
      'Sign Up': 'Start Your Subscription'
    };
    
    return weakCTAs[text] || text;
  }
  
  // Improve descriptions with brand voice
  improveDescription(text, contentType) {
    // Add power words if missing
    const hasPowerWord = ['works', 'delivers', 'powerful', 'effective', 'honest', 'clear'].some(
      word => text.toLowerCase().includes(word)
    );
    
    if (!hasPowerWord && contentType === 'hero') {
      // Prepend a power phrase
      text = 'Design that works. ' + text;
    }
    
    return text;
  }
  
  // Detect content type from filename and structure
  detectContentType(fileName, content) {
    const fileNameLower = fileName.toLowerCase();
    
    if (fileNameLower.includes('hero')) return 'hero';
    if (fileNameLower.includes('pricing')) return 'pricing';
    if (fileNameLower.includes('testimonial')) return 'testimonials';
    if (fileNameLower.includes('portfolio')) return 'portfolio';
    if (fileNameLower.includes('cta')) return 'cta';
    
    return 'general';
  }
  
  // Extract all text from content
  extractAllText(obj, texts = []) {
    Object.values(obj).forEach(value => {
      if (typeof value === 'string') {
        texts.push(value);
      } else if (Array.isArray(value)) {
        value.forEach(item => {
          if (typeof item === 'object') {
            this.extractAllText(item, texts);
          } else if (typeof item === 'string') {
            texts.push(item);
          }
        });
      } else if (typeof value === 'object' && value !== null) {
        this.extractAllText(value, texts);
      }
    });
    
    return texts.join(' ');
  }

  // Show available commands
  showHelp() {
    console.log(`
AI Content Updater - Available Commands:

  meta-descriptions  Update missing/poor meta descriptions
  slugs             Optimize URL slugs for SEO  
  missing-fields    Add missing required fields
  dates             Standardize date formats
  readability       Improve content readability
  brand-voice       Improve brand voice consistency
  all               Run all updates
  help              Show this help message

Usage:
  node content-updater.js [command] [content-directory]

Examples:
  node content-updater.js meta-descriptions ./content
  node content-updater.js all ./content
  node content-updater.js help
`);
  }
}

// CLI usage
if (import.meta.url === `file://${process.argv[1]}`) {
  const updater = new ContentUpdater();
  const command = process.argv[2] || 'help';
  const contentDir = process.argv[3] || './content';

  switch (command) {
    case 'meta-descriptions':
      updater.updateMetaDescriptions(contentDir);
      break;
    case 'slugs':
      updater.optimizeSlugs(contentDir);
      break;
    case 'missing-fields':
      updater.addMissingFields(contentDir);
      break;
    case 'dates':
      updater.standardizeDates(contentDir);
      break;
    case 'readability':
      updater.improveReadability(contentDir);
      break;
    case 'brand-voice':
      updater.improveBrandVoice(contentDir);
      break;
    case 'all':
      updater.runAllUpdates(contentDir);
      break;
    case 'help':
    default:
      updater.showHelp();
      break;
  }
}

export default ContentUpdater;