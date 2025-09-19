# Content Improvement System API Reference

## Overview

The Content Improvement System provides RESTful API endpoints integrated into the main Next.js application. These endpoints allow for programmatic interaction with the content analysis, improvement, and deployment workflows.

## Base URL

All API endpoints are prefixed with `/api/content/` when running the Next.js application.

## Authentication

Currently, the API endpoints are designed for internal use within the Next.js application. External authentication may be added in future versions.

## Error Handling

All endpoints return consistent error responses:

```json
{
  "error": "Error type description",
  "message": "Detailed error message",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

HTTP Status Codes:
- `200` - Success
- `400` - Bad Request (invalid parameters)
- `500` - Internal Server Error
- `503` - Service Unavailable (content-improver system not available)

## Endpoints

### Content Analysis

#### POST /api/content/analyze

Triggers content analysis for all data files using the content-improver system.

**Request Body:**
```json
{
  "files": ["hero.json", "services.json"],  // Optional: specific files to analyze
  "force": false                            // Optional: force re-analysis of already analyzed files
}
```

**Response:**
```json
{
  "success": true,
  "message": "Content analysis completed",
  "results": [
    {
      "file": "hero.json",
      "section": "hero",
      "status": "analyzed",
      "quality": {
        "score": 85,
        "breakdown": {
          "grammar": 90,
          "clarity": 85,
          "tone": 80,
          "seo": 85,
          "brandVoice": 88
        }
      },
      "issues": [
        {
          "id": "hero_001",
          "type": "tone",
          "severity": "medium",
          "message": "Consider using more active voice",
          "suggestion": "Replace 'was built' with 'we built'",
          "location": {
            "field": "hero.description",
            "line": 1,
            "character": 45
          },
          "autoFixable": true
        }
      ],
      "improvements": [],
      "lastAnalyzed": "2024-01-15T10:30:00.000Z"
    }
  ],
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

#### GET /api/content/analyze

Gets the current content analysis status.

**Response:**
```json
{
  "success": true,
  "status": {
    "currentStage": "analyzed",
    "progress": {
      "current": 5,
      "total": 8,
      "percentage": 62.5
    },
    "files": {
      "pending": 0,
      "analyzed": 5,
      "improved": 3,
      "reviewed": 2,
      "applied": 1
    },
    "quality": {
      "averageScore": 82.4,
      "trend": "improving"
    },
    "errors": [],
    "lastRun": "2024-01-15T10:30:00.000Z",
    "nextRecommendedAction": "Review pending improvements",
    "estimatedCompletion": "2024-01-15T11:00:00.000Z"
  },
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### Content Improvement

#### POST /api/content/improve

Triggers AI-powered content improvements using the content-improver system.

**Request Body:**
```json
{
  "sections": ["hero", "services"],  // Optional: specific sections to improve
  "mode": "assistant"                // Optional: improvement mode (default: "assistant")
}
```

**Response:**
```json
{
  "success": true,
  "message": "Content improvement completed",
  "improvementsCount": 12,
  "improvements": [
    {
      "id": "hero_improve_001",
      "type": "text-replacement",
      "field": "hero.title",
      "original": "We Build Amazing Websites",
      "improved": "We Create Exceptional Digital Experiences",
      "reason": "More specific and engaging language that better reflects the premium service offering",
      "confidence": 0.87,
      "impact": "medium",
      "status": "pending",
      "metadata": {
        "model": "gpt-4",
        "timestamp": "2024-01-15T10:35:00.000Z",
        "reviewer": null,
        "reviewNote": null
      }
    }
  ],
  "timestamp": "2024-01-15T10:35:00.000Z"
}
```

#### GET /api/content/improve

Gets pending content improvements awaiting review.

**Response:**
```json
{
  "success": true,
  "improvements": [
    {
      "id": "services_improve_002",
      "type": "structure-change",
      "field": "services.items[0].description",
      "original": "Our design process is thorough and comprehensive.",
      "improved": "Our design process delivers results through five proven stages: discovery, strategy, design, development, and optimization.",
      "reason": "More specific and actionable description that provides clear value proposition",
      "confidence": 0.92,
      "impact": "high",
      "status": "pending",
      "metadata": {
        "model": "gpt-4",
        "timestamp": "2024-01-15T10:35:00.000Z"
      }
    }
  ],
  "count": 8,
  "timestamp": "2024-01-15T10:40:00.000Z"
}
```

### Content Application

#### POST /api/content/apply

Applies approved content improvements to the actual data files.

**Request Body:**
```json
{
  "improvementIds": ["hero_improve_001", "services_improve_002"],  // Optional: specific improvements to apply
  "force": false,                                                  // Optional: force application without approval
  "createBackup": true                                            // Optional: create backup before applying
}
```

**Response:**
```json
{
  "success": true,
  "message": "Successfully applied 2 improvements",
  "applied": 2,
  "remaining": 6,
  "backupCreated": true,
  "timestamp": "2024-01-15T10:45:00.000Z"
}
```

#### GET /api/content/apply

Gets the history of applied content improvements.

**Response:**
```json
{
  "success": true,
  "history": [
    {
      "id": "application_001",
      "timestamp": "2024-01-15T10:45:00.000Z",
      "improvementsApplied": 2,
      "files": ["hero.json", "services.json"],
      "backupPath": "backups/2024-01-15_10-45-00",
      "appliedBy": "system",
      "status": "completed"
    }
  ],
  "timestamp": "2024-01-15T10:50:00.000Z"
}
```

#### DELETE /api/content/apply

Rollback previously applied improvements (when implemented).

**Request Body:**
```json
{
  "backupId": "application_001"  // ID of the backup to restore
}
```

**Response:**
```json
{
  "success": true,
  "message": "Rollback functionality not yet implemented",
  "timestamp": "2024-01-15T10:50:00.000Z"
}
```

### Status Monitoring

#### GET /api/content/status

Gets comprehensive system status including health, workflow progress, and quality metrics.

**Response:**
```json
{
  "success": true,
  "health": {
    "healthy": true,
    "message": "System healthy. Current stage: reviewing"
  },
  "workflow": {
    "currentStage": "reviewing",
    "progress": {
      "current": 6,
      "total": 8,
      "percentage": 75
    },
    "files": {
      "pending": 0,
      "analyzed": 8,
      "improved": 6,
      "reviewed": 4,
      "applied": 2
    },
    "quality": {
      "averageScore": 84.2,
      "trend": "improving"
    },
    "errors": [],
    "lastRun": "2024-01-15T10:30:00.000Z",
    "nextRecommendedAction": "Review pending improvements"
  },
  "quality": {
    "score": 84.2,
    "issues": [
      {
        "id": "pricing_001",
        "type": "seo",
        "severity": "low",
        "message": "Consider adding more descriptive meta content"
      }
    ]
  },
  "config": {
    "hasOpenAIKey": true,
    "contentImproverInstalled": true,
    "dataPath": "/data",
    "lastConfigUpdate": "2024-01-15T09:00:00.000Z"
  },
  "files": {
    "total": 8,
    "lastModified": 1705315800000
  },
  "timestamp": "2024-01-15T10:50:00.000Z"
}
```

#### POST /api/content/status

Triggers status actions like reset or refresh.

**Request Body:**
```json
{
  "action": "refresh"  // "refresh" or "reset"
}
```

**Response (for refresh):**
```json
{
  "success": true,
  "message": "Status refreshed",
  "health": {
    "healthy": true,
    "message": "System healthy. Current stage: idle"
  },
  "workflow": {
    "currentStage": "idle",
    "progress": {
      "current": 0,
      "total": 8,
      "percentage": 0
    }
  },
  "timestamp": "2024-01-15T10:55:00.000Z"
}
```

**Response (for reset):**
```json
{
  "success": true,
  "message": "Workflow status reset requested",
  "timestamp": "2024-01-15T10:55:00.000Z"
}
```

### Webhook Integration

#### POST /api/content/webhook

Webhook endpoint for external integrations and automated triggers.

**Request Body:**
```json
{
  "source": "github",
  "event": "push",
  "data": {
    "repository": "bolt-one-day",
    "branch": "main",
    "files": ["data/hero.json", "data/services.json"]
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Webhook processed successfully",
  "action": "content_analysis_triggered",
  "timestamp": "2024-01-15T11:00:00.000Z"
}
```

## TypeScript Types

The system provides comprehensive TypeScript types for all API responses:

```typescript
import type { 
  ContentAnalysisResult, 
  ContentImprovement, 
  ContentWorkflowStatus,
  ContentIssue
} from '@/types/content';
```

## Usage Examples

### JavaScript/Fetch

```javascript
// Trigger content analysis
const analyzeContent = async () => {
  const response = await fetch('/api/content/analyze', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      files: ['hero.json', 'services.json'],
      force: false
    })
  });
  
  const result = await response.json();
  if (result.success) {
    console.log('Analysis completed:', result.results);
  }
};

// Get pending improvements
const getPendingImprovements = async () => {
  const response = await fetch('/api/content/improve');
  const result = await response.json();
  
  if (result.success) {
    console.log(`Found ${result.count} pending improvements`);
    return result.improvements;
  }
};

// Apply specific improvements
const applyImprovements = async (improvementIds) => {
  const response = await fetch('/api/content/apply', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      improvementIds,
      createBackup: true
    })
  });
  
  const result = await response.json();
  if (result.success) {
    console.log(`Applied ${result.applied} improvements`);
  }
};
```

### React Hook Example

```typescript
import { useState, useEffect } from 'react';

const useContentStatus = () => {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await fetch('/api/content/status');
        const result = await response.json();
        setStatus(result);
      } catch (error) {
        console.error('Failed to fetch status:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchStatus();
  }, []);
  
  return { status, loading };
};
```

## Rate Limiting

The system implements intelligent rate limiting to prevent overwhelming the AI services:

- Analysis requests: Maximum 1 per minute per section
- Improvement requests: Maximum 10 per hour
- Status requests: No limit
- Apply requests: Maximum 5 per hour

## Error Codes

| Code | Description | Action |
|------|-------------|---------|
| SYSTEM_NOT_AVAILABLE | Content-improver system not found | Check installation |
| INVALID_REQUEST | Invalid request parameters | Review request body |
| ANALYSIS_FAILED | Content analysis failed | Check file permissions |
| IMPROVEMENT_FAILED | AI improvement generation failed | Verify API keys |
| APPLICATION_FAILED | Failed to apply improvements | Check file system access |
| RATE_LIMIT_EXCEEDED | Too many requests | Wait and retry |

## Monitoring and Debugging

### Debug Mode

Enable detailed API logging by setting the environment variable:

```bash
DEBUG=content-api:* npm run dev
```

### Health Check Endpoint

A dedicated health check is available via the status endpoint:

```javascript
const healthCheck = async () => {
  const response = await fetch('/api/content/status');
  const result = await response.json();
  
  if (result.health.healthy) {
    console.log('System is healthy');
  } else {
    console.error('System issues:', result.health.message);
  }
};
```

## Future Enhancements

Planned API improvements:

1. **Authentication**: JWT-based authentication for external access
2. **Webhooks**: More comprehensive webhook system for CI/CD integration
3. **Batch Operations**: Bulk processing endpoints for large-scale content updates
4. **Real-time Updates**: WebSocket integration for live status updates
5. **Analytics**: Detailed analytics and reporting endpoints
6. **Custom Validators**: API for registering custom content validation rules

## Support

For API issues or questions:

1. Check the [Developer Guide](DEVELOPER_GUIDE.md) for detailed implementation notes
2. Review the [Configuration Guide](CONFIGURATION.md) for setup issues
3. Enable debug mode for detailed logging
4. Consult the system status endpoint for health information