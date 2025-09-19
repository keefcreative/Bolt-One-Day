/**
 * Mock OpenAI API responses
 */

export const mockOpenAICompletion = {
  id: 'chatcmpl-test-123',
  object: 'chat.completion' as const,
  created: 1699000000,
  model: 'gpt-4-turbo-preview',
  choices: [{
    index: 0,
    message: {
      role: 'assistant' as const,
      content: `{
        "improvements": [
          {
            "file": "data/hero.json",
            "section": "hero",
            "field": "headline",
            "original": "Transform Your Business",
            "improved": "Transform Your Business with Premium Design Solutions",
            "reasoning": "Added specificity and value proposition to make the headline more compelling"
          }
        ],
        "summary": {
          "totalImprovements": 1,
          "qualityScore": 88,
          "brandAlignment": "excellent"
        }
      }`,
    },
    finish_reason: 'stop' as const,
  }],
  usage: {
    prompt_tokens: 150,
    completion_tokens: 100,
    total_tokens: 250,
  },
}

export const mockOpenAIError = {
  error: {
    message: 'Rate limit exceeded',
    type: 'rate_limit_error',
    code: 'rate_limit_exceeded',
  },
}

export const mockBrandVoiceAnalysis = {
  id: 'chatcmpl-brand-456',
  object: 'chat.completion' as const,
  created: 1699000000,
  model: 'gpt-4-turbo-preview',
  choices: [{
    index: 0,
    message: {
      role: 'assistant' as const,
      content: `{
        "brandAlignment": {
          "score": 85,
          "tone": "professional",
          "voice": "confident",
          "style": "modern"
        },
        "suggestions": [
          "Consider adding more emotional connection in CTAs",
          "Headlines could be more action-oriented"
        ]
      }`,
    },
    finish_reason: 'stop' as const,
  }],
  usage: {
    prompt_tokens: 200,
    completion_tokens: 80,
    total_tokens: 280,
  },
}

export const mockContentAnalysis = {
  id: 'chatcmpl-analysis-789',
  object: 'chat.completion' as const,
  created: 1699000000,
  model: 'gpt-4-turbo-preview',
  choices: [{
    index: 0,
    message: {
      role: 'assistant' as const,
      content: `{
        "analysis": {
          "readabilityScore": 78,
          "seoScore": 82,
          "engagementPotential": 85,
          "issues": [
            "Some sentences are too long",
            "Missing meta descriptions"
          ],
          "strengths": [
            "Clear value proposition",
            "Good use of action words"
          ]
        }
      }`,
    },
    finish_reason: 'stop' as const,
  }],
  usage: {
    prompt_tokens: 300,
    completion_tokens: 120,
    total_tokens: 420,
  },
}

// Mock OpenAI client
export function createMockOpenAI() {
  return {
    chat: {
      completions: {
        create: jest.fn().mockResolvedValue(mockOpenAICompletion),
      },
    },
  }
}

// Mock fetch for OpenAI API
export function mockOpenAIFetch() {
  const originalFetch = global.fetch
  
  global.fetch = jest.fn().mockImplementation(async (url: string) => {
    if (url.includes('openai.com/v1/chat/completions')) {
      return {
        ok: true,
        status: 200,
        json: async () => mockOpenAICompletion,
      }
    }
    
    return originalFetch(url)
  })
  
  return () => {
    global.fetch = originalFetch
  }
}