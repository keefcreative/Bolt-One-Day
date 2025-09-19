/**
 * Content Status API Endpoint
 * 
 * Provides status information about the content improvement workflow
 */

import { NextRequest, NextResponse } from 'next/server';
import { contentIntegration, contentOperations } from '@/lib/content-integration';
import { initializeSharedConfig, configUtils } from '@/lib/shared-config';

export async function GET(request: NextRequest) {
  try {
    // Initialize configuration
    await initializeSharedConfig();

    // Get system health status
    const health = await contentOperations.healthCheck();
    
    // Get workflow status if system is healthy
    let workflowStatus = null;
    let qualityStatus = null;
    
    if (health.healthy) {
      try {
        workflowStatus = await contentIntegration.getWorkflowStatus();
        qualityStatus = await contentOperations.quickQualityCheck();
      } catch (error) {
        console.warn('Failed to get detailed status:', error);
      }
    }

    // Get configuration summary
    const configSummary = configUtils.getSummary();

    // Get content files overview
    const contentFiles = await contentIntegration.getContentFiles();
    
    return NextResponse.json({
      success: true,
      health,
      workflow: workflowStatus,
      quality: qualityStatus,
      config: configSummary,
      files: {
        total: contentFiles.length,
        lastModified: contentFiles.length > 0 
          ? Math.max(...contentFiles.map(f => f.lastModified.getTime()))
          : null
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Failed to get content status:', error);
    
    return NextResponse.json({
      error: 'Failed to get content status',
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const { action } = body;

    switch (action) {
      case 'reset':
        // This would trigger a reset of the workflow status
        // Implementation would depend on content-improver system capabilities
        return NextResponse.json({
          success: true,
          message: 'Workflow status reset requested',
          timestamp: new Date().toISOString()
        });

      case 'refresh':
        // Force refresh of status
        await initializeSharedConfig();
        const health = await contentOperations.healthCheck();
        const workflowStatus = await contentIntegration.getWorkflowStatus();
        
        return NextResponse.json({
          success: true,
          message: 'Status refreshed',
          health,
          workflow: workflowStatus,
          timestamp: new Date().toISOString()
        });

      default:
        return NextResponse.json({
          error: 'Invalid action',
          validActions: ['reset', 'refresh']
        }, { status: 400 });
    }

  } catch (error) {
    console.error('Content status action error:', error);
    
    return NextResponse.json({
      error: 'Status action failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}