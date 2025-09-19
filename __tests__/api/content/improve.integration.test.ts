/**
 * Integration tests for Content Improvement API
 */

import { NextRequest } from 'next/server'
import { POST, GET } from '@/app/api/content/improve/route'
import { contentIntegration } from '@/lib/content-integration'
import { initializeSharedConfig } from '@/lib/shared-config'
import { createMockRequest } from '../../utils/test-helpers'

// Mock dependencies
jest.mock('@/lib/content-integration')
jest.mock('@/lib/shared-config')

const mockContentIntegration = contentIntegration as jest.Mocked<typeof contentIntegration>
const mockInitializeSharedConfig = initializeSharedConfig as jest.MockedFunction<typeof initializeSharedConfig>

describe('/api/content/improve', () => {
  let consoleErrorSpy: jest.SpyInstance

  beforeEach(() => {
    jest.clearAllMocks()
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation()
  })

  afterEach(() => {
    consoleErrorSpy.mockRestore()
  })

  describe('POST /api/content/improve', () => {
    const mockImprovements = [
      {
        id: '1',
        file: 'data/hero.json',
        section: 'hero',
        field: 'headline',
        original: 'Transform Your Business',
        improved: 'Transform Your Business with Premium Design',
        reasoning: 'Added specificity',
        status: 'pending',
        confidence: 0.9
      },
      {
        id: '2',
        file: 'data/services.json',
        section: 'services',
        field: 'description',
        original: 'Great design services',
        improved: 'Premium design services that drive results',
        reasoning: 'More compelling and result-focused',
        status: 'pending',
        confidence: 0.85
      }
    ]

    it('should successfully improve content', async () => {
      mockInitializeSharedConfig.mockResolvedValue()
      mockContentIntegration.isContentSystemAvailable.mockResolvedValue(true)
      mockContentIntegration.improveContent.mockResolvedValue(true)
      mockContentIntegration.getPendingImprovements.mockResolvedValue(mockImprovements)

      const request = createMockRequest('http://localhost:3000/api/content/improve', {
        method: 'POST',
        body: JSON.stringify({})
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.message).toBe('Content improvement completed')
      expect(data.improvementsCount).toBe(2)
      expect(data.improvements).toEqual(mockImprovements)
      expect(data.timestamp).toBeDefined()
    })

    it('should handle improvement failure', async () => {
      mockInitializeSharedConfig.mockResolvedValue()
      mockContentIntegration.isContentSystemAvailable.mockResolvedValue(true)
      mockContentIntegration.improveContent.mockResolvedValue(false)

      const request = createMockRequest('http://localhost:3000/api/content/improve', {
        method: 'POST',
        body: JSON.stringify({})
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.error).toBe('Content improvement failed')
    })

    it('should handle content system not available', async () => {
      mockInitializeSharedConfig.mockResolvedValue()
      mockContentIntegration.isContentSystemAvailable.mockResolvedValue(false)

      const request = createMockRequest('http://localhost:3000/api/content/improve', {
        method: 'POST',
        body: JSON.stringify({})
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(503)
      expect(data.error).toBe('Content-improver system not found or not properly installed')
    })

    it('should handle improvement process errors', async () => {
      mockInitializeSharedConfig.mockResolvedValue()
      mockContentIntegration.isContentSystemAvailable.mockResolvedValue(true)
      mockContentIntegration.improveContent.mockRejectedValue(new Error('OpenAI API error'))

      const request = createMockRequest('http://localhost:3000/api/content/improve', {
        method: 'POST',
        body: JSON.stringify({})
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.error).toBe('Content improvement failed')
      expect(data.message).toBe('OpenAI API error')
      expect(consoleErrorSpy).toHaveBeenCalled()
    })

    it('should handle malformed request body', async () => {
      mockInitializeSharedConfig.mockResolvedValue()
      mockContentIntegration.isContentSystemAvailable.mockResolvedValue(true)
      mockContentIntegration.improveContent.mockResolvedValue(true)
      mockContentIntegration.getPendingImprovements.mockResolvedValue([])

      const request = new NextRequest('http://localhost:3000/api/content/improve', {
        method: 'POST',
        body: 'invalid json'
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      // Should proceed with default options
    })

    it('should pass request options to improvement process', async () => {
      mockInitializeSharedConfig.mockResolvedValue()
      mockContentIntegration.isContentSystemAvailable.mockResolvedValue(true)
      mockContentIntegration.improveContent.mockResolvedValue(true)
      mockContentIntegration.getPendingImprovements.mockResolvedValue([])

      const requestBody = {
        sections: ['hero', 'services'],
        mode: 'assistant'
      }

      const request = createMockRequest('http://localhost:3000/api/content/improve', {
        method: 'POST',
        body: JSON.stringify(requestBody)
      })

      const response = await POST(request)

      expect(response.status).toBe(200)
      expect(mockContentIntegration.improveContent).toHaveBeenCalled()
    })

    it('should handle errors when fetching pending improvements', async () => {
      mockInitializeSharedConfig.mockResolvedValue()
      mockContentIntegration.isContentSystemAvailable.mockResolvedValue(true)
      mockContentIntegration.improveContent.mockResolvedValue(true)
      mockContentIntegration.getPendingImprovements.mockRejectedValue(new Error('File read error'))

      const request = createMockRequest('http://localhost:3000/api/content/improve', {
        method: 'POST',
        body: JSON.stringify({})
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.error).toBe('Content improvement failed')
      expect(data.message).toBe('File read error')
    })
  })

  describe('GET /api/content/improve', () => {
    const mockPendingImprovements = [
      {
        id: '1',
        file: 'data/hero.json',
        section: 'hero',
        field: 'headline',
        original: 'Old headline',
        improved: 'New improved headline',
        reasoning: 'Better engagement',
        status: 'pending',
        confidence: 0.92
      },
      {
        id: '2',
        file: 'data/services.json',
        section: 'services',
        field: 'cta',
        original: 'Learn More',
        improved: 'Discover Our Solutions',
        reasoning: 'More specific action',
        status: 'pending',
        confidence: 0.88
      }
    ]

    it('should return pending improvements', async () => {
      mockContentIntegration.getPendingImprovements.mockResolvedValue(mockPendingImprovements)

      const request = createMockRequest('http://localhost:3000/api/content/improve', {
        method: 'GET'
      })

      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.improvements).toEqual(mockPendingImprovements)
      expect(data.count).toBe(2)
      expect(data.timestamp).toBeDefined()
    })

    it('should return empty array when no pending improvements', async () => {
      mockContentIntegration.getPendingImprovements.mockResolvedValue([])

      const request = createMockRequest('http://localhost:3000/api/content/improve', {
        method: 'GET'
      })

      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.improvements).toEqual([])
      expect(data.count).toBe(0)
    })

    it('should handle errors when fetching pending improvements', async () => {
      mockContentIntegration.getPendingImprovements.mockRejectedValue(new Error('Directory not found'))

      const request = createMockRequest('http://localhost:3000/api/content/improve', {
        method: 'GET'
      })

      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.error).toBe('Failed to get pending improvements')
      expect(data.message).toBe('Directory not found')
      expect(consoleErrorSpy).toHaveBeenCalled()
    })

    it('should handle unknown error types', async () => {
      mockContentIntegration.getPendingImprovements.mockRejectedValue('Unknown error')

      const request = createMockRequest('http://localhost:3000/api/content/improve', {
        method: 'GET'
      })

      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.message).toBe('Unknown error')
    })
  })

  describe('workflow integration', () => {
    it('should follow proper improvement workflow', async () => {
      const callOrder: string[] = []
      
      mockInitializeSharedConfig.mockImplementation(async () => {
        callOrder.push('init')
      })
      
      mockContentIntegration.isContentSystemAvailable.mockImplementation(async () => {
        callOrder.push('check-available')
        return true
      })
      
      mockContentIntegration.improveContent.mockImplementation(async () => {
        callOrder.push('improve')
        return true
      })
      
      mockContentIntegration.getPendingImprovements.mockImplementation(async () => {
        callOrder.push('get-pending')
        return []
      })

      const request = createMockRequest('http://localhost:3000/api/content/improve', {
        method: 'POST',
        body: JSON.stringify({})
      })

      await POST(request)

      expect(callOrder).toEqual(['init', 'check-available', 'improve', 'get-pending'])
    })

    it('should not proceed with improvement if system unavailable', async () => {
      mockInitializeSharedConfig.mockResolvedValue()
      mockContentIntegration.isContentSystemAvailable.mockResolvedValue(false)

      const request = createMockRequest('http://localhost:3000/api/content/improve', {
        method: 'POST',
        body: JSON.stringify({})
      })

      await POST(request)

      expect(mockContentIntegration.improveContent).not.toHaveBeenCalled()
      expect(mockContentIntegration.getPendingImprovements).not.toHaveBeenCalled()
    })

    it('should not fetch pending improvements if improvement fails', async () => {
      mockInitializeSharedConfig.mockResolvedValue()
      mockContentIntegration.isContentSystemAvailable.mockResolvedValue(true)
      mockContentIntegration.improveContent.mockResolvedValue(false)

      const request = createMockRequest('http://localhost:3000/api/content/improve', {
        method: 'POST',
        body: JSON.stringify({})
      })

      await POST(request)

      expect(mockContentIntegration.getPendingImprovements).not.toHaveBeenCalled()
    })
  })

  describe('response format consistency', () => {
    it('should include timestamp in success responses', async () => {
      const beforeTime = Date.now()
      
      mockInitializeSharedConfig.mockResolvedValue()
      mockContentIntegration.isContentSystemAvailable.mockResolvedValue(true)
      mockContentIntegration.improveContent.mockResolvedValue(true)
      mockContentIntegration.getPendingImprovements.mockResolvedValue([])

      const request = createMockRequest('http://localhost:3000/api/content/improve', {
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

    it('should include timestamp in error responses', async () => {
      mockInitializeSharedConfig.mockRejectedValue(new Error('Test error'))

      const request = createMockRequest('http://localhost:3000/api/content/improve', {
        method: 'POST',
        body: JSON.stringify({})
      })

      const response = await POST(request)
      const data = await response.json()

      expect(data.timestamp).toBeDefined()
      expect(new Date(data.timestamp).getTime()).toBeGreaterThan(0)
    })
  })
})