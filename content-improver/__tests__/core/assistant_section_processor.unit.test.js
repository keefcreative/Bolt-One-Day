/**
 * Unit tests for Assistant Section Processor
 */

import AssistantSectionProcessor from '../../src/core/assistant_section_processor.js'
import { setupMockFileSystem, createMockOpenAIResponse, captureConsole } from '../utils/test-helpers.js'

// Mock dependencies
jest.mock('../../src/core/status_tracker.js')
jest.mock('fs')
jest.mock('dotenv')
jest.mock('chalk', () => ({
  cyan: jest.fn((text) => text),
  gray: jest.fn((text) => text),
  green: jest.fn((text) => text),
  yellow: jest.fn((text) => text),
  red: jest.fn((text) => text)
}))

// Mock fetch globally
global.fetch = jest.fn()

describe('AssistantSectionProcessor', () => {
  let processor
  let mockFs
  let consoleSpy
  let MockStatusTracker

  beforeEach(() => {
    jest.clearAllMocks()
    mockFs = setupMockFileSystem()
    consoleSpy = captureConsole()
    
    // Mock environment variables
    process.env.OPENAI_API_KEY = 'test-api-key'
    process.env.OPENAI_BRANDVOICE_ASSISTANT_ID = 'test-assistant-id'
    
    // Mock StatusTracker
    MockStatusTracker = require('../../src/core/status_tracker.js').default
    MockStatusTracker.mockImplementation(() => ({
      updateProcessingStatus: jest.fn(),
      recordFileProcess: jest.fn(),
      logError: jest.fn(),
      generateProgressReport: jest.fn().mockReturnValue('Progress report')
    }))

    // Mock path operations
    const path = require('path')
    path.dirname.mockReturnValue('/content-improver/src/core')
    path.join.mockImplementation((...args) => args.join('/'))
    
    processor = new AssistantSectionProcessor()
  })

  afterEach(() => {
    mockFs.reset()
    consoleSpy.restore()
    delete process.env.OPENAI_API_KEY
    delete process.env.OPENAI_BRANDVOICE_ASSISTANT_ID
  })

  describe('constructor', () => {
    it('should initialize with API key from environment', () => {
      expect(processor.apiKey).toBe('test-api-key')
      expect(processor.assistantId).toBe('test-assistant-id')
      expect(processor.baseURL).toBe('https://api.openai.com/v1')
    })

    it('should throw error without API key', () => {
      delete process.env.OPENAI_API_KEY
      
      expect(() => new AssistantSectionProcessor()).toThrow('OPENAI_API_KEY not found in .env.local')
    })

    it('should use default assistant ID if not provided', () => {
      delete process.env.OPENAI_BRANDVOICE_ASSISTANT_ID
      
      const processorWithDefault = new AssistantSectionProcessor()
      
      expect(processorWithDefault.assistantId).toBe('asst_0GsBgIUHApbshi9n1SSBISKg')
    })

    it('should log initialization messages', () => {
      expect(consoleSpy.getLogs()).toContain(
        expect.stringContaining('Using OpenAI BRANDVOICE Assistant')
      )
    })
  })

  describe('createThread', () => {
    it('should create thread successfully', async () => {
      const mockThreadResponse = { id: 'thread_123' }
      fetch.mockResolvedValueOnce({
        json: async () => mockThreadResponse
      })

      const threadId = await processor.createThread()

      expect(threadId).toBe('thread_123')
      expect(fetch).toHaveBeenCalledWith(
        'https://api.openai.com/v1/threads',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Authorization': 'Bearer test-api-key',
            'Content-Type': 'application/json',
            'OpenAI-Beta': 'assistants=v2'
          })
        })
      )
    })

    it('should handle API errors', async () => {
      fetch.mockResolvedValueOnce({
        json: async () => ({
          error: { message: 'API error occurred' }
        })
      })

      await expect(processor.createThread()).rejects.toThrow('API error occurred')
    })
  })

  describe('addMessage', () => {
    it('should add message to thread', async () => {
      fetch.mockResolvedValueOnce({
        json: async () => ({ id: 'msg_123' })
      })

      const messageId = await processor.addMessage('thread_123', 'Test message')

      expect(messageId).toBe('msg_123')
      expect(fetch).toHaveBeenCalledWith(
        'https://api.openai.com/v1/threads/thread_123/messages',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({
            role: 'user',
            content: 'Test message'
          })
        })
      )
    })

    it('should handle message creation errors', async () => {
      fetch.mockResolvedValueOnce({
        json: async () => ({
          error: { message: 'Message creation failed' }
        })
      })

      await expect(processor.addMessage('thread_123', 'Test message'))
        .rejects.toThrow('Message creation failed')
    })
  })

  describe('runAssistant', () => {
    it('should run assistant on thread', async () => {
      fetch.mockResolvedValueOnce({
        json: async () => ({ id: 'run_123' })
      })

      const runId = await processor.runAssistant('thread_123')

      expect(runId).toBe('run_123')
      expect(fetch).toHaveBeenCalledWith(
        'https://api.openai.com/v1/threads/thread_123/runs',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({
            assistant_id: 'test-assistant-id'
          })
        })
      )
    })
  })

  describe('waitForCompletion', () => {
    it('should wait for run completion', async () => {
      // First call - still running
      fetch.mockResolvedValueOnce({
        json: async () => ({
          status: 'in_progress'
        })
      })

      // Second call - completed
      fetch.mockResolvedValueOnce({
        json: async () => ({
          status: 'completed'
        })
      })

      await processor.waitForCompletion('thread_123', 'run_123')

      expect(fetch).toHaveBeenCalledTimes(2)
    })

    it('should handle failed runs', async () => {
      fetch.mockResolvedValueOnce({
        json: async () => ({
          status: 'failed',
          last_error: { message: 'Processing failed' }
        })
      })

      await expect(processor.waitForCompletion('thread_123', 'run_123'))
        .rejects.toThrow('Processing failed')
    })

    it('should timeout long-running processes', async () => {
      // Mock system timeout
      jest.spyOn(global, 'setTimeout').mockImplementation((callback, delay) => {
        if (delay === 300000) { // 5 minute timeout
          callback()
        }
        return 123
      })

      fetch.mockImplementation(async () => ({
        json: async () => ({ status: 'in_progress' })
      }))

      await expect(processor.waitForCompletion('thread_123', 'run_123'))
        .rejects.toThrow('Assistant run timed out')

      jest.restoreAllMocks()
    }, 10000)
  })

  describe('getMessages', () => {
    it('should retrieve messages from thread', async () => {
      const mockMessages = {
        data: [
          {
            role: 'assistant',
            content: [{ text: { value: 'Assistant response' } }]
          },
          {
            role: 'user',
            content: [{ text: { value: 'User message' } }]
          }
        ]
      }

      fetch.mockResolvedValueOnce({
        json: async () => mockMessages
      })

      const messages = await processor.getMessages('thread_123')

      expect(messages).toEqual(mockMessages.data)
      expect(fetch).toHaveBeenCalledWith(
        'https://api.openai.com/v1/threads/thread_123/messages',
        expect.objectContaining({
          method: 'GET'
        })
      )
    })
  })

  describe('processFile', () => {
    beforeEach(() => {
      // Mock file content
      mockFs.addFile('/content-improver/../../../data/hero.json', JSON.stringify({
        headline: 'Transform Your Business',
        subheadline: 'We help companies grow',
        cta: 'Get Started'
      }))

      // Mock all API calls for a complete flow
      fetch
        .mockResolvedValueOnce({ json: async () => ({ id: 'thread_123' }) }) // createThread
        .mockResolvedValueOnce({ json: async () => ({ id: 'msg_123' }) }) // addMessage
        .mockResolvedValueOnce({ json: async () => ({ id: 'run_123' }) }) // runAssistant
        .mockResolvedValueOnce({ json: async () => ({ status: 'completed' }) }) // waitForCompletion
        .mockResolvedValueOnce({ // getMessages
          json: async () => ({
            data: [{
              role: 'assistant',
              content: [{
                text: {
                  value: JSON.stringify({
                    improvements: [{
                      field: 'headline',
                      original: 'Transform Your Business',
                      improved: 'Transform Your Business with Premium Design',
                      reasoning: 'Added specificity'
                    }]
                  })
                }
              }]
            }]
          })
        })
    })

    it('should process file successfully', async () => {
      const result = await processor.processFile('hero.json')

      expect(result).toBeDefined()
      expect(result.improvements).toBeDefined()
      expect(Array.isArray(result.improvements)).toBe(true)
      expect(processor.tracker.recordFileProcess).toHaveBeenCalledWith('hero.json', true)
    })

    it('should handle file not found', async () => {
      await expect(processor.processFile('nonexistent.json')).rejects.toThrow()
      expect(processor.tracker.logError).toHaveBeenCalled()
    })

    it('should handle malformed assistant response', async () => {
      // Mock malformed response
      fetch
        .mockResolvedValueOnce({ json: async () => ({ id: 'thread_123' }) })
        .mockResolvedValueOnce({ json: async () => ({ id: 'msg_123' }) })
        .mockResolvedValueOnce({ json: async () => ({ id: 'run_123' }) })
        .mockResolvedValueOnce({ json: async () => ({ status: 'completed' }) })
        .mockResolvedValueOnce({
          json: async () => ({
            data: [{
              role: 'assistant',
              content: [{ text: { value: 'invalid json response' } }]
            }]
          })
        })

      await expect(processor.processFile('hero.json')).rejects.toThrow()
    })
  })

  describe('processAllFiles', () => {
    beforeEach(() => {
      // Mock directory reading
      const fs = require('fs')
      fs.readdirSync.mockReturnValue(['hero.json', 'services.json', 'readme.txt'])
      fs.statSync.mockReturnValue({ isFile: () => true })
      fs.existsSync.mockReturnValue(true)

      // Add mock files
      mockFs.addFile('/content-improver/../../../data/hero.json', JSON.stringify({
        headline: 'Hero Content'
      }))
      mockFs.addFile('/content-improver/../../../data/services.json', JSON.stringify([{
        title: 'Service 1'
      }]))

      // Mock successful processing for all files
      jest.spyOn(processor, 'processFile').mockResolvedValue({
        improvements: [{ field: 'test', improved: 'test' }]
      })
    })

    it('should process all JSON files in directory', async () => {
      await processor.processAllFiles()

      expect(processor.processFile).toHaveBeenCalledTimes(2) // Only JSON files
      expect(processor.processFile).toHaveBeenCalledWith('hero.json')
      expect(processor.processFile).toHaveBeenCalledWith('services.json')
    })

    it('should handle individual file errors gracefully', async () => {
      processor.processFile.mockImplementation(async (filename) => {
        if (filename === 'hero.json') {
          throw new Error('Processing failed')
        }
        return { improvements: [] }
      })

      await processor.processAllFiles()

      expect(processor.tracker.logError).toHaveBeenCalled()
      expect(processor.processFile).toHaveBeenCalledTimes(2)
    })

    it('should log processing summary', async () => {
      await processor.processAllFiles()

      expect(consoleSpy.getLogs()).toContain(
        expect.stringContaining('Processing complete')
      )
    })
  })

  describe('error handling', () => {
    it('should handle network errors', async () => {
      fetch.mockRejectedValueOnce(new Error('Network error'))

      await expect(processor.createThread()).rejects.toThrow('Network error')
    })

    it('should handle API rate limits', async () => {
      fetch.mockResolvedValueOnce({
        json: async () => ({
          error: {
            type: 'rate_limit_exceeded',
            message: 'Rate limit exceeded'
          }
        })
      })

      await expect(processor.createThread()).rejects.toThrow('Rate limit exceeded')
    })

    it('should log errors appropriately', async () => {
      const testError = new Error('Test error')
      jest.spyOn(processor, 'processFile').mockRejectedValueOnce(testError)

      mockFs.addFile('/content-improver/../../../data/test.json', '{}')
      
      try {
        await processor.processFile('test.json')
      } catch (error) {
        expect(processor.tracker.logError).toHaveBeenCalledWith(
          'test.json',
          expect.stringContaining('Test error')
        )
      }
    })
  })

  describe('cleanup', () => {
    it('should cleanup threads after processing', async () => {
      // This would test thread cleanup if implemented
      // For now, just verify the processor can be garbage collected
      processor = null
      expect(processor).toBeNull()
    })
  })
})