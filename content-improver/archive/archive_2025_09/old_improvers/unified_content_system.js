#!/usr/bin/env node

/**
 * Unified Content Improvement System
 * Combines all improvements: selective, length-aware, section-by-section processing
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import chalk from 'chalk';
import dotenv from 'dotenv';
import readline from 'readline';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

class UnifiedContentSystem {
  constructor() {
    this.apiKey = process.env.OPENAI_API_KEY;
    this.assistantId = process.env.OPENAI_BRANDVOICE_ASSISTANT_ID;
    this.dataPath = '../data';
    
    if (!this.apiKey) {
      throw new Error('OPENAI_API_KEY not found in .env.local');
    }
    
    // Track processing state
    this.sections = [];
    this.currentSection = null;
    this.improvements = [];
    this.sessionId = Date.now();
  }
  
  /**
   * Analyze website and organize by sections
   */
  async analyzeWebsite() {
    console.log(chalk.cyan('\n📊 ANALYZING WEBSITE STRUCTURE\n'));
    
    const files = fs.readdirSync(this.dataPath)
      .filter(f => f.endsWith('.json'))
      .filter(f => !f.includes('OLD-BACKUP'));
    
    // Group files by section/component
    const sections = {
      'Hero Section': ['hero.json'],
      'Services': ['services.json', 'solutions.json'],
      'Pricing': ['pricing.json', 'brandedPricing.json'],
      'About/Philosophy': ['weBelieve.json', 'founder.json', 'mission.json'],
      'Process': ['process.json', 'premiumDesignProcess.json'],
      'Testimonials': ['testimonials.json'],
      'CTAs': ['finalCta.json', 'premiumCta.json'],
      'Contact': ['contact.json'],
      'FAQ': ['faq.json', 'premiumFaq.json'],
      'Portfolio': files.filter(f => f.includes('2024-')),
      'Navigation': ['navigation.json', 'logoCarousel.json'],
      'Legal': ['privacy-policy.json', 'terms-of-service.json', 'cookie-policy.json']
    };
    
    // Analyze each section for issues
    const sectionAnalysis = {};
    
    for (const [sectionName, sectionFiles] of Object.entries(sections)) {
      const analysis = {
        files: sectionFiles.filter(f => fs.existsSync(path.join(this.dataPath, f))),
        issues: [],
        priority: 'low',
        contentCount: 0,
        estimatedTime: '1 min'
      };
      
      // Analyze issues in section
      for (const file of analysis.files) {
        const filePath = path.join(this.dataPath, file);
        if (fs.existsSync(filePath)) {
          const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
          const issues = this.analyzeContent(content);
          analysis.issues.push(...issues);
          analysis.contentCount += this.countContentPieces(content);
        }
      }
      
      // Set priority based on issues
      if (sectionName === 'Hero Section' || sectionName === 'Services') {
        analysis.priority = 'high';
      } else if (sectionName === 'CTAs' || sectionName === 'Pricing') {
        analysis.priority = 'medium';
      } else if (sectionName === 'Legal') {
        analysis.priority = 'skip'; // Don't touch legal
      }
      
      // Estimate processing time
      analysis.estimatedTime = analysis.contentCount <= 5 ? '1 min' : 
                              analysis.contentCount <= 10 ? '2-3 min' : '5+ min';
      
      if (analysis.files.length > 0 && analysis.priority !== 'skip') {
        sectionAnalysis[sectionName] = analysis;
      }
    }
    
    this.sections = sectionAnalysis;
    return sectionAnalysis;
  }
  
  /**
   * Analyze content for issues
   */
  analyzeContent(obj, issues = []) {
    const jargon = ['leverage', 'synergy', 'innovative', 'world-class', 'seamless', 
                    'transform', 'elevate', 'cutting-edge', 'robust', 'holistic'];
    
    function checkText(value) {
      if (typeof value === 'string' && value.length > 20) {
        for (const word of jargon) {
          if (value.toLowerCase().includes(word)) {
            issues.push(`Contains "${word}"`);
            break;
          }
        }
        if (value.split(' ').length > 30) {
          issues.push('Very long text');
        }
      }
    }
    
    function traverse(obj) {
      for (const value of Object.values(obj)) {
        if (typeof value === 'string') checkText(value);
        else if (Array.isArray(value)) value.forEach(item => {
          if (typeof item === 'object') traverse(item);
          else checkText(item);
        });
        else if (typeof value === 'object' && value !== null) traverse(value);
      }
    }
    
    traverse(obj);
    return issues;
  }
  
  /**
   * Count content pieces in object
   */
  countContentPieces(obj, count = 0) {
    for (const value of Object.values(obj)) {
      if (typeof value === 'string' && value.length > 20) count++;
      else if (Array.isArray(value)) value.forEach(item => {
        if (typeof item === 'object') count = this.countContentPieces(item, count);
      });
      else if (typeof value === 'object' && value !== null) {
        count = this.countContentPieces(value, count);
      }
    }
    return count;
  }
  
  /**
   * Process a single section
   */
  async processSection(sectionName) {
    const section = this.sections[sectionName];
    if (!section) return;
    
    console.log(chalk.cyan(`\n📝 PROCESSING: ${sectionName}\n`));
    console.log(chalk.gray(`Files: ${section.files.join(', ')}`));
    console.log(chalk.gray(`Content pieces: ${section.contentCount}`));
    console.log(chalk.gray(`Estimated time: ${section.estimatedTime}\n`));
    
    const sectionImprovements = [];
    
    for (const file of section.files) {
      const filePath = path.join(this.dataPath, file);
      const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      
      console.log(chalk.yellow(`\nProcessing ${file}...`));
      
      // Extract and improve content
      const improvements = await this.improveFileContent(file, content);
      sectionImprovements.push(...improvements);
      
      // Small delay to avoid rate limits
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    return sectionImprovements;
  }
  
  /**
   * Improve content from a file with length constraints
   */
  async improveFileContent(fileName, content, path = '') {
    const improvements = [];
    
    for (const [key, value] of Object.entries(content)) {
      const fullPath = path ? `${path}.${key}` : key;
      
      if (typeof value === 'string' && value.length > 20) {
        // Skip URLs, IDs, technical fields
        if (key.includes('url') || key.includes('id') || key.includes('icon') || key.includes('image')) continue;
        
        // Check if it needs improvement
        const needsImprovement = this.checkIfNeedsImprovement(value);
        
        if (needsImprovement) {
          console.log(chalk.gray(`  Improving: ${fullPath}`));
          
          const improved = await this.improveWithConstraints(value);
          
          improvements.push({
            file: fileName,
            path: fullPath,
            original: value,
            improved: improved.text,
            wordCount: {
              original: value.split(' ').length,
              improved: improved.text.split(' ').length,
              difference: improved.text.split(' ').length - value.split(' ').length
            },
            issues: needsImprovement,
            layoutSafe: Math.abs(improved.text.split(' ').length - value.split(' ').length) <= 2
          });
        }
      } else if (Array.isArray(value)) {
        for (let i = 0; i < value.length; i++) {
          if (typeof value[i] === 'object') {
            const subImprovements = await this.improveFileContent(fileName, value[i], `${fullPath}[${i}]`);
            improvements.push(...subImprovements);
          }
        }
      } else if (typeof value === 'object' && value !== null) {
        const subImprovements = await this.improveFileContent(fileName, value, fullPath);
        improvements.push(...subImprovements);
      }
    }
    
    return improvements;
  }
  
  /**
   * Check if content needs improvement
   */
  checkIfNeedsImprovement(text) {
    const issues = [];
    
    const jargon = ['leverage', 'synergy', 'innovative', 'world-class', 'seamless', 
                    'transform', 'elevate', 'cutting-edge', 'robust', 'strategic'];
    
    for (const word of jargon) {
      if (text.toLowerCase().includes(word)) {
        issues.push(`Contains "${word}"`);
      }
    }
    
    if (text === 'Get Started' || text === 'Learn More' || text === 'Contact Us') {
      issues.push('Generic CTA');
    }
    
    const wordCount = text.split(' ').length;
    if (wordCount > 30) {
      issues.push(`Too long (${wordCount} words)`);
    }
    
    return issues.length > 0 ? issues : null;
  }
  
  /**
   * Improve content with length constraints
   */
  async improveWithConstraints(original) {
    const wordCount = original.split(' ').length;
    const charCount = original.length;
    
    const prompt = `Improve this website copy while maintaining the EXACT same length for layout integrity.

ORIGINAL (${wordCount} words, ${charCount} chars):
"${original}"

CONSTRAINTS:
- MUST be ${wordCount} words (±2 maximum)
- Remove jargon: world-class, leverage, innovative, seamless, strategic
- Gary Vee style: Direct, no BS
- Rory Sutherland: Clever angles
- Keep professional but conversational

IMPROVED (MUST be ${wordCount} words):`;

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
              content: 'You are improving website copy. CRITICAL: Maintain exact word count to prevent layout breaks.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: Math.min(wordCount * 10, 150)
        })
      });
      
      const data = await response.json();
      if (data.choices && data.choices[0]) {
        const improved = data.choices[0].message.content.trim().replace(/^["']|["']$/g, '');
        const improvedWordCount = improved.split(' ').length;
        
        // Verify word count is within tolerance
        if (Math.abs(improvedWordCount - wordCount) > 2) {
          console.log(chalk.yellow(`    Word count off: ${improvedWordCount} vs ${wordCount}, keeping original`));
          return { text: original, kept: true };
        }
        
        return { text: improved, kept: false };
      }
    } catch (error) {
      console.log(chalk.red(`    Error: ${error.message}`));
    }
    
    return { text: original, kept: true };
  }
  
  /**
   * Generate section review HTML
   */
  generateSectionReview(sectionName, improvements) {
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${sectionName} - Content Review</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 40px 20px;
        }
        
        .container { 
            max-width: 1200px; 
            margin: 0 auto;
        }
        
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
        
        .section-info {
            display: flex;
            gap: 30px;
            margin-top: 20px;
            padding: 20px;
            background: #f8f9fa;
            border-radius: 12px;
        }
        
        .info-item {
            flex: 1;
            text-align: center;
        }
        
        .info-value {
            font-size: 28px;
            font-weight: bold;
            color: #F97316;
        }
        
        .info-label {
            font-size: 12px;
            color: #666;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-top: 5px;
        }
        
        .improvement-card {
            background: white;
            border-radius: 16px;
            margin-bottom: 20px;
            overflow: hidden;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
            transition: all 0.3s;
        }
        
        .improvement-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 15px 40px rgba(0,0,0,0.15);
        }
        
        .card-header {
            padding: 20px;
            background: #f8f9fa;
            border-bottom: 2px solid #e9ecef;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .file-path {
            font-size: 14px;
            color: #6c757d;
            font-family: monospace;
        }
        
        .layout-status {
            padding: 6px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
        }
        
        .layout-safe {
            background: #d4edda;
            color: #155724;
        }
        
        .layout-warning {
            background: #fff3cd;
            color: #856404;
        }
        
        .issues-list {
            padding: 15px 20px;
            background: #fff5f5;
            border-left: 4px solid #ff6b6b;
            font-size: 14px;
            color: #666;
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
            border-color: #fdcb6e;
        }
        
        .improved {
            background: linear-gradient(135deg, #55efc4 0%, #00b894 100%);
            border-color: #00b894;
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
            letter-spacing: 0.5px;
        }
        
        .content-text {
            font-size: 16px;
            line-height: 1.6;
            color: #2d3436;
        }
        
        .word-count {
            margin-top: 10px;
            font-size: 12px;
            color: #636e72;
        }
        
        .actions {
            padding: 20px;
            background: #f8f9fa;
            border-top: 2px solid #e9ecef;
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
            transition: all 0.2s;
        }
        
        .btn-approve {
            background: #00b894;
            color: white;
        }
        
        .btn-keep {
            background: #fdcb6e;
            color: #2d3436;
        }
        
        .btn-edit {
            background: #a29bfe;
            color: white;
        }
        
        .btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        }
        
        .progress-bar {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            height: 4px;
            background: linear-gradient(90deg, #667eea, #764ba2);
            z-index: 1000;
        }
        
        .summary-panel {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: white;
            padding: 20px;
            border-radius: 16px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.2);
            min-width: 300px;
        }
        
        .summary-title {
            font-size: 14px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 15px;
        }
        
        .summary-stats {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 10px;
            margin-bottom: 20px;
        }
        
        .stat {
            padding: 10px;
            background: #f8f9fa;
            border-radius: 8px;
            text-align: center;
        }
        
        .stat-value {
            font-size: 20px;
            font-weight: bold;
            color: #F97316;
        }
        
        .stat-label {
            font-size: 11px;
            color: #666;
            text-transform: uppercase;
        }
        
        .implement-btn {
            width: 100%;
            padding: 12px;
            background: linear-gradient(90deg, #667eea, #764ba2);
            color: white;
            border: none;
            border-radius: 8px;
            font-size: 16px;
            font-weight: bold;
            cursor: pointer;
        }
        
        .implement-btn:hover {
            opacity: 0.9;
        }
    </style>
</head>
<body>
    <div class="progress-bar"></div>
    
    <div class="container">
        <div class="header">
            <h1>📝 ${sectionName} - Content Review</h1>
            <p style="color: #666; margin-top: 10px;">
                Review improvements for this section. All changes maintain word count for layout safety.
            </p>
            
            <div class="section-info">
                <div class="info-item">
                    <div class="info-value">${improvements.length}</div>
                    <div class="info-label">Total Changes</div>
                </div>
                <div class="info-item">
                    <div class="info-value">${improvements.filter(i => i.layoutSafe).length}</div>
                    <div class="info-label">Layout Safe</div>
                </div>
                <div class="info-item">
                    <div class="info-value">${improvements.filter(i => i.issues.some(iss => iss.includes('jargon'))).length}</div>
                    <div class="info-label">Jargon Fixed</div>
                </div>
            </div>
        </div>
        
        ${improvements.map((item, index) => `
            <div class="improvement-card" data-index="${index}">
                <div class="card-header">
                    <div class="file-path">${item.file} → ${item.path}</div>
                    <div class="layout-status ${item.layoutSafe ? 'layout-safe' : 'layout-warning'}">
                        ${item.layoutSafe ? '✓ Layout Safe' : '⚠️ Check Layout'}
                        (${item.wordCount.difference >= 0 ? '+' : ''}${item.wordCount.difference} words)
                    </div>
                </div>
                
                ${item.issues ? `
                    <div class="issues-list">
                        <strong>Issues fixed:</strong> ${item.issues.join(', ')}
                    </div>
                ` : ''}
                
                <div class="content-comparison">
                    <div class="content-box original">
                        <span class="content-label">Original</span>
                        <div class="content-text">${item.original}</div>
                        <div class="word-count">${item.wordCount.original} words</div>
                    </div>
                    
                    <div class="content-box improved">
                        <span class="content-label">Improved</span>
                        <div class="content-text" id="improved-${index}">${item.improved}</div>
                        <div class="word-count">${item.wordCount.improved} words</div>
                    </div>
                </div>
                
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
        
        <div style="margin-bottom: 100px;"></div>
    </div>
    
    <div class="summary-panel">
        <div class="summary-title">Section Summary</div>
        
        <div class="summary-stats">
            <div class="stat">
                <div class="stat-value" id="approvedCount">0</div>
                <div class="stat-label">Approved</div>
            </div>
            <div class="stat">
                <div class="stat-value" id="keptCount">0</div>
                <div class="stat-label">Kept</div>
            </div>
        </div>
        
        <button class="implement-btn" onclick="implementSection()">
            Apply Changes to ${sectionName}
        </button>
    </div>
    
    <script>
        const improvements = ${JSON.stringify(improvements)};
        const decisions = new Map();
        
        function updateSummary() {
            const approved = Array.from(decisions.values()).filter(d => d === 'approve').length;
            const kept = Array.from(decisions.values()).filter(d => d === 'keep').length;
            
            document.getElementById('approvedCount').textContent = approved;
            document.getElementById('keptCount').textContent = kept;
        }
        
        function approve(index) {
            decisions.set(index, 'approve');
            document.querySelector(\`[data-index="\${index}"]\`).style.borderLeft = '4px solid #00b894';
            updateSummary();
        }
        
        function keep(index) {
            decisions.set(index, 'keep');
            document.querySelector(\`[data-index="\${index}"]\`).style.borderLeft = '4px solid #fdcb6e';
            updateSummary();
        }
        
        function edit(index) {
            const current = document.getElementById(\`improved-\${index}\`).textContent;
            const edited = prompt('Edit the improved version:', current);
            if (edited && edited !== current) {
                document.getElementById(\`improved-\${index}\`).textContent = edited;
                improvements[index].improved = edited;
                improvements[index].wordCount.improved = edited.split(' ').length;
                approve(index);
            }
        }
        
        function implementSection() {
            const changes = [];
            decisions.forEach((decision, index) => {
                if (decision === 'approve') {
                    changes.push(improvements[index]);
                }
            });
            
            if (changes.length === 0) {
                alert('No changes approved yet. Please approve at least one change.');
                return;
            }
            
            localStorage.setItem('section_${sectionName}_changes', JSON.stringify(changes));
            alert(\`✅ \${changes.length} changes ready for ${sectionName}!
            
Next steps:
1. Review other sections
2. When all sections are done, run: npm run implement:all\`);
        }
    </script>
</body>
</html>`;
    
    const outputDir = './improvements/sections';
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    const fileName = `${sectionName.toLowerCase().replace(/[^a-z0-9]/g, '_')}_review.html`;
    const htmlPath = path.join(outputDir, fileName);
    fs.writeFileSync(htmlPath, html);
    
    return htmlPath;
  }
  
  /**
   * Main workflow
   */
  async run() {
    console.log(chalk.bold.cyan('\n🚀 UNIFIED CONTENT IMPROVEMENT SYSTEM\n'));
    console.log(chalk.gray('Processing website section by section with layout constraints\n'));
    
    // Step 1: Analyze website structure
    const sections = await this.analyzeWebsite();
    
    // Display section overview
    console.log(chalk.cyan('\n📋 WEBSITE SECTIONS FOUND:\n'));
    
    const sectionList = Object.entries(sections)
      .filter(([_, s]) => s.priority !== 'skip')
      .sort((a, b) => {
        const priority = { high: 0, medium: 1, low: 2 };
        return priority[a[1].priority] - priority[b[1].priority];
      });
    
    sectionList.forEach(([name, section], index) => {
      const priorityColor = section.priority === 'high' ? chalk.red : 
                           section.priority === 'medium' ? chalk.yellow : chalk.gray;
      const priorityIcon = section.priority === 'high' ? '🔴' : 
                          section.priority === 'medium' ? '🟡' : '⚪';
      
      console.log(`${index + 1}. ${priorityIcon} ${name}`);
      console.log(chalk.gray(`   Files: ${section.files.length} | Content: ${section.contentCount} pieces | Time: ${section.estimatedTime}`));
      console.log(chalk.gray(`   Issues: ${section.issues.slice(0, 3).join(', ')}${section.issues.length > 3 ? '...' : ''}\n`));
    });
    
    // Step 2: Process sections one by one
    console.log(chalk.cyan('\n🔄 PROCESSING SECTIONS (High Priority First)\n'));
    
    const allImprovements = {};
    
    for (const [sectionName, section] of sectionList) {
      if (section.priority === 'high' || section.priority === 'medium') {
        console.log(chalk.yellow(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`));
        console.log(chalk.yellow(`Processing: ${sectionName}`));
        console.log(chalk.yellow(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`));
        
        const improvements = await this.processSection(sectionName);
        
        if (improvements.length > 0) {
          allImprovements[sectionName] = improvements;
          
          // Generate review page for this section
          const reviewPath = this.generateSectionReview(sectionName, improvements);
          
          console.log(chalk.green(`\n✅ ${sectionName} Complete!`));
          console.log(chalk.gray(`   ${improvements.length} improvements generated`));
          console.log(chalk.gray(`   ${improvements.filter(i => i.layoutSafe).length} are layout-safe`));
          console.log(chalk.cyan(`   Review: ${reviewPath}\n`));
        }
        
        // Pause between sections
        console.log(chalk.gray('\nPausing before next section...'));
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
    
    // Step 3: Generate master review dashboard
    this.generateMasterDashboard(allImprovements);
    
    // Summary
    console.log(chalk.bold.cyan('\n✅ UNIFIED PROCESSING COMPLETE!\n'));
    
    const totalImprovements = Object.values(allImprovements).flat().length;
    const layoutSafe = Object.values(allImprovements).flat().filter(i => i.layoutSafe).length;
    
    console.log(chalk.white(`📊 Summary:`));
    console.log(chalk.gray(`   • Sections processed: ${Object.keys(allImprovements).length}`));
    console.log(chalk.gray(`   • Total improvements: ${totalImprovements}`));
    console.log(chalk.gray(`   • Layout-safe changes: ${layoutSafe}/${totalImprovements}`));
    
    console.log(chalk.yellow('\n📋 Next Steps:'));
    console.log(chalk.gray('   1. Review each section: npm run review:unified'));
    console.log(chalk.gray('   2. Approve/edit changes as needed'));
    console.log(chalk.gray('   3. Implement all approved: npm run implement:unified\n'));
    
    return allImprovements;
  }
  
  /**
   * Generate master dashboard
   */
  generateMasterDashboard(allImprovements) {
    const totalImprovements = Object.values(allImprovements).flat().length;
    const sections = Object.keys(allImprovements);
    
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Content Improvement Dashboard</title>
    <style>
        body { 
            font-family: -apple-system, BlinkMacSystemFont, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 40px;
            margin: 0;
        }
        
        .dashboard {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            border-radius: 20px;
            padding: 40px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        }
        
        h1 {
            font-size: 36px;
            margin-bottom: 30px;
            background: linear-gradient(90deg, #667eea, #764ba2);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
        
        .stats {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 20px;
            margin-bottom: 40px;
        }
        
        .stat-card {
            padding: 25px;
            background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
            border-radius: 12px;
            text-align: center;
        }
        
        .stat-value {
            font-size: 48px;
            font-weight: bold;
            color: #F97316;
        }
        
        .stat-label {
            font-size: 14px;
            color: #666;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-top: 10px;
        }
        
        .sections {
            display: grid;
            gap: 20px;
        }
        
        .section-card {
            padding: 25px;
            background: white;
            border: 2px solid #e9ecef;
            border-radius: 12px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            transition: all 0.3s;
        }
        
        .section-card:hover {
            transform: translateX(10px);
            border-color: #667eea;
            box-shadow: 0 10px 30px rgba(102, 126, 234, 0.1);
        }
        
        .section-info h3 {
            margin: 0 0 10px 0;
            color: #333;
        }
        
        .section-meta {
            color: #666;
            font-size: 14px;
        }
        
        .review-btn {
            padding: 12px 24px;
            background: linear-gradient(90deg, #667eea, #764ba2);
            color: white;
            border: none;
            border-radius: 8px;
            font-weight: 600;
            cursor: pointer;
            text-decoration: none;
            display: inline-block;
        }
        
        .review-btn:hover {
            opacity: 0.9;
        }
    </style>
</head>
<body>
    <div class="dashboard">
        <h1>🎯 Content Improvement Dashboard</h1>
        
        <div class="stats">
            <div class="stat-card">
                <div class="stat-value">${sections.length}</div>
                <div class="stat-label">Sections Processed</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${totalImprovements}</div>
                <div class="stat-label">Total Improvements</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${Object.values(allImprovements).flat().filter(i => i.layoutSafe).length}</div>
                <div class="stat-label">Layout Safe</div>
            </div>
        </div>
        
        <h2>📝 Review Sections</h2>
        <div class="sections">
            ${sections.map(section => {
                const improvements = allImprovements[section];
                const fileName = section.toLowerCase().replace(/[^a-z0-9]/g, '_');
                return `
                    <div class="section-card">
                        <div class="section-info">
                            <h3>${section}</h3>
                            <div class="section-meta">
                                ${improvements.length} improvements • 
                                ${improvements.filter(i => i.layoutSafe).length} layout safe
                            </div>
                        </div>
                        <a href="sections/${fileName}_review.html" class="review-btn">
                            Review Section →
                        </a>
                    </div>
                `;
            }).join('')}
        </div>
    </div>
</body>
</html>`;
    
    const dashboardPath = './improvements/unified_dashboard.html';
    fs.writeFileSync(dashboardPath, html);
    
    console.log(chalk.cyan(`\n📊 Master Dashboard: ${dashboardPath}`));
  }
}

// Run if called directly
if (process.argv[1]?.endsWith('unified_content_system.js')) {
  const system = new UnifiedContentSystem();
  system.run().catch(console.error);
}

export default UnifiedContentSystem;