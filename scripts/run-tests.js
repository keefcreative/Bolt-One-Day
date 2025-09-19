#!/usr/bin/env node

/**
 * Test Runner Script
 * Runs different test suites based on command line arguments
 */

const { spawn } = require('child_process');
const path = require('path');

const args = process.argv.slice(2);
const command = args[0] || 'all';

const testCommands = {
  unit: ['npx', 'jest', '--testMatch', '**/*.unit.test.{js,ts}'],
  integration: ['npx', 'jest', '--testMatch', '**/*.integration.test.{js,ts}'],
  e2e: ['npx', 'jest', '--testMatch', '**/*.e2e.test.{js,ts}'],
  coverage: ['npx', 'jest', '--coverage'],
  main: ['npx', 'jest', '--selectProjects', 'main-project'],
  'content-improver': ['npx', 'jest', '--selectProjects', 'content-improver'],
  watch: ['npx', 'jest', '--watch'],
  all: ['npx', 'jest']
};

function runCommand(cmd, args, options = {}) {
  return new Promise((resolve, reject) => {
    console.log(`\n🚀 Running: ${cmd} ${args.join(' ')}\n`);
    
    const child = spawn(cmd, args, {
      stdio: 'inherit',
      cwd: process.cwd(),
      ...options
    });

    child.on('close', (code) => {
      if (code === 0) {
        console.log(`\n✅ Command completed successfully\n`);
        resolve(code);
      } else {
        console.log(`\n❌ Command failed with code ${code}\n`);
        reject(new Error(`Command failed with code ${code}`));
      }
    });

    child.on('error', (error) => {
      console.error(`\n❌ Error running command: ${error.message}\n`);
      reject(error);
    });
  });
}

async function runTests() {
  try {
    const testCommand = testCommands[command];
    
    if (!testCommand) {
      console.error(`❌ Unknown test command: ${command}`);
      console.log('Available commands:', Object.keys(testCommands).join(', '));
      process.exit(1);
    }

    // Set test environment variables
    process.env.NODE_ENV = 'test';
    process.env.OPENAI_API_KEY = process.env.OPENAI_API_KEY || 'test-key';
    process.env.CONTENT_SYSTEM_ENABLED = 'true';
    
    console.log(`📋 Running ${command} tests...`);
    console.log(`Environment: ${process.env.NODE_ENV}`);
    
    if (command === 'all') {
      // Run tests in sequence for better output
      console.log('\n🧪 Running Unit Tests...');
      await runCommand('npx', ['jest', '--testMatch', '**/*.unit.test.{js,ts}']);
      
      console.log('\n🔗 Running Integration Tests...');
      await runCommand('npx', ['jest', '--testMatch', '**/*.integration.test.{js,ts}']);
      
      console.log('\n🎯 Running E2E Tests...');
      await runCommand('npx', ['jest', '--testMatch', '**/*.e2e.test.{js,ts}']);
      
      console.log('\n📊 Generating Coverage Report...');
      await runCommand('npx', ['jest', '--coverage']);
      
    } else {
      const [cmd, ...cmdArgs] = testCommand;
      await runCommand(cmd, cmdArgs);
    }
    
    console.log('\n🎉 All tests completed successfully!');
    
  } catch (error) {
    console.error('\n💥 Test run failed:', error.message);
    process.exit(1);
  }
}

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('\n💥 Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('\n💥 Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

runTests();