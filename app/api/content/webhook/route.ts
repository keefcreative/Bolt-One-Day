/**
 * Content Webhook API Endpoint
 * 
 * Handles webhook notifications from the content-improver system
 * for real-time updates and integration with external systems
 */

import { NextRequest, NextResponse } from 'next/server';
import { sharedConfig } from '@/lib/shared-config';

export async function POST(request: NextRequest) {
  try {
    // Verify webhook secret if configured
    if (sharedConfig.integration.webhookSecret) {
      const signature = request.headers.get('x-content-signature');
      if (!signature || !verifyWebhookSignature(signature, await request.text())) {
        return NextResponse.json({
          error: 'Invalid webhook signature'
        }, { status: 401 });
      }
    }

    const body = await request.json();
    const { event, data, timestamp } = body;

    console.log(`📡 Content webhook received: ${event}`, { timestamp });

    // Handle different webhook events
    switch (event) {
      case 'analysis.completed':
        await handleAnalysisCompleted(data);
        break;

      case 'improvement.generated':
        await handleImprovementGenerated(data);
        break;

      case 'improvement.applied':
        await handleImprovementApplied(data);
        break;

      case 'quality.score_updated':
        await handleQualityScoreUpdated(data);
        break;

      case 'workflow.stage_changed':
        await handleWorkflowStageChanged(data);
        break;

      case 'error.occurred':
        await handleErrorOccurred(data);
        break;

      default:
        console.warn(`Unknown webhook event: ${event}`);
    }

    return NextResponse.json({
      success: true,
      message: `Webhook event ${event} processed`,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Webhook processing error:', error);
    
    return NextResponse.json({
      error: 'Webhook processing failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  // Webhook health check endpoint
  return NextResponse.json({
    success: true,
    message: 'Content webhook endpoint is healthy',
    config: {
      secretConfigured: !!sharedConfig.integration.webhookSecret,
      enabled: sharedConfig.integration.enabled
    },
    timestamp: new Date().toISOString()
  });
}

// Webhook event handlers

async function handleAnalysisCompleted(data: any) {
  console.log('✅ Content analysis completed:', data);
  
  // Could trigger notifications, update database, etc.
  if (data.issues && data.issues.length > 0) {
    console.log(`⚠️ Found ${data.issues.length} content issues`);
  }
}

async function handleImprovementGenerated(data: any) {
  console.log('🤖 New content improvement generated:', data);
  
  // Could send notification to review team
  if (data.confidence && data.confidence < 0.8) {
    console.log('⚠️ Low confidence improvement requires review');
  }
}

async function handleImprovementApplied(data: any) {
  console.log('✨ Content improvement applied:', data);
  
  // Could trigger build webhook, invalidate cache, etc.
  // Note: In a real implementation, you might want to trigger a new build
}

async function handleQualityScoreUpdated(data: any) {
  console.log('📊 Content quality score updated:', data);
  
  // Could update analytics, send alerts if score drops, etc.
  if (data.score < sharedConfig.content.qualityThreshold) {
    console.log('⚠️ Content quality below threshold');
  }
}

async function handleWorkflowStageChanged(data: any) {
  console.log('🔄 Workflow stage changed:', data);
  
  // Could update UI state, send notifications, etc.
}

async function handleErrorOccurred(data: any) {
  console.error('❌ Content system error:', data);
  
  // Could send alerts, log to monitoring system, etc.
}

// Utility functions

function verifyWebhookSignature(signature: string, payload: string): boolean {
  // Implement webhook signature verification
  // This is a simplified version - in production you'd use HMAC verification
  const secret = sharedConfig.integration.webhookSecret;
  if (!secret) return false;
  
  // In a real implementation, you would:
  // const crypto = require('crypto');
  // const expectedSignature = crypto
  //   .createHmac('sha256', secret)
  //   .update(payload)
  //   .digest('hex');
  // return signature === `sha256=${expectedSignature}`;
  
  return signature.includes(secret);
}