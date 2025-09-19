#!/usr/bin/env node

/**
 * SIMPLE IMPROVER
 * Just sends one JSON file to the assistant and saves the response
 * No complex workflow, no status tracking, just simple in/out
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const API_KEY = process.env.OPENAI_API_KEY;
const ASSISTANT_ID = 'asst_0GsBgIUHApbshi9n1SSBISKg';

if (!API_KEY) {
  console.error('❌ No OpenAI API key found in .env.local');
  process.exit(1);
}

async function improveFile(fileName) {
  console.log(`\n📄 Processing ${fileName}...`);
  
  // Read the JSON file
  const filePath = path.join(__dirname, '..', 'data', fileName);
  if (!fs.existsSync(filePath)) {
    console.error(`❌ File not found: ${filePath}`);
    return;
  }
  
  const content = fs.readFileSync(filePath, 'utf8');
  const json = JSON.parse(content);
  
  console.log('📤 Sending to OpenAI Assistant...');
  
  try {
    // Create thread
    const threadResponse = await fetch('https://api.openai.com/v1/threads', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
        'OpenAI-Beta': 'assistants=v2'
      }
    });
    
    const thread = await threadResponse.json();
    
    // Send message
    const message = `Improve all text in this ${fileName} JSON file. Return ONLY the improved JSON, no explanations.

${JSON.stringify(json, null, 2)}`;
    
    await fetch(`https://api.openai.com/v1/threads/${thread.id}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
        'OpenAI-Beta': 'assistants=v2'
      },
      body: JSON.stringify({ role: 'user', content: message })
    });
    
    // Run assistant
    const runResponse = await fetch(`https://api.openai.com/v1/threads/${thread.id}/runs`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
        'OpenAI-Beta': 'assistants=v2'
      },
      body: JSON.stringify({ assistant_id: ASSISTANT_ID })
    });
    
    const run = await runResponse.json();
    
    // Wait for completion
    console.log('⏳ Waiting for response...');
    let complete = false;
    let attempts = 0;
    
    while (!complete && attempts < 30) {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const statusResponse = await fetch(`https://api.openai.com/v1/threads/${thread.id}/runs/${run.id}`, {
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'OpenAI-Beta': 'assistants=v2'
        }
      });
      
      const status = await statusResponse.json();
      
      if (status.status === 'completed') {
        complete = true;
      } else if (status.status === 'failed') {
        console.error('❌ Assistant failed:', status.last_error);
        return;
      }
      
      process.stdout.write('.');
      attempts++;
    }
    
    if (!complete) {
      console.error('\n❌ Timeout after 60 seconds');
      return;
    }
    
    // Get response
    console.log('\n📥 Getting response...');
    const messagesResponse = await fetch(`https://api.openai.com/v1/threads/${thread.id}/messages`, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'OpenAI-Beta': 'assistants=v2'
      }
    });
    
    const messages = await messagesResponse.json();
    const assistantMessage = messages.data.find(m => m.role === 'assistant');
    
    if (assistantMessage?.content[0]?.text?.value) {
      const response = assistantMessage.content[0].text.value;
      
      // Save to file
      const outputFile = path.join(__dirname, 'improvements', `${fileName.replace('.json', '')}_improved.json`);
      
      // Try to parse and format the JSON
      try {
        const improved = JSON.parse(response);
        fs.writeFileSync(outputFile, JSON.stringify(improved, null, 2));
        console.log(`✅ Saved to: improvements/${path.basename(outputFile)}`);
      } catch (e) {
        // If not valid JSON, save as text
        fs.writeFileSync(outputFile.replace('.json', '.txt'), response);
        console.log(`⚠️  Response wasn't valid JSON, saved as text file`);
      }
      
      console.log('\n📋 Response preview:');
      console.log(response.substring(0, 500) + '...\n');
      
    } else {
      console.error('❌ No response from assistant');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Process file from command line
const fileName = process.argv[2];

if (!fileName) {
  console.log(`
🚀 Simple Improver - Just send a JSON file to the assistant

Usage:
  node simple_improver.js [filename]

Examples:
  node simple_improver.js hero.json
  node simple_improver.js services.json
  node simple_improver.js pricing.json

Available files:
  ${fs.readdirSync(path.join(__dirname, '..', 'data'))
    .filter(f => f.endsWith('.json'))
    .join('\n  ')}
`);
} else {
  improveFile(fileName);
}