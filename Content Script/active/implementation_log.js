#!/usr/bin/env node

/**
 * Implementation Log
 * Tracks all changes made to data files with rollback capabilities
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import chalk from 'chalk';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

class ImplementationLog {
  constructor() {
    this.logFile = path.join(__dirname, '..', 'implementation_log.json');
    this.backupDir = path.join(__dirname, '..', 'backups');
    this.log = this.loadLog();
    
    // Ensure backup directory exists
    if (!fs.existsSync(this.backupDir)) {
      fs.mkdirSync(this.backupDir, { recursive: true });
    }
  }

  loadLog() {
    try {
      if (fs.existsSync(this.logFile)) {
        return JSON.parse(fs.readFileSync(this.logFile, 'utf8'));
      }
    } catch (error) {
      console.error(chalk.red('Error loading log file:'), error.message);
    }
    
    return {
      version: '1.0.0',
      entries: [],
      stats: {
        totalChanges: 0,
        totalRollbacks: 0,
        filesModified: new Set(),
        lastChange: null,
        lastRollback: null
      }
    };
  }

  save() {
    try {
      // Convert Set to Array for JSON serialization
      const logToSave = {
        ...this.log,
        stats: {
          ...this.log.stats,
          filesModified: Array.from(this.log.stats.filesModified || [])
        }
      };
      
      fs.writeFileSync(this.logFile, JSON.stringify(logToSave, null, 2));
      return true;
    } catch (error) {
      console.error(chalk.red('Error saving log:'), error.message);
      return false;
    }
  }

  createBackup(filePath) {
    try {
      const fileName = path.basename(filePath);
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const backupName = `${fileName}.${timestamp}.backup`;
      const backupPath = path.join(this.backupDir, backupName);
      
      // Copy file to backup
      fs.copyFileSync(filePath, backupPath);
      
      return backupPath;
    } catch (error) {
      console.error(chalk.red('Error creating backup:'), error.message);
      return null;
    }
  }

  logChange(section, filePath, changes, metadata = {}) {
    // Create backup first
    const backupPath = this.createBackup(filePath);
    
    if (!backupPath) {
      console.error(chalk.red('Failed to create backup, aborting change log'));
      return false;
    }
    
    const entry = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      section,
      filePath,
      backupPath,
      changes: Array.isArray(changes) ? changes : [changes],
      metadata,
      rolledBack: false
    };
    
    this.log.entries.unshift(entry);
    
    // Keep only last 100 entries
    if (this.log.entries.length > 100) {
      this.log.entries = this.log.entries.slice(0, 100);
    }
    
    // Update stats
    this.log.stats.totalChanges++;
    this.log.stats.lastChange = entry.timestamp;
    
    // Handle filesModified as Set
    if (!this.log.stats.filesModified) {
      this.log.stats.filesModified = new Set();
    } else if (Array.isArray(this.log.stats.filesModified)) {
      this.log.stats.filesModified = new Set(this.log.stats.filesModified);
    }
    this.log.stats.filesModified.add(filePath);
    
    return this.save();
  }

  rollback(entryId) {
    const entry = this.log.entries.find(e => e.id === entryId);
    
    if (!entry) {
      console.error(chalk.red('Entry not found:'), entryId);
      return false;
    }
    
    if (entry.rolledBack) {
      console.log(chalk.yellow('Entry already rolled back'));
      return false;
    }
    
    try {
      // Restore from backup
      fs.copyFileSync(entry.backupPath, entry.filePath);
      
      // Mark as rolled back
      entry.rolledBack = true;
      entry.rollbackTimestamp = new Date().toISOString();
      
      // Update stats
      this.log.stats.totalRollbacks++;
      this.log.stats.lastRollback = entry.rollbackTimestamp;
      
      this.save();
      
      console.log(chalk.green(`✅ Rolled back changes to ${path.basename(entry.filePath)}`));
      return true;
      
    } catch (error) {
      console.error(chalk.red('Rollback failed:'), error.message);
      return false;
    }
  }

  rollbackSection(section) {
    const entries = this.log.entries.filter(e => 
      e.section === section && !e.rolledBack
    );
    
    if (entries.length === 0) {
      console.log(chalk.yellow(`No changes to rollback for section: ${section}`));
      return false;
    }
    
    console.log(chalk.cyan(`Rolling back ${entries.length} changes for ${section}...`));
    
    let success = 0;
    for (const entry of entries) {
      if (this.rollback(entry.id)) {
        success++;
      }
    }
    
    console.log(chalk.green(`✅ Rolled back ${success}/${entries.length} changes`));
    return success > 0;
  }

  rollbackAll() {
    const entries = this.log.entries.filter(e => !e.rolledBack);
    
    if (entries.length === 0) {
      console.log(chalk.yellow('No changes to rollback'));
      return false;
    }
    
    console.log(chalk.cyan(`Rolling back ${entries.length} changes...`));
    
    let success = 0;
    for (const entry of entries) {
      if (this.rollback(entry.id)) {
        success++;
      }
    }
    
    console.log(chalk.green(`✅ Rolled back ${success}/${entries.length} changes`));
    return success > 0;
  }

  getHistory(limit = 20) {
    return this.log.entries.slice(0, limit);
  }

  getSectionHistory(section) {
    return this.log.entries.filter(e => e.section === section);
  }

  printHistory(entries = null) {
    const history = entries || this.getHistory();
    
    if (history.length === 0) {
      console.log(chalk.gray('No implementation history'));
      return;
    }
    
    console.log(chalk.cyan('\n📜 Implementation History\n'));
    
    history.forEach(entry => {
      const time = new Date(entry.timestamp).toLocaleString();
      const fileName = path.basename(entry.filePath);
      const status = entry.rolledBack ? chalk.red('[ROLLED BACK]') : chalk.green('[ACTIVE]');
      
      console.log(`${chalk.gray(time)} ${status} ${chalk.white(entry.section)} - ${fileName}`);
      
      if (entry.changes && entry.changes.length > 0) {
        entry.changes.slice(0, 3).forEach(change => {
          if (typeof change === 'string') {
            console.log(`  • ${change.substring(0, 60)}...`);
          } else if (change.path) {
            console.log(`  • ${change.path}: "${change.original}" → "${change.improved}"`);
          }
        });
        
        if (entry.changes.length > 3) {
          console.log(chalk.gray(`  ... and ${entry.changes.length - 3} more changes`));
        }
      }
      
      console.log();
    });
  }

  getDiff(entryId) {
    const entry = this.log.entries.find(e => e.id === entryId);
    
    if (!entry) {
      console.error(chalk.red('Entry not found:'), entryId);
      return null;
    }
    
    try {
      const current = fs.readFileSync(entry.filePath, 'utf8');
      const backup = fs.readFileSync(entry.backupPath, 'utf8');
      
      return {
        current,
        backup,
        changes: entry.changes
      };
    } catch (error) {
      console.error(chalk.red('Error loading diff:'), error.message);
      return null;
    }
  }

  getStats() {
    // Ensure filesModified is a Set
    if (Array.isArray(this.log.stats.filesModified)) {
      this.log.stats.filesModified = new Set(this.log.stats.filesModified);
    }
    
    return {
      ...this.log.stats,
      filesModified: this.log.stats.filesModified ? this.log.stats.filesModified.size : 0,
      activeChanges: this.log.entries.filter(e => !e.rolledBack).length
    };
  }

  printStats() {
    const stats = this.getStats();
    
    console.log(chalk.cyan('\n📊 Implementation Statistics\n'));
    console.log(`Total Changes:    ${chalk.white(stats.totalChanges)}`);
    console.log(`Active Changes:   ${chalk.green(stats.activeChanges)}`);
    console.log(`Total Rollbacks:  ${chalk.yellow(stats.totalRollbacks)}`);
    console.log(`Files Modified:   ${chalk.white(stats.filesModified)}`);
    
    if (stats.lastChange) {
      console.log(`Last Change:      ${chalk.gray(new Date(stats.lastChange).toLocaleString())}`);
    }
    if (stats.lastRollback) {
      console.log(`Last Rollback:    ${chalk.gray(new Date(stats.lastRollback).toLocaleString())}`);
    }
  }

  cleanupOldBackups(daysToKeep = 7) {
    const cutoffTime = Date.now() - (daysToKeep * 24 * 60 * 60 * 1000);
    const backups = fs.readdirSync(this.backupDir);
    
    let deleted = 0;
    for (const backup of backups) {
      const backupPath = path.join(this.backupDir, backup);
      const stats = fs.statSync(backupPath);
      
      if (stats.mtimeMs < cutoffTime) {
        fs.unlinkSync(backupPath);
        deleted++;
      }
    }
    
    if (deleted > 0) {
      console.log(chalk.green(`✅ Cleaned up ${deleted} old backup files`));
    }
    
    return deleted;
  }
}

// CLI interface if run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const log = new ImplementationLog();
  const command = process.argv[2];
  const arg = process.argv[3];
  
  switch(command) {
    case 'history':
      log.printHistory();
      break;
    case 'stats':
      log.printStats();
      break;
    case 'rollback':
      if (arg) {
        log.rollback(arg);
      } else {
        console.log(chalk.red('Please provide entry ID to rollback'));
      }
      break;
    case 'rollback-section':
      if (arg) {
        log.rollbackSection(arg);
      } else {
        console.log(chalk.red('Please provide section name to rollback'));
      }
      break;
    case 'rollback-all':
      const confirm = process.argv[3] === '--confirm';
      if (confirm) {
        log.rollbackAll();
      } else {
        console.log(chalk.yellow('Add --confirm to rollback all changes'));
      }
      break;
    case 'cleanup':
      log.cleanupOldBackups();
      break;
    default:
      console.log(chalk.cyan('Implementation Log Commands:'));
      console.log('  node implementation_log.js history           - Show change history');
      console.log('  node implementation_log.js stats             - Show statistics');
      console.log('  node implementation_log.js rollback [id]     - Rollback specific change');
      console.log('  node implementation_log.js rollback-section [name] - Rollback section changes');
      console.log('  node implementation_log.js rollback-all --confirm  - Rollback all changes');
      console.log('  node implementation_log.js cleanup           - Clean old backups');
  }
}

export default ImplementationLog;