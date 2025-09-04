#!/usr/bin/env node

/**
 * Brand Voice Validator Module
 * Provides voice analysis and validation functions for DesignWorks Bureau content
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

class BrandVoiceValidator {
  constructor() {
    this.config = this.loadConfig();
    this.voiceScores = {};
  }

  // Load brand voice configuration
  loadConfig() {
    try {
      const configPath = path.join(__dirname, 'brand_voice_config.json');
      return JSON.parse(fs.readFileSync(configPath, 'utf8'));
    } catch (error) {
      console.error('Failed to load brand voice config:', error);
      return null;
    }
  }

  // Main validation function
  validateContent(text, contentType = 'general') {
    if (!this.config) return null;

    const analysis = {
      contentType,
      expectedTone: this.config.contentTypeTones[contentType] || 'educational',
      scores: {
        overall: 0,
        pillars: this.analyzePillars(text),
        tone: this.analyzeTone(text, contentType),
        jargon: this.analyzeJargon(text),
        powerWords: this.analyzePowerWords(text),
        sentenceStructure: this.analyzeSentenceStructure(text),
        signaturePhrases: this.analyzeSignaturePhrases(text)
      },
      issues: [],
      suggestions: []
    };

    // Calculate overall score
    analysis.scores.overall = this.calculateOverallScore(analysis.scores);
    
    // Generate issues and suggestions
    this.generateFeedback(analysis);

    return analysis;
  }

  // Analyze adherence to voice pillars
  analyzePillars(text) {
    const scores = {};
    const textLower = text.toLowerCase();
    
    for (const [pillar, config] of Object.entries(this.config.voicePillars)) {
      const keywordCount = config.keywords.filter(keyword => 
        textLower.includes(keyword.toLowerCase())
      ).length;
      
      scores[pillar] = Math.min(keywordCount / config.keywords.length, 1);
    }
    
    return scores;
  }

  // Analyze tone appropriateness
  analyzeTone(text, contentType) {
    const expectedTone = this.config.contentTypeTones[contentType];
    if (!expectedTone) return 0.5;

    const toneConfig = this.config.toneSettings[expectedTone];
    if (!toneConfig) return 0.5;

    let score = 0;
    const sentences = this.getSentences(text);
    
    // Check sentence length for tone
    if (expectedTone === 'marketing') {
      // Marketing should have shorter sentences
      const avgWordCount = sentences.reduce((sum, s) => sum + s.split(' ').length, 0) / sentences.length;
      score += avgWordCount <= 12 ? 0.4 : 0.2;
    } else if (expectedTone === 'educational') {
      // Educational can have longer sentences
      const avgWordCount = sentences.reduce((sum, s) => sum + s.split(' ').length, 0) / sentences.length;
      score += (avgWordCount >= 10 && avgWordCount <= 20) ? 0.4 : 0.2;
    }

    // Check for power words based on tone
    const powerWords = this.getPowerWordsForTone(expectedTone);
    const powerWordCount = powerWords.filter(word => 
      text.toLowerCase().includes(word.toLowerCase())
    ).length;
    score += Math.min(powerWordCount / 5, 0.6);

    return score;
  }

  // Analyze jargon usage
  analyzeJargon(text) {
    const textLower = text.toLowerCase();
    const words = textLower.split(/\s+/);
    const jargonFound = [];
    
    for (const jargon of this.config.forbiddenJargon) {
      if (textLower.includes(jargon.toLowerCase())) {
        jargonFound.push(jargon);
      }
    }
    
    const jargonPercent = (jargonFound.length / words.length) * 100;
    const tolerancePercent = this.config.qualityMetrics.jargonTolerancePercent;
    
    // Return inverse score - less jargon = higher score
    const score = Math.max(0, 1 - (jargonPercent / tolerancePercent));
    
    // Store found jargon for suggestions
    this.lastJargonFound = jargonFound;
    
    return score;
  }

  // Analyze power word usage
  analyzePowerWords(text) {
    const textLower = text.toLowerCase();
    const words = textLower.split(/\s+/);
    let powerWordCount = 0;
    
    for (const category of Object.values(this.config.powerWords)) {
      for (const word of category) {
        if (textLower.includes(word.toLowerCase())) {
          powerWordCount++;
        }
      }
    }
    
    const powerWordPercent = (powerWordCount / words.length) * 100;
    const targetPercent = this.config.qualityMetrics.powerWordMinimumPercent;
    
    return Math.min(powerWordPercent / targetPercent, 1);
  }

  // Analyze sentence structure variety
  analyzeSentenceStructure(text) {
    const sentences = this.getSentences(text);
    if (sentences.length < 2) return 0.5;
    
    const lengths = sentences.map(s => s.split(' ').length);
    const avgLength = lengths.reduce((a, b) => a + b, 0) / lengths.length;
    
    // Calculate variance
    const variance = lengths.reduce((sum, length) => {
      return sum + Math.pow(length - avgLength, 2);
    }, 0) / lengths.length;
    
    // Higher variance = better mix of short and long sentences
    const targetVariance = 30; // Target variance for good rhythm
    const score = Math.min(variance / targetVariance, 1);
    
    return score;
  }

  // Analyze use of signature phrases
  analyzeSignaturePhrases(text) {
    const textLower = text.toLowerCase();
    const wordCount = text.split(/\s+/).length;
    let phraseCount = 0;
    
    for (const phrase of this.config.signaturePhrases) {
      if (textLower.includes(phrase.toLowerCase())) {
        phraseCount++;
      }
    }
    
    // Target: 1 signature phrase per 200 words
    const targetCount = Math.max(1, Math.floor(wordCount / 200));
    const score = Math.min(phraseCount / targetCount, 1);
    
    return score;
  }

  // Calculate overall voice consistency score
  calculateOverallScore(scores) {
    const weights = {
      pillars: 0.25,
      tone: 0.20,
      jargon: 0.20,
      powerWords: 0.15,
      sentenceStructure: 0.10,
      signaturePhrases: 0.10
    };
    
    let overallScore = 0;
    
    // Average pillar scores
    const pillarAvg = Object.values(scores.pillars).reduce((a, b) => a + b, 0) / 
                     Object.values(scores.pillars).length;
    overallScore += pillarAvg * weights.pillars;
    
    // Add weighted scores
    overallScore += scores.tone * weights.tone;
    overallScore += scores.jargon * weights.jargon;
    overallScore += scores.powerWords * weights.powerWords;
    overallScore += scores.sentenceStructure * weights.sentenceStructure;
    overallScore += scores.signaturePhrases * weights.signaturePhrases;
    
    return overallScore;
  }

  // Generate feedback based on analysis
  generateFeedback(analysis) {
    const threshold = this.config.qualityMetrics.voiceConsistencyThreshold;
    
    // Overall score feedback
    if (analysis.scores.overall < threshold) {
      analysis.issues.push({
        type: 'voice_consistency',
        severity: 'high',
        message: `Voice consistency score (${(analysis.scores.overall * 100).toFixed(1)}%) is below threshold (${threshold * 100}%)`
      });
    }
    
    // Pillar-specific feedback
    for (const [pillar, score] of Object.entries(analysis.scores.pillars)) {
      if (score < 0.5) {
        analysis.suggestions.push({
          type: 'pillar',
          pillar,
          message: `Strengthen "${pillar}" voice pillar. Consider using words like: ${
            this.config.voicePillars[pillar].keywords.slice(0, 3).join(', ')
          }`
        });
      }
    }
    
    // Jargon feedback
    if (this.lastJargonFound && this.lastJargonFound.length > 0) {
      analysis.issues.push({
        type: 'jargon',
        severity: 'medium',
        message: `Found corporate jargon: ${this.lastJargonFound.join(', ')}`
      });
      
      for (const jargon of this.lastJargonFound) {
        if (this.config.jargonReplacements[jargon]) {
          analysis.suggestions.push({
            type: 'jargon_replacement',
            original: jargon,
            replacement: this.config.jargonReplacements[jargon],
            message: `Replace "${jargon}" with "${this.config.jargonReplacements[jargon]}"`
          });
        }
      }
    }
    
    // Power words feedback
    if (analysis.scores.powerWords < 0.7) {
      analysis.suggestions.push({
        type: 'power_words',
        message: `Add more action words like: ${
          this.config.powerWords.action.slice(0, 3).join(', ')
        }`
      });
    }
    
    // Sentence structure feedback
    if (analysis.scores.sentenceStructure < 0.5) {
      analysis.suggestions.push({
        type: 'sentence_structure',
        message: 'Vary sentence length more. Mix short, punchy sentences with longer explanatory ones.'
      });
    }
    
    // Signature phrases feedback
    if (analysis.scores.signaturePhrases < 0.5) {
      analysis.suggestions.push({
        type: 'signature_phrases',
        message: `Consider adding a signature phrase like: "${
          this.config.signaturePhrases[Math.floor(Math.random() * 5)]
        }"`
      });
    }
  }

  // Helper function to get sentences from text
  getSentences(text) {
    return text.match(/[^.!?]+[.!?]+/g) || [text];
  }

  // Get power words appropriate for tone
  getPowerWordsForTone(tone) {
    const toneMap = {
      marketing: [...this.config.powerWords.action, ...this.config.powerWords.urgency],
      educational: [...this.config.powerWords.trust, ...this.config.powerWords.impact],
      support: [...this.config.powerWords.trust, ...this.config.powerWords.emotion],
      challenge: [...this.config.powerWords.impact, ...this.config.powerWords.action]
    };
    
    return toneMap[tone] || this.config.powerWords.trust;
  }

  // Apply voice improvements to text
  improveVoice(text, contentType = 'general') {
    let improved = text;
    
    // Replace jargon
    for (const [jargon, replacement] of Object.entries(this.config.jargonReplacements)) {
      const regex = new RegExp(`\\b${jargon}\\b`, 'gi');
      improved = improved.replace(regex, replacement);
    }
    
    // Add power words to weak CTAs
    if (contentType === 'cta' || contentType === 'hero') {
      improved = this.strengthenCTAs(improved);
    }
    
    // Ensure signature phrases in key content
    if (contentType === 'hero' || contentType === 'pricing') {
      improved = this.addSignaturePhrase(improved, contentType);
    }
    
    return improved;
  }

  // Strengthen CTAs with power words
  strengthenCTAs(text) {
    const weakCTAs = ['Learn More', 'Click Here', 'Submit', 'Continue'];
    const strongReplacements = [
      'Start Your Transformation',
      'Get Started Now',
      'Build Something Great',
      'Make It Happen'
    ];
    
    let improved = text;
    weakCTAs.forEach((weak, index) => {
      if (text.includes(weak)) {
        improved = improved.replace(weak, strongReplacements[index % strongReplacements.length]);
      }
    });
    
    return improved;
  }

  // Add appropriate signature phrase
  addSignaturePhrase(text, contentType) {
    const wordCount = text.split(/\s+/).length;
    
    // Only add if text is long enough and doesn't already have one
    if (wordCount > 50) {
      const hasSignature = this.config.signaturePhrases.some(phrase => 
        text.toLowerCase().includes(phrase.toLowerCase())
      );
      
      if (!hasSignature) {
        const appropriatePhrases = this.getSignaturePhrasesForType(contentType);
        const phrase = appropriatePhrases[0];
        
        // Add at the end of the first paragraph if possible
        const firstParagraphEnd = text.indexOf('\n');
        if (firstParagraphEnd > 0) {
          text = text.slice(0, firstParagraphEnd) + ` ${phrase}` + text.slice(firstParagraphEnd);
        }
      }
    }
    
    return text;
  }

  // Get signature phrases appropriate for content type
  getSignaturePhrasesForType(contentType) {
    const typeMap = {
      hero: ['Good design. Every month. No drama.', 'Design that works'],
      pricing: ['Stop buying design that doesn\'t work', 'Simple, honest, creative'],
      cta: ['Let\'s be clear', 'Design that gets remembered'],
      portfolio: ['Not pretty. Powerful.', 'Impact before decoration']
    };
    
    return typeMap[contentType] || this.config.signaturePhrases;
  }

  // Generate voice report
  generateReport(analysis) {
    const report = [];
    
    report.push('📊 BRAND VOICE ANALYSIS REPORT');
    report.push('═'.repeat(60));
    
    // Overall score
    const scorePercent = (analysis.scores.overall * 100).toFixed(1);
    const emoji = analysis.scores.overall >= 0.8 ? '✅' : 
                  analysis.scores.overall >= 0.6 ? '⚠️' : '❌';
    report.push(`\n${emoji} Overall Voice Consistency: ${scorePercent}%`);
    
    // Pillar scores
    report.push('\n📍 Voice Pillar Scores:');
    for (const [pillar, score] of Object.entries(analysis.scores.pillars)) {
      const pillarPercent = (score * 100).toFixed(0);
      const pillarEmoji = score >= 0.7 ? '✓' : '✗';
      report.push(`  ${pillarEmoji} ${pillar.charAt(0).toUpperCase() + pillar.slice(1)}: ${pillarPercent}%`);
    }
    
    // Component scores
    report.push('\n📈 Component Analysis:');
    report.push(`  • Tone Alignment: ${(analysis.scores.tone * 100).toFixed(0)}%`);
    report.push(`  • Jargon-Free: ${(analysis.scores.jargon * 100).toFixed(0)}%`);
    report.push(`  • Power Words: ${(analysis.scores.powerWords * 100).toFixed(0)}%`);
    report.push(`  • Sentence Variety: ${(analysis.scores.sentenceStructure * 100).toFixed(0)}%`);
    report.push(`  • Signature Phrases: ${(analysis.scores.signaturePhrases * 100).toFixed(0)}%`);
    
    // Issues
    if (analysis.issues.length > 0) {
      report.push('\n🚨 Issues Found:');
      for (const issue of analysis.issues) {
        report.push(`  ❌ ${issue.message}`);
      }
    }
    
    // Suggestions
    if (analysis.suggestions.length > 0) {
      report.push('\n💡 Suggestions:');
      for (const suggestion of analysis.suggestions) {
        report.push(`  → ${suggestion.message}`);
      }
    }
    
    return report.join('\n');
  }
}

// Export for use in other scripts
export default BrandVoiceValidator;

// Allow direct execution for testing
if (import.meta.url === `file://${process.argv[1]}`) {
  const validator = new BrandVoiceValidator();
  
  // Test with sample text
  const sampleText = `
    We leverage cutting-edge synergies to deliver holistic design solutions 
    that revolutionize your brand ecosystem. Our seamless, best-in-class 
    methodology ensures robust results.
  `;
  
  console.log('\n🧪 Testing Brand Voice Validator\n');
  console.log('Sample text:', sampleText);
  
  const analysis = validator.validateContent(sampleText, 'hero');
  console.log('\n' + validator.generateReport(analysis));
  
  console.log('\n✨ Improved version:');
  const improved = validator.improveVoice(sampleText, 'hero');
  console.log(improved);
  
  console.log('\n📊 Re-analyzing improved text:');
  const improvedAnalysis = validator.validateContent(improved, 'hero');
  console.log(validator.generateReport(improvedAnalysis));
}