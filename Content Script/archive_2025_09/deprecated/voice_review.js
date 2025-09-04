import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import readline from 'readline';
import chalk from 'chalk';
import BrandVoiceValidator from './brand_voice_validator.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class VoiceReviewSystem {
  constructor(options = {}) {
    this.validator = new BrandVoiceValidator();
    this.rl = null;
    this.approvedChanges = [];
    this.rejectedChanges = [];
    this.pendingChanges = [];
    this.potentialChanges = [];
    this.changeHistory = this.loadChangeHistory();
    this.threshold = options.threshold || 0.5; // Lower default threshold
    this.aggressive = options.aggressive || false;
    this.reportDir = './reports';
    this.ensureReportDir();
  }

  ensureReportDir() {
    if (!fs.existsSync(this.reportDir)) {
      fs.mkdirSync(this.reportDir, { recursive: true });
    }
  }

  loadChangeHistory() {
    const historyPath = path.join(__dirname, 'approved_changes.json');
    if (fs.existsSync(historyPath)) {
      return JSON.parse(fs.readFileSync(historyPath, 'utf8'));
    }
    return {
      sessions: [],
      totalApproved: 0,
      totalRejected: 0,
      lastReviewDate: null
    };
  }

  saveChangeHistory() {
    const historyPath = path.join(__dirname, 'approved_changes.json');
    this.changeHistory.sessions.push({
      date: new Date().toISOString(),
      approved: this.approvedChanges.length,
      rejected: this.rejectedChanges.length,
      changes: this.approvedChanges
    });
    this.changeHistory.totalApproved += this.approvedChanges.length;
    this.changeHistory.totalRejected += this.rejectedChanges.length;
    this.changeHistory.lastReviewDate = new Date().toISOString();
    
    fs.writeFileSync(historyPath, JSON.stringify(this.changeHistory, null, 2));
  }

  async reviewFile(filePath, options = {}) {
    const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const changes = [];
    
    // Analyze each text field in the content
    this.analyzeObject(content, '', changes, filePath);
    
    if (changes.length === 0) {
      console.log(chalk.green(`✓ No voice improvements needed for ${path.basename(filePath)}`));
      return { approved: [], rejected: [], noChanges: true };
    }

    console.log(chalk.yellow(`\n📝 Found ${changes.length} potential improvements in ${path.basename(filePath)}\n`));
    
    if (options.preview) {
      return this.previewChanges(changes);
    }
    
    if (options.interactive) {
      return await this.interactiveReview(changes, filePath);
    }
    
    return { changes, approved: changes, rejected: [] };
  }

  analyzeObject(obj, path, changes, filePath) {
    for (const [key, value] of Object.entries(obj)) {
      const currentPath = path ? `${path}.${key}` : key;
      
      if (typeof value === 'string' && value.length > 20) {
        const validation = this.validator.validateContent(value);
        if (validation.scores.overall < this.threshold) {
          const improvedText = this.improveText(value, validation);
          if (improvedText !== value) {
            const improvedValidation = this.validator.validateContent(improvedText);
            const reasons = this.getImprovementReasons(validation, improvedValidation);
            
            changes.push({
              file: filePath,
              path: currentPath,
              original: value,
              improved: improvedText,
              reason: reasons.join(', ') || 'General improvements',
              score: {
                before: validation.scores.overall,
                after: improvedValidation.scores.overall
              }
            });
          }
        }
      } else if (Array.isArray(value)) {
        value.forEach((item, index) => {
          if (typeof item === 'object') {
            this.analyzeObject(item, `${currentPath}[${index}]`, changes, filePath);
          } else if (typeof item === 'string' && item.length > 20) {
            const validation = this.validator.validateContent(item);
            if (validation.scores.overall < this.threshold) {
              const improvedText = this.improveText(item, validation);
              if (improvedText !== item) {
                const improvedValidation = this.validator.validateContent(improvedText);
                const reasons = this.getImprovementReasons(validation, improvedValidation);
                
                changes.push({
                  file: filePath,
                  path: `${currentPath}[${index}]`,
                  original: item,
                  improved: improvedText,
                  reason: reasons.join(', ') || 'General improvements',
                  score: {
                    before: validation.scores.overall,
                    after: improvedValidation.scores.overall
                  }
                });
              }
            }
          }
        });
      } else if (typeof value === 'object' && value !== null) {
        this.analyzeObject(value, currentPath, changes, filePath);
      }
    }
  }

  // Enhanced text improvement with more aggressive changes
  improveText(text, validation) {
    let improved = this.validator.improveVoice(text);
    
    if (this.aggressive || validation.scores.overall < 0.3) {
      // More aggressive improvements for very low scores
      const originalImproved = improved;
      
      // Add power words intelligently
      if (!validation.scores.powerWords || validation.scores.powerWords < 0.3) {
        const powerWords = ['start', 'build', 'create', 'transform', 'discover', 'achieve'];
        const hasAnyPower = powerWords.some(w => improved.toLowerCase().includes(w));
        
        if (!hasAnyPower && improved.length > 30) {
          // For titles or short text, be more careful
          if (improved.match(/^(The |Your |Our )/i)) {
            // Replace weak starts with stronger ones
            improved = improved.replace(/^The /i, 'Build the ');
            improved = improved.replace(/^Your /i, 'Transform your ');
            improved = improved.replace(/^Our /i, 'Discover our ');
          } else if (improved.match(/^[A-Z]/)) {
            // For imperative sentences, enhance them
            if (improved.match(/^(Get|Find|Choose|Select)/i)) {
              improved = improved.replace(/^Get /i, 'Start getting ');
              improved = improved.replace(/^Find /i, 'Discover ');
              improved = improved.replace(/^Choose /i, 'Build with ');
              improved = improved.replace(/^Select /i, 'Create with ');
            }
          }
        }
      }
      
      // Add human touch if missing
      if (validation.scores.pillars?.human < 0.2) {
        // Add "you" or "we" more naturally
        if (!improved.toLowerCase().includes('we') && !improved.toLowerCase().includes('you') && !improved.toLowerCase().includes('your')) {
          // For descriptions, add personal touch
          if (improved.match(/^[A-Z].*that /)) {
            improved = improved.replace(/ that /, ' that helps you ');
          } else if (improved.match(/^For /i)) {
            // Already has "For" which is personal enough
          } else if (improved.includes(' is ') || improved.includes(' are ')) {
            // Add "we" for statements
            improved = improved.replace(/^(\w+) is /, 'We believe $1 is ');
            improved = improved.replace(/^(\w+) are /, 'We know $1 are ');
          }
        }
      }
      
      // Ensure proper ending
      if (!improved.match(/[.!?]\s*$/)) {
        improved = improved.trim() + '.';
      }
      
      // Don't make it worse - revert if the change is nonsensical
      if (improved.includes('Start building building') || 
          improved.includes('Start building-') ||
          improved.match(/Start building \d/) ||
          improved.length < originalImproved.length / 2) {
        improved = originalImproved;
      }
    }
    
    return improved;
  }
  
  // Get detailed improvement reasons
  getImprovementReasons(before, after) {
    const reasons = [];
    
    if (before.scores.jargon?.found?.length > 0) {
      const jargonRemoved = before.scores.jargon.found.filter(
        j => !after.scores.jargon?.found?.includes(j)
      );
      if (jargonRemoved.length > 0) {
        reasons.push(`Removed jargon: ${jargonRemoved.join(', ')}`);
      }
    }
    
    // Check pillar improvements
    if (before.scores.pillars && after.scores.pillars) {
      const improvedPillars = [];
      for (const [pillar, score] of Object.entries(after.scores.pillars)) {
        if (score > (before.scores.pillars[pillar] || 0)) {
          improvedPillars.push(pillar);
        }
      }
      if (improvedPillars.length > 0) {
        reasons.push(`Improved ${improvedPillars.join(', ')} pillars`);
      }
    }
    
    if (after.scores.overall > before.scores.overall + 0.05) {
      reasons.push(`Voice score +${((after.scores.overall - before.scores.overall) * 100).toFixed(0)}%`);
    }
    
    return reasons.length > 0 ? reasons : ['General voice improvements'];
  }

  previewChanges(changes) {
    console.log(chalk.cyan('\n📋 Preview Mode - Showing All Proposed Changes:\n'));
    
    changes.forEach((change, index) => {
      console.log(chalk.white(`\n[${index + 1}/${changes.length}] ${chalk.yellow(change.path)}`));
      console.log(chalk.gray('─'.repeat(60)));
      console.log(chalk.red('- Original:'));
      console.log('  ' + this.truncateText(change.original, 100));
      console.log(chalk.green('+ Improved:'));
      console.log('  ' + this.truncateText(change.improved, 100));
      console.log(chalk.blue(`📊 Score: ${(change.score.before * 100).toFixed(1)}% → ${(change.score.after * 100).toFixed(1)}%`));
      console.log(chalk.gray(`💡 Reasons: ${Array.isArray(change.reason) ? change.reason.join(', ') : change.reason}`));
    });
    
    // Generate detailed reports
    this.generatePreviewReports(changes);
    
    console.log(chalk.cyan('\n✨ Preview complete. Use --interactive flag to approve/reject changes.\n'));
    console.log(chalk.gray('📄 Detailed reports saved to reports/voice_preview.html and reports/voice_preview.md\n'));
    
    return { changes, previewed: true };
  }
  
  // Generate HTML and Markdown preview reports
  generatePreviewReports(changes) {
    const timestamp = new Date().toISOString();
    const groupedByFile = {};
    
    // Group changes by file
    changes.forEach(change => {
      if (!groupedByFile[change.file]) {
        groupedByFile[change.file] = [];
      }
      groupedByFile[change.file].push(change);
    });
    
    // Generate HTML report
    const htmlReport = this.generateHTMLPreviewReport(groupedByFile, timestamp);
    fs.writeFileSync(path.join(this.reportDir, 'voice_preview.html'), htmlReport);
    
    // Generate Markdown report
    const mdReport = this.generateMarkdownPreviewReport(groupedByFile, timestamp);
    fs.writeFileSync(path.join(this.reportDir, 'voice_preview.md'), mdReport);
  }
  
  generateHTMLPreviewReport(groupedChanges, timestamp) {
    const totalChanges = Object.values(groupedChanges).flat().length;
    const avgImprovement = Object.values(groupedChanges).flat()
      .reduce((sum, c) => sum + (c.score.after - c.score.before), 0) / totalChanges * 100;
    
    let html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Voice Improvement Preview - ${new Date(timestamp).toLocaleDateString()}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
            background: #f5f5f5;
            padding: 2rem;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            overflow: hidden;
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 2rem;
            text-align: center;
        }
        h1 { font-size: 2rem; margin-bottom: 0.5rem; }
        .summary {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1rem;
            padding: 2rem;
            background: #f9f9f9;
        }
        .metric {
            background: white;
            padding: 1rem;
            border-radius: 4px;
            text-align: center;
        }
        .metric-value {
            font-size: 2rem;
            font-weight: bold;
            color: #667eea;
        }
        .metric-label {
            font-size: 0.875rem;
            color: #666;
        }
        .content { padding: 2rem; }
        .file-section {
            margin-bottom: 2rem;
            border: 1px solid #e0e0e0;
            border-radius: 4px;
            overflow: hidden;
        }
        .file-header {
            background: #f5f5f5;
            padding: 1rem;
            font-weight: bold;
            border-bottom: 1px solid #e0e0e0;
        }
        .change {
            padding: 1rem;
            border-bottom: 1px solid #f0f0f0;
        }
        .change:last-child { border-bottom: none; }
        .change-path {
            font-family: monospace;
            font-size: 0.875rem;
            color: #666;
            margin-bottom: 0.5rem;
        }
        .diff {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 1rem;
            margin: 1rem 0;
        }
        .original, .improved {
            padding: 1rem;
            border-radius: 4px;
            font-size: 0.875rem;
        }
        .original {
            background: #fff5f5;
            border: 1px solid #ffcccc;
        }
        .improved {
            background: #f5fff5;
            border: 1px solid #ccffcc;
        }
        .score-change {
            display: inline-block;
            padding: 0.25rem 0.5rem;
            background: #667eea;
            color: white;
            border-radius: 4px;
            font-size: 0.875rem;
        }
        .reasons {
            font-size: 0.875rem;
            color: #666;
            margin-top: 0.5rem;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎯 Brand Voice Improvement Preview</h1>
            <p>${new Date(timestamp).toLocaleString()}</p>
        </div>
        
        <div class="summary">
            <div class="metric">
                <div class="metric-value">${totalChanges}</div>
                <div class="metric-label">Total Improvements</div>
            </div>
            <div class="metric">
                <div class="metric-value">${Object.keys(groupedChanges).length}</div>
                <div class="metric-label">Files Affected</div>
            </div>
            <div class="metric">
                <div class="metric-value">+${avgImprovement.toFixed(1)}%</div>
                <div class="metric-label">Avg Score Increase</div>
            </div>
        </div>
        
        <div class="content">
            <h2>Proposed Changes by File</h2>
`;
    
    for (const [file, changes] of Object.entries(groupedChanges)) {
      html += `
            <div class="file-section">
                <div class="file-header">📄 ${path.basename(file)} (${changes.length} changes)</div>
`;
      
      changes.forEach(change => {
        html += `
                <div class="change">
                    <div class="change-path">${change.path}</div>
                    <div class="diff">
                        <div class="original">
                            <strong>Original (${(change.score.before * 100).toFixed(1)}%)</strong><br>
                            ${this.escapeHtml(change.original)}
                        </div>
                        <div class="improved">
                            <strong>Improved (${(change.score.after * 100).toFixed(1)}%)</strong><br>
                            ${this.escapeHtml(change.improved)}
                        </div>
                    </div>
                    <span class="score-change">+${((change.score.after - change.score.before) * 100).toFixed(0)}% improvement</span>
                    <div class="reasons">💡 ${Array.isArray(change.reason) ? change.reason.join(', ') : change.reason}</div>
                </div>
`;
      });
      
      html += `            </div>\n`;
    }
    
    html += `
        </div>
    </div>
</body>
</html>`;
    
    return html;
  }
  
  generateMarkdownPreviewReport(groupedChanges, timestamp) {
    const totalChanges = Object.values(groupedChanges).flat().length;
    const avgImprovement = Object.values(groupedChanges).flat()
      .reduce((sum, c) => sum + (c.score.after - c.score.before), 0) / totalChanges * 100;
    
    let md = `# Brand Voice Improvement Preview
_Generated: ${new Date(timestamp).toLocaleString()}_

## Summary
- **Total Improvements**: ${totalChanges}
- **Files Affected**: ${Object.keys(groupedChanges).length}
- **Average Score Increase**: +${avgImprovement.toFixed(1)}%

---

## Proposed Changes by File
`;
    
    for (const [file, changes] of Object.entries(groupedChanges)) {
      md += `\n### 📄 ${path.basename(file)}\n_${changes.length} improvements proposed_\n\n`;
      
      changes.forEach((change, index) => {
        md += `#### ${index + 1}. ${change.path}\n\n`;
        md += `**Before** (Score: ${(change.score.before * 100).toFixed(1)}%):\n`;
        md += `> ${change.original}\n\n`;
        md += `**After** (Score: ${(change.score.after * 100).toFixed(1)}%):\n`;
        md += `> ${change.improved}\n\n`;
        md += `**Improvement**: +${((change.score.after - change.score.before) * 100).toFixed(0)}%\n`;
        md += `**Reasons**: ${Array.isArray(change.reason) ? change.reason.join(', ') : change.reason}\n\n`;
        md += `---\n\n`;
      });
    }
    
    md += `\n## Next Steps
1. Review the proposed changes above
2. Run \`npm run review\` for interactive approval
3. Or run \`npm run update:voice\` to apply all improvements automatically
`;
    
    return md;
  }
  
  escapeHtml(text) {
    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
  }

  async interactiveReview(changes, filePath) {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    console.log(chalk.cyan('🔍 Interactive Review Mode\n'));
    console.log(chalk.gray('Commands: [y]es, [n]o, [s]kip, [a]ll, [q]uit, [?]help\n'));

    for (let i = 0; i < changes.length; i++) {
      const change = changes[i];
      const response = await this.reviewSingleChange(change, i + 1, changes.length);
      
      switch (response.toLowerCase()) {
        case 'y':
        case 'yes':
          this.approvedChanges.push(change);
          console.log(chalk.green('✓ Approved'));
          break;
        
        case 'n':
        case 'no':
          this.rejectedChanges.push(change);
          console.log(chalk.red('✗ Rejected'));
          break;
        
        case 's':
        case 'skip':
          this.pendingChanges.push(change);
          console.log(chalk.yellow('⟳ Skipped'));
          break;
        
        case 'a':
        case 'all':
          // Approve all remaining changes
          for (let j = i; j < changes.length; j++) {
            this.approvedChanges.push(changes[j]);
          }
          console.log(chalk.green(`✓ Approved all ${changes.length - i} remaining changes`));
          i = changes.length;
          break;
        
        case 'q':
        case 'quit':
          console.log(chalk.yellow('\n⚠️  Review cancelled. No changes applied.'));
          this.rl.close();
          return { approved: [], rejected: [], cancelled: true };
        
        case '?':
        case 'help':
          this.showHelp();
          i--; // Repeat current change
          break;
        
        default:
          console.log(chalk.yellow('Invalid option. Please try again.'));
          i--; // Repeat current change
      }
    }

    this.rl.close();

    // Apply approved changes if any
    if (this.approvedChanges.length > 0) {
      const apply = await this.askQuestion(
        chalk.yellow(`\nApply ${this.approvedChanges.length} approved changes? [y/n]: `)
      );
      
      if (apply.toLowerCase() === 'y' || apply.toLowerCase() === 'yes') {
        await this.applyChanges(filePath);
        this.saveChangeHistory();
        console.log(chalk.green(`\n✓ Successfully applied ${this.approvedChanges.length} changes`));
      } else {
        console.log(chalk.yellow('\n⚠️  Changes reviewed but not applied'));
      }
    }

    // Summary
    console.log(chalk.cyan('\n📊 Review Summary:'));
    console.log(chalk.green(`  ✓ Approved: ${this.approvedChanges.length}`));
    console.log(chalk.red(`  ✗ Rejected: ${this.rejectedChanges.length}`));
    console.log(chalk.yellow(`  ⟳ Skipped: ${this.pendingChanges.length}`));

    return {
      approved: this.approvedChanges,
      rejected: this.rejectedChanges,
      pending: this.pendingChanges
    };
  }

  async reviewSingleChange(change, current, total) {
    console.log(chalk.white(`\n[${current}/${total}] ${chalk.yellow(change.path)}`));
    console.log(chalk.gray('─'.repeat(60)));
    
    // Show full text with diff highlighting
    this.showDiff(change.original, change.improved);
    
    console.log(chalk.blue(`\n📊 Score improvement: ${(change.score.before * 100).toFixed(1)}% → ${(change.score.after * 100).toFixed(1)}%`));
    console.log(chalk.gray(`💡 Improvements: ${change.reason}`));
    
    const response = await this.askQuestion(chalk.cyan('\nApprove this change? [y/n/s/a/q/?]: '));
    return response;
  }

  showDiff(original, improved) {
    const originalLines = original.split('\n');
    const improvedLines = improved.split('\n');
    const maxLines = Math.max(originalLines.length, improvedLines.length);
    
    console.log(chalk.gray('\nChanges:'));
    
    for (let i = 0; i < maxLines; i++) {
      const origLine = originalLines[i] || '';
      const impLine = improvedLines[i] || '';
      
      if (origLine !== impLine) {
        if (origLine) console.log(chalk.red(`- ${origLine}`));
        if (impLine) console.log(chalk.green(`+ ${impLine}`));
      } else if (origLine) {
        console.log(chalk.gray(`  ${origLine}`));
      }
    }
  }

  async applyChanges(filePath) {
    const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    // Create backup
    const backupPath = filePath.replace('.json', '.backup.json');
    fs.writeFileSync(backupPath, JSON.stringify(content, null, 2));
    
    // Apply each approved change
    for (const change of this.approvedChanges) {
      this.applyChange(content, change.path, change.improved);
    }
    
    // Save updated content
    fs.writeFileSync(filePath, JSON.stringify(content, null, 2));
    
    // Save rollback information
    const rollbackPath = path.join(__dirname, 'rollback.json');
    const rollbackInfo = {
      file: filePath,
      backup: backupPath,
      changes: this.approvedChanges,
      timestamp: new Date().toISOString()
    };
    fs.writeFileSync(rollbackPath, JSON.stringify(rollbackInfo, null, 2));
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

  async rollback() {
    const rollbackPath = path.join(__dirname, 'rollback.json');
    
    if (!fs.existsSync(rollbackPath)) {
      console.log(chalk.yellow('⚠️  No rollback information found'));
      return false;
    }
    
    const rollbackInfo = JSON.parse(fs.readFileSync(rollbackPath, 'utf8'));
    
    const confirm = await this.askQuestion(
      chalk.yellow(`\n⚠️  Rollback changes to ${path.basename(rollbackInfo.file)}? [y/n]: `)
    );
    
    if (confirm.toLowerCase() === 'y' || confirm.toLowerCase() === 'yes') {
      // Restore from backup
      const backup = fs.readFileSync(rollbackInfo.backup, 'utf8');
      fs.writeFileSync(rollbackInfo.file, backup);
      
      console.log(chalk.green(`✓ Successfully rolled back ${rollbackInfo.changes.length} changes`));
      
      // Clean up rollback file
      fs.unlinkSync(rollbackPath);
      return true;
    }
    
    console.log(chalk.yellow('Rollback cancelled'));
    return false;
  }

  showHelp() {
    console.log(chalk.cyan('\n📖 Interactive Review Commands:'));
    console.log(chalk.white('  y/yes  - Approve the current change'));
    console.log(chalk.white('  n/no   - Reject the current change'));
    console.log(chalk.white('  s/skip - Skip for now (review later)'));
    console.log(chalk.white('  a/all  - Approve all remaining changes'));
    console.log(chalk.white('  q/quit - Cancel review (no changes applied)'));
    console.log(chalk.white('  ?/help - Show this help message'));
  }

  askQuestion(question) {
    if (!this.rl) {
      this.rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      });
    }
    
    return new Promise((resolve) => {
      this.rl.question(question, (answer) => {
        resolve(answer);
      });
    });
  }

  truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  }

  async reviewMultipleFiles(filePaths, options = {}) {
    const results = {
      files: [],
      totalApproved: 0,
      totalRejected: 0,
      totalPending: 0
    };

    for (const filePath of filePaths) {
      console.log(chalk.cyan(`\n📁 Reviewing ${path.basename(filePath)}...`));
      
      const fileResult = await this.reviewFile(filePath, options);
      
      if (!fileResult.noChanges && !fileResult.cancelled) {
        results.files.push({
          path: filePath,
          approved: fileResult.approved?.length || 0,
          rejected: fileResult.rejected?.length || 0,
          pending: fileResult.pending?.length || 0
        });
        
        results.totalApproved += fileResult.approved?.length || 0;
        results.totalRejected += fileResult.rejected?.length || 0;
        results.totalPending += fileResult.pending?.length || 0;
      }
    }

    // Final summary
    console.log(chalk.cyan('\n📊 Overall Review Summary:'));
    console.log(chalk.white(`  Files reviewed: ${results.files.length}`));
    console.log(chalk.green(`  Total approved: ${results.totalApproved}`));
    console.log(chalk.red(`  Total rejected: ${results.totalRejected}`));
    console.log(chalk.yellow(`  Total pending: ${results.totalPending}`));

    return results;
  }
}

// CLI execution
if (process.argv[1]?.endsWith('voice_review.js')) {
  const args = process.argv.slice(2);
  
  if (args.includes('--help')) {
    console.log(chalk.cyan('\n📝 Voice Review System\n'));
    console.log('Usage: node voice_review.js [options] [file/directory]');
    console.log('\nOptions:');
    console.log('  --preview      Show all proposed changes without applying');
    console.log('  --interactive  Review and approve/reject each change');
    console.log('  --aggressive   Make more aggressive improvements');
    console.log('  --threshold N  Set score threshold (0-1, default 0.5)');
    console.log('  --rollback     Rollback the last set of changes');
    console.log('  --help         Show this help message');
    console.log('\nExamples:');
    console.log('  node voice_review.js --preview ../data/hero.json');
    console.log('  node voice_review.js --preview --aggressive ../data/');
    console.log('  node voice_review.js --interactive --threshold 0.7 ../data/');
    console.log('  node voice_review.js --rollback');
    process.exit(0);
  }
  
  // Parse threshold if provided
  let threshold = 0.5;
  const thresholdIndex = args.indexOf('--threshold');
  if (thresholdIndex !== -1 && args[thresholdIndex + 1]) {
    threshold = parseFloat(args[thresholdIndex + 1]);
  }
  
  const reviewerOptions = {
    threshold,
    aggressive: args.includes('--aggressive')
  };
  
  const reviewer = new VoiceReviewSystem(reviewerOptions);
  
  if (args.includes('--rollback')) {
    reviewer.rollback().then(() => process.exit(0));
  } else {
    const targetPath = args.find(arg => !arg.startsWith('--') && arg !== threshold.toString()) || '../data';
    const options = {
      preview: args.includes('--preview'),
      interactive: args.includes('--interactive')
    };
    
    if (fs.statSync(targetPath).isDirectory()) {
      const files = fs.readdirSync(targetPath)
        .filter(f => f.endsWith('.json'))
        .map(f => path.join(targetPath, f));
      
      reviewer.reviewMultipleFiles(files, options).then(() => {
        if (reviewer.rl) reviewer.rl.close();
        process.exit(0);
      });
    } else {
      reviewer.reviewFile(targetPath, options).then(() => {
        if (reviewer.rl) reviewer.rl.close();
        process.exit(0);
      });
    }
  }
}

export default VoiceReviewSystem;