/**
 * Content Improvement API Endpoint
 * 
 * Triggers AI-powered content improvements using the content-improver system
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
    const { sections, mode = 'assistant' } = body;

    // Start content improvement process
    const success = await contentIntegration.improveContent();

    if (success) {
      // Get the pending improvements that were created
      const pendingImprovements = await contentIntegration.getPendingImprovements();

      return NextResponse.json({
        success: true,
        message: 'Content improvement completed',
        improvementsCount: pendingImprovements.length,
        improvements: pendingImprovements,
        timestamp: new Date().toISOString()
      });
    } else {
      return NextResponse.json({
        error: 'Content improvement failed'
      }, { status: 500 });
    }

  } catch (error) {
    console.error('Content improvement error:', error);
    
    return NextResponse.json({
      error: 'Content improvement failed',
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    // Get pending improvements
    const pendingImprovements = await contentIntegration.getPendingImprovements();
    
    return NextResponse.json({
      success: true,
      improvements: pendingImprovements,
      count: pendingImprovements.length,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Failed to get pending improvements:', error);
    
    return NextResponse.json({
      error: 'Failed to get pending improvements',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}