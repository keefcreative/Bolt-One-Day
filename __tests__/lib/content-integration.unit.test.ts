/**
 * Unit tests for Content Integration System
 */

import { ContentIntegration, contentIntegration, contentOperations } from '@/lib/content-integration'
import { mockFileOperations, mockEnvVars, waitForPromises } from '../utils/test-helpers'
import path from 'path'
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

// Mock path
jest.mock('path')

describe('ContentIntegration', () => {
  let contentInt: ContentIntegration
  let mockFs: ReturnType<typeof mockFileOperations>
  let restoreEnv: () => void

  beforeEach(() => {
    jest.clearAllMocks()
    contentInt = new ContentIntegration()
    mockFs = mockFileOperations()
    
    // Mock environment
    restoreEnv = mockEnvVars({
      NODE_ENV: 'test',
      OPENAI_API_KEY: 'test-key'
    })

    // Mock process.cwd
    jest.spyOn(process, 'cwd').mockReturnValue('/test/root')
  })

  afterEach(() => {
    mockFs.reset()
    restoreEnv()
    jest.restoreAllMocks()
  })

  describe('constructor', () => {
    it('should initialize with correct paths', () => {
      expect(process.cwd).toHaveBeenCalled()
      expect(contentInt).toBeInstanceOf(ContentIntegration)
    })
  })

  describe('isContentSystemAvailable', () => {
    it('should return true when content-improver system exists', async () => {
      const fs = require('fs').promises
      fs.access.mockResolvedValue(undefined)

      const result = await contentInt.isContentSystemAvailable()
      
      expect(result).toBe(true)
      expect(fs.access).toHaveBeenCalledTimes(2)
    })

    it('should return false when content-improver system does not exist', async () => {
      const fs = require('fs').promises
      fs.access.mockRejectedValue(new Error('ENOENT'))

      const result = await contentInt.isContentSystemAvailable()
      
      expect(result).toBe(false)
    })
  })

  describe('getWorkflowStatus', () => {
    it('should return parsed workflow status', async () => {
      mockExec.mockImplementation((command, options, callback) => {
        const cb = callback as (error: Error | null, stdout: string, stderr: string) => void
        cb(null, 'workflow status output', '')
        return {} as any
      })

      const result = await contentInt.getWorkflowStatus()
      
      expect(result).toEqual({
        currentStage: 'idle',
        progress: 0,
        filesProcessed: 0,
        totalFiles: 0,
        errors: [],
        lastRun: null,
        nextRecommendedAction: 'Run content analysis'
      })
    })

    it('should throw error when status command fails', async () => {
      mockExec.mockImplementation((command, options, callback) => {
        const cb = callback as (error: Error | null, stdout: string, stderr: string) => void
        cb(new Error('Command failed'), '', 'error output')
        return {} as any
      })

      await expect(contentInt.getWorkflowStatus()).rejects.toThrow('Failed to get workflow status')
    })
  })

  describe('analyzeContent', () => {
    it('should successfully analyze content', async () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation()
      
      mockExec.mockImplementation((command, options, callback) => {
        const cb = callback as (error: Error | null, stdout: string, stderr: string) => void
        cb(null, 'analysis output', '')
        return {} as any
      })

      const result = await contentInt.analyzeContent()
      
      expect(consoleSpy).toHaveBeenCalledWith('🔍 Starting content analysis...')
      expect(result).toEqual([])
      
      consoleSpy.mockRestore()
    })

    it('should handle analysis warnings', async () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation()
      
      mockExec.mockImplementation((command, options, callback) => {
        const cb = callback as (error: Error | null, stdout: string, stderr: string) => void
        cb(null, 'analysis output', 'warning message')
        return {} as any
      })

      await contentInt.analyzeContent()
      
      expect(consoleSpy).toHaveBeenCalledWith('Analysis warnings:', 'warning message')
      
      consoleSpy.mockRestore()
    })

    it('should throw error when analysis fails', async () => {
      mockExec.mockImplementation((command, options, callback) => {
        const cb = callback as (error: Error | null, stdout: string, stderr: string) => void
        cb(new Error('Analysis failed'), '', '')
        return {} as any
      })

      await expect(contentInt.analyzeContent()).rejects.toThrow('Content analysis failed')
    })
  })

  describe('improveContent', () => {
    it('should successfully improve content', async () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation()
      
      mockExec.mockImplementation((command, options, callback) => {
        const cb = callback as (error: Error | null, stdout: string, stderr: string) => void
        cb(null, '', '')
        return {} as any
      })

      const result = await contentInt.improveContent()
      
      expect(consoleSpy).toHaveBeenCalledWith('🤖 Running AI content improvements...')
      expect(result).toBe(true)
      
      consoleSpy.mockRestore()
    })

    it('should throw error when improvement fails', async () => {
      mockExec.mockImplementation((command, options, callback) => {
        const cb = callback as (error: Error | null, stdout: string, stderr: string) => void
        cb(new Error('Improvement failed'), '', '')
        return {} as any
      })

      await expect(contentInt.improveContent()).rejects.toThrow('Content improvement failed')
    })
  })

  describe('getPendingImprovements', () => {
    it('should return pending improvements', async () => {
      const fs = require('fs').promises
      fs.readdir.mockResolvedValue(['improvement1.json', 'improvement2.json', 'readme.txt'])
      fs.readFile.mockImplementation(async (filePath: string) => {
        if (filePath.includes('improvement1.json')) {
          return JSON.stringify({
            improvements: [
              { id: '1', status: 'pending', field: 'headline' },
              { id: '2', status: 'approved', field: 'description' }
            ]
          })
        }
        if (filePath.includes('improvement2.json')) {
          return JSON.stringify({
            improvements: [
              { id: '3', status: 'pending', field: 'cta' }
            ]
          })
        }
        return '{}'
      })

      const result = await contentInt.getPendingImprovements()
      
      expect(result).toHaveLength(2)
      expect(result[0]).toEqual({ id: '1', status: 'pending', field: 'headline' })
      expect(result[1]).toEqual({ id: '3', status: 'pending', field: 'cta' })
    })

    it('should handle empty improvements directory', async () => {
      const fs = require('fs').promises
      fs.readdir.mockResolvedValue([])

      const result = await contentInt.getPendingImprovements()
      
      expect(result).toEqual([])
    })

    it('should throw error when reading improvements fails', async () => {
      const fs = require('fs').promises
      fs.readdir.mockRejectedValue(new Error('Directory not found'))

      await expect(contentInt.getPendingImprovements()).rejects.toThrow('Failed to get pending improvements')
    })
  })

  describe('applyImprovements', () => {
    it('should apply all approved improvements by default', async () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation()
      
      mockExec.mockImplementation((command, options, callback) => {
        expect(command).toBe('npm run implement:approved')
        const cb = callback as (error: Error | null, stdout: string, stderr: string) => void
        cb(null, '', '')
        return {} as any
      })

      const result = await contentInt.applyImprovements()
      
      expect(consoleSpy).toHaveBeenCalledWith('✨ Applying content improvements...')
      expect(result).toBe(true)
      
      consoleSpy.mockRestore()
    })

    it('should apply specific improvements when IDs provided', async () => {
      mockExec.mockImplementation((command, options, callback) => {
        expect(command).toBe('npm run implement -- --ids 1,2,3')
        const cb = callback as (error: Error | null, stdout: string, stderr: string) => void
        cb(null, '', '')
        return {} as any
      })

      const result = await contentInt.applyImprovements(['1', '2', '3'])
      
      expect(result).toBe(true)
    })

    it('should throw error when apply fails', async () => {
      mockExec.mockImplementation((command, options, callback) => {
        const cb = callback as (error: Error | null, stdout: string, stderr: string) => void
        cb(new Error('Apply failed'), '', '')
        return {} as any
      })

      await expect(contentInt.applyImprovements()).rejects.toThrow('Failed to apply improvements')
    })
  })

  describe('getContentFiles', () => {
    it('should return all JSON content files', async () => {
      const fs = require('fs').promises
      
      // Mock directory structure
      fs.readdir.mockImplementation(async (dirPath: string, options: any) => {
        if (dirPath.includes('/test/root/data')) {
          return [
            { name: 'hero.json', isDirectory: () => false, isFile: () => true },
            { name: 'services.json', isDirectory: () => false, isFile: () => true },
            { name: 'subfolder', isDirectory: () => true, isFile: () => false },
            { name: 'readme.txt', isDirectory: () => false, isFile: () => true }
          ]
        }
        if (dirPath.includes('subfolder')) {
          return [
            { name: 'nested.json', isDirectory: () => false, isFile: () => true }
          ]
        }
        return []
      })
      
      fs.stat.mockResolvedValue({
        mtime: new Date('2024-01-15T10:00:00Z'),
        size: 1024
      })

      const result = await contentInt.getContentFiles()
      
      expect(result).toEqual([
        expect.objectContaining({
          type: 'json',
          size: 1024
        })
      ])
    })
  })

  describe('loadDataFile', () => {
    it('should load and parse JSON file', async () => {
      const fs = require('fs').promises
      const testData = { title: 'Test Content' }
      fs.readFile.mockResolvedValue(JSON.stringify(testData))

      const result = await contentInt.loadDataFile('data/test.json')
      
      expect(result).toEqual(testData)
      expect(fs.readFile).toHaveBeenCalledWith('/test/root/data/test.json', 'utf-8')
    })

    it('should throw error for invalid JSON', async () => {
      const fs = require('fs').promises
      fs.readFile.mockResolvedValue('invalid json')

      await expect(contentInt.loadDataFile('data/test.json')).rejects.toThrow('Failed to load data file')
    })
  })

  describe('saveDataFile', () => {
    it('should save JSON file with backup', async () => {
      const fs = require('fs').promises
      const testData = { title: 'Updated Content' }
      
      fs.copyFile.mockResolvedValue(undefined)
      fs.writeFile.mockResolvedValue(undefined)

      await contentInt.saveDataFile('data/test.json', testData, true)
      
      expect(fs.copyFile).toHaveBeenCalled()
      expect(fs.writeFile).toHaveBeenCalledWith(
        '/test/root/data/test.json',
        JSON.stringify(testData, null, 2),
        'utf-8'
      )
    })

    it('should save JSON file without backup', async () => {
      const fs = require('fs').promises
      const testData = { title: 'Updated Content' }
      
      fs.writeFile.mockResolvedValue(undefined)

      await contentInt.saveDataFile('data/test.json', testData, false)
      
      expect(fs.copyFile).not.toHaveBeenCalled()
      expect(fs.writeFile).toHaveBeenCalled()
    })
  })

  describe('validateContent', () => {
    it('should return validation results', async () => {
      mockExec.mockImplementation((command, options, callback) => {
        const cb = callback as (error: Error | null, stdout: string, stderr: string) => void
        cb(null, 'validation output', '')
        return {} as any
      })

      const result = await contentInt.validateContent('data/test.json')
      
      expect(result).toEqual([])
    })

    it('should return error when validation fails', async () => {
      mockExec.mockImplementation((command, options, callback) => {
        const cb = callback as (error: Error | null, stdout: string, stderr: string) => void
        cb(new Error('Validation failed'), '', '')
        return {} as any
      })

      const result = await contentInt.validateContent('data/test.json')
      
      expect(result).toHaveLength(1)
      expect(result[0]).toEqual({
        type: 'structure',
        severity: 'medium',
        message: expect.stringContaining('Validation failed for data/test.json')
      })
    })
  })
})

describe('contentOperations', () => {
  let mockFs: ReturnType<typeof mockFileOperations>
  let restoreEnv: () => void

  beforeEach(() => {
    jest.clearAllMocks()
    mockFs = mockFileOperations()
    
    restoreEnv = mockEnvVars({
      NODE_ENV: 'test',
      OPENAI_API_KEY: 'test-key'
    })

    jest.spyOn(process, 'cwd').mockReturnValue('/test/root')
  })

  afterEach(() => {
    mockFs.reset()
    restoreEnv()
    jest.restoreAllMocks()
  })

  describe('healthCheck', () => {
    it('should return healthy status when system is available', async () => {
      const fs = require('fs').promises
      fs.access.mockResolvedValue(undefined)
      
      mockExec.mockImplementation((command, options, callback) => {
        const cb = callback as (error: Error | null, stdout: string, stderr: string) => void
        cb(null, 'status output', '')
        return {} as any
      })

      const result = await contentOperations.healthCheck()
      
      expect(result.healthy).toBe(true)
      expect(result.message).toContain('System healthy')
    })

    it('should return unhealthy when content system not available', async () => {
      const fs = require('fs').promises
      fs.access.mockRejectedValue(new Error('ENOENT'))

      const result = await contentOperations.healthCheck()
      
      expect(result.healthy).toBe(false)
      expect(result.message).toContain('Content-improver system not found')
    })

    it('should handle health check errors', async () => {
      const fs = require('fs').promises
      fs.access.mockResolvedValue(undefined)
      
      mockExec.mockImplementation((command, options, callback) => {
        const cb = callback as (error: Error | null, stdout: string, stderr: string) => void
        cb(new Error('Status failed'), '', '')
        return {} as any
      })

      const result = await contentOperations.healthCheck()
      
      expect(result.healthy).toBe(false)
      expect(result.message).toContain('Health check failed')
    })
  })

  describe('quickQualityCheck', () => {
    it('should calculate quality score based on issues', async () => {
      const fs = require('fs').promises
      
      // Mock file system for content files
      fs.readdir.mockResolvedValue([
        { name: 'hero.json', isDirectory: () => false, isFile: () => true },
        { name: 'services.json', isDirectory: () => false, isFile: () => true }
      ])
      fs.stat.mockResolvedValue({
        mtime: new Date('2024-01-15T10:00:00Z'),
        size: 1024
      })

      // Mock validation returning some issues
      mockExec.mockImplementation((command, options, callback) => {
        const cb = callback as (error: Error | null, stdout: string, stderr: string) => void
        cb(null, 'validation passed', '')
        return {} as any
      })

      const result = await contentOperations.quickQualityCheck()
      
      expect(result.score).toBeGreaterThanOrEqual(0)
      expect(result.score).toBeLessThanOrEqual(100)
      expect(Array.isArray(result.issues)).toBe(true)
    })

    it('should handle quality check errors', async () => {
      const fs = require('fs').promises
      fs.readdir.mockRejectedValue(new Error('Directory not found'))

      const result = await contentOperations.quickQualityCheck()
      
      expect(result.score).toBe(0)
      expect(result.issues).toHaveLength(1)
      expect(result.issues[0].severity).toBe('critical')
    })
  })
})

describe('singleton instance', () => {
  it('should provide a singleton contentIntegration instance', () => {
    expect(contentIntegration).toBeInstanceOf(ContentIntegration)
  })
})