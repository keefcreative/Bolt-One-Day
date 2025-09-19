/**
 * Content Analysis API Endpoint
 * 
 * Triggers content analysis for all data files using the content-improver system
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
    const { files, force = false } = body;

    // Start content analysis
    const results = await contentIntegration.analyzeContent();

    return NextResponse.json({
      success: true,
      message: 'Content analysis completed',
      results,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Content analysis error:', error);
    
    return NextResponse.json({
      error: 'Content analysis failed',
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    // Get current analysis status
    const status = await contentIntegration.getWorkflowStatus();
    
    return NextResponse.json({
      success: true,
      status,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Failed to get analysis status:', error);
    
    return NextResponse.json({
      error: 'Failed to get analysis status',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}