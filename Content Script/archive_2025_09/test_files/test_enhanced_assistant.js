#!/usr/bin/env node

/**
 * Test Enhanced Assistant with Intent Analysis
 */

import AssistantContentImprover from './assistant_content_improver.js';
import chalk from 'chalk';

async function testEnhancedAnalysis() {
  const improver = new AssistantContentImprover();
  
  console.log(chalk.bold.cyan('\n🧪 Testing Enhanced Assistant with Intent Analysis\n'));
  console.log(chalk.gray('=' .repeat(60)));
  
  // Test cases with different intents
  const testCases = [
    {
      text: "Premium Design, Without the Premium Price",
      type: 'headline',
      context: { 
        journeyStage: 'awareness',
        intent: 'capture_attention'
      },
      description: 'Hero headline - needs to capture attention and convey value'
    },
    {
      text: "Get Started Today",
      type: 'cta', 
      context: {
        journeyStage: 'decision',
        intent: 'drive_action'
      },
      description: 'Generic CTA - needs specificity and urgency'
    },
    {
      text: "We provide comprehensive design solutions tailored to meet your business needs",
      type: 'description',
      context: {
        journeyStage: 'consideration', 
        intent: 'showcase_value'
      },
      description: 'Service description - too vague and corporate'
    }
  ];
  
  for (const testCase of testCases) {
    console.log(chalk.yellow(`\n📝 Test: ${testCase.description}`));
    console.log(chalk.gray(`Type: ${testCase.type} | Stage: ${testCase.context.journeyStage}`));
    console.log(chalk.red(`Original: "${testCase.text}"`));
    
    try {
      const result = await improver.analyzeAndImprove(
        testCase.text,
        testCase.type,
        testCase.context
      );
      
      console.log(chalk.green(`\n✨ Improved: "${result.improved || 'N/A'}"`));
      
      if (result.analysis) {
        console.log(chalk.cyan('\n📊 Analysis:'));
        console.log(`  Intent: ${result.analysis.currentIntent || 'N/A'}`);
        console.log(`  Effectiveness: ${result.analysis.effectiveness || 'N/A'}`);
        if (result.analysis.missingElements?.length > 0) {
          console.log(`  Missing: ${result.analysis.missingElements.join(', ')}`);
        }
      }
      
      if (result.improvements) {
        console.log(chalk.magenta('\n🎯 Improvements:'));
        console.log(`  Intent: ${result.improvements.intent || 'N/A'}`);
        console.log(`  Psychology: ${result.improvements.psychology || 'N/A'}`);
        console.log(`  Voice: ${result.improvements.voice || 'N/A'}`);
        console.log(`  Emotion: ${result.improvements.emotion || 'N/A'}`);
      }
      
      if (result.expectedImpact) {
        console.log(chalk.bold.green(`\n📈 Expected Impact:`));
        console.log(`  Conversion Lift: +${result.expectedImpact.conversionLift || 0}%`);
        console.log(`  Reasoning: ${result.expectedImpact.reasoning || 'N/A'}`);
      }
      
    } catch (error) {
      console.error(chalk.red(`  Error: ${error.message}`));
    }
    
    console.log(chalk.gray('\n' + '-'.repeat(60)));
    
    // Add delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 1500));
  }
  
  console.log(chalk.bold.cyan('\n✅ Enhanced Testing Complete!\n'));
  console.log(chalk.yellow('💡 Key Insights:'));
  console.log('  • Intent analysis adds strategic depth');
  console.log('  • Psychology triggers drive action');
  console.log('  • Journey stage awareness improves relevance');
  console.log('  • Brand voice + conversion focus = better results\n');
}

// Run test
testEnhancedAnalysis().catch(console.error);