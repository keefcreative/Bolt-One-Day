#!/usr/bin/env node

/**
 * Assistant Section Processor
 * Sends ENTIRE JSON files to the OpenAI Assistant for processing
 * Handles one complete section at a time
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import chalk from 'chalk';
import dotenv from 'dotenv';
import StatusTracker from './status_tracker.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

class AssistantSectionProcessor {
  constructor() {
    this.apiKey = process.env.OPENAI_API_KEY;
    this.assistantId = process.env.OPENAI_BRANDVOICE_ASSISTANT_ID || 'asst_0GsBgIUHApbshi9n1SSBISKg';
    this.dataPath = '../../../data';
    this.baseURL = 'https://api.openai.com/v1';
    this.tracker = new StatusTracker();
    
    if (!this.apiKey) {
      throw new Error('OPENAI_API_KEY not found in .env.local');
    }
    
    console.log(chalk.cyan('🤖 Using OpenAI BRANDVOICE Assistant for Full Section Processing'));
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
   * Run assistant on thread
   */
  async runAssistant(threadId) {
    const response = await fetch(`${this.baseURL}/threads/${threadId}/runs`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        'OpenAI-Beta': 'assistants=v2'
      },
      body: JSON.stringify({
        assistant_id: this.assistantId,
        additional_instructions: `CRITICAL REQUIREMENTS:
- Process the ENTIRE JSON file
- Maintain EXACT JSON structure
- Preserve word counts (±2 words max per field)
- Track changes for each field
- Return complete improved JSON with tracking`
      })
    });

    const data = await response.json();
    if (data.error) throw new Error(data.error.message);
    return data.id;
  }

  /**
   * Wait for run to complete
   */
  async waitForCompletion(threadId, runId, maxAttempts = 90) {
    console.log(chalk.gray('    Waiting for assistant response...'));
    
    for (let i = 0; i < maxAttempts; i++) {
      const response = await fetch(`${this.baseURL}/threads/${threadId}/runs/${runId}`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'OpenAI-Beta': 'assistants=v2'
        }
      });

      const run = await response.json();
      
      if (run.status === 'completed') {
        console.log(chalk.green('    ✓ Assistant completed processing'));
        return run;
      } else if (run.status === 'failed' || run.status === 'cancelled' || run.status === 'expired') {
        throw new Error(`Run ${run.status}: ${run.last_error?.message || 'Unknown error'}`);
      }
      
      // Show progress
      if (i % 5 === 0) {
        process.stdout.write('.');
      }
      
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    throw new Error('Run timed out after 90 seconds');
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
   * Process an entire section (one or more JSON files)
   */
  async processSection(sectionName, files) {
    console.log(chalk.cyan(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`));
    console.log(chalk.cyan(`Processing Section: ${sectionName}`));
    console.log(chalk.cyan(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`));
    console.log(chalk.gray(`Files: ${files.join(', ')}\n`));
    
    const sectionImprovements = [];
    
    for (const fileName of files) {
      const filePath = path.join(this.dataPath, fileName);
      
      if (!fs.existsSync(filePath)) {
        console.log(chalk.yellow(`  ⚠️  File not found: ${fileName}`));
        continue;
      }
      
      console.log(chalk.white(`  📄 Processing ${fileName}...`));
      
      try {
        // Read the entire JSON file
        const originalContent = fs.readFileSync(filePath, 'utf8');
        const originalJSON = JSON.parse(originalContent);
        
        // Create message for assistant
        const message = `Process this entire ${sectionName} JSON file and improve all text content.

ORIGINAL JSON:
${JSON.stringify(originalJSON, null, 2)}

CRITICAL CONTEXT:
- For stats/metrics: The "number" field (e.g., "48h", "500+") is displayed alongside the "label" field
- DO NOT repeat the number in the label - they appear together
- Example: If number is "48h", don't make label "48-Hour Turnaround" - that's redundant
- Labels should ADD context to the number, not repeat it

REQUIREMENTS:
1. Improve ALL text fields in the JSON
2. Maintain exact JSON structure  
3. Keep word counts within ±2 words of original for each field
4. Remove jargon: transform, leverage, seamless, strategic, innovative, premium
5. Apply brand voice: Gary Vee directness + Rory Sutherland psychology
6. Use brand phrases where appropriate: "No drama", "Design that works", "Actually converts"
7. For stats: Consider the number+label as a PAIR that displays together

Return the COMPLETE improved JSON with this structure for EACH improved field:
{
  "originalField": {
    "original": "original text",
    "improved": "improved text", 
    "wordCount": {
      "original": X,
      "improved": X,
      "difference": 0
    },
    "changes": {
      "what": "Specific changes made",
      "why": "Business/psychology reason"
    }
  }
}

Process EVERY text field. Return complete JSON.`;

        // Send to assistant
        const threadId = await this.createThread();
        await this.sendMessage(threadId, message);
        const runId = await this.runAssistant(threadId);
        await this.waitForCompletion(threadId, runId);
        
        // Get response
        const messages = await this.getMessages(threadId);
        const assistantMessage = messages.find(m => m.role === 'assistant');
        
        if (assistantMessage && assistantMessage.content[0]?.text?.value) {
          const response = assistantMessage.content[0].text.value;
          
          // Parse the response
          let improvedData;
          try {
            improvedData = JSON.parse(response);
          } catch (e) {
            console.log(chalk.red(`    ✗ Failed to parse assistant response`));
            console.log(chalk.gray(`    Response: ${response.substring(0, 200)}...`));
            continue;
          }
          
          // Extract improvements for review
          const improvements = this.extractImprovements(fileName, originalJSON, improvedData);
          sectionImprovements.push(...improvements);
          
          console.log(chalk.green(`    ✓ Processed ${improvements.length} improvements`));
          
        } else {
          console.log(chalk.red(`    ✗ No response from assistant`));
        }
        
      } catch (error) {
        console.log(chalk.red(`    ✗ Error: ${error.message}`));
      }
      
      // Delay between files
      if (files.indexOf(fileName) < files.length - 1) {
        console.log(chalk.gray(`    Waiting before next file...`));
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
    
    // Generate review HTML for this section
    if (sectionImprovements.length > 0) {
      this.generateSectionReview(sectionName, sectionImprovements);
      
      // Mark section as improved in status tracker
      const sectionKey = sectionName.toLowerCase().replace(/\s+/g, '');
      const improvementFile = path.join(__dirname, '..', 'improvements', 'sections', `${sectionKey}_review.html`);
      this.tracker.markImproved(sectionKey, improvementFile);
      console.log(chalk.green(`\n✅ Section marked as improved in status tracker`));
    }
    
    return sectionImprovements;
  }
  
  /**
   * Extract improvements from assistant response
   */
  extractImprovements(fileName, original, improved, path = '') {
    const improvements = [];
    
    function traverse(origObj, impObj, currentPath) {
      for (const key in impObj) {
        const fullPath = currentPath ? `${currentPath}.${key}` : key;
        const value = impObj[key];
        
        // Check if this is an improvement object
        if (value && typeof value === 'object' && value.improved && value.original) {
          improvements.push({
            file: fileName,
            path: fullPath,
            original: value.original,
            improved: value.improved,
            wordCount: value.wordCount || {
              original: value.original.split(' ').length,
              improved: value.improved.split(' ').length,
              difference: value.improved.split(' ').length - value.original.split(' ').length
            },
            changes: value.changes,
            layoutSafe: Math.abs((value.wordCount?.difference || 0)) <= 2
          });
        } else if (typeof value === 'object' && value !== null) {
          // Recurse into nested objects
          traverse(origObj[key], value, fullPath);
        }
      }
    }
    
    traverse(original, improved, path);
    return improvements;
  }
  
  /**
   * Generate HTML review page for a section
   */
  generateSectionReview(sectionName, improvements) {
    const sectionSlug = sectionName.toLowerCase().replace(/\s+/g, '_');
    const outputPath = path.join(__dirname, 'improvements', 'sections', `${sectionSlug}_review.html`);
    
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>${sectionName} - Assistant Improvements</title>
    <style>
        /* Same styles as existing review pages */
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: -apple-system, BlinkMacSystemFont, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 40px 20px;
        }
        .container { max-width: 1200px; margin: 0 auto; }
        .header {
            background: white;
            padding: 40px;
            border-radius: 20px;
            margin-bottom: 30px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
        }
        h1 { 
            font-size: 32px;
            margin-bottom: 10px;
            background: linear-gradient(90deg, #667eea, #764ba2);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
        .improvement-card {
            background: white;
            border-radius: 16px;
            margin-bottom: 20px;
            overflow: hidden;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        }
        .card-header {
            padding: 20px;
            background: #f8f9fa;
            border-bottom: 2px solid #e9ecef;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .content-comparison {
            padding: 25px;
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
        }
        .content-box {
            padding: 20px;
            border-radius: 12px;
            border: 2px solid #e9ecef;
            position: relative;
        }
        .original {
            background: linear-gradient(135deg, #ffeaa7 0%, #fdcb6e 100%);
        }
        .improved {
            background: linear-gradient(135deg, #55efc4 0%, #00b894 100%);
        }
        .content-label {
            position: absolute;
            top: -12px;
            left: 20px;
            background: white;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 11px;
            font-weight: 700;
            text-transform: uppercase;
        }
        .layout-safe {
            background: #d4edda;
            color: #155724;
            padding: 6px 12px;
            border-radius: 20px;
            font-size: 12px;
        }
        .layout-warning {
            background: #fff3cd;
            color: #856404;
            padding: 6px 12px;
            border-radius: 20px;
            font-size: 12px;
        }
        .actions {
            padding: 20px;
            background: #f8f9fa;
            display: flex;
            gap: 10px;
            justify-content: center;
        }
        .btn {
            padding: 10px 20px;
            border: none;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
        }
        .btn-approve { background: #00b894; color: white; }
        .btn-keep { background: #fdcb6e; color: #2d3436; }
        .btn-edit { background: #a29bfe; color: white; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🤖 ${sectionName} - Assistant Improvements</h1>
            <p style="color: #666; margin-top: 10px;">
                Processed by OpenAI BRANDVOICE Assistant
            </p>
        </div>
        
        ${improvements.map((imp, index) => `
            <div class="improvement-card" data-index="${index}">
                <div class="card-header">
                    <div style="font-family: monospace; color: #6c757d;">
                        ${imp.file} → ${imp.path}
                    </div>
                    <div class="${imp.layoutSafe ? 'layout-safe' : 'layout-warning'}">
                        ${imp.layoutSafe ? '✓ Layout Safe' : '⚠️ Check Layout'}
                        (${imp.wordCount.difference >= 0 ? '+' : ''}${imp.wordCount.difference} words)
                    </div>
                </div>
                
                <div class="content-comparison">
                    <div class="content-box original">
                        <span class="content-label">Original</span>
                        <div>${imp.original}</div>
                        <div style="margin-top: 10px; font-size: 12px; color: #636e72;">
                            ${imp.wordCount.original} words
                        </div>
                    </div>
                    
                    <div class="content-box improved">
                        <span class="content-label">Improved</span>
                        <div id="improved-${index}">${imp.improved}</div>
                        <div style="margin-top: 10px; font-size: 12px; color: #636e72;">
                            ${imp.wordCount.improved} words
                        </div>
                    </div>
                </div>
                
                ${imp.changes ? `
                <div style="padding: 15px 25px; background: #f0f3ff; border-top: 1px solid #e9ecef;">
                    <strong>Changes:</strong> ${imp.changes.what}<br>
                    <strong>Why:</strong> ${imp.changes.why}
                </div>
                ` : ''}
                
                <div class="actions">
                    <button class="btn btn-approve" onclick="approve(${index})">
                        ✓ Use Improved
                    </button>
                    <button class="btn btn-keep" onclick="keep(${index})">
                        Keep Original
                    </button>
                    <button class="btn btn-edit" onclick="edit(${index})">
                        ✏️ Edit
                    </button>
                </div>
            </div>
        `).join('')}
    </div>
    
    <script>
        const improvements = ${JSON.stringify(improvements)};
        const decisions = new Map();
        
        function approve(index) {
            decisions.set(index, 'approve');
            document.querySelector(\`[data-index="\${index}"]\`).style.borderLeft = '4px solid #00b894';
        }
        
        function keep(index) {
            decisions.set(index, 'keep');
            document.querySelector(\`[data-index="\${index}"]\`).style.borderLeft = '4px solid #fdcb6e';
        }
        
        function edit(index) {
            const current = document.getElementById(\`improved-\${index}\`).textContent;
            const edited = prompt('Edit the improved version:', current);
            if (edited) {
                document.getElementById(\`improved-\${index}\`).textContent = edited;
                improvements[index].improved = edited;
                approve(index);
            }
        }
    </script>
</body>
</html>`;
    
    // Ensure directory exists
    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    fs.writeFileSync(outputPath, html);
    console.log(chalk.green(`\n✅ Review page created: ${outputPath}`));
    
    return outputPath;
  }
  
  /**
   * Process all sections
   */
  async processAllSections() {
    const sections = {
      'Hero Section': ['hero.json'],
      'Services': ['services.json', 'solutions.json'],
      'Pricing': ['pricing.json', 'brandedPricing.json'],
      'CTAs': ['premiumCta.json'],
      'Process': ['process.json'],
      'Testimonials': ['testimonials.json'],
      'About': ['philosophy.json'],
      'Contact': ['contact.json']
    };
    
    const allImprovements = [];
    
    for (const [sectionName, files] of Object.entries(sections)) {
      const improvements = await this.processSection(sectionName, files);
      allImprovements.push(...improvements);
      
      // Pause between sections
      console.log(chalk.gray('\nPausing before next section...\n'));
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
    
    return allImprovements;
  }
}

// CLI Usage
if (process.argv[1]?.endsWith('assistant_section_processor.js')) {
  const processor = new AssistantSectionProcessor();
  const sectionName = process.argv[2];
  
  (async () => {
    try {
      if (!sectionName || sectionName === '--help') {
        console.log(chalk.cyan(`
🤖 Assistant Section Processor

Usage:
  node assistant_section_processor.js [section]

Sections:
  hero        - Process hero.json
  services    - Process services.json and solutions.json
  pricing     - Process pricing.json and brandedPricing.json
  ctas        - Process CTAs
  all         - Process all sections

Example:
  node assistant_section_processor.js hero
  node assistant_section_processor.js all
        `));
        process.exit(0);
      }
      
      let improvements;
      
      if (sectionName === 'all') {
        improvements = await processor.processAllSections();
      } else if (sectionName === 'hero') {
        improvements = await processor.processSection('Hero Section', ['hero.json']);
      } else if (sectionName === 'services') {
        improvements = await processor.processSection('Services', ['services.json', 'solutions.json']);
      } else if (sectionName === 'pricing') {
        improvements = await processor.processSection('Pricing', ['pricing.json', 'brandedPricing.json']);
      } else if (sectionName === 'ctas') {
        improvements = await processor.processSection('CTAs', ['premiumCta.json']);
      } else {
        // Try to process as a single file for workflow manager
        const fileName = `${sectionName}.json`;
        const filePath = path.join(__dirname, '..', '..', '..', 'data', fileName);
        if (fs.existsSync(filePath)) {
          improvements = await processor.processSection(sectionName, [fileName]);
        } else {
          console.log(chalk.red(`Unknown section: ${sectionName}`));
          process.exit(1);
        }
      }
      
      console.log(chalk.cyan(`\n✨ Processing complete!`));
      console.log(chalk.white(`Total improvements: ${improvements.length}`));
      
    } catch (error) {
      console.error(chalk.red('Error:'), error.message);
      process.exit(1);
    }
  })();
}

export default AssistantSectionProcessor;