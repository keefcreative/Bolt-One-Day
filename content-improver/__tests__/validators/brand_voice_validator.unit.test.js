/**
 * Unit tests for Brand Voice Validator
 */

import BrandVoiceValidator from '../../src/validators/brand_voice_validator.js'
import { setupMockFileSystem, createSampleContentData, captureConsole } from '../utils/test-helpers.js'

// Mock fs
jest.mock('fs')

// Mock path
jest.mock('path')

describe('BrandVoiceValidator', () => {
  let validator
  let mockFs
  let consoleSpy

  beforeEach(() => {
    jest.clearAllMocks()
    mockFs = setupMockFileSystem()
    
    // Mock brand voice config
    const mockConfig = {
      voicePillars: {
        expertise: {
          keywords: ['professional', 'expert', 'skilled', 'experienced']
        },
        clarity: {
          keywords: ['clear', 'simple', 'straightforward', 'direct']
        },
        impact: {
          keywords: ['powerful', 'effective', 'results', 'impact']
        }
      },
      contentTypeTones: {
        hero: 'marketing',
        services: 'educational',
        cta: 'marketing',
        general: 'educational'
      },
      toneSettings: {
        marketing: { powerWords: true, urgency: true },
        educational: { clarity: true, expertise: true }
      },
      forbiddenJargon: [
        'leverage',
        'synergies',
        'holistic',
        'cutting-edge',
        'best-in-class',
        'seamless'
      ],
      jargonReplacements: {
        'leverage': 'use',
        'synergies': 'collaboration',
        'holistic': 'complete',
        'cutting-edge': 'modern',
        'best-in-class': 'excellent',
        'seamless': 'smooth'
      },
      powerWords: {
        action: ['transform', 'create', 'build', 'deliver'],
        trust: ['proven', 'reliable', 'trusted', 'experienced'],
        urgency: ['now', 'today', 'immediately', 'quickly'],
        impact: ['powerful', 'effective', 'outstanding', 'exceptional'],
        emotion: ['amazing', 'incredible', 'stunning', 'beautiful']
      },
      signaturePhrases: [
        'Good design. Every month. No drama.',
        'Design that works',
        'Stop buying design that doesn\'t work',
        'Simple, honest, creative',
        'Not pretty. Powerful.'
      ],
      qualityMetrics: {
        voiceConsistencyThreshold: 0.75,
        jargonTolerancePercent: 5,
        powerWordMinimumPercent: 3
      }
    }

    // Add mock config to file system
    mockFs.addFile('/content-improver/src/config/brand_voice_config.json', JSON.stringify(mockConfig))

    // Mock path.join to return expected config path
    const path = require('path')
    path.join.mockImplementation((...args) => args.join('/'))
    path.dirname.mockReturnValue('/content-improver/src/validators')

    validator = new BrandVoiceValidator()
    consoleSpy = captureConsole()
  })

  afterEach(() => {
    mockFs.reset()
    consoleSpy.restore()
  })

  describe('constructor and config loading', () => {
    it('should load configuration successfully', () => {
      expect(validator.config).toBeDefined()
      expect(validator.config.voicePillars).toBeDefined()
      expect(validator.config.forbiddenJargon).toBeDefined()
    })

    it('should handle missing config file gracefully', () => {
      mockFs.removeFile('/content-improver/src/config/brand_voice_config.json')
      
      const validatorWithoutConfig = new BrandVoiceValidator()
      
      expect(validatorWithoutConfig.config).toBeNull()
      expect(consoleSpy.getErrors()).toContain(
        expect.stringContaining('Failed to load brand voice config')
      )
    })
  })

  describe('validateContent', () => {
    it('should analyze content and return comprehensive results', () => {
      const testText = 'Our professional team creates powerful, clear solutions that deliver exceptional results.'
      
      const analysis = validator.validateContent(testText, 'hero')
      
      expect(analysis).toEqual({
        contentType: 'hero',
        expectedTone: 'marketing',
        scores: expect.objectContaining({
          overall: expect.any(Number),
          pillars: expect.any(Object),
          tone: expect.any(Number),
          jargon: expect.any(Number),
          powerWords: expect.any(Number),
          sentenceStructure: expect.any(Number),
          signaturePhrases: expect.any(Number)
        }),
        issues: expect.any(Array),
        suggestions: expect.any(Array)
      })
    })

    it('should return null for missing config', () => {
      const validatorWithoutConfig = new BrandVoiceValidator()
      validatorWithoutConfig.config = null
      
      const result = validatorWithoutConfig.validateContent('test text')
      
      expect(result).toBeNull()
    })

    it('should handle empty text', () => {
      const analysis = validator.validateContent('', 'general')
      
      expect(analysis.scores.overall).toBeGreaterThanOrEqual(0)
      expect(analysis.scores.overall).toBeLessThanOrEqual(1)
    })
  })

  describe('analyzePillars', () => {
    it('should score pillar keywords correctly', () => {
      const text = 'Our professional team provides expert, clear solutions'
      
      const scores = validator.analyzePillars(text)
      
      expect(scores.expertise).toBeGreaterThan(0) // Contains 'professional', 'expert'
      expect(scores.clarity).toBeGreaterThan(0) // Contains 'clear'
      expect(scores.impact).toBe(0) // No impact words
    })

    it('should handle text without pillar keywords', () => {
      const text = 'Hello world this is a test'
      
      const scores = validator.analyzePillars(text)
      
      expect(scores.expertise).toBe(0)
      expect(scores.clarity).toBe(0)
      expect(scores.impact).toBe(0)
    })
  })

  describe('analyzeTone', () => {
    it('should score marketing tone appropriately', () => {
      const text = 'Transform your business now! Create amazing results today.'
      
      const score = validator.analyzeTone(text, 'hero') // hero = marketing tone
      
      expect(score).toBeGreaterThan(0)
      expect(score).toBeLessThanOrEqual(1)
    })

    it('should handle unknown content types', () => {
      const score = validator.analyzeTone('test text', 'unknown')
      
      expect(score).toBe(0.5) // Default score
    })
  })

  describe('analyzeJargon', () => {
    it('should detect forbidden jargon', () => {
      const text = 'We leverage cutting-edge synergies to deliver holistic solutions'
      
      const score = validator.analyzeJargon(text)
      
      expect(score).toBeLessThan(1) // Should be penalized for jargon
      expect(validator.lastJargonFound).toContain('leverage')
      expect(validator.lastJargonFound).toContain('cutting-edge')
      expect(validator.lastJargonFound).toContain('synergies')
      expect(validator.lastJargonFound).toContain('holistic')
    })

    it('should score clean text highly', () => {
      const text = 'We use modern collaboration to deliver complete solutions'
      
      const score = validator.analyzeJargon(text)
      
      expect(score).toBe(1) // No jargon penalty
      expect(validator.lastJargonFound).toHaveLength(0)
    })
  })

  describe('analyzePowerWords', () => {
    it('should reward power word usage', () => {
      const text = 'Transform your business and create powerful, trusted results'
      
      const score = validator.analyzePowerWords(text)
      
      expect(score).toBeGreaterThan(0)
    })

    it('should handle text without power words', () => {
      const text = 'This is some regular text without special words'
      
      const score = validator.analyzePowerWords(text)
      
      expect(score).toBe(0)
    })
  })

  describe('analyzeSentenceStructure', () => {
    it('should reward sentence variety', () => {
      const text = 'Short sentence. This is a much longer sentence with many words. Medium length sentence here.'
      
      const score = validator.analyzeSentenceStructure(text)
      
      expect(score).toBeGreaterThan(0)
    })

    it('should handle single sentence', () => {
      const text = 'Just one sentence here.'
      
      const score = validator.analyzeSentenceStructure(text)
      
      expect(score).toBe(0.5) // Default for insufficient data
    })
  })

  describe('analyzeSignaturePhrases', () => {
    it('should detect signature phrases', () => {
      const text = 'Good design. Every month. No drama. This is our approach to web design.'
      
      const score = validator.analyzeSignaturePhrases(text)
      
      expect(score).toBeGreaterThan(0)
    })

    it('should handle text without signature phrases', () => {
      const text = 'Regular content without any signature phrases from our brand'
      
      const score = validator.analyzeSignaturePhrases(text)
      
      expect(score).toBeLessThan(1)
    })
  })

  describe('improveVoice', () => {
    it('should replace jargon with better alternatives', () => {
      const text = 'We leverage cutting-edge synergies'
      
      const improved = validator.improveVoice(text)
      
      expect(improved).not.toContain('leverage')
      expect(improved).not.toContain('cutting-edge')
      expect(improved).not.toContain('synergies')
      expect(improved).toContain('use')
      expect(improved).toContain('modern')
      expect(improved).toContain('collaboration')
    })

    it('should strengthen CTAs for hero content', () => {
      const text = 'Learn More about our services'
      
      const improved = validator.improveVoice(text, 'hero')
      
      expect(improved).not.toContain('Learn More')
      expect(improved).toMatch(/Start Your Transformation|Get Started Now|Build Something Great|Make It Happen/)
    })

    it('should add signature phrases to long hero content', () => {
      const longText = 'This is a long piece of hero content that talks about our services and what we do for clients. It has many words and should trigger signature phrase addition because it meets the word count threshold.'
      
      const improved = validator.improveVoice(longText, 'hero')
      
      // Should contain one of the hero signature phrases
      const hasSignature = [
        'Good design. Every month. No drama.',
        'Design that works'
      ].some(phrase => improved.includes(phrase))
      
      expect(hasSignature).toBe(true)
    })
  })

  describe('generateReport', () => {
    it('should generate comprehensive analysis report', () => {
      const text = 'Our professional team creates powerful solutions'
      const analysis = validator.validateContent(text, 'hero')
      
      const report = validator.generateReport(analysis)
      
      expect(report).toContain('BRAND VOICE ANALYSIS REPORT')
      expect(report).toContain('Overall Voice Consistency')
      expect(report).toContain('Voice Pillar Scores')
      expect(report).toContain('Component Analysis')
    })

    it('should include issues and suggestions when present', () => {
      const poorText = 'We leverage synergies to deliver solutions'
      const analysis = validator.validateContent(poorText, 'hero')
      
      const report = validator.generateReport(analysis)
      
      if (analysis.issues.length > 0) {
        expect(report).toContain('Issues Found')
      }
      
      if (analysis.suggestions.length > 0) {
        expect(report).toContain('Suggestions')
      }
    })
  })

  describe('helper methods', () => {
    it('should split text into sentences correctly', () => {
      const text = 'First sentence. Second sentence! Third sentence?'
      
      const sentences = validator.getSentences(text)
      
      expect(sentences).toHaveLength(3)
      expect(sentences[0]).toContain('First sentence.')
    })

    it('should get appropriate power words for tone', () => {
      const marketingWords = validator.getPowerWordsForTone('marketing')
      const educationalWords = validator.getPowerWordsForTone('educational')
      
      expect(marketingWords).toContain('transform')
      expect(educationalWords).toContain('trusted')
    })

    it('should get signature phrases for content type', () => {
      const heroePhrases = validator.getSignaturePhrasesForType('hero')
      const pricingPhrases = validator.getSignaturePhrasesForType('pricing')
      
      expect(heroePhrases).toContain('Good design. Every month. No drama.')
      expect(pricingPhrases).toContain('Stop buying design that doesn\'t work')
    })
  })
})

describe('BrandVoiceValidator integration scenarios', () => {
  let validator
  let mockFs

  beforeEach(() => {
    mockFs = setupMockFileSystem()
    
    // Create minimal valid config
    const minimalConfig = {
      voicePillars: {
        expertise: { keywords: ['expert'] },
        clarity: { keywords: ['clear'] }
      },
      contentTypeTones: {
        general: 'educational'
      },
      toneSettings: {
        educational: {}
      },
      forbiddenJargon: ['jargon'],
      jargonReplacements: { 'jargon': 'language' },
      powerWords: {
        action: ['create']
      },
      signaturePhrases: ['Test phrase'],
      qualityMetrics: {
        voiceConsistencyThreshold: 0.7,
        jargonTolerancePercent: 5,
        powerWordMinimumPercent: 2
      }
    }

    mockFs.addFile('/content-improver/src/config/brand_voice_config.json', JSON.stringify(minimalConfig))
    
    const path = require('path')
    path.join.mockImplementation((...args) => args.join('/'))
    path.dirname.mockReturnValue('/content-improver/src/validators')

    validator = new BrandVoiceValidator()
  })

  afterEach(() => {
    mockFs.reset()
  })

  it('should handle complete validation workflow', () => {
    const originalText = 'We use corporate jargon to deliver solutions'
    
    // Analyze original
    const originalAnalysis = validator.validateContent(originalText, 'general')
    expect(originalAnalysis.scores.overall).toBeDefined()
    
    // Improve text
    const improvedText = validator.improveVoice(originalText, 'general')
    expect(improvedText).not.toContain('jargon')
    expect(improvedText).toContain('language')
    
    // Re-analyze improved
    const improvedAnalysis = validator.validateContent(improvedText, 'general')
    expect(improvedAnalysis.scores.jargon).toBeGreaterThanOrEqual(originalAnalysis.scores.jargon)
    
    // Generate reports
    const originalReport = validator.generateReport(originalAnalysis)
    const improvedReport = validator.generateReport(improvedAnalysis)
    
    expect(originalReport).toContain('BRAND VOICE ANALYSIS REPORT')
    expect(improvedReport).toContain('BRAND VOICE ANALYSIS REPORT')
  })
})