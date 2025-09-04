#!/usr/bin/env node

/**
 * Integrated Content Improvement Workflow
 * Combines: Analysis → AI Recommendations → Review → Implementation
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import AssistantContentImprover from './assistant_content_improver.js';
import ContentAnalyzer from './content_analyzer.js';
import VoiceReviewSystem from './voice_review.js';
import ReportGenerator from './report_generator.js';
import chalk from 'chalk';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

class IntegratedWorkflow {
  constructor(options = {}) {
    this.assistant = new AssistantContentImprover();
    this.analyzer = new ContentAnalyzer();
    this.reviewer = new VoiceReviewSystem({ threshold: 0.5, aggressive: true });
    this.reportGenerator = new ReportGenerator();
    
    // Workflow state
    this.analysisResults = null;
    this.improvements = [];
    this.approvedChanges = [];
    this.implementationPlan = [];
    
    // Paths
    this.dataPath = options.dataPath || '../data';
    this.websitePath = options.websitePath || '..';
    this.workflowDir = './workflow_results';
    this.ensureWorkflowDir();
  }

  ensureWorkflowDir() {
    if (!fs.existsSync(this.workflowDir)) {
      fs.mkdirSync(this.workflowDir, { recursive: true });
    }
  }

  /**
   * STEP 1: ANALYZE - Current state analysis
   */
  async analyze() {
    console.log(chalk.cyan('\n📊 STEP 1: ANALYZING CURRENT CONTENT\n'));
    
    const files = this.getJsonFiles(this.dataPath);
    const results = [];
    
    for (const file of files) {
      console.log(`Analyzing ${path.basename(file)}...`);
      
      const content = JSON.parse(fs.readFileSync(file, 'utf8'));
      const fileResults = {
        file: path.basename(file),
        path: file,
        content,
        issues: [],
        score: 0
      };
      
      // Basic voice analysis
      const textFields = this.extractTextFields(content);
      let totalScore = 0;
      
      for (const field of textFields) {
        const validation = this.reviewer.validator.validateContent(field.text);
        totalScore += validation.scores.overall;
        
        if (validation.scores.overall < 0.5) {
          fileResults.issues.push({
            path: field.path,
            text: field.text,
            score: validation.scores.overall,
            issues: validation.issues
          });
        }
      }
      
      fileResults.score = textFields.length > 0 ? totalScore / textFields.length : 0;
      results.push(fileResults);
    }
    
    this.analysisResults = {
      timestamp: new Date().toISOString(),
      files: results,
      totalFiles: results.length,
      avgScore: results.reduce((sum, r) => sum + r.score, 0) / results.length
    };
    
    // Generate analysis report
    const report = this.generateAnalysisReport(this.analysisResults);
    fs.writeFileSync(path.join(this.workflowDir, 'analysis.md'), report);
    
    console.log(chalk.green(`\n✓ Analysis complete: ${this.analysisResults.totalFiles} files analyzed`));
    console.log(chalk.yellow(`  Average score: ${(this.analysisResults.avgScore * 100).toFixed(1)}%`));
    
    return this.analysisResults;
  }

  /**
   * STEP 2: RECOMMEND - Get AI recommendations
   */
  async recommend() {
    if (!this.analysisResults) {
      throw new Error('Run analyze() first');
    }
    
    console.log(chalk.cyan('\n🤖 STEP 2: GENERATING AI RECOMMENDATIONS\n'));
    
    this.improvements = [];
    
    for (const fileResult of this.analysisResults.files) {
      if (fileResult.issues.length === 0) continue;
      
      console.log(`Getting AI recommendations for ${fileResult.file}...`);
      
      for (const issue of fileResult.issues.slice(0, 5)) { // Limit to 5 per file for demo
        try {
          const result = await this.assistant.analyzeAndImprove(
            issue.text,
            this.detectContentType(issue.path, issue.text)
          );
          
          if (result.scoreImprovement > 20) {
            this.improvements.push({
              file: fileResult.file,
              filePath: fileResult.path,
              fieldPath: issue.path,
              original: issue.text,
              improved: result.improved,
              analysis: result.analysis,
              changes: result.changes,
              scoreImprovement: result.scoreImprovement,
              reasoning: result.reasoning
            });
            
            console.log(chalk.green(`  ✓ ${issue.path}: +${result.scoreImprovement}% improvement`));
          }
          
          // Rate limiting
          await new Promise(resolve => setTimeout(resolve, 500));
          
        } catch (error) {
          console.error(chalk.red(`  ✗ Error: ${error.message}`));
        }
      }
    }
    
    // Generate recommendations report
    const report = this.generateRecommendationsReport(this.improvements);
    fs.writeFileSync(path.join(this.workflowDir, 'recommendations.md'), report);
    fs.writeFileSync(
      path.join(this.workflowDir, 'recommendations.json'),
      JSON.stringify(this.improvements, null, 2)
    );
    
    console.log(chalk.green(`\n✓ Generated ${this.improvements.length} recommendations`));
    
    return this.improvements;
  }

  /**
   * STEP 3: REVIEW - Interactive review and approval
   */
  async review() {
    if (!this.improvements || this.improvements.length === 0) {
      throw new Error('No improvements to review. Run recommend() first');
    }
    
    console.log(chalk.cyan('\n👁️ STEP 3: REVIEW AND APPROVAL\n'));
    
    // Generate preview report
    this.generatePreviewReport(this.improvements);
    console.log(chalk.gray('Preview report saved to workflow_results/preview.html\n'));
    
    // Interactive review
    const readline = require('readline');
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    this.approvedChanges = [];
    
    for (let i = 0; i < this.improvements.length; i++) {
      const imp = this.improvements[i];
      
      console.log(chalk.white(`\n[${i + 1}/${this.improvements.length}] ${imp.file} → ${imp.fieldPath}`));
      console.log(chalk.gray('─'.repeat(60)));
      console.log(chalk.red('Original:'));
      console.log(`  ${imp.original.substring(0, 100)}${imp.original.length > 100 ? '...' : ''}`);
      console.log(chalk.green('Improved:'));
      console.log(`  ${imp.improved.substring(0, 100)}${imp.improved.length > 100 ? '...' : ''}`);
      console.log(chalk.blue(`Score: +${imp.scoreImprovement}%`));
      console.log(chalk.gray(`Reasoning: ${imp.reasoning?.substring(0, 100) || 'N/A'}`));
      
      const answer = await new Promise(resolve => {
        rl.question(chalk.cyan('Approve? [y/n/a/q]: '), resolve);
      });
      
      if (answer.toLowerCase() === 'y') {
        this.approvedChanges.push(imp);
        console.log(chalk.green('✓ Approved'));
      } else if (answer.toLowerCase() === 'a') {
        // Approve all remaining
        this.approvedChanges.push(...this.improvements.slice(i));
        console.log(chalk.green('✓ Approved all remaining'));
        break;
      } else if (answer.toLowerCase() === 'q') {
        console.log(chalk.yellow('Review cancelled'));
        break;
      } else {
        console.log(chalk.red('✗ Rejected'));
      }
    }
    
    rl.close();
    
    // Save approved changes
    fs.writeFileSync(
      path.join(this.workflowDir, 'approved_changes.json'),
      JSON.stringify(this.approvedChanges, null, 2)
    );
    
    console.log(chalk.green(`\n✓ Review complete: ${this.approvedChanges.length} changes approved`));
    
    return this.approvedChanges;
  }

  /**
   * STEP 4: IMPLEMENT - Apply changes to website files
   */
  async implement() {
    if (!this.approvedChanges || this.approvedChanges.length === 0) {
      throw new Error('No approved changes to implement. Run review() first');
    }
    
    console.log(chalk.cyan('\n🚀 STEP 4: IMPLEMENTING CHANGES\n'));
    
    // Create backup
    const backupDir = path.join(this.workflowDir, 'backup_' + Date.now());
    fs.mkdirSync(backupDir, { recursive: true });
    
    // Group changes by file
    const changesByFile = {};
    for (const change of this.approvedChanges) {
      if (!changesByFile[change.filePath]) {
        changesByFile[change.filePath] = [];
      }
      changesByFile[change.filePath].push(change);
    }
    
    // Apply changes to each file
    for (const [filePath, changes] of Object.entries(changesByFile)) {
      console.log(`Updating ${path.basename(filePath)}...`);
      
      // Backup original
      const backupPath = path.join(backupDir, path.basename(filePath));
      fs.copyFileSync(filePath, backupPath);
      
      // Load content
      const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      
      // Apply each change
      for (const change of changes) {
        this.applyChange(content, change.fieldPath, change.improved);
        console.log(chalk.green(`  ✓ Updated ${change.fieldPath}`));
      }
      
      // Save updated content
      fs.writeFileSync(filePath, JSON.stringify(content, null, 2));
    }
    
    // Create implementation summary
    const summary = {
      timestamp: new Date().toISOString(),
      filesUpdated: Object.keys(changesByFile).length,
      changesApplied: this.approvedChanges.length,
      backupLocation: backupDir,
      changes: this.approvedChanges
    };
    
    fs.writeFileSync(
      path.join(this.workflowDir, 'implementation_summary.json'),
      JSON.stringify(summary, null, 2)
    );
    
    console.log(chalk.green('\n✓ Implementation complete!'));
    console.log(chalk.gray(`  Backup saved to: ${backupDir}`));
    console.log(chalk.gray(`  Files updated: ${summary.filesUpdated}`));
    console.log(chalk.gray(`  Changes applied: ${summary.changesApplied}`));
    
    return summary;
  }

  /**
   * STEP 5: VALIDATE - Check the results
   */
  async validate() {
    console.log(chalk.cyan('\n✅ STEP 5: VALIDATING RESULTS\n'));
    
    // Re-analyze to compare
    const newAnalysis = await this.analyze();
    
    // Compare scores
    const improvement = (newAnalysis.avgScore - this.analysisResults.avgScore) * 100;
    
    console.log(chalk.green('\n📊 Results:'));
    console.log(`  Before: ${(this.analysisResults.avgScore * 100).toFixed(1)}%`);
    console.log(`  After: ${(newAnalysis.avgScore * 100).toFixed(1)}%`);
    console.log(`  Improvement: +${improvement.toFixed(1)}%`);
    
    // Generate final report
    const finalReport = this.generateFinalReport(this.analysisResults, newAnalysis);
    fs.writeFileSync(path.join(this.workflowDir, 'final_report.md'), finalReport);
    
    return {
      before: this.analysisResults.avgScore,
      after: newAnalysis.avgScore,
      improvement
    };
  }

  /**
   * RUN COMPLETE WORKFLOW
   */
  async runCompleteWorkflow() {
    console.log(chalk.magenta('\n' + '='.repeat(60)));
    console.log(chalk.magenta('🔄 STARTING COMPLETE CONTENT IMPROVEMENT WORKFLOW'));
    console.log(chalk.magenta('='.repeat(60)));
    
    try {
      // Step 1: Analyze
      await this.analyze();
      
      // Step 2: Get recommendations
      await this.recommend();
      
      // Step 3: Review
      await this.review();
      
      if (this.approvedChanges.length > 0) {
        // Step 4: Implement
        await this.implement();
        
        // Step 5: Validate
        await this.validate();
      }
      
      console.log(chalk.magenta('\n' + '='.repeat(60)));
      console.log(chalk.magenta('✨ WORKFLOW COMPLETE!'));
      console.log(chalk.magenta('='.repeat(60)));
      console.log(chalk.gray(`\nResults saved to: ${this.workflowDir}/`));
      
    } catch (error) {
      console.error(chalk.red(`\n❌ Workflow error: ${error.message}`));
    }
  }

  // Helper methods
  getJsonFiles(dir) {
    const files = [];
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory() && !item.startsWith('.')) {
        files.push(...this.getJsonFiles(fullPath));
      } else if (item.endsWith('.json') && !item.includes('backup')) {
        files.push(fullPath);
      }
    }
    
    return files;
  }

  extractTextFields(obj, path = '') {
    const fields = [];
    
    for (const [key, value] of Object.entries(obj)) {
      const currentPath = path ? `${path}.${key}` : key;
      
      if (typeof value === 'string' && value.length > 20) {
        fields.push({ path: currentPath, text: value });
      } else if (Array.isArray(value)) {
        value.forEach((item, i) => {
          if (typeof item === 'object') {
            fields.push(...this.extractTextFields(item, `${currentPath}[${i}]`));
          }
        });
      } else if (typeof value === 'object' && value !== null) {
        fields.push(...this.extractTextFields(value, currentPath));
      }
    }
    
    return fields;
  }

  applyChange(obj, path, newValue) {
    const parts = path.split(/[\.\[\]]+/).filter(Boolean);
    let current = obj;
    
    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i];
      if (!isNaN(part)) {
        current = current[parseInt(part)];
      } else {
        current = current[part];
      }
    }
    
    const lastPart = parts[parts.length - 1];
    if (!isNaN(lastPart)) {
      current[parseInt(lastPart)] = newValue;
    } else {
      current[lastPart] = newValue;
    }
  }

  detectContentType(path, text) {
    if (path.includes('title') || path.includes('headline')) return 'headline';
    if (path.includes('description')) return 'description';
    if (path.includes('cta')) return 'cta';
    if (text.length < 50) return 'headline';
    return 'general';
  }

  generateAnalysisReport(results) {
    return `# Content Analysis Report
_${new Date(results.timestamp).toLocaleString()}_

## Summary
- Files analyzed: ${results.totalFiles}
- Average score: ${(results.avgScore * 100).toFixed(1)}%

## Files Needing Improvement
${results.files
  .filter(f => f.score < 0.5)
  .map(f => `- ${f.file}: ${(f.score * 100).toFixed(1)}% (${f.issues.length} issues)`)
  .join('\n')}
`;
  }

  generateRecommendationsReport(improvements) {
    return `# AI Recommendations Report
_Generated: ${new Date().toLocaleString()}_

## Summary
- Total recommendations: ${improvements.length}
- Average improvement: ${(improvements.reduce((sum, i) => sum + i.scoreImprovement, 0) / improvements.length).toFixed(1)}%

## Top Improvements
${improvements.slice(0, 10).map(imp => `
### ${imp.file} → ${imp.fieldPath}
**Improvement: +${imp.scoreImprovement}%**

Original:
> ${imp.original}

Recommended:
> ${imp.improved}

Reasoning: ${imp.reasoning || 'N/A'}
`).join('\n')}
`;
  }

  generatePreviewReport(improvements) {
    const html = `<!DOCTYPE html>
<html>
<head>
  <title>Content Improvement Preview</title>
  <style>
    body { font-family: -apple-system, sans-serif; max-width: 1200px; margin: 0 auto; padding: 2rem; }
    .improvement { border: 1px solid #ddd; padding: 1rem; margin: 1rem 0; border-radius: 8px; }
    .original { background: #fee; padding: 0.5rem; }
    .improved { background: #efe; padding: 0.5rem; }
    .score { color: #0a0; font-weight: bold; }
  </style>
</head>
<body>
  <h1>Content Improvement Preview</h1>
  <p>${improvements.length} improvements ready for review</p>
  ${improvements.map(imp => `
    <div class="improvement">
      <h3>${imp.file} → ${imp.fieldPath}</h3>
      <div class="original">Original: ${imp.original}</div>
      <div class="improved">Improved: ${imp.improved}</div>
      <div class="score">Score improvement: +${imp.scoreImprovement}%</div>
    </div>
  `).join('')}
</body>
</html>`;
    
    fs.writeFileSync(path.join(this.workflowDir, 'preview.html'), html);
  }

  generateFinalReport(before, after) {
    return `# Final Workflow Report
_${new Date().toLocaleString()}_

## Results
- **Before**: ${(before.avgScore * 100).toFixed(1)}%
- **After**: ${(after.avgScore * 100).toFixed(1)}%
- **Improvement**: +${((after.avgScore - before.avgScore) * 100).toFixed(1)}%

## Changes Applied
- Files updated: ${new Set(this.approvedChanges.map(c => c.file)).size}
- Total changes: ${this.approvedChanges.length}

## Next Steps
1. Review the updated content on your website
2. Test with real users
3. Monitor engagement metrics
4. Continue iterating based on results
`;
  }
}

// CLI usage
if (process.argv[1]?.endsWith('integrated_workflow.js')) {
  const workflow = new IntegratedWorkflow();
  const command = process.argv[2];
  
  if (!command || command === '--help') {
    console.log(`
🔄 Integrated Content Workflow

Commands:
  full        Run complete workflow (analyze → recommend → review → implement)
  analyze     Step 1: Analyze current content
  recommend   Step 2: Get AI recommendations
  review      Step 3: Review and approve changes
  implement   Step 4: Apply changes to files
  validate    Step 5: Validate results
  
Example:
  node integrated_workflow.js full
  node integrated_workflow.js analyze
  node integrated_workflow.js recommend
    `);
    process.exit(0);
  }
  
  (async () => {
    try {
      switch (command) {
        case 'full':
          await workflow.runCompleteWorkflow();
          break;
        case 'analyze':
          await workflow.analyze();
          break;
        case 'recommend':
          await workflow.recommend();
          break;
        case 'review':
          await workflow.review();
          break;
        case 'implement':
          await workflow.implement();
          break;
        case 'validate':
          await workflow.validate();
          break;
        default:
          console.error('Unknown command:', command);
      }
    } catch (error) {
      console.error('Error:', error.message);
      process.exit(1);
    }
  })();
}

export default IntegratedWorkflow;