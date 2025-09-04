#!/usr/bin/env node

/**
 * Implement Approved Changes
 * Applies approved content improvements to actual website files
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import chalk from 'chalk';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

class ChangeImplementer {
  constructor() {
    this.dataPath = '../data';
    this.improvementsPath = './improvements';
    this.backupPath = './backups';
    
    // Create backup directory
    if (!fs.existsSync(this.backupPath)) {
      fs.mkdirSync(this.backupPath, { recursive: true });
    }
  }
  
  /**
   * Read approved changes
   */
  readApprovedChanges() {
    const approvedFile = path.join(this.improvementsPath, 'approved_changes.json');
    
    if (!fs.existsSync(approvedFile)) {
      console.log(chalk.yellow('\n⚠️  No approved changes found.'));
      console.log(chalk.gray('Please approve changes in the review interface first.\n'));
      return null;
    }
    
    return JSON.parse(fs.readFileSync(approvedFile, 'utf8'));
  }
  
  /**
   * Create backup of original files
   */
  createBackup(files) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupDir = path.join(this.backupPath, `backup-${timestamp}`);
    
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }
    
    console.log(chalk.cyan('\n📦 Creating backup...'));
    
    files.forEach(file => {
      const sourcePath = path.join(this.dataPath, file);
      const backupFilePath = path.join(backupDir, file);
      
      if (fs.existsSync(sourcePath)) {
        fs.copyFileSync(sourcePath, backupFilePath);
        console.log(chalk.gray(`  Backed up: ${file}`));
      }
    });
    
    console.log(chalk.green(`✅ Backup created: ${backupDir}`));
    
    return backupDir;
  }
  
  /**
   * Apply changes to files
   */
  applyChanges(changes) {
    console.log(chalk.cyan('\n🔄 Applying changes...\n'));
    
    // Group changes by file
    const changesByFile = {};
    changes.forEach(change => {
      if (!changesByFile[change.file]) {
        changesByFile[change.file] = [];
      }
      changesByFile[change.file].push(change);
    });
    
    const results = {
      successful: [],
      failed: []
    };
    
    // Apply changes to each file
    for (const [file, fileChanges] of Object.entries(changesByFile)) {
      const filePath = path.join(this.dataPath, file);
      
      try {
        console.log(chalk.yellow(`\n📝 Updating: ${file}`));
        
        // Read current file
        let content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        
        // Apply each change
        fileChanges.forEach(change => {
          console.log(chalk.gray(`  Applying change to: ${change.field}`));
          
          // Navigate to the field and update it
          const updated = this.updateNestedField(content, change.field, change.improved);
          
          if (updated) {
            console.log(chalk.green(`    ✓ Updated successfully`));
          } else {
            console.log(chalk.red(`    ✗ Failed to update field`));
          }
        });
        
        // Save updated content
        fs.writeFileSync(filePath, JSON.stringify(content, null, 2));
        console.log(chalk.green(`✅ Saved: ${file}`));
        
        results.successful.push({
          file,
          changes: fileChanges.length
        });
        
      } catch (error) {
        console.log(chalk.red(`❌ Error updating ${file}: ${error.message}`));
        results.failed.push({
          file,
          error: error.message
        });
      }
    }
    
    return results;
  }
  
  /**
   * Update nested field in JSON object
   */
  updateNestedField(obj, fieldPath, newValue) {
    const parts = fieldPath.split('.');
    let current = obj;
    
    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i];
      
      // Handle array notation
      if (part.includes('[')) {
        const [arrayName, indexStr] = part.split('[');
        const index = parseInt(indexStr.replace(']', ''));
        
        if (!current[arrayName] || !Array.isArray(current[arrayName])) {
          return false;
        }
        
        current = current[arrayName][index];
      } else {
        if (!current[part]) {
          return false;
        }
        current = current[part];
      }
    }
    
    // Set the final value
    const lastPart = parts[parts.length - 1];
    
    if (lastPart.includes('[')) {
      const [arrayName, indexStr] = lastPart.split('[');
      const index = parseInt(indexStr.replace(']', ''));
      
      if (current[arrayName] && Array.isArray(current[arrayName])) {
        current[arrayName][index] = newValue;
        return true;
      }
    } else {
      current[lastPart] = newValue;
      return true;
    }
    
    return false;
  }
  
  /**
   * Generate implementation report
   */
  generateReport(results, backupDir) {
    console.log(chalk.cyan('\n' + '='.repeat(60)));
    console.log(chalk.bold.cyan('IMPLEMENTATION REPORT'));
    console.log(chalk.cyan('='.repeat(60) + '\n'));
    
    console.log(chalk.green(`✅ Successfully Updated: ${results.successful.length} files`));
    results.successful.forEach(item => {
      console.log(chalk.gray(`   • ${item.file} (${item.changes} changes)`));
    });
    
    if (results.failed.length > 0) {
      console.log(chalk.red(`\n❌ Failed: ${results.failed.length} files`));
      results.failed.forEach(item => {
        console.log(chalk.gray(`   • ${item.file}: ${item.error}`));
      });
    }
    
    console.log(chalk.blue(`\n📦 Backup Location: ${backupDir}`));
    console.log(chalk.yellow('\n⚡ Next Steps:'));
    console.log(chalk.gray('   1. Review changes on your website'));
    console.log(chalk.gray('   2. Test functionality'));
    console.log(chalk.gray('   3. If issues, restore from backup'));
    
    console.log(chalk.cyan('\n' + '='.repeat(60) + '\n'));
    
    // Save report
    const reportPath = path.join(this.improvementsPath, 'implementation_report.json');
    fs.writeFileSync(reportPath, JSON.stringify({
      timestamp: new Date().toISOString(),
      results,
      backupDir
    }, null, 2));
    
    return reportPath;
  }
  
  /**
   * Main implementation flow
   */
  async implement() {
    console.log(chalk.bold.cyan('\n🚀 IMPLEMENTING APPROVED CHANGES\n'));
    
    // Read approved changes
    const changes = this.readApprovedChanges();
    if (!changes || changes.length === 0) {
      return;
    }
    
    console.log(chalk.yellow(`Found ${changes.length} approved changes\n`));
    
    // Get unique files
    const files = [...new Set(changes.map(c => c.file))];
    
    // Create backup
    const backupDir = this.createBackup(files);
    
    // Apply changes
    const results = this.applyChanges(changes);
    
    // Generate report
    const reportPath = this.generateReport(results, backupDir);
    
    console.log(chalk.green('✅ Implementation complete!'));
    console.log(chalk.gray(`Report saved: ${reportPath}`));
    
    return results;
  }
  
  /**
   * Rollback to backup
   */
  async rollback(backupDir) {
    console.log(chalk.cyan('\n🔄 Rolling back changes...\n'));
    
    if (!backupDir) {
      // Find latest backup
      const backups = fs.readdirSync(this.backupPath)
        .filter(f => f.startsWith('backup-'))
        .sort()
        .reverse();
      
      if (backups.length === 0) {
        console.log(chalk.red('No backups found'));
        return;
      }
      
      backupDir = path.join(this.backupPath, backups[0]);
    }
    
    console.log(chalk.yellow(`Restoring from: ${backupDir}`));
    
    // Copy files back
    const files = fs.readdirSync(backupDir);
    files.forEach(file => {
      const backupFile = path.join(backupDir, file);
      const targetFile = path.join(this.dataPath, file);
      
      fs.copyFileSync(backupFile, targetFile);
      console.log(chalk.green(`  ✓ Restored: ${file}`));
    });
    
    console.log(chalk.green('\n✅ Rollback complete!'));
  }
}

// CLI execution
if (process.argv[1]?.endsWith('implement_changes.js')) {
  const implementer = new ChangeImplementer();
  const command = process.argv[2];
  
  if (!command || command === 'apply') {
    implementer.implement().catch(console.error);
  } else if (command === 'rollback') {
    implementer.rollback(process.argv[3]).catch(console.error);
  } else if (command === '--help') {
    console.log(`
🚀 Change Implementation Tool

Commands:
  apply       Apply approved changes (default)
  rollback    Rollback to previous version
  --help      Show this help

Usage:
  node implement_changes.js [apply]
  node implement_changes.js rollback [backup-dir]
  
  npm run implement:changes
  npm run rollback:changes
    `);
  }
}

export default ChangeImplementer;