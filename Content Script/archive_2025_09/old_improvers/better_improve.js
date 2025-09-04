#!/usr/bin/env node

/**
 * Better Content Improver - Actually matches your brand voice
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import chalk from 'chalk';
import dotenv from 'dotenv';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

class BetterImprover {
  constructor() {
    this.apiKey = process.env.OPENAI_API_KEY;
    if (!this.apiKey) {
      throw new Error('OPENAI_API_KEY not found in .env.local');
    }
  }
  
  /**
   * Real content that needs improvement
   */
  getContentToImprove() {
    return [
      {
        file: 'hero.json',
        field: 'title',
        original: 'Premium Design Subscription',
        context: 'Main headline - needs to be punchy and different',
        type: 'hero'
      },
      {
        file: 'hero.json', 
        field: 'subtitle',
        original: 'World-class design, predictable pricing, no drama',
        context: 'This is actually pretty good - maybe just remove "world-class"',
        type: 'subtitle'
      },
      {
        file: 'services.json',
        field: 'description',
        original: 'We deliver comprehensive design solutions that elevate your brand and drive business growth through strategic creativity and seamless execution.',
        context: 'This is full of corporate jargon - needs complete rewrite',
        type: 'body'
      },
      {
        file: 'cta.json',
        field: 'button',
        original: 'Get Started',
        context: 'Generic CTA - needs more specificity',
        type: 'cta'
      },
      {
        file: 'process.json',
        field: 'description', 
        original: 'Our innovative process leverages cutting-edge methodologies to deliver transformative results.',
        context: 'This is the worst corporate speak - fix this!',
        type: 'body'
      }
    ];
  }
  
  /**
   * Better prompting that actually understands your brand
   */
  async improveContent(original, type, context) {
    const systemPrompt = `You are rewriting copy for DesignWorks Bureau, a design subscription service.

BRAND VOICE:
- Gary Vee directness: Say it straight, no fluff
- Rory Sutherland psychology: Interesting angles, not obvious
- Anti-corporate: Never use words like "leverage", "seamless", "innovative", "world-class"
- Conversational: Write like you talk to a friend
- Confident but not cocky

GOOD EXAMPLES:
- "Design that works. No drama."
- "Stop buying design that doesn't work"
- "We've got you covered"
- "Good design. Every month. No drama."

BAD EXAMPLES:
- "Unlock your potential"
- "Transform your journey"
- "Elevate your brand"
- Anything with "elite" or "premium"`;

    const prompts = {
      hero: `Rewrite this headline to be memorable and different.
Think Ogilvy headlines - specific, intriguing, benefit-focused.
No generic "unlock" or "transform" language.

Current: "${original}"
Context: ${context}

New version (no quotes, just the text):`,
      
      subtitle: `Make this more conversational and specific.
Remove any corporate words. Keep it short.

Current: "${original}"
Context: ${context}

New version:`,
      
      body: `Completely rewrite this corporate jargon.
Be direct. Explain what you actually do. No BS.

Current: "${original}"
Context: ${context}

New version:`,
      
      cta: `Make this CTA specific and action-oriented.
Tell them exactly what happens when they click.

Current: "${original}"
Context: ${context}

New version:`
    };
    
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'gpt-4-turbo-preview',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: prompts[type] || prompts.body }
          ],
          temperature: 0.8,
          max_tokens: 100
        })
      });
      
      const data = await response.json();
      if (data.choices && data.choices[0]) {
        // Remove any quotes the AI might add
        return data.choices[0].message.content.trim().replace(/^["']|["']$/g, '');
      }
      return original;
      
    } catch (error) {
      console.log(chalk.yellow(`  ⚠️  Error: ${error.message}`));
      return original;
    }
  }
  
  /**
   * Also provide manual alternatives
   */
  getManualAlternatives() {
    return {
      'Premium Design Subscription': [
        'Design that actually ships',
        'Your design team, minus the drama',
        'Design that works. Finally.',
        'Real design. Real results. No BS.'
      ],
      'World-class design, predictable pricing, no drama': [
        'Great design, predictable pricing, no drama', // Just remove "world-class"
        'Design that ships. Prices that don\'t change. Simple.',
        'Good design, clear pricing, zero hassle',
        'Design done right. Same price every month.'
      ],
      'Get Started': [
        'Start getting designs tomorrow',
        'See our work first',
        'Book a 15-min call',
        'Get your first design'
      ]
    };
  }
  
  async generateImprovements() {
    console.log(chalk.cyan.bold('\n🎯 BETTER CONTENT IMPROVEMENT\n'));
    
    const content = this.getContentToImprove();
    const manualAlts = this.getManualAlternatives();
    const improvements = [];
    
    console.log(chalk.yellow(`Improving ${content.length} pieces with actual brand voice...\n`));
    
    for (let i = 0; i < content.length; i++) {
      const item = content[i];
      
      // Show progress
      console.log(chalk.gray(`[${i + 1}/${content.length}] ${item.field}...`));
      
      // Get AI improvement
      const aiImproved = await this.improveContent(item.original, item.type, item.context);
      
      // Get manual alternatives if available
      const manualOptions = manualAlts[item.original] || [];
      
      improvements.push({
        file: item.file,
        field: item.field,
        original: item.original,
        improved: aiImproved,
        alternatives: manualOptions,
        context: item.context,
        changed: aiImproved !== item.original
      });
      
      // Show inline preview
      if (aiImproved !== item.original) {
        console.log(chalk.green(`  ✓ ${item.original}`));
        console.log(chalk.cyan(`  → ${aiImproved}`));
      } else {
        console.log(chalk.yellow(`  - No change needed`));
      }
      
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    console.log(chalk.green('\n✅ Better improvements generated!\n'));
    
    // Save improvements
    const outputDir = './improvements';
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    const outputFile = path.join(outputDir, 'better_improvements.json');
    fs.writeFileSync(outputFile, JSON.stringify(improvements, null, 2));
    
    // Generate better review HTML
    this.generateBetterReviewHTML(improvements);
    
    return improvements;
  }
  
  generateBetterReviewHTML(improvements) {
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Better Content Review - Actual Brand Voice</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: #f5f5f5;
            padding: 40px 20px;
        }
        .container { 
            max-width: 1000px; 
            margin: 0 auto;
        }
        
        .header {
            background: white;
            padding: 40px;
            border-radius: 12px;
            margin-bottom: 30px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        
        h1 { 
            color: #333; 
            font-size: 28px;
            margin-bottom: 10px;
        }
        
        .subtitle {
            color: #666;
            font-size: 16px;
            line-height: 1.5;
        }
        
        .important-note {
            background: #fff3cd;
            border-left: 4px solid #F97316;
            padding: 20px;
            margin: 20px 0;
            border-radius: 8px;
        }
        
        .improvement {
            background: white;
            border-radius: 12px;
            padding: 30px;
            margin-bottom: 20px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        
        .context {
            background: #f0f0f0;
            padding: 10px 15px;
            border-radius: 6px;
            font-size: 14px;
            color: #666;
            margin-bottom: 20px;
            font-style: italic;
        }
        
        .field-label {
            font-size: 12px;
            color: #F97316;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 15px;
            font-weight: 600;
        }
        
        .original-text {
            font-size: 20px;
            color: #333;
            margin-bottom: 20px;
            padding: 20px;
            background: #f8f9fa;
            border-radius: 8px;
            border-left: 4px solid #ffc107;
        }
        
        .improved-text {
            font-size: 20px;
            color: #333;
            margin-bottom: 20px;
            padding: 20px;
            background: #e8f5e9;
            border-radius: 8px;
            border-left: 4px solid #4caf50;
        }
        
        .alternatives {
            margin-top: 20px;
            padding: 20px;
            background: #f5f5f5;
            border-radius: 8px;
        }
        
        .alt-title {
            font-size: 14px;
            color: #666;
            margin-bottom: 15px;
            font-weight: 600;
        }
        
        .alt-option {
            padding: 12px 15px;
            background: white;
            border-radius: 6px;
            margin-bottom: 10px;
            border: 2px solid transparent;
            cursor: pointer;
            transition: all 0.2s;
        }
        
        .alt-option:hover {
            border-color: #F97316;
            transform: translateX(5px);
        }
        
        .verdict {
            margin-top: 20px;
            padding: 15px;
            background: #e3f2fd;
            border-radius: 8px;
            font-size: 14px;
            color: #1976d2;
        }
        
        .label {
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            color: #999;
            margin-bottom: 5px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎯 Better Content Review</h1>
            <p class="subtitle">
                AI improvements that actually match your brand voice<br>
                <strong>Gary Vee directness + Rory Sutherland psychology</strong>
            </p>
            
            <div class="important-note">
                <strong>⚠️ Important:</strong> Your original copy is often already good! 
                "World-class design, predictable pricing, no drama" is great copy. 
                The AI suggestions are just alternatives to consider, not necessarily improvements.
            </div>
        </div>
        
        ${improvements.map(item => `
            <div class="improvement">
                <div class="field-label">${item.file} → ${item.field}</div>
                
                ${item.context ? `<div class="context">💭 ${item.context}</div>` : ''}
                
                <div class="label">Current Copy</div>
                <div class="original-text">${item.original}</div>
                
                <div class="label">AI Suggestion</div>
                <div class="improved-text">${item.improved}</div>
                
                ${item.alternatives && item.alternatives.length > 0 ? `
                    <div class="alternatives">
                        <div class="alt-title">💡 Other Options to Consider:</div>
                        ${item.alternatives.map(alt => `
                            <div class="alt-option">${alt}</div>
                        `).join('')}
                    </div>
                ` : ''}
                
                <div class="verdict">
                    <strong>Verdict:</strong> 
                    ${item.original === item.improved ? 
                        'Original is fine - no change needed' : 
                        'Consider the suggestion, but trust your gut. Your original might be better.'}
                </div>
            </div>
        `).join('')}
    </div>
</body>
</html>`;
    
    const htmlPath = path.join('./improvements', 'better_review.html');
    fs.writeFileSync(htmlPath, html);
    
    console.log(chalk.cyan('📄 Better review page created: improvements/better_review.html'));
    console.log(chalk.yellow('\nOpen with: npm run review:better\n'));
  }
}

// Run if called directly
if (process.argv[1]?.endsWith('better_improve.js')) {
  const improver = new BetterImprover();
  improver.generateImprovements().catch(console.error);
}

export default BetterImprover;