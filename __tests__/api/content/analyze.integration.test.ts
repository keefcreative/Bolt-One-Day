/**
 * Integration tests for Content Analysis API
 */

import { NextRequest } from 'next/server'
import { POST, GET } from '@/app/api/content/analyze/route'
import { contentIntegration } from '@/lib/content-integration'
import { initializeSharedConfig } from '@/lib/shared-config'
import { createMockRequest, expectAsync } from '../../utils/test-helpers'

// Mock dependencies
jest.mock('@/lib/content-integration')
jest.mock('@/lib/shared-config')

const mockContentIntegration = contentIntegration as jest.Mocked<typeof contentIntegration>
const mockInitializeSharedConfig = initializeSharedConfig as jest.MockedFunction<typeof initializeSharedConfig>

describe('/api/content/analyze', () => {
  let consoleErrorSpy: jest.SpyInstance

  beforeEach(() => {
    jest.clearAllMocks()
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation()
  })

  afterEach(() => {
    consoleErrorSpy.mockRestore()
  })

  describe('POST /api/content/analyze', () => {
    it('should successfully analyze content', async () => {
      // Setup mocks
      mockInitializeSharedConfig.mockResolvedValue()
      mockContentIntegration.isContentSystemAvailable.mockResolvedValue(true)
      mockContentIntegration.analyzeContent.mockResolvedValue([
        {
          file: 'data/hero.json',
          issues: [],
          score: 85,
          suggestions: ['Add more power words']
        }
      ])

      const request = createMockRequest('http://localhost:3000/api/content/analyze', {
        method: 'POST',
        body: JSON.stringify({})
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.message).toBe('Content analysis completed')
      expect(data.results).toBeDefined()
      expect(data.timestamp).toBeDefined()
      
      // Verify integration calls
      expect(mockInitializeSharedConfig).toHaveBeenCalled()
      expect(mockContentIntegration.isContentSystemAvailable).toHaveBeenCalled()
      expect(mockContentIntegration.analyzeContent).toHaveBeenCalled()
    })

    it('should handle content system not available', async () => {
      mockInitializeSharedConfig.mockResolvedValue()
      mockContentIntegration.isContentSystemAvailable.mockResolvedValue(false)

      const request = createMockRequest('http://localhost:3000/api/content/analyze', {
        method: 'POST',
        body: JSON.stringify({})
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(503)
      expect(data.error).toBe('Content-improver system not found or not properly installed')
    })

    it('should handle analysis errors', async () => {
      mockInitializeSharedConfig.mockResolvedValue()
      mockContentIntegration.isContentSystemAvailable.mockResolvedValue(true)
      mockContentIntegration.analyzeContent.mockRejectedValue(new Error('Analysis failed'))

      const request = createMockRequest('http://localhost:3000/api/content/analyze', {
        method: 'POST',
        body: JSON.stringify({})
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.error).toBe('Content analysis failed')
      expect(data.message).toBe('Analysis failed')
      expect(consoleErrorSpy).toHaveBeenCalled()
    })

    it('should handle malformed JSON body gracefully', async () => {
      mockInitializeSharedConfig.mockResolvedValue()
      mockContentIntegration.isContentSystemAvailable.mockResolvedValue(true)
      mockContentIntegration.analyzeContent.mockResolvedValue([])

      // Create request with malformed JSON
      const request = new NextRequest('http://localhost:3000/api/content/analyze', {
        method: 'POST',
        body: 'malformed json'
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      // Should still proceed with empty options
    })

    it('should pass request options to analysis', async () => {
      mockInitializeSharedConfig.mockResolvedValue()
      mockContentIntegration.isContentSystemAvailable.mockResolvedValue(true)
      mockContentIntegration.analyzeContent.mockResolvedValue([])

      const requestBody = {
        files: ['hero.json', 'services.json'],
        force: true
      }

      const request = createMockRequest('http://localhost:3000/api/content/analyze', {
        method: 'POST',
        body: JSON.stringify(requestBody)
      })

      const response = await POST(request)

      expect(response.status).toBe(200)
      expect(mockContentIntegration.analyzeContent).toHaveBeenCalled()
    })

    it('should handle initialization errors', async () => {
      mockInitializeSharedConfig.mockRejectedValue(new Error('Config initialization failed'))

      const request = createMockRequest('http://localhost:3000/api/content/analyze', {
        method: 'POST',
        body: JSON.stringify({})
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.error).toBe('Content analysis failed')
      expect(data.message).toBe('Config initialization failed')
    })
  })

  describe('GET /api/content/analyze', () => {
    it('should return workflow status', async () => {
      mockContentIntegration.getWorkflowStatus.mockResolvedValue({
        currentStage: 'completed',
        progress: 100,
        filesProcessed: 5,
        totalFiles: 5,
        errors: [],
        lastRun: new Date().toISOString(),
        nextRecommendedAction: 'Review results'
      })

      const request = createMockRequest('http://localhost:3000/api/content/analyze', {
        method: 'GET'
      })

      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.status).toBeDefined()
      expect(data.status.currentStage).toBe('completed')
      expect(data.timestamp).toBeDefined()
    })

    it('should handle status retrieval errors', async () => {
      mockContentIntegration.getWorkflowStatus.mockRejectedValue(new Error('Status fetch failed'))

      const request = createMockRequest('http://localhost:3000/api/content/analyze', {
        method: 'GET'
      })

      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.error).toBe('Failed to get analysis status')
      expect(data.message).toBe('Status fetch failed')
      expect(consoleErrorSpy).toHaveBeenCalled()
    })

    it('should handle unknown errors', async () => {
      mockContentIntegration.getWorkflowStatus.mockRejectedValue('Unknown error type')

      const request = createMockRequest('http://localhost:3000/api/content/analyze', {
        method: 'GET'
      })

      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.error).toBe('Failed to get analysis status')
      expect(data.message).toBe('Unknown error')
    })
  })

  describe('error handling edge cases', () => {
    it('should handle non-Error thrown objects', async () => {
      mockInitializeSharedConfig.mockResolvedValue()
      mockContentIntegration.isContentSystemAvailable.mockResolvedValue(true)
      mockContentIntegration.analyzeContent.mockImplementation(() => {
        throw 'String error'
      })

      const request = createMockRequest('http://localhost:3000/api/content/analyze', {
        method: 'POST',
        body: JSON.stringify({})
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.message).toBe('Unknown error')
    })

    it('should include timestamp in all responses', async () => {
      const beforeTime = Date.now()
      
      mockInitializeSharedConfig.mockResolvedValue()
      mockContentIntegration.isContentSystemAvailable.mockResolvedValue(true)
      mockContentIntegration.analyzeContent.mockResolvedValue([])

      const request = createMockRequest('http://localhost:3000/api/content/analyze', {
        method: 'POST',
        body: JSON.stringify({})
      })

      const response = await POST(request)
      const data = await response.json()
      
      const afterTime = Date.now()
      const responseTime = new Date(data.timestamp).getTime()

      expect(responseTime).toBeGreaterThanOrEqual(beforeTime)
      expect(responseTime).toBeLessThanOrEqual(afterTime)
    })
  })

  describe('integration with content system', () => {
    it('should properly sequence initialization and analysis', async () => {
      const callOrder: string[] = []
      
      mockInitializeSharedConfig.mockImplementation(async () => {
        callOrder.push('init')
      })
      
      mockContentIntegration.isContentSystemAvailable.mockImplementation(async () => {
        callOrder.push('available')
        return true
      })
      
      mockContentIntegration.analyzeContent.mockImplementation(async () => {
        callOrder.push('analyze')
        return []
      })

      const request = createMockRequest('http://localhost:3000/api/content/analyze', {
        method: 'POST',
        body: JSON.stringify({})
      })

      await POST(request)

      expect(callOrder).toEqual(['init', 'available', 'analyze'])
    })

    it('should not proceed with analysis if system unavailable', async () => {
      mockInitializeSharedConfig.mockResolvedValue()
      mockContentIntegration.isContentSystemAvailable.mockResolvedValue(false)

      const request = createMockRequest('http://localhost:3000/api/content/analyze', {
        method: 'POST',
        body: JSON.stringify({})
      })

      await POST(request)

      expect(mockContentIntegration.analyzeContent).not.toHaveBeenCalled()
    })
  })
})