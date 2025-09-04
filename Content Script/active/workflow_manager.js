#!/usr/bin/env node

/**
 * Workflow Manager
 * Orchestrates all content improvement operations
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import chalk from 'chalk';
import { spawn } from 'child_process';
import StatusTracker from './status_tracker.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

class WorkflowManager {
  constructor() {
    this.tracker = new StatusTracker();
    this.dataPath = path.join(__dirname, '..', '..', 'data');
    this.improvementsPath = path.join(__dirname, '..', 'improvements');
    this.reportsPath = path.join(__dirname, '..', 'reports');
  }

  async runCommand(command, args = []) {
    return new Promise((resolve, reject) => {
      const child = spawn('node', [command, ...args], {
        cwd: path.join(__dirname, '..'),
        stdio: 'pipe'
      });
      
      let output = '';
      let error = '';
      
      child.stdout.on('data', (data) => {
        output += data.toString();
        process.stdout.write(data);
      });
      
      child.stderr.on('data', (data) => {
        error += data.toString();
        process.stderr.write(data);
      });
      
      child.on('close', (code) => {
        if (code !== 0) {
          reject(new Error(`Command failed with code ${code}: ${error}`));
        } else {
          resolve(output);
        }
      });
    });
  }

  async analyzeSections(sections = null) {
    const sectionsToAnalyze = sections || this.tracker.getPendingSections('analyze');
    
    if (sectionsToAnalyze.length === 0) {
      console.log(chalk.yellow('No sections pending analysis'));
      return;
    }
    
    console.log(chalk.cyan(`\n🔍 Analyzing ${sectionsToAnalyze.length} sections...\n`));
    
    for (const section of sectionsToAnalyze) {
      console.log(chalk.white(`Analyzing ${section}...`));
      
      try {
        // Run content analyzer
        const dataFile = path.join(this.dataPath, `${section}.json`);
        if (!fs.existsSync(dataFile)) {
          console.log(chalk.yellow(`  Skipping ${section} - file not found`));
          continue;
        }
        
        await this.runCommand('active/content_analyzer.js', [dataFile]);
        
        // Mark as analyzed
        this.tracker.markAnalyzed(section);
        console.log(chalk.green(`  ✓ ${section} analyzed successfully`));
        
      } catch (error) {
        console.error(chalk.red(`  ✗ Failed to analyze ${section}:`), error.message);
      }
    }
    
    console.log(chalk.green('\n✅ Analysis complete\n'));
    this.tracker.printStatus();
  }

  async improveSections(sections = null) {
    const sectionsToImprove = sections || this.tracker.getPendingSections('improve');
    
    if (sectionsToImprove.length === 0) {
      console.log(chalk.yellow('No sections pending improvement'));
      return;
    }
    
    console.log(chalk.cyan(`\n🚀 Improving ${sectionsToImprove.length} sections...\n`));
    
    for (const section of sectionsToImprove) {
      console.log(chalk.white(`Improving ${section}...`));
      
      try {
        // Run assistant processor
        await this.runCommand('active/assistant_section_processor.js', [section]);
        
        // Mark as improved
        const improvementFile = path.join(this.improvementsPath, `${section}_improvements.json`);
        this.tracker.markImproved(section, improvementFile);
        console.log(chalk.green(`  ✓ ${section} improved successfully`));
        
      } catch (error) {
        console.error(chalk.red(`  ✗ Failed to improve ${section}:`), error.message);
      }
      
      // Add delay between API calls
      await this.delay(2000);
    }
    
    console.log(chalk.green('\n✅ Improvements complete\n'));
    this.tracker.printStatus();
  }

  async reviewSections(sections = null) {
    const sectionsToReview = sections || this.tracker.getPendingSections('review');
    
    if (sectionsToReview.length === 0) {
      console.log(chalk.yellow('No sections pending review'));
      return;
    }
    
    console.log(chalk.cyan(`\n📋 ${sectionsToReview.length} sections ready for review\n`));
    console.log(chalk.gray('Sections: ' + sectionsToReview.join(', ')));
    console.log(chalk.white('\nLaunching review interface...'));
    
    // Generate review dashboard
    await this.generateReviewDashboard(sectionsToReview);
    
    // Open review interface
    const dashboardPath = path.join(this.improvementsPath, 'review_dashboard.html');
    await this.runCommand('/usr/bin/open', [dashboardPath]);
    
    console.log(chalk.green('✅ Review dashboard opened in browser'));
    console.log(chalk.gray('Mark sections as approved/rejected in the interface'));
  }

  async implementSections(sections = null) {
    const sectionsToImplement = sections || this.tracker.getPendingSections('implement');
    
    if (sectionsToImplement.length === 0) {
      console.log(chalk.yellow('No approved sections pending implementation'));
      return;
    }
    
    console.log(chalk.cyan(`\n⚡ Implementing ${sectionsToImplement.length} approved sections...\n`));
    
    for (const section of sectionsToImplement) {
      console.log(chalk.white(`Implementing ${section}...`));
      
      try {
        // Run implementation
        await this.runCommand('active/implement_changes.js', ['apply', section]);
        
        // Mark as implemented
        this.tracker.markImplemented(section);
        console.log(chalk.green(`  ✓ ${section} implemented successfully`));
        
      } catch (error) {
        console.error(chalk.red(`  ✗ Failed to implement ${section}:`), error.message);
      }
    }
    
    console.log(chalk.green('\n✅ Implementation complete\n'));
    this.tracker.printStatus();
  }

  async runFullWorkflow() {
    console.log(chalk.cyan.bold('\n🎯 Running Full Content Improvement Workflow\n'));
    
    // Step 1: Analyze
    const pendingAnalysis = this.tracker.getPendingSections('analyze');
    if (pendingAnalysis.length > 0) {
      await this.analyzeSections();
    }
    
    // Step 2: Improve
    const pendingImprovement = this.tracker.getPendingSections('improve');
    if (pendingImprovement.length > 0) {
      await this.improveSections();
    }
    
    // Step 3: Review
    const pendingReview = this.tracker.getPendingSections('review');
    if (pendingReview.length > 0) {
      await this.reviewSections();
      console.log(chalk.yellow('\n⏸  Workflow paused for review'));
      console.log(chalk.gray('Run "npm run implement:approved" after reviewing'));
      return;
    }
    
    // Step 4: Implement
    const pendingImplementation = this.tracker.getPendingSections('implement');
    if (pendingImplementation.length > 0) {
      await this.implementSections();
    }
    
    console.log(chalk.green.bold('\n🎉 Workflow Complete!\n'));
    this.tracker.printStatus();
  }

  async generateReviewDashboard(sections) {
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Content Review Dashboard</title>
    <style>
        body { 
            font-family: -apple-system, BlinkMacSystemFont, sans-serif;
            background: #f5f5f5;
            margin: 0;
            padding: 20px;
        }
        .container {
            max-width: 1400px;
            margin: 0 auto;
        }
        h1 {
            color: #333;
            border-bottom: 2px solid #667eea;
            padding-bottom: 10px;
        }
        .sections-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 20px;
            margin-top: 30px;
        }
        .section-card {
            background: white;
            border-radius: 8px;
            padding: 20px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            transition: all 0.3s;
        }
        .section-card:hover {
            box-shadow: 0 4px 8px rgba(0,0,0,0.15);
            transform: translateY(-2px);
        }
        .section-title {
            font-size: 18px;
            font-weight: 600;
            color: #333;
            margin-bottom: 10px;
        }
        .section-status {
            display: inline-block;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 12px;
            font-weight: 600;
            margin-bottom: 15px;
        }
        .status-pending { background: #fef3c7; color: #92400e; }
        .status-approved { background: #d1fae5; color: #065f46; }
        .status-rejected { background: #fee2e2; color: #991b1b; }
        .review-actions {
            display: flex;
            gap: 10px;
            margin-top: 15px;
        }
        .btn {
            flex: 1;
            padding: 8px 16px;
            border: none;
            border-radius: 4px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s;
        }
        .btn-approve {
            background: #10b981;
            color: white;
        }
        .btn-approve:hover {
            background: #059669;
        }
        .btn-reject {
            background: #ef4444;
            color: white;
        }
        .btn-reject:hover {
            background: #dc2626;
        }
        .btn-view {
            background: #667eea;
            color: white;
        }
        .btn-view:hover {
            background: #5a67d8;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>📋 Content Review Dashboard</h1>
        <p>Review and approve content improvements for each section</p>
        
        <div class="sections-grid">
            ${sections.map(section => {
                const status = this.tracker.getSectionStatus(section);
                const reviewStatus = status.reviewDecision || 'pending';
                return `
                <div class="section-card">
                    <div class="section-title">${this.formatSectionName(section)}</div>
                    <span class="section-status status-${reviewStatus}">${reviewStatus.toUpperCase()}</span>
                    
                    <div class="section-info">
                        <p>Improved: ${status.improvedAt ? new Date(status.improvedAt).toLocaleDateString() : 'N/A'}</p>
                    </div>
                    
                    <div class="review-actions">
                        <button class="btn btn-view" onclick="viewSection('${section}')">View</button>
                        <button class="btn btn-approve" onclick="approveSection('${section}')">Approve</button>
                        <button class="btn btn-reject" onclick="rejectSection('${section}')">Reject</button>
                    </div>
                </div>
                `;
            }).join('')}
        </div>
    </div>
    
    <script>
        function viewSection(section) {
            window.open('sections/' + section + '_review.html', '_blank');
        }
        
        function approveSection(section) {
            // This would call back to the server to update status
            alert('Approved ' + section + ' (functionality to be implemented with review server)');
            location.reload();
        }
        
        function rejectSection(section) {
            // This would call back to the server to update status
            alert('Rejected ' + section + ' (functionality to be implemented with review server)');
            location.reload();
        }
    </script>
</body>
</html>`;
    
    const dashboardPath = path.join(this.improvementsPath, 'review_dashboard.html');
    fs.writeFileSync(dashboardPath, html);
  }

  formatSectionName(section) {
    return section
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim();
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async continueWorkflow() {
    const next = this.tracker.getNextAction();
    
    if (next.action === 'complete') {
      console.log(chalk.green('🎉 All sections complete!'));
      return;
    }
    
    console.log(chalk.cyan(`\n➡️  Next action: ${next.action}`));
    console.log(chalk.gray(`Sections: ${next.sections.join(', ')}\n`));
    
    switch(next.action) {
      case 'analyze':
        await this.analyzeSections();
        break;
      case 'improve':
        await this.improveSections();
        break;
      case 'review':
        await this.reviewSections();
        break;
      case 'implement':
        await this.implementSections();
        break;
    }
  }
}

// CLI interface if run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const manager = new WorkflowManager();
  const command = process.argv[2];
  
  const run = async () => {
    try {
      switch(command) {
        case 'full':
          await manager.runFullWorkflow();
          break;
        case 'analyze':
          await manager.analyzeSections();
          break;
        case 'improve':
          await manager.improveSections();
          break;
        case 'review':
          await manager.reviewSections();
          break;
        case 'implement':
          await manager.implementSections();
          break;
        case 'continue':
          await manager.continueWorkflow();
          break;
        default:
          console.log(chalk.cyan('Workflow Manager Commands:'));
          console.log('  node workflow_manager.js full      - Run complete workflow');
          console.log('  node workflow_manager.js analyze   - Analyze pending sections');
          console.log('  node workflow_manager.js improve   - Improve analyzed sections');
          console.log('  node workflow_manager.js review    - Review improved sections');
          console.log('  node workflow_manager.js implement - Implement approved sections');
          console.log('  node workflow_manager.js continue  - Continue from last step');
      }
    } catch (error) {
      console.error(chalk.red('Error:'), error.message);
      process.exit(1);
    }
  };
  
  run();
}

export default WorkflowManager;