#!/usr/bin/env node

/**
 * Replicate API Client for Flux.1 Image Generation
 * Handles connection to Replicate and model management
 */

import Replicate from 'replicate';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../..', '.env.local') });

class ReplicateClient {
  constructor() {
    this.apiToken = process.env.REPLICATE_API_TOKEN;
    
    if (!this.apiToken) {
      throw new Error('REPLICATE_API_TOKEN not found in .env.local');
    }
    
    this.replicate = new Replicate({
      auth: this.apiToken
    });
    
    // Model configurations
    this.models = {
      'flux-schnell': {
        id: 'black-forest-labs/flux-schnell',
        version: null, // Will use latest
        cost: 0.003,
        speed: 'fastest',
        quality: 'good',
        description: 'Fast generation for drafts and testing'
      },
      'flux-dev': {
        id: 'black-forest-labs/flux-dev',
        version: null,
        cost: 0.030,
        speed: 'medium',
        quality: 'excellent',
        description: 'High quality for production images'
      },
      'flux-pro': {
        id: 'black-forest-labs/flux-pro',
        version: null,
        cost: 0.055,
        speed: 'slow',
        quality: 'best',
        description: 'Maximum quality for hero images'
      }
    };
    
    this.defaultModel = 'flux-dev';
  }
  
  /**
   * Generate an image using Flux.1
   */
  async generateImage(prompt, options = {}) {
    const model = options.model || this.defaultModel;
    const modelConfig = this.models[model];
    
    if (!modelConfig) {
      throw new Error(`Unknown model: ${model}`);
    }
    
    console.log(`🎨 Generating with ${model} (${modelConfig.quality} quality)...`);
    
    const input = {
      prompt: this.enhancePrompt(prompt, options),
      width: options.width || 1024,
      height: options.height || 1024,
      num_outputs: options.numOutputs || 1,
      guidance_scale: options.guidanceScale || 7.5,
      num_inference_steps: options.steps || (model === 'flux-schnell' ? 4 : 28),
      seed: options.seed || Math.floor(Math.random() * 1000000),
      output_format: options.format || 'webp',
      output_quality: options.quality || 85
    };
    
    try {
      const startTime = Date.now();
      
      const output = await this.replicate.run(modelConfig.id, { input });
      
      const duration = ((Date.now() - startTime) / 1000).toFixed(1);
      const cost = (modelConfig.cost * (options.numOutputs || 1)).toFixed(3);
      
      console.log(`✅ Generated in ${duration}s (cost: $${cost})`);
      
      return {
        images: Array.isArray(output) ? output : [output],
        model: model,
        prompt: input.prompt,
        seed: input.seed,
        duration: parseFloat(duration),
        cost: parseFloat(cost),
        metadata: {
          width: input.width,
          height: input.height,
          steps: input.num_inference_steps,
          guidanceScale: input.guidance_scale
        }
      };
      
    } catch (error) {
      console.error(`❌ Generation failed: ${error.message}`);
      throw error;
    }
  }
  
  /**
   * Enhance prompt with brand guidelines
   */
  enhancePrompt(prompt, options = {}) {
    const guidelines = this.loadGuidelines();
    
    // Add base modifiers
    const baseModifiers = guidelines.generationPrompts.baseModifiers.join(', ');
    
    // Add style modifiers based on type
    const styleModifiers = options.includeStyle !== false 
      ? guidelines.generationPrompts.styleModifiers.join(', ')
      : '';
    
    // Build enhanced prompt
    let enhancedPrompt = prompt;
    
    // Add modifiers
    if (baseModifiers && !options.skipEnhancement) {
      enhancedPrompt += `, ${baseModifiers}`;
    }
    
    if (styleModifiers && !options.skipEnhancement) {
      enhancedPrompt += `, ${styleModifiers}`;
    }
    
    // Add negative prompt (what to avoid)
    if (guidelines.generationPrompts.avoidTerms.length > 0 && !options.skipNegative) {
      const avoidTerms = guidelines.generationPrompts.avoidTerms;
      enhancedPrompt += `. NOT: ${avoidTerms.join(', ')}`;
    }
    
    return enhancedPrompt;
  }
  
  /**
   * Generate portfolio image with template
   */
  async generatePortfolioImage(projectType, deviceType = 'laptop', options = {}) {
    const guidelines = this.loadGuidelines();
    let prompt = guidelines.generationPrompts.portfolioTemplate
      .replace('{projectType}', projectType)
      .replace('{deviceType}', deviceType);
    
    return this.generateImage(prompt, {
      ...options,
      skipEnhancement: false // Template already has enhancements
    });
  }
  
  /**
   * Generate team/headshot image
   */
  async generateTeamImage(description, options = {}) {
    const guidelines = this.loadGuidelines();
    let prompt = guidelines.generationPrompts.teamTemplate
      .replace('{description}', description);
    
    return this.generateImage(prompt, {
      ...options,
      width: 512,  // Square for headshots
      height: 512,
      skipEnhancement: false
    });
  }
  
  /**
   * Generate hero section background
   */
  async generateHeroImage(scene, options = {}) {
    const guidelines = this.loadGuidelines();
    let prompt = guidelines.generationPrompts.heroTemplate
      .replace('{scene}', scene);
    
    return this.generateImage(prompt, {
      ...options,
      width: 1920,  // Full width hero
      height: 1080,
      model: 'flux-pro', // Best quality for hero
      skipEnhancement: false
    });
  }
  
  /**
   * Batch generate multiple images
   */
  async batchGenerate(prompts, options = {}) {
    const results = [];
    const totalCost = 0;
    
    console.log(`\n🎨 Batch generating ${prompts.length} images...\n`);
    
    for (let i = 0; i < prompts.length; i++) {
      const promptData = typeof prompts[i] === 'string' 
        ? { prompt: prompts[i] }
        : prompts[i];
      
      console.log(`[${i + 1}/${prompts.length}] ${promptData.prompt.substring(0, 50)}...`);
      
      try {
        const result = await this.generateImage(
          promptData.prompt,
          { ...options, ...promptData.options }
        );
        
        results.push({
          index: i,
          success: true,
          ...result
        });
        
      } catch (error) {
        results.push({
          index: i,
          success: false,
          prompt: promptData.prompt,
          error: error.message
        });
      }
      
      // Add delay between requests to avoid rate limiting
      if (i < prompts.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    // Calculate total cost
    const successfulResults = results.filter(r => r.success);
    const totalCostValue = successfulResults.reduce((sum, r) => sum + r.cost, 0);
    
    console.log(`\n✅ Batch complete: ${successfulResults.length}/${prompts.length} successful`);
    console.log(`💰 Total cost: $${totalCostValue.toFixed(3)}\n`);
    
    return {
      results,
      summary: {
        total: prompts.length,
        successful: successfulResults.length,
        failed: results.length - successfulResults.length,
        totalCost: totalCostValue,
        averageDuration: successfulResults.length > 0
          ? successfulResults.reduce((sum, r) => sum + r.duration, 0) / successfulResults.length
          : 0
      }
    };
  }
  
  /**
   * Download image from URL
   */
  async downloadImage(url, outputPath) {
    try {
      const response = await fetch(url);
      const buffer = await response.arrayBuffer();
      fs.writeFileSync(outputPath, Buffer.from(buffer));
      console.log(`💾 Saved to: ${outputPath}`);
      return outputPath;
    } catch (error) {
      console.error(`Failed to download image: ${error.message}`);
      throw error;
    }
  }
  
  /**
   * Load brand guidelines
   */
  loadGuidelines() {
    const guidelinesPath = path.join(__dirname, '../configs/visual_guidelines.json');
    return JSON.parse(fs.readFileSync(guidelinesPath, 'utf8'));
  }
  
  /**
   * Estimate cost for generation
   */
  estimateCost(numImages, model = null) {
    const selectedModel = model || this.defaultModel;
    const modelConfig = this.models[selectedModel];
    const cost = modelConfig.cost * numImages;
    
    return {
      model: selectedModel,
      numImages,
      costPerImage: modelConfig.cost,
      totalCost: cost,
      quality: modelConfig.quality,
      speed: modelConfig.speed
    };
  }
}

// CLI usage for testing
if (process.argv[1]?.endsWith('replicate_client.js')) {
  const client = new ReplicateClient();
  const command = process.argv[2];
  
  if (!command || command === '--help') {
    console.log(`
🎨 Replicate Client (Flux.1)

Commands:
  test                    Test connection with simple generation
  portfolio <type>        Generate portfolio mockup
  team <description>      Generate team headshot
  hero <scene>           Generate hero background
  estimate <num>         Estimate cost for N images

Examples:
  node replicate_client.js test
  node replicate_client.js portfolio "e-commerce"
  node replicate_client.js team "female developer, 30s"
  node replicate_client.js estimate 10
    `);
    process.exit(0);
  }
  
  (async () => {
    try {
      if (command === 'test') {
        const result = await client.generateImage(
          'Modern minimalist office space with orange accent wall',
          { model: 'flux-schnell' }
        );
        console.log('Result:', result);
        
      } else if (command === 'portfolio') {
        const projectType = process.argv[3] || 'web design';
        const result = await client.generatePortfolioImage(projectType);
        console.log('Result:', result);
        
      } else if (command === 'team') {
        const description = process.argv[3] || 'professional designer';
        const result = await client.generateTeamImage(description);
        console.log('Result:', result);
        
      } else if (command === 'hero') {
        const scene = process.argv[3] || 'designers collaborating';
        const result = await client.generateHeroImage(scene);
        console.log('Result:', result);
        
      } else if (command === 'estimate') {
        const num = parseInt(process.argv[3]) || 10;
        const estimate = client.estimateCost(num);
        console.log('\n💰 Cost Estimate:');
        console.log(`  Images: ${estimate.numImages}`);
        console.log(`  Model: ${estimate.model} (${estimate.quality})`);
        console.log(`  Cost per image: $${estimate.costPerImage}`);
        console.log(`  Total cost: $${estimate.totalCost.toFixed(2)}`);
      }
      
    } catch (error) {
      console.error('Error:', error.message);
      process.exit(1);
    }
  })();
}

export default ReplicateClient;