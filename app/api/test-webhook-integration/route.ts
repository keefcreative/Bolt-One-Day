import { NextRequest, NextResponse } from 'next/server'
import { brevoIntegration } from '@/lib/brevo'

// Test endpoint to simulate Stripe webhook events for testing the Stripe-Brevo integration
export async function POST(request: NextRequest) {
  try {
    const { eventType, data } = await request.json()

    console.log('Testing webhook integration:', eventType)

    switch (eventType) {
      case 'test_subscription_created': {
        // Simulate a new subscription being created
        const testCustomer = {
          email: data.email || 'test@designworksbureau.co.uk',
          customerId: 'cus_test_' + Date.now(),
          subscriptionId: 'sub_test_' + Date.now(),
          plan: data.plan || 'Professional',
          amount: data.amount || 24.99,
          currency: 'GBP',
          status: 'active'
        }

        console.log('Creating/updating Brevo contact for:', testCustomer.email)

        // Sync to Brevo CRM
        const brevoResult = await brevoIntegration.handleStripeCustomer(testCustomer)
        console.log('Brevo sync result:', brevoResult)

        // Send welcome email
        const emailResult = await brevoIntegration.sendEmail({
          to: testCustomer.email,
          subject: 'Welcome to DesignWorks Bureau - ' + testCustomer.plan + ' Plan',
          htmlContent: `
            <h1>Welcome to DesignWorks Bureau!</h1>
            <p>Your ${testCustomer.plan} subscription is now active.</p>
            <p><strong>Subscription Details:</strong></p>
            <ul>
              <li>Plan: ${testCustomer.plan}</li>
              <li>Amount: £${testCustomer.amount}/month</li>
              <li>Status: ${testCustomer.status}</li>
            </ul>
            <p>Our team will contact you within 24 hours to schedule your onboarding call.</p>
            <p>Best regards,<br>The DesignWorks Bureau Team</p>
          `,
          textContent: `Welcome to DesignWorks Bureau!\n\nYour ${testCustomer.plan} subscription is now active.\n\nBest regards,\nThe DesignWorks Bureau Team`
        })
        console.log('Welcome email result:', emailResult)

        return NextResponse.json({
          success: true,
          message: 'Subscription created and synced to Brevo',
          data: {
            customer: testCustomer,
            brevoSync: brevoResult,
            emailSent: emailResult
          }
        })
      }

      case 'test_payment_succeeded': {
        // Simulate successful payment
        const testInvoice = {
          email: data.email || 'test@designworksbureau.co.uk',
          amount: data.amount || 24.99,
          currency: 'GBP',
          invoiceNumber: 'INV-' + Date.now(),
          date: new Date().toLocaleDateString()
        }

        console.log('Sending payment receipt to:', testInvoice.email)

        const emailResult = await brevoIntegration.sendEmail({
          to: testInvoice.email,
          subject: 'Payment Receipt - DesignWorks Bureau',
          htmlContent: `
            <h1>Payment Receipt</h1>
            <p>Thank you for your payment!</p>
            <p><strong>Invoice #${testInvoice.invoiceNumber}</strong></p>
            <p>Amount: £${testInvoice.amount}</p>
            <p>Date: ${testInvoice.date}</p>
            <p>Best regards,<br>The DesignWorks Bureau Team</p>
          `,
          textContent: `Payment Receipt\n\nThank you for your payment!\nInvoice #${testInvoice.invoiceNumber}\nAmount: £${testInvoice.amount}\n\nBest regards,\nThe DesignWorks Bureau Team`
        })

        return NextResponse.json({
          success: true,
          message: 'Payment receipt sent',
          data: {
            invoice: testInvoice,
            emailSent: emailResult
          }
        })
      }

      case 'test_payment_failed': {
        // Simulate failed payment
        const testFailure = {
          email: data.email || 'test@designworksbureau.co.uk',
          amount: data.amount || 24.99,
          currency: 'GBP'
        }

        console.log('Sending payment failure notification to:', testFailure.email)

        const emailResult = await brevoIntegration.sendEmail({
          to: testFailure.email,
          subject: 'Payment Failed - Action Required',
          htmlContent: `
            <h1>Payment Failed</h1>
            <p>We were unable to process your payment of £${testFailure.amount}.</p>
            <p>Please update your payment method to avoid service interruption.</p>
            <p>Best regards,<br>The DesignWorks Bureau Team</p>
          `,
          textContent: `Payment Failed\n\nWe were unable to process your payment of £${testFailure.amount}.\nPlease update your payment method to avoid service interruption.\n\nBest regards,\nThe DesignWorks Bureau Team`
        })

        return NextResponse.json({
          success: true,
          message: 'Payment failure notification sent',
          data: {
            failure: testFailure,
            emailSent: emailResult
          }
        })
      }

      case 'test_subscription_cancelled': {
        // Simulate subscription cancellation
        const testCancellation = {
          email: data.email || 'test@designworksbureau.co.uk',
          customerId: 'cus_test_' + Date.now(),
          subscriptionId: 'sub_test_' + Date.now(),
          status: 'cancelled'
        }

        console.log('Updating Brevo contact for cancellation:', testCancellation.email)

        // Update in Brevo
        const brevoResult = await brevoIntegration.handleStripeCustomer(testCancellation)

        // Send cancellation email
        const emailResult = await brevoIntegration.sendEmail({
          to: testCancellation.email,
          subject: "We're sorry to see you go",
          htmlContent: `
            <h1>Subscription Cancelled</h1>
            <p>Your DesignWorks Bureau subscription has been cancelled.</p>
            <p>We'd love to hear your feedback about your experience.</p>
            <p>You can reactivate anytime.</p>
            <p>Best regards,<br>The DesignWorks Bureau Team</p>
          `,
          textContent: `Subscription Cancelled\n\nYour DesignWorks Bureau subscription has been cancelled.\nWe'd love to hear your feedback.\n\nBest regards,\nThe DesignWorks Bureau Team`
        })

        return NextResponse.json({
          success: true,
          message: 'Cancellation processed',
          data: {
            cancellation: testCancellation,
            brevoSync: brevoResult,
            emailSent: emailResult
          }
        })
      }

      default:
        return NextResponse.json({
          success: false,
          message: 'Unknown event type: ' + eventType
        }, { status: 400 })
    }
  } catch (error) {
    console.error('Test webhook error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      details: error
    }, { status: 500 })
  }
}

// GET endpoint to show available test events
export async function GET() {
  return NextResponse.json({
    message: 'Test Webhook Integration Endpoint',
    availableEvents: [
      'test_subscription_created',
      'test_payment_succeeded', 
      'test_payment_failed',
      'test_subscription_cancelled'
    ],
    usage: 'POST to this endpoint with { eventType: "...", data: { email: "...", ... } }'
  })
}