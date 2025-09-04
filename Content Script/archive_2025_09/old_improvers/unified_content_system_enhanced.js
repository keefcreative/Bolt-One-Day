#!/usr/bin/env node

/**
 * Enhanced Unified Content System
 * NOW PASSES ANALYSIS RESULTS TO AI FOR TARGETED IMPROVEMENTS
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import chalk from 'chalk';
import dotenv from 'dotenv';
import BrandVoiceValidator from './brand_voice_validator.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

class EnhancedUnifiedContentSystem {
  constructor() {
    this.apiKey = process.env.OPENAI_API_KEY;
    this.assistantId = process.env.OPENAI_BRANDVOICE_ASSISTANT_ID;
    this.dataPath = '../data';
    this.voiceValidator = new BrandVoiceValidator();
    
    if (!this.apiKey) {
      throw new Error('OPENAI_API_KEY not found in .env.local');
    }
  }
  
  /**
   * Check if content needs improvement WITH DETAILED ANALYSIS
   */
  analyzeContentIssues(text) {
    const issues = {
      jargon: [],
      generic: false,
      tooLong: false,
      voiceScore: null,
      weakPillars: [],
      missingPowerWords: false,
      passiveVoice: false,
      suggestions: []
    };
    
    // 1. Check for jargon (comprehensive list)
    const jargonList = ['leverage', 'synergy', 'innovative', 'world-class', 'seamless', 
                        'transform', 'elevate', 'cutting-edge', 'robust', 'strategic',
                        'premium', 'solutions', 'utilize', 'optimize', 'revolutionize'];
    
    for (const word of jargonList) {
      if (text.toLowerCase().includes(word)) {
        issues.jargon.push(word);
      }
    }
    
    // 2. Check for generic CTAs
    if (text === 'Get Started' || text === 'Learn More' || text === 'Contact Us') {
      issues.generic = true;
      issues.suggestions.push('Make CTA more specific and action-oriented');
    }
    
    // 3. Check length
    const wordCount = text.split(' ').length;
    if (wordCount > 30) {
      issues.tooLong = true;
      issues.suggestions.push(`Shorten from ${wordCount} to under 30 words`);
    }
    
    // 4. Run brand voice analysis
    const voiceAnalysis = this.voiceValidator.validateContent(text, 'general');
    if (voiceAnalysis) {
      issues.voiceScore = voiceAnalysis.scores.overall;
      
      // Identify weak pillars
      if (voiceAnalysis.scores.pillars) {
        Object.entries(voiceAnalysis.scores.pillars).forEach(([pillar, score]) => {
          if (score < 0.7) {
            issues.weakPillars.push({
              pillar,
              score,
              advice: this.getPillarAdvice(pillar)
            });
          }
        });
      }
      
      // Check for power words
      if (voiceAnalysis.scores.powerWords && voiceAnalysis.scores.powerWords < 0.5) {
        issues.missingPowerWords = true;
        issues.suggestions.push('Add power words: start, build, create, grow, fix');
      }
      
      // Add voice-specific suggestions
      if (voiceAnalysis.suggestions) {
        issues.suggestions.push(...voiceAnalysis.suggestions.map(s => s.message));
      }
    }
    
    // 5. Check for passive voice
    const passiveIndicators = ['is being', 'was being', 'has been', 'have been', 'will be', 'are being'];
    if (passiveIndicators.some(indicator => text.toLowerCase().includes(indicator))) {
      issues.passiveVoice = true;
      issues.suggestions.push('Convert passive voice to active voice');
    }
    
    // Determine if improvement is needed
    issues.needsImprovement = issues.jargon.length > 0 || 
                              issues.generic || 
                              issues.tooLong ||
                              (issues.voiceScore && issues.voiceScore < 0.8) ||
                              issues.passiveVoice;
    
    return issues;
  }
  
  /**
   * Get advice for weak pillars
   */
  getPillarAdvice(pillar) {
    const advice = {
      honest: 'Be more direct, cut the fluff, say what you really mean',
      principled: 'Show genuine value, avoid manipulative tactics',
      human: 'Use conversational language, add personality',
      balanced: 'Mix confidence with approachability'
    };
    return advice[pillar] || 'Strengthen this aspect';
  }
  
  /**
   * Improve content WITH CONTEXT from analysis
   */
  async improveWithContext(original, issues) {
    const wordCount = original.split(' ').length;
    
    // Build a context-aware prompt
    let contextPrompt = `Fix these specific issues in the copy while maintaining ${wordCount} words (±2):

ORIGINAL TEXT:
"${original}"

IDENTIFIED ISSUES:`;
    
    if (issues.jargon.length > 0) {
      contextPrompt += `\n- Remove jargon: ${issues.jargon.join(', ')}`;
    }
    
    if (issues.generic) {
      contextPrompt += `\n- Generic CTA - make it specific and compelling`;
    }
    
    if (issues.passiveVoice) {
      contextPrompt += `\n- Convert passive voice to active`;
    }
    
    if (issues.weakPillars.length > 0) {
      issues.weakPillars.forEach(({ pillar, advice }) => {
        contextPrompt += `\n- Weak on "${pillar}" - ${advice}`;
      });
    }
    
    if (issues.missingPowerWords) {
      contextPrompt += `\n- Add power words: start, build, create, grow, fix, ship`;
    }
    
    if (issues.voiceScore) {
      contextPrompt += `\n- Current brand voice score: ${(issues.voiceScore * 100).toFixed(0)}% - aim for 85%+`;
    }
    
    contextPrompt += `

BRAND VOICE REQUIREMENTS:
- Gary Vee directness: No BS, get to the point, use active voice
- Rory Sutherland psychology: Focus on outcomes not features
- Required phrases (use ONE per piece): "No drama", "Design that works", "Actually converts", "Real results"
- Power words to include: start, build, create, grow, fix, ship
- NEVER use: elevate, transform, leverage, premium, seamless, innovative, solutions

CRITICAL: Each improved piece must be DIFFERENT. No duplicate outputs.

IMPROVED VERSION (EXACTLY ${wordCount} words):`;

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
            {
              role: 'system',
              content: `You fix specific identified issues in website copy. Be surgical - only fix what's broken.

Examples of good improvements:
- "Premium Design & Development" → "Design Without The Drama"
- "Creative Design Solutions That Captivate" → "Design That Actually Converts Visitors"
- "Transform your brand" → "Fix your conversion problem"
- "Get Started" → "Start Today"
- "Global Clients" → "Growing Companies"

Never use: elevate, transform, leverage, solutions, premium, innovative, seamless.
Always be specific about outcomes: conversions, revenue, growth, customers.`
            },
            {
              role: 'user',
              content: contextPrompt
            }
          ],
          temperature: 0.6,  // Lower for more consistent output
          max_tokens: Math.min(wordCount * 15, 250)
        })
      });
      
      const data = await response.json();
      if (data.choices && data.choices[0]) {
        const improved = data.choices[0].message.content.trim().replace(/^["']|["']$/g, '');
        
        // Re-analyze the improved version
        const improvedIssues = this.analyzeContentIssues(improved);
        
        // Check if AI introduced NEW jargon (fail!)
        const newJargon = improvedIssues.jargon.filter(j => !issues.jargon.includes(j));
        if (newJargon.length > 0) {
          console.log(chalk.red(`      ⚠️  AI introduced new jargon: ${newJargon.join(', ')}`));
        }
        
        return {
          text: improved,
          originalScore: issues.voiceScore || 0,
          improvedScore: improvedIssues.voiceScore || 0,
          issuesFixed: {
            jargon: issues.jargon.filter(j => !improved.toLowerCase().includes(j)),
            newJargonIntroduced: newJargon,
            voiceImproved: (improvedIssues.voiceScore || 0) > (issues.voiceScore || 0),
            powerWordsAdded: improvedIssues.missingPowerWords === false && issues.missingPowerWords === true
          }
        };
      }
    } catch (error) {
      console.error('Error improving content:', error);
      return { text: original, error: error.message };
    }
  }
  
  /**
   * Process file with enhanced analysis
   */
  async processFile(fileName) {
    const filePath = path.join(this.dataPath, fileName);
    const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const improvements = [];
    
    console.log(chalk.cyan(`\n📄 Processing ${fileName}`));
    
    const processContent = async (obj, pathPrefix = '') => {
      for (const [key, value] of Object.entries(obj)) {
        const fullPath = pathPrefix ? `${pathPrefix}.${key}` : key;
        
        if (typeof value === 'string' && value.length > 20) {
          // Skip technical fields
          if (key.includes('url') || key.includes('id') || key.includes('icon')) continue;
          
          // Analyze for issues
          const issues = this.analyzeContentIssues(value);
          
          if (issues.needsImprovement) {
            console.log(chalk.yellow(`  Found issues in ${fullPath}:`));
            if (issues.jargon.length > 0) {
              console.log(chalk.gray(`    - Jargon: ${issues.jargon.join(', ')}`));
            }
            if (issues.voiceScore) {
              console.log(chalk.gray(`    - Voice score: ${(issues.voiceScore * 100).toFixed(0)}%`));
            }
            
            // Improve with context
            const improved = await this.improveWithContext(value, issues);
            
            console.log(chalk.green(`    ✓ Improved (${improved.originalScore ? (improved.originalScore * 100).toFixed(0) : '?'}% → ${improved.improvedScore ? (improved.improvedScore * 100).toFixed(0) : '?'}%)`));
            
            improvements.push({
              file: fileName,
              path: fullPath,
              original: value,
              improved: improved.text,
              issues: issues,
              issuesFixed: improved.issuesFixed,
              scoreImprovement: improved.improvedScore - improved.originalScore,
              wordCount: {
                original: value.split(' ').length,
                improved: improved.text.split(' ').length,
                difference: improved.text.split(' ').length - value.split(' ').length
              }
            });
          }
        } else if (typeof value === 'object' && value !== null) {
          await processContent(value, fullPath);
        }
      }
    };
    
    await processContent(content);
    
    return improvements;
  }
}

// CLI Usage
if (process.argv[1]?.endsWith('unified_content_system_enhanced.js')) {
  const system = new EnhancedUnifiedContentSystem();
  
  (async () => {
    try {
      // Test with hero.json
      const improvements = await system.processFile('hero.json');
      
      console.log(chalk.cyan('\n📊 IMPROVEMENT SUMMARY\n'));
      
      improvements.forEach(imp => {
        console.log(chalk.white(`\n${imp.path}:`));
        console.log(chalk.gray('  Original: ') + `"${imp.original}"`);
        console.log(chalk.green('  Improved: ') + `"${imp.improved}"`);
        
        // Show what was fixed
        if (imp.issuesFixed.jargon.length > 0) {
          console.log(chalk.green(`  ✓ Removed jargon: ${imp.issuesFixed.jargon.join(', ')}`));
        }
        if (imp.issuesFixed.newJargonIntroduced?.length > 0) {
          console.log(chalk.red(`  ✗ NEW jargon introduced: ${imp.issuesFixed.newJargonIntroduced.join(', ')}`));
        }
        
        // Show score change
        const scoreBefore = Math.round((imp.originalScore || 0) * 100);
        const scoreAfter = Math.round((imp.improvedScore || 0) * 100);
        const scoreChange = scoreAfter - scoreBefore;
        
        if (scoreChange > 0) {
          console.log(chalk.green(`  ✓ Voice score: ${scoreBefore}% → ${scoreAfter}% (+${scoreChange}%)`));
        } else if (scoreChange < 0) {
          console.log(chalk.red(`  ✗ Voice score: ${scoreBefore}% → ${scoreAfter}% (${scoreChange}%)`));
        } else {
          console.log(chalk.yellow(`  = Voice score: ${scoreBefore}% (no change)`));
        }
        
        // Word count check
        if (Math.abs(imp.wordCount.difference) > 2) {
          console.log(chalk.red(`  ✗ Word count off by ${imp.wordCount.difference} (layout may break)`));
        }
      });
      
    } catch (error) {
      console.error(chalk.red('Error:'), error.message);
    }
  })();
}

export default EnhancedUnifiedContentSystem;