#!/usr/bin/env node

/**
 * OpenAI Assistant-Powered Content Improvement System
 * Uses your dedicated DWB-BrandVoice assistant for consistent brand voice
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

class AssistantContentImprover {
  constructor(options = {}) {
    this.apiKey = options.apiKey || process.env.OPENAI_API_KEY;
    this.assistantId = options.assistantId || 'asst_0GsBgIUHApbshi9n1SSBISKg'; // Your DWB-BrandVoice assistant
    this.baseURL = 'https://api.openai.com/v1';
    
    if (!this.apiKey) {
      throw new Error('OpenAI API key required. Add OPENAI_API_KEY to .env.local');
    }
    
    console.log('🤖 Using OpenAI Assistant: DWB-BrandVoice');
    console.log(`   Assistant ID: ${this.assistantId}`);
  }

  /**
   * Create a thread for conversation
   */
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

  /**
   * Send message to assistant
   */
  async sendMessage(threadId, content) {
    const response = await fetch(`${this.baseURL}/threads/${threadId}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        'OpenAI-Beta': 'assistants=v2'
      },
      body: JSON.stringify({
        role: 'user',
        content
      })
    });

    const data = await response.json();
    if (data.error) throw new Error(data.error.message);
    return data.id;
  }

  /**
   * Run assistant on thread
   */
  async runAssistant(threadId, instructions = null) {
    const body = {
      assistant_id: this.assistantId,
      response_format: { type: "json_object" }
    };
    
    if (instructions) {
      body.additional_instructions = instructions;
    }

    const response = await fetch(`${this.baseURL}/threads/${threadId}/runs`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        'OpenAI-Beta': 'assistants=v2'
      },
      body: JSON.stringify(body)
    });

    const data = await response.json();
    if (data.error) throw new Error(data.error.message);
    return data.id;
  }

  /**
   * Wait for run to complete
   */
  async waitForCompletion(threadId, runId, maxAttempts = 30) {
    for (let i = 0; i < maxAttempts; i++) {
      const response = await fetch(`${this.baseURL}/threads/${threadId}/runs/${runId}`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'OpenAI-Beta': 'assistants=v2'
        }
      });

      const run = await response.json();
      
      if (run.status === 'completed') {
        return run;
      } else if (run.status === 'failed' || run.status === 'cancelled' || run.status === 'expired') {
        throw new Error(`Run ${run.status}: ${run.last_error?.message || 'Unknown error'}`);
      }
      
      // Wait 1 second before checking again
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    throw new Error('Run timed out after 30 seconds');
  }

  /**
   * Get messages from thread
   */
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

  /**
   * Analyze and improve content using assistant
   */
  async analyzeAndImprove(text, contentType = 'general', context = {}) {
    const threadId = await this.createThread();
    
    // Determine customer journey stage and intent
    const journeyStage = context.journeyStage || this.detectJourneyStage(contentType);
    const primaryIntent = context.intent || this.detectIntent(contentType, text);
    
    const prompt = `Analyze and improve this ${contentType} content.

CONTEXT:
- Customer Journey Stage: ${journeyStage}
- Primary Intent: ${primaryIntent}
- Content Type: ${contentType}

ORIGINAL TEXT:
"${text}"

Apply the multi-layer analysis framework:
1. Intent & Purpose: What should this achieve?
2. Psychology: What triggers will drive action?
3. Brand Voice: Honest, direct, human, balanced
4. Emotion: What should the reader feel?

Focus on CONVERSION not just brand compliance.

Respond with a JSON object:
{
  "analysis": {
    "currentIntent": "What it's trying to do now",
    "effectiveness": "Why it's not converting",
    "missingElements": ["list what's missing"],
    "voiceIssues": ["brand voice problems"]
  },
  "improved": "Your improved version that converts better",
  "improvements": {
    "intent": "How intent is clearer",
    "psychology": "What triggers added",
    "voice": "How brand voice applied",
    "emotion": "What feeling created"
  },
  "expectedImpact": {
    "conversionLift": 45,
    "reasoning": "Why this converts better"
  }
}`;

    await this.sendMessage(threadId, prompt);
    const runId = await this.runAssistant(threadId);
    await this.waitForCompletion(threadId, runId);
    
    const messages = await this.getMessages(threadId);
    const assistantMessage = messages.find(m => m.role === 'assistant');
    
    if (assistantMessage && assistantMessage.content[0]?.text?.value) {
      try {
        return JSON.parse(assistantMessage.content[0].text.value);
      } catch (e) {
        console.error('Failed to parse JSON response:', e);
        return {
          analysis: "Analysis failed",
          improved: text,
          changes: [],
          scoreImprovement: 0,
          error: e.message
        };
      }
    }
    
    throw new Error('No response from assistant');
  }

  /**
   * Generate new content using assistant
   */
  async generateContent(contentType, context) {
    const threadId = await this.createThread();
    
    const prompts = {
      hero: `Create a powerful hero section.
Context: ${context || 'Premium design subscription for growing businesses'}

Respond with JSON:
{
  "headline": "The main headline",
  "subheadline": "Supporting text",
  "cta": "Call to action button text",
  "description": "Brief description"
}`,

      cta: `Create 5 compelling call-to-action variations.
Context: ${context || 'Get started with design subscription'}

Respond with JSON:
{
  "primary": "Main CTA",
  "alternatives": ["alt1", "alt2", "alt3", "alt4"]
}`,

      testimonial: `Write a realistic customer testimonial.
Context: ${context || 'Happy customer sharing their experience'}

Respond with JSON:
{
  "quote": "The testimonial text",
  "author": "Customer Name",
  "role": "Title at Company",
  "impact": "Specific result achieved"
}`,

      feature: `Write a feature description that focuses on benefit.
Context: ${context || 'Unlimited design revisions'}

Respond with JSON:
{
  "title": "Feature title",
  "description": "Feature description",
  "benefit": "Customer benefit",
  "proof": "Specific proof point"
}`
    };

    const prompt = prompts[contentType] || `Generate ${contentType} content. Context: ${context}`;
    
    await this.sendMessage(threadId, prompt);
    const runId = await this.runAssistant(threadId);
    await this.waitForCompletion(threadId, runId);
    
    const messages = await this.getMessages(threadId);
    const assistantMessage = messages.find(m => m.role === 'assistant');
    
    if (assistantMessage && assistantMessage.content[0]?.text?.value) {
      try {
        return JSON.parse(assistantMessage.content[0].text.value);
      } catch (e) {
        return { error: 'Failed to parse response', raw: assistantMessage.content[0].text.value };
      }
    }
    
    throw new Error('No response from assistant');
  }

  /**
   * Batch analyze multiple texts efficiently
   */
  async batchAnalyze(items) {
    const threadId = await this.createThread();
    const results = [];
    
    for (const item of items) {
      const prompt = `Improve this ${item.type || 'general'} content:
"${item.text}"

Respond with JSON: { "improved": "...", "scoreImprovement": 0 }`;
      
      await this.sendMessage(threadId, prompt);
      const runId = await this.runAssistant(threadId);
      await this.waitForCompletion(threadId, runId);
      
      const messages = await this.getMessages(threadId);
      const lastMessage = messages[0]; // Most recent message
      
      if (lastMessage && lastMessage.role === 'assistant') {
        try {
          const result = JSON.parse(lastMessage.content[0].text.value);
          results.push({ ...item, ...result });
        } catch (e) {
          results.push({ ...item, error: 'Parse error' });
        }
      }
    }
    
    return results;
  }

  /**
   * Analyze entire file
   */
  async analyzeFile(filePath) {
    const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const fileName = path.basename(filePath);
    const improvements = [];
    
    console.log(`\n🤖 Assistant Analysis of ${fileName}...\n`);
    
    const analyzeObject = async (obj, pathPrefix = '') => {
      for (const [key, value] of Object.entries(obj)) {
        const currentPath = pathPrefix ? `${pathPrefix}.${key}` : key;
        
        if (typeof value === 'string' && value.length > 20 && value.length < 500) {
          const contentType = this.detectContentType(key, value);
          
          try {
            const result = await this.analyzeAndImprove(value, contentType);
            
            if (result.scoreImprovement > 10) {
              improvements.push({
                path: currentPath,
                original: value,
                improved: result.improved,
                analysis: result.analysis,
                changes: result.changes,
                scoreImprovement: result.scoreImprovement
              });
              
              console.log(`✨ ${currentPath}: +${result.scoreImprovement}% improvement`);
            }
          } catch (error) {
            console.error(`   Error analyzing ${currentPath}:`, error.message);
          }
          
          // Add small delay to avoid rate limiting
          await new Promise(resolve => setTimeout(resolve, 500));
        } else if (Array.isArray(value)) {
          for (let i = 0; i < value.length; i++) {
            if (typeof value[i] === 'object') {
              await analyzeObject(value[i], `${currentPath}[${i}]`);
            }
          }
        } else if (typeof value === 'object' && value !== null) {
          await analyzeObject(value, currentPath);
        }
      }
    };
    
    await analyzeObject(content);
    
    return {
      file: fileName,
      improvements,
      totalImprovements: improvements.length,
      avgScoreImprovement: improvements.length > 0 
        ? improvements.reduce((sum, i) => sum + i.scoreImprovement, 0) / improvements.length
        : 0
    };
  }

  detectContentType(fieldName, content) {
    fieldName = fieldName.toLowerCase();
    
    if (fieldName.includes('title') || fieldName.includes('headline')) return 'headline';
    if (fieldName.includes('description') || fieldName.includes('desc')) return 'description';
    if (fieldName.includes('cta') || fieldName.includes('button')) return 'cta';
    if (fieldName.includes('testimonial') || fieldName.includes('quote')) return 'testimonial';
    if (fieldName.includes('feature')) return 'feature';
    
    if (content.length < 50) return 'headline';
    if (content.length < 150) return 'description';
    
    return 'general';
  }
  
  detectJourneyStage(contentType) {
    const stageMap = {
      'hero': 'awareness',
      'headline': 'awareness',
      'feature': 'consideration',
      'testimonial': 'decision',
      'cta': 'decision',
      'pricing': 'decision',
      'faq': 'consideration',
      'about': 'consideration'
    };
    
    return stageMap[contentType] || 'awareness';
  }
  
  detectIntent(contentType, text) {
    // Analyze content type and text to determine primary intent
    const intentPatterns = {
      'build_trust': ['trusted', 'reliable', 'experience', 'years', 'clients'],
      'overcome_objections': ['guarantee', 'risk-free', 'refund', 'no commitment'],
      'create_urgency': ['limited', 'now', 'today', 'spots', 'remaining'],
      'showcase_value': ['value', 'roi', 'results', 'benefit', 'transform'],
      'generate_leads': ['free', 'trial', 'demo', 'consultation', 'get started']
    };
    
    // Check which intent patterns match
    for (const [intent, keywords] of Object.entries(intentPatterns)) {
      if (keywords.some(keyword => text.toLowerCase().includes(keyword))) {
        return intent;
      }
    }
    
    // Default intents by content type
    const defaultIntents = {
      'headline': 'capture_attention',
      'cta': 'drive_action',
      'testimonial': 'build_trust',
      'feature': 'showcase_value',
      'description': 'generate_interest'
    };
    
    return defaultIntents[contentType] || 'generate_interest';
  }
}

// CLI Usage
if (process.argv[1]?.endsWith('assistant_content_improver.js')) {
  const command = process.argv[2];
  const args = process.argv.slice(3);
  
  const improver = new AssistantContentImprover();
  
  if (!command || command === '--help') {
    console.log(`
🤖 OpenAI Assistant Content Improver

Commands:
  improve <text>      Improve a piece of text
  generate <type>     Generate new content (hero, cta, testimonial, feature)
  analyze <file>      Analyze and improve all content in a JSON file
  test                Test the assistant connection

Examples:
  node assistant_content_improver.js improve "We leverage synergies"
  node assistant_content_improver.js generate hero "Design for startups"
  node assistant_content_improver.js analyze ../data/hero.json
    `);
    process.exit(0);
  }
  
  (async () => {
    try {
      if (command === 'test') {
        console.log('Testing assistant connection...');
        const result = await improver.analyzeAndImprove(
          'We leverage cutting-edge synergies for seamless solutions.',
          'description'
        );
        console.log('\nResult:', JSON.stringify(result, null, 2));
        
      } else if (command === 'improve') {
        const text = args.join(' ');
        if (!text) {
          console.error('Please provide text to improve');
          process.exit(1);
        }
        
        const result = await improver.analyzeAndImprove(text);
        console.log('\nOriginal:', text);
        console.log('Improved:', result.improved);
        console.log('Score Improvement:', result.scoreImprovement + '%');
        console.log('Changes:', result.changes);
        
      } else if (command === 'generate') {
        const type = args[0] || 'hero';
        const context = args.slice(1).join(' ');
        
        console.log(`Generating ${type} content...`);
        const result = await improver.generateContent(type, context);
        console.log('\nGenerated Content:');
        console.log(JSON.stringify(result, null, 2));
        
      } else if (command === 'analyze') {
        const file = args[0];
        if (!file) {
          console.error('Please provide a file to analyze');
          process.exit(1);
        }
        
        const result = await improver.analyzeFile(file);
        console.log('\n' + '='.repeat(60));
        console.log(`Found ${result.totalImprovements} improvements`);
        console.log(`Average score improvement: ${result.avgScoreImprovement.toFixed(1)}%`);
        
        if (result.improvements.length > 0) {
          console.log('\nTop improvements:');
          result.improvements.slice(0, 3).forEach(imp => {
            console.log(`\n${imp.path}: +${imp.scoreImprovement}%`);
            console.log('Before:', imp.original.substring(0, 100));
            console.log('After:', imp.improved.substring(0, 100));
          });
        }
      }
      
    } catch (error) {
      console.error('Error:', error.message);
      process.exit(1);
    }
  })();
}

export default AssistantContentImprover;