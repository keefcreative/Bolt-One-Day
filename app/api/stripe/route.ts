import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { applyBrandingToCheckout } from '@/lib/stripe-branding'
import campaignData from '@/data/activeCampaign.json'
import type { CampaignConfig } from '@/types/campaign'
import type Stripe from 'stripe'

const typedCampaignData = campaignData as CampaignConfig

export async function POST(request: NextRequest) {
  if (!stripe) {
    return NextResponse.json(
      { error: 'Stripe is not configured' },
      { status: 500 }
    )
  }

  try {
    const { priceId, successUrl, cancelUrl, campaign } = await request.json()

    if (!priceId) {
      return NextResponse.json(
        { error: 'Price ID is required' },
        { status: 400 }
      )
    }

    // Check if this is a campaign purchase and validate spots
    if (campaign && (campaign === 'classOf2025' || campaign === 'designForGood')) {
      const campaignConfig = typedCampaignData[campaign as 'classOf2025' | 'designForGood']

      if (campaignConfig && 'pricing' in campaignConfig && campaignConfig.pricing.stripePriceId === priceId) {
        // Count active subscriptions for this campaign
        // Only classOf2025 has totalSpots tracking
        if (campaign === 'classOf2025') {
          // Type narrow to ClassOf2025Campaign since we know campaign === 'classOf2025'
          const classOf2025Config = campaignConfig as import('@/types/campaign').ClassOf2025Campaign

          const subscriptions = await stripe.subscriptions.list({
            price: priceId,
            status: 'active',
            limit: 100,
          })

          const activeSubscriptions = subscriptions.data.length
          const spotsRemaining = classOf2025Config.totalSpots - activeSubscriptions

          // Check if spots are available
          if (spotsRemaining <= 0) {
            return NextResponse.json(
              {
                error: 'Campaign spots filled',
                message: 'Sorry, all spots for this campaign have been filled. Please join our waitlist.',
                spotsRemaining: 0
              },
              { status: 409 } // Conflict
            )
          }

          // Check if deadline has passed
          const deadline = new Date(classOf2025Config.deadline)
          const now = new Date()
          if (now > deadline) {
            return NextResponse.json(
              {
                error: 'Campaign ended',
                message: 'This campaign has ended. Please check our current pricing plans.',
                deadlinePassed: true
              },
              { status: 410 } // Gone
            )
          }
        }
      }
    }

    // Create Stripe checkout session with DesignWorks branding
    const checkoutParams: Stripe.Checkout.SessionCreateParams = {
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: successUrl || `${request.nextUrl.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || `${request.nextUrl.origin}/#pricing`,
      allow_promotion_codes: true,
      billing_address_collection: 'required',
      metadata: {
        source: 'website',
        plan: priceId,
        ...(campaign && { campaign }),
      },
    }

    // Apply DesignWorks branding (custom text, invoices, etc.)
    const brandedParams = applyBrandingToCheckout(checkoutParams, campaign)
    const session = await stripe.checkout.sessions.create(brandedParams)

    return NextResponse.json({ 
      sessionId: session.id,
      url: session.url 
    })

  } catch (error: any) {
    console.error('Error creating checkout session:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}