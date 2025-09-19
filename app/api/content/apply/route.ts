/**
 * Content Apply API Endpoint
 * 
 * Applies approved content improvements to the actual data files
 */

import { NextRequest, NextResponse } from 'next/server';
import { contentIntegration } from '@/lib/content-integration';
import { initializeSharedConfig } from '@/lib/shared-config';

export async function POST(request: NextRequest) {
  try {
    // Initialize configuration
    await initializeSharedConfig();

    // Check if content system is available
    const isAvailable = await contentIntegration.isContentSystemAvailable();
    if (!isAvailable) {
      return NextResponse.json({
        error: 'Content-improver system not found or not properly installed'
      }, { status: 503 });
    }

    // Parse request body for options
    const body = await request.json().catch(() => ({}));
    const { improvementIds, force = false, createBackup = true } = body;

    // Get pending improvements before applying
    const pendingBefore = await contentIntegration.getPendingImprovements();
    
    // Apply improvements
    const success = await contentIntegration.applyImprovements(improvementIds);

    if (success) {
      // Get remaining pending improvements after applying
      const pendingAfter = await contentIntegration.getPendingImprovements();
      const appliedCount = pendingBefore.length - pendingAfter.length;

      return NextResponse.json({
        success: true,
        message: `Successfully applied ${appliedCount} improvements`,
        applied: appliedCount,
        remaining: pendingAfter.length,
        backupCreated: createBackup,
        timestamp: new Date().toISOString()
      });
    } else {
      return NextResponse.json({
        error: 'Failed to apply improvements'
      }, { status: 500 });
    }

  } catch (error) {
    console.error('Content apply error:', error);
    
    return NextResponse.json({
      error: 'Failed to apply improvements',
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    // Get improvement history
    const history = await contentIntegration.getImprovementHistory();
    
    return NextResponse.json({
      success: true,
      history,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Failed to get improvement history:', error);
    
    return NextResponse.json({
      error: 'Failed to get improvement history',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // This would handle rollback functionality
    const body = await request.json().catch(() => ({}));
    const { backupId } = body;

    // Implementation would depend on content-improver system capabilities
    return NextResponse.json({
      success: true,
      message: 'Rollback functionality not yet implemented',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Content rollback error:', error);
    
    return NextResponse.json({
      error: 'Rollback failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}