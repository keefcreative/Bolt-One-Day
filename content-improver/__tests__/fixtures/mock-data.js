/**
 * Mock data for content-improver tests
 */

export const mockContentFiles = {
  'data/hero.json': JSON.stringify({
    headline: "Transform Your Business",
    subheadline: "We help companies grow",
    description: "Our expert team delivers results",
    primaryCTA: "Get Started",
    secondaryCTA: "Learn More"
  }),
  
  'data/services.json': JSON.stringify([
    {
      title: "Web Design",
      description: "Beautiful websites",
      features: ["Responsive", "Fast", "SEO-friendly"]
    },
    {
      title: "Branding",
      description: "Brand identity packages",
      features: ["Logo", "Guidelines", "Materials"]
    }
  ]),
  
  'data/testimonials.json': JSON.stringify([
    {
      name: "John Doe",
      company: "TechCorp",
      content: "Great work!",
      rating: 5
    }
  ])
}

export const mockImprovementResult = {
  improvements: [
    {
      file: 'data/hero.json',
      section: 'hero',
      field: 'headline',
      original: 'Transform Your Business',
      improved: 'Transform Your Business with Premium Design',
      reasoning: 'Added specificity to make the value proposition clearer',
      confidence: 0.9
    }
  ],
  summary: {
    totalImprovements: 1,
    qualityScore: 85,
    brandAlignment: 'good'
  }
}

export const mockAnalysisResult = {
  overallScore: 78,
  sections: {
    hero: {
      score: 85,
      issues: ['Headline could be more specific'],
      strengths: ['Clear value proposition']
    },
    services: {
      score: 72,
      issues: ['Descriptions are too brief'],
      strengths: ['Good structure']
    }
  },
  recommendations: [
    'Add more descriptive headlines',
    'Expand service descriptions'
  ]
}

export const mockBrandVoiceConfig = {
  tone: 'professional',
  voice: 'confident',
  personality: ['innovative', 'reliable', 'premium'],
  guidelines: [
    'Use active voice',
    'Focus on benefits over features',
    'Maintain premium positioning'
  ],
  avoidWords: ['cheap', 'basic', 'simple'],
  preferredWords: ['premium', 'exceptional', 'outstanding']
}

export const mockWorkflowState = {
  currentStep: 'analyze',
  steps: [
    { name: 'analyze', status: 'completed' },
    { name: 'improve', status: 'in-progress' },
    { name: 'review', status: 'pending' },
    { name: 'implement', status: 'pending' }
  ],
  metadata: {
    startTime: '2024-01-15T10:00:00Z',
    totalFiles: 5,
    processedFiles: 3
  }
}

export const mockImplementationLog = {
  entries: [
    {
      timestamp: '2024-01-15T10:30:00Z',
      action: 'file_updated',
      file: 'data/hero.json',
      changes: [
        {
          field: 'headline',
          oldValue: 'Transform Your Business',
          newValue: 'Transform Your Business with Premium Design'
        }
      ]
    }
  ],
  summary: {
    totalChanges: 1,
    filesModified: 1,
    success: true
  }
}

export const mockReportData = {
  timestamp: '2024-01-15T11:00:00Z',
  summary: {
    totalFiles: 5,
    totalImprovements: 12,
    qualityScore: 88,
    brandAlignment: 'excellent'
  },
  details: {
    bySection: {
      hero: { improvements: 3, score: 90 },
      services: { improvements: 5, score: 85 },
      testimonials: { improvements: 2, score: 92 }
    },
    byType: {
      headlines: 4,
      descriptions: 6,
      ctas: 2
    }
  },
  recommendations: [
    'Consider A/B testing the new headlines',
    'Monitor conversion rates after implementation'
  ]
}

export const mockStatusData = {
  health: {
    status: 'healthy',
    checks: [
      { name: 'openai_connection', status: 'pass' },
      { name: 'file_permissions', status: 'pass' },
      { name: 'config_validation', status: 'pass' }
    ]
  },
  activity: {
    lastRun: '2024-01-15T10:30:00Z',
    totalRuns: 45,
    successRate: 0.96
  },
  stats: {
    totalImprovements: 156,
    averageQualityScore: 86,
    filesProcessed: 23
  }
}