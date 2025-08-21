import { NextRequest, NextResponse } from 'next/server'
import { trelloIntegration, TRELLO_CONFIG } from '@/lib/trello'

export async function GET(request: NextRequest) {
  try {
    // Test data
    const testData = {
      name: 'Test User',
      email: 'test@example.com',
      company: 'Test Company',
      message: 'This is a test message to verify Trello integration is working.',
      service: 'Test Service'
    }

    console.log('Testing Trello integration...')
    console.log('Board ID:', TRELLO_CONFIG.BOARD_ID)
    console.log('NEW LEADS List ID:', TRELLO_CONFIG.LEADS_LIST_ID)
    console.log('QUALIFIED LEADS List ID:', TRELLO_CONFIG.QUALIFIED_LIST_ID)

    // Test creating a card in NEW LEADS list
    const newLeadResult = await trelloIntegration.createCard(
      testData,
      TRELLO_CONFIG.LEADS_LIST_ID
    )

    // Test creating a card in QUALIFIED LEADS list
    const qualifiedLeadResult = await trelloIntegration.createCard(
      {
        ...testData,
        name: 'Test Qualified User',
        message: 'This is a test message for qualified leads list.'
      },
      TRELLO_CONFIG.QUALIFIED_LIST_ID
    )

    return NextResponse.json({
      success: true,
      message: 'Trello integration test completed',
      results: {
        newLeadCard: newLeadResult,
        qualifiedLeadCard: qualifiedLeadResult,
        config: {
          boardId: TRELLO_CONFIG.BOARD_ID,
          newLeadsListId: TRELLO_CONFIG.LEADS_LIST_ID,
          qualifiedLeadsListId: TRELLO_CONFIG.QUALIFIED_LIST_ID,
          hasApiKey: !!process.env.TRELLO_API_KEY,
          hasToken: !!process.env.TRELLO_TOKEN
        }
      }
    })

  } catch (error: any) {
    console.error('Trello test error:', error)
    return NextResponse.json({
      success: false,
      error: error.message,
      config: {
        boardId: TRELLO_CONFIG.BOARD_ID,
        newLeadsListId: TRELLO_CONFIG.LEADS_LIST_ID,
        qualifiedLeadsListId: TRELLO_CONFIG.QUALIFIED_LIST_ID,
        hasApiKey: !!process.env.TRELLO_API_KEY,
        hasToken: !!process.env.TRELLO_TOKEN
      }
    }, { status: 500 })
  }
}