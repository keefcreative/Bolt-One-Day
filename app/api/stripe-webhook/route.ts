import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { brevoIntegration } from '@/lib/brevo'
import Stripe from 'stripe'

// Stripe webhook secret for verifying webhook signatures
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || ''

export async function POST(request: NextRequest) {
  if (!stripe) {
    return NextResponse.json(
      { error: 'Stripe not configured' },
      { status: 500 }
    )
  }

  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json(
      { error: 'No signature provided' },
      { status: 400 }
    )
  }

  let event: Stripe.Event

  try {
    // Verify webhook signature
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message)
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 }
    )
  }

  // Handle different event types
  try {
    switch (event.type) {
      case 'customer.created':
      case 'customer.updated': {
        const customer = event.data.object as Stripe.Customer
        
        // Sync customer to Brevo
        if (customer.email) {
          await brevoIntegration.handleStripeCustomer({
            email: customer.email,
            customerId: customer.id,
            // Add to paid customers list
          })
        }
        break
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        const customer = await stripe.customers.retrieve(subscription.customer as string) as Stripe.Customer
        
        if (customer.email) {
          // Get subscription details
          const plan = subscription.items.data[0]?.price
          const amount = plan?.unit_amount ? plan.unit_amount / 100 : 0
          const currency = plan?.currency || 'usd'
          
          await brevoIntegration.handleStripeCustomer({
            email: customer.email,
            customerId: customer.id,
            subscriptionId: subscription.id,
            plan: plan?.nickname || plan?.id || 'Unknown Plan',
            amount: amount,
            currency: currency.toUpperCase(),
            status: subscription.status
          })

          // Send welcome email for new subscriptions
          if (event.type === 'customer.subscription.created' && subscription.status === 'active') {
            await brevoIntegration.sendEmail({
              to: customer.email,
              subject: 'Welcome to DesignWorks Premium!',
              htmlContent: `
                <h1>Welcome to DesignWorks Premium!</h1>
                <p>Hi ${customer.name || 'there'},</p>
                <p>Your subscription is now active. Here's what you can expect:</p>
                <ul>
                  <li>Unlimited design requests</li>
                  <li>48-hour turnaround time</li>
                  <li>Dedicated design team</li>
                  <li>Unlimited revisions</li>
                </ul>
                <p>Our team will reach out within 24 hours to schedule your onboarding call.</p>
                <p>If you have any questions, feel free to reply to this email.</p>
                <p>Best regards,<br>The DesignWorks Team</p>
              `,
              textContent: `
Welcome to DesignWorks Premium!

Hi ${customer.name || 'there'},

Your subscription is now active. Here's what you can expect:
- Unlimited design requests
- 48-hour turnaround time
- Dedicated design team
- Unlimited revisions

Our team will reach out within 24 hours to schedule your onboarding call.

If you have any questions, feel free to reply to this email.

Best regards,
The DesignWorks Team
              `.trim()
            })
          }
        }
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        const customer = await stripe.customers.retrieve(subscription.customer as string) as Stripe.Customer
        
        if (customer.email) {
          // Update subscription status in Brevo
          await brevoIntegration.handleStripeCustomer({
            email: customer.email,
            customerId: customer.id,
            subscriptionId: subscription.id,
            status: 'cancelled'
          })

          // Send cancellation email
          await brevoIntegration.sendEmail({
            to: customer.email,
            subject: 'We\'re sorry to see you go',
            htmlContent: `
              <h1>Subscription Cancelled</h1>
              <p>Hi ${customer.name || 'there'},</p>
              <p>Your DesignWorks subscription has been cancelled.</p>
              <p>You'll continue to have access until the end of your billing period.</p>
              <p>If you change your mind, you can reactivate your subscription anytime.</p>
              <p>We'd love to hear your feedback about your experience with us.</p>
              <p>Best regards,<br>The DesignWorks Team</p>
            `,
            textContent: `
Subscription Cancelled

Hi ${customer.name || 'there'},

Your DesignWorks subscription has been cancelled.
You'll continue to have access until the end of your billing period.

If you change your mind, you can reactivate your subscription anytime.
We'd love to hear your feedback about your experience with us.

Best regards,
The DesignWorks Team
            `.trim()
          })
        }
        break
      }

      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        
        // Handle successful checkout
        if (session.customer_email) {
          const customerId = session.customer as string
          const subscriptionId = session.subscription as string
          
          // Get subscription details if available
          let subscriptionDetails = null
          if (subscriptionId) {
            subscriptionDetails = await stripe.subscriptions.retrieve(subscriptionId)
          }
          
          await brevoIntegration.handleStripeCustomer({
            email: session.customer_email,
            customerId: customerId,
            subscriptionId: subscriptionId || undefined,
            status: 'active'
          })

          // Send confirmation email
          await brevoIntegration.sendEmail({
            to: session.customer_email,
            subject: 'Payment Confirmation',
            htmlContent: `
              <h1>Thank you for your purchase!</h1>
              <p>Your payment has been successfully processed.</p>
              <p>Amount: ${(session.amount_total || 0) / 100} ${session.currency?.toUpperCase()}</p>
              <p>You'll receive another email shortly with more details about your subscription.</p>
              <p>Best regards,<br>The DesignWorks Team</p>
            `,
            textContent: `
Thank you for your purchase!

Your payment has been successfully processed.
Amount: ${(session.amount_total || 0) / 100} ${session.currency?.toUpperCase()}

You'll receive another email shortly with more details about your subscription.

Best regards,
The DesignWorks Team
            `.trim()
          })
        }
        break
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice
        
        if (invoice.customer_email) {
          // Send receipt email
          await brevoIntegration.sendEmail({
            to: invoice.customer_email,
            subject: 'Payment Receipt - DesignWorks',
            htmlContent: `
              <h1>Payment Receipt</h1>
              <p>Thank you for your payment!</p>
              <p><strong>Invoice Number:</strong> ${invoice.number}</p>
              <p><strong>Amount Paid:</strong> ${(invoice.amount_paid || 0) / 100} ${invoice.currency?.toUpperCase()}</p>
              <p><strong>Date:</strong> ${new Date(invoice.created * 1000).toLocaleDateString()}</p>
              <p>You can view your invoice online: <a href="${invoice.hosted_invoice_url}">View Invoice</a></p>
              <p>Best regards,<br>The DesignWorks Team</p>
            `,
            textContent: `
Payment Receipt

Thank you for your payment!

Invoice Number: ${invoice.number}
Amount Paid: ${(invoice.amount_paid || 0) / 100} ${invoice.currency?.toUpperCase()}
Date: ${new Date(invoice.created * 1000).toLocaleDateString()}

You can view your invoice online at: ${invoice.hosted_invoice_url}

Best regards,
The DesignWorks Team
            `.trim()
          })
        }
        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice
        
        if (invoice.customer_email) {
          // Send payment failure notification
          await brevoIntegration.sendEmail({
            to: invoice.customer_email,
            subject: 'Payment Failed - Action Required',
            htmlContent: `
              <h1>Payment Failed</h1>
              <p>We were unable to process your payment for your DesignWorks subscription.</p>
              <p><strong>Amount:</strong> ${(invoice.amount_due || 0) / 100} ${invoice.currency?.toUpperCase()}</p>
              <p>Please update your payment method to avoid service interruption.</p>
              <p><a href="${invoice.hosted_invoice_url}" style="background: #FF6B35; color: white; padding: 12px 24px; text-decoration: none; display: inline-block;">Update Payment Method</a></p>
              <p>If you have any questions, please contact our support team.</p>
              <p>Best regards,<br>The DesignWorks Team</p>
            `,
            textContent: `
Payment Failed

We were unable to process your payment for your DesignWorks subscription.

Amount: ${(invoice.amount_due || 0) / 100} ${invoice.currency?.toUpperCase()}

Please update your payment method to avoid service interruption.
Update at: ${invoice.hosted_invoice_url}

If you have any questions, please contact our support team.

Best regards,
The DesignWorks Team
            `.trim()
          })
        }
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Error handling webhook:', error)
    // Return success to avoid Stripe retries for processing errors
    return NextResponse.json({ received: true, error: 'Processing error' })
  }
}