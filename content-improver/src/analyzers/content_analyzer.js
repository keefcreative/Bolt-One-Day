#!/usr/bin/env node

/**
 * AI-Powered JSON Content Analyzer
 * Analyzes your JSON content files and suggests improvements
 * Usage: node content-analyzer.js [path-to-json-files]
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import BrandVoiceValidator from '../validators/brand_voice_validator.js';
import ReportGenerator from './report_generator.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

class ContentAnalyzer {
  constructor() {
    this.issues = [];
    this.suggestions = [];
    this.stats = {
      totalFiles: 0,
      totalWords: 0,
      avgReadability: 0,
      contentTypes: {},
      voiceConsistency: {
        scores: [],
        avgScore: 0,
        failedFiles: [],
        pillarBreakdown: {}
      }
    };
    this.fileAnalysis = {};
    this.jargonAnalysis = { count: 0, terms: {} };
    this.voiceValidator = new BrandVoiceValidator();
    this.reportGenerator = new ReportGenerator();
  }

  // Main analysis function
  async analyzeDirectory(dirPath = '../../../data', options = {}) {
    console.log(`🔍 Analyzing content in: ${dirPath}\n`);
    
    try {
      const files = this.getJsonFiles(dirPath);
      
      for (const file of files) {
        await this.analyzeFile(file);
      }
      
      // Calculate pillar breakdown
      this.calculatePillarBreakdown();
      
      // Generate report based on options
      if (options.report) {
        return this.generateEnhancedReport(options);
      } else {
        this.generateReport();
      }
      
    } catch (error) {
      console.error('❌ Analysis failed:', error.message);
    }
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

  // Analyze individual JSON file
  async analyzeFile(filePath) {
    try {
      const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      const fileName = path.basename(filePath);
      
      console.log(`📄 Analyzing: ${fileName}`);
      this.stats.totalFiles++;
      
      // Structure analysis
      this.analyzeStructure(content, fileName);
      
      // Content quality analysis
      this.analyzeContent(content, fileName);
      
      // SEO analysis
      this.analyzeSEO(content, fileName);
      
      // Consistency checks
      this.checkConsistency(content, fileName);
      
    } catch (error) {
      this.addIssue('parse_error', `Failed to parse ${filePath}: ${error.message}`, 'high');
    }
  }

  // Analyze JSON structure - adapted for your Next.js site structure
  analyzeStructure(content, fileName) {
    // Different required fields based on content type
    let requiredFields = [];
    
    if (fileName.includes('hero') || fileName.includes('cta')) {
      requiredFields = ['title', 'subtitle', 'description'];
    } else if (fileName.includes('portfolio') || fileName.includes('project')) {
      requiredFields = ['title', 'description', 'client', 'category'];
    } else if (fileName.includes('testimonial')) {
      requiredFields = ['name', 'company', 'testimonial'];
    } else if (fileName.includes('team')) {
      requiredFields = ['name', 'role', 'bio'];
    } else if (fileName.includes('pricing')) {
      requiredFields = ['title', 'price', 'features'];
    } else if (fileName.includes('faq')) {
      requiredFields = ['question', 'answer'];
    } else {
      requiredFields = ['title', 'description'];
    }
    
    const missing = requiredFields.filter(field => !this.hasNestedField(content, field));
    
    if (missing.length > 0) {
      this.addIssue('missing_fields', `${fileName}: Missing required fields: ${missing.join(', ')}`, 'medium');
    }

    // Check for empty values in arrays (common in your structure)
    this.checkArrayContent(content, fileName);

    // Check for consistent image paths
    this.checkImagePaths(content, fileName);
  }

  // Helper to check nested fields (for complex JSON structures)
  hasNestedField(obj, field) {
    if (typeof obj !== 'object' || obj === null) return false;
    
    if (obj.hasOwnProperty(field)) return true;
    
    // Check in arrays
    for (const key in obj) {
      if (Array.isArray(obj[key])) {
        for (const item of obj[key]) {
          if (this.hasNestedField(item, field)) return true;
        }
      } else if (typeof obj[key] === 'object') {
        if (this.hasNestedField(obj[key], field)) return true;
      }
    }
    
    return false;
  }

  // Check array content quality
  checkArrayContent(content, fileName) {
    Object.entries(content).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        if (value.length === 0) {
          this.addSuggestion('empty_array', `${fileName}: Empty array "${key}" - consider adding content or removing field`);
        }
        
        // Check for incomplete array items
        value.forEach((item, index) => {
          if (typeof item === 'object' && item !== null) {
            const emptyFields = Object.entries(item).filter(([k, v]) => v === '' || v === null || v === undefined);
            if (emptyFields.length > 0) {
              this.addIssue('incomplete_array_item', `${fileName}: Incomplete item in "${key}[${index}]": ${emptyFields.map(([k]) => k).join(', ')}`, 'low');
            }
          }
        });
      }
    });
  }

  // Check image paths for your public/images structure
  checkImagePaths(content, fileName) {
    const imageFields = ['image', 'avatar', 'logo', 'thumbnail', 'photo', 'background'];
    
    const checkImagePath = (obj, path = '') => {
      if (typeof obj !== 'object' || obj === null) return;
      
      Object.entries(obj).forEach(([key, value]) => {
        const currentPath = path ? `${path}.${key}` : key;
        
        if (imageFields.some(field => key.toLowerCase().includes(field)) && typeof value === 'string') {
          if (value && !value.startsWith('/images/') && !value.startsWith('http')) {
            this.addSuggestion('image_path', `${fileName}: Image path "${currentPath}" should start with "/images/" for consistency`);
          }
        } else if (Array.isArray(value)) {
          value.forEach((item, index) => checkImagePath(item, `${currentPath}[${index}]`));
        } else if (typeof value === 'object') {
          checkImagePath(value, currentPath);
        }
      });
    };
    
    checkImagePath(content);
  }

  // Analyze content quality - adapted for marketing site content
  analyzeContent(content, fileName) {
    const textFields = this.getTextFields(content);
    
    // Determine content type for voice analysis
    const contentType = this.detectContentType(fileName, content);
    
    // Analyze all text fields combined for voice consistency
    const combinedText = textFields.map(f => f.text).join(' ');
    if (combinedText.length > 50) {
      const voiceAnalysis = this.voiceValidator.validateContent(combinedText, contentType);
      
      // Track voice consistency scores
      this.stats.voiceConsistency.scores.push(voiceAnalysis.scores.overall);
      
      // Store detailed file analysis
      this.fileAnalysis[fileName] = {
        score: voiceAnalysis.scores.overall,
        contentType,
        fieldsAnalyzed: textFields.length,
        voiceAnalysis,
        issues: [],
        jargonCount: 0
      };
      
      // Count jargon
      if (voiceAnalysis.scores.jargon) {
        const jargonCount = voiceAnalysis.scores.jargon.found?.length || 0;
        this.fileAnalysis[fileName].jargonCount = jargonCount;
        this.jargonAnalysis.count += jargonCount;
        
        // Track jargon terms
        if (voiceAnalysis.scores.jargon.found) {
          voiceAnalysis.scores.jargon.found.forEach(term => {
            if (!this.jargonAnalysis.terms[term]) {
              this.jargonAnalysis.terms[term] = {
                count: 0,
                files: [],
                replacement: this.voiceValidator.config.jargonReplacements[term] || 'simpler term'
              };
            }
            this.jargonAnalysis.terms[term].count++;
            if (!this.jargonAnalysis.terms[term].files.includes(fileName)) {
              this.jargonAnalysis.terms[term].files.push(fileName);
            }
          });
        }
      }
      
      // Add voice-specific issues and suggestions
      if (voiceAnalysis.scores.overall < 0.8) {
        this.stats.voiceConsistency.failedFiles.push({
          file: fileName,
          score: voiceAnalysis.scores.overall,
          contentType
        });
        
        // Add voice issues
        voiceAnalysis.issues.forEach(issue => {
          this.addIssue('brand_voice', `${fileName}: ${issue.message}`, issue.severity);
          this.fileAnalysis[fileName].issues.push(issue.message);
        });
        
        // Add voice suggestions
        voiceAnalysis.suggestions.forEach(suggestion => {
          this.addSuggestion('brand_voice', `${fileName}: ${suggestion.message}`);
        });
      }
    }
    
    textFields.forEach(({ field, text, path }) => {
      if (text) {
        const wordCount = text.split(/\s+/).length;
        this.stats.totalWords += wordCount;
        
        // Marketing-specific content checks
        if (field === 'title' || path.includes('title')) {
          this.analyzeTitleContent(text, fileName, path);
        } else if (field === 'description' || path.includes('description')) {
          this.analyzeDescriptionContent(text, fileName, path);
        } else if (field === 'testimonial' || path.includes('testimonial')) {
          this.analyzeTestimonialContent(text, fileName, path);
        } else if (field.includes('cta') || path.includes('cta')) {
          this.analyzeCTAContent(text, fileName, path);
        }
        
        // General content quality checks
        this.checkTextQuality(text, field, fileName);
      }
    });
  }
  
  // Detect content type from filename and structure
  detectContentType(fileName, content) {
    const fileNameLower = fileName.toLowerCase();
    
    if (fileNameLower.includes('hero')) return 'hero';
    if (fileNameLower.includes('pricing')) return 'pricing';
    if (fileNameLower.includes('testimonial')) return 'testimonials';
    if (fileNameLower.includes('portfolio')) return 'portfolio';
    if (fileNameLower.includes('team')) return 'team';
    if (fileNameLower.includes('contact')) return 'contact';
    if (fileNameLower.includes('faq')) return 'faq';
    if (fileNameLower.includes('service')) return 'services';
    if (fileNameLower.includes('cta')) return 'cta';
    
    // Check content structure
    if (content.testimonials || content.testimonial) return 'testimonials';
    if (content.pricing || content.plans) return 'pricing';
    if (content.portfolio || content.projects) return 'portfolio';
    
    return 'general';
  }

  // Extract all text fields from complex JSON structure
  getTextFields(obj, path = '', fields = []) {
    if (typeof obj !== 'object' || obj === null) return fields;
    
    Object.entries(obj).forEach(([key, value]) => {
      const currentPath = path ? `${path}.${key}` : key;
      
      if (typeof value === 'string' && value.trim().length > 0) {
        // Only consider meaningful text fields
        if (this.isTextualField(key, value)) {
          fields.push({ field: key, text: value, path: currentPath });
        }
      } else if (Array.isArray(value)) {
        value.forEach((item, index) => {
          this.getTextFields(item, `${currentPath}[${index}]`, fields);
        });
      } else if (typeof value === 'object') {
        this.getTextFields(value, currentPath, fields);
      }
    });
    
    return fields;
  }

  // Check if field contains textual content worth analyzing
  isTextualField(key, value) {
    const textualKeys = ['title', 'description', 'content', 'text', 'bio', 'testimonial', 'question', 'answer', 'subtitle', 'heading', 'label', 'name'];
    const skipKeys = ['id', 'slug', 'url', 'link', 'email', 'phone', 'date', 'price', 'currency'];
    
    // Skip obviously non-textual fields
    if (skipKeys.some(skip => key.toLowerCase().includes(skip))) return false;
    
    // Include obvious textual fields
    if (textualKeys.some(text => key.toLowerCase().includes(text))) return true;
    
    // Include if it looks like meaningful text (more than 20 chars)
    return value.length > 20;
  }

  // Analyze title content for marketing effectiveness
  analyzeTitleContent(text, fileName, path) {
    if (text.length > 60) {
      this.addSuggestion('title_length', `${fileName}: Title "${path}" too long (${text.length} chars). Ideal for web: 30-60 chars.`);
    }
    if (text.length < 10) {
      this.addSuggestion('title_length', `${fileName}: Title "${path}" very short (${text.length} chars). Consider making it more descriptive.`);
    }
    
    // Check for action words in CTAs
    if (path.includes('cta') || path.includes('button')) {
      const actionWords = ['get', 'start', 'try', 'discover', 'learn', 'book', 'contact', 'download', 'join'];
      const hasAction = actionWords.some(word => text.toLowerCase().includes(word));
      if (!hasAction) {
        this.addSuggestion('cta_action', `${fileName}: CTA "${path}" could be more actionable. Consider adding action words.`);
      }
    }
  }

  // Analyze description content
  analyzeDescriptionContent(text, fileName, path) {
    if (text.length > 160 && path.includes('meta')) {
      this.addSuggestion('meta_description', `${fileName}: Meta description "${path}" too long (${text.length} chars). Ideal: 120-160 chars.`);
    }
    
    if (text.length < 50 && !path.includes('brief')) {
      this.addSuggestion('description_length', `${fileName}: Description "${path}" quite short (${text.length} chars). Consider expanding.`);
    }
  }

  // Analyze testimonial content
  analyzeTestimonialContent(text, fileName, path) {
    if (text.length < 50) {
      this.addSuggestion('testimonial_length', `${fileName}: Testimonial "${path}" quite short. Longer testimonials are often more convincing.`);
    }
    
    if (text.length > 500) {
      this.addSuggestion('testimonial_length', `${fileName}: Testimonial "${path}" very long. Consider condensing for better readability.`);
    }
  }

  // Analyze CTA content
  analyzeCTAContent(text, fileName, path) {
    if (text.length > 30) {
      this.addSuggestion('cta_length', `${fileName}: CTA "${path}" quite long. Shorter CTAs often perform better.`);
    }
    
    // Check for urgency/value words
    const valueWords = ['free', 'instant', 'now', 'today', 'limited', 'exclusive'];
    const hasValue = valueWords.some(word => text.toLowerCase().includes(word));
    if (!hasValue && text.length > 10) {
      this.addSuggestion('cta_value', `${fileName}: CTA "${path}" could emphasize value/urgency.`);
    }
  }

  // SEO analysis
  analyzeSEO(content, fileName) {
    // Meta description
    if (content.description) {
      const desc = content.description;
      if (desc.length > 160) {
        this.addSuggestion('meta_description', `${fileName}: Meta description too long (${desc.length} chars). Ideal length is 120-160 characters.`);
      }
      if (desc.length < 50) {
        this.addSuggestion('meta_description', `${fileName}: Meta description too short (${desc.length} chars). Consider making it more descriptive.`);
      }
    } else {
      this.addIssue('missing_seo', `${fileName}: Missing meta description`, 'medium');
    }

    // Slug analysis
    if (content.slug) {
      if (content.slug.includes('_') || content.slug.includes(' ')) {
        this.addSuggestion('slug_format', `${fileName}: Slug contains underscores or spaces. Use hyphens for better SEO.`);
      }
      if (content.slug.length > 50) {
        this.addSuggestion('slug_length', `${fileName}: Slug is quite long (${content.slug.length} chars). Consider shortening.`);
      }
    }
  }

  // Check text quality
  checkTextQuality(text, field, fileName) {
    // Check for repeated words
    const words = text.toLowerCase().split(/\s+/);
    const wordCount = {};
    words.forEach(word => {
      if (word.length > 3) {
        wordCount[word] = (wordCount[word] || 0) + 1;
      }
    });
    
    const repeated = Object.entries(wordCount).filter(([word, count]) => count > 5);
    if (repeated.length > 0) {
      this.addSuggestion('word_repetition', `${fileName}: Frequent word repetition in ${field}: ${repeated.map(([word]) => word).join(', ')}`);
    }

    // Check for passive voice (simple detection)
    const passiveIndicators = ['was', 'were', 'been', 'being'];
    const passiveCount = passiveIndicators.reduce((count, indicator) => {
      return count + (text.toLowerCase().match(new RegExp(`\\b${indicator}\\b`, 'g')) || []).length;
    }, 0);
    
    if (passiveCount > words.length * 0.1) {
      this.addSuggestion('passive_voice', `${fileName}: High passive voice usage in ${field}. Consider using active voice for better engagement.`);
    }

    // Check for readability issues
    const avgSentenceLength = this.getAverageSentenceLength(text);
    if (avgSentenceLength > 25) {
      this.addSuggestion('sentence_length', `${fileName}: Long sentences in ${field} (avg: ${avgSentenceLength.toFixed(1)} words). Consider breaking them up.`);
    }
  }

  // Calculate simple readability score
  calculateReadability(text) {
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const words = text.split(/\s+/);
    const avgWordsPerSentence = words.length / sentences.length;
    
    // Simple readability score (lower is better)
    return avgWordsPerSentence;
  }

  // Get average sentence length
  getAverageSentenceLength(text) {
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const totalWords = text.split(/\s+/).length;
    return totalWords / sentences.length;
  }

  // Check consistency across files
  checkConsistency(content, fileName) {
    // Track content types
    const type = content.type || 'unknown';
    this.stats.contentTypes[type] = (this.stats.contentTypes[type] || 0) + 1;
    
    // Check date format consistency
    if (content.date) {
      const datePattern = /^\d{4}-\d{2}-\d{2}$/;
      if (!datePattern.test(content.date)) {
        this.addSuggestion('date_format', `${fileName}: Inconsistent date format. Use YYYY-MM-DD format.`);
      }
    }
  }

  // Add issue to tracking
  addIssue(type, message, severity) {
    this.issues.push({ type, message, severity });
  }

  // Add suggestion to tracking
  addSuggestion(type, message) {
    this.suggestions.push({ type, message });
  }

  // Calculate pillar breakdown across all files
  calculatePillarBreakdown() {
    const pillars = ['honest', 'principled', 'human', 'balanced'];
    const pillarScores = {};
    
    pillars.forEach(pillar => {
      pillarScores[pillar] = [];
    });
    
    // Aggregate pillar scores from all file analyses
    Object.values(this.fileAnalysis).forEach(file => {
      if (file.voiceAnalysis?.scores?.pillars) {
        Object.entries(file.voiceAnalysis.scores.pillars).forEach(([pillar, score]) => {
          if (pillarScores[pillar]) {
            pillarScores[pillar].push(score);
          }
        });
      }
    });
    
    // Calculate averages
    pillars.forEach(pillar => {
      const scores = pillarScores[pillar];
      if (scores.length > 0) {
        this.stats.voiceConsistency.pillarBreakdown[pillar] = 
          scores.reduce((a, b) => a + b, 0) / scores.length;
      } else {
        this.stats.voiceConsistency.pillarBreakdown[pillar] = 0;
      }
    });
  }

  // Generate enhanced report with multiple format support
  generateEnhancedReport(options) {
    const reportData = {
      timestamp: new Date().toISOString(),
      filesAnalyzed: this.stats.totalFiles,
      stats: this.stats,
      issues: this.issues,
      suggestions: this.suggestions,
      fileAnalysis: this.fileAnalysis,
      jargonAnalysis: this.jargonAnalysis,
      voiceConsistency: this.stats.voiceConsistency
    };
    
    const format = options.format || 'detailed';
    const outputPath = options.output || null;
    
    return this.reportGenerator.generateReport(reportData, format, outputPath);
  }

  // Generate comprehensive report
  generateReport() {
    console.log('\n' + '='.repeat(60));
    console.log('📊 CONTENT ANALYSIS REPORT');
    console.log('='.repeat(60));
    
    // Statistics
    console.log('\n📈 STATISTICS:');
    console.log(`Total files analyzed: ${this.stats.totalFiles}`);
    console.log(`Total words: ${this.stats.totalWords.toLocaleString()}`);
    console.log(`Average words per file: ${Math.round(this.stats.totalWords / this.stats.totalFiles)}`);
    
    if (Object.keys(this.stats.contentTypes).length > 0) {
      console.log('\nContent types:');
      Object.entries(this.stats.contentTypes).forEach(([type, count]) => {
        console.log(`  - ${type}: ${count} files`);
      });
    }
    
    // Brand Voice Consistency
    if (this.stats.voiceConsistency.scores.length > 0) {
      const avgVoiceScore = this.stats.voiceConsistency.scores.reduce((a, b) => a + b, 0) / 
                           this.stats.voiceConsistency.scores.length;
      this.stats.voiceConsistency.avgScore = avgVoiceScore;
      
      console.log('\n🎯 BRAND VOICE CONSISTENCY:');
      const scorePercent = (avgVoiceScore * 100).toFixed(1);
      const scoreEmoji = avgVoiceScore >= 0.8 ? '✅' : avgVoiceScore >= 0.6 ? '⚠️' : '❌';
      console.log(`${scoreEmoji} Average voice consistency: ${scorePercent}%`);
      
      if (this.stats.voiceConsistency.failedFiles.length > 0) {
        console.log('\nFiles needing voice improvement:');
        this.stats.voiceConsistency.failedFiles
          .sort((a, b) => a.score - b.score)
          .slice(0, 5)
          .forEach(file => {
            console.log(`  • ${file.file}: ${(file.score * 100).toFixed(0)}% (${file.contentType})`);
          });
      }
    }

    // Critical Issues
    const criticalIssues = this.issues.filter(issue => issue.severity === 'high');
    if (criticalIssues.length > 0) {
      console.log('\n🚨 CRITICAL ISSUES:');
      criticalIssues.forEach(issue => console.log(`  ❌ ${issue.message}`));
    }

    // Medium Priority Issues
    const mediumIssues = this.issues.filter(issue => issue.severity === 'medium');
    if (mediumIssues.length > 0) {
      console.log('\n⚠️  MEDIUM PRIORITY ISSUES:');
      mediumIssues.forEach(issue => console.log(`  🔸 ${issue.message}`));
    }

    // Suggestions
    if (this.suggestions.length > 0) {
      console.log('\n💡 CONTENT IMPROVEMENT SUGGESTIONS:');
      
      // Group suggestions by type
      const groupedSuggestions = {};
      this.suggestions.forEach(suggestion => {
        if (!groupedSuggestions[suggestion.type]) {
          groupedSuggestions[suggestion.type] = [];
        }
        groupedSuggestions[suggestion.type].push(suggestion.message);
      });
      
      Object.entries(groupedSuggestions).forEach(([type, messages]) => {
        console.log(`\n  ${type.toUpperCase().replace('_', ' ')}:`);
        messages.forEach(message => console.log(`    • ${message}`));
      });
    }

    // Low Priority Issues
    const lowIssues = this.issues.filter(issue => issue.severity === 'low');
    if (lowIssues.length > 0) {
      console.log('\n🔍 MINOR ISSUES:');
      lowIssues.forEach(issue => console.log(`  • ${issue.message}`));
    }

    console.log('\n' + '='.repeat(60));
    console.log('✅ Analysis complete! Use these insights to improve your content.');
    console.log('='.repeat(60));
  }
}

// CLI usage
const isMainModule = process.argv[1] && import.meta.url.endsWith(process.argv[1].replace(/\\/g, '/'));

if (isMainModule || process.argv[1]?.endsWith('content_analyzer.js')) {
  const analyzer = new ContentAnalyzer();
  const args = process.argv.slice(2);
  
  // Parse arguments
  let contentPath = './data';
  const options = {};
  
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--report') {
      options.report = true;
      if (args[i + 1] && !args[i + 1].startsWith('--')) {
        options.format = args[i + 1];
        i++;
      }
    } else if (args[i] === '--output') {
      if (args[i + 1] && !args[i + 1].startsWith('--')) {
        options.output = args[i + 1];
        i++;
      }
    } else if (!args[i].startsWith('--')) {
      contentPath = args[i];
    }
  }
  
  analyzer.analyzeDirectory(contentPath, options).catch(error => {
    console.error('Error running analyzer:', error);
  });
}

export default ContentAnalyzer;