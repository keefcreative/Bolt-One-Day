#!/usr/bin/env node

/**
 * Unified Assistant System
 * Uses the OpenAI BRANDVOICE Assistant WITH analysis context
 * Combines the best of both worlds
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import chalk from 'chalk';
import dotenv from 'dotenv';
import BrandVoiceValidator from './brand_voice_validator.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

class UnifiedAssistantSystem {
  constructor() {
    this.apiKey = process.env.OPENAI_API_KEY;
    this.assistantId = process.env.OPENAI_BRANDVOICE_ASSISTANT_ID || 'asst_0GsBgIUHApbshi9n1SSBISKg';
    this.dataPath = '../data';
    this.voiceValidator = new BrandVoiceValidator();
    this.baseURL = 'https://api.openai.com/v1';
    
    if (!this.apiKey) {
      throw new Error('OPENAI_API_KEY not found in .env.local');
    }
    
    console.log(chalk.cyan('🤖 Using OpenAI BRANDVOICE Assistant'));
    console.log(chalk.gray(`   Assistant ID: ${this.assistantId}\n`));
  }
  
  /**
   * Create a thread for conversation
   */
  async createThread() {
    const response = await fetch(`${this.baseURL}/threads`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        'OpenAI-Beta': 'assistants=v2'
      }
    });

    const data = await response.json();
    if (data.error) throw new Error(data.error.message);
    return data.id;
  }

  /**
   * Send message to assistant
   */
  async sendMessage(threadId, content) {
    const response = await fetch(`${this.baseURL}/threads/${threadId}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        'OpenAI-Beta': 'assistants=v2'
      },
      body: JSON.stringify({
        role: 'user',
        content
      })
    });

    const data = await response.json();
    if (data.error) throw new Error(data.error.message);
    return data.id;
  }

  /**
   * Run assistant on thread WITH additional context
   */
  async runAssistant(threadId, additionalInstructions = null) {
    const body = {
      assistant_id: this.assistantId
    };
    
    // Add specific instructions about what to fix
    if (additionalInstructions) {
      body.additional_instructions = additionalInstructions;
    }

    const response = await fetch(`${this.baseURL}/threads/${threadId}/runs`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        'OpenAI-Beta': 'assistants=v2'
      },
      body: JSON.stringify(body)
    });

    const data = await response.json();
    if (data.error) throw new Error(data.error.message);
    return data.id;
  }

  /**
   * Wait for run to complete
   */
  async waitForCompletion(threadId, runId, maxAttempts = 60) {  // Increased to 60 seconds
    for (let i = 0; i < maxAttempts; i++) {
      const response = await fetch(`${this.baseURL}/threads/${threadId}/runs/${runId}`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'OpenAI-Beta': 'assistants=v2'
        }
      });

      const run = await response.json();
      
      if (run.status === 'completed') {
        return run;
      } else if (run.status === 'failed' || run.status === 'cancelled' || run.status === 'expired') {
        throw new Error(`Run ${run.status}: ${run.last_error?.message || 'Unknown error'}`);
      }
      
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    throw new Error('Run timed out after 30 seconds');
  }

  /**
   * Get messages from thread
   */
  async getMessages(threadId) {
    const response = await fetch(`${this.baseURL}/threads/${threadId}/messages`, {
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'OpenAI-Beta': 'assistants=v2'
      }
    });

    const data = await response.json();
    if (data.error) throw new Error(data.error.message);
    return data.data;
  }
  
  /**
   * Analyze content for issues (same as enhanced version)
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
    
    // Check for jargon
    const jargonList = ['leverage', 'synergy', 'innovative', 'world-class', 'seamless', 
                        'transform', 'elevate', 'cutting-edge', 'robust', 'strategic',
                        'premium', 'solutions', 'utilize', 'optimize', 'revolutionize'];
    
    for (const word of jargonList) {
      if (text.toLowerCase().includes(word)) {
        issues.jargon.push(word);
      }
    }
    
    // Check for generic CTAs
    if (text === 'Get Started' || text === 'Learn More' || text === 'Contact Us') {
      issues.generic = true;
      issues.suggestions.push('Make CTA more specific and action-oriented');
    }
    
    // Check length
    const wordCount = text.split(' ').length;
    if (wordCount > 30) {
      issues.tooLong = true;
      issues.suggestions.push(`Shorten from ${wordCount} to under 30 words`);
    }
    
    // Run brand voice analysis
    const voiceAnalysis = this.voiceValidator.validateContent(text, 'general');
    if (voiceAnalysis) {
      issues.voiceScore = voiceAnalysis.scores.overall;
      
      // Identify weak pillars
      if (voiceAnalysis.scores.pillars) {
        Object.entries(voiceAnalysis.scores.pillars).forEach(([pillar, score]) => {
          if (score < 0.7) {
            issues.weakPillars.push({ pillar, score });
          }
        });
      }
      
      // Check for power words
      if (voiceAnalysis.scores.powerWords && voiceAnalysis.scores.powerWords < 0.5) {
        issues.missingPowerWords = true;
      }
    }
    
    // Check for passive voice
    const passiveIndicators = ['is being', 'was being', 'has been', 'have been', 'will be', 'are being'];
    if (passiveIndicators.some(indicator => text.toLowerCase().includes(indicator))) {
      issues.passiveVoice = true;
    }
    
    issues.needsImprovement = issues.jargon.length > 0 || 
                              issues.generic || 
                              issues.tooLong ||
                              (issues.voiceScore && issues.voiceScore < 0.8) ||
                              issues.passiveVoice;
    
    return issues;
  }
  
  /**
   * Improve using Assistant WITH analysis context
   */
  async improveWithAssistant(original, issues) {
    const wordCount = original.split(' ').length;
    
    // Build context-aware message for assistant
    let message = `Improve this copy to exactly ${wordCount} words (±2 max):

"${original}"

SPECIFIC ISSUES TO FIX:`;
    
    if (issues.jargon.length > 0) {
      message += `\n- Remove these jargon words: ${issues.jargon.join(', ')}`;
    }
    
    if (issues.generic) {
      message += `\n- Generic CTA - make it specific and compelling`;
    }
    
    if (issues.passiveVoice) {
      message += `\n- Convert passive voice to active`;
    }
    
    if (issues.weakPillars.length > 0) {
      issues.weakPillars.forEach(({ pillar }) => {
        const advice = {
          honest: 'Be more direct, cut the fluff',
          principled: 'Show genuine value',
          human: 'Use conversational language',
          balanced: 'Mix confidence with approachability'
        };
        message += `\n- Weak on "${pillar}" - ${advice[pillar]}`;
      });
    }
    
    if (issues.voiceScore) {
      message += `\n- Current brand voice score: ${(issues.voiceScore * 100).toFixed(0)}% - aim for 85%+`;
    }
    
    message += `\n\nReturn ONLY the improved text itself - no JSON, no formatting, no quotes. Just the improved copy. Exactly ${wordCount} words.`;
    
    // Build additional instructions for this specific improvement
    const additionalInstructions = `For this specific improvement:
- MUST maintain ${wordCount} words (±2 maximum) for layout integrity
- Focus on fixing the identified issues, don't change what's working
- Each improvement must be unique - no duplicate outputs
- Never introduce new jargon: elevate, transform, leverage, solutions, premium`;
    
    try {
      // Create thread and send message
      const threadId = await this.createThread();
      await this.sendMessage(threadId, message);
      
      // Run with additional context
      const runId = await this.runAssistant(threadId, additionalInstructions);
      await this.waitForCompletion(threadId, runId);
      
      // Get response
      const messages = await this.getMessages(threadId);
      const assistantMessage = messages.find(m => m.role === 'assistant');
      
      if (assistantMessage && assistantMessage.content[0]?.text?.value) {
        let improved = assistantMessage.content[0].text.value.trim();
        
        // Handle if assistant returns JSON despite instructions
        if (improved.includes('{') || improved.includes('"improved"')) {
          try {
            // Try multiple JSON extraction methods
            let extracted = null;
            
            // Method 1: Full JSON parse
            if (improved.includes('{')) {
              const jsonMatch = improved.match(/\{[\s\S]*\}/);
              if (jsonMatch) {
                try {
                  const parsed = JSON.parse(jsonMatch[0]);
                  // Navigate various possible structures
                  extracted = parsed.improved || 
                             parsed.fieldName?.improved || 
                             parsed.text ||
                             parsed.result ||
                             parsed.output;
                } catch (e) {
                  // JSON parse failed, try regex
                }
              }
            }
            
            // Method 2: Regex extraction if JSON parse failed
            if (!extracted) {
              const patterns = [
                /"improved"\s*:\s*"([^"]+)"/,
                /'improved'\s*:\s*'([^']+)'/,
                /improved:\s*"([^"]+)"/,
                /improved:\s*'([^']+)'/
              ];
              
              for (const pattern of patterns) {
                const match = improved.match(pattern);
                if (match) {
                  extracted = match[1];
                  break;
                }
              }
            }
            
            if (extracted) {
              improved = extracted;
              console.log(chalk.yellow('      (Extracted from JSON response)'));
            }
          } catch (e) {
            console.log(chalk.red('      Warning: Could not parse assistant response'));
          }
        }
        
        // Clean up quotes
        improved = improved.replace(/^["']|["']$/g, '');
        
        // Re-analyze the improved version
        const improvedIssues = this.analyzeContentIssues(improved);
        
        // Check if AI introduced NEW jargon
        const newJargon = improvedIssues.jargon.filter(j => !issues.jargon.includes(j));
        if (newJargon.length > 0) {
          console.log(chalk.red(`      ⚠️  Assistant introduced new jargon: ${newJargon.join(', ')}`));
        }
        
        return {
          text: improved,
          originalScore: issues.voiceScore || 0,
          improvedScore: improvedIssues.voiceScore || 0,
          issuesFixed: {
            jargon: issues.jargon.filter(j => !improved.toLowerCase().includes(j)),
            newJargonIntroduced: newJargon,
            voiceImproved: (improvedIssues.voiceScore || 0) > (issues.voiceScore || 0)
          }
        };
      }
      
      throw new Error('No response from assistant');
      
    } catch (error) {
      console.error('Error with assistant:', error.message);
      return { text: original, error: error.message };
    }
  }
  
  /**
   * Process file with assistant
   */
  async processFile(fileName) {
    const filePath = path.join(this.dataPath, fileName);
    const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const improvements = [];
    
    console.log(chalk.cyan(`\n📄 Processing ${fileName} with BRANDVOICE Assistant`));
    
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
            
            // Improve with assistant
            console.log(chalk.gray(`    - Sending to assistant...`));
            const improved = await this.improveWithAssistant(value, issues);
            
            if (!improved.error) {
              const scoreBefore = Math.round((improved.originalScore || 0) * 100);
              const scoreAfter = Math.round((improved.improvedScore || 0) * 100);
              console.log(chalk.green(`    ✓ Improved (${scoreBefore}% → ${scoreAfter}%)`));
              
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
            } else {
              console.log(chalk.red(`    ✗ Error: ${improved.error}`));
            }
            
            // Small delay to avoid rate limits
            await new Promise(resolve => setTimeout(resolve, 500));
          }
        } else if (typeof value === 'object' && value !== null) {
          await processContent(value, fullPath);
        }
      }
    };
    
    await processContent(content);
    
    return improvements;
  }
  
  /**
   * Process multiple files in batches
   */
  async processMultipleFiles(filePattern = null) {
    // Get all JSON files in data directory
    const allFiles = fs.readdirSync(this.dataPath)
      .filter(f => f.endsWith('.json'))
      .filter(f => !f.includes('design-for-good')); // Skip design-for-good files for now
    
    // Group files by priority
    const fileGroups = {
      'High Priority': ['hero.json', 'services.json', 'pricing.json'],
      'Medium Priority': ['ctas.json', 'process.json', 'testimonials.json'],
      'Low Priority': allFiles.filter(f => 
        !['hero.json', 'services.json', 'pricing.json', 'ctas.json', 'process.json', 'testimonials.json'].includes(f)
      )
    };
    
    const allImprovements = [];
    let totalProcessed = 0;
    const totalFiles = allFiles.length;
    
    console.log(chalk.cyan(`\n📚 Found ${totalFiles} files to process\n`));
    
    // Process each priority group
    for (const [priority, files] of Object.entries(fileGroups)) {
      if (files.length === 0) continue;
      
      console.log(chalk.yellow(`\n━━━ ${priority} (${files.length} files) ━━━\n`));
      
      for (const file of files) {
        if (!fs.existsSync(path.join(this.dataPath, file))) continue;
        
        totalProcessed++;
        console.log(chalk.cyan(`\n[${totalProcessed}/${totalFiles}] Processing ${file}...`));
        
        try {
          const improvements = await this.processFile(file);
          allImprovements.push(...improvements);
          
          if (improvements.length > 0) {
            console.log(chalk.green(`  ✓ Found ${improvements.length} improvements`));
          } else {
            console.log(chalk.gray(`  - No improvements needed`));
          }
          
          // Add delay between files to avoid rate limits
          if (totalProcessed < totalFiles) {
            console.log(chalk.gray(`  Waiting 2 seconds before next file...`));
            await new Promise(resolve => setTimeout(resolve, 2000));
          }
          
        } catch (error) {
          console.log(chalk.red(`  ✗ Error: ${error.message}`));
        }
      }
    }
    
    return allImprovements;
  }
  
  /**
   * Save improvements to file for review
   */
  saveImprovements(improvements) {
    const timestamp = new Date().toISOString().split('T')[0];
    const outputPath = path.join(__dirname, 'improvements', `assistant_improvements_${timestamp}.json`);
    
    // Group by file
    const byFile = {};
    improvements.forEach(imp => {
      if (!byFile[imp.file]) byFile[imp.file] = [];
      byFile[imp.file].push(imp);
    });
    
    const output = {
      timestamp: new Date().toISOString(),
      totalImprovements: improvements.length,
      files: Object.keys(byFile).length,
      improvements: byFile,
      summary: {
        jargonRemoved: improvements.filter(i => i.issuesFixed.jargon.length > 0).length,
        voiceImproved: improvements.filter(i => i.issuesFixed.voiceImproved).length,
        layoutSafe: improvements.filter(i => Math.abs(i.wordCount.difference) <= 2).length
      }
    };
    
    fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));
    console.log(chalk.green(`\n💾 Saved improvements to: ${outputPath}`));
    
    return outputPath;
  }
}

// CLI Usage
if (process.argv[1]?.endsWith('unified_assistant_system.js')) {
  const command = process.argv[2];
  
  // Show help if needed
  if (command === '--help' || command === '-h') {
    console.log(chalk.cyan(`
🤖 Unified Assistant System - Uses OpenAI BRANDVOICE Assistant

Usage:
  node unified_assistant_system.js [options] [file]

Options:
  --test, -t          Test with hero.json only
  --all, -a           Process ALL files (in priority order)
  --help, -h          Show this help

Examples:
  node unified_assistant_system.js              # Process hero.json (default)
  node unified_assistant_system.js pricing.json # Process specific file
  node unified_assistant_system.js --test       # Quick test
  node unified_assistant_system.js --all        # Process everything

Processing Order:
  High Priority: hero, services, pricing
  Medium Priority: CTAs, process, testimonials  
  Low Priority: Everything else

Notes:
  - 2 second delay between files to avoid rate limits
  - 60 second timeout per improvement
  - Saves results to improvements/assistant_improvements_[date].json
    `));
    process.exit(0);
  }
  
  const system = new UnifiedAssistantSystem();
  
  (async () => {
    try {
      let improvements;
      
      if (command === '--all' || command === '-a') {
        // Process all files
        improvements = await system.processMultipleFiles();
      } else if (command === '--test' || command === '-t') {
        // Test with just hero.json
        improvements = await system.processFile('hero.json');
      } else {
        // Process specific file or default to hero.json
        const fileName = command || 'hero.json';
        improvements = await system.processFile(fileName);
      }
      
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
      
      // Save improvements if we have any
      if (improvements.length > 0) {
        system.saveImprovements(improvements);
      }
      
      console.log(chalk.cyan('\n✨ Assistant improvements complete!\n'));
      
    } catch (error) {
      console.error(chalk.red('Error:'), error.message);
    }
  })();
}

export default UnifiedAssistantSystem;