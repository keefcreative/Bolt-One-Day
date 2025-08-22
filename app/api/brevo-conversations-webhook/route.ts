import { NextRequest, NextResponse } from 'next/server'
import { createBrevoContact } from '@/lib/brevo'

interface BrevoConversationWebhookData {
  eventType: string
  conversationId: string
  messageId?: string
  contact?: {
    email?: string
    firstName?: string
    lastName?: string
    attributes?: Record<string, any>
  }
  message?: {
    text?: string
    type: string
    createdAt: string
  }
  agent?: {
    id: string
    email: string
    name: string
  }
  timestamp: string
}

export async function POST(request: NextRequest) {
  try {
    const webhookData: BrevoConversationWebhookData = await request.json()

    console.log('Brevo Conversations Webhook received:', {
      eventType: webhookData.eventType,
      conversationId: webhookData.conversationId,
      timestamp: webhookData.timestamp
    })

    // Handle different conversation events
    switch (webhookData.eventType) {
      case 'conversation.started':
        await handleConversationStarted(webhookData)
        break
      
      case 'message.received':
        await handleMessageReceived(webhookData)
        break
      
      case 'conversation.resolved':
        await handleConversationResolved(webhookData)
        break
      
      case 'contact.identified':
        await handleContactIdentified(webhookData)
        break
      
      default:
        console.log(`Unhandled conversation event type: ${webhookData.eventType}`)
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Webhook processed successfully',
      eventType: webhookData.eventType
    })

  } catch (error) {
    console.error('Error processing Brevo Conversations webhook:', error)
    return NextResponse.json(
      { 
        error: 'Failed to process webhook',
        details: process.env.NODE_ENV === 'development' ? error : undefined
      },
      { status: 500 }
    )
  }
}

async function handleConversationStarted(data: BrevoConversationWebhookData) {
  console.log('New conversation started:', data.conversationId)
  
  // Track conversation analytics
  // You could integrate with your analytics service here
  
  // If contact information is available, create/update lead
  if (data.contact?.email) {
    await createBrevoContact({
      email: data.contact.email,
      firstName: data.contact.firstName || '',
      lastName: data.contact.lastName || '',
      company: data.contact.attributes?.company || '',
      message: 'Started conversation via chat widget',
      service: 'Chat Inquiry',
      listType: 'chat-conversation'
    })
  }
}

async function handleMessageReceived(data: BrevoConversationWebhookData) {
  console.log('Message received in conversation:', data.conversationId)
  
  // Analyze message content for lead scoring
  if (data.message?.text && data.contact?.email) {
    const messageText = data.message.text.toLowerCase()
    
    // High-value keywords that indicate strong lead potential
    const highValueKeywords = [
      'interested', 'pricing', 'quote', 'budget', 'timeline',
      'project', 'hire', 'work together', 'get started'
    ]
    
    const containsHighValueKeywords = highValueKeywords.some(keyword => 
      messageText.includes(keyword)
    )
    
    if (containsHighValueKeywords) {
      // Update lead with high-value interaction
      await createBrevoContact({
        email: data.contact.email,
        firstName: data.contact.firstName || '',
        lastName: data.contact.lastName || '',
        company: data.contact.attributes?.company || '',
        message: `High-value chat message: ${data.message.text.substring(0, 200)}...`,
        service: 'High-Intent Chat Lead',
        listType: 'high-intent-chat-leads'
      })
    }
  }
}

async function handleConversationResolved(data: BrevoConversationWebhookData) {
  console.log('Conversation resolved:', data.conversationId)
  
  // Update contact with resolved conversation status
  if (data.contact?.email) {
    await createBrevoContact({
      email: data.contact.email,
      firstName: data.contact.firstName || '',
      lastName: data.contact.lastName || '',
      company: data.contact.attributes?.company || '',
      message: 'Conversation completed successfully',
      service: 'Resolved Chat',
      listType: 'resolved-conversations'
    })
  }
}

async function handleContactIdentified(data: BrevoConversationWebhookData) {
  console.log('Contact identified in conversation:', data.conversationId)
  
  // Create/update contact with full information
  if (data.contact?.email) {
    await createBrevoContact({
      email: data.contact.email,
      firstName: data.contact.firstName || '',
      lastName: data.contact.lastName || '',
      company: data.contact.attributes?.company || '',
      message: 'Contact identified during chat conversation',
      service: 'Identified Chat Contact',
      listType: 'identified-chat-contacts'
    })
  }
}

// GET endpoint for webhook verification/health check
export async function GET() {
  return NextResponse.json({
    status: 'Brevo Conversations webhook endpoint is active',
    timestamp: new Date().toISOString(),
    supportedEvents: [
      'conversation.started',
      'message.received', 
      'conversation.resolved',
      'contact.identified'
    ]
  })
}