#!/usr/bin/env node

/**
 * Interactive CLI for Content Improvement System
 * Main entry point for all operations
 */

import chalk from 'chalk';
import readline from 'readline';
import StatusTracker from '../core/status_tracker.js';
import WorkflowManager from '../core/workflow_manager.js';

class ContentCLI {
  constructor() {
    this.tracker = new StatusTracker();
    this.manager = new WorkflowManager();
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    this.currentMenu = 'main';
  }

  async start() {
    console.clear();
    this.showHeader();
    await this.showMainMenu();
  }

  showHeader() {
    console.log(chalk.cyan.bold(`
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║     🚀 Content Improvement System                         ║
║        DesignWorks Bureau                                 ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
    `));
  }

  async showMainMenu() {
    this.tracker.printStatus();
    console.log();
    
    const next = this.tracker.getNextAction();
    
    console.log(chalk.cyan.bold('📋 Main Menu\n'));
    
    // Show recommended action
    if (next.action !== 'complete') {
      console.log(chalk.green(`💡 Recommended: ${this.getActionDescription(next.action)} (${next.sections.length} sections)\n`));
    }
    
    const options = [
      '1. View Status Overview',
      '2. Run Full Workflow',
      '3. Analyze Sections',
      '4. Improve Sections',
      '5. Review Improvements',
      '6. Implement Approved Changes',
      '7. Continue Workflow',
      '8. View History',
      '9. Settings',
      '0. Exit'
    ];
    
    options.forEach(opt => console.log(chalk.white(opt)));
    console.log();
    
    const answer = await this.prompt(chalk.cyan('Select option: '));
    
    switch(answer) {
      case '1':
        await this.showStatusDetail();
        break;
      case '2':
        await this.runFullWorkflow();
        break;
      case '3':
        await this.analyzeMenu();
        break;
      case '4':
        await this.improveMenu();
        break;
      case '5':
        await this.reviewMenu();
        break;
      case '6':
        await this.implementMenu();
        break;
      case '7':
        await this.continueWorkflow();
        break;
      case '8':
        await this.showHistory();
        break;
      case '9':
        await this.showSettings();
        break;
      case '0':
        this.exit();
        break;
      default:
        console.log(chalk.red('Invalid option'));
        await this.pause();
        await this.showMainMenu();
    }
  }

  async showStatusDetail() {
    console.clear();
    console.log(chalk.cyan.bold('\n📊 Detailed Status\n'));
    
    const sections = Object.entries(this.tracker.status.sections);
    
    // Group by status
    const groups = {
      completed: sections.filter(([_, s]) => s.implemented),
      approved: sections.filter(([_, s]) => s.reviewed && s.reviewDecision === 'approved' && !s.implemented),
      reviewed: sections.filter(([_, s]) => s.reviewed && s.reviewDecision !== 'approved'),
      improved: sections.filter(([_, s]) => s.improved && !s.reviewed),
      analyzed: sections.filter(([_, s]) => s.analyzed && !s.improved),
      pending: sections.filter(([_, s]) => !s.analyzed)
    };
    
    if (groups.completed.length > 0) {
      console.log(chalk.green.bold('✅ Completed:'));
      groups.completed.forEach(([name]) => {
        console.log(`   ${this.tracker.getSectionIcon(name)} ${this.formatName(name)}`);
      });
      console.log();
    }
    
    if (groups.approved.length > 0) {
      console.log(chalk.blue.bold('✓ Approved (Ready to Implement):'));
      groups.approved.forEach(([name]) => {
        console.log(`   ${this.tracker.getSectionIcon(name)} ${this.formatName(name)}`);
      });
      console.log();
    }
    
    if (groups.reviewed.length > 0) {
      console.log(chalk.yellow.bold('⚠️ Reviewed (Rejected/Partial):'));
      groups.reviewed.forEach(([name, status]) => {
        console.log(`   ${this.tracker.getSectionIcon(name)} ${this.formatName(name)} (${status.reviewDecision})`);
      });
      console.log();
    }
    
    if (groups.improved.length > 0) {
      console.log(chalk.cyan.bold('🔄 Improved (Pending Review):'));
      groups.improved.forEach(([name]) => {
        console.log(`   ${this.tracker.getSectionIcon(name)} ${this.formatName(name)}`);
      });
      console.log();
    }
    
    if (groups.analyzed.length > 0) {
      console.log(chalk.magenta.bold('🔍 Analyzed (Pending Improvement):'));
      groups.analyzed.forEach(([name]) => {
        console.log(`   ${this.tracker.getSectionIcon(name)} ${this.formatName(name)}`);
      });
      console.log();
    }
    
    if (groups.pending.length > 0) {
      console.log(chalk.gray.bold('○ Not Started:'));
      groups.pending.forEach(([name]) => {
        console.log(`   ${this.tracker.getSectionIcon(name)} ${this.formatName(name)}`);
      });
      console.log();
    }
    
    await this.pause();
    await this.showMainMenu();
  }

  async analyzeMenu() {
    console.clear();
    console.log(chalk.cyan.bold('\n🔍 Analyze Sections\n'));
    
    const pending = this.tracker.getPendingSections('analyze');
    
    if (pending.length === 0) {
      console.log(chalk.yellow('No sections pending analysis'));
      await this.pause();
      await this.showMainMenu();
      return;
    }
    
    console.log(chalk.white(`Found ${pending.length} sections to analyze:\n`));
    pending.forEach(s => console.log(`  • ${this.formatName(s)}`));
    console.log();
    
    console.log('1. Analyze all pending');
    console.log('2. Select specific sections');
    console.log('3. Back to main menu');
    console.log();
    
    const answer = await this.prompt(chalk.cyan('Select option: '));
    
    switch(answer) {
      case '1':
        await this.manager.analyzeSections();
        break;
      case '2':
        const selected = await this.selectSections(pending);
        if (selected.length > 0) {
          await this.manager.analyzeSections(selected);
        }
        break;
      case '3':
        break;
    }
    
    await this.pause();
    await this.showMainMenu();
  }

  async improveMenu() {
    console.clear();
    console.log(chalk.cyan.bold('\n🚀 Improve Sections\n'));
    
    const pending = this.tracker.getPendingSections('improve');
    
    if (pending.length === 0) {
      console.log(chalk.yellow('No sections pending improvement'));
      console.log(chalk.gray('(Sections must be analyzed first)'));
      await this.pause();
      await this.showMainMenu();
      return;
    }
    
    console.log(chalk.white(`Found ${pending.length} sections to improve:\n`));
    pending.forEach(s => console.log(`  • ${this.formatName(s)}`));
    console.log();
    
    console.log('1. Improve all pending');
    console.log('2. Select specific sections');
    console.log('3. Back to main menu');
    console.log();
    
    const answer = await this.prompt(chalk.cyan('Select option: '));
    
    switch(answer) {
      case '1':
        await this.manager.improveSections();
        break;
      case '2':
        const selected = await this.selectSections(pending);
        if (selected.length > 0) {
          await this.manager.improveSections(selected);
        }
        break;
      case '3':
        break;
    }
    
    await this.pause();
    await this.showMainMenu();
  }

  async reviewMenu() {
    console.clear();
    console.log(chalk.cyan.bold('\n📋 Review Improvements\n'));
    
    const pending = this.tracker.getPendingSections('review');
    
    if (pending.length === 0) {
      console.log(chalk.yellow('No sections pending review'));
      console.log(chalk.gray('(Sections must be improved first)'));
      await this.pause();
      await this.showMainMenu();
      return;
    }
    
    console.log(chalk.white(`Found ${pending.length} sections to review:\n`));
    pending.forEach(s => console.log(`  • ${this.formatName(s)}`));
    console.log();
    
    console.log('1. Open review dashboard');
    console.log('2. Mark sections as approved');
    console.log('3. Mark sections as rejected');
    console.log('4. Back to main menu');
    console.log();
    
    const answer = await this.prompt(chalk.cyan('Select option: '));
    
    switch(answer) {
      case '1':
        await this.manager.reviewSections();
        break;
      case '2':
        const approved = await this.selectSections(pending);
        for (const section of approved) {
          this.tracker.markReviewed(section, 'approved');
        }
        console.log(chalk.green(`Marked ${approved.length} sections as approved`));
        break;
      case '3':
        const rejected = await this.selectSections(pending);
        for (const section of rejected) {
          this.tracker.markReviewed(section, 'rejected');
        }
        console.log(chalk.red(`Marked ${rejected.length} sections as rejected`));
        break;
      case '4':
        break;
    }
    
    await this.pause();
    await this.showMainMenu();
  }

  async implementMenu() {
    console.clear();
    console.log(chalk.cyan.bold('\n⚡ Implement Changes\n'));
    
    const pending = this.tracker.getPendingSections('implement');
    
    if (pending.length === 0) {
      console.log(chalk.yellow('No approved sections pending implementation'));
      console.log(chalk.gray('(Sections must be reviewed and approved first)'));
      await this.pause();
      await this.showMainMenu();
      return;
    }
    
    console.log(chalk.white(`Found ${pending.length} approved sections:\n`));
    pending.forEach(s => console.log(`  • ${this.formatName(s)}`));
    console.log();
    
    console.log('1. Implement all approved');
    console.log('2. Select specific sections');
    console.log('3. Back to main menu');
    console.log();
    
    const answer = await this.prompt(chalk.cyan('Select option: '));
    
    switch(answer) {
      case '1':
        await this.manager.implementSections();
        break;
      case '2':
        const selected = await this.selectSections(pending);
        if (selected.length > 0) {
          await this.manager.implementSections(selected);
        }
        break;
      case '3':
        break;
    }
    
    await this.pause();
    await this.showMainMenu();
  }

  async runFullWorkflow() {
    console.clear();
    console.log(chalk.cyan.bold('\n🎯 Running Full Workflow\n'));
    console.log(chalk.gray('This will process all pending sections through each stage\n'));
    
    const confirm = await this.prompt(chalk.yellow('Continue? (y/n): '));
    
    if (confirm.toLowerCase() === 'y') {
      await this.manager.runFullWorkflow();
    }
    
    await this.pause();
    await this.showMainMenu();
  }

  async continueWorkflow() {
    console.clear();
    await this.manager.continueWorkflow();
    await this.pause();
    await this.showMainMenu();
  }

  async showHistory() {
    console.clear();
    console.log(chalk.cyan.bold('\n📜 Recent History\n'));
    
    const history = this.tracker.status.history.slice(0, 20);
    
    if (history.length === 0) {
      console.log(chalk.gray('No history available'));
    } else {
      history.forEach(entry => {
        const time = new Date(entry.timestamp).toLocaleString();
        const icon = this.getActionIcon(entry.action);
        console.log(`${chalk.gray(time)} ${icon} ${entry.action} ${this.formatName(entry.section)}`);
      });
    }
    
    await this.pause();
    await this.showMainMenu();
  }

  async showSettings() {
    console.clear();
    console.log(chalk.cyan.bold('\n⚙️ Settings\n'));
    
    console.log('1. Reset all status');
    console.log('2. Clear improvements folder');
    console.log('3. Back to main menu');
    console.log();
    
    const answer = await this.prompt(chalk.cyan('Select option: '));
    
    switch(answer) {
      case '1':
        const confirm = await this.prompt(chalk.red('Are you sure? This will reset all progress (y/n): '));
        if (confirm.toLowerCase() === 'y') {
          this.tracker.reset();
          console.log(chalk.green('Status reset successfully'));
        }
        break;
      case '2':
        console.log(chalk.yellow('Feature coming soon...'));
        break;
      case '3':
        break;
    }
    
    await this.pause();
    await this.showMainMenu();
  }

  async selectSections(sections) {
    console.log(chalk.cyan('\nSelect sections (comma-separated numbers):\n'));
    
    sections.forEach((s, i) => {
      console.log(`  ${i + 1}. ${this.formatName(s)}`);
    });
    console.log();
    
    const answer = await this.prompt(chalk.cyan('Selection: '));
    
    try {
      const indices = answer.split(',').map(n => parseInt(n.trim()) - 1);
      return indices.filter(i => i >= 0 && i < sections.length).map(i => sections[i]);
    } catch {
      return [];
    }
  }

  formatName(name) {
    return name
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim();
  }

  getActionDescription(action) {
    const descriptions = {
      analyze: 'Analyze sections for brand voice',
      improve: 'Generate AI improvements',
      review: 'Review and approve changes',
      implement: 'Apply approved changes',
      complete: 'All complete!'
    };
    return descriptions[action] || action;
  }

  getActionIcon(action) {
    const icons = {
      analyzed: '🔍',
      improved: '🚀',
      reviewed: '📋',
      implemented: '✅'
    };
    return icons[action] || '•';
  }

  prompt(question) {
    return new Promise(resolve => {
      this.rl.question(question, answer => {
        resolve(answer);
      });
    });
  }

  async pause() {
    await this.prompt(chalk.gray('\nPress Enter to continue...'));
  }

  exit() {
    console.log(chalk.cyan('\n👋 Goodbye!\n'));
    this.rl.close();
    process.exit(0);
  }
}

// Start CLI
const cli = new ContentCLI();
cli.start().catch(error => {
  console.error(chalk.red('Error:'), error.message);
  process.exit(1);
});