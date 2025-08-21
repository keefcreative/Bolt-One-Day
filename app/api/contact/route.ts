import { NextRequest, NextResponse } from 'next/server'
import { brevoIntegration } from '@/lib/brevo'

// Optional: Uncomment to enable Trello as backup
// import { trelloIntegration, TRELLO_CONFIG } from '@/lib/trello'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.json()
    
    // Validate required fields
    if (!formData.name || !formData.email || !formData.message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Process with Brevo CRM (primary system)
    let success = false
    let emailSent = false
    let welcomeEmailSent = false

    try {
      // Add/update contact in Brevo CRM
      success = await brevoIntegration.createOrUpdateContact({
        name: formData.name,
        email: formData.email,
        company: formData.company,
        message: formData.message,
        service: formData.service,
        source: formData.source || 'Website Contact Form'
      })

      // Send notification email to team
      if (success) {
        emailSent = await brevoIntegration.sendContactNotification({
          name: formData.name,
          email: formData.email,
          company: formData.company,
          message: formData.message,
          service: formData.service,
        })

        // Send welcome email to the contact
        welcomeEmailSent = await brevoIntegration.sendWelcomeEmail(
          formData.email,
          formData.name
        )
      }
    } catch (brevoError) {
      console.error('Brevo processing error:', brevoError)
      return NextResponse.json(
        { error: 'Failed to process your submission. Please try again or contact us directly.' },
        { status: 500 }
      )
    }

    /* Optional: Enable Trello as backup system
    if (!success && process.env.TRELLO_API_KEY) {
      try {
        const listId = formData.listType === 'qualified' 
          ? TRELLO_CONFIG.QUALIFIED_LIST_ID 
          : TRELLO_CONFIG.LEADS_LIST_ID
        
        if (listId) {
          await trelloIntegration.createCard(formData, listId)
        }
      } catch (trelloError) {
        console.error('Trello backup failed:', trelloError)
      }
    }
    */

    if (!success) {
      return NextResponse.json(
        { error: 'Failed to process your submission. Please try again or contact us directly.' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Thank you for your message. We\'ll get back to you soon!',
      contactCreated: success,
      notificationSent: emailSent,
      welcomeSent: welcomeEmailSent
    })

  } catch (error: any) {
    console.error('Error processing contact form:', error)
    return NextResponse.json(
      { error: 'Failed to process contact form. Please try again.' },
      { status: 500 }
    )
  }
}