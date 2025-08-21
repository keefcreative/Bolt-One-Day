import { NextRequest, NextResponse } from 'next/server'
import { brevoIntegration } from '@/lib/brevo'

// Test endpoint for Brevo integration - REMOVE IN PRODUCTION
export async function GET(request: NextRequest) {
  // Only allow in development
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json(
      { error: 'This endpoint is only available in development' },
      { status: 403 }
    )
  }

  const results = {
    apiKeyConfigured: !!process.env.BREVO_API_KEY,
    tests: [] as any[]
  }

  try {
    // Test 1: Create/Update Contact
    const testContact = {
      name: 'Test User',
      email: 'test@example.com',
      company: 'Test Company',
      message: 'This is a test message from the Brevo integration test',
      service: 'Design Subscription'
    }

    const contactResult = await brevoIntegration.createOrUpdateContact(testContact)
    results.tests.push({
      test: 'Create/Update Contact',
      success: contactResult,
      details: contactResult ? 'Contact created/updated successfully' : 'Failed to create/update contact'
    })

    // Test 2: Send Test Email (only if email configured)
    if (process.env.BREVO_SENDER_EMAIL) {
      const emailResult = await brevoIntegration.sendEmail({
        to: 'test@example.com',
        subject: 'Test Email from DesignWorks',
        htmlContent: '<h1>Test Email</h1><p>This is a test email from the Brevo integration.</p>',
        textContent: 'Test Email\n\nThis is a test email from the Brevo integration.'
      })

      results.tests.push({
        test: 'Send Email',
        success: emailResult,
        details: emailResult ? 'Email sent successfully' : 'Failed to send email'
      })
    } else {
      results.tests.push({
        test: 'Send Email',
        success: false,
        details: 'BREVO_SENDER_EMAIL not configured'
      })
    }

    // Test 3: Get Contact Info
    try {
      const contact = await brevoIntegration.getContact('test@example.com')
      results.tests.push({
        test: 'Get Contact',
        success: !!contact,
        details: contact ? `Contact found: ${contact.email}` : 'Contact not found'
      })
    } catch (error) {
      results.tests.push({
        test: 'Get Contact',
        success: false,
        details: 'Failed to retrieve contact'
      })
    }

    // Test 4: Stripe Customer Simulation
    const stripeCustomer = {
      email: 'stripe-test@example.com',
      customerId: 'cus_test123',
      subscriptionId: 'sub_test123',
      plan: 'Premium Design',
      amount: 2999,
      currency: 'USD',
      status: 'active'
    }

    const stripeResult = await brevoIntegration.handleStripeCustomer(stripeCustomer)
    results.tests.push({
      test: 'Handle Stripe Customer',
      success: stripeResult,
      details: stripeResult ? 'Stripe customer synced successfully' : 'Failed to sync Stripe customer'
    })

    return NextResponse.json({
      success: true,
      message: 'Brevo integration tests completed',
      results
    })

  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: 'Test failed',
      message: error.message,
      results
    }, { status: 500 })
  }
}

// Test POST endpoint for form submission
export async function POST(request: NextRequest) {
  // Only allow in development
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json(
      { error: 'This endpoint is only available in development' },
      { status: 403 }
    )
  }

  try {
    const formData = await request.json()
    
    // Test the full contact flow
    const contactResult = await brevoIntegration.createOrUpdateContact({
      name: formData.name || 'Test User',
      email: formData.email || 'test@example.com',
      company: formData.company || 'Test Company',
      message: formData.message || 'Test message',
      service: formData.service || 'General Inquiry'
    })

    let notificationSent = false
    let welcomeSent = false

    if (contactResult) {
      // Send notification email
      notificationSent = await brevoIntegration.sendContactNotification({
        name: formData.name || 'Test User',
        email: formData.email || 'test@example.com',
        company: formData.company,
        message: formData.message || 'Test message',
        service: formData.service
      })

      // Send welcome email
      welcomeSent = await brevoIntegration.sendWelcomeEmail(
        formData.email || 'test@example.com',
        formData.name || 'Test User'
      )
    }

    return NextResponse.json({
      success: true,
      contactCreated: contactResult,
      notificationSent,
      welcomeSent
    })

  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 })
  }
}