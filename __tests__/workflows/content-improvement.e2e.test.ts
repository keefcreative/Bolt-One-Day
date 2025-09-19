/**
 * End-to-End tests for the complete content improvement workflow
 */

import { contentIntegration, contentOperations } from '@/lib/content-integration'
import { initializeSharedConfig, configUtils } from '@/lib/shared-config'
import { mockFileOperations, mockEnvVars } from '../utils/test-helpers'
import { exec } from 'child_process'

// Mock child_process
jest.mock('child_process')
const mockExec = exec as jest.MockedFunction<typeof exec>

// Mock fs
jest.mock('fs', () => ({
  promises: {
    access: jest.fn(),
    readdir: jest.fn(),
    readFile: jest.fn(),
    writeFile: jest.fn(),
    copyFile: jest.fn(),
    stat: jest.fn(),
    mkdir: jest.fn(),
  },
}))

describe('Content Improvement E2E Workflow', () => {
  let mockFs: ReturnType<typeof mockFileOperations>
  let restoreEnv: () => void

  beforeEach(() => {
    jest.clearAllMocks()
    mockFs = mockFileOperations()
    
    restoreEnv = mockEnvVars({
      NODE_ENV: 'test',
      OPENAI_API_KEY: 'test-openai-key',
      CONTENT_SYSTEM_ENABLED: 'true',
      CONTENT_QUALITY_THRESHOLD: '75'
    })

    jest.spyOn(process, 'cwd').mockReturnValue('/test/project')
  })

  afterEach(() => {
    mockFs.reset()
    restoreEnv()
    jest.restoreAllMocks()
  })

  describe('Complete Content Improvement Workflow', () => {
    beforeEach(() => {
      // Setup mock file system with sample content
      mockFs.addFile('/test/project/data/hero.json', JSON.stringify({
        headline: "Transform Your Business",
        subheadline: "We help companies grow with design",
        primaryCTA: "Get Started",
        secondaryCTA: "Learn More"
      }))
      
      mockFs.addFile('/test/project/data/services.json', JSON.stringify([
        {
          title: "Web Design",
          description: "Beautiful websites that work"
        },
        {
          title: "Branding",
          description: "Complete brand identity packages"
        }
      ]))

      // Mock content-improver system files
      mockFs.addFile('/test/project/content-improver/package.json', JSON.stringify({
        name: 'content-improver'
      }))

      // Mock successful command executions
      mockExec.mockImplementation((command, options, callback) => {
        const cb = callback as (error: Error | null, stdout: string, stderr: string) => void
        
        if (command.includes('npm run analyze:all')) {
          setTimeout(() => {
            cb(null, JSON.stringify({
              summary: { totalFiles: 2, qualityScore: 78 },
              files: [
                { file: 'data/hero.json', score: 80, issues: [] },
                { file: 'data/services.json', score: 76, issues: [] }
              ]
            }), '')
          }, 10)
        } else if (command.includes('npm run improve:assistant')) {
          setTimeout(() => {
            // Create mock improvement results
            mockFs.addFile('/test/project/content-improver/improvements/hero-improvements.json', JSON.stringify({
              improvements: [
                {
                  id: 'hero-headline-001',
                  file: 'data/hero.json',
                  field: 'headline',
                  original: 'Transform Your Business',
                  improved: 'Transform Your Business with Premium Design Solutions',
                  reasoning: 'Added specificity and value proposition',
                  status: 'pending',
                  confidence: 0.9
                }
              ]
            }))
            cb(null, 'Improvements generated successfully', '')
          }, 10)
        } else if (command.includes('npm run implement:approved')) {
          setTimeout(() => {
            // Simulate applying improvements
            mockFs.addFile('/test/project/data/hero.json', JSON.stringify({
              headline: "Transform Your Business with Premium Design Solutions",
              subheadline: "We help companies grow with design",
              primaryCTA: "Get Started",
              secondaryCTA: "Learn More"
            }))
            cb(null, 'Improvements applied successfully', '')
          }, 10)
        } else if (command.includes('npm run status')) {
          cb(null, 'Status: Ready for next analysis', '')
        } else {
          cb(null, '', '')
        }
        
        return {} as any
      })

      // Mock file system operations
      const fs = require('fs').promises
      fs.access.mockResolvedValue(undefined)
      fs.readdir.mockImplementation(async (dirPath: string) => {
        if (dirPath.includes('improvements')) {
          return ['hero-improvements.json']
        }
        if (dirPath.includes('data')) {
          return [
            { name: 'hero.json', isDirectory: () => false, isFile: () => true },
            { name: 'services.json', isDirectory: () => false, isFile: () => true }
          ]
        }
        return []
      })
      
      fs.stat.mockResolvedValue({
        mtime: new Date('2024-01-15T10:00:00Z'),
        size: 1024
      })
    })

    it('should complete full analyze -> improve -> apply workflow', async () => {
      // Step 1: Initialize system
      await initializeSharedConfig()
      
      // Step 2: Health check
      const healthCheck = await contentOperations.healthCheck()
      expect(healthCheck.healthy).toBe(true)
      
      // Step 3: Analyze content
      const analysisResults = await contentIntegration.analyzeContent()
      expect(analysisResults).toBeDefined()
      
      // Step 4: Improve content
      const improveSuccess = await contentIntegration.improveContent()
      expect(improveSuccess).toBe(true)
      
      // Step 5: Get pending improvements
      const pendingImprovements = await contentIntegration.getPendingImprovements()
      expect(pendingImprovements).toHaveLength(1)
      expect(pendingImprovements[0]).toEqual({
        id: 'hero-headline-001',
        file: 'data/hero.json',
        field: 'headline',
        original: 'Transform Your Business',
        improved: 'Transform Your Business with Premium Design Solutions',
        reasoning: 'Added specificity and value proposition',
        status: 'pending',
        confidence: 0.9
      })
      
      // Step 6: Apply improvements
      const applySuccess = await contentIntegration.applyImprovements()
      expect(applySuccess).toBe(true)
      
      // Step 7: Verify changes were applied
      const updatedContent = await contentIntegration.loadDataFile('data/hero.json')
      expect(updatedContent.headline).toBe('Transform Your Business with Premium Design Solutions')
    }, 10000)

    it('should handle workflow with no improvements needed', async () => {
      // Mock analysis that finds no issues
      mockExec.mockImplementation((command, options, callback) => {
        const cb = callback as (error: Error | null, stdout: string, stderr: string) => void
        
        if (command.includes('npm run improve:assistant')) {
          setTimeout(() => {
            // No improvements file created
            cb(null, 'No improvements needed', '')
          }, 10)
        } else {
          cb(null, 'success', '')
        }
        
        return {} as any
      })

      await initializeSharedConfig()
      
      const improveSuccess = await contentIntegration.improveContent()
      expect(improveSuccess).toBe(true)
      
      const pendingImprovements = await contentIntegration.getPendingImprovements()
      expect(pendingImprovements).toHaveLength(0)
    })

    it('should handle selective improvement application', async () => {
      // Create multiple improvements
      mockFs.addFile('/test/project/content-improver/improvements/multi-improvements.json', JSON.stringify({
        improvements: [
          {
            id: 'hero-headline-001',
            file: 'data/hero.json',
            field: 'headline',
            original: 'Transform Your Business',
            improved: 'Transform Your Business with Premium Design Solutions',
            status: 'pending'
          },
          {
            id: 'hero-cta-001',
            file: 'data/hero.json',
            field: 'primaryCTA',
            original: 'Get Started',
            improved: 'Start Your Transformation',
            status: 'pending'
          }
        ]
      }))

      // Mock directory reading to include the new file
      const fs = require('fs').promises
      fs.readdir.mockResolvedValue(['multi-improvements.json'])

      const pendingImprovements = await contentIntegration.getPendingImprovements()
      expect(pendingImprovements).toHaveLength(2)

      // Apply only specific improvement
      const applySuccess = await contentIntegration.applyImprovements(['hero-headline-001'])
      expect(applySuccess).toBe(true)

      // Verify the correct command was called
      expect(mockExec).toHaveBeenCalledWith(
        'npm run implement -- --ids hero-headline-001',
        expect.any(Object),
        expect.any(Function)
      )
    })
  })

  describe('Error Handling in E2E Workflow', () => {
    it('should handle content-improver system not available', async () => {
      // Remove content-improver system
      mockFs.removeFile('/test/project/content-improver/package.json')
      
      const fs = require('fs').promises
      fs.access.mockRejectedValue(new Error('ENOENT'))

      const isAvailable = await contentIntegration.isContentSystemAvailable()
      expect(isAvailable).toBe(false)

      const healthCheck = await contentOperations.healthCheck()
      expect(healthCheck.healthy).toBe(false)
      expect(healthCheck.message).toContain('Content-improver system not found')
    })

    it('should handle analysis failures gracefully', async () => {
      mockExec.mockImplementation((command, options, callback) => {
        const cb = callback as (error: Error | null, stdout: string, stderr: string) => void
        
        if (command.includes('npm run analyze:all')) {
          cb(new Error('Analysis process failed'), '', 'Error output')
        } else {
          cb(null, '', '')
        }
        
        return {} as any
      })

      await expect(contentIntegration.analyzeContent()).rejects.toThrow('Content analysis failed')
    })

    it('should handle improvement generation failures', async () => {
      mockExec.mockImplementation((command, options, callback) => {
        const cb = callback as (error: Error | null, stdout: string, stderr: string) => void
        
        if (command.includes('npm run improve:assistant')) {
          cb(new Error('OpenAI API error'), '', 'API rate limit exceeded')
        } else {
          cb(null, '', '')
        }
        
        return {} as any
      })

      await expect(contentIntegration.improveContent()).rejects.toThrow('Content improvement failed')
    })

    it('should handle file permission errors', async () => {
      const fs = require('fs').promises
      fs.readFile.mockRejectedValue(new Error('EACCES: permission denied'))

      await expect(contentIntegration.loadDataFile('data/hero.json')).rejects.toThrow('Failed to load data file')
    })

    it('should handle malformed improvement files', async () => {
      mockFs.addFile('/test/project/content-improver/improvements/malformed.json', 'invalid json')

      const fs = require('fs').promises
      fs.readdir.mockResolvedValue(['malformed.json'])

      await expect(contentIntegration.getPendingImprovements()).rejects.toThrow('Failed to get pending improvements')
    })
  })

  describe('Configuration Integration', () => {
    it('should respect quality thresholds from configuration', async () => {
      restoreEnv()
      restoreEnv = mockEnvVars({
        NODE_ENV: 'test',
        OPENAI_API_KEY: 'test-key',
        CONTENT_SYSTEM_ENABLED: 'true',
        CONTENT_QUALITY_THRESHOLD: '90' // High threshold
      })

      await initializeSharedConfig()
      
      const validation = configUtils.validate()
      expect(validation.valid).toBe(true)
      
      const summary = configUtils.getSummary()
      expect(summary.system.qualityThreshold).toBe(90)
    })

    it('should handle missing required configuration', async () => {
      restoreEnv()
      restoreEnv = mockEnvVars({
        NODE_ENV: 'test'
        // Missing OPENAI_API_KEY
      })

      const validation = configUtils.validate()
      expect(validation.valid).toBe(false)
      expect(validation.errors).toContain('OPENAI_API_KEY is required for content improvements')
    })

    it('should sync environment variables to content-improver', async () => {
      const fs = require('fs').promises
      fs.writeFile.mockResolvedValue(undefined)

      await configUtils.syncEnvironmentToContentImprover()

      expect(fs.writeFile).toHaveBeenCalledWith(
        expect.stringContaining('content-improver/.env'),
        expect.stringContaining('OPENAI_API_KEY=test-openai-key'),
        'utf-8'
      )
    })
  })

  describe('Quality Assurance Workflow', () => {
    it('should perform quick quality check', async () => {
      // Mock validation returning mixed results
      mockExec.mockImplementation((command, options, callback) => {
        const cb = callback as (error: Error | null, stdout: string, stderr: string) => void
        
        if (command.includes('npm run test')) {
          cb(null, 'Validation completed with warnings', '')
        } else {
          cb(null, '', '')
        }
        
        return {} as any
      })

      const qualityCheck = await contentOperations.quickQualityCheck()
      
      expect(qualityCheck.score).toBeGreaterThanOrEqual(0)
      expect(qualityCheck.score).toBeLessThanOrEqual(100)
      expect(Array.isArray(qualityCheck.issues)).toBe(true)
    })

    it('should validate content files before improvement', async () => {
      const issues = await contentIntegration.validateContent('data/hero.json')
      expect(Array.isArray(issues)).toBe(true)
    })
  })

  describe('File System Operations', () => {
    it('should create backups when saving files', async () => {
      const originalContent = { title: 'Original' }
      const updatedContent = { title: 'Updated' }
      
      mockFs.addFile('/test/project/data/test.json', JSON.stringify(originalContent))
      
      const fs = require('fs').promises
      fs.copyFile.mockResolvedValue(undefined)
      fs.writeFile.mockResolvedValue(undefined)

      await contentIntegration.saveDataFile('data/test.json', updatedContent, true)

      expect(fs.copyFile).toHaveBeenCalled()
      expect(fs.writeFile).toHaveBeenCalledWith(
        '/test/project/data/test.json',
        JSON.stringify(updatedContent, null, 2),
        'utf-8'
      )
    })

    it('should walk directory structure recursively', async () => {
      // Setup nested directory structure
      mockFs.addFile('/test/project/data/hero.json', '{}')
      mockFs.addFile('/test/project/data/portfolio/projects.json', '{}')
      
      const fs = require('fs').promises
      fs.readdir.mockImplementation(async (dirPath: string, options: any) => {
        if (dirPath.includes('data') && !dirPath.includes('portfolio')) {
          return [
            { name: 'hero.json', isDirectory: () => false, isFile: () => true },
            { name: 'portfolio', isDirectory: () => true, isFile: () => false }
          ]
        }
        if (dirPath.includes('portfolio')) {
          return [
            { name: 'projects.json', isDirectory: () => false, isFile: () => true }
          ]
        }
        return []
      })

      const files = await contentIntegration.getContentFiles()
      
      expect(files.length).toBeGreaterThan(1)
    })
  })

  describe('Workflow Status Tracking', () => {
    it('should track workflow progress', async () => {
      const status = await contentIntegration.getWorkflowStatus()
      
      expect(status).toEqual({
        currentStage: 'idle',
        progress: 0,
        filesProcessed: 0,
        totalFiles: 0,
        errors: [],
        lastRun: null,
        nextRecommendedAction: 'Run content analysis'
      })
    })

    it('should get improvement history', async () => {
      mockExec.mockImplementation((command, options, callback) => {
        const cb = callback as (error: Error | null, stdout: string, stderr: string) => void
        
        if (command.includes('npm run history')) {
          cb(null, JSON.stringify([
            {
              timestamp: '2024-01-15T10:00:00Z',
              changes: 5,
              files: ['hero.json', 'services.json']
            }
          ]), '')
        } else {
          cb(null, '', '')
        }
        
        return {} as any
      })

      const history = await contentIntegration.getImprovementHistory()
      expect(Array.isArray(history)).toBe(true)
    })
  })
})