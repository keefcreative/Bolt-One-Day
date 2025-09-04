#!/usr/bin/env node

/**
 * AI-Powered Content Improvement System
 * Uses OpenAI or Claude API to analyze and improve content based on brand voice
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load environment variables
dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

class AIContentImprover {
  constructor(options = {}) {
    this.apiKey = options.apiKey || process.env.OPENAI_API_KEY || process.env.ANTHROPIC_API_KEY;
    this.provider = options.provider || (process.env.OPENAI_API_KEY ? 'openai' : 'anthropic');
    this.model = options.model || (this.provider === 'openai' ? 'gpt-4-turbo-preview' : 'claude-3-opus-20240229');
    
    // Load brand voice configuration
    this.brandVoiceConfig = JSON.parse(
      fs.readFileSync(path.join(__dirname, 'brand_voice_config.json'), 'utf8')
    );
    
    if (!this.apiKey) {
      console.warn('⚠️  No API key found. Add OPENAI_API_KEY or ANTHROPIC_API_KEY to .env.local');
      console.warn('   AI features will use mock responses for demonstration.');
      this.useMock = true;
    }
  }

  /**
   * Create brand voice prompt
   */
  createBrandVoicePrompt() {
    const pillars = this.brandVoiceConfig.voicePillars || this.brandVoiceConfig.pillars || {};
    return `You are a brand voice expert for DesignWorks Bureau, a premium design subscription service.

BRAND VOICE PILLARS:
${Object.entries(pillars).map(([pillar, data]) => 
  `- ${pillar.toUpperCase()}: ${data.description || data}`
).join('\n')}

BRAND PERSONALITY (Gary Vaynerchuk meets Rory Sutherland):
- Direct, no-BS communication style
- Empathetic and understanding of business challenges
- Focus on value and results, not features
- Use stories and real examples
- Challenge conventional thinking
- Be contrarian when it adds value

SIGNATURE PHRASES TO USE:
${(this.brandVoiceConfig.signaturePhrases || []).map(p => `- "${p}"`).join('\n')}

POWER WORDS TO INCLUDE:
${Object.values(this.brandVoiceConfig.powerWords || {}).flat().slice(0, 20).join(', ')}

FORBIDDEN JARGON (never use these):
${Object.keys(this.brandVoiceConfig.jargonReplacements || {}).join(', ')}

WRITING RULES:
1. Short, punchy sentences mixed with occasional longer explanatory ones
2. Start with action verbs when possible
3. Always focus on customer benefit, not our features
4. Use "you" and "your" frequently
5. Include specific examples and numbers when possible
6. End with clear value proposition or call to action`;
  }

  /**
   * Analyze content and suggest improvements
   */
  async analyzeAndImprove(text, contentType = 'general') {
    if (this.useMock) {
      return this.mockAnalyzeAndImprove(text, contentType);
    }

    const systemPrompt = this.createBrandVoicePrompt();
    
    const userPrompt = `Analyze and improve this ${contentType} content to match our brand voice.

ORIGINAL TEXT:
"${text}"

Provide:
1. ANALYSIS: What's wrong with the current text (be specific)
2. IMPROVED VERSION: Rewrite to match our brand voice perfectly
3. KEY CHANGES: Bullet points of what you changed and why
4. SCORE IMPROVEMENT: Estimate the brand voice score improvement (0-100%)

Format your response as JSON:
{
  "analysis": "...",
  "improved": "...",
  "changes": ["change1", "change2"],
  "scoreImprovement": 25
}`;

    try {
      const response = await this.callAI(systemPrompt, userPrompt);
      // Response might already be parsed
      return typeof response === 'object' ? response : JSON.parse(response);
    } catch (error) {
      console.error('AI API Error:', error.message);
      return this.mockAnalyzeAndImprove(text, contentType);
    }
  }

  /**
   * Generate completely new content suggestions
   */
  async generateNewContent(contentType, context) {
    if (this.useMock) {
      return this.mockGenerateContent(contentType, context);
    }

    const systemPrompt = this.createBrandVoicePrompt();
    
    const prompts = {
      hero: `Create a powerful hero section headline and description for a design subscription service.
Context: ${context || 'Premium design service for growing businesses'}
Format: { "headline": "...", "description": "..." }`,
      
      cta: `Create 5 compelling call-to-action variations that drive conversions.
Context: ${context || 'Get started with design subscription'}
Format: { "primary": "...", "alternatives": ["...", "..."] }`,
      
      testimonial: `Write a realistic customer testimonial that sounds authentic and highlights our value.
Context: ${context || 'Happy customer sharing their experience'}
Format: { "quote": "...", "author": "Name", "role": "Title at Company" }`,
      
      feature: `Write a feature description that focuses on benefit, not functionality.
Context: ${context || 'Unlimited design revisions'}
Format: { "title": "...", "description": "...", "benefit": "..." }`,
      
      problem: `Describe a customer problem we solve in a way that creates urgency.
Context: ${context || 'Businesses struggling with inconsistent design'}
Format: { "problem": "...", "impact": "...", "solution": "..." }`
    };

    const userPrompt = prompts[contentType] || `Generate ${contentType} content.\nContext: ${context}`;

    try {
      const response = await this.callAI(systemPrompt, userPrompt);
      return JSON.parse(response);
    } catch (error) {
      console.error('AI Generation Error:', error.message);
      return this.mockGenerateContent(contentType, context);
    }
  }

  /**
   * Bulk analyze all content in a file
   */
  async analyzeFile(filePath) {
    try {
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const content = JSON.parse(fileContent);
      const fileName = path.basename(filePath);
      const improvements = [];
      
      console.log(`\n🤖 AI Analysis of ${fileName}...\n`);
    
    // Recursively analyze all text fields
    const analyzeObject = async (obj, path = '') => {
      if (!obj || typeof obj !== 'object') return;
      
      for (const [key, value] of Object.entries(obj)) {
        const currentPath = path ? `${path}.${key}` : key;
        
        if (typeof value === 'string' && value.length > 20) {
          const result = await this.analyzeAndImprove(value, this.detectContentType(key, value));
          if (result.scoreImprovement > 10) {
            improvements.push({
              path: currentPath,
              original: value,
              improved: result.improved,
              analysis: result.analysis,
              changes: result.changes,
              scoreImprovement: result.scoreImprovement
            });
            
            console.log(`✨ ${currentPath}: +${result.scoreImprovement}% improvement possible`);
          }
        } else if (Array.isArray(value)) {
          for (let i = 0; i < value.length; i++) {
            if (typeof value[i] === 'object') {
              await analyzeObject(value[i], `${currentPath}[${i}]`);
            }
          }
        } else if (typeof value === 'object' && value !== null) {
          await analyzeObject(value, currentPath);
        }
      }
    };
    
      await analyzeObject(content);
      
      return {
        file: fileName,
        improvements,
        totalImprovements: improvements.length,
        avgScoreImprovement: improvements.length > 0 
          ? improvements.reduce((sum, i) => sum + i.scoreImprovement, 0) / improvements.length
          : 0
      };
    } catch (error) {
      console.error(`Error analyzing ${filePath}:`, error.message);
      return {
        file: path.basename(filePath),
        improvements: [],
        totalImprovements: 0,
        avgScoreImprovement: 0,
        error: error.message
      };
    }
  }

  /**
   * Detect content type from field name and content
   */
  detectContentType(fieldName, content) {
    fieldName = fieldName.toLowerCase();
    
    if (fieldName.includes('title') || fieldName.includes('headline')) return 'headline';
    if (fieldName.includes('description') || fieldName.includes('desc')) return 'description';
    if (fieldName.includes('cta') || fieldName.includes('button')) return 'cta';
    if (fieldName.includes('testimonial') || fieldName.includes('quote')) return 'testimonial';
    if (fieldName.includes('feature')) return 'feature';
    if (fieldName.includes('problem')) return 'problem';
    if (fieldName.includes('bio')) return 'bio';
    
    // Detect by content patterns
    if (content.length < 50) return 'headline';
    if (content.length < 150) return 'description';
    
    return 'general';
  }

  /**
   * Call AI API (OpenAI or Anthropic)
   */
  async callAI(systemPrompt, userPrompt) {
    if (this.provider === 'openai') {
      return this.callOpenAI(systemPrompt, userPrompt);
    } else {
      return this.callAnthropic(systemPrompt, userPrompt);
    }
  }

  /**
   * Call OpenAI API
   */
  async callOpenAI(systemPrompt, userPrompt) {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo', // Use a model that exists
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt + '\n\nRemember to respond in valid JSON format.' }
        ],
        temperature: 0.7,
        max_tokens: 500
      })
    });

    const data = await response.json();
    if (data.error) throw new Error(data.error.message);
    
    // Parse the response as JSON
    try {
      return JSON.parse(data.choices[0].message.content);
    } catch (e) {
      // If parsing fails, return the content as-is
      return data.choices[0].message.content;
    }
  }

  /**
   * Call Anthropic API
   */
  async callAnthropic(systemPrompt, userPrompt) {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: this.model,
        max_tokens: 1024,
        messages: [
          { role: 'user', content: `${systemPrompt}\n\n${userPrompt}\n\nRespond with valid JSON only.` }
        ]
      })
    });

    const data = await response.json();
    if (data.error) throw new Error(data.error.message);
    return data.content[0].text;
  }

  /**
   * Mock responses for demonstration without API key
   */
  mockAnalyzeAndImprove(text, contentType) {
    const improvements = {
      headline: {
        analysis: "The current headline lacks power words and emotional impact. It's too generic and doesn't communicate unique value.",
        improved: "Stop Losing Sales to Bad Design. Get World-Class Creative Work Every Month.",
        changes: [
          "Added urgency with 'Stop Losing Sales'",
          "Included 'World-Class' as aspirational qualifier",
          "Made it outcome-focused rather than feature-focused"
        ],
        scoreImprovement: 45
      },
      description: {
        analysis: "Too much jargon ('seamless', 'innovative'), passive voice, and lacks specific benefits or proof points.",
        improved: "We've helped 200+ startups look like Fortune 500 companies. No contracts, no drama, just great design that converts visitors into customers. Start today and see designs in 48 hours.",
        changes: [
          "Added specific proof point (200+ startups)",
          "Removed all jargon words",
          "Added specific timeline (48 hours)",
          "Included signature phrase 'no drama'"
        ],
        scoreImprovement: 60
      },
      cta: {
        analysis: "Generic CTA that doesn't communicate value or urgency",
        improved: "Start Getting Designs Tomorrow →",
        changes: [
          "Added specific timeline for value",
          "Used action verb 'Start'",
          "Added visual arrow for momentum"
        ],
        scoreImprovement: 35
      },
      general: {
        analysis: "Content lacks personality, uses corporate jargon, and doesn't connect emotionally with the reader.",
        improved: text.replace(/seamless/gi, 'smooth')
                     .replace(/innovative/gi, 'creative')
                     .replace(/leverage/gi, 'use')
                     .replace(/optimize/gi, 'improve') + " No drama, just results.",
        changes: [
          "Replaced jargon with simple words",
          "Added signature phrase at the end",
          "Made tone more conversational"
        ],
        scoreImprovement: 25
      }
    };

    return improvements[contentType] || improvements.general;
  }

  /**
   * Mock content generation for demonstration
   */
  mockGenerateContent(contentType, context) {
    const templates = {
      hero: {
        headline: "Your Design Team Just Called in Sick. We're Your Cure.",
        description: "Get unlimited design work for one flat monthly fee. No hiring, no contracts, no excuses. Just world-class creative work that makes your competition nervous."
      },
      cta: {
        primary: "See Plans & Start Today",
        alternatives: [
          "Get Your First Design in 48 Hours",
          "Start Building Something Beautiful",
          "Join 200+ Growing Companies",
          "Book a 15-Minute Demo"
        ]
      },
      testimonial: {
        quote: "I was skeptical about design subscriptions until DesignWorks delivered our entire rebrand in 2 weeks. What used to take agencies 3 months and $50k, they did better, faster, and for a fraction of the cost. Game changer.",
        author: "Sarah Mitchell",
        role: "CEO at TechFlow"
      },
      feature: {
        title: "Unlimited Revisions (Yes, Really)",
        description: "Keep tweaking until it's perfect. No hidden fees, no angry emails, no 'that'll be extra' surprises.",
        benefit: "Launch with confidence knowing every pixel is exactly where you want it."
      },
      problem: {
        problem: "You're losing customers to competitors with better design, but agencies quote you $30k and 3 months.",
        impact: "Every day you wait, more customers choose your competition because they look more trustworthy.",
        solution: "Get agency-quality design starting tomorrow, for less than the cost of a junior designer."
      }
    };

    return templates[contentType] || { content: "Generated content would appear here with AI API" };
  }

  /**
   * Generate comprehensive improvement report
   */
  async generateReport(analysisResults) {
    const timestamp = new Date().toISOString();
    
    let report = `# AI-Powered Content Analysis Report
Generated: ${new Date(timestamp).toLocaleString()}

## Summary
- Files Analyzed: ${analysisResults.length}
- Total Improvements Found: ${analysisResults.reduce((sum, r) => sum + r.totalImprovements, 0)}
- Average Score Improvement Potential: ${(
      analysisResults.reduce((sum, r) => sum + r.avgScoreImprovement, 0) / analysisResults.length
    ).toFixed(1)}%

## Detailed Improvements by File
`;

    for (const result of analysisResults) {
      if (result.improvements.length === 0) continue;
      
      report += `\n### ${result.file}\n`;
      report += `*${result.totalImprovements} improvements, avg +${result.avgScoreImprovement.toFixed(1)}% score*\n\n`;
      
      for (const improvement of result.improvements.slice(0, 3)) {
        report += `#### ${improvement.path}\n\n`;
        report += `**Analysis:** ${improvement.analysis}\n\n`;
        report += `**Original:**\n> ${improvement.original}\n\n`;
        report += `**Improved:**\n> ${improvement.improved}\n\n`;
        report += `**Changes:**\n${improvement.changes.map(c => `- ${c}`).join('\n')}\n\n`;
        report += `**Score Improvement:** +${improvement.scoreImprovement}%\n\n`;
        report += `---\n\n`;
      }
      
      if (result.improvements.length > 3) {
        report += `*...and ${result.improvements.length - 3} more improvements*\n\n`;
      }
    }

    report += `\n## Next Steps
1. Review the AI-suggested improvements above
2. Run \`npm run ai:apply\` to apply improvements interactively
3. Generate new content with \`npm run ai:generate [type]\`
4. Fine-tune results with manual review

## Note
${this.useMock 
  ? '⚠️  Running in mock mode. Add OPENAI_API_KEY or ANTHROPIC_API_KEY to .env.local for real AI analysis.'
  : '✅ Using ' + this.provider + ' AI for analysis'
}`;

    return report;
  }
}

// CLI usage
if (process.argv[1]?.endsWith('ai_content_improver.js')) {
  const improver = new AIContentImprover();
  const command = process.argv[2];
  const args = process.argv.slice(3);
  
  if (!command || command === '--help') {
    console.log(`
🤖 AI Content Improver

Usage:
  node ai_content_improver.js analyze <file/directory>   # Analyze and suggest improvements
  node ai_content_improver.js generate <type> [context]  # Generate new content
  node ai_content_improver.js improve <file> <path>      # Improve specific field
  
Content Types:
  hero, cta, testimonial, feature, problem, description
  
Examples:
  node ai_content_improver.js analyze ../data/hero.json
  node ai_content_improver.js generate hero "Premium design for startups"
  node ai_content_improver.js improve ../data/services.json services.title
  
Environment:
  Set OPENAI_API_KEY or ANTHROPIC_API_KEY in .env.local
    `);
    process.exit(0);
  }
  
  (async () => {
    try {
      if (command === 'analyze') {
        const targetPath = args[0] || '../data';
        const results = [];
        
        if (fs.statSync(targetPath).isDirectory()) {
          const files = fs.readdirSync(targetPath)
            .filter(f => f.endsWith('.json'))
            .map(f => path.join(targetPath, f));
          
          for (const file of files.slice(0, 3)) { // Limit to 3 files for demo
            const result = await improver.analyzeFile(file);
            results.push(result);
          }
        } else {
          const result = await improver.analyzeFile(targetPath);
          results.push(result);
        }
        
        const report = await improver.generateReport(results);
        const reportPath = path.join(__dirname, 'reports', 'ai_analysis.md');
        fs.writeFileSync(reportPath, report);
        
        console.log('\n' + report);
        console.log(`\n📄 Report saved to: ${reportPath}`);
        
      } else if (command === 'generate') {
        const contentType = args[0] || 'hero';
        const context = args.slice(1).join(' ') || '';
        
        console.log(`\n🤖 Generating ${contentType} content...\n`);
        const result = await improver.generateNewContent(contentType, context);
        console.log(JSON.stringify(result, null, 2));
        
      } else if (command === 'improve') {
        const file = args[0];
        const fieldPath = args[1];
        
        if (!file || !fieldPath) {
          console.error('Please provide file and field path');
          process.exit(1);
        }
        
        const content = JSON.parse(fs.readFileSync(file, 'utf8'));
        
        // Extract field value
        const parts = fieldPath.split('.');
        let value = content;
        for (const part of parts) {
          value = value[part];
        }
        
        if (typeof value !== 'string') {
          console.error('Field is not a string');
          process.exit(1);
        }
        
        console.log(`\n🤖 Improving ${fieldPath}...\n`);
        const result = await improver.analyzeAndImprove(value);
        console.log(JSON.stringify(result, null, 2));
      }
      
    } catch (error) {
      console.error('Error:', error.message);
      process.exit(1);
    }
  })();
}

export default AIContentImprover;