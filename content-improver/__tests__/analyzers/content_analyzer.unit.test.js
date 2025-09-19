/**
 * Unit tests for Content Analyzer
 */

import ContentAnalyzer from '../../src/analyzers/content_analyzer.js'
import { setupMockFileSystem, mockContentFiles, captureConsole } from '../utils/test-helpers.js'

// Mock dependencies
jest.mock('../../src/validators/brand_voice_validator.js')
jest.mock('../../src/analyzers/report_generator.js')
jest.mock('fs')
jest.mock('path')

describe('ContentAnalyzer', () => {
  let analyzer
  let mockFs
  let consoleSpy
  let MockBrandVoiceValidator
  let MockReportGenerator

  beforeEach(() => {
    jest.clearAllMocks()
    mockFs = setupMockFileSystem()
    consoleSpy = captureConsole()
    
    // Mock BrandVoiceValidator
    MockBrandVoiceValidator = require('../../src/validators/brand_voice_validator.js').default
    MockBrandVoiceValidator.mockImplementation(() => ({
      validateContent: jest.fn().mockReturnValue({
        scores: {
          overall: 0.85,
          pillars: {
            expertise: 0.8,
            clarity: 0.9,
            impact: 0.8
          },
          tone: 0.8,
          jargon: 0.9,
          powerWords: 0.7,
          sentenceStructure: 0.8,
          signaturePhrases: 0.6
        },
        issues: [],
        suggestions: [
          { type: 'signature_phrases', message: 'Add more signature phrases' }
        ]
      }),
      generateReport: jest.fn().mockReturnValue('Mock voice report')
    }))

    // Mock ReportGenerator
    MockReportGenerator = require('../../src/analyzers/report_generator.js').default
    MockReportGenerator.mockImplementation(() => ({
      generateAnalysisReport: jest.fn().mockReturnValue('Mock analysis report'),
      generateSummaryReport: jest.fn().mockReturnValue('Mock summary report')
    }))

    // Mock path module
    const path = require('path')
    path.dirname.mockReturnValue('/content-improver/src/analyzers')
    path.join.mockImplementation((...args) => args.join('/'))
    path.resolve.mockImplementation((...args) => `/${args.join('/')}`)
    path.relative.mockImplementation((from, to) => to.replace(from, '').replace(/^\//, ''))
    path.extname.mockImplementation((p) => {
      const parts = p.split('.')
      return parts.length > 1 ? `.${parts.pop()}` : ''
    })
    path.basename.mockImplementation((p) => p.split('/').pop())

    analyzer = new ContentAnalyzer()
  })

  afterEach(() => {
    mockFs.reset()
    consoleSpy.restore()
  })

  describe('constructor', () => {
    it('should initialize with default state', () => {
      expect(analyzer.issues).toEqual([])
      expect(analyzer.suggestions).toEqual([])
      expect(analyzer.stats.totalFiles).toBe(0)
      expect(analyzer.stats.totalWords).toBe(0)
      expect(analyzer.fileAnalysis).toEqual({})
      expect(analyzer.voiceValidator).toBeDefined()
      expect(analyzer.reportGenerator).toBeDefined()
    })
  })

  describe('getJsonFiles', () => {
    beforeEach(() => {
      // Mock fs.readdirSync and fs.statSync
      const fs = require('fs')
      
      // Setup mock directory structure
      const mockDirStructure = {
        '/data': [
          { name: 'hero.json', isFile: () => true, isDirectory: () => false },
          { name: 'services.json', isFile: () => true, isDirectory: () => false },
          { name: 'readme.txt', isFile: () => true, isDirectory: () => false },
          { name: 'subfolder', isFile: () => false, isDirectory: () => true }
        ],
        '/data/subfolder': [
          { name: 'nested.json', isFile: () => true, isDirectory: () => false }
        ]
      }

      fs.readdirSync.mockImplementation((dirPath, options) => {
        const structure = mockDirStructure[dirPath] || []
        if (options && options.withFileTypes) {
          return structure
        }
        return structure.map(item => item.name)
      })

      fs.statSync.mockReturnValue({
        isFile: () => true,
        isDirectory: () => false
      })

      fs.existsSync.mockReturnValue(true)
    })

    it('should find JSON files recursively', () => {
      const files = analyzer.getJsonFiles('/data')
      
      expect(files).toEqual([
        '/data/hero.json',
        '/data/services.json',
        '/data/subfolder/nested.json'
      ])
    })

    it('should handle directory that does not exist', () => {
      const fs = require('fs')
      fs.existsSync.mockReturnValue(false)

      const files = analyzer.getJsonFiles('/nonexistent')
      
      expect(files).toEqual([])
      expect(consoleSpy.getErrors()).toContain(
        expect.stringContaining('Directory not found')
      )
    })

    it('should handle errors gracefully', () => {
      const fs = require('fs')
      fs.readdirSync.mockImplementation(() => {
        throw new Error('Permission denied')
      })

      const files = analyzer.getJsonFiles('/data')
      
      expect(files).toEqual([])
      expect(consoleSpy.getErrors()).toContain(
        expect.stringContaining('Error reading directory')
      )
    })
  })

  describe('analyzeFile', () => {
    beforeEach(() => {
      // Add sample files to mock filesystem
      Object.entries(mockContentFiles).forEach(([filePath, content]) => {
        mockFs.addFile(filePath, content)
      })
    })

    it('should analyze JSON file successfully', async () => {
      const filePath = 'data/hero.json'
      
      await analyzer.analyzeFile(filePath)
      
      expect(analyzer.fileAnalysis[filePath]).toBeDefined()
      expect(analyzer.fileAnalysis[filePath]).toEqual({
        wordCount: expect.any(Number),
        contentType: expect.any(String),
        voiceAnalysis: expect.any(Object),
        issues: expect.any(Array),
        suggestions: expect.any(Array),
        readabilityScore: expect.any(Number)
      })
      
      expect(analyzer.stats.totalFiles).toBe(1)
    })

    it('should handle invalid JSON gracefully', async () => {
      mockFs.addFile('data/invalid.json', 'invalid json content')
      
      await analyzer.analyzeFile('data/invalid.json')
      
      expect(analyzer.issues).toContainEqual({
        file: 'data/invalid.json',
        type: 'structure',
        severity: 'high',
        message: expect.stringContaining('Invalid JSON')
      })
    })

    it('should handle missing files gracefully', async () => {
      await analyzer.analyzeFile('data/missing.json')
      
      expect(analyzer.issues).toContainEqual({
        file: 'data/missing.json',
        type: 'structure',
        severity: 'high',
        message: expect.stringContaining('File not found')
      })
    })

    it('should detect content type from file path', async () => {
      mockFs.addFile('data/services.json', JSON.stringify([{
        title: 'Web Design',
        description: 'Beautiful websites'
      }]))
      
      await analyzer.analyzeFile('data/services.json')
      
      expect(analyzer.fileAnalysis['data/services.json'].contentType).toBe('services')
    })

    it('should calculate word count correctly', async () => {
      const testContent = {
        title: 'Test Title',
        description: 'This is a test description with multiple words'
      }
      mockFs.addFile('data/test.json', JSON.stringify(testContent))
      
      await analyzer.analyzeFile('data/test.json')
      
      const analysis = analyzer.fileAnalysis['data/test.json']
      expect(analysis.wordCount).toBeGreaterThan(0)
    })
  })

  describe('detectContentType', () => {
    it('should detect content type from file name', () => {
      expect(analyzer.detectContentType('data/hero.json')).toBe('hero')
      expect(analyzer.detectContentType('data/services.json')).toBe('services')
      expect(analyzer.detectContentType('data/testimonials.json')).toBe('testimonials')
      expect(analyzer.detectContentType('data/pricing.json')).toBe('pricing')
    })

    it('should detect content type from file structure', () => {
      const heroContent = {
        headline: 'Welcome',
        subheadline: 'We help businesses grow',
        cta: 'Get Started'
      }
      
      expect(analyzer.detectContentType('data/custom.json', heroContent)).toBe('hero')
    })

    it('should return general for unknown types', () => {
      const unknownContent = { randomField: 'value' }
      
      expect(analyzer.detectContentType('data/unknown.json', unknownContent)).toBe('general')
    })
  })

  describe('calculateReadabilityScore', () => {
    it('should calculate readability score for simple text', () => {
      const text = 'This is a simple text. It has short sentences. Easy to read.'
      
      const score = analyzer.calculateReadabilityScore(text)
      
      expect(score).toBeGreaterThanOrEqual(0)
      expect(score).toBeLessThanOrEqual(100)
    })

    it('should handle empty text', () => {
      const score = analyzer.calculateReadabilityScore('')
      
      expect(score).toBe(0)
    })

    it('should penalize long sentences', () => {
      const longText = 'This is a very long sentence that goes on and on and on and has many words and clauses that make it difficult to read and understand without taking a breath.'
      const shortText = 'Short sentence. Another short one. Easy to read.'
      
      const longScore = analyzer.calculateReadabilityScore(longText)
      const shortScore = analyzer.calculateReadabilityScore(shortText)
      
      expect(shortScore).toBeGreaterThan(longScore)
    })
  })

  describe('analyzeDirectory', () => {
    beforeEach(() => {
      // Mock fs operations for directory analysis
      const fs = require('fs')
      
      fs.existsSync.mockReturnValue(true)
      fs.readdirSync.mockReturnValue([
        { name: 'hero.json', isFile: () => true, isDirectory: () => false },
        { name: 'services.json', isFile: () => true, isDirectory: () => false }
      ])
      
      // Add mock files
      Object.entries(mockContentFiles).forEach(([filePath, content]) => {
        mockFs.addFile(filePath, content)
      })
    })

    it('should analyze entire directory successfully', async () => {
      const results = await analyzer.analyzeDirectory('/data')
      
      expect(results).toBeDefined()
      expect(analyzer.stats.totalFiles).toBeGreaterThan(0)
      expect(consoleSpy.getLogs()).toContain(
        expect.stringContaining('Analyzing content in: /data')
      )
    })

    it('should calculate summary statistics', async () => {
      await analyzer.analyzeDirectory('/data')
      
      expect(analyzer.stats.totalWords).toBeGreaterThan(0)
      expect(analyzer.stats.voiceConsistency.avgScore).toBeGreaterThanOrEqual(0)
      expect(analyzer.stats.voiceConsistency.avgScore).toBeLessThanOrEqual(1)
    })

    it('should generate pillar breakdown', async () => {
      await analyzer.analyzeDirectory('/data')
      
      expect(analyzer.stats.voiceConsistency.pillarBreakdown).toBeDefined()
      expect(typeof analyzer.stats.voiceConsistency.pillarBreakdown).toBe('object')
    })
  })

  describe('generateReport', () => {
    beforeEach(() => {
      // Setup some analysis data
      analyzer.stats = {
        totalFiles: 5,
        totalWords: 1200,
        avgReadability: 78,
        contentTypes: { hero: 1, services: 2, testimonials: 1 },
        voiceConsistency: {
          scores: [0.8, 0.7, 0.9, 0.6, 0.85],
          avgScore: 0.76,
          failedFiles: ['data/poor.json'],
          pillarBreakdown: {
            expertise: 0.8,
            clarity: 0.7,
            impact: 0.9
          }
        }
      }
      
      analyzer.issues = [
        {
          file: 'data/test.json',
          type: 'voice',
          severity: 'medium',
          message: 'Voice consistency below threshold'
        }
      ]
      
      analyzer.suggestions = [
        {
          file: 'data/test.json',
          type: 'improvement',
          message: 'Add more power words'
        }
      ]
    })

    it('should generate comprehensive analysis report', () => {
      const report = analyzer.generateReport()
      
      expect(report).toContain('CONTENT ANALYSIS REPORT')
      expect(report).toContain('📊 SUMMARY')
      expect(report).toContain('Total Files: 5')
      expect(report).toContain('Total Words: 1,200')
      expect(report).toContain('🎯 VOICE CONSISTENCY')
      expect(report).toContain('Average Score: 76%')
    })

    it('should include issues section when issues exist', () => {
      const report = analyzer.generateReport()
      
      expect(report).toContain('🚨 ISSUES FOUND')
      expect(report).toContain('Voice consistency below threshold')
    })

    it('should include suggestions section when suggestions exist', () => {
      const report = analyzer.generateReport()
      
      expect(report).toContain('💡 SUGGESTIONS')
      expect(report).toContain('Add more power words')
    })

    it('should show pillar breakdown', () => {
      const report = analyzer.generateReport()
      
      expect(report).toContain('📈 VOICE PILLAR BREAKDOWN')
      expect(report).toContain('expertise: 80%')
      expect(report).toContain('clarity: 70%')
      expect(report).toContain('impact: 90%')
    })
  })

  describe('helper methods', () => {
    it('should extract text content from JSON objects', () => {
      const jsonContent = {
        title: 'Test Title',
        description: 'Test description',
        nested: {
          text: 'Nested text'
        },
        array: [
          { title: 'Item 1' },
          { title: 'Item 2' }
        ]
      }
      
      const text = analyzer.extractTextContent(jsonContent)
      
      expect(text).toContain('Test Title')
      expect(text).toContain('Test description')
      expect(text).toContain('Nested text')
      expect(text).toContain('Item 1')
      expect(text).toContain('Item 2')
    })

    it('should count words in text', () => {
      const text = 'This is a test sentence with six words.'
      
      const count = analyzer.countWords(text)
      
      expect(count).toBe(9) // Including 'a' and articles
    })

    it('should handle empty or null text in word counting', () => {
      expect(analyzer.countWords('')).toBe(0)
      expect(analyzer.countWords(null)).toBe(0)
      expect(analyzer.countWords(undefined)).toBe(0)
    })
  })

  describe('error handling', () => {
    it('should handle voice validator errors gracefully', async () => {
      // Make voice validator throw error
      analyzer.voiceValidator.validateContent.mockImplementation(() => {
        throw new Error('Validation error')
      })
      
      mockFs.addFile('data/test.json', JSON.stringify({ title: 'Test' }))
      
      await analyzer.analyzeFile('data/test.json')
      
      expect(analyzer.issues).toContainEqual({
        file: 'data/test.json',
        type: 'analysis',
        severity: 'medium',
        message: expect.stringContaining('Voice validation failed')
      })
    })

    it('should continue analysis after individual file errors', async () => {
      const fs = require('fs')
      fs.existsSync.mockReturnValue(true)
      fs.readdirSync.mockReturnValue([
        { name: 'good.json', isFile: () => true, isDirectory: () => false },
        { name: 'bad.json', isFile: () => true, isDirectory: () => false }
      ])
      
      mockFs.addFile('data/good.json', JSON.stringify({ title: 'Good content' }))
      // bad.json will cause file not found error
      
      await analyzer.analyzeDirectory('/data')
      
      expect(analyzer.stats.totalFiles).toBeGreaterThan(0)
      expect(analyzer.issues.length).toBeGreaterThan(0)
    })
  })
})