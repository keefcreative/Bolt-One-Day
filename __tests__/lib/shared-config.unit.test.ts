/**
 * Unit tests for Shared Configuration System
 */

import { 
  sharedConfig, 
  configUtils, 
  initializeSharedConfig,
  SharedConfig 
} from '@/lib/shared-config'
import { mockEnvVars, mockFileOperations } from '../utils/test-helpers'
import path from 'path'

// Mock fs
jest.mock('fs', () => ({
  promises: {
    writeFile: jest.fn(),
    mkdir: jest.fn(),
  },
}))

// Mock path
jest.mock('path')

// Mock dotenv
jest.mock('dotenv', () => ({
  config: jest.fn(),
}))

describe('SharedConfig', () => {
  let mockFs: ReturnType<typeof mockFileOperations>
  let restoreEnv: () => void
  let originalCwd: string

  beforeEach(() => {
    jest.clearAllMocks()
    mockFs = mockFileOperations()
    originalCwd = process.cwd()
    
    // Mock process.cwd
    jest.spyOn(process, 'cwd').mockReturnValue('/test/project')
    
    // Mock path.join
    const mockPath = require('path')
    mockPath.join.mockImplementation((...args: string[]) => args.join('/'))
  })

  afterEach(() => {
    mockFs.reset()
    if (restoreEnv) restoreEnv()
    jest.restoreAllMocks()
    Object.defineProperty(process, 'cwd', { value: () => originalCwd })
  })

  describe('sharedConfig creation', () => {
    it('should create config with default values', () => {
      restoreEnv = mockEnvVars({})
      
      // Re-require to get fresh config
      jest.resetModules()
      const { sharedConfig } = require('@/lib/shared-config')
      
      expect(sharedConfig.openai.model).toBe('gpt-4-turbo-preview')
      expect(sharedConfig.openai.maxTokens).toBe(4000)
      expect(sharedConfig.content.qualityThreshold).toBe(75)
      expect(sharedConfig.content.logLevel).toBe('info')
      expect(sharedConfig.content.autoBackup).toBe(true)
    })

    it('should create config with environment variables', () => {
      restoreEnv = mockEnvVars({
        OPENAI_API_KEY: 'test-openai-key',
        OPENAI_MODEL: 'gpt-3.5-turbo',
        OPENAI_MAX_TOKENS: '2000',
        FREEPIK_API_KEY: 'test-freepik-key',
        REPLICATE_API_TOKEN: 'test-replicate-token',
        CONTENT_SYSTEM_ENABLED: 'true',
        CONTENT_AUTO_BACKUP: 'false',
        CONTENT_QUALITY_THRESHOLD: '80',
        CONTENT_LOG_LEVEL: 'debug',
        CONTENT_MAX_IMPROVEMENTS_PER_RUN: '25',
        CONTENT_REVIEW_REQUIRED: 'false',
        CONTENT_ANALYTICS_ENABLED: 'false',
        INTEGRATION_WEBHOOK_URL: 'https://api.test.com/webhook',
        INTEGRATION_SECRET: 'webhook-secret'
      })

      // Re-require to get fresh config
      jest.resetModules()
      const { sharedConfig } = require('@/lib/shared-config')
      
      expect(sharedConfig.openai.apiKey).toBe('test-openai-key')
      expect(sharedConfig.openai.model).toBe('gpt-3.5-turbo')
      expect(sharedConfig.openai.maxTokens).toBe(2000)
      expect(sharedConfig.freepik.enabled).toBe(true)
      expect(sharedConfig.replicate.enabled).toBe(true)
      expect(sharedConfig.content.systemEnabled).toBe(true)
      expect(sharedConfig.content.autoBackup).toBe(false)
      expect(sharedConfig.content.qualityThreshold).toBe(80)
      expect(sharedConfig.content.logLevel).toBe('debug')
      expect(sharedConfig.integration.enabled).toBe(true)
    })

    it('should set correct paths', () => {
      expect(sharedConfig.paths.root).toBe('/test/project')
      expect(sharedConfig.paths.contentImprover).toBe('/test/project/content-improver')
      expect(sharedConfig.paths.data).toBe('/test/project/data')
    })
  })

  describe('configUtils.validate', () => {
    it('should pass validation with required config', () => {
      restoreEnv = mockEnvVars({
        OPENAI_API_KEY: 'test-key',
        CONTENT_SYSTEM_ENABLED: 'true'
      })

      jest.resetModules()
      const { configUtils } = require('@/lib/shared-config')
      
      const result = configUtils.validate()
      
      expect(result.valid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it('should fail validation without OpenAI API key', () => {
      restoreEnv = mockEnvVars({
        CONTENT_SYSTEM_ENABLED: 'true'
      })

      jest.resetModules()
      const { configUtils } = require('@/lib/shared-config')
      
      const result = configUtils.validate()
      
      expect(result.valid).toBe(false)
      expect(result.errors).toContain('OPENAI_API_KEY is required for content improvements')
    })

    it('should fail validation when system disabled', () => {
      restoreEnv = mockEnvVars({
        OPENAI_API_KEY: 'test-key',
        CONTENT_SYSTEM_ENABLED: 'false'
      })

      jest.resetModules()
      const { configUtils } = require('@/lib/shared-config')
      
      const result = configUtils.validate()
      
      expect(result.valid).toBe(false)
      expect(result.errors).toContain('Content system is disabled (CONTENT_SYSTEM_ENABLED=false)')
    })
  })

  describe('configUtils.getContentImproverEnv', () => {
    it('should return environment variables for content-improver', () => {
      restoreEnv = mockEnvVars({
        OPENAI_API_KEY: 'test-key',
        NODE_ENV: 'production'
      })

      jest.resetModules()
      const { configUtils } = require('@/lib/shared-config')
      
      const env = configUtils.getContentImproverEnv()
      
      expect(env.OPENAI_API_KEY).toBe('test-key')
      expect(env.OPENAI_MODEL).toBe('gpt-4-turbo-preview')
      expect(env.NODE_ENV).toBe('production')
      expect(env.CONTENT_QUALITY_THRESHOLD).toBe('75')
    })

    it('should handle missing API keys', () => {
      restoreEnv = mockEnvVars({})

      jest.resetModules()
      const { configUtils } = require('@/lib/shared-config')
      
      const env = configUtils.getContentImproverEnv()
      
      expect(env.OPENAI_API_KEY).toBe('')
      expect(env.FREEPIK_API_KEY).toBe('')
      expect(env.REPLICATE_API_TOKEN).toBe('')
    })
  })

  describe('configUtils.syncEnvironmentToContentImprover', () => {
    it('should write environment file to content-improver', async () => {
      const fs = require('fs').promises
      fs.writeFile.mockResolvedValue(undefined)
      
      restoreEnv = mockEnvVars({
        OPENAI_API_KEY: 'test-key'
      })

      jest.resetModules()
      const { configUtils } = require('@/lib/shared-config')
      
      await configUtils.syncEnvironmentToContentImprover()
      
      expect(fs.writeFile).toHaveBeenCalledWith(
        '/test/project/content-improver/.env',
        expect.stringContaining('OPENAI_API_KEY=test-key'),
        'utf-8'
      )
    })

    it('should format environment variables correctly', async () => {
      const fs = require('fs').promises
      fs.writeFile.mockResolvedValue(undefined)
      
      restoreEnv = mockEnvVars({
        OPENAI_API_KEY: 'test-key',
        CONTENT_LOG_LEVEL: 'debug'
      })

      jest.resetModules()
      const { configUtils } = require('@/lib/shared-config')
      
      await configUtils.syncEnvironmentToContentImprover()
      
      const writeCall = fs.writeFile.mock.calls[0]
      const envContent = writeCall[1]
      
      expect(envContent).toContain('OPENAI_API_KEY=test-key')
      expect(envContent).toContain('CONTENT_LOG_LEVEL=debug')
      expect(envContent).toMatch(/\n$/) // Should end with newline
    })
  })

  describe('configUtils.ensureDirectories', () => {
    it('should create required directories', async () => {
      const fs = require('fs').promises
      fs.mkdir.mockResolvedValue(undefined)
      
      await configUtils.ensureDirectories()
      
      expect(fs.mkdir).toHaveBeenCalledWith(
        expect.stringContaining('/improvements'),
        { recursive: true }
      )
      expect(fs.mkdir).toHaveBeenCalledWith(
        expect.stringContaining('/backups'),
        { recursive: true }
      )
      expect(fs.mkdir).toHaveBeenCalledWith(
        expect.stringContaining('/logs'),
        { recursive: true }
      )
    })

    it('should handle directory creation errors gracefully', async () => {
      const fs = require('fs').promises
      fs.mkdir.mockRejectedValue(new Error('Directory exists'))
      
      // Should not throw
      await expect(configUtils.ensureDirectories()).resolves.toBeUndefined()
    })
  })

  describe('configUtils.getSummary', () => {
    it('should return configuration summary', () => {
      restoreEnv = mockEnvVars({
        OPENAI_API_KEY: 'test-key',
        FREEPIK_API_KEY: 'freepik-key',
        CONTENT_SYSTEM_ENABLED: 'true',
        INTEGRATION_WEBHOOK_URL: 'https://api.test.com/webhook'
      })

      jest.resetModules()
      const { configUtils } = require('@/lib/shared-config')
      
      const summary = configUtils.getSummary()
      
      expect(summary.system.enabled).toBe(true)
      expect(summary.apis.openai).toBe(true)
      expect(summary.apis.freepik).toBe(true)
      expect(summary.integration.webhookEnabled).toBe(true)
      expect(summary.paths.root).toBe('/test/project')
    })

    it('should show disabled APIs correctly', () => {
      restoreEnv = mockEnvVars({
        OPENAI_API_KEY: 'test-key'
        // No other API keys
      })

      jest.resetModules()
      const { configUtils } = require('@/lib/shared-config')
      
      const summary = configUtils.getSummary()
      
      expect(summary.apis.openai).toBe(true)
      expect(summary.apis.freepik).toBe(false)
      expect(summary.apis.replicate).toBe(false)
      expect(summary.integration.webhookEnabled).toBe(false)
    })
  })

  describe('initializeSharedConfig', () => {
    it('should complete initialization successfully', async () => {
      const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation()
      const fs = require('fs').promises
      fs.writeFile.mockResolvedValue(undefined)
      fs.mkdir.mockResolvedValue(undefined)
      
      restoreEnv = mockEnvVars({
        OPENAI_API_KEY: 'test-key',
        CONTENT_SYSTEM_ENABLED: 'true'
      })

      jest.resetModules()
      const { initializeSharedConfig } = require('@/lib/shared-config')
      
      await initializeSharedConfig()
      
      expect(consoleLogSpy).toHaveBeenCalledWith(
        '✅ Environment synchronized to content-improver system'
      )
      
      consoleLogSpy.mockRestore()
    })

    it('should warn about validation failures', async () => {
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation()
      const fs = require('fs').promises
      fs.writeFile.mockResolvedValue(undefined)
      fs.mkdir.mockResolvedValue(undefined)
      
      restoreEnv = mockEnvVars({
        // Missing required config
      })

      jest.resetModules()
      const { initializeSharedConfig } = require('@/lib/shared-config')
      
      await initializeSharedConfig()
      
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        'Configuration validation failed:',
        expect.any(Array)
      )
      
      consoleWarnSpy.mockRestore()
    })

    it('should handle sync errors gracefully', async () => {
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation()
      const fs = require('fs').promises
      fs.writeFile.mockRejectedValue(new Error('Write failed'))
      fs.mkdir.mockResolvedValue(undefined)
      
      restoreEnv = mockEnvVars({
        OPENAI_API_KEY: 'test-key',
        CONTENT_SYSTEM_ENABLED: 'true'
      })

      jest.resetModules()
      const { initializeSharedConfig } = require('@/lib/shared-config')
      
      await initializeSharedConfig()
      
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        '⚠️ Failed to sync environment to content-improver:',
        expect.any(Error)
      )
      
      consoleWarnSpy.mockRestore()
    })
  })
})