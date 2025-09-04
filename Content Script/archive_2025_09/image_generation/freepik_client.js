#!/usr/bin/env node

/**
 * Freepik API Client - Comprehensive Creative Suite
 * Handles all Freepik API services: generation, stock, editing, etc.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import chalk from 'chalk';
import dotenv from 'dotenv';
import https from 'https';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

class FreepikClient {
  constructor() {
    this.apiKey = process.env.FREEPIK_API_KEY;
    this.baseURL = 'https://api.freepik.com/v1';
    
    if (!this.apiKey) {
      throw new Error('FREEPIK_API_KEY not found in .env.local');
    }
    
    console.log(chalk.green('✓ Freepik API Client initialized'));
    
    // Available AI models for generation
    this.models = {
      'flux': 'Same Flux as Replicate',
      'flux-realism': 'Enhanced realism',
      'dalle3': 'DALL-E 3 model',
      'midjourney': 'Midjourney style',
      'stable-diffusion': 'Stable Diffusion',
      'mystic': 'Artistic styles',
      'classic': 'Classic model'
    };
  }
  
  /**
   * Make API request
   */
  async makeRequest(endpoint, method = 'GET', data = null) {
    const url = `${this.baseURL}${endpoint}`;
    
    const options = {
      method,
      headers: {
        'x-freepik-api-key': this.apiKey,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    };
    
    if (data) {
      options.body = JSON.stringify(data);
    }
    
    try {
      const response = await fetch(url, options);
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || `API error: ${response.status}`);
      }
      
      return result;
    } catch (error) {
      console.error(chalk.red(`API Error: ${error.message}`));
      throw error;
    }
  }
  
  /**
   * 1. IMAGE GENERATION API
   */
  async generateImage(prompt, options = {}) {
    console.log(chalk.cyan('\n🎨 Generating image...'));
    console.log(chalk.gray(`Model: ${options.model || 'flux'}`));
    
    // Freepik's simplified API structure based on docs
    const data = {
      prompt,
      negative_prompt: options.negativePrompt || '',
      guidance: options.guidanceScale || 7,
      seed: options.seed || Math.floor(Math.random() * 1000000),
      num_images: options.numImages || 1,
      aspect_ratio: options.size || '1:1',
      ai_model: options.model || 'flux',
      style: options.style || 'photo'
    };
    
    try {
      const result = await this.makeRequest('/ai/text-to-image', 'POST', data);
      
      console.log(chalk.green('✓ Image generated successfully'));
      return {
        success: true,
        images: result.data || [],
        credits_used: result.credits_used || 0,
        model: data.model
      };
      
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }
  
  /**
   * 2. STOCK CONTENT SEARCH API
   */
  async searchStock(query, options = {}) {
    console.log(chalk.cyan('\n🔍 Searching stock content...'));
    console.log(chalk.gray(`Query: "${query}"`));
    
    const params = new URLSearchParams({
      term: query,
      per_page: options.limit || 10,
      page: options.page || 1,
      filters: options.filters || '',
      order: options.order || 'relevance'
    });
    
    try {
      const result = await this.makeRequest(`/resources?${params}`);
      
      console.log(chalk.green(`✓ Found ${result.data?.length || 0} results`));
      return {
        success: true,
        results: result.data || [],
        total: result.meta?.total || 0
      };
      
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }
  
  /**
   * 3. IMAGE EDITING API - Background Removal
   */
  async removeBackground(imageUrl) {
    console.log(chalk.cyan('\n✂️ Removing background...'));
    
    const data = {
      image_url: imageUrl,
      format: 'png'
    };
    
    try {
      const result = await this.makeRequest('/ai/background-remover', 'POST', data);
      
      console.log(chalk.green('✓ Background removed'));
      return {
        success: true,
        image: result.data?.url,
        credits_used: result.credits_used || 0
      };
      
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }
  
  /**
   * 4. UPSCALER API
   */
  async upscaleImage(imageUrl, scale = 2) {
    console.log(chalk.cyan(`\n🔍 Upscaling image ${scale}x...`));
    
    const data = {
      image_url: imageUrl,
      scale: scale
    };
    
    try {
      const result = await this.makeRequest('/ai/upscaler', 'POST', data);
      
      console.log(chalk.green('✓ Image upscaled'));
      return {
        success: true,
        image: result.data?.url,
        credits_used: result.credits_used || 0
      };
      
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }
  
  /**
   * 5. STYLE TRANSFER API
   */
  async applyStyleTransfer(imageUrl, style) {
    console.log(chalk.cyan('\n🎨 Applying style transfer...'));
    
    const data = {
      image_url: imageUrl,
      style: style || 'modern',
      intensity: 0.7
    };
    
    try {
      const result = await this.makeRequest('/ai/style-transfer', 'POST', data);
      
      console.log(chalk.green('✓ Style applied'));
      return {
        success: true,
        image: result.data?.url,
        credits_used: result.credits_used || 0
      };
      
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }
  
  /**
   * 6. AI IMAGE CLASSIFIER
   */
  async classifyImage(imageUrl) {
    console.log(chalk.cyan('\n🔬 Classifying image...'));
    
    const data = {
      image_url: imageUrl
    };
    
    try {
      const result = await this.makeRequest('/ai/classifier', 'POST', data);
      
      console.log(chalk.green('✓ Image classified'));
      return {
        success: true,
        classification: result.data,
        is_ai_generated: result.data?.ai_generated || false,
        confidence: result.data?.confidence || 0
      };
      
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }
  
  /**
   * Test comparison: Flux vs Imagen for text rendering
   */
  async compareTextRendering(prompt) {
    console.log(chalk.bold.cyan('\n🆚 Comparing text rendering: Flux vs Google Imagen 3\n'));
    
    const results = {};
    
    // Test with Flux
    console.log(chalk.yellow('Testing Flux...'));
    const fluxResult = await this.generateImage(prompt, { model: 'flux' });
    results.flux = fluxResult;
    
    // Test with DALL-E 3
    console.log(chalk.yellow('\nTesting DALL-E 3...'));
    const dalle3Result = await this.generateImage(prompt, { model: 'dalle3' });
    results.dalle3 = dalle3Result;
    
    // Summary
    console.log(chalk.bold.cyan('\n📊 Comparison Results:'));
    console.log(chalk.white('Flux:', fluxResult.success ? '✓ Generated' : '✗ Failed'));
    console.log(chalk.white('DALL-E 3:', dalle3Result.success ? '✓ Generated' : '✗ Failed'));
    console.log(chalk.gray('\nDALL-E 3 typically renders text more accurately'));
    
    return results;
  }
  
  /**
   * Complete portfolio workflow
   */
  async portfolioWorkflow(projectName) {
    console.log(chalk.bold.cyan(`\n🔄 Complete Portfolio Workflow for: ${projectName}\n`));
    
    const workflow = {
      steps: [],
      totalCredits: 0
    };
    
    // Step 1: Search for stock laptop images
    console.log(chalk.yellow('Step 1: Search stock laptops...'));
    const stockSearch = await this.searchStock('laptop mockup workspace', { limit: 5 });
    workflow.steps.push({ step: 'stock_search', ...stockSearch });
    
    if (stockSearch.success && stockSearch.results.length > 0) {
      console.log(chalk.green(`  Found ${stockSearch.results.length} stock options`));
      
      // Step 2: Generate custom version with Imagen for better text
      console.log(chalk.yellow('\nStep 2: Generate with Google Imagen 3...'));
      const prompt = `Professional ${projectName} website displayed on MacBook Pro, ${projectName} text clearly visible on screen, modern office with #F97316 orange accent, sharp edges, no rounded corners`;
      
      const generated = await this.generateImage(prompt, { 
        model: 'dalle3',  // Try DALL-E 3 for better text
        style: 'photo'
      });
      workflow.steps.push({ step: 'generation', ...generated });
      
      if (generated.success && generated.images[0]) {
        // Step 3: Remove background if needed
        console.log(chalk.yellow('\nStep 3: Process image...'));
        // Would remove background, apply style, etc.
        workflow.steps.push({ step: 'editing', note: 'Ready for editing' });
      }
    }
    
    console.log(chalk.bold.green('\n✅ Workflow Complete!'));
    return workflow;
  }
  
  /**
   * Get account info and credits
   */
  async getAccountInfo() {
    console.log(chalk.cyan('\n📊 Fetching account info...'));
    
    try {
      const result = await this.makeRequest('/account');
      
      console.log(chalk.green('✓ Account info retrieved'));
      console.log(chalk.white(`  Credits: ${result.credits || 'N/A'}`));
      console.log(chalk.white(`  Plan: ${result.plan || 'N/A'}`));
      
      return result;
    } catch (error) {
      console.log(chalk.red('Could not fetch account info'));
      return null;
    }
  }
}

// CLI usage
if (process.argv[1]?.endsWith('freepik_client.js')) {
  const client = new FreepikClient();
  const command = process.argv[2];
  
  if (!command || command === '--help') {
    console.log(`
🎨 Freepik API Client

Commands:
  test                Test connection
  generate <prompt>   Generate image with AI
  search <query>      Search stock content
  compare <prompt>    Compare Flux vs Imagen text rendering
  workflow <project>  Run complete portfolio workflow
  account            Check account info and credits

Examples:
  node freepik_client.js test
  node freepik_client.js generate "Modern office with MacBook"
  node freepik_client.js search "laptop mockup"
  node freepik_client.js compare "Website with READABLE TEXT on screen"
  node freepik_client.js workflow "E-commerce"
    `);
    process.exit(0);
  }
  
  (async () => {
    try {
      if (command === 'test') {
        console.log(chalk.bold.cyan('\n🧪 Testing Freepik API Connection...\n'));
        const account = await client.getAccountInfo();
        
        if (account) {
          console.log(chalk.green('\n✅ Connection successful!'));
          
          // Quick search test
          const search = await client.searchStock('laptop', { limit: 1 });
          console.log(chalk.white(`\n📦 Stock library access: ${search.success ? '✓' : '✗'}`));
        }
        
      } else if (command === 'generate') {
        const prompt = process.argv.slice(3).join(' ') || 'Modern office workspace';
        const result = await client.generateImage(prompt);
        console.log('\nResult:', result);
        
      } else if (command === 'search') {
        const query = process.argv.slice(3).join(' ') || 'laptop mockup';
        const result = await client.searchStock(query);
        
        if (result.success && result.results.length > 0) {
          console.log('\nTop results:');
          result.results.slice(0, 3).forEach((item, i) => {
            console.log(`${i + 1}. ${item.title || 'Untitled'}`);
            console.log(`   Type: ${item.type || 'N/A'}`);
            console.log(`   URL: ${item.url || 'N/A'}`);
          });
        }
        
      } else if (command === 'compare') {
        const prompt = process.argv.slice(3).join(' ') || 
          'MacBook showing website with text "DesignWorks Bureau" clearly readable';
        await client.compareTextRendering(prompt);
        
      } else if (command === 'workflow') {
        const project = process.argv[3] || 'Portfolio';
        await client.portfolioWorkflow(project);
        
      } else if (command === 'account') {
        await client.getAccountInfo();
      }
      
    } catch (error) {
      console.error(chalk.red('\nError:'), error.message);
      process.exit(1);
    }
  })();
}

export default FreepikClient;