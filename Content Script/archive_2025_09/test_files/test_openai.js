#!/usr/bin/env node

import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

async function testOpenAI() {
  const apiKey = process.env.OPENAI_API_KEY;
  
  if (!apiKey) {
    console.log('❌ No OpenAI API key found in .env.local');
    return;
  }
  
  console.log('🔍 Testing OpenAI API...');
  console.log('API Key length:', apiKey.length);
  
  try {
    // Test with a simple completion
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a brand voice expert. Transform corporate jargon into clear, human language.'
          },
          {
            role: 'user',
            content: 'Improve this text: "We leverage cutting-edge synergies to deliver seamless design solutions."'
          }
        ],
        temperature: 0.7,
        max_tokens: 150
      })
    });
    
    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ OpenAI API is working!');
      console.log('\nOriginal text:');
      console.log('"We leverage cutting-edge synergies to deliver seamless design solutions."');
      console.log('\nAI improved version:');
      console.log(data.choices[0].message.content);
    } else {
      console.log('❌ API Error:', data.error?.message || data);
    }
    
  } catch (error) {
    console.error('❌ Connection error:', error.message);
  }
}

testOpenAI();