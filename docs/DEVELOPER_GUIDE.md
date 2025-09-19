# Content Improvement System Developer Guide

## Table of Contents

- [Development Environment Setup](#development-environment-setup)
- [Architecture Deep Dive](#architecture-deep-dive)
- [TypeScript Integration](#typescript-integration)
- [Testing Framework](#testing-framework)
- [Contributing Guidelines](#contributing-guidelines)
- [Debugging and Troubleshooting](#debugging-and-troubleshooting)
- [Performance Optimization](#performance-optimization)
- [Security Considerations](#security-considerations)
- [Extending the System](#extending-the-system)

## Development Environment Setup

### Prerequisites

- Node.js 18+ (LTS recommended)
- npm 8+ or yarn 3+
- Git 2.30+
- OpenAI API key
- Code editor with TypeScript support

### Initial Setup

1. **Clone and Install**
```bash
# Clone the repository
git clone <repository-url>
cd Bolt-One-Day

# Install main project dependencies
npm install

# Install content-improver dependencies
cd content-improver
npm install
cd ..
```

2. **Environment Configuration**
```bash
# Create environment files
cp .env.example .env.local
cp content-improver/.env.example content-improver/.env

# Configure API keys in .env.local
OPENAI_API_KEY=your_openai_api_key_here
CONTENT_SYSTEM_ENABLED=true
```

3. **Verify Installation**
```bash
# Test the main application
npm run dev

# Test the content system
cd content-improver
npm test
npm run status
```

### Development Scripts

**Main Application:**
```bash
npm run dev          # Start development server
npm run build        # Build production version
npm run test         # Run all tests
npm run lint         # Run ESLint
npm run type-check   # TypeScript compilation check
```

**Content-Improver System:**
```bash
npm run content      # Interactive CLI dashboard
npm run workflow     # Full automated workflow
npm run status       # Current system status
npm run test         # System health check
npm run clean        # Clean generated files
```

## Architecture Deep Dive

### Core Components

#### 1. Integration Layer (`/lib/content-integration.ts`)

The bridge between Next.js and content-improver system:

```typescript
import { ContentIntegration } from '@/lib/content-integration';

const integration = new ContentIntegration();

// Key methods:
await integration.analyzeContent();
await integration.improveContent();
await integration.applyImprovements(['id1', 'id2']);
```

**Key responsibilities:**
- System availability checking
- Command execution and process management
- File system operations with safety checks
- Error handling and status reporting

#### 2. Configuration Management (`/lib/shared-config.ts`)

Centralized configuration sharing:

```typescript
import { sharedConfig, initializeSharedConfig } from '@/lib/shared-config';

// Initialize configuration
await initializeSharedConfig();

// Access configuration
const apiKey = sharedConfig.openai.apiKey;
const dataPath = sharedConfig.paths.data;
```

**Features:**
- Environment variable management
- Path resolution
- Cross-system configuration sync
- Validation and error reporting

#### 3. Content-Improver Core (`/content-improver/src/`)

**Workflow Manager** (`src/core/workflow_manager.js`):
- Orchestrates the entire improvement process
- Manages stage transitions
- Handles parallel processing
- Generates review dashboards

**Assistant Processor** (`src/core/assistant_section_processor.js`):
- AI-powered content improvement
- Brand voice consistency
- Context-aware suggestions
- Confidence scoring

**Status Tracker** (`src/core/status_tracker.js`):
- Workflow progress monitoring
- File status management
- Next action recommendations
- Performance metrics

### Data Flow Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Request Flow                              │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Next.js API ──► Integration Layer ──► Content-Improver     │
│       │                   │                    │            │
│       │                   │                    ▼            │
│       │                   │            Workflow Manager     │
│       │                   │                    │            │
│       │                   │                    ▼            │
│       │                   │            AI Processing        │
│       │                   │                    │            │
│       │                   │                    ▼            │
│       │                   │            Status Tracking      │
│       │                   │                    │            │
│       │                   ▲                    ▼            │
│       ▲                   └────────────────────┘            │
│       │                                                     │
│       └─────────────── Response Flow ──────────────────────┘
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### File System Structure

```
/
├── app/
│   └── api/
│       └── content/              # API endpoints
│           ├── analyze/
│           ├── improve/
│           ├── apply/
│           ├── status/
│           └── webhook/
├── lib/
│   ├── content-integration.ts    # Integration layer
│   └── shared-config.ts          # Configuration management
├── types/
│   └── content.ts               # TypeScript definitions
├── data/                        # Content JSON files
├── content-improver/
│   ├── src/
│   │   ├── core/               # Core workflow components
│   │   ├── analyzers/          # Content analysis tools
│   │   ├── validators/         # Brand voice validation
│   │   └── cli/               # Command-line interface
│   ├── improvements/           # Generated improvements
│   ├── reports/               # Analysis reports
│   └── __tests__/             # Test suites
└── docs/                      # Documentation
```

## TypeScript Integration

### Type Definitions

The system provides comprehensive TypeScript types in `/types/content.ts`:

```typescript
// Core content types
export interface ContentImprovement {
  id: string;
  type: 'text-replacement' | 'structure-change' | 'addition' | 'removal' | 'rewrite';
  field: string;
  original: string;
  improved: string;
  reason: string;
  confidence: number;
  impact: 'low' | 'medium' | 'high';
  status: 'pending' | 'approved' | 'rejected' | 'applied';
  metadata: {
    model: string;
    timestamp: string;
    reviewer?: string;
    reviewNote?: string;
  };
}

// Workflow status
export interface ContentWorkflowStatus {
  currentStage: 'idle' | 'analyzing' | 'improving' | 'reviewing' | 'implementing';
  progress: {
    current: number;
    total: number;
    percentage: number;
  };
  files: {
    pending: number;
    analyzed: number;
    improved: number;
    reviewed: number;
    applied: number;
  };
  quality: {
    averageScore: number;
    trend: 'improving' | 'stable' | 'declining';
  };
  errors: string[];
  lastRun: string | null;
  nextRecommendedAction: string;
  estimatedCompletion?: string;
}
```

### Type-Safe API Usage

```typescript
import type { 
  ContentAnalysisResult, 
  ContentImprovement, 
  ContentWorkflowStatus 
} from '@/types/content';

// Type-safe API calls
const analyzeContent = async (): Promise<ContentAnalysisResult[]> => {
  const response = await fetch('/api/content/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  });
  
  const data = await response.json();
  
  if (!data.success) {
    throw new Error(data.message);
  }
  
  return data.results; // Properly typed
};
```

### Custom Type Guards

```typescript
// Type guards for runtime validation
export const isContentImprovement = (obj: any): obj is ContentImprovement => {
  return obj && 
    typeof obj.id === 'string' &&
    typeof obj.type === 'string' &&
    typeof obj.field === 'string' &&
    typeof obj.original === 'string' &&
    typeof obj.improved === 'string' &&
    typeof obj.reason === 'string' &&
    typeof obj.confidence === 'number';
};

// Usage
const improvements = await getPendingImprovements();
const validImprovements = improvements.filter(isContentImprovement);
```

## Testing Framework

### Test Structure

```
__tests__/
├── api/
│   └── content/
│       ├── analyze.integration.test.ts
│       └── improve.integration.test.ts
├── lib/
│   ├── content-integration.unit.test.ts
│   └── shared-config.unit.test.ts
├── workflows/
│   └── content-improvement.e2e.test.ts
└── mocks/
    └── openai.ts
```

### Unit Testing

```typescript
// Example unit test for content integration
import { ContentIntegration } from '@/lib/content-integration';
import { jest } from '@jest/globals';

describe('ContentIntegration', () => {
  let integration: ContentIntegration;
  
  beforeEach(() => {
    integration = new ContentIntegration();
  });
  
  test('should check system availability', async () => {
    const isAvailable = await integration.isContentSystemAvailable();
    expect(typeof isAvailable).toBe('boolean');
  });
  
  test('should handle missing system gracefully', async () => {
    // Mock file system to simulate missing content-improver
    jest.spyOn(fs, 'access').mockRejectedValue(new Error('ENOENT'));
    
    const isAvailable = await integration.isContentSystemAvailable();
    expect(isAvailable).toBe(false);
  });
});
```

### Integration Testing

```typescript
// API endpoint integration test
import { POST } from '@/app/api/content/analyze/route';
import { NextRequest } from 'next/server';

describe('/api/content/analyze', () => {
  test('should analyze content successfully', async () => {
    const request = new NextRequest('http://localhost/api/content/analyze', {
      method: 'POST',
      body: JSON.stringify({ files: ['hero.json'] })
    });
    
    const response = await POST(request);
    const data = await response.json();
    
    expect(data.success).toBe(true);
    expect(data.results).toBeDefined();
  });
});
```

### End-to-End Testing

```typescript
// Full workflow E2E test
describe('Content Improvement Workflow', () => {
  test('should complete full workflow', async () => {
    // 1. Trigger analysis
    const analyzeResponse = await fetch('/api/content/analyze', {
      method: 'POST'
    });
    expect(analyzeResponse.ok).toBe(true);
    
    // 2. Generate improvements
    const improveResponse = await fetch('/api/content/improve', {
      method: 'POST'
    });
    expect(improveResponse.ok).toBe(true);
    
    // 3. Get pending improvements
    const pendingResponse = await fetch('/api/content/improve');
    const pendingData = await pendingResponse.json();
    expect(pendingData.count).toBeGreaterThan(0);
    
    // 4. Apply improvements (mock approval)
    const applyResponse = await fetch('/api/content/apply', {
      method: 'POST',
      body: JSON.stringify({
        improvementIds: [pendingData.improvements[0].id]
      })
    });
    expect(applyResponse.ok).toBe(true);
  });
});
```

### Mocking External Services

```typescript
// OpenAI API mock
export const mockOpenAI = {
  chat: {
    completions: {
      create: jest.fn().mockResolvedValue({
        choices: [{
          message: {
            content: JSON.stringify({
              improvements: [
                {
                  field: 'hero.title',
                  original: 'Original text',
                  improved: 'Improved text',
                  reason: 'Test improvement'
                }
              ]
            })
          }
        }]
      })
    }
  }
};
```

## Contributing Guidelines

### Code Style

**TypeScript Standards:**
- Use strict TypeScript configuration
- Prefer interfaces over types for object shapes
- Use proper type annotations for function parameters and return types
- Avoid `any` - use proper typing or `unknown`

**File Naming:**
- `kebab-case` for files and directories
- `PascalCase` for React components and classes
- `camelCase` for functions and variables
- `.test.ts` suffix for test files

**Import Organization:**
```typescript
// 1. Node modules
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';

// 2. Internal modules (absolute imports)
import { ContentIntegration } from '@/lib/content-integration';
import type { ContentImprovement } from '@/types/content';

// 3. Relative imports
import './styles.css';
```

### Git Workflow

**Branch Naming:**
- `feature/description` - New features
- `fix/description` - Bug fixes
- `docs/description` - Documentation updates
- `refactor/description` - Code refactoring

**Commit Messages:**
```
type(scope): description

feat(api): add content analysis endpoint
fix(integration): handle missing content-improver system
docs(readme): update installation instructions
refactor(types): consolidate content interfaces
```

**Pull Request Process:**
1. Create feature branch from `main`
2. Implement changes with tests
3. Update documentation if needed
4. Run full test suite: `npm test`
5. Create PR with detailed description
6. Address review feedback
7. Merge after approval

### Code Review Checklist

**Functionality:**
- [ ] Code works as intended
- [ ] Edge cases are handled
- [ ] Error handling is appropriate
- [ ] Performance is acceptable

**Code Quality:**
- [ ] TypeScript types are properly defined
- [ ] Code follows established patterns
- [ ] Functions are properly documented
- [ ] No unused imports or variables

**Testing:**
- [ ] Unit tests cover new functionality
- [ ] Integration tests pass
- [ ] Manual testing performed
- [ ] No regression in existing features

**Documentation:**
- [ ] README updated if needed
- [ ] API documentation updated
- [ ] Code comments where necessary
- [ ] Type definitions documented

## Debugging and Troubleshooting

### Debug Mode

Enable comprehensive debugging:

```bash
# Environment variable
DEBUG=content-*,next:* npm run dev

# Or in code
import debug from 'debug';
const log = debug('content-improver:workflow');
log('Starting analysis phase...');
```

### Common Issues and Solutions

**1. System Not Available**
```bash
# Check if content-improver is installed
ls -la content-improver/

# Verify package.json exists
cat content-improver/package.json

# Reinstall if necessary
cd content-improver && npm install
```

**2. API Key Issues**
```typescript
// Check configuration
import { sharedConfig, configUtils } from '@/lib/shared-config';

const validation = configUtils.validate();
if (!validation.valid) {
  console.error('Configuration issues:', validation.errors);
}
```

**3. File Permission Issues**
```bash
# Check data directory permissions
ls -la data/

# Fix permissions if needed
chmod -R 755 data/
chmod -R 755 content-improver/
```

**4. Memory Issues**
```bash
# Increase Node.js memory limit
NODE_OPTIONS="--max-old-space-size=4096" npm run workflow

# Or in package.json scripts
"workflow": "node --max-old-space-size=4096 src/core/workflow_manager.js"
```

### Logging and Monitoring

**Structured Logging:**
```typescript
import { createLogger, format, transports } from 'winston';

const logger = createLogger({
  level: sharedConfig.content.logLevel,
  format: format.combine(
    format.timestamp(),
    format.errors({ stack: true }),
    format.json()
  ),
  transports: [
    new transports.File({ filename: 'logs/error.log', level: 'error' }),
    new transports.File({ filename: 'logs/combined.log' })
  ]
});
```

**Performance Monitoring:**
```typescript
// Simple performance tracking
const startTime = performance.now();

await processContent();

const duration = performance.now() - startTime;
logger.info(`Content processing completed in ${duration}ms`);
```

## Performance Optimization

### Content Processing

**Parallel Processing:**
```javascript
// Process multiple sections in parallel
const processSections = async (sections) => {
  const chunkSize = 3; // Process 3 sections at a time
  const chunks = [];
  
  for (let i = 0; i < sections.length; i += chunkSize) {
    chunks.push(sections.slice(i, i + chunkSize));
  }
  
  for (const chunk of chunks) {
    await Promise.all(chunk.map(section => processSection(section)));
    await delay(1000); // Rate limiting between chunks
  }
};
```

**Caching Strategy:**
```typescript
// In-memory cache for analysis results
const analysisCache = new Map<string, ContentAnalysisResult>();

const getCachedAnalysis = (filePath: string, lastModified: number) => {
  const key = `${filePath}:${lastModified}`;
  return analysisCache.get(key);
};

const setCachedAnalysis = (filePath: string, lastModified: number, result: ContentAnalysisResult) => {
  const key = `${filePath}:${lastModified}`;
  analysisCache.set(key, result);
  
  // Clean up old entries
  if (analysisCache.size > 100) {
    const firstKey = analysisCache.keys().next().value;
    analysisCache.delete(firstKey);
  }
};
```

### API Rate Limiting

```typescript
// Rate limiter for OpenAI API
class RateLimiter {
  private queue: Array<() => Promise<any>> = [];
  private processing = false;
  private readonly delay: number;
  
  constructor(requestsPerMinute: number) {
    this.delay = (60 * 1000) / requestsPerMinute;
  }
  
  async execute<T>(fn: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push(async () => {
        try {
          const result = await fn();
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });
      
      this.processQueue();
    });
  }
  
  private async processQueue() {
    if (this.processing || this.queue.length === 0) return;
    
    this.processing = true;
    
    while (this.queue.length > 0) {
      const fn = this.queue.shift()!;
      await fn();
      
      if (this.queue.length > 0) {
        await new Promise(resolve => setTimeout(resolve, this.delay));
      }
    }
    
    this.processing = false;
  }
}
```

### Memory Management

```typescript
// Streaming JSON processing for large files
import { Transform } from 'stream';
import { pipeline } from 'stream/promises';

const processLargeContentFile = async (filePath: string) => {
  const transformStream = new Transform({
    objectMode: true,
    transform(chunk, encoding, callback) {
      // Process chunk by chunk instead of loading entire file
      const processed = processContentChunk(chunk);
      callback(null, processed);
    }
  });
  
  await pipeline(
    fs.createReadStream(filePath),
    transformStream,
    fs.createWriteStream(outputPath)
  );
};
```

## Security Considerations

### API Key Protection

**Environment Variables:**
```bash
# .env.local (never commit)
OPENAI_API_KEY=sk-...
FREEPIK_API_KEY=...

# Validate in code
if (!process.env.OPENAI_API_KEY) {
  throw new Error('OPENAI_API_KEY is required');
}
```

**Runtime Validation:**
```typescript
// Sanitize API responses
const sanitizeImprovement = (improvement: any): ContentImprovement => {
  return {
    id: String(improvement.id || '').replace(/[^a-zA-Z0-9_-]/g, ''),
    type: ['text-replacement', 'structure-change', 'addition', 'removal', 'rewrite']
           .includes(improvement.type) ? improvement.type : 'text-replacement',
    field: String(improvement.field || '').replace(/[^a-zA-Z0-9._-]/g, ''),
    original: String(improvement.original || ''),
    improved: String(improvement.improved || ''),
    // ... other fields with validation
  };
};
```

### File System Security

**Path Validation:**
```typescript
import path from 'path';

const validateFilePath = (filePath: string): boolean => {
  // Resolve path and check it's within allowed directories
  const resolved = path.resolve(filePath);
  const dataDir = path.resolve('./data');
  
  return resolved.startsWith(dataDir) && !resolved.includes('..');
};

// Usage in API endpoints
if (!validateFilePath(requestedFile)) {
  return NextResponse.json({ error: 'Invalid file path' }, { status: 400 });
}
```

**Content Validation:**
```typescript
// Validate JSON content before saving
const validateContentStructure = (content: any, schema: any): boolean => {
  // Use Zod or similar for runtime validation
  try {
    schema.parse(content);
    return true;
  } catch (error) {
    console.error('Content validation failed:', error);
    return false;
  }
};
```

### Input Sanitization

```typescript
// Sanitize user inputs
import DOMPurify from 'isomorphic-dompurify';

const sanitizeUserInput = (input: string): string => {
  return DOMPurify.sanitize(input, { 
    ALLOWED_TAGS: [],  // No HTML tags
    ALLOWED_ATTR: []   // No attributes
  });
};
```

## Extending the System

### Adding New Content Types

1. **Update Type Definitions:**
```typescript
// types/content.ts
export interface BlogPostContent extends BaseContent {
  author: string;
  publishDate: string;
  tags: string[];
  excerpt: string;
  content: string;
}

export interface BlogPostData {
  blogPost: BlogPostContent;
}
```

2. **Create Validation Schema:**
```typescript
// lib/validators/blog-post.ts
import { z } from 'zod';

export const blogPostSchema = z.object({
  blogPost: z.object({
    title: z.string().min(10).max(100),
    author: z.string().min(2),
    publishDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    tags: z.array(z.string()).min(1).max(10),
    excerpt: z.string().min(50).max(200),
    content: z.string().min(100)
  })
});
```

3. **Add to Content Integration:**
```typescript
// lib/content-integration.ts
const SUPPORTED_CONTENT_TYPES = [
  'hero', 'services', 'pricing', 'team', 
  'testimonials', 'portfolio', 'faq', 
  'contact', 'blog-post'  // Add new type
];
```

### Custom Improvement Processors

```typescript
// content-improver/src/processors/blog-post-processor.js
export class BlogPostProcessor {
  constructor(config) {
    this.config = config;
  }
  
  async processContent(content) {
    return {
      improvements: [
        {
          field: 'blogPost.title',
          type: 'seo-optimization',
          original: content.blogPost.title,
          improved: await this.optimizeTitle(content.blogPost.title),
          reason: 'SEO optimization for better search visibility'
        }
      ]
    };
  }
  
  async optimizeTitle(title) {
    // Custom SEO optimization logic
    return title;
  }
}
```

### Custom Validators

```typescript
// content-improver/src/validators/seo-validator.js
export class SEOValidator {
  validate(content, type) {
    const issues = [];
    
    // Check meta descriptions
    if (type === 'blog-post' && !content.metaDescription) {
      issues.push({
        type: 'seo',
        severity: 'high',
        message: 'Missing meta description',
        suggestion: 'Add a meta description between 150-160 characters'
      });
    }
    
    return issues;
  }
}
```

### Webhook Integration

```typescript
// app/api/content/webhook/route.ts
export async function POST(request: NextRequest) {
  const body = await request.json();
  
  // Handle different webhook sources
  switch (body.source) {
    case 'github':
      await handleGitHubWebhook(body);
      break;
    case 'cms':
      await handleCMSWebhook(body);
      break;
    default:
      return NextResponse.json({ error: 'Unknown webhook source' }, { status: 400 });
  }
  
  return NextResponse.json({ success: true });
}

const handleGitHubWebhook = async (data) => {
  if (data.event === 'push' && data.branch === 'main') {
    // Trigger content analysis on main branch updates
    await contentIntegration.analyzeContent();
  }
};
```

This developer guide provides comprehensive information for developers working with the Content Improvement System. For specific implementation questions, refer to the code comments and existing examples in the codebase.