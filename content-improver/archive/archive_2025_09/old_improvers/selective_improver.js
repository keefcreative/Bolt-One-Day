#!/usr/bin/env node

/**
 * Selective Content Improver
 * - Choose which files to process
 * - Review each change individually
 * - Keep or modify as needed
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import chalk from 'chalk';
import dotenv from 'dotenv';
import readline from 'readline';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

class SelectiveImprover {
  constructor() {
    this.apiKey = process.env.OPENAI_API_KEY;
    this.assistantId = process.env.OPENAI_BRANDVOICE_ASSISTANT_ID;
    this.dataPath = '../data';
    this.improvements = [];
    this.selectedFiles = [];
    
    if (!this.apiKey) {
      throw new Error('OPENAI_API_KEY not found in .env.local');
    }
  }
  
  /**
   * Get list of content files with issues
   */
  async getContentFiles() {
    const files = fs.readdirSync(this.dataPath)
      .filter(f => f.endsWith('.json'))
      .filter(f => !f.includes('OLD-BACKUP'))
      .filter(f => !f.includes('automation'))
      .filter(f => !f.includes('policy'))
      .filter(f => !f.includes('terms'));
    
    // Prioritize files with actual content issues
    const priorityFiles = [
      'hero.json',
      'services.json', 
      'pricing.json',
      'process.json',
      'solutions.json',
      'finalCta.json',
      'problems.json',
      'comparison.json'
    ];
    
    // Sort by priority
    return files.sort((a, b) => {
      const aPriority = priorityFiles.indexOf(a);
      const bPriority = priorityFiles.indexOf(b);
      if (aPriority !== -1 && bPriority !== -1) return aPriority - bPriority;
      if (aPriority !== -1) return -1;
      if (bPriority !== -1) return 1;
      return a.localeCompare(b);
    });
  }
  
  /**
   * Extract problematic content from file
   */
  extractProblematicContent(filePath) {
    const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const problems = [];
    
    // Corporate jargon to detect
    const jargon = [
      'leverage', 'synergy', 'innovative', 'cutting-edge', 'world-class',
      'seamless', 'transform', 'elevate', 'empower', 'optimize',
      'revolutionary', 'disruptive', 'paradigm', 'holistic', 'robust'
    ];
    
    function checkText(obj, path = '') {
      for (const [key, value] of Object.entries(obj)) {
        const fullPath = path ? `${path}.${key}` : key;
        
        if (typeof value === 'string' && value.length > 20) {
          // Skip URLs and technical fields
          if (key.includes('url') || key.includes('icon') || key.includes('image')) continue;
          
          // Check for jargon
          const hasJargon = jargon.some(word => 
            value.toLowerCase().includes(word.toLowerCase())
          );
          
          // Check for generic phrases
          const isGeneric = [
            'Get Started',
            'Learn More',
            'Contact Us',
            'Click Here'
          ].includes(value);
          
          // Check if it's too long (over 30 words)
          const wordCount = value.split(' ').length;
          const isTooLong = wordCount > 30;
          
          if (hasJargon || isGeneric || isTooLong) {
            problems.push({
              path: fullPath,
              content: value,
              issues: {
                hasJargon,
                isGeneric,
                isTooLong,
                wordCount
              }
            });
          }
        } else if (Array.isArray(value)) {
          value.forEach((item, index) => {
            if (typeof item === 'object') {
              checkText(item, `${fullPath}[${index}]`);
            }
          });
        } else if (typeof value === 'object' && value !== null) {
          checkText(value, fullPath);
        }
      }
    }
    
    checkText(content);
    return problems;
  }
  
  /**
   * Improve single piece of content
   */
  async improveContent(original, issues) {
    const prompt = `Fix this copy to match our brand voice:

CURRENT COPY: "${original}"

PROBLEMS:
${issues.hasJargon ? '- Contains corporate jargon' : ''}
${issues.isGeneric ? '- Too generic' : ''}
${issues.isTooLong ? `- Too long (${issues.wordCount} words)` : ''}

BRAND VOICE RULES:
- Write like Gary Vee: Direct, no BS, conversational
- Think like Rory Sutherland: Interesting angles, psychological insight
- Never use corporate jargon
- Keep it under 20 words when possible
- Be specific, not generic

GOOD EXAMPLES:
- "Design that works. No drama."
- "We make stuff people actually want"
- "Your design team, minus the meetings"

IMPROVED VERSION (just the text, no quotes):`;

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
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 100
        })
      });
      
      const data = await response.json();
      if (data.choices && data.choices[0]) {
        return data.choices[0].message.content.trim().replace(/^["']|["']$/g, '');
      }
    } catch (error) {
      console.log(chalk.red(`  Error: ${error.message}`));
    }
    
    return original;
  }
  
  /**
   * Interactive file selection
   */
  async selectFiles() {
    const files = await this.getContentFiles();
    
    console.log(chalk.cyan('\n📁 SELECT FILES TO IMPROVE\n'));
    console.log(chalk.gray('Priority files are listed first\n'));
    
    // Show files with preview
    for (let i = 0; i < Math.min(files.length, 10); i++) {
      const file = files[i];
      const filePath = path.join(this.dataPath, file);
      const problems = this.extractProblematicContent(filePath);
      
      const icon = problems.length > 0 ? '⚠️ ' : '✓ ';
      const color = problems.length > 0 ? chalk.yellow : chalk.green;
      
      console.log(color(`${i + 1}. ${icon}${file} (${problems.length} issues)`));
      
      if (problems.length > 0 && problems[0]) {
        console.log(chalk.gray(`   Sample: "${problems[0].content.substring(0, 50)}..."`));
      }
    }
    
    console.log(chalk.cyan('\nEnter file numbers to process (e.g., "1,3,5" or "all" for all with issues):'));
    
    // For now, auto-select top 3 with issues
    const filesWithIssues = [];
    for (let i = 0; i < Math.min(files.length, 10); i++) {
      const filePath = path.join(this.dataPath, files[i]);
      const problems = this.extractProblematicContent(filePath);
      if (problems.length > 0) {
        filesWithIssues.push(files[i]);
      }
    }
    
    return filesWithIssues.slice(0, 3);
  }
  
  /**
   * Process selected files
   */
  async processFiles(selectedFiles) {
    console.log(chalk.cyan(`\n🔄 PROCESSING ${selectedFiles.length} FILES\n`));
    
    const allImprovements = [];
    
    for (const file of selectedFiles) {
      console.log(chalk.yellow(`\n📄 Processing: ${file}`));
      
      const filePath = path.join(this.dataPath, file);
      const problems = this.extractProblematicContent(filePath);
      
      if (problems.length === 0) {
        console.log(chalk.green('  ✓ No issues found'));
        continue;
      }
      
      console.log(chalk.gray(`  Found ${problems.length} issues\n`));
      
      const fileImprovements = [];
      
      // Process each problem
      for (let i = 0; i < Math.min(problems.length, 3); i++) {
        const problem = problems[i];
        
        console.log(chalk.gray(`  [${i + 1}/${Math.min(problems.length, 3)}] ${problem.path}`));
        
        // Show original
        console.log(chalk.yellow('  Original:'));
        console.log(`    "${problem.content.substring(0, 100)}${problem.content.length > 100 ? '...' : ''}"`);
        
        // Generate improvement
        const improved = await this.improveContent(problem.content, problem.issues);
        
        // Show improved
        console.log(chalk.green('  Improved:'));
        console.log(`    "${improved}"`);
        
        fileImprovements.push({
          file,
          path: problem.path,
          original: problem.content,
          improved,
          issues: problem.issues,
          keep: false // Default to not keeping, user decides
        });
        
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      
      allImprovements.push(...fileImprovements);
    }
    
    return allImprovements;
  }
  
  /**
   * Generate interactive review HTML
   */
  generateReviewHTML(improvements) {
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Selective Content Review</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: #f5f5f5;
            padding: 20px;
        }
        
        .container { 
            max-width: 1200px; 
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
        
        .stats {
            display: flex;
            gap: 30px;
            margin: 20px 0;
            padding: 20px;
            background: #f8f9fa;
            border-radius: 8px;
        }
        
        .stat {
            flex: 1;
            text-align: center;
        }
        
        .stat-value {
            font-size: 32px;
            font-weight: bold;
            color: #F97316;
        }
        
        .stat-label {
            font-size: 12px;
            color: #666;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-top: 5px;
        }
        
        .improvement-card {
            background: white;
            border-radius: 12px;
            padding: 25px;
            margin-bottom: 20px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            transition: all 0.3s;
        }
        
        .improvement-card.approved {
            border-left: 4px solid #28a745;
        }
        
        .improvement-card.kept {
            border-left: 4px solid #ffc107;
            opacity: 0.7;
        }
        
        .file-path {
            font-size: 12px;
            color: #666;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 15px;
        }
        
        .issues {
            display: flex;
            gap: 10px;
            margin-bottom: 15px;
        }
        
        .issue-badge {
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 11px;
            font-weight: 600;
            text-transform: uppercase;
        }
        
        .issue-jargon { background: #ffe4e1; color: #d32f2f; }
        .issue-generic { background: #fff3cd; color: #f57c00; }
        .issue-long { background: #e3f2fd; color: #1976d2; }
        
        .content-comparison {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-bottom: 20px;
        }
        
        .content-box {
            padding: 20px;
            border-radius: 8px;
            border: 2px solid #e0e0e0;
            position: relative;
        }
        
        .content-box.original {
            background: #fff9e6;
            border-color: #ffc107;
        }
        
        .content-box.improved {
            background: #e8f5e9;
            border-color: #4caf50;
        }
        
        .content-label {
            position: absolute;
            top: -10px;
            left: 15px;
            background: white;
            padding: 0 8px;
            font-size: 11px;
            font-weight: 700;
            text-transform: uppercase;
        }
        
        .content-text {
            font-size: 16px;
            line-height: 1.5;
            color: #333;
        }
        
        .actions {
            display: flex;
            gap: 10px;
        }
        
        .btn {
            padding: 10px 20px;
            border: none;
            border-radius: 6px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s;
        }
        
        .btn-use {
            background: #28a745;
            color: white;
        }
        
        .btn-use:hover {
            background: #218838;
            transform: translateY(-1px);
        }
        
        .btn-keep {
            background: #ffc107;
            color: #333;
        }
        
        .btn-keep:hover {
            background: #e0a800;
            transform: translateY(-1px);
        }
        
        .btn-edit {
            background: #6c757d;
            color: white;
        }
        
        .btn-edit:hover {
            background: #5a6268;
            transform: translateY(-1px);
        }
        
        .implementation-panel {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: white;
            padding: 20px;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.2);
            min-width: 300px;
        }
        
        .panel-title {
            font-size: 14px;
            font-weight: 600;
            margin-bottom: 15px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        .selection-summary {
            margin-bottom: 15px;
            padding: 10px;
            background: #f8f9fa;
            border-radius: 6px;
            font-size: 14px;
        }
        
        .implement-btn {
            width: 100%;
            padding: 12px;
            background: #F97316;
            color: white;
            border: none;
            border-radius: 6px;
            font-size: 16px;
            font-weight: bold;
            cursor: pointer;
        }
        
        .implement-btn:hover {
            background: #ea580c;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎯 Selective Content Improvements</h1>
            <p style="color: #666; margin-top: 10px;">
                Review each suggestion and choose what to keep or change.
                Your original copy might be better!
            </p>
            
            <div class="stats">
                <div class="stat">
                    <div class="stat-value" id="totalCount">${improvements.length}</div>
                    <div class="stat-label">Total Changes</div>
                </div>
                <div class="stat">
                    <div class="stat-value" id="useCount">0</div>
                    <div class="stat-label">Using Improved</div>
                </div>
                <div class="stat">
                    <div class="stat-value" id="keepCount">0</div>
                    <div class="stat-label">Keeping Original</div>
                </div>
            </div>
        </div>
        
        ${improvements.map((item, index) => `
            <div class="improvement-card" id="card-${index}" data-index="${index}">
                <div class="file-path">${item.file} → ${item.path}</div>
                
                <div class="issues">
                    ${item.issues.hasJargon ? '<span class="issue-badge issue-jargon">Has Jargon</span>' : ''}
                    ${item.issues.isGeneric ? '<span class="issue-badge issue-generic">Too Generic</span>' : ''}
                    ${item.issues.isTooLong ? `<span class="issue-badge issue-long">${item.issues.wordCount} words</span>` : ''}
                </div>
                
                <div class="content-comparison">
                    <div class="content-box original">
                        <span class="content-label">Original</span>
                        <div class="content-text">${item.original}</div>
                    </div>
                    
                    <div class="content-box improved">
                        <span class="content-label">AI Suggestion</span>
                        <div class="content-text" id="improved-${index}">${item.improved}</div>
                    </div>
                </div>
                
                <div class="actions">
                    <button class="btn btn-use" onclick="useImproved(${index})">
                        ✓ Use Improved Version
                    </button>
                    <button class="btn btn-keep" onclick="keepOriginal(${index})">
                        ↺ Keep Original
                    </button>
                    <button class="btn btn-edit" onclick="editImproved(${index})">
                        ✏️ Edit Suggestion
                    </button>
                </div>
            </div>
        `).join('')}
        
        <div class="implementation-panel">
            <div class="panel-title">Ready to Implement</div>
            <div class="selection-summary">
                <div id="summary">No selections made yet</div>
            </div>
            <button class="implement-btn" onclick="implementChanges()">
                🚀 Apply Selected Changes
            </button>
        </div>
    </div>
    
    <script>
        const improvements = ${JSON.stringify(improvements)};
        const selections = new Map();
        
        function updateCounts() {
            const useCount = Array.from(selections.values()).filter(v => v === 'use').length;
            const keepCount = Array.from(selections.values()).filter(v => v === 'keep').length;
            
            document.getElementById('useCount').textContent = useCount;
            document.getElementById('keepCount').textContent = keepCount;
            
            const summary = document.getElementById('summary');
            if (selections.size === 0) {
                summary.textContent = 'No selections made yet';
            } else {
                summary.innerHTML = \`
                    <strong>\${useCount}</strong> improvements to apply<br>
                    <strong>\${keepCount}</strong> originals to keep<br>
                    <strong>\${improvements.length - selections.size}</strong> undecided
                \`;
            }
        }
        
        function useImproved(index) {
            selections.set(index, 'use');
            const card = document.getElementById(\`card-\${index}\`);
            card.classList.remove('kept');
            card.classList.add('approved');
            updateCounts();
        }
        
        function keepOriginal(index) {
            selections.set(index, 'keep');
            const card = document.getElementById(\`card-\${index}\`);
            card.classList.remove('approved');
            card.classList.add('kept');
            updateCounts();
        }
        
        function editImproved(index) {
            const currentText = document.getElementById(\`improved-\${index}\`).textContent;
            const newText = prompt('Edit the improved version:', currentText);
            
            if (newText && newText !== currentText) {
                document.getElementById(\`improved-\${index}\`).textContent = newText;
                improvements[index].improved = newText;
                useImproved(index); // Auto-approve edited content
            }
        }
        
        function implementChanges() {
            const changes = [];
            
            selections.forEach((action, index) => {
                if (action === 'use') {
                    changes.push({
                        file: improvements[index].file,
                        path: improvements[index].path,
                        original: improvements[index].original,
                        improved: improvements[index].improved
                    });
                }
            });
            
            if (changes.length === 0) {
                alert('No improvements selected. Please select at least one improvement to apply.');
                return;
            }
            
            // Save to localStorage for now
            localStorage.setItem('selectedChanges', JSON.stringify(changes));
            
            alert(\`✅ \${changes.length} changes ready to implement!
            
Run this command to apply:
npm run implement:selected\`);
            
            console.log('Changes to implement:', changes);
        }
    </script>
</body>
</html>`;
    
    const outputPath = path.join('./improvements', 'selective_review.html');
    fs.writeFileSync(outputPath, html);
    
    console.log(chalk.green('\n✅ Review page created!'));
    console.log(chalk.cyan('Open: improvements/selective_review.html\n'));
    
    return outputPath;
  }
  
  /**
   * Main workflow
   */
  async run() {
    console.log(chalk.bold.cyan('\n🎯 SELECTIVE CONTENT IMPROVER\n'));
    console.log(chalk.gray('Only fix what actually needs fixing\n'));
    
    // Select files
    const selectedFiles = await this.selectFiles();
    
    if (selectedFiles.length === 0) {
      console.log(chalk.yellow('No files selected'));
      return;
    }
    
    // Process files
    const improvements = await this.processFiles(selectedFiles);
    
    // Save improvements
    const outputDir = './improvements';
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    const outputFile = path.join(outputDir, 'selective_improvements.json');
    fs.writeFileSync(outputFile, JSON.stringify(improvements, null, 2));
    
    // Generate review HTML
    const htmlPath = this.generateReviewHTML(improvements);
    
    console.log(chalk.yellow('To review and select changes:'));
    console.log(chalk.white('  npm run review:selective\n'));
    
    return improvements;
  }
}

// Run if called directly
if (process.argv[1]?.endsWith('selective_improver.js')) {
  const improver = new SelectiveImprover();
  improver.run().catch(console.error);
}

export default SelectiveImprover;