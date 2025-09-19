#!/usr/bin/env node

/**
 * Complete Image Workflow System
 * Orchestrates analysis, generation, and replacement
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import chalk from 'chalk';
import ImageGenerator from './image_generator.js';
import ImageAnalyzer from './image_analyzer.js';
import VisualAssistant from './visual_assistant.js';
import PromptEngineer from './prompt_engineer.js';
import dotenv from 'dotenv';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

class ImageWorkflow {
  constructor() {
    this.generator = new ImageGenerator();
    this.analyzer = new ImageAnalyzer();
    this.promptEngineer = new PromptEngineer();
    
    // Use Visual Assistant if available
    try {
      this.visualAssistant = new VisualAssistant();
      this.useAssistant = true;
    } catch (e) {
      this.useAssistant = false;
    }
    
    this.resultsPath = path.join(__dirname, 'reports', 'image-workflow-results.json');
    this.checkpointPath = path.join(__dirname, 'reports', '.image-workflow-checkpoint.json');
  }
  
  /**
   * Analyze all portfolio images with improvements
   */
  async analyzePortfolio(options = {}) {
    const portfolioDir = path.join(__dirname, '..', 'public', 'images', 'portfolio');
    const files = fs.readdirSync(portfolioDir)
      .filter(f => ['.jpg', '.jpeg', '.png'].includes(path.extname(f)))
      .slice(0, options.limit); // Allow limiting for testing
    
    console.log(chalk.bold.cyan(`\n🎨 Analyzing ${files.length} Portfolio Images\n`));
    console.log(chalk.gray('This will take approximately ' + Math.ceil(files.length * 10 / 60) + ' minutes\n'));
    
    // Check for checkpoint (resume from previous run)
    const checkpoint = this.loadCheckpoint();
    const startIndex = checkpoint ? checkpoint.lastProcessed + 1 : 0;
    
    if (startIndex > 0) {
      console.log(chalk.yellow(`📌 Resuming from image ${startIndex + 1}/${files.length}\n`));
    }
    
    const results = checkpoint ? checkpoint.results : [];
    const errors = [];
    
    // Process in smaller batches to avoid timeout
    const batchSize = options.batchSize || 3;
    
    for (let i = startIndex; i < files.length; i += batchSize) {
      const batch = files.slice(i, Math.min(i + batchSize, files.length));
      console.log(chalk.yellow(`\n📦 Processing batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(files.length/batchSize)}`));
      
      // Process batch in parallel (faster but watch rate limits)
      const batchPromises = batch.map(async (file, index) => {
        const filePath = path.join(portfolioDir, file);
        const imageNum = i + index + 1;
        
        console.log(chalk.cyan(`[${imageNum}/${files.length}] ${file}`));
        
        try {
          // Add slight delay to avoid rate limiting
          await new Promise(resolve => setTimeout(resolve, index * 500));
          
          const analysis = this.useAssistant 
            ? await this.visualAssistant.analyzeImage(filePath, { type: 'portfolio' })
            : await this.analyzer.analyzeImage(filePath, { type: 'portfolio' });
          
          const score = analysis.brandScore || 0;
          const color = score >= 80 ? 'green' : score >= 60 ? 'yellow' : 'red';
          console.log(chalk[color](`  ✓ Score: ${score}/100`));
          
          if (analysis.requiresReplacement) {
            console.log(chalk.red(`  ⚠ Needs replacement`));
          }
          
          return analysis;
          
        } catch (error) {
          console.log(chalk.red(`  ✗ Error: ${error.message}`));
          errors.push({ file, error: error.message });
          return { 
            image: file, 
            brandScore: 0, 
            error: error.message 
          };
        }
      });
      
      // Wait for batch to complete
      const batchResults = await Promise.all(batchPromises);
      results.push(...batchResults);
      
      // Save checkpoint after each batch
      this.saveCheckpoint({
        lastProcessed: i + batch.length - 1,
        results,
        timestamp: new Date().toISOString()
      });
      
      console.log(chalk.green(`  ✓ Batch complete (${results.length}/${files.length} processed)`));
    }
    
    // Clear checkpoint on completion
    this.clearCheckpoint();
    
    // Generate summary
    const summary = this.generateSummary(results);
    
    // Save final results
    const finalReport = {
      portfolio: portfolioDir,
      totalImages: files.length,
      summary,
      results,
      errors,
      timestamp: new Date().toISOString()
    };
    
    this.saveResults(finalReport);
    
    // Display summary
    this.displaySummary(summary);
    
    return finalReport;
  }
  
  /**
   * Generate replacements for low-scoring images
   */
  async generateReplacements(threshold = 60) {
    console.log(chalk.bold.cyan(`\n🎨 Generating Replacements for Low-Scoring Images\n`));
    
    // Load previous analysis
    const analysisPath = this.resultsPath;
    if (!fs.existsSync(analysisPath)) {
      console.log(chalk.red('No analysis found. Run analyze first.'));
      return;
    }
    
    const analysis = JSON.parse(fs.readFileSync(analysisPath, 'utf8'));
    const lowScoring = analysis.results.filter(r => r.brandScore < threshold && !r.error);
    
    if (lowScoring.length === 0) {
      console.log(chalk.green('All images meet brand standards!'));
      return;
    }
    
    console.log(chalk.yellow(`Found ${lowScoring.length} images needing replacement\n`));
    
    // Estimate cost
    const estimatedCost = lowScoring.length * 0.03; // Flux.1 dev cost
    console.log(chalk.cyan(`💰 Estimated cost: $${estimatedCost.toFixed(2)}\n`));
    
    const replacements = [];
    
    for (let i = 0; i < lowScoring.length; i++) {
      const image = lowScoring[i];
      console.log(chalk.yellow(`[${i + 1}/${lowScoring.length}] Generating replacement for: ${image.image}`));
      
      // Use the prompt engineer to create optimal prompt
      const engineeredPrompt = this.promptEngineer.generatePrompt({
        type: 'portfolio',
        category: this.detectCategory(image.image),
        issues: image.criticalIssues || [],
        context: {
          projectName: image.image.replace('.jpg', '').replace(/-/g, ' ')
        }
      });
      
      const prompt = engineeredPrompt.prompt;
      
      try {
        const result = await this.generator.generate(prompt, {
          model: 'flux-dev',
          width: 1200,
          height: 900
        });
        
        replacements.push({
          original: image.image,
          oldScore: image.brandScore,
          generatedUrl: result.images[0],
          prompt: result.prompt,
          cost: result.cost,
          success: true
        });
        
        console.log(chalk.green(`  ✓ Generated successfully ($${result.cost})`));
        
      } catch (error) {
        replacements.push({
          original: image.image,
          oldScore: image.brandScore,
          error: error.message,
          success: false
        });
        console.log(chalk.red(`  ✗ Generation failed: ${error.message}`));
      }
      
      // Delay between generations
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    // Save replacement results
    const replacementReport = {
      threshold,
      totalImages: lowScoring.length,
      successful: replacements.filter(r => r.success).length,
      failed: replacements.filter(r => !r.success).length,
      totalCost: replacements.reduce((sum, r) => sum + (r.cost || 0), 0),
      replacements,
      timestamp: new Date().toISOString()
    };
    
    const outputPath = path.join(__dirname, 'reports', 'replacement-results.json');
    fs.writeFileSync(outputPath, JSON.stringify(replacementReport, null, 2));
    
    console.log(chalk.bold.green(`\n✅ Replacement Complete!`));
    console.log(chalk.white(`  Generated: ${replacementReport.successful}/${replacementReport.totalImages}`));
    console.log(chalk.white(`  Total cost: $${replacementReport.totalCost.toFixed(2)}`));
    console.log(chalk.white(`  Results saved to: ${outputPath}`));
    
    return replacementReport;
  }
  
  /**
   * Quick analysis with progress saving
   */
  async quickAnalyze(limit = 3) {
    console.log(chalk.bold.cyan(`\n⚡ Quick Analysis (${limit} images)\n`));
    return this.analyzePortfolio({ limit, batchSize: limit });
  }
  
  /**
   * Detect category from filename
   */
  detectCategory(filename) {
    const categories = {
      'dashboard': 'SaaS dashboard',
      'ecommerce': 'e-commerce',
      'portfolio': 'portfolio website',
      'platform': 'web platform',
      'marketplace': 'online marketplace',
      'campaign': 'marketing campaign',
      'rebrand': 'brand identity',
      'app': 'mobile app'
    };
    
    for (const [key, value] of Object.entries(categories)) {
      if (filename.toLowerCase().includes(key)) {
        return value;
      }
    }
    
    return 'web design';
  }
  
  /**
   * Progress checkpoint management
   */
  saveCheckpoint(data) {
    fs.writeFileSync(this.checkpointPath, JSON.stringify(data, null, 2));
  }
  
  loadCheckpoint() {
    if (fs.existsSync(this.checkpointPath)) {
      return JSON.parse(fs.readFileSync(this.checkpointPath, 'utf8'));
    }
    return null;
  }
  
  clearCheckpoint() {
    if (fs.existsSync(this.checkpointPath)) {
      fs.unlinkSync(this.checkpointPath);
    }
  }
  
  /**
   * Generate analysis summary
   */
  generateSummary(results) {
    const validResults = results.filter(r => !r.error);
    const scores = validResults.map(r => r.brandScore || 0);
    
    return {
      totalAnalyzed: results.length,
      successful: validResults.length,
      failed: results.length - validResults.length,
      averageScore: scores.length > 0 
        ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
        : 0,
      distribution: {
        excellent: scores.filter(s => s >= 80).length,
        good: scores.filter(s => s >= 60 && s < 80).length,
        poor: scores.filter(s => s < 60).length
      },
      needsReplacement: validResults.filter(r => r.requiresReplacement).length
    };
  }
  
  /**
   * Display summary
   */
  displaySummary(summary) {
    console.log(chalk.bold.cyan('\n📊 Analysis Summary\n'));
    console.log(chalk.white(`  Total Images: ${summary.totalAnalyzed}`));
    console.log(chalk.white(`  Average Score: ${summary.averageScore}/100`));
    console.log(chalk.green(`  Excellent (80+): ${summary.distribution.excellent}`));
    console.log(chalk.yellow(`  Good (60-79): ${summary.distribution.good}`));
    console.log(chalk.red(`  Poor (<60): ${summary.distribution.poor}`));
    console.log(chalk.magenta(`  Need Replacement: ${summary.needsReplacement}`));
  }
  
  /**
   * Save results
   */
  saveResults(results) {
    const dir = path.dirname(this.resultsPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    fs.writeFileSync(this.resultsPath, JSON.stringify(results, null, 2));
    console.log(chalk.green(`\n💾 Results saved to: ${this.resultsPath}`));
  }
}

// CLI usage
if (process.argv[1]?.endsWith('image_workflow.js')) {
  const workflow = new ImageWorkflow();
  const command = process.argv[2];
  
  if (!command || command === '--help') {
    console.log(`
🖼️ Image Workflow System

Commands:
  analyze               Analyze all portfolio images
  quick                Quick analysis (3 images)
  generate             Generate replacements for low-scoring
  generate <score>     Generate replacements below score threshold
  full                 Analyze then generate replacements

Options:
  --batch-size <n>     Process n images at a time (default: 3)
  --threshold <n>      Score threshold for replacement (default: 60)

Examples:
  node image_workflow.js analyze
  node image_workflow.js quick
  node image_workflow.js generate 70
  node image_workflow.js full
    `);
    process.exit(0);
  }
  
  (async () => {
    try {
      if (command === 'analyze') {
        await workflow.analyzePortfolio();
        
      } else if (command === 'quick') {
        await workflow.quickAnalyze();
        
      } else if (command === 'generate') {
        const threshold = parseInt(process.argv[3]) || 60;
        await workflow.generateReplacements(threshold);
        
      } else if (command === 'full') {
        console.log(chalk.bold.cyan('🔄 Full Workflow: Analyze → Generate\n'));
        await workflow.analyzePortfolio();
        console.log(chalk.yellow('\n⏸️  Pausing before generation...\n'));
        await new Promise(resolve => setTimeout(resolve, 2000));
        await workflow.generateReplacements();
      }
      
    } catch (error) {
      console.error(chalk.red('\nError:'), error.message);
      process.exit(1);
    }
  })();
}

export default ImageWorkflow;