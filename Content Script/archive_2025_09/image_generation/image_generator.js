#!/usr/bin/env node

/**
 * AI-Powered Image Generation System
 * Supports multiple providers with fallback options
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import chalk from 'chalk';
import ReplicateClient from './utils/replicate_client.js';
import dotenv from 'dotenv';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

class ImageGenerator {
  constructor() {
    this.providers = {
      replicate: null,
      openai: null
    };
    
    // Initialize Replicate if token exists
    if (process.env.REPLICATE_API_TOKEN) {
      try {
        this.providers.replicate = new ReplicateClient();
        console.log(chalk.green('✓ Replicate (Flux.1) initialized'));
      } catch (error) {
        console.log(chalk.yellow('⚠ Replicate unavailable:', error.message));
      }
    }
    
    // Initialize OpenAI DALL-E if key exists
    if (process.env.OPENAI_API_KEY) {
      console.log(chalk.green('✓ OpenAI (DALL-E 3) available as fallback'));
    }
    
    this.guidelines = this.loadGuidelines();
  }
  
  /**
   * Generate image with automatic provider selection
   */
  async generate(prompt, options = {}) {
    console.log(chalk.cyan('\n🎨 Starting image generation...'));
    console.log(chalk.gray(`Prompt: ${prompt.substring(0, 100)}...`));
    
    // Try Replicate first (best quality/cost)
    if (this.providers.replicate && options.preferredProvider !== 'openai') {
      try {
        console.log(chalk.yellow('→ Attempting with Flux.1...'));
        const result = await this.providers.replicate.generateImage(prompt, options);
        return { ...result, provider: 'replicate' };
      } catch (error) {
        console.log(chalk.red(`✗ Flux.1 failed: ${error.message}`));
        
        if (error.message.includes('insufficient credit')) {
          console.log(chalk.yellow('💡 Add credits at: https://replicate.com/account/billing'));
        }
      }
    }
    
    // Fallback to OpenAI DALL-E 3
    if (process.env.OPENAI_API_KEY) {
      try {
        console.log(chalk.yellow('→ Falling back to DALL-E 3...'));
        const result = await this.generateWithDallE(prompt, options);
        return { ...result, provider: 'openai' };
      } catch (error) {
        console.log(chalk.red(`✗ DALL-E 3 failed: ${error.message}`));
      }
    }
    
    // If all providers fail, return placeholder info
    console.log(chalk.yellow('⚠ All providers unavailable - returning placeholder'));
    return this.generatePlaceholder(prompt, options);
  }
  
  /**
   * Generate with OpenAI DALL-E 3
   */
  async generateWithDallE(prompt, options = {}) {
    const apiKey = process.env.OPENAI_API_KEY;
    
    const enhancedPrompt = this.enhancePromptForDallE(prompt, options);
    
    const requestBody = {
      model: 'dall-e-3',
      prompt: enhancedPrompt,
      size: options.size || '1024x1024',
      quality: options.quality || 'standard',
      n: 1
    };
    
    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });
    
    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.error.message);
    }
    
    return {
      images: [data.data[0].url],
      prompt: enhancedPrompt,
      revisedPrompt: data.data[0].revised_prompt,
      cost: requestBody.quality === 'hd' ? 0.08 : 0.04,
      provider: 'dall-e-3',
      metadata: {
        size: requestBody.size,
        quality: requestBody.quality
      }
    };
  }
  
  /**
   * Enhance prompt for DALL-E 3
   */
  enhancePromptForDallE(prompt, options = {}) {
    if (options.skipEnhancement) return prompt;
    
    const guidelines = this.guidelines;
    
    // DALL-E 3 specific enhancements
    let enhanced = `${prompt}. Style: ${guidelines.visualIdentity.style.overall}`;
    
    // Add quality modifiers
    enhanced += '. Professional photography, high quality, sharp focus';
    
    // Add brand colors if relevant
    if (!options.skipColors) {
      enhanced += '. Color palette includes #F97316 (orange accent)';
    }
    
    return enhanced;
  }
  
  /**
   * Generate placeholder information
   */
  generatePlaceholder(prompt, options) {
    return {
      images: [`/images/placeholder-${Date.now()}.jpg`],
      prompt: prompt,
      provider: 'placeholder',
      cost: 0,
      metadata: {
        width: options.width || 1024,
        height: options.height || 1024,
        note: 'Placeholder - configure image generation provider'
      }
    };
  }
  
  /**
   * Generate portfolio images for all projects
   */
  async generatePortfolioImages() {
    const projectsDir = path.join(__dirname, '..', 'data', 'portfolio', 'projects');
    const projectFiles = fs.readdirSync(projectsDir).filter(f => f.endsWith('.json'));
    
    console.log(chalk.bold.cyan(`\n📁 Generating images for ${projectFiles.length} portfolio projects\n`));
    
    const results = [];
    
    for (const file of projectFiles) {
      const project = JSON.parse(fs.readFileSync(path.join(projectsDir, file), 'utf8'));
      
      console.log(chalk.yellow(`\n→ ${project.title}`));
      
      // Generate main project image
      const prompt = `${project.category} project showcase: ${project.description}. Modern mockup presentation`;
      
      try {
        const result = await this.generate(prompt, {
          width: 1200,
          height: 900,
          model: 'flux-dev'
        });
        
        results.push({
          project: project.title,
          success: true,
          ...result
        });
        
        console.log(chalk.green(`  ✓ Generated successfully`));
        
      } catch (error) {
        results.push({
          project: project.title,
          success: false,
          error: error.message
        });
        console.log(chalk.red(`  ✗ Failed: ${error.message}`));
      }
      
      // Add delay between generations
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    return results;
  }
  
  /**
   * Generate hero section backgrounds
   */
  async generateHeroBackgrounds(scenes) {
    console.log(chalk.bold.cyan(`\n🖼️ Generating ${scenes.length} hero backgrounds\n`));
    
    const results = [];
    
    for (let i = 0; i < scenes.length; i++) {
      const scene = scenes[i];
      console.log(chalk.yellow(`[${i + 1}/${scenes.length}] ${scene}`));
      
      const prompt = this.guidelines.generationPrompts.heroTemplate.replace('{scene}', scene);
      
      try {
        const result = await this.generate(prompt, {
          width: 1920,
          height: 1080,
          model: 'flux-pro',
          quality: 'hd'
        });
        
        results.push({
          scene,
          success: true,
          ...result
        });
        
      } catch (error) {
        results.push({
          scene,
          success: false,
          error: error.message
        });
      }
    }
    
    return results;
  }
  
  /**
   * Load visual guidelines
   */
  loadGuidelines() {
    const guidelinesPath = path.join(__dirname, 'configs', 'visual_guidelines.json');
    if (fs.existsSync(guidelinesPath)) {
      return JSON.parse(fs.readFileSync(guidelinesPath, 'utf8'));
    }
    return {
      visualIdentity: { style: { overall: 'modern professional' } },
      generationPrompts: { heroTemplate: 'Modern office {scene}' }
    };
  }
  
  /**
   * Save generation results to file
   */
  saveResults(results, outputFile) {
    const outputPath = path.join(__dirname, 'reports', outputFile);
    const outputDir = path.dirname(outputPath);
    
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));
    console.log(chalk.green(`\n💾 Results saved to: ${outputPath}`));
  }
}

// CLI usage
if (process.argv[1]?.endsWith('image_generator.js')) {
  const generator = new ImageGenerator();
  const command = process.argv[2];
  
  if (!command || command === '--help') {
    console.log(`
🎨 AI Image Generator

Commands:
  test <prompt>           Generate a test image
  portfolio              Generate all portfolio images
  hero <scene>           Generate hero background
  batch <file>           Generate from prompts file

Examples:
  node image_generator.js test "modern office space"
  node image_generator.js portfolio
  node image_generator.js hero "team collaboration"

Providers:
  - Replicate (Flux.1): Best quality, needs credits
  - OpenAI (DALL-E 3): Good quality, automatic fallback
  - Placeholder: When all providers unavailable
    `);
    process.exit(0);
  }
  
  (async () => {
    try {
      if (command === 'test') {
        const prompt = process.argv.slice(3).join(' ') || 'Modern minimalist office';
        const result = await generator.generate(prompt);
        console.log('\nResult:', JSON.stringify(result, null, 2));
        
      } else if (command === 'portfolio') {
        const results = await generator.generatePortfolioImages();
        generator.saveResults(results, 'portfolio-generation.json');
        
        const successful = results.filter(r => r.success).length;
        console.log(chalk.bold.green(`\n✅ Generated ${successful}/${results.length} images`));
        
      } else if (command === 'hero') {
        const scene = process.argv.slice(3).join(' ') || 'designers collaborating';
        const results = await generator.generateHeroBackgrounds([scene]);
        console.log('\nResult:', JSON.stringify(results[0], null, 2));
      }
      
    } catch (error) {
      console.error(chalk.red('\nError:'), error.message);
      process.exit(1);
    }
  })();
}

export default ImageGenerator;