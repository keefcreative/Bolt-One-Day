#!/usr/bin/env node

/**
 * Pre-build Content Validation Script
 * 
 * Validates content quality before production builds to ensure
 * high-quality content is deployed to users.
 */

// Note: This script uses dynamic imports for TypeScript modules
// const { contentOperations, contentIntegration } = require('../lib/content-integration');
// const { initializeSharedConfig, configUtils } = require('../lib/shared-config');
const { promises: fs } = require('fs');
const path = require('path');

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function colorLog(color, message) {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function main() {
  let hasErrors = false;
  let hasWarnings = false;

  try {
    colorLog('cyan', '\n🏗️ Pre-build Content Validation\n');
    
    // Basic validation without TypeScript modules for now
    colorLog('blue', '🔍 Checking content system availability...');
    
    // Check if content-improver directory exists
    const contentImproverPath = path.join(process.cwd(), 'content-improver');
    try {
      await fs.access(contentImproverPath);
      await fs.access(path.join(contentImproverPath, 'package.json'));
      colorLog('green', '✅ Content-improver system available');
    } catch (error) {
      colorLog('yellow', '⚠️ Content-improver system not available');
      colorLog('yellow', '   Skipping advanced content validation');
      hasWarnings = true;
    }

    // Check data files
    colorLog('blue', '📁 Checking content files...');
    const dataPath = path.join(process.cwd(), 'data');
    
    try {
      const files = await fs.readdir(dataPath, { recursive: true });
      const jsonFiles = files.filter(f => f.toString().endsWith('.json'));
      
      colorLog('cyan', `   Found ${jsonFiles.length} JSON content files`);
      
      // Basic JSON validation
      let validFiles = 0;
      let invalidFiles = 0;
      
      for (const file of jsonFiles) {
        const filePath = path.join(dataPath, file.toString());
        try {
          const content = await fs.readFile(filePath, 'utf-8');
          JSON.parse(content);
          validFiles++;
        } catch (error) {
          colorLog('red', `❌ Invalid JSON: ${file}`);
          invalidFiles++;
          hasErrors = true;
        }
      }
      
      if (invalidFiles === 0) {
        colorLog('green', `✅ All ${validFiles} content files are valid JSON`);
      } else {
        colorLog('red', `❌ ${invalidFiles} files have JSON errors`);
      }
      
    } catch (error) {
      colorLog('red', `❌ Could not read data directory: ${error.message}`);
      hasErrors = true;
    }

    // Check environment variables
    colorLog('blue', '🔧 Checking environment configuration...');
    
    const requiredEnvVars = ['OPENAI_API_KEY', 'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY'];
    const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);
    
    if (missingEnvVars.length > 0) {
      colorLog('yellow', `⚠️ Missing optional environment variables: ${missingEnvVars.join(', ')}`);
      hasWarnings = true;
    } else {
      colorLog('green', '✅ Environment configuration complete');
    }

    // Final assessment
    colorLog('cyan', '\n📋 Validation Summary:');
    
    if (hasErrors) {
      colorLog('red', '❌ Build validation failed with errors');
      colorLog('red', '🚫 Build should not proceed to production');
      console.log('\nTo fix issues:');
      console.log('  Fix JSON syntax errors in data files');
      console.log('  npm run content:analyze');
      console.log('  npm run content:improve');
      process.exit(1);
    } else if (hasWarnings) {
      colorLog('yellow', '⚠️ Build validation completed with warnings');
      colorLog('yellow', '🔶 Consider addressing warnings before production deploy');
      console.log('\nTo improve content:');
      console.log('  npm run content:workflow');
    } else {
      colorLog('green', '✅ Build validation passed');
      colorLog('green', '🚀 Ready for production deploy');
    }

  } catch (error) {
    colorLog('red', `❌ Validation failed with error: ${error.message}`);
    console.error(error);
    process.exit(1);
  }
}

// Run the validation
main().catch(error => {
  console.error('Pre-build validation crashed:', error);
  process.exit(1);
});