#!/usr/bin/env node

/**
 * AI-Powered Image Analysis System
 * Uses GPT-4 Vision to analyze images for brand consistency
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import chalk from 'chalk';
import dotenv from 'dotenv';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

class ImageAnalyzer {
  constructor() {
    this.apiKey = process.env.OPENAI_API_KEY;
    
    if (!this.apiKey) {
      throw new Error('OPENAI_API_KEY not found in .env.local');
    }
    
    this.guidelines = this.loadGuidelines();
    console.log(chalk.green('✓ GPT-4 Vision analyzer initialized'));
  }
  
  /**
   * Analyze single image for brand consistency
   */
  async analyzeImage(imagePath, options = {}) {
    console.log(chalk.cyan(`\n🔍 Analyzing: ${path.basename(imagePath)}`));
    
    // Read image and convert to base64
    const imageBase64 = this.imageToBase64(imagePath);
    
    // Build analysis prompt
    const prompt = this.buildAnalysisPrompt(options.type || 'general');
    
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
              content: 'You are a brand consistency expert analyzing images for DesignWorks Bureau.'
            },
            {
              role: 'user',
              content: [
                {
                  type: 'text',
                  text: prompt
                },
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
          max_tokens: 1000,
          temperature: 0.3
        })
      });
      
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error.message);
      }
      
      // Parse the response
      const analysis = this.parseAnalysisResponse(data.choices[0].message.content);
      
      return {
        image: path.basename(imagePath),
        path: imagePath,
        ...analysis,
        timestamp: new Date().toISOString()
      };
      
    } catch (error) {
      console.error(chalk.red(`  ✗ Analysis failed: ${error.message}`));
      throw error;
    }
  }
  
  /**
   * Build analysis prompt based on brand guidelines
   */
  buildAnalysisPrompt(imageType) {
    const guidelines = this.guidelines;
    
    return `Analyze this image for brand consistency with DesignWorks Bureau guidelines.

BRAND GUIDELINES:
- Style: ${guidelines.visualIdentity.style.overall}
- Aesthetic: ${guidelines.visualIdentity.style.aesthetic}
- Color Palette: Primary (#F97316 orange, #1A1A1A ink), clean backgrounds
- Composition: ${guidelines.visualIdentity.composition.layout}
- Quality: Professional, high resolution, sharp focus

ANALYZE AND PROVIDE:
1. Brand Consistency Score (0-100)
2. Color Palette Compliance (matches brand colors?)
3. Style Alignment (matches brand aesthetic?)
4. Quality Assessment (professional quality?)
5. Composition Analysis (follows guidelines?)
6. Improvement Recommendations (specific actionable items)
7. Alt Text Suggestion (SEO-optimized description)

Respond in JSON format:
{
  "brandScore": 85,
  "analysis": {
    "colorCompliance": "Description of color usage",
    "styleAlignment": "How well it matches brand style",
    "qualityAssessment": "Technical quality evaluation",
    "compositionAnalysis": "Layout and composition review"
  },
  "strengths": ["List of what works well"],
  "issues": ["List of brand guideline violations"],
  "recommendations": ["Specific improvement suggestions"],
  "altText": "SEO-optimized description",
  "requiresReplacement": false
}`;
  }
  
  /**
   * Parse GPT-4 Vision response
   */
  parseAnalysisResponse(content) {
    try {
      // Try to parse as JSON first
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      // Fallback to structured parsing
      return {
        brandScore: 50,
        analysis: {
          colorCompliance: 'Unable to parse detailed analysis',
          styleAlignment: content,
          qualityAssessment: 'Review required',
          compositionAnalysis: 'Review required'
        },
        strengths: [],
        issues: ['Unable to fully parse analysis'],
        recommendations: ['Manual review recommended'],
        altText: 'Image for DesignWorks Bureau',
        requiresReplacement: false
      };
      
    } catch (error) {
      console.error(chalk.yellow('  ⚠ Could not parse structured response'));
      return {
        brandScore: 0,
        rawAnalysis: content,
        error: 'Parse error'
      };
    }
  }
  
  /**
   * Analyze all images in a directory
   */
  async analyzeDirectory(dirPath, options = {}) {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp'];
    const files = fs.readdirSync(dirPath)
      .filter(file => imageExtensions.includes(path.extname(file).toLowerCase()));
    
    console.log(chalk.bold.cyan(`\n📁 Analyzing ${files.length} images in ${path.basename(dirPath)}\n`));
    
    const results = [];
    let totalScore = 0;
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const filePath = path.join(dirPath, file);
      
      console.log(chalk.yellow(`[${i + 1}/${files.length}] ${file}`));
      
      try {
        const analysis = await this.analyzeImage(filePath, options);
        results.push(analysis);
        totalScore += analysis.brandScore || 0;
        
        console.log(chalk.green(`  ✓ Score: ${analysis.brandScore}/100`));
        
        if (analysis.requiresReplacement) {
          console.log(chalk.red(`  ⚠ Requires replacement`));
        }
        
      } catch (error) {
        results.push({
          image: file,
          error: error.message,
          brandScore: 0
        });
        console.log(chalk.red(`  ✗ Failed`));
      }
      
      // Add delay to avoid rate limiting
      if (i < files.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    // Generate summary
    const summary = {
      totalImages: files.length,
      averageScore: files.length > 0 ? Math.round(totalScore / files.length) : 0,
      requireReplacement: results.filter(r => r.requiresReplacement).length,
      highScoring: results.filter(r => r.brandScore >= 80).length,
      lowScoring: results.filter(r => r.brandScore < 60).length
    };
    
    console.log(chalk.bold.cyan('\n📊 Summary:'));
    console.log(chalk.white(`  Average Score: ${summary.averageScore}/100`));
    console.log(chalk.green(`  High Scoring (80+): ${summary.highScoring}`));
    console.log(chalk.yellow(`  Low Scoring (<60): ${summary.lowScoring}`));
    console.log(chalk.red(`  Need Replacement: ${summary.requireReplacement}`));
    
    return {
      directory: dirPath,
      summary,
      results,
      timestamp: new Date().toISOString()
    };
  }
  
  /**
   * Generate alt text for image
   */
  async generateAltText(imagePath) {
    console.log(chalk.cyan(`\n✏️ Generating alt text for: ${path.basename(imagePath)}`));
    
    const imageBase64 = this.imageToBase64(imagePath);
    
    const prompt = `Generate SEO-optimized alt text for this image.
    
Guidelines:
- ${this.guidelines.altTextGuidelines.structure}
- Length: ${this.guidelines.altTextGuidelines.length}
- Tone: ${this.guidelines.altTextGuidelines.tone}
- Include relevant keywords: ${this.guidelines.altTextGuidelines.seoKeywords.join(', ')}

Provide 3 variations:
1. Short (50 chars)
2. Standard (100 chars)
3. Detailed (150 chars)`;
    
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
              role: 'user',
              content: [
                { type: 'text', text: prompt },
                {
                  type: 'image_url',
                  image_url: {
                    url: `data:image/jpeg;base64,${imageBase64}`,
                    detail: 'low'
                  }
                }
              ]
            }
          ],
          max_tokens: 200,
          temperature: 0.5
        })
      });
      
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error.message);
      }
      
      return {
        image: path.basename(imagePath),
        altText: data.choices[0].message.content,
        generated: true
      };
      
    } catch (error) {
      console.error(chalk.red(`  ✗ Generation failed: ${error.message}`));
      throw error;
    }
  }
  
  /**
   * Convert image to base64
   */
  imageToBase64(imagePath) {
    const imageBuffer = fs.readFileSync(imagePath);
    return imageBuffer.toString('base64');
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
      visualIdentity: {
        style: { overall: 'modern professional' },
        composition: { layout: 'clean minimal' }
      },
      altTextGuidelines: {
        structure: 'Subject action context',
        length: '50-150 characters',
        tone: 'Professional',
        seoKeywords: ['design', 'professional']
      }
    };
  }
  
  /**
   * Save analysis results
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
if (process.argv[1]?.endsWith('image_analyzer.js')) {
  const analyzer = new ImageAnalyzer();
  const command = process.argv[2];
  
  if (!command || command === '--help') {
    console.log(`
🔍 AI Image Analyzer (GPT-4 Vision)

Commands:
  analyze <image>        Analyze single image
  directory <path>       Analyze all images in directory
  portfolio             Analyze portfolio images
  alt <image>           Generate alt text for image

Examples:
  node image_analyzer.js analyze /path/to/image.jpg
  node image_analyzer.js directory ../public/images/portfolio
  node image_analyzer.js alt ../public/images/hero.jpg
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
        
        const result = await analyzer.analyzeImage(imagePath);
        console.log('\nAnalysis Result:');
        console.log(JSON.stringify(result, null, 2));
        
      } else if (command === 'directory') {
        const dirPath = process.argv[3] || '../public/images';
        const fullPath = path.resolve(dirPath);
        
        const results = await analyzer.analyzeDirectory(fullPath);
        analyzer.saveResults(results, 'image-analysis.json');
        
      } else if (command === 'portfolio') {
        const portfolioPath = path.join(__dirname, '..', 'public', 'images', 'portfolio');
        const results = await analyzer.analyzeDirectory(portfolioPath);
        analyzer.saveResults(results, 'portfolio-analysis.json');
        
      } else if (command === 'alt') {
        const imagePath = process.argv[3];
        if (!imagePath) {
          console.error('Please provide image path');
          process.exit(1);
        }
        
        const result = await analyzer.generateAltText(imagePath);
        console.log('\nGenerated Alt Text:');
        console.log(result.altText);
      }
      
    } catch (error) {
      console.error(chalk.red('\nError:'), error.message);
      process.exit(1);
    }
  })();
}

export default ImageAnalyzer;