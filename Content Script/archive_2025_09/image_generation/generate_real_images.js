#!/usr/bin/env node

/**
 * Generate real portfolio images with Replicate
 */

import Replicate from 'replicate';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import chalk from 'chalk';
import https from 'https';
import dotenv from 'dotenv';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

async function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filepath);
    https.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve(filepath);
      });
    }).on('error', (err) => {
      fs.unlink(filepath, () => {});
      reject(err);
    });
  });
}

async function generatePortfolioImages() {
  const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN
  });
  
  console.log(chalk.bold.cyan('\n🎨 Generating Real Portfolio Images with Flux.1\n'));
  
  // Create output directory
  const outputDir = path.join(__dirname, 'generated_images');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  // Portfolio images to generate
  const images = [
    {
      name: 'bloom-beauty-ecommerce',
      prompt: 'Professional product photography setup showing MacBook Pro displaying a luxury beauty e-commerce website with pink and gold color scheme, prominent #F97316 orange accent elements in the scene (orange notebook, pen, or desk accessory), clean minimal white desk, natural window lighting, shot with 85mm lens f/1.8, shallow depth of field, authentic workspace not stock photo, sharp edges only no rounded corners, professional photography quality'
    },
    {
      name: 'ecomarket-marketplace',
      prompt: 'Modern workspace with MacBook Pro showing an eco-friendly marketplace website with green nature themes, prominent #F97316 orange brand accent (orange coffee mug or plant pot), sustainable materials on desk, bamboo accessories, natural daylight from large window, professional photography, 85mm lens, bokeh background, authentic office environment, sharp architectural lines, no rounded corners'
    },
    {
      name: 'techflow-rebrand',
      prompt: 'Professional designer working on MacBook Pro displaying modern tech company brand guidelines, prominent #F97316 orange accent wall or large orange design element visible, clean minimal office space, modern furniture with sharp edges, natural lighting, authentic candid moment of actual work, not staged, professional photography quality, 85mm lens with shallow depth of field'
    }
  ];
  
  const results = [];
  
  for (let i = 0; i < images.length; i++) {
    const image = images[i];
    console.log(chalk.yellow(`[${i + 1}/${images.length}] Generating: ${image.name}`));
    console.log(chalk.gray(`Prompt preview: ${image.prompt.substring(0, 100)}...`));
    
    try {
      // Use Flux.1 dev for best quality
      const output = await replicate.run(
        "black-forest-labs/flux-dev",
        {
          input: {
            prompt: image.prompt,
            num_outputs: 1,
            aspect_ratio: "3:2", // Good for portfolio display
            output_format: "jpg",
            output_quality: 90,
            guidance_scale: 7.5,
            num_inference_steps: 28
          }
        }
      );
      
      // Get the URL from the output
      let imageUrl;
      if (Array.isArray(output) && output.length > 0) {
        imageUrl = output[0];
      } else if (typeof output === 'string') {
        imageUrl = output;
      }
      
      if (imageUrl) {
        console.log(chalk.green(`  ✓ Generated successfully`));
        
        // Handle ReadableStream or URL
        let finalUrl = imageUrl;
        if (typeof imageUrl === 'object' && imageUrl.constructor.name === 'ReadableStream') {
          // For ReadableStream, we need to process it differently
          console.log(chalk.yellow(`  ⚠️  Got stream response, processing...`));
          // For now, skip download for streams
          results.push({
            name: image.name,
            success: true,
            url: 'Generated but stream response',
            prompt: image.prompt
          });
          continue;
        }
        
        console.log(chalk.cyan(`  URL Type: ${typeof finalUrl}`));
        console.log(chalk.cyan(`  URL: ${String(finalUrl).substring(0, 80)}...`));
        
        // Download the image
        const filename = `${image.name}_generated.jpg`;
        const filepath = path.join(outputDir, filename);
        
        console.log(chalk.yellow(`  ⬇️  Downloading...`));
        await downloadImage(String(finalUrl), filepath);
        console.log(chalk.green(`  ✓ Saved to: ${filename}`));
        
        results.push({
          name: image.name,
          success: true,
          url: imageUrl,
          localPath: filepath,
          prompt: image.prompt
        });
      } else {
        throw new Error('No URL in response');
      }
      
    } catch (error) {
      console.log(chalk.red(`  ✗ Failed: ${error.message}`));
      results.push({
        name: image.name,
        success: false,
        error: error.message
      });
    }
    
    // Small delay between generations
    if (i < images.length - 1) {
      console.log(chalk.gray('\n  Waiting 2 seconds...\n'));
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
  
  // Save results summary
  const summaryPath = path.join(outputDir, 'generation_summary.json');
  fs.writeFileSync(summaryPath, JSON.stringify({
    timestamp: new Date().toISOString(),
    total: images.length,
    successful: results.filter(r => r.success).length,
    failed: results.filter(r => !r.success).length,
    totalCost: results.filter(r => r.success).length * 0.03,
    results
  }, null, 2));
  
  // Summary
  const successful = results.filter(r => r.success).length;
  const cost = successful * 0.03;
  
  console.log(chalk.bold.cyan('\n📊 Generation Complete!\n'));
  console.log(chalk.white(`  Generated: ${successful}/${images.length} images`));
  console.log(chalk.white(`  Cost: $${cost.toFixed(2)}`));
  console.log(chalk.white(`  Location: ${outputDir}`));
  console.log(chalk.white(`  Credits remaining: ~$${(10 - cost).toFixed(2)}`));
  
  return results;
}

// Run the generation
generatePortfolioImages().catch(console.error);