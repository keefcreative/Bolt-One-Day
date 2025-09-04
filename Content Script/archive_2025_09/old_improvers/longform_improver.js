#!/usr/bin/env node

/**
 * Long-form Content Improver
 * Handles paragraphs and multi-sentence content
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import chalk from 'chalk';
import dotenv from 'dotenv';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

class LongFormImprover {
  constructor() {
    this.apiKey = process.env.OPENAI_API_KEY;
    if (!this.apiKey) {
      throw new Error('OPENAI_API_KEY not found in .env.local');
    }
  }
  
  /**
   * Get long-form content samples
   */
  getLongFormContent() {
    return [
      {
        file: 'weBelieve.json',
        field: 'philosophy.description',
        original: "We believe exceptional design shouldn't be a luxury reserved for Fortune 500 companies. Every business, regardless of size, deserves access to the kind of thoughtful, strategic design that transforms brands and drives results.",
        type: 'philosophy',
        context: 'Company philosophy statement - needs to be inspiring but not preachy'
      },
      {
        file: 'weBelieve.json',
        field: 'founderMessage.quotes[0]',
        original: "I started DesignWorks with a simple conviction: that good design has the power to level the playing field. I've watched too many brilliant businesses struggle to communicate their value because they couldn't access the kind of strategic design that their larger competitors take for granted.",
        type: 'founder_story',
        context: 'Founder message - should be personal and authentic'
      },
      {
        file: 'weBelieve.json',
        field: 'founderMessage.quotes[1]',
        original: "Our subscription model isn't just about convenience—it's about democratising access to world-class creative services. Whether you're a startup founder bootstrapping your dream or an established company ready to scale, you deserve design that doesn't just look good, but works strategically for your business.",
        type: 'value_prop',
        context: 'Value proposition - explain the why behind the business model'
      },
      {
        file: 'solutions.json',
        field: 'solutions[0].description',
        original: "Professional design that competes with the big players without the big budget. Cost-effective solutions with quick turnaround times that scale as you grow.",
        type: 'service_description',
        context: 'Service description for SMEs - needs to be compelling but not salesy'
      },
      {
        file: 'weBelieve.json',
        field: 'values[1].description',
        original: "We don't just execute—we collaborate as an extension of your team with genuine investment in your success.",
        type: 'value_statement',
        context: 'Company value - should be clear and distinctive'
      }
    ];
  }
  
  /**
   * Improve long-form content
   */
  async improveLongForm(original, type, context) {
    const systemPrompt = `You are rewriting long-form copy for DesignWorks Bureau.

BRAND VOICE GUIDELINES:
- Gary Vee authenticity: Real talk, no corporate BS, conversational
- Rory Sutherland insight: Unexpected angles, psychological truth
- Keep the human element - this is Keith speaking to other humans
- Remove all jargon but keep professional credibility

RULES FOR LONG-FORM:
1. Keep paragraph structure (don't make it all short sentences)
2. Maintain the core message and intent
3. Remove corporate words: leverage, world-class, strategic, democratising, transformative
4. Add specific examples or details where possible
5. Make it feel like a conversation, not a presentation

GOOD LONG-FORM EXAMPLES:
"Look, here's the thing about design. Most agencies will tell you it's all about strategy and leveraging synergies or whatever. But really? It's about making stuff that works. That connects. That gets people to actually give a damn about what you're selling."

"I've been in this game long enough to see the pattern. Small businesses get quoted insane prices for basic design work. So they either go broke trying to look professional, or they DIY it and look amateur. Neither works. There's got to be a better way."`;

    const prompts = {
      philosophy: `Rewrite this company philosophy to sound less corporate manifesto and more like a genuine belief.
Keep it aspirational but grounded. No grandiose claims.

Original: "${original}"
Context: ${context}

Improved version:`,

      founder_story: `Rewrite this founder's story to sound more authentic and personal.
Like Keith is actually talking to you over coffee, not giving a keynote.

Original: "${original}"
Context: ${context}

Improved version:`,

      value_prop: `Rewrite this value proposition to be clearer and more compelling.
Explain the real benefit, not the feature. Talk outcomes, not process.

Original: "${original}"
Context: ${context}

Improved version:`,

      service_description: `Rewrite this service description to focus on what the customer actually gets.
Be specific about benefits. Avoid generic promises.

Original: "${original}"
Context: ${context}

Improved version:`,

      value_statement: `Rewrite this company value to be more distinctive and memorable.
Show, don't tell. Give a sense of how this actually plays out.

Original: "${original}"
Context: ${context}

Improved version:`
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
            { role: 'user', content: prompts[type] || prompts.value_prop }
          ],
          temperature: 0.8,
          max_tokens: 300 // More tokens for longer content
        })
      });
      
      const data = await response.json();
      if (data.choices && data.choices[0]) {
        return data.choices[0].message.content.trim().replace(/^["']|["']$/g, '');
      }
      return original;
      
    } catch (error) {
      console.log(chalk.yellow(`  Error: ${error.message}`));
      return original;
    }
  }
  
  /**
   * Analyze what's wrong with the original
   */
  analyzeIssues(text) {
    const issues = [];
    
    // Corporate jargon check
    const jargon = [
      'leverage', 'synergy', 'strategic', 'world-class', 'democratising',
      'transformative', 'innovative', 'cutting-edge', 'seamless', 'robust',
      'holistic', 'paradigm', 'disruptive', 'empower', 'optimize'
    ];
    
    const foundJargon = jargon.filter(word => 
      text.toLowerCase().includes(word.toLowerCase())
    );
    
    if (foundJargon.length > 0) {
      issues.push(`Contains jargon: ${foundJargon.join(', ')}`);
    }
    
    // Passive voice check (simple)
    if (text.includes('has been') || text.includes('was being') || text.includes('is being')) {
      issues.push('Uses passive voice');
    }
    
    // Generic phrases
    if (text.includes('best-in-class') || text.includes('industry-leading') || text.includes('next-level')) {
      issues.push('Contains generic marketing speak');
    }
    
    // Sentence length
    const sentences = text.split(/[.!?]+/).filter(s => s.trim());
    const avgWords = sentences.reduce((sum, s) => sum + s.split(' ').length, 0) / sentences.length;
    if (avgWords > 25) {
      issues.push(`Long sentences (avg ${Math.round(avgWords)} words)`);
    }
    
    return issues;
  }
  
  async generateImprovements() {
    console.log(chalk.cyan.bold('\n📝 LONG-FORM CONTENT IMPROVEMENT\n'));
    console.log(chalk.gray('Testing with paragraphs and multi-sentence content\n'));
    
    const content = this.getLongFormContent();
    const improvements = [];
    
    for (let i = 0; i < content.length; i++) {
      const item = content[i];
      
      console.log(chalk.yellow(`\n[${i + 1}/${content.length}] ${item.file} → ${item.field}`));
      console.log(chalk.gray(`Type: ${item.type}`));
      
      // Analyze issues
      const issues = this.analyzeIssues(item.original);
      if (issues.length > 0) {
        console.log(chalk.red(`Issues: ${issues.join(', ')}`));
      }
      
      // Show original (truncated for display)
      console.log(chalk.gray('\nOriginal:'));
      if (item.original.length > 150) {
        console.log(`"${item.original.substring(0, 150)}..."`);
      } else {
        console.log(`"${item.original}"`);
      }
      
      // Generate improvement
      console.log(chalk.cyan('\nGenerating improvement...'));
      const improved = await this.improveLongForm(item.original, item.type, item.context);
      
      // Show improved (truncated for display)
      console.log(chalk.green('\nImproved:'));
      if (improved.length > 150) {
        console.log(`"${improved.substring(0, 150)}..."`);
      } else {
        console.log(`"${improved}"`);
      }
      
      improvements.push({
        file: item.file,
        field: item.field,
        type: item.type,
        original: item.original,
        improved: improved,
        issues: issues,
        changed: improved !== item.original,
        originalWordCount: item.original.split(' ').length,
        improvedWordCount: improved.split(' ').length
      });
      
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    // Save improvements
    const outputDir = './improvements';
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    const outputFile = path.join(outputDir, 'longform_improvements.json');
    fs.writeFileSync(outputFile, JSON.stringify(improvements, null, 2));
    
    // Generate review HTML
    this.generateReviewHTML(improvements);
    
    console.log(chalk.green('\n✅ Long-form improvements complete!\n'));
    
    return improvements;
  }
  
  generateReviewHTML(improvements) {
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Long-form Content Review</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: Georgia, 'Times New Roman', serif;
            background: #f9f9f9;
            padding: 40px 20px;
            line-height: 1.6;
        }
        
        .container { 
            max-width: 900px; 
            margin: 0 auto;
        }
        
        .header {
            background: white;
            padding: 40px;
            border-radius: 12px;
            margin-bottom: 30px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        }
        
        h1 { 
            font-size: 32px;
            margin-bottom: 15px;
            font-weight: normal;
        }
        
        .subtitle {
            color: #666;
            font-size: 18px;
            line-height: 1.6;
        }
        
        .improvement {
            background: white;
            border-radius: 12px;
            margin-bottom: 30px;
            overflow: hidden;
            box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        }
        
        .improvement-header {
            padding: 25px 30px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
        }
        
        .field-label {
            font-size: 14px;
            opacity: 0.9;
            margin-bottom: 5px;
            font-family: -apple-system, BlinkMacSystemFont, sans-serif;
        }
        
        .content-type {
            font-size: 20px;
            font-weight: 600;
            text-transform: capitalize;
            font-family: -apple-system, BlinkMacSystemFont, sans-serif;
        }
        
        .issues {
            margin-top: 15px;
            padding-top: 15px;
            border-top: 1px solid rgba(255,255,255,0.2);
        }
        
        .issue-item {
            display: inline-block;
            padding: 4px 12px;
            background: rgba(255,255,255,0.2);
            border-radius: 20px;
            font-size: 13px;
            margin-right: 10px;
            margin-bottom: 5px;
            font-family: -apple-system, BlinkMacSystemFont, sans-serif;
        }
        
        .comparison {
            padding: 30px;
        }
        
        .version {
            margin-bottom: 30px;
        }
        
        .version-label {
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: #999;
            margin-bottom: 15px;
            font-family: -apple-system, BlinkMacSystemFont, sans-serif;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .word-count {
            font-size: 11px;
            background: #f0f0f0;
            padding: 2px 8px;
            border-radius: 10px;
            color: #666;
        }
        
        .content-text {
            font-size: 18px;
            line-height: 1.8;
            color: #333;
            padding: 20px;
            background: #f9f9f9;
            border-radius: 8px;
            border-left: 4px solid #ddd;
        }
        
        .original .content-text {
            background: #fef9f3;
            border-color: #ffc107;
        }
        
        .improved .content-text {
            background: #f1f8f4;
            border-color: #4caf50;
        }
        
        .actions {
            padding: 20px 30px;
            background: #f5f5f5;
            border-top: 1px solid #e0e0e0;
            display: flex;
            gap: 15px;
            justify-content: center;
        }
        
        .btn {
            padding: 12px 24px;
            border: none;
            border-radius: 6px;
            font-size: 15px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s;
            font-family: -apple-system, BlinkMacSystemFont, sans-serif;
        }
        
        .btn-use {
            background: #4caf50;
            color: white;
        }
        
        .btn-keep {
            background: #ffc107;
            color: #333;
        }
        
        .btn-edit {
            background: #9c27b0;
            color: white;
        }
        
        .analysis {
            padding: 25px 30px;
            background: #f8f8f8;
            border-top: 1px solid #e0e0e0;
        }
        
        .analysis-title {
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: #666;
            margin-bottom: 15px;
            font-family: -apple-system, BlinkMacSystemFont, sans-serif;
        }
        
        .analysis-content {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
        }
        
        .metric {
            display: flex;
            justify-content: space-between;
            padding: 10px;
            background: white;
            border-radius: 6px;
            font-family: -apple-system, BlinkMacSystemFont, sans-serif;
            font-size: 14px;
        }
        
        .metric-label {
            color: #666;
        }
        
        .metric-value {
            font-weight: 600;
            color: #333;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📝 Long-form Content Review</h1>
            <p class="subtitle">
                Reviewing paragraph-length content and multi-sentence copy.<br>
                These changes focus on removing jargon while maintaining professional tone and message clarity.
            </p>
        </div>
        
        ${improvements.map((item, index) => `
            <div class="improvement">
                <div class="improvement-header">
                    <div class="field-label">${item.file} → ${item.field}</div>
                    <div class="content-type">${item.type.replace(/_/g, ' ')}</div>
                    
                    ${item.issues.length > 0 ? `
                        <div class="issues">
                            ${item.issues.map(issue => `
                                <span class="issue-item">${issue}</span>
                            `).join('')}
                        </div>
                    ` : ''}
                </div>
                
                <div class="comparison">
                    <div class="version original">
                        <div class="version-label">
                            Original Copy
                            <span class="word-count">${item.originalWordCount} words</span>
                        </div>
                        <div class="content-text">${item.original}</div>
                    </div>
                    
                    <div class="version improved">
                        <div class="version-label">
                            Improved Version
                            <span class="word-count">${item.improvedWordCount} words</span>
                        </div>
                        <div class="content-text">${item.improved}</div>
                    </div>
                </div>
                
                <div class="analysis">
                    <div class="analysis-title">Analysis</div>
                    <div class="analysis-content">
                        <div class="metric">
                            <span class="metric-label">Word Count Change</span>
                            <span class="metric-value">${item.improvedWordCount - item.originalWordCount > 0 ? '+' : ''}${item.improvedWordCount - item.originalWordCount}</span>
                        </div>
                        <div class="metric">
                            <span class="metric-label">Readability</span>
                            <span class="metric-value">${item.improvedWordCount < item.originalWordCount ? 'Improved' : 'Similar'}</span>
                        </div>
                        <div class="metric">
                            <span class="metric-label">Jargon Removed</span>
                            <span class="metric-value">${item.issues.some(i => i.includes('jargon')) ? 'Yes' : 'N/A'}</span>
                        </div>
                        <div class="metric">
                            <span class="metric-label">Tone</span>
                            <span class="metric-value">More Conversational</span>
                        </div>
                    </div>
                </div>
                
                <div class="actions">
                    <button class="btn btn-use" onclick="alert('Use improved version for ${item.field}')">
                        ✓ Use Improved
                    </button>
                    <button class="btn btn-keep" onclick="alert('Keep original for ${item.field}')">
                        Keep Original
                    </button>
                    <button class="btn btn-edit" onclick="alert('Edit mode for ${item.field}')">
                        ✏️ Edit & Refine
                    </button>
                </div>
            </div>
        `).join('')}
    </div>
</body>
</html>`;
    
    const htmlPath = path.join('./improvements', 'longform_review.html');
    fs.writeFileSync(htmlPath, html);
    
    console.log(chalk.cyan('📄 Review page created: improvements/longform_review.html'));
    console.log(chalk.yellow('Open with: npm run review:longform\n'));
  }
}

// Run if called directly
if (process.argv[1]?.endsWith('longform_improver.js')) {
  const improver = new LongFormImprover();
  improver.generateImprovements().catch(console.error);
}

export default LongFormImprover;