#!/usr/bin/env node

/**
 * Content Improvement Workflow
 * Generates improved content, shows comparisons, and implements changes
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import chalk from 'chalk';
import AssistantContentImprover from './assistant_content_improver.js';
import ContentAnalyzer from './content_analyzer.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

class ContentImproverWorkflow {
  constructor() {
    this.analyzer = new ContentAnalyzer();
    this.improver = new AssistantContentImprover();
    this.dataPath = '../data';
    this.improvementsPath = './improvements';
    this.approvedPath = './improvements/approved';
    
    // Ensure directories exist
    this.ensureDirectories();
  }
  
  ensureDirectories() {
    [this.improvementsPath, this.approvedPath].forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    });
  }
  
  /**
   * Step 1: Analyze and generate improvements
   */
  async generateImprovements() {
    console.log(chalk.cyan('\n🚀 GENERATING CONTENT IMPROVEMENTS\n'));
    
    // First analyze to find low-scoring content
    const analysis = await this.analyzer.analyzeDirectory(this.dataPath);
    
    // Get files that need improvement (score < 80)
    const filesNeedingImprovement = [];
    for (const [file, data] of Object.entries(this.analyzer.fileAnalysis)) {
      if (data.voiceScore && data.voiceScore.percentage < 80) {
        filesNeedingImprovement.push({
          file,
          score: data.voiceScore.percentage,
          content: data.content
        });
      }
    }
    
    console.log(chalk.yellow(`\nFound ${filesNeedingImprovement.length} files needing improvement\n`));
    
    const improvements = [];
    
    // Generate improvements for each file
    for (const fileData of filesNeedingImprovement.slice(0, 5)) { // Limit to 5 for demo
      console.log(chalk.gray(`\nImproving: ${fileData.file} (current score: ${fileData.score.toFixed(1)}%)`));
      
      try {
        // Extract text content from JSON
        const jsonContent = JSON.parse(fs.readFileSync(path.join(this.dataPath, fileData.file), 'utf8'));
        const contentToImprove = this.extractTextContent(jsonContent);
        
        // Generate improvements for each text field
        const improvedContent = {};
        
        for (const [key, originalText] of Object.entries(contentToImprove)) {
          if (originalText && originalText.length > 10) {
            console.log(chalk.gray(`  Improving field: ${key}`));
            
            // Determine content type
            const contentType = this.detectContentType(key, originalText);
            
            // Generate improvement
            const improved = await this.improver.improveContent(
              originalText,
              contentType,
              { 
                currentScore: fileData.score,
                fieldName: key,
                fileName: fileData.file 
              }
            );
            
            improvedContent[key] = {
              original: originalText,
              improved: improved.improvedText || originalText,
              changes: improved.changes || [],
              score: improved.score || fileData.score
            };
          }
        }
        
        improvements.push({
          file: fileData.file,
          originalScore: fileData.score,
          improvements: improvedContent,
          timestamp: new Date().toISOString()
        });
        
      } catch (error) {
        console.log(chalk.red(`  Error improving ${fileData.file}: ${error.message}`));
      }
    }
    
    // Save improvements
    const improvementsFile = path.join(this.improvementsPath, 'content_improvements.json');
    fs.writeFileSync(improvementsFile, JSON.stringify(improvements, null, 2));
    
    console.log(chalk.green(`\n✅ Generated improvements for ${improvements.length} files`));
    console.log(chalk.gray(`Saved to: ${improvementsFile}`));
    
    // Generate review HTML
    await this.generateReviewHTML(improvements);
    
    return improvements;
  }
  
  /**
   * Extract text content from JSON
   */
  extractTextContent(json, prefix = '') {
    const textContent = {};
    
    for (const [key, value] of Object.entries(json)) {
      const fullKey = prefix ? `${prefix}.${key}` : key;
      
      if (typeof value === 'string' && value.length > 0) {
        // Skip URLs, IDs, and technical fields
        if (!key.includes('url') && !key.includes('id') && !key.includes('icon') && !key.includes('image')) {
          textContent[fullKey] = value;
        }
      } else if (Array.isArray(value)) {
        value.forEach((item, index) => {
          if (typeof item === 'object') {
            Object.assign(textContent, this.extractTextContent(item, `${fullKey}[${index}]`));
          }
        });
      } else if (typeof value === 'object' && value !== null) {
        Object.assign(textContent, this.extractTextContent(value, fullKey));
      }
    }
    
    return textContent;
  }
  
  /**
   * Detect content type based on field name and content
   */
  detectContentType(fieldName, content) {
    const field = fieldName.toLowerCase();
    
    if (field.includes('title') || field.includes('heading')) return 'heading';
    if (field.includes('subtitle')) return 'subheading';
    if (field.includes('description') || field.includes('text')) return 'body';
    if (field.includes('cta') || field.includes('button')) return 'cta';
    if (field.includes('testimonial')) return 'testimonial';
    if (field.includes('faq')) return 'faq';
    
    // Check content length
    if (content.length < 50) return 'heading';
    if (content.length < 150) return 'subheading';
    
    return 'body';
  }
  
  /**
   * Generate HTML review interface
   */
  async generateReviewHTML(improvements) {
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Content Improvements Review</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: #f5f5f5;
            padding: 20px;
        }
        .container { max-width: 1200px; margin: 0 auto; }
        
        h1 { 
            color: #333; 
            margin-bottom: 10px;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .stats {
            background: white;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 30px;
            display: flex;
            gap: 30px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        .stat {
            display: flex;
            flex-direction: column;
        }
        
        .stat-label {
            font-size: 12px;
            color: #666;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        
        .stat-value {
            font-size: 24px;
            font-weight: bold;
            color: #F97316;
        }
        
        .file-improvements {
            background: white;
            border-radius: 8px;
            margin-bottom: 20px;
            overflow: hidden;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        .file-header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .file-name {
            font-size: 18px;
            font-weight: 600;
        }
        
        .score-badge {
            background: rgba(255,255,255,0.2);
            padding: 5px 15px;
            border-radius: 20px;
            font-size: 14px;
        }
        
        .improvement-item {
            border-bottom: 1px solid #eee;
            padding: 20px;
        }
        
        .improvement-item:last-child {
            border-bottom: none;
        }
        
        .field-name {
            font-size: 14px;
            color: #666;
            margin-bottom: 15px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        .comparison {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-bottom: 15px;
        }
        
        .original, .improved {
            padding: 15px;
            border-radius: 6px;
            position: relative;
        }
        
        .original {
            background: #fff3cd;
            border: 1px solid #ffc107;
        }
        
        .improved {
            background: #d4edda;
            border: 1px solid #28a745;
        }
        
        .version-label {
            position: absolute;
            top: -10px;
            left: 10px;
            background: white;
            padding: 0 8px;
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
        }
        
        .original .version-label { color: #856404; }
        .improved .version-label { color: #155724; }
        
        .content-text {
            line-height: 1.6;
            color: #333;
        }
        
        .actions {
            display: flex;
            gap: 10px;
            justify-content: flex-end;
        }
        
        .btn {
            padding: 8px 20px;
            border: none;
            border-radius: 4px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s;
        }
        
        .btn-approve {
            background: #28a745;
            color: white;
        }
        
        .btn-approve:hover {
            background: #218838;
        }
        
        .btn-reject {
            background: #dc3545;
            color: white;
        }
        
        .btn-reject:hover {
            background: #c82333;
        }
        
        .btn-edit {
            background: #ffc107;
            color: #333;
        }
        
        .btn-edit:hover {
            background: #e0a800;
        }
        
        .approved {
            opacity: 0.6;
            position: relative;
        }
        
        .approved::after {
            content: "✓ APPROVED";
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #28a745;
            color: white;
            padding: 10px 20px;
            border-radius: 4px;
            font-weight: bold;
        }
        
        .implementation-panel {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 1000;
        }
        
        .implementation-btn {
            background: #F97316;
            color: white;
            padding: 12px 30px;
            border: none;
            border-radius: 4px;
            font-size: 16px;
            font-weight: bold;
            cursor: pointer;
        }
        
        .implementation-btn:hover {
            background: #ea580c;
        }
        
        .approval-count {
            font-size: 14px;
            color: #666;
            margin-bottom: 10px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>
            <span>🚀</span>
            Content Improvements Review
        </h1>
        <p style="color: #666; margin-bottom: 30px;">
            Review AI-generated improvements, approve changes, and implement them on your website.
        </p>
        
        <div class="stats">
            <div class="stat">
                <span class="stat-label">Files Analyzed</span>
                <span class="stat-value">${improvements.length}</span>
            </div>
            <div class="stat">
                <span class="stat-label">Improvements Generated</span>
                <span class="stat-value" id="totalImprovements">0</span>
            </div>
            <div class="stat">
                <span class="stat-label">Approved Changes</span>
                <span class="stat-value" id="approvedCount">0</span>
            </div>
            <div class="stat">
                <span class="stat-label">Average Score Increase</span>
                <span class="stat-value" id="avgIncrease">+0%</span>
            </div>
        </div>
        
        ${improvements.map((file, fileIndex) => `
            <div class="file-improvements" data-file="${file.file}">
                <div class="file-header">
                    <div class="file-name">${file.file}</div>
                    <div class="score-badge">Current Score: ${file.originalScore.toFixed(1)}%</div>
                </div>
                
                ${Object.entries(file.improvements).map(([field, improvement], index) => `
                    <div class="improvement-item" data-field="${field}" data-file-index="${fileIndex}" data-field-index="${index}">
                        <div class="field-name">${field}</div>
                        
                        <div class="comparison">
                            <div class="original">
                                <span class="version-label">Original</span>
                                <div class="content-text">${improvement.original}</div>
                            </div>
                            
                            <div class="improved">
                                <span class="version-label">Improved</span>
                                <div class="content-text">${improvement.improved}</div>
                            </div>
                        </div>
                        
                        <div class="actions">
                            <button class="btn btn-edit" onclick="editImprovement(${fileIndex}, ${index})">
                                ✏️ Edit
                            </button>
                            <button class="btn btn-reject" onclick="rejectImprovement(${fileIndex}, ${index})">
                                ✗ Reject
                            </button>
                            <button class="btn btn-approve" onclick="approveImprovement(${fileIndex}, ${index})">
                                ✓ Approve
                            </button>
                        </div>
                    </div>
                `).join('')}
            </div>
        `).join('')}
        
        <div class="implementation-panel">
            <div class="approval-count">
                <span id="approvalStatus">No changes approved yet</span>
            </div>
            <button class="implementation-btn" onclick="implementChanges()">
                🚀 Implement Approved Changes
            </button>
        </div>
    </div>
    
    <script>
        const improvements = ${JSON.stringify(improvements)};
        const approved = new Set();
        const rejected = new Set();
        
        // Calculate total improvements
        let totalImprovements = 0;
        improvements.forEach(file => {
            totalImprovements += Object.keys(file.improvements).length;
        });
        document.getElementById('totalImprovements').textContent = totalImprovements;
        
        function approveImprovement(fileIndex, fieldIndex) {
            const key = fileIndex + '-' + fieldIndex;
            approved.add(key);
            rejected.delete(key);
            
            const item = document.querySelector(\`[data-file-index="\${fileIndex}"][data-field-index="\${fieldIndex}"]\`);
            item.classList.add('approved');
            
            updateApprovalCount();
        }
        
        function rejectImprovement(fileIndex, fieldIndex) {
            const key = fileIndex + '-' + fieldIndex;
            rejected.add(key);
            approved.delete(key);
            
            const item = document.querySelector(\`[data-file-index="\${fileIndex}"][data-field-index="\${fieldIndex}"]\`);
            item.classList.remove('approved');
            item.style.opacity = '0.3';
            
            updateApprovalCount();
        }
        
        function editImprovement(fileIndex, fieldIndex) {
            const file = improvements[fileIndex];
            const field = Object.keys(file.improvements)[fieldIndex];
            const improvement = file.improvements[field];
            
            const newText = prompt('Edit the improved content:', improvement.improved);
            if (newText && newText !== improvement.improved) {
                improvement.improved = newText;
                
                // Update display
                const item = document.querySelector(\`[data-file-index="\${fileIndex}"][data-field-index="\${fieldIndex}"]\`);
                const improvedText = item.querySelector('.improved .content-text');
                improvedText.textContent = newText;
                
                // Auto-approve edited content
                approveImprovement(fileIndex, fieldIndex);
            }
        }
        
        function updateApprovalCount() {
            document.getElementById('approvedCount').textContent = approved.size;
            
            if (approved.size > 0) {
                document.getElementById('approvalStatus').textContent = 
                    \`\${approved.size} change\${approved.size === 1 ? '' : 's'} approved, ready to implement\`;
            } else {
                document.getElementById('approvalStatus').textContent = 'No changes approved yet';
            }
        }
        
        async function implementChanges() {
            if (approved.size === 0) {
                alert('No changes approved. Please approve at least one improvement before implementing.');
                return;
            }
            
            const approvedChanges = [];
            
            approved.forEach(key => {
                const [fileIndex, fieldIndex] = key.split('-').map(Number);
                const file = improvements[fileIndex];
                const field = Object.keys(file.improvements)[fieldIndex];
                
                approvedChanges.push({
                    file: file.file,
                    field: field,
                    original: file.improvements[field].original,
                    improved: file.improvements[field].improved
                });
            });
            
            // Save approved changes
            const response = await fetch('/save-approved', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ changes: approvedChanges })
            }).catch(() => null);
            
            // For now, save to localStorage and show confirmation
            localStorage.setItem('approvedChanges', JSON.stringify(approvedChanges));
            
            const message = \`
✅ Approved Changes Saved!

\${approvedChanges.length} improvement\${approvedChanges.length === 1 ? '' : 's'} ready to implement.

To apply these changes to your website, run:
npm run implement:changes

Or use the command:
node implement_changes.js
            \`;
            
            alert(message);
            
            // Show implementation instructions
            console.log('Approved changes:', approvedChanges);
        }
    </script>
</body>
</html>`;
    
    const htmlPath = path.join(this.improvementsPath, 'review_improvements.html');
    fs.writeFileSync(htmlPath, html);
    
    console.log(chalk.green(`\n✅ Review interface generated`));
    console.log(chalk.cyan(`Opening: ${htmlPath}\n`));
    
    // Try to open in browser
    const platform = process.platform;
    const { exec } = await import('child_process');
    
    if (platform === 'darwin') {
      exec(`open "${htmlPath}"`);
    } else if (platform === 'win32') {
      exec(`start "${htmlPath}"`);
    } else {
      exec(`xdg-open "${htmlPath}"`);
    }
    
    return htmlPath;
  }
}

// CLI execution
if (process.argv[1]?.endsWith('content_improver_workflow.js')) {
  const workflow = new ContentImproverWorkflow();
  
  const command = process.argv[2];
  
  if (!command || command === 'generate') {
    workflow.generateImprovements().catch(console.error);
  } else if (command === '--help') {
    console.log(`
🚀 Content Improvement Workflow

Commands:
  generate    Generate improvements and review interface
  --help      Show this help

Usage:
  node content_improver_workflow.js [generate]
  npm run improve
    `);
  }
}

export default ContentImproverWorkflow;