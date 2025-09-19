/**
 * Content Integration Layer
 * 
 * This module provides a bridge between the main Bolt-One-Day website
 * and the content-improver system, enabling seamless content analysis,
 * improvement, and deployment workflows.
 * 
 * @author DesignWorks Bureau
 * @version 1.0.0
 */

import { exec, spawn } from 'child_process';
import { promises as fs } from 'fs';
import path from 'path';
import { promisify } from 'util';
import type { 
  ContentAnalysisResult, 
  ContentIssue, 
  ContentImprovement, 
  ContentWorkflowStatus,
  ContentSection,
  ContentFile as ContentFileType
} from '@/types/content';

const execAsync = promisify(exec);

// Extended types for integration layer
export interface ContentFile extends Omit<ContentFileType, 'data'> {
  path: string;
  section: ContentSection;
  lastModified: Date;
  size: number;
  content?: any;
}

/**
 * Main Content Integration Class
 */
export class ContentIntegration {
  private readonly rootPath: string;
  private readonly contentImproverPath: string;
  private readonly dataPath: string;

  constructor() {
    this.rootPath = process.cwd();
    this.contentImproverPath = path.join(this.rootPath, 'content-improver');
    this.dataPath = path.join(this.rootPath, 'data');
  }

  /**
   * Check if content-improver system is properly installed
   */
  async isContentSystemAvailable(): Promise<boolean> {
    try {
      await fs.access(this.contentImproverPath);
      await fs.access(path.join(this.contentImproverPath, 'package.json'));
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get current workflow status from content-improver system
   */
  async getWorkflowStatus(): Promise<ContentWorkflowStatus> {
    try {
      const { stdout } = await execAsync('npm run status', {
        cwd: this.contentImproverPath
      });

      // Parse the status output (this would need to be adapted based on actual output format)
      return this.parseStatusOutput(stdout);
    } catch (error) {
      throw new Error(`Failed to get workflow status: ${error}`);
    }
  }

  /**
   * Trigger content analysis for all data files
   */
  async analyzeContent(): Promise<ContentAnalysisResult[]> {
    try {
      console.log('🔍 Starting content analysis...');
      
      const { stdout, stderr } = await execAsync('npm run analyze:all', {
        cwd: this.contentImproverPath,
        timeout: 300000 // 5 minutes timeout
      });

      if (stderr) {
        console.warn('Analysis warnings:', stderr);
      }

      return this.parseAnalysisResults(stdout);
    } catch (error) {
      throw new Error(`Content analysis failed: ${error}`);
    }
  }

  /**
   * Trigger content improvements using AI assistant
   */
  async improveContent(): Promise<boolean> {
    try {
      console.log('🤖 Running AI content improvements...');
      
      await execAsync('npm run improve:assistant', {
        cwd: this.contentImproverPath,
        timeout: 600000 // 10 minutes timeout
      });

      return true;
    } catch (error) {
      throw new Error(`Content improvement failed: ${error}`);
    }
  }

  /**
   * Get pending improvements that need review
   */
  async getPendingImprovements(): Promise<ContentImprovement[]> {
    try {
      const improvementsPath = path.join(this.contentImproverPath, 'improvements');
      const files = await fs.readdir(improvementsPath);
      const jsonFiles = files.filter(f => f.endsWith('.json'));

      const improvements: ContentImprovement[] = [];

      for (const file of jsonFiles) {
        const filePath = path.join(improvementsPath, file);
        const content = await fs.readFile(filePath, 'utf-8');
        const data = JSON.parse(content);
        
        if (data.improvements) {
          improvements.push(...data.improvements);
        }
      }

      return improvements.filter(imp => imp.status === 'pending');
    } catch (error) {
      throw new Error(`Failed to get pending improvements: ${error}`);
    }
  }

  /**
   * Apply approved improvements to data files
   */
  async applyImprovements(improvementIds?: string[]): Promise<boolean> {
    try {
      console.log('✨ Applying content improvements...');
      
      const command = improvementIds 
        ? `npm run implement -- --ids ${improvementIds.join(',')}`
        : 'npm run implement:approved';

      await execAsync(command, {
        cwd: this.contentImproverPath,
        timeout: 120000 // 2 minutes timeout
      });

      return true;
    } catch (error) {
      throw new Error(`Failed to apply improvements: ${error}`);
    }
  }

  /**
   * Run the complete content workflow (analyze -> improve -> review)
   */
  async runFullWorkflow(): Promise<ContentWorkflowStatus> {
    try {
      console.log('🚀 Running full content workflow...');
      
      await execAsync('npm run workflow', {
        cwd: this.contentImproverPath,
        timeout: 900000 // 15 minutes timeout
      });

      return this.getWorkflowStatus();
    } catch (error) {
      throw new Error(`Full workflow failed: ${error}`);
    }
  }

  /**
   * Open the content review dashboard
   */
  async openReviewDashboard(): Promise<void> {
    try {
      await execAsync('npm run review:dashboard', {
        cwd: this.contentImproverPath
      });
    } catch (error) {
      console.warn('Could not open review dashboard:', error);
    }
  }

  /**
   * Get all content files that can be improved
   */
  async getContentFiles(): Promise<ContentFile[]> {
    const files: ContentFile[] = [];
    
    await this.walkDirectory(this.dataPath, async (filePath, stats) => {
      if (filePath.endsWith('.json')) {
        const relativePath = path.relative(this.rootPath, filePath);
        files.push({
          path: relativePath,
          type: 'json',
          lastModified: stats.mtime,
          size: stats.size
        });
      }
    });

    return files;
  }

  /**
   * Load and parse a specific data file
   */
  async loadDataFile(relativePath: string): Promise<any> {
    try {
      const fullPath = path.join(this.rootPath, relativePath);
      const content = await fs.readFile(fullPath, 'utf-8');
      return JSON.parse(content);
    } catch (error) {
      throw new Error(`Failed to load data file ${relativePath}: ${error}`);
    }
  }

  /**
   * Save data back to a file (with backup)
   */
  async saveDataFile(relativePath: string, data: any, createBackup = true): Promise<void> {
    try {
      const fullPath = path.join(this.rootPath, relativePath);
      
      // Create backup if requested
      if (createBackup) {
        const backupPath = `${fullPath}.backup.${Date.now()}`;
        await fs.copyFile(fullPath, backupPath);
      }

      // Save new content
      const jsonContent = JSON.stringify(data, null, 2);
      await fs.writeFile(fullPath, jsonContent, 'utf-8');
    } catch (error) {
      throw new Error(`Failed to save data file ${relativePath}: ${error}`);
    }
  }

  /**
   * Validate content against brand voice and quality standards
   */
  async validateContent(filePath: string): Promise<ContentIssue[]> {
    try {
      const { stdout } = await execAsync(`npm run test -- --file "${filePath}"`, {
        cwd: this.contentImproverPath
      });

      return this.parseValidationResults(stdout);
    } catch (error) {
      return [{
        type: 'structure',
        severity: 'medium',
        message: `Validation failed for ${filePath}: ${error}`
      }];
    }
  }

  /**
   * Get content improvement history
   */
  async getImprovementHistory(): Promise<any[]> {
    try {
      const { stdout } = await execAsync('npm run history', {
        cwd: this.contentImproverPath
      });

      return this.parseHistoryOutput(stdout);
    } catch (error) {
      throw new Error(`Failed to get improvement history: ${error}`);
    }
  }

  // Private helper methods

  private async walkDirectory(dir: string, callback: (filePath: string, stats: any) => Promise<void>): Promise<void> {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      
      if (entry.isDirectory()) {
        await this.walkDirectory(fullPath, callback);
      } else if (entry.isFile()) {
        const stats = await fs.stat(fullPath);
        await callback(fullPath, stats);
      }
    }
  }

  private parseStatusOutput(output: string): ContentWorkflowStatus {
    // This would need to be implemented based on actual status output format
    const lines = output.split('\n');
    
    return {
      currentStage: 'idle',
      progress: 0,
      filesProcessed: 0,
      totalFiles: 0,
      errors: [],
      lastRun: null,
      nextRecommendedAction: 'Run content analysis'
    };
  }

  private parseAnalysisResults(output: string): ContentAnalysisResult[] {
    // This would parse the actual analysis output
    return [];
  }

  private parseValidationResults(output: string): ContentIssue[] {
    // This would parse validation output into issues
    return [];
  }

  private parseHistoryOutput(output: string): any[] {
    // This would parse the history output
    return [];
  }
}

/**
 * Singleton instance for easy access
 */
export const contentIntegration = new ContentIntegration();

/**
 * Convenience functions for common operations
 */
export const contentOperations = {
  /**
   * Quick health check of the content system
   */
  async healthCheck(): Promise<{ healthy: boolean; message: string }> {
    try {
      const available = await contentIntegration.isContentSystemAvailable();
      if (!available) {
        return { 
          healthy: false, 
          message: 'Content-improver system not found or not properly installed' 
        };
      }

      const status = await contentIntegration.getWorkflowStatus();
      return { 
        healthy: true, 
        message: `System healthy. Current stage: ${status.currentStage}` 
      };
    } catch (error) {
      return { 
        healthy: false, 
        message: `Health check failed: ${error}` 
      };
    }
  },

  /**
   * Run a quick content quality check
   */
  async quickQualityCheck(): Promise<{ score: number; issues: ContentIssue[] }> {
    try {
      const files = await contentIntegration.getContentFiles();
      const issues: ContentIssue[] = [];
      
      // Sample a few key files for quick check
      const keyFiles = files.filter(f => 
        f.path.includes('hero.json') || 
        f.path.includes('services.json') ||
        f.path.includes('pricing.json')
      );

      for (const file of keyFiles.slice(0, 3)) {
        const fileIssues = await contentIntegration.validateContent(file.path);
        issues.push(...fileIssues);
      }

      const totalIssues = issues.length;
      const criticalIssues = issues.filter(i => i.severity === 'critical').length;
      const highIssues = issues.filter(i => i.severity === 'high').length;
      
      // Calculate simple quality score
      let score = 100;
      score -= criticalIssues * 25;
      score -= highIssues * 15;
      score -= (totalIssues - criticalIssues - highIssues) * 5;
      score = Math.max(0, Math.min(100, score));

      return { score, issues };
    } catch (error) {
      return { 
        score: 0, 
        issues: [{
          type: 'structure',
          severity: 'critical',
          message: `Quick quality check failed: ${error}`
        }]
      };
    }
  }
};

export default ContentIntegration;