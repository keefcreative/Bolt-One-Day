#!/usr/bin/env node

/**
 * Marketing Site Content Optimizer
 * Specialized for Next.js marketing sites with JSON-driven content
 * Usage: node marketing-optimizer.js [command] [options]
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import BrandVoiceValidator from './brand_voice_validator.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

class MarketingContentOptimizer {
  constructor() {
    this.backupDir = './data-backups';
    this.dataDir = './data';
    this.ensureBackupDir();
    this.voiceValidator = new BrandVoiceValidator();
    
    // Marketing-specific content rules
    this.contentRules = {
      hero: {
        title: { maxLength: 60, minLength: 20 },
        subtitle: { maxLength: 120, minLength: 30 },
        cta: { maxLength: 25, actionWords: ['get', 'start', 'try', 'discover'] }
      },
      pricing: {
        title: { maxLength: 40 },
        features: { minItems: 3, maxItems: 8 }
      },
      testimonials: {
        testimonial: { minLength: 100, maxLength: 400 },
        name: { required: true },
        company: { required: true }
      },
      portfolio: {
        title: { maxLength: 50 },
        description: { minLength: 50, maxLength: 200 },
        tags: { minItems: 2, maxItems: 6 }
      }
    };
  }

  ensureBackupDir() {
    if (!fs.existsSync(this.backupDir)) {
      fs.mkdirSync(this.backupDir, { recursive: true });
    }
  }

  createBackup(filePath) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const fileName = path.basename(filePath, '.json');
    const backupPath = path.join(this.backupDir, `${fileName}-${timestamp}.json`);
    
    fs.copyFileSync(filePath, backupPath);
    console.log(`📁 Backup created: ${backupPath}`);
    return backupPath;
  }

  // Main analysis for marketing content
  async analyzeMarketingContent() {
    console.log('🔍 Analyzing marketing content effectiveness...\n');
    
    const analysisResults = {
      conversionOptimization: [],
      seoIssues: [],
      contentGaps: [],
      brandConsistency: [],
      brandVoice: {
        scores: [],
        avgScore: 0,
        issues: []
      },
      recommendations: []
    };

    // Analyze different content types
    await this.analyzeHeroSections(analysisResults);
    await this.analyzePricingSections(analysisResults);
    await this.analyzeTestimonials(analysisResults);
    await this.analyzePortfolio(analysisResults);
    await this.analyzeCTAs(analysisResults);
    await this.analyzeNavigation(analysisResults);
    await this.analyzeBrandVoiceConsistency(analysisResults);

    this.generateMarketingReport(analysisResults);
  }
  
  // Analyze brand voice consistency across all content
  async analyzeBrandVoiceConsistency(results) {
    const allFiles = this.findFilesByPattern(['']);
    
    for (const filePath of allFiles) {
      try {
        const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        const fileName = path.basename(filePath);
        const contentType = this.detectContentType(fileName, content);
        
        // Extract all text
        const allText = this.extractAllText(content);
        if (allText.length > 50) {
          const voiceAnalysis = this.voiceValidator.validateContent(allText, contentType);
          
          results.brandVoice.scores.push({
            file: fileName,
            score: voiceAnalysis.scores.overall,
            contentType
          });
          
          // Track specific voice issues
          if (voiceAnalysis.scores.overall < 0.8) {
            results.brandVoice.issues.push({
              file: fileName,
              score: voiceAnalysis.scores.overall,
              issues: voiceAnalysis.issues,
              suggestions: voiceAnalysis.suggestions
            });
            
            // Add to brand consistency issues
            results.brandConsistency.push({
              file: fileName,
              issue: `Low brand voice consistency (${(voiceAnalysis.scores.overall * 100).toFixed(0)}%)`,
              suggestion: voiceAnalysis.suggestions[0]?.message || 'Improve brand voice alignment'
            });
          }
        }
      } catch (error) {
        console.error(`Error analyzing ${filePath}:`, error.message);
      }
    }
    
    // Calculate average voice score
    if (results.brandVoice.scores.length > 0) {
      results.brandVoice.avgScore = results.brandVoice.scores.reduce((sum, item) => sum + item.score, 0) / 
                                   results.brandVoice.scores.length;
    }
  }
  
  // Detect content type
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

  // Analyze hero sections for conversion optimization
  async analyzeHeroSections(results) {
    const heroFiles = this.findFilesByPattern(['hero', 'landing']);
    
    for (const filePath of heroFiles) {
      try {
        const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        const fileName = path.basename(filePath);
        
        // Check value proposition clarity
        if (content.title) {
          if (!this.hasValueProposition(content.title)) {
            results.conversionOptimization.push({
              file: fileName,
              issue: 'Weak value proposition',
              suggestion: 'Hero title should clearly communicate your unique value'
            });
          }
        }

        // Check CTA effectiveness
        if (content.cta || content.ctaText || content.buttonText) {
          const ctaText = content.cta || content.ctaText || content.buttonText;
          if (!this.isEffectiveCTA(ctaText)) {
            results.conversionOptimization.push({
              file: fileName,
              issue: 'Weak CTA',
              suggestion: `CTA "${ctaText}" could be more action-oriented and specific`
            });
          }
        }

        // Check for social proof indicators
        if (!content.socialProof && !content.testimonial && !content.clientCount) {
          results.conversionOptimization.push({
            file: fileName,
            issue: 'Missing social proof',
            suggestion: 'Consider adding client testimonials, logos, or statistics'
          });
        }

      } catch (error) {
        console.error(`Error analyzing ${filePath}:`, error.message);
      }
    }
  }

  // Analyze pricing sections for conversion
  async analyzePricingSections(results) {
    const pricingFiles = this.findFilesByPattern(['pricing', 'plan']);
    
    for (const filePath of pricingFiles) {
      try {
        const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        const fileName = path.basename(filePath);

        // Check for pricing psychology elements
        const plans = content.plans || content.tiers || [content];
        
        plans.forEach((plan, index) => {
          if (plan.price && !plan.popular && !plan.recommended) {
            results.conversionOptimization.push({
              file: fileName,
              issue: 'No recommended plan highlighted',
              suggestion: 'Highlight your most popular or recommended pricing tier'
            });
          }

          if (plan.features && plan.features.length < 3) {
            results.conversionOptimization.push({
              file: fileName,
              issue: `Plan ${index + 1} has few features listed`,
              suggestion: 'Add more specific features to justify the value'
            });
          }

          // Check for urgency/scarcity elements
          if (!plan.discount && !plan.limited && !plan.popular) {
            results.conversionOptimization.push({
              file: fileName,
              issue: `Plan ${index + 1} lacks urgency`,
              suggestion: 'Consider adding time-limited offers or popularity indicators'
            });
          }
        });

      } catch (error) {
        console.error(`Error analyzing ${filePath}:`, error.message);
      }
    }
  }

  // Analyze testimonials for credibility
  async analyzeTestimonials(results) {
    const testimonialFiles = this.findFilesByPattern(['testimonial', 'review']);
    
    for (const filePath of testimonialFiles) {
      try {
        const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        const fileName = path.basename(filePath);

        const testimonials = content.testimonials || content.reviews || [content];
        
        testimonials.forEach((testimonial, index) => {
          // Check testimonial specificity
          if (testimonial.text || testimonial.testimonial) {
            const text = testimonial.text || testimonial.testimonial;
            if (!this.isSpecificTestimonial(text)) {
              results.conversionOptimization.push({
                file: fileName,
                issue: `Testimonial ${index + 1} is too generic`,
                suggestion: 'Add specific results, numbers, or detailed experiences'
              });
            }
          }

          // Check for complete attribution
          if (!testimonial.name || !testimonial.company) {
            results.conversionOptimization.push({
              file: fileName,
              issue: `Testimonial ${index + 1} missing complete attribution`,
              suggestion: 'Include full name and company for credibility'
            });
          }

          // Check for photo
          if (!testimonial.photo && !testimonial.avatar && !testimonial.image) {
            results.conversionOptimization.push({
              file: fileName,
              issue: `Testimonial ${index + 1} missing photo`,
              suggestion: 'Add client photos to increase trust and authenticity'
            });
          }
        });

      } catch (error) {
        console.error(`Error analyzing ${filePath}:`, error.message);
      }
    }
  }

  // Analyze portfolio for client acquisition
  async analyzePortfolio(results) {
    const portfolioFiles = this.findFilesByPattern(['portfolio', 'project', 'work']);
    
    for (const filePath of portfolioFiles) {
      try {
        const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        const fileName = path.basename(filePath);

        const projects = content.projects || [content];
        
        projects.forEach((project, index) => {
          // Check for results/metrics
          if (!project.results && !project.metrics && !project.outcome) {
            results.conversionOptimization.push({
              file: fileName,
              issue: `Project ${index + 1} missing results`,
              suggestion: 'Add specific outcomes, metrics, or client results achieved'
            });
          }

          // Check for process insights
          if (!project.process && !project.approach && !project.methodology) {
            results.contentGaps.push({
              file: fileName,
              issue: `Project ${index + 1} missing process information`,
              suggestion: 'Explain your design process to build trust and expertise'
            });
          }

          // Check for client testimonial
          if (!project.testimonial && !project.clientFeedback) {
            results.conversionOptimization.push({
              file: fileName,
              issue: `Project ${index + 1} missing client feedback`,
              suggestion: 'Add client testimonials specific to this project'
            });
          }
        });

      } catch (error) {
        console.error(`Error analyzing ${filePath}:`, error.message);
      }
    }
  }

  // Analyze all CTAs across the site
  async analyzeCTAs(results) {
    const allFiles = this.getJsonFiles(this.dataDir);
    const ctas = [];

    for (const filePath of allFiles) {
      try {
        const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        this.extractCTAs(content, path.basename(filePath), ctas);
      } catch (error) {
        console.error(`Error analyzing ${filePath}:`, error.message);
      }
    }

    // Analyze CTA diversity and effectiveness
    const ctaTexts = ctas.map(cta => cta.text.toLowerCase());
    const uniqueCTAs = [...new Set(ctaTexts)];

    if (uniqueCTAs.length < 3) {
      results.conversionOptimization.push({
        file: 'Site-wide',
        issue: 'Limited CTA variation',
        suggestion: 'Use different CTA texts for different contexts and audiences'
      });
    }

    // Check for weak CTAs
    const weakCTAs = ctas.filter(cta => this.isWeakCTA(cta.text));
    if (weakCTAs.length > 0) {
      results.conversionOptimization.push({
        file: 'Multiple files',
        issue: 'Weak CTAs detected',
        suggestion: `Strengthen these CTAs: ${weakCTAs.map(c => `"${c.text}" in ${c.file}`).join(', ')}`
      });
    }
  }

  // Analyze navigation for UX
  async analyzeNavigation(results) {
    const navFile = path.join(this.dataDir, 'navigation.json');
    
    if (fs.existsSync(navFile)) {
      try {
        const content = JSON.parse(fs.readFileSync(navFile, 'utf8'));
        
        const menuItems = content.items || content.menu || content.navigation || [];
        
        if (menuItems.length > 7) {
          results.conversionOptimization.push({
            file: 'navigation.json',
            issue: 'Too many navigation items',
            suggestion: 'Consider grouping items or using dropdown menus (ideal: 5-7 items)'
          });
        }

        // Check for clear conversion paths
        const hasContactCTA = menuItems.some(item => 
          item.text?.toLowerCase().includes('contact') || 
          item.text?.toLowerCase().includes('get started')
        );

        if (!hasContactCTA) {
          results.conversionOptimization.push({
            file: 'navigation.json',
            issue: 'No clear contact CTA in navigation',
            suggestion: 'Add a prominent "Contact" or "Get Started" button in navigation'
          });
        }

      } catch (error) {
        console.error('Error analyzing navigation:', error.message);
      }
    }
  }

  // Helper methods for content analysis

  hasValueProposition(title) {
    const valueWords = ['best', 'leading', 'expert', 'professional', 'custom', 'premium', 'fast', 'reliable', 'trusted'];
    const benefitWords = ['grow', 'increase', 'improve', 'boost', 'enhance', 'optimize', 'transform'];
    
    return valueWords.some(word => title.toLowerCase().includes(word)) ||
           benefitWords.some(word => title.toLowerCase().includes(word));
  }

  isEffectiveCTA(ctaText) {
    const actionWords = ['get', 'start', 'try', 'discover', 'learn', 'book', 'contact', 'download', 'join', 'claim'];
    const urgencyWords = ['now', 'today', 'instantly', 'immediately'];
    
    const hasAction = actionWords.some(word => ctaText.toLowerCase().includes(word));
    const isSpecific = ctaText.length > 8 && ctaText.length < 25;
    
    return hasAction && isSpecific;
  }

  isWeakCTA(ctaText) {
    const weakPhrases = ['click here', 'learn more', 'read more', 'submit', 'send'];
    return weakPhrases.some(phrase => ctaText.toLowerCase().includes(phrase));
  }

  isSpecificTestimonial(text) {
    // Check for numbers, specific outcomes, or detailed experiences
    const hasNumbers = /\d/.test(text);
    const hasSpecifics = /increased|improved|reduced|saved|grew|achieved|delivered/.test(text.toLowerCase());
    const isDetailed = text.length > 100;
    
    return (hasNumbers || hasSpecifics) && isDetailed;
  }

  extractCTAs(obj, fileName, ctas, path = '') {
    if (typeof obj !== 'object' || obj === null) return;
    
    Object.entries(obj).forEach(([key, value]) => {
      const currentPath = path ? `${path}.${key}` : key;
      
      if (typeof value === 'string' && this.isCTAField(key)) {
        ctas.push({ text: value, file: fileName, path: currentPath });
      } else if (Array.isArray(value)) {
        value.forEach((item, index) => {
          this.extractCTAs(item, fileName, ctas, `${currentPath}[${index}]`);
        });
      } else if (typeof value === 'object') {
        this.extractCTAs(value, fileName, ctas, currentPath);
      }
    });
  }

  isCTAField(key) {
    const ctaKeys = ['cta', 'button', 'link', 'action', 'ctatext', 'buttontext'];
    return ctaKeys.some(ctaKey => key.toLowerCase().includes(ctaKey));
  }

  findFilesByPattern(patterns) {
    const allFiles = this.getJsonFiles(this.dataDir);
    return allFiles.filter(file => 
      patterns.some(pattern => 
        path.basename(file).toLowerCase().includes(pattern)
      )
    );
  }

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

  // Generate comprehensive marketing report
  generateMarketingReport(results) {
    console.log('\n' + '='.repeat(80));
    console.log('🎯 MARKETING CONTENT OPTIMIZATION REPORT');
    console.log('='.repeat(80));

    // Conversion Optimization
    if (results.conversionOptimization.length > 0) {
      console.log('\n🚀 CONVERSION OPTIMIZATION OPPORTUNITIES:');
      results.conversionOptimization.forEach((item, index) => {
        console.log(`\n${index + 1}. ${item.file}: ${item.issue}`);
        console.log(`   💡 ${item.suggestion}`);
      });
    }

    // SEO Issues
    if (results.seoIssues.length > 0) {
      console.log('\n🔍 SEO OPTIMIZATION NEEDED:');
      results.seoIssues.forEach((item, index) => {
        console.log(`\n${index + 1}. ${item.file}: ${item.issue}`);
        console.log(`   💡 ${item.suggestion}`);
      });
    }

    // Content Gaps
    if (results.contentGaps.length > 0) {
      console.log('\n📝 CONTENT GAPS TO FILL:');
      results.contentGaps.forEach((item, index) => {
        console.log(`\n${index + 1}. ${item.file}: ${item.issue}`);
        console.log(`   💡 ${item.suggestion}`);
      });
    }

    // Brand Consistency
    if (results.brandConsistency.length > 0) {
      console.log('\n🎨 BRAND CONSISTENCY ISSUES:');
      results.brandConsistency.forEach((item, index) => {
        console.log(`\n${index + 1}. ${item.file}: ${item.issue}`);
        console.log(`   💡 ${item.suggestion}`);
      });
    }
    
    // Brand Voice Analysis
    if (results.brandVoice.avgScore > 0) {
      console.log('\n🎯 BRAND VOICE ANALYSIS:');
      const scorePercent = (results.brandVoice.avgScore * 100).toFixed(1);
      const scoreEmoji = results.brandVoice.avgScore >= 0.8 ? '✅' : 
                         results.brandVoice.avgScore >= 0.6 ? '⚠️' : '❌';
      console.log(`${scoreEmoji} Average brand voice consistency: ${scorePercent}%`);
      
      if (results.brandVoice.issues.length > 0) {
        console.log('\nTop files needing voice improvement:');
        results.brandVoice.issues
          .sort((a, b) => a.score - b.score)
          .slice(0, 3)
          .forEach(file => {
            console.log(`  • ${file.file}: ${(file.score * 100).toFixed(0)}%`);
            if (file.suggestions.length > 0) {
              console.log(`    → ${file.suggestions[0].message}`);
            }
          });
      }
    }

    // Priority Recommendations
    console.log('\n⭐ TOP PRIORITY RECOMMENDATIONS:');
    const priorities = this.generatePriorityRecommendations(results);
    priorities.forEach((rec, index) => {
      console.log(`\n${index + 1}. ${rec.category}: ${rec.action}`);
      console.log(`   Impact: ${rec.impact} | Effort: ${rec.effort}`);
    });

    console.log('\n' + '='.repeat(80));
    console.log('✅ Analysis complete! Focus on high-impact, low-effort improvements first.');
    console.log('='.repeat(80));
  }

  generatePriorityRecommendations(results) {
    return [
      {
        category: 'Hero Section',
        action: 'Strengthen value proposition and CTA',
        impact: 'High',
        effort: 'Low'
      },
      {
        category: 'Testimonials',
        action: 'Add specific results and client photos',
        impact: 'Medium',
        effort: 'Medium'
      },
      {
        category: 'Pricing',
        action: 'Highlight recommended plan and add urgency',
        impact: 'High',
        effort: 'Low'
      },
      {
        category: 'Portfolio',
        action: 'Add client results and process insights',
        impact: 'Medium',
        effort: 'Medium'
      },
      {
        category: 'CTAs',
        action: 'Diversify and strengthen call-to-actions',
        impact: 'High',
        effort: 'Low'
      }
    ];
  }

  // Auto-optimize content based on marketing best practices
  async autoOptimizeContent() {
    console.log('🔄 Auto-optimizing marketing content...\n');
    
    // Optimize hero sections
    await this.optimizeHeroSections();
    
    // Optimize CTAs
    await this.optimizeCTAs();
    
    // Add urgency to pricing
    await this.addPricingUrgency();
    
    console.log('\n🎉 Auto-optimization complete!');
  }

  async optimizeHeroSections() {
    const heroFiles = this.findFilesByPattern(['hero']);
    
    for (const filePath of heroFiles) {
      try {
        const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        let updated = false;

        // Add urgency to CTA if missing
        if (content.cta && !this.hasUrgency(content.cta)) {
          this.createBackup(filePath);
          content.cta = this.addUrgencyToCTA(content.cta);
          updated = true;
        }

        // Add social proof placeholder if missing
        if (!content.socialProof) {
          content.socialProof = "Trusted by 100+ businesses worldwide";
          updated = true;
        }

        if (updated) {
          fs.writeFileSync(filePath, JSON.stringify(content, null, 2));
          console.log(`✅ Optimized: ${path.basename(filePath)}`);
        }

      } catch (error) {
        console.error(`Error optimizing ${filePath}:`, error.message);
      }
    }
  }

  async optimizeCTAs() {
    const allFiles = this.getJsonFiles(this.dataDir);
    
    for (const filePath of allFiles) {
      try {
        const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        const optimized = this.optimizeCTAsInObject(content);
        
        if (optimized) {
          this.createBackup(filePath);
          fs.writeFileSync(filePath, JSON.stringify(content, null, 2));
          console.log(`✅ Optimized CTAs in: ${path.basename(filePath)}`);
        }

      } catch (error) {
        console.error(`Error optimizing CTAs in ${filePath}:`, error.message);
      }
    }
  }

  optimizeCTAsInObject(obj) {
    let optimized = false;
    
    if (typeof obj !== 'object' || obj === null) return false;
    
    Object.entries(obj).forEach(([key, value]) => {
      if (typeof value === 'string' && this.isCTAField(key)) {
        if (this.isWeakCTA(value)) {
          obj[key] = this.strengthenCTA(value);
          optimized = true;
        }
      } else if (Array.isArray(value)) {
        value.forEach(item => {
          if (this.optimizeCTAsInObject(item)) optimized = true;
        });
      } else if (typeof value === 'object') {
        if (this.optimizeCTAsInObject(value)) optimized = true;
      }
    });
    
    return optimized;
  }

  hasUrgency(text) {
    const urgencyWords = ['now', 'today', 'instant', 'immediate', 'limited', 'exclusive'];
    return urgencyWords.some(word => text.toLowerCase().includes(word));
  }

  addUrgencyToCTA(cta) {
    const urgencyPhrases = [' Now', ' Today', ' - Limited Time'];
    const randomPhrase = urgencyPhrases[Math.floor(Math.random() * urgencyPhrases.length)];
    return cta + randomPhrase;
  }

  strengthenCTA(weakCTA) {
    const ctaMap = {
      'click here': 'Get Started Now',
      'learn more': 'Discover How',
      'read more': 'See Full Details',
      'submit': 'Send Message',
      'send': 'Contact Us Today'
    };

    const lowerCTA = weakCTA.toLowerCase();
    for (const [weak, strong] of Object.entries(ctaMap)) {
      if (lowerCTA.includes(weak)) {
        return strong;
      }
    }

    return weakCTA; // Return original if no match
  }

  // Show available commands
  showHelp() {
    console.log(`
Marketing Content Optimizer - Available Commands:

  analyze     Analyze all marketing content for optimization opportunities
  optimize    Auto-optimize content based on marketing best practices  
  hero        Optimize hero sections specifically
  ctas        Strengthen all call-to-actions
  pricing     Add urgency and social proof to pricing
  help        Show this help message

Usage:
  node marketing-optimizer.js [command]

Examples:
  node marketing-optimizer.js analyze
  node marketing-optimizer.js optimize
  node marketing-optimizer.js hero
`);
  }
}

// CLI usage
if (import.meta.url === `file://${process.argv[1]}`) {
  const optimizer = new MarketingContentOptimizer();
  const command = process.argv[2] || 'help';

  switch (command) {
    case 'analyze':
      optimizer.analyzeMarketingContent();
      break;
    case 'optimize':
      optimizer.autoOptimizeContent();
      break;
    case 'hero':
      optimizer.optimizeHeroSections();
      break;
    case 'ctas':
      optimizer.optimizeCTAs();
      break;
    case 'help':
    default:
      optimizer.showHelp();
      break;
  }
}

export default MarketingContentOptimizer;