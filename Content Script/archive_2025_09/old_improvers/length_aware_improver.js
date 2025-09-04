#!/usr/bin/env node

/**
 * Length-Aware Content Improver
 * Maintains original word count to prevent layout issues
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import chalk from 'chalk';
import dotenv from 'dotenv';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

class LengthAwareImprover {
  constructor() {
    this.apiKey = process.env.OPENAI_API_KEY;
    if (!this.apiKey) {
      throw new Error('OPENAI_API_KEY not found in .env.local');
    }
  }
  
  /**
   * Get sample content with various lengths
   */
  getSampleContent() {
    return [
      {
        file: 'hero.json',
        field: 'title',
        original: 'Premium Design Subscription',
        wordCount: 3,
        charCount: 28,
        type: 'headline'
      },
      {
        file: 'hero.json',
        field: 'subtitle',
        original: 'World-class design, predictable pricing, no drama',
        wordCount: 7,
        charCount: 50,
        type: 'subtitle'
      },
      {
        file: 'services.json',
        field: 'description',
        original: 'We deliver comprehensive design solutions that elevate your brand and drive business growth through strategic creativity and seamless execution.',
        wordCount: 20,
        charCount: 162,
        type: 'description'
      },
      {
        file: 'weBelieve.json',
        field: 'philosophy',
        original: "We believe exceptional design shouldn't be a luxury reserved for Fortune 500 companies. Every business, regardless of size, deserves access to the kind of thoughtful, strategic design that transforms brands and drives results.",
        wordCount: 35,
        charCount: 235,
        type: 'philosophy'
      },
      {
        file: 'founder.json',
        field: 'quote',
        original: "I started DesignWorks with a simple conviction: that good design has the power to level the playing field. I've watched too many brilliant businesses struggle to communicate their value because they couldn't access the kind of strategic design that their larger competitors take for granted.",
        wordCount: 47,
        charCount: 289,
        type: 'longform'
      }
    ];
  }
  
  /**
   * Improve content while maintaining length
   */
  async improveWithLengthConstraint(original, type, wordCount, charCount) {
    const systemPrompt = `You are rewriting copy for DesignWorks Bureau website.

CRITICAL CONSTRAINT: The improved version MUST be the same length as the original to prevent layout issues.
- Original has ${wordCount} words and ${charCount} characters
- Your improvement MUST have ${wordCount} words (±1 word maximum)
- Character count should be within 10% of ${charCount}

BRAND VOICE:
- Gary Vee directness: Clear, no BS
- Rory Sutherland insight: Clever angles
- Remove jargon: world-class, leverage, seamless, strategic, innovative
- Keep it conversational but professional

LENGTH RULES:
1. Count every word carefully
2. If original is 7 words, improved must be 6-8 words
3. Use contractions to save space (we're, you'll, don't)
4. Replace long words with short ones
5. Never exceed the original length`;

    const prompts = {
      headline: `Rewrite this headline in EXACTLY ${wordCount} words.
Remove any jargon. Be direct and memorable.

Original (${wordCount} words): "${original}"

Improved (MUST be ${wordCount} words):`,

      subtitle: `Rewrite this subtitle in EXACTLY ${wordCount} words (±1 allowed).
Remove "world-class" and similar jargon. Keep it punchy.

Original (${wordCount} words): "${original}"

Improved (${wordCount} words):`,

      description: `Rewrite this description in EXACTLY ${wordCount} words (±2 allowed).
Remove corporate jargon. Be specific about benefits.

Original (${wordCount} words): "${original}"

Improved (${wordCount} words):`,

      philosophy: `Rewrite this philosophy statement in ${wordCount} words (±3 allowed).
Keep the core message but remove jargon. Make it more human.

Original (${wordCount} words): "${original}"

Improved (${wordCount} words):`,

      longform: `Rewrite this longer text in ${wordCount} words (±5 allowed).
Maintain the message but simplify the language.

Original (${wordCount} words): "${original}"

Improved (${wordCount} words):`
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
            { role: 'user', content: prompts[type] || prompts.description }
          ],
          temperature: 0.7,
          max_tokens: Math.min(wordCount * 15, 200) // Limit based on expected length
        })
      });
      
      const data = await response.json();
      if (data.choices && data.choices[0]) {
        const improved = data.choices[0].message.content.trim().replace(/^["']|["']$/g, '');
        
        // Verify word count
        const improvedWordCount = improved.split(/\s+/).filter(w => w).length;
        
        // If way off, return original
        const tolerance = type === 'longform' ? 5 : type === 'philosophy' ? 3 : 2;
        if (Math.abs(improvedWordCount - wordCount) > tolerance) {
          console.log(chalk.yellow(`    ⚠️  Word count off: ${improvedWordCount} vs ${wordCount}, keeping original`));
          return original;
        }
        
        return improved;
      }
      return original;
      
    } catch (error) {
      console.log(chalk.red(`    Error: ${error.message}`));
      return original;
    }
  }
  
  /**
   * Manual alternatives that match length
   */
  getLengthMatchedAlternatives(original, wordCount) {
    const alternatives = {
      'Premium Design Subscription': [
        'Professional Design Service', // 3 words
        'Quality Design Subscription', // 3 words
        'Smart Design Solution' // 3 words
      ],
      'World-class design, predictable pricing, no drama': [
        'Great design, fixed pricing, no hassle', // 7 words
        'Quality design, clear costs, zero drama', // 7 words
        'Beautiful work, predictable prices, no nonsense' // 7 words
      ]
    };
    
    return alternatives[original] || [];
  }
  
  async generateImprovements() {
    console.log(chalk.cyan.bold('\n📏 LENGTH-AWARE CONTENT IMPROVEMENT\n'));
    console.log(chalk.yellow('Maintaining original word counts to prevent layout issues\n'));
    
    const content = this.getSampleContent();
    const improvements = [];
    
    for (let i = 0; i < content.length; i++) {
      const item = content[i];
      
      console.log(chalk.gray(`\n[${i + 1}/${content.length}] ${item.field}`));
      console.log(chalk.gray(`Original: ${item.wordCount} words, ${item.charCount} chars`));
      
      // Show original
      if (item.original.length > 80) {
        console.log(`"${item.original.substring(0, 80)}..."`);
      } else {
        console.log(`"${item.original}"`);
      }
      
      // Generate improvement
      const improved = await this.improveWithLengthConstraint(
        item.original, 
        item.type, 
        item.wordCount,
        item.charCount
      );
      
      // Calculate metrics
      const improvedWordCount = improved.split(/\s+/).filter(w => w).length;
      const improvedCharCount = improved.length;
      const wordDiff = improvedWordCount - item.wordCount;
      const charDiff = improvedCharCount - item.charCount;
      
      // Show improved
      console.log(chalk.green('\nImproved:'));
      if (improved.length > 80) {
        console.log(`"${improved.substring(0, 80)}..."`);
      } else {
        console.log(`"${improved}"`);
      }
      
      // Show metrics
      const wordStatus = Math.abs(wordDiff) <= 1 ? chalk.green('✓') : chalk.yellow('⚠');
      const charStatus = Math.abs(charDiff / item.charCount) <= 0.1 ? chalk.green('✓') : chalk.yellow('⚠');
      
      console.log(chalk.gray(`Result: ${improvedWordCount} words ${wordStatus} (${wordDiff >= 0 ? '+' : ''}${wordDiff}), ${improvedCharCount} chars ${charStatus} (${charDiff >= 0 ? '+' : ''}${charDiff})`));
      
      // Get manual alternatives
      const alternatives = this.getLengthMatchedAlternatives(item.original, item.wordCount);
      
      improvements.push({
        file: item.file,
        field: item.field,
        type: item.type,
        original: item.original,
        improved: improved,
        alternatives: alternatives,
        metrics: {
          originalWords: item.wordCount,
          originalChars: item.charCount,
          improvedWords: improvedWordCount,
          improvedChars: improvedCharCount,
          wordDiff: wordDiff,
          charDiff: charDiff,
          withinTolerance: Math.abs(wordDiff) <= 2
        }
      });
      
      await new Promise(resolve => setTimeout(resolve, 800));
    }
    
    // Save improvements
    const outputDir = './improvements';
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    const outputFile = path.join(outputDir, 'length_aware_improvements.json');
    fs.writeFileSync(outputFile, JSON.stringify(improvements, null, 2));
    
    // Generate review HTML
    this.generateReviewHTML(improvements);
    
    // Summary
    console.log(chalk.cyan('\n📊 Length Constraint Summary:'));
    const withinTolerance = improvements.filter(i => i.metrics.withinTolerance).length;
    console.log(chalk.green(`  ✓ ${withinTolerance}/${improvements.length} within word count tolerance`));
    
    const avgWordDiff = improvements.reduce((sum, i) => sum + Math.abs(i.metrics.wordDiff), 0) / improvements.length;
    console.log(chalk.gray(`  Average word difference: ${avgWordDiff.toFixed(1)} words`));
    
    console.log(chalk.green('\n✅ Length-aware improvements complete!\n'));
    
    return improvements;
  }
  
  generateReviewHTML(improvements) {
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Length-Aware Content Review</title>
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
            padding: 30px;
            border-radius: 12px;
            margin-bottom: 20px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        
        h1 { 
            color: #333; 
            font-size: 28px;
            margin-bottom: 10px;
        }
        
        .subtitle {
            color: #666;
            line-height: 1.5;
        }
        
        .constraint-note {
            background: #e3f2fd;
            border-left: 4px solid #2196f3;
            padding: 15px;
            margin: 20px 0;
            border-radius: 4px;
        }
        
        .improvement-card {
            background: white;
            border-radius: 12px;
            margin-bottom: 20px;
            overflow: hidden;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        
        .card-header {
            padding: 20px;
            background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
            color: white;
        }
        
        .field-info {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .field-name {
            font-size: 18px;
            font-weight: 600;
        }
        
        .length-badge {
            background: rgba(255,255,255,0.2);
            padding: 5px 12px;
            border-radius: 20px;
            font-size: 14px;
        }
        
        .comparison {
            padding: 25px;
        }
        
        .text-box {
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 15px;
            position: relative;
            font-size: 16px;
            line-height: 1.6;
        }
        
        .original {
            background: #fff9e6;
            border: 1px solid #ffc107;
        }
        
        .improved {
            background: #e8f5e9;
            border: 1px solid #4caf50;
        }
        
        .alternatives {
            background: #f5f5f5;
            border: 1px solid #9e9e9e;
        }
        
        .text-label {
            position: absolute;
            top: -10px;
            left: 15px;
            background: white;
            padding: 0 8px;
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        .metrics {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 15px;
            padding: 20px;
            background: #f8f9fa;
            border-top: 1px solid #e0e0e0;
        }
        
        .metric {
            text-align: center;
        }
        
        .metric-value {
            font-size: 24px;
            font-weight: bold;
            display: block;
        }
        
        .metric-label {
            font-size: 12px;
            color: #666;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-top: 5px;
        }
        
        .success { color: #4caf50; }
        .warning { color: #ff9800; }
        .error { color: #f44336; }
        
        .alt-option {
            padding: 12px;
            background: white;
            border-radius: 6px;
            margin-bottom: 8px;
            border: 1px solid #e0e0e0;
            cursor: pointer;
            transition: all 0.2s;
        }
        
        .alt-option:hover {
            border-color: #F97316;
            background: #fff3e0;
        }
        
        .status-icon {
            display: inline-block;
            margin-left: 10px;
            font-size: 18px;
        }
        
        .layout-warning {
            background: #fff3cd;
            border: 1px solid #ffc107;
            padding: 10px;
            border-radius: 6px;
            margin-top: 15px;
            font-size: 14px;
            color: #856404;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📏 Length-Aware Content Review</h1>
            <p class="subtitle">
                Improvements that maintain original word count to prevent layout issues.<br>
                Each suggestion respects your design constraints.
            </p>
            
            <div class="constraint-note">
                <strong>⚙️ Layout Protection:</strong> All improvements maintain the original word count (±2 words max) 
                to ensure they fit perfectly in your existing design without breaking layouts.
            </div>
        </div>
        
        ${improvements.map(item => {
          const statusIcon = item.metrics.withinTolerance ? 
            '<span class="status-icon success">✓</span>' : 
            '<span class="status-icon warning">⚠️</span>';
          
          const wordDiffDisplay = item.metrics.wordDiff === 0 ? 
            'Perfect match' : 
            `${item.metrics.wordDiff > 0 ? '+' : ''}${item.metrics.wordDiff} words`;
          
          return `
            <div class="improvement-card">
                <div class="card-header">
                    <div class="field-info">
                        <span class="field-name">${item.field} ${statusIcon}</span>
                        <span class="length-badge">${item.metrics.originalWords} words</span>
                    </div>
                </div>
                
                <div class="comparison">
                    <div class="text-box original">
                        <span class="text-label">Original</span>
                        ${item.original}
                    </div>
                    
                    <div class="text-box improved">
                        <span class="text-label">Improved (${item.metrics.improvedWords} words)</span>
                        ${item.improved}
                    </div>
                    
                    ${item.alternatives && item.alternatives.length > 0 ? `
                        <div class="text-box alternatives">
                            <span class="text-label">Manual Alternatives (${item.metrics.originalWords} words each)</span>
                            ${item.alternatives.map(alt => `
                                <div class="alt-option">${alt}</div>
                            `).join('')}
                        </div>
                    ` : ''}
                    
                    ${!item.metrics.withinTolerance ? `
                        <div class="layout-warning">
                            ⚠️ This improvement is ${Math.abs(item.metrics.wordDiff)} words ${item.metrics.wordDiff > 0 ? 'longer' : 'shorter'} 
                            than the original. This may cause layout issues.
                        </div>
                    ` : ''}
                </div>
                
                <div class="metrics">
                    <div class="metric">
                        <span class="metric-value ${item.metrics.wordDiff === 0 ? 'success' : Math.abs(item.metrics.wordDiff) <= 2 ? 'warning' : 'error'}">
                            ${wordDiffDisplay}
                        </span>
                        <span class="metric-label">Word Difference</span>
                    </div>
                    <div class="metric">
                        <span class="metric-value">${item.metrics.improvedWords}</span>
                        <span class="metric-label">New Word Count</span>
                    </div>
                    <div class="metric">
                        <span class="metric-value ${Math.abs(item.metrics.charDiff / item.metrics.originalChars) <= 0.1 ? 'success' : 'warning'}">
                            ${item.metrics.charDiff > 0 ? '+' : ''}${item.metrics.charDiff}
                        </span>
                        <span class="metric-label">Char Difference</span>
                    </div>
                    <div class="metric">
                        <span class="metric-value ${item.metrics.withinTolerance ? 'success' : 'error'}">
                            ${item.metrics.withinTolerance ? 'Safe' : 'Risk'}
                        </span>
                        <span class="metric-label">Layout Impact</span>
                    </div>
                </div>
            </div>
          `;
        }).join('')}
    </div>
</body>
</html>`;
    
    const htmlPath = path.join('./improvements', 'length_aware_review.html');
    fs.writeFileSync(htmlPath, html);
    
    console.log(chalk.cyan('📄 Review page created: improvements/length_aware_review.html'));
    console.log(chalk.yellow('Open with: npm run review:length\n'));
  }
}

// Run if called directly
if (process.argv[1]?.endsWith('length_aware_improver.js')) {
  const improver = new LengthAwareImprover();
  improver.generateImprovements().catch(console.error);
}

export default LengthAwareImprover;