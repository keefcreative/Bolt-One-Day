#!/usr/bin/env node

/**
 * OpenAI Visual Brand Assistant
 * Uses dedicated assistant for consistent image analysis
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import chalk from 'chalk';
import dotenv from 'dotenv';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

class VisualAssistant {
  constructor(options = {}) {
    this.apiKey = options.apiKey || process.env.OPENAI_API_KEY;
    this.assistantId = options.assistantId || process.env.OPENAI_VISUAL_ASSISTANT_ID;
    this.baseURL = 'https://api.openai.com/v1';
    
    if (!this.apiKey) {
      throw new Error('OpenAI API key required. Add OPENAI_API_KEY to .env.local');
    }
    
    // If no assistant ID, provide instructions to create one
    if (!this.assistantId) {
      console.log(chalk.yellow('\n⚠️  No Visual Assistant ID found.'));
      console.log(chalk.cyan('📝 To create one:'));
      console.log('  1. Go to https://platform.openai.com/assistants');
      console.log('  2. Follow instructions in visual_assistant_setup.md');
      console.log('  3. Add OPENAI_VISUAL_ASSISTANT_ID to .env.local\n');
      console.log(chalk.gray('Using direct GPT-4 Vision API as fallback...\n'));
    } else {
      console.log(chalk.green('✓ Using Visual Brand Assistant'));
      console.log(chalk.gray(`  Assistant ID: ${this.assistantId}`));
    }
  }
  
  /**
   * Analyze image using assistant
   */
  async analyzeImage(imagePath, options = {}) {
    console.log(chalk.cyan(`\n🔍 Analyzing: ${path.basename(imagePath)}`));
    
    // Convert image to base64
    const imageBase64 = this.imageToBase64(imagePath);
    
    // If assistant exists, use it
    if (this.assistantId) {
      return await this.analyzeWithAssistant(imageBase64, imagePath, options);
    } else {
      return await this.analyzeWithDirectAPI(imageBase64, imagePath, options);
    }
  }
  
  /**
   * Analyze using OpenAI Assistant
   */
  async analyzeWithAssistant(imageBase64, imagePath, options) {
    try {
      // Create thread
      const threadId = await this.createThread();
      
      // Send message with image
      await this.sendMessage(threadId, {
        content: `Analyze this image for DesignWorks Bureau brand consistency and conversion impact.
        Image type: ${options.type || 'general'}
        Context: ${options.context || 'Website imagery'}`,
        imageBase64
      });
      
      // Run assistant
      const runId = await this.runAssistant(threadId);
      
      // Wait for completion
      await this.waitForCompletion(threadId, runId);
      
      // Get response
      const messages = await this.getMessages(threadId);
      const assistantMessage = messages.find(m => m.role === 'assistant');
      
      if (assistantMessage?.content[0]?.text?.value) {
        try {
          const analysis = JSON.parse(assistantMessage.content[0].text.value);
          return {
            image: path.basename(imagePath),
            path: imagePath,
            ...analysis,
            method: 'assistant',
            timestamp: new Date().toISOString()
          };
        } catch (e) {
          console.error(chalk.red('Failed to parse assistant response'));
          return {
            image: path.basename(imagePath),
            error: 'Parse error',
            raw: assistantMessage.content[0].text.value
          };
        }
      }
      
      throw new Error('No response from assistant');
      
    } catch (error) {
      console.error(chalk.red(`  Assistant error: ${error.message}`));
      console.log(chalk.yellow('  Falling back to direct API...'));
      return await this.analyzeWithDirectAPI(imageBase64, imagePath, options);
    }
  }
  
  /**
   * Analyze using direct GPT-4 Vision API
   */
  async analyzeWithDirectAPI(imageBase64, imagePath, options) {
    const prompt = this.buildAnalysisPrompt(options);
    
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          messages: [
            {
              role: 'system',
              content: 'You are a visual brand expert for DesignWorks Bureau. Analyze images for brand consistency and conversion impact.'
            },
            {
              role: 'user',
              content: [
                { type: 'text', text: prompt },
                {
                  type: 'image_url',
                  image_url: {
                    url: `data:image/jpeg;base64,${imageBase64}`,
                    detail: options.detail || 'high'
                  }
                }
              ]
            }
          ],
          response_format: { type: 'json_object' },
          max_tokens: 1000,
          temperature: 0.3
        })
      });
      
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error.message);
      }
      
      const analysis = JSON.parse(data.choices[0].message.content);
      
      return {
        image: path.basename(imagePath),
        path: imagePath,
        ...analysis,
        method: 'direct_api',
        timestamp: new Date().toISOString()
      };
      
    } catch (error) {
      console.error(chalk.red(`  Analysis failed: ${error.message}`));
      throw error;
    }
  }
  
  /**
   * Build analysis prompt
   */
  buildAnalysisPrompt(options) {
    return `Analyze this image for DesignWorks Bureau brand consistency.

BRAND GUIDELINES:
- Primary color: #F97316 (orange) MUST appear as accent
- Style: Modern, clean, sharp edges (NO rounded corners)
- Photography: Real people, natural lighting, authentic moments

EVALUATE:
1. Brand Score (0-100)
2. Conversion Score (0-100)
3. Color compliance
4. Style alignment
5. Quality assessment
6. Emotional impact

Respond in JSON format:
{
  "brandScore": 0-100,
  "conversionScore": 0-100,
  "analysis": {
    "colorCompliance": "description",
    "styleAlignment": "description",
    "qualityAssessment": "description",
    "compositionAnalysis": "description",
    "emotionalImpact": "description"
  },
  "strengths": ["list"],
  "criticalIssues": ["list"],
  "improvements": [
    {
      "priority": "critical|important|nice-to-have",
      "action": "specific action",
      "impact": "expected result"
    }
  ],
  "altText": "SEO-optimized description",
  "requiresReplacement": boolean,
  "replacementPrompt": "Flux.1 generation prompt if needed"
}`;
  }
  
  /**
   * Batch analyze multiple images
   */
  async batchAnalyze(imagePaths, options = {}) {
    const results = [];
    
    console.log(chalk.bold.cyan(`\n📸 Analyzing ${imagePaths.length} images...\n`));
    
    for (let i = 0; i < imagePaths.length; i++) {
      const imagePath = imagePaths[i];
      console.log(chalk.yellow(`[${i + 1}/${imagePaths.length}] ${path.basename(imagePath)}`));
      
      try {
        const analysis = await this.analyzeImage(imagePath, options);
        results.push(analysis);
        
        const score = analysis.brandScore || 0;
        const color = score >= 80 ? 'green' : score >= 60 ? 'yellow' : 'red';
        console.log(chalk[color](`  Brand Score: ${score}/100`));
        
        if (analysis.requiresReplacement) {
          console.log(chalk.red('  ⚠️  Requires replacement'));
        }
        
      } catch (error) {
        results.push({
          image: path.basename(imagePath),
          error: error.message,
          brandScore: 0
        });
      }
      
      // Rate limiting delay
      if (i < imagePaths.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    // Generate summary
    const avgBrandScore = results.reduce((sum, r) => sum + (r.brandScore || 0), 0) / results.length;
    const avgConversionScore = results.reduce((sum, r) => sum + (r.conversionScore || 0), 0) / results.length;
    
    console.log(chalk.bold.cyan('\n📊 Summary:'));
    console.log(chalk.white(`  Avg Brand Score: ${Math.round(avgBrandScore)}/100`));
    console.log(chalk.white(`  Avg Conversion Score: ${Math.round(avgConversionScore)}/100`));
    console.log(chalk.red(`  Need Replacement: ${results.filter(r => r.requiresReplacement).length}`));
    
    return {
      results,
      summary: {
        totalImages: imagePaths.length,
        averageBrandScore: Math.round(avgBrandScore),
        averageConversionScore: Math.round(avgConversionScore),
        requireReplacement: results.filter(r => r.requiresReplacement).length
      }
    };
  }
  
  /**
   * Generate improvement prompts for Flux.1
   */
  generateImprovementPrompts(analysisResults) {
    const prompts = [];
    
    for (const result of analysisResults) {
      if (result.requiresReplacement && result.replacementPrompt) {
        prompts.push({
          original: result.image,
          prompt: result.replacementPrompt,
          issues: result.criticalIssues || [],
          priority: 'high'
        });
      } else if (result.brandScore < 60) {
        // Generate prompt based on issues
        const prompt = this.buildImprovementPrompt(result);
        prompts.push({
          original: result.image,
          prompt,
          issues: result.criticalIssues || [],
          priority: 'medium'
        });
      }
    }
    
    return prompts;
  }
  
  buildImprovementPrompt(analysis) {
    let prompt = 'Modern professional design agency ';
    
    // Add specific elements based on issues
    if (analysis.criticalIssues?.includes('Missing orange accent')) {
      prompt += 'with prominent #F97316 orange brand accent, ';
    }
    
    if (analysis.criticalIssues?.includes('Rounded corners detected')) {
      prompt += 'sharp edges and corners only, ';
    }
    
    prompt += 'clean minimalist aesthetic, high quality professional photography';
    
    return prompt;
  }
  
  // Assistant API methods
  async createThread() {
    const response = await fetch(`${this.baseURL}/threads`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        'OpenAI-Beta': 'assistants=v2'
      }
    });
    
    const data = await response.json();
    if (data.error) throw new Error(data.error.message);
    return data.id;
  }
  
  async sendMessage(threadId, { content, imageBase64 }) {
    const messageContent = [
      { type: 'text', text: content }
    ];
    
    if (imageBase64) {
      messageContent.push({
        type: 'image_url',
        image_url: {
          url: `data:image/jpeg;base64,${imageBase64}`,
          detail: 'high'
        }
      });
    }
    
    const response = await fetch(`${this.baseURL}/threads/${threadId}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        'OpenAI-Beta': 'assistants=v2'
      },
      body: JSON.stringify({
        role: 'user',
        content: messageContent
      })
    });
    
    const data = await response.json();
    if (data.error) throw new Error(data.error.message);
    return data.id;
  }
  
  async runAssistant(threadId) {
    const response = await fetch(`${this.baseURL}/threads/${threadId}/runs`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        'OpenAI-Beta': 'assistants=v2'
      },
      body: JSON.stringify({
        assistant_id: this.assistantId,
        response_format: { type: 'json_object' }
      })
    });
    
    const data = await response.json();
    if (data.error) throw new Error(data.error.message);
    return data.id;
  }
  
  async waitForCompletion(threadId, runId, maxAttempts = 30) {
    for (let i = 0; i < maxAttempts; i++) {
      const response = await fetch(`${this.baseURL}/threads/${threadId}/runs/${runId}`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'OpenAI-Beta': 'assistants=v2'
        }
      });
      
      const run = await response.json();
      
      if (run.status === 'completed') return run;
      if (['failed', 'cancelled', 'expired'].includes(run.status)) {
        throw new Error(`Run ${run.status}: ${run.last_error?.message || 'Unknown error'}`);
      }
      
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    throw new Error('Run timed out');
  }
  
  async getMessages(threadId) {
    const response = await fetch(`${this.baseURL}/threads/${threadId}/messages`, {
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'OpenAI-Beta': 'assistants=v2'
      }
    });
    
    const data = await response.json();
    if (data.error) throw new Error(data.error.message);
    return data.data;
  }
  
  imageToBase64(imagePath) {
    const imageBuffer = fs.readFileSync(imagePath);
    return imageBuffer.toString('base64');
  }
}

// CLI usage
if (process.argv[1]?.endsWith('visual_assistant.js')) {
  const assistant = new VisualAssistant();
  const command = process.argv[2];
  
  if (!command || command === '--help') {
    console.log(`
🎨 Visual Brand Assistant

Commands:
  analyze <image>        Analyze single image
  batch <dir>           Analyze directory of images
  portfolio             Analyze portfolio images
  test                  Test with sample image

Examples:
  node visual_assistant.js analyze image.jpg
  node visual_assistant.js batch ../public/images
  node visual_assistant.js portfolio
    `);
    process.exit(0);
  }
  
  (async () => {
    try {
      if (command === 'analyze') {
        const imagePath = process.argv[3];
        if (!imagePath) {
          console.error('Please provide image path');
          process.exit(1);
        }
        
        const result = await assistant.analyzeImage(imagePath);
        console.log('\nAnalysis:', JSON.stringify(result, null, 2));
        
      } else if (command === 'batch') {
        const dir = process.argv[3] || '../public/images';
        const files = fs.readdirSync(dir)
          .filter(f => ['.jpg', '.jpeg', '.png'].includes(path.extname(f)))
          .map(f => path.join(dir, f));
        
        const results = await assistant.batchAnalyze(files);
        console.log('\nResults:', JSON.stringify(results, null, 2));
        
      } else if (command === 'portfolio') {
        const portfolioDir = path.join(__dirname, '..', 'public', 'images', 'portfolio');
        const files = fs.readdirSync(portfolioDir)
          .filter(f => f.endsWith('.jpg'))
          .map(f => path.join(portfolioDir, f));
        
        const results = await assistant.batchAnalyze(files, { type: 'portfolio' });
        
        // Save results
        const outputPath = path.join(__dirname, 'reports', 'portfolio-visual-analysis.json');
        fs.mkdirSync(path.dirname(outputPath), { recursive: true });
        fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));
        
        console.log(chalk.green(`\n💾 Saved to: ${outputPath}`));
        
      } else if (command === 'test') {
        const testImage = path.join(__dirname, '..', 'public', 'images', 'portfolio', 'techflow-rebrand.jpg');
        const result = await assistant.analyzeImage(testImage);
        console.log('\nTest Result:', JSON.stringify(result, null, 2));
      }
      
    } catch (error) {
      console.error(chalk.red('Error:'), error.message);
      process.exit(1);
    }
  })();
}

export default VisualAssistant;