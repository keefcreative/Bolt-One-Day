/**
 * Test utilities for content-improver
 */

// Mock OpenAI API responses
export function createMockOpenAIResponse(content, usage = { total_tokens: 100 }) {
  return {
    choices: [{
      message: {
        content: content,
        role: 'assistant'
      },
      finish_reason: 'stop'
    }],
    usage,
    model: 'gpt-4',
    id: 'chatcmpl-test-123',
    object: 'chat.completion',
    created: Date.now()
  }
}

// Mock file system for content-improver
export function setupMockFileSystem() {
  const mockFiles = {}
  
  const fs = require('fs')
  const path = require('path')
  
  // Reset mock implementation
  fs.readFileSync.mockImplementation((filePath) => {
    if (mockFiles[filePath]) {
      return mockFiles[filePath]
    }
    throw new Error(`ENOENT: no such file or directory, open '${filePath}'`)
  })
  
  fs.writeFileSync.mockImplementation((filePath, content) => {
    mockFiles[filePath] = content
  })
  
  fs.existsSync.mockImplementation((filePath) => {
    return !!mockFiles[filePath]
  })
  
  fs.mkdirSync.mockImplementation(() => {
    // Mock directory creation
  })
  
  fs.readdirSync.mockImplementation((dirPath) => {
    return Object.keys(mockFiles)
      .filter(path => path.startsWith(dirPath))
      .map(path => path.replace(dirPath + '/', '').split('/')[0])
      .filter((item, index, arr) => arr.indexOf(item) === index)
  })
  
  path.join.mockImplementation((...args) => args.join('/'))
  path.resolve.mockImplementation((...args) => `/${args.join('/')}`)
  path.dirname.mockImplementation((p) => p.split('/').slice(0, -1).join('/'))
  path.basename.mockImplementation((p) => p.split('/').pop())
  
  return {
    addFile: (filePath, content) => {
      mockFiles[filePath] = content
    },
    getFile: (filePath) => mockFiles[filePath],
    removeFile: (filePath) => {
      delete mockFiles[filePath]
    },
    listFiles: () => Object.keys(mockFiles),
    reset: () => {
      Object.keys(mockFiles).forEach(key => delete mockFiles[key])
    }
  }
}

// Create sample content data
export function createSampleContentData() {
  return {
    hero: {
      headline: "Transform Your Business",
      subheadline: "We help companies grow",
      cta: "Get Started"
    },
    services: [
      {
        title: "Web Design",
        description: "Beautiful, responsive websites"
      },
      {
        title: "Branding",
        description: "Complete brand identity packages"
      }
    ]
  }
}

// Create sample improvement results
export function createSampleImprovementResult() {
  return {
    improvements: [
      {
        file: 'data/hero.json',
        section: 'hero',
        field: 'headline',
        original: 'Transform Your Business',
        improved: 'Transform Your Business with Premium Design',
        reasoning: 'Added specificity about the service offering'
      }
    ],
    summary: {
      totalImprovements: 1,
      qualityScore: 85,
      brandAlignment: 'good'
    }
  }
}

// Mock process utilities
export function mockProcess() {
  const originalArgv = process.argv
  const originalCwd = process.cwd
  const originalExit = process.exit
  
  const mockExit = jest.fn()
  process.exit = mockExit
  
  return {
    setArgv: (argv) => {
      process.argv = argv
    },
    setCwd: (cwd) => {
      process.cwd = jest.fn().mockReturnValue(cwd)
    },
    mockExit,
    restore: () => {
      process.argv = originalArgv
      process.cwd = originalCwd
      process.exit = originalExit
    }
  }
}

// Console capture utilities
export function captureConsole() {
  const originalLog = console.log
  const originalError = console.error
  const originalWarn = console.warn
  
  const logs = []
  const errors = []
  const warnings = []
  
  console.log = jest.fn((...args) => {
    logs.push(args.join(' '))
  })
  
  console.error = jest.fn((...args) => {
    errors.push(args.join(' '))
  })
  
  console.warn = jest.fn((...args) => {
    warnings.push(args.join(' '))
  })
  
  return {
    getLogs: () => [...logs],
    getErrors: () => [...errors],
    getWarnings: () => [...warnings],
    restore: () => {
      console.log = originalLog
      console.error = originalError
      console.warn = originalWarn
    }
  }
}

// Async test utilities
export async function waitFor(condition, timeout = 1000) {
  const startTime = Date.now()
  
  while (Date.now() - startTime < timeout) {
    if (await condition()) {
      return true
    }
    await new Promise(resolve => setTimeout(resolve, 10))
  }
  
  throw new Error(`Condition not met within ${timeout}ms`)
}

// Mock API client
export function createMockApiClient() {
  const mockResponses = new Map()
  
  const mockClient = {
    setResponse: (endpoint, response) => {
      mockResponses.set(endpoint, response)
    },
    post: jest.fn(async (endpoint, data) => {
      if (mockResponses.has(endpoint)) {
        return mockResponses.get(endpoint)
      }
      throw new Error(`No mock response set for ${endpoint}`)
    }),
    get: jest.fn(async (endpoint) => {
      if (mockResponses.has(endpoint)) {
        return mockResponses.get(endpoint)
      }
      throw new Error(`No mock response set for ${endpoint}`)
    }),
    reset: () => {
      mockResponses.clear()
      mockClient.post.mockClear()
      mockClient.get.mockClear()
    }
  }
  
  return mockClient
}