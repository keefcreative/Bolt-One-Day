import { NextRequest, NextResponse } from 'next/server'
import { stripe, stripePublicKey } from '@/lib/stripe'

// Test endpoint for Stripe integration - REMOVE IN PRODUCTION
export async function GET(request: NextRequest) {
  // Only allow in development
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json(
      { error: 'This endpoint is only available in development' },
      { status: 403 }
    )
  }

  const results = {
    configuration: {
      secretKeyConfigured: !!process.env.STRIPE_SECRET_KEY,
      publicKeyConfigured: !!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
      webhookSecretConfigured: !!process.env.STRIPE_WEBHOOK_SECRET,
      stripeInitialized: !!stripe,
      publicKey: stripePublicKey ? `${stripePublicKey.substring(0, 10)}...` : 'Not configured'
    },
    tests: [] as any[]
  }

  if (!stripe) {
    return NextResponse.json({
      success: false,
      message: 'Stripe not configured. Please add STRIPE_SECRET_KEY to .env.local',
      results
    })
  }

  try {
    // Test 1: Verify API connection
    try {
      const balance = await stripe.balance.retrieve()
      results.tests.push({
        test: 'API Connection',
        success: true,
        details: `Connected successfully. Currency: ${balance.available[0]?.currency || 'N/A'}`
      })
    } catch (error: any) {
      results.tests.push({
        test: 'API Connection',
        success: false,
        details: error.message
      })
    }

    // Test 2: List products (if any)
    try {
      const products = await stripe.products.list({ limit: 3 })
      results.tests.push({
        test: 'List Products',
        success: true,
        details: `Found ${products.data.length} products`,
        products: products.data.map(p => ({ id: p.id, name: p.name }))
      })
    } catch (error: any) {
      results.tests.push({
        test: 'List Products',
        success: false,
        details: error.message
      })
    }

    // Test 3: List prices (if any)
    try {
      const prices = await stripe.prices.list({ limit: 3 })
      results.tests.push({
        test: 'List Prices',
        success: true,
        details: `Found ${prices.data.length} prices`,
        prices: prices.data.map(p => ({
          id: p.id,
          amount: p.unit_amount ? p.unit_amount / 100 : 0,
          currency: p.currency,
          recurring: p.recurring
        }))
      })
    } catch (error: any) {
      results.tests.push({
        test: 'List Prices',
        success: false,
        details: error.message
      })
    }

    // Test 4: Create a test checkout session
    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: 'Test Product',
                description: 'This is a test checkout session'
              },
              unit_amount: 1000, // $10.00
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${request.headers.get('origin')}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${request.headers.get('origin')}/cancel`,
      })

      results.tests.push({
        test: 'Create Checkout Session',
        success: true,
        details: 'Test checkout session created successfully',
        checkoutUrl: session.url,
        sessionId: session.id
      })
    } catch (error: any) {
      results.tests.push({
        test: 'Create Checkout Session',
        success: false,
        details: error.message
      })
    }

    return NextResponse.json({
      success: true,
      message: 'Stripe integration tests completed',
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

// Test POST endpoint for creating a subscription checkout
export async function POST(request: NextRequest) {
  // Only allow in development
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json(
      { error: 'This endpoint is only available in development' },
      { status: 403 }
    )
  }

  if (!stripe) {
    return NextResponse.json({
      success: false,
      message: 'Stripe not configured'
    }, { status: 500 })
  }

  try {
    const { priceId, email } = await request.json()

    // Create a subscription checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: priceId ? [
        {
          price: priceId,
          quantity: 1,
        },
      ] : [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Design Subscription',
              description: 'Monthly design subscription'
            },
            unit_amount: 299900, // $2999.00
            recurring: {
              interval: 'month'
            }
          },
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${request.headers.get('origin')}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${request.headers.get('origin')}/cancel`,
      customer_email: email,
      billing_address_collection: 'required',
      allow_promotion_codes: true,
    })

    return NextResponse.json({
      success: true,
      checkoutUrl: session.url,
      sessionId: session.id
    })

  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 })
  }
}