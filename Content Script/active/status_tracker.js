#!/usr/bin/env node

/**
 * Status Tracker
 * Persistent state management for content improvement system
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import chalk from 'chalk';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

class StatusTracker {
  constructor() {
    this.statusFile = path.join(__dirname, '..', 'status.json');
    this.status = this.loadStatus();
  }

  loadStatus() {
    try {
      if (fs.existsSync(this.statusFile)) {
        return JSON.parse(fs.readFileSync(this.statusFile, 'utf8'));
      }
    } catch (error) {
      console.error(chalk.red('Error loading status file:'), error.message);
    }
    
    return this.initializeStatus();
  }

  initializeStatus() {
    // Sections ordered as they appear on the website
    const sections = [
      'navigation',          // Global element
      'hero',               // Landing page start
      'logoCarousel',
      'services', 
      'solutions',
      'premiumDesignProcess',
      'pricing',
      'testimonials',
      'team',
      'weBelieve',
      'premiumFaq',
      'premiumCta',
      'contact'             // Landing page end
    ];

    const status = {
      version: '1.0.0',
      lastUpdated: new Date().toISOString(),
      sections: {},
      stats: {
        totalSections: sections.length,
        analyzed: 0,
        improved: 0,
        reviewed: 0,
        implemented: 0
      },
      history: []
    };

    sections.forEach(section => {
      status.sections[section] = {
        analyzed: false,
        analyzedAt: null,
        analysisScore: null,
        improved: false,
        improvedAt: null,
        improvementFile: null,
        reviewed: false,
        reviewedAt: null,
        reviewDecision: null, // 'approved', 'rejected', 'partial'
        implemented: false,
        implementedAt: null,
        changes: [],
        notes: ''
      };
    });

    return status;
  }

  save() {
    try {
      this.status.lastUpdated = new Date().toISOString();
      this.updateStats();
      fs.writeFileSync(this.statusFile, JSON.stringify(this.status, null, 2));
      return true;
    } catch (error) {
      console.error(chalk.red('Error saving status:'), error.message);
      return false;
    }
  }

  updateStats() {
    const sections = Object.values(this.status.sections);
    this.status.stats = {
      totalSections: sections.length,
      analyzed: sections.filter(s => s.analyzed).length,
      improved: sections.filter(s => s.improved).length,
      reviewed: sections.filter(s => s.reviewed).length,
      implemented: sections.filter(s => s.implemented).length
    };
  }

  markAnalyzed(section, score = null) {
    if (!this.status.sections[section]) return false;
    
    this.status.sections[section].analyzed = true;
    this.status.sections[section].analyzedAt = new Date().toISOString();
    if (score !== null) {
      this.status.sections[section].analysisScore = score;
    }
    
    this.addHistory('analyzed', section);
    return this.save();
  }

  markImproved(section, improvementFile = null) {
    if (!this.status.sections[section]) return false;
    
    this.status.sections[section].improved = true;
    this.status.sections[section].improvedAt = new Date().toISOString();
    if (improvementFile) {
      this.status.sections[section].improvementFile = improvementFile;
    }
    
    this.addHistory('improved', section);
    return this.save();
  }

  markReviewed(section, decision, changes = []) {
    if (!this.status.sections[section]) return false;
    
    this.status.sections[section].reviewed = true;
    this.status.sections[section].reviewedAt = new Date().toISOString();
    this.status.sections[section].reviewDecision = decision;
    this.status.sections[section].changes = changes;
    
    this.addHistory('reviewed', section, { decision });
    return this.save();
  }

  markImplemented(section) {
    if (!this.status.sections[section]) return false;
    
    this.status.sections[section].implemented = true;
    this.status.sections[section].implementedAt = new Date().toISOString();
    
    this.addHistory('implemented', section);
    return this.save();
  }

  addHistory(action, section, details = {}) {
    this.status.history.unshift({
      timestamp: new Date().toISOString(),
      action,
      section,
      details
    });
    
    // Keep only last 100 history entries
    if (this.status.history.length > 100) {
      this.status.history = this.status.history.slice(0, 100);
    }
  }

  getSectionStatus(section) {
    return this.status.sections[section] || null;
  }

  getPendingSections(stage = 'analyze') {
    const sections = Object.entries(this.status.sections);
    
    switch(stage) {
      case 'analyze':
        return sections.filter(([_, s]) => !s.analyzed).map(([name]) => name);
      case 'improve':
        return sections.filter(([_, s]) => s.analyzed && !s.improved).map(([name]) => name);
      case 'review':
        return sections.filter(([_, s]) => s.improved && !s.reviewed).map(([name]) => name);
      case 'implement':
        return sections.filter(([_, s]) => s.reviewed && s.reviewDecision === 'approved' && !s.implemented).map(([name]) => name);
      default:
        return [];
    }
  }

  getProgress() {
    const stats = this.status.stats;
    const total = stats.totalSections;
    
    return {
      overall: Math.round(((stats.analyzed + stats.improved + stats.reviewed + stats.implemented) / (total * 4)) * 100),
      analyzed: Math.round((stats.analyzed / total) * 100),
      improved: Math.round((stats.improved / total) * 100),
      reviewed: Math.round((stats.reviewed / total) * 100),
      implemented: Math.round((stats.implemented / total) * 100)
    };
  }

  printStatus() {
    console.log(chalk.cyan('\n📊 Content System Status\n'));
    
    const progress = this.getProgress();
    const stats = this.status.stats;
    
    console.log(chalk.white('Overall Progress: ') + this.getProgressBar(progress.overall));
    console.log();
    
    console.log(chalk.gray('Detailed Progress:'));
    console.log(`  Analyzed:    ${this.getProgressBar(progress.analyzed)} ${stats.analyzed}/${stats.totalSections}`);
    console.log(`  Improved:    ${this.getProgressBar(progress.improved)} ${stats.improved}/${stats.totalSections}`);
    console.log(`  Reviewed:    ${this.getProgressBar(progress.reviewed)} ${stats.reviewed}/${stats.totalSections}`);
    console.log(`  Implemented: ${this.getProgressBar(progress.implemented)} ${stats.implemented}/${stats.totalSections}`);
    console.log();
    
    const pending = {
      analyze: this.getPendingSections('analyze'),
      improve: this.getPendingSections('improve'),
      review: this.getPendingSections('review'),
      implement: this.getPendingSections('implement')
    };
    
    if (pending.analyze.length > 0) {
      console.log(chalk.yellow('⏳ Pending Analysis:'), pending.analyze.join(', '));
    }
    if (pending.improve.length > 0) {
      console.log(chalk.yellow('⏳ Pending Improvement:'), pending.improve.join(', '));
    }
    if (pending.review.length > 0) {
      console.log(chalk.yellow('⏳ Pending Review:'), pending.review.join(', '));
    }
    if (pending.implement.length > 0) {
      console.log(chalk.yellow('⏳ Pending Implementation:'), pending.implement.join(', '));
    }
    
    console.log();
    console.log(chalk.gray(`Last updated: ${new Date(this.status.lastUpdated).toLocaleString()}`));
  }

  getProgressBar(percentage) {
    const width = 20;
    const filled = Math.round((percentage / 100) * width);
    const empty = width - filled;
    
    let color = chalk.red;
    if (percentage >= 75) color = chalk.green;
    else if (percentage >= 50) color = chalk.yellow;
    else if (percentage >= 25) color = chalk.magenta;
    
    return color('█'.repeat(filled)) + chalk.gray('░'.repeat(empty)) + ` ${percentage}%`;
  }

  reset() {
    this.status = this.initializeStatus();
    return this.save();
  }

  getSectionIcon(section) {
    const status = this.status.sections[section];
    if (!status) return '❌';
    
    if (status.implemented) return '✅';
    if (status.reviewed) {
      if (status.reviewDecision === 'approved') return '✓';
      if (status.reviewDecision === 'rejected') return '✗';
      return '⚠️';
    }
    if (status.improved) return '🔄';
    if (status.analyzed) return '🔍';
    return '○';
  }

  getNextAction() {
    const pending = {
      analyze: this.getPendingSections('analyze'),
      improve: this.getPendingSections('improve'),
      review: this.getPendingSections('review'),
      implement: this.getPendingSections('implement')
    };
    
    if (pending.analyze.length > 0) {
      return { action: 'analyze', sections: pending.analyze };
    }
    if (pending.improve.length > 0) {
      return { action: 'improve', sections: pending.improve };
    }
    if (pending.review.length > 0) {
      return { action: 'review', sections: pending.review };
    }
    if (pending.implement.length > 0) {
      return { action: 'implement', sections: pending.implement };
    }
    
    return { action: 'complete', sections: [] };
  }
}

// CLI interface if run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const tracker = new StatusTracker();
  const command = process.argv[2];
  
  switch(command) {
    case 'status':
      tracker.printStatus();
      break;
    case 'reset':
      tracker.reset();
      console.log(chalk.green('✅ Status reset successfully'));
      break;
    case 'next':
      const next = tracker.getNextAction();
      if (next.action === 'complete') {
        console.log(chalk.green('🎉 All sections complete!'));
      } else {
        console.log(chalk.cyan(`Next action: ${next.action}`));
        console.log(chalk.gray(`Sections: ${next.sections.join(', ')}`));
      }
      break;
    default:
      console.log(chalk.cyan('Status Tracker Commands:'));
      console.log('  node status_tracker.js status  - Show current status');
      console.log('  node status_tracker.js next    - Show next recommended action');
      console.log('  node status_tracker.js reset   - Reset all status');
  }
}

export default StatusTracker;