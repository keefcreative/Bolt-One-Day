#!/usr/bin/env node

/**
 * Intelligent Prompt Engineering for Flux.1
 * Creates optimized prompts based on brand guidelines and analysis feedback
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import chalk from 'chalk';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

class PromptEngineer {
  constructor() {
    this.guidelines = this.loadGuidelines();
    this.promptTemplates = this.loadPromptTemplates();
    this.successPatterns = this.loadSuccessPatterns();
  }
  
  /**
   * Generate optimal prompt based on image type and analysis
   */
  generatePrompt(options = {}) {
    const {
      type = 'portfolio',
      category = 'web design',
      issues = [],
      context = {},
      style = 'default'
    } = options;
    
    console.log(chalk.cyan(`\n🎨 Engineering ${type} prompt...`));
    
    // Start with base template
    let prompt = this.getBaseTemplate(type, category);
    
    // Add mandatory brand elements
    prompt = this.addBrandElements(prompt);
    
    // Fix specific issues from analysis
    prompt = this.fixAnalysisIssues(prompt, issues);
    
    // Add context-specific details
    prompt = this.addContextDetails(prompt, context);
    
    // Apply style modifiers
    prompt = this.applyStyleModifiers(prompt, style);
    
    // Add technical specifications
    prompt = this.addTechnicalSpecs(prompt, type);
    
    // Add negative prompts (what to avoid)
    prompt = this.addNegativePrompts(prompt);
    
    console.log(chalk.green('✓ Prompt engineered'));
    
    return {
      prompt,
      type,
      category,
      components: this.explainPromptComponents(prompt)
    };
  }
  
  /**
   * Get base template for image type
   */
  getBaseTemplate(type, category) {
    const templates = {
      portfolio: `Professional ${category} portfolio showcase on modern MacBook Pro screen`,
      hero: `Modern design agency office workspace`,
      team: `Professional headshot portrait`,
      testimonial: `Happy client portrait in office setting`,
      feature: `Clean minimal ${category} interface demonstration`
    };
    
    return templates[type] || `Professional ${category} design`;
  }
  
  /**
   * Add mandatory brand elements
   */
  addBrandElements(prompt) {
    const brandElements = [
      '#F97316 orange accent color prominently featured',
      'sharp edges and corners only (no rounded elements)',
      'clean minimal aesthetic with generous white space',
      'premium quality with attention to detail'
    ];
    
    // Add 1-2 critical brand elements
    const critical = brandElements.slice(0, 2).join(', ');
    return `${prompt}, ${critical}`;
  }
  
  /**
   * Fix specific issues identified in analysis
   */
  fixAnalysisIssues(prompt, issues) {
    const fixes = {
      'Missing orange accent': 'with prominent #F97316 orange brand accent element',
      'No real people': 'featuring authentic person actually working (not stock photo)',
      'Rounded corners detected': 'SHARP EDGES ONLY, absolutely no rounded corners',
      'Too cluttered': 'minimal clean composition with plenty of negative space',
      'Generic stock feel': 'authentic candid moment, not staged or stock photography',
      'Poor lighting': 'natural soft lighting from large window',
      'Dated technology': 'latest MacBook Pro M3 or iPhone 15 Pro',
      'No brand consistency': 'following DesignWorks brand guidelines exactly'
    };
    
    for (const issue of issues) {
      const fix = fixes[issue];
      if (fix && !prompt.includes(fix)) {
        prompt += `, ${fix}`;
      }
    }
    
    return prompt;
  }
  
  /**
   * Add context-specific details
   */
  addContextDetails(prompt, context) {
    if (context.projectName) {
      prompt += `, showing ${context.projectName} project`;
    }
    
    if (context.industry) {
      prompt += `, ${context.industry} industry focus`;
    }
    
    if (context.colorScheme && context.colorScheme !== 'default') {
      // But always maintain brand orange
      prompt += `, ${context.colorScheme} color scheme with #F97316 orange accents`;
    }
    
    if (context.mood) {
      prompt += `, ${context.mood} mood`;
    }
    
    return prompt;
  }
  
  /**
   * Apply style modifiers for quality
   */
  applyStyleModifiers(prompt, style) {
    const styleModifiers = {
      default: 'professional photography, high resolution, sharp focus',
      premium: 'luxury brand aesthetic, exceptional quality, magazine worthy',
      tech: 'modern tech startup vibe, innovative, cutting-edge',
      corporate: 'established business presence, trustworthy, reliable',
      creative: 'artistic flair, designer workspace, creative energy'
    };
    
    const modifier = styleModifiers[style] || styleModifiers.default;
    return `${prompt}, ${modifier}`;
  }
  
  /**
   * Add technical specifications
   */
  addTechnicalSpecs(prompt, type) {
    const specs = {
      portfolio: 'UI/UX design displayed clearly on screen, readable interface',
      hero: '16:9 aspect ratio, suitable for hero section with text overlay areas',
      team: 'professional headshot, shoulders up, clean background',
      testimonial: 'friendly approachable expression, business casual attire',
      feature: 'clear demonstration of functionality, intuitive interface'
    };
    
    const spec = specs[type];
    if (spec) {
      prompt += `, ${spec}`;
    }
    
    // Universal specs
    prompt += ', shot with 85mm lens, depth of field, professional lighting setup';
    
    return prompt;
  }
  
  /**
   * Add negative prompts (what to avoid)
   */
  addNegativePrompts(prompt) {
    const negatives = [
      'cartoon',
      'illustration', 
      'anime',
      'fake',
      'stock photo',
      'rounded corners',
      'gradient backgrounds',
      'cluttered',
      'amateur',
      'blurry',
      'oversaturated',
      'corporate cliche',
      'cheesy'
    ];
    
    // Add as negative instruction
    prompt += `. NOT: ${negatives.join(', ')}`;
    
    return prompt;
  }
  
  /**
   * Build prompt from successful examples
   */
  learnFromSuccess(analysisResults) {
    const successful = analysisResults.filter(r => r.brandScore >= 80);
    
    if (successful.length === 0) {
      console.log(chalk.yellow('No high-scoring examples to learn from'));
      return null;
    }
    
    // Extract common elements from successful images
    const commonElements = new Set();
    
    successful.forEach(result => {
      if (result.strengths) {
        result.strengths.forEach(strength => {
          if (strength.includes('orange') || strength.includes('#F97316')) {
            commonElements.add('prominent #F97316 orange accent');
          }
          if (strength.includes('sharp') || strength.includes('edges')) {
            commonElements.add('sharp edges and corners');
          }
          if (strength.includes('clean') || strength.includes('minimal')) {
            commonElements.add('clean minimal composition');
          }
          if (strength.includes('people') || strength.includes('human')) {
            commonElements.add('real person working authentically');
          }
        });
      }
    });
    
    return Array.from(commonElements);
  }
  
  /**
   * Generate variations for A/B testing
   */
  generateVariations(baseOptions, count = 3) {
    const variations = [];
    
    const styles = ['default', 'premium', 'tech'];
    const moods = ['confident', 'innovative', 'trustworthy'];
    const emphases = ['brand_color', 'human_element', 'minimal_clean'];
    
    for (let i = 0; i < count; i++) {
      const variation = {
        ...baseOptions,
        style: styles[i % styles.length],
        context: {
          ...baseOptions.context,
          mood: moods[i % moods.length]
        },
        emphasis: emphases[i % emphases.length]
      };
      
      const prompt = this.generatePrompt(variation);
      variations.push({
        ...prompt,
        variationId: i + 1,
        emphasis: variation.emphasis
      });
    }
    
    return variations;
  }
  
  /**
   * Explain prompt components for transparency
   */
  explainPromptComponents(prompt) {
    const components = {
      subject: '',
      brandElements: [],
      technical: [],
      quality: [],
      negatives: []
    };
    
    // Parse prompt sections
    const sections = prompt.split(',').map(s => s.trim());
    
    sections.forEach(section => {
      if (section.includes('#F97316') || section.includes('orange')) {
        components.brandElements.push('Brand color');
      }
      if (section.includes('sharp edges')) {
        components.brandElements.push('Sharp edges');
      }
      if (section.includes('85mm') || section.includes('lighting')) {
        components.technical.push(section);
      }
      if (section.includes('NOT:')) {
        components.negatives = section.replace('NOT:', '').trim().split(',');
      }
    });
    
    return components;
  }
  
  /**
   * Load configuration files
   */
  loadGuidelines() {
    const path = `${__dirname}/configs/visual_guidelines.json`;
    if (fs.existsSync(path)) {
      return JSON.parse(fs.readFileSync(path, 'utf8'));
    }
    return {};
  }
  
  loadPromptTemplates() {
    // Could be loaded from a separate templates file
    return {
      portfolio: {
        base: 'Professional {category} portfolio showcase',
        required: ['modern device', 'clean background', 'clear UI'],
        optional: ['multiple screens', 'workspace context']
      },
      team: {
        base: 'Professional team member portrait',
        required: ['business casual', 'confident expression', 'clean background'],
        optional: ['office setting', 'working at desk']
      }
    };
  }
  
  loadSuccessPatterns() {
    // Could be loaded from analysis of high-scoring images
    return {
      highScoring: [
        'prominent brand orange',
        'real people working',
        'modern technology',
        'clean minimal spaces',
        'natural lighting'
      ]
    };
  }
  
  /**
   * Save prompt for reuse
   */
  savePrompt(prompt, metadata) {
    const promptsFile = `${__dirname}/reports/successful_prompts.json`;
    let prompts = [];
    
    if (fs.existsSync(promptsFile)) {
      prompts = JSON.parse(fs.readFileSync(promptsFile, 'utf8'));
    }
    
    prompts.push({
      prompt: prompt.prompt,
      type: prompt.type,
      category: prompt.category,
      metadata,
      timestamp: new Date().toISOString()
    });
    
    // Keep last 100 prompts
    prompts = prompts.slice(-100);
    
    fs.writeFileSync(promptsFile, JSON.stringify(prompts, null, 2));
  }
}

// CLI usage
if (process.argv[1]?.endsWith('prompt_engineer.js')) {
  const engineer = new PromptEngineer();
  const command = process.argv[2];
  
  if (!command || command === '--help') {
    console.log(`
🎨 Prompt Engineer for Flux.1

Commands:
  generate <type>        Generate optimized prompt
  fix <issues...>       Generate prompt fixing specific issues
  variations <type>     Generate 3 prompt variations for testing
  learn <analysis.json> Learn from successful analysis

Examples:
  node prompt_engineer.js generate portfolio
  node prompt_engineer.js fix "Missing orange accent" "No real people"
  node prompt_engineer.js variations hero
  node prompt_engineer.js learn reports/image-analysis.json

Types: portfolio, hero, team, testimonial, feature
    `);
    process.exit(0);
  }
  
  if (command === 'generate') {
    const type = process.argv[3] || 'portfolio';
    const category = process.argv[4] || 'web design';
    
    const result = engineer.generatePrompt({ type, category });
    console.log(chalk.bold.cyan('\n📝 Generated Prompt:\n'));
    console.log(chalk.white(result.prompt));
    console.log(chalk.gray('\n📊 Components:'));
    console.log(result.components);
    
  } else if (command === 'fix') {
    const issues = process.argv.slice(3);
    
    if (issues.length === 0) {
      console.log(chalk.red('Please specify issues to fix'));
      process.exit(1);
    }
    
    const result = engineer.generatePrompt({ 
      type: 'portfolio',
      issues 
    });
    
    console.log(chalk.bold.cyan('\n📝 Fixed Prompt:\n'));
    console.log(chalk.white(result.prompt));
    console.log(chalk.green(`\n✓ Addressed ${issues.length} issues`));
    
  } else if (command === 'variations') {
    const type = process.argv[3] || 'portfolio';
    
    const variations = engineer.generateVariations({ type });
    
    console.log(chalk.bold.cyan(`\n🎲 ${variations.length} Prompt Variations:\n`));
    
    variations.forEach((v, i) => {
      console.log(chalk.yellow(`\nVariation ${i + 1} (${v.emphasis}):`));
      console.log(chalk.white(v.prompt.substring(0, 150) + '...'));
    });
    
  } else if (command === 'learn') {
    const analysisFile = process.argv[3];
    
    if (!analysisFile || !fs.existsSync(analysisFile)) {
      console.log(chalk.red('Please provide valid analysis file'));
      process.exit(1);
    }
    
    const analysis = JSON.parse(fs.readFileSync(analysisFile, 'utf8'));
    const patterns = engineer.learnFromSuccess(analysis.results || []);
    
    if (patterns) {
      console.log(chalk.bold.cyan('\n📚 Learned Success Patterns:\n'));
      patterns.forEach(p => console.log(chalk.green(`  ✓ ${p}`)));
    }
  }
}

export default PromptEngineer;