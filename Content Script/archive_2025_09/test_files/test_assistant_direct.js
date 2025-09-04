#!/usr/bin/env node

/**
 * Direct test of OpenAI Assistant to debug issues
 */

import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';
import { dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const apiKey = process.env.OPENAI_API_KEY;
const assistantId = process.env.OPENAI_BRANDVOICE_ASSISTANT_ID || 'asst_0GsBgIUHApbshi9n1SSBISKg';

console.log('Testing OpenAI Assistant connection...');
console.log('API Key:', apiKey ? `${apiKey.substring(0, 20)}...` : 'NOT FOUND');
console.log('Assistant ID:', assistantId);

async function testAssistant() {
  try {
    // Test 1: Check if we can reach OpenAI
    console.log('\n1. Testing API connection...');
    const testResponse = await fetch('https://api.openai.com/v1/models', {
      headers: {
        'Authorization': `Bearer ${apiKey}`
      }
    });
    
    if (!testResponse.ok) {
      console.log('API Response Status:', testResponse.status);
      const error = await testResponse.text();
      console.log('API Error:', error);
      return;
    }
    console.log('✓ API connection successful');
    
    // Test 2: Create a thread
    console.log('\n2. Creating thread...');
    const threadResponse = await fetch('https://api.openai.com/v1/threads', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'OpenAI-Beta': 'assistants=v2'
      }
    });
    
    if (!threadResponse.ok) {
      console.log('Thread Response Status:', threadResponse.status);
      const error = await threadResponse.text();
      console.log('Thread Error:', error);
      return;
    }
    
    const thread = await threadResponse.json();
    console.log('✓ Thread created:', thread.id);
    
    // Test 3: Send a simple message
    console.log('\n3. Sending test message...');
    const message = `Improve this to exactly 4 words: "Premium Design & Development"
    
Return ONLY the improved text, no JSON, no formatting. Just 4 words.`;
    
    const messageResponse = await fetch(`https://api.openai.com/v1/threads/${thread.id}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'OpenAI-Beta': 'assistants=v2'
      },
      body: JSON.stringify({
        role: 'user',
        content: message
      })
    });
    
    if (!messageResponse.ok) {
      console.log('Message Response Status:', messageResponse.status);
      const error = await messageResponse.text();
      console.log('Message Error:', error);
      return;
    }
    console.log('✓ Message sent');
    
    // Test 4: Run the assistant
    console.log('\n4. Running assistant...');
    const runResponse = await fetch(`https://api.openai.com/v1/threads/${thread.id}/runs`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'OpenAI-Beta': 'assistants=v2'
      },
      body: JSON.stringify({
        assistant_id: assistantId
      })
    });
    
    if (!runResponse.ok) {
      console.log('Run Response Status:', runResponse.status);
      const error = await runResponse.text();
      console.log('Run Error:', error);
      return;
    }
    
    const run = await runResponse.json();
    console.log('✓ Run started:', run.id);
    
    // Test 5: Wait for completion
    console.log('\n5. Waiting for completion...');
    let attempts = 0;
    let completed = false;
    
    while (attempts < 30 && !completed) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const statusResponse = await fetch(`https://api.openai.com/v1/threads/${thread.id}/runs/${run.id}`, {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'OpenAI-Beta': 'assistants=v2'
        }
      });
      
      const status = await statusResponse.json();
      
      if (status.status === 'completed') {
        completed = true;
        console.log('✓ Run completed');
      } else if (status.status === 'failed' || status.status === 'cancelled' || status.status === 'expired') {
        console.log('✗ Run failed:', status.status);
        if (status.last_error) {
          console.log('Error details:', status.last_error);
        }
        return;
      } else {
        process.stdout.write('.');
        attempts++;
      }
    }
    
    if (!completed) {
      console.log('\n✗ Timeout after 30 seconds');
      return;
    }
    
    // Test 6: Get the response
    console.log('\n6. Getting response...');
    const messagesResponse = await fetch(`https://api.openai.com/v1/threads/${thread.id}/messages`, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'OpenAI-Beta': 'assistants=v2'
      }
    });
    
    const messages = await messagesResponse.json();
    const assistantMessage = messages.data.find(m => m.role === 'assistant');
    
    if (assistantMessage) {
      const response = assistantMessage.content[0]?.text?.value;
      console.log('✓ Assistant response:', response);
      
      // Check if it's returning JSON when it shouldn't
      if (response && response.includes('{')) {
        console.log('\n⚠️  Warning: Assistant returned JSON despite instructions');
      }
    } else {
      console.log('✗ No assistant message found');
    }
    
  } catch (error) {
    console.error('\n✗ Error:', error.message);
    if (error.cause) {
      console.error('Cause:', error.cause);
    }
  }
}

testAssistant();