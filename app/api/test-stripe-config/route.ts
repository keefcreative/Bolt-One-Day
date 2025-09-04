import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'

export async function GET() {
  if (!stripe) {
    return NextResponse.json({ error: 'Stripe not configured' }, { status: 500 })
  }

  try {
    // Fetch all products with prices
    const products = await stripe.products.list({
      active: true,
      expand: ['data.default_price']
    })

    // Fetch all prices with full details
    const prices = await stripe.prices.list({
      active: true,
      expand: ['data.product']
    })

    // Get subscription plans
    const subscriptionPrices = prices.data.filter(price => price.type === 'recurring')
    const oneTimePrices = prices.data.filter(price => price.type === 'one_time')

    // Format the data for easy reading
    const formattedProducts = products.data.map(product => {
      const productPrices = prices.data.filter(p => p.product === product.id || (typeof p.product === 'object' && p.product.id === product.id))
      
      return {
        id: product.id,
        name: product.name,
        description: product.description,
        active: product.active,
        metadata: product.metadata,
        features: product.features,
        default_price: product.default_price,
        prices: productPrices.map(price => ({
          id: price.id,
          nickname: price.nickname,
          currency: price.currency,
          amount: price.unit_amount ? price.unit_amount / 100 : 0,
          type: price.type,
          interval: price.recurring?.interval,
          interval_count: price.recurring?.interval_count,
          metadata: price.metadata
        }))
      }
    })

    // Get customer count
    const customers = await stripe.customers.list({ limit: 100 })
    const subscriptions = await stripe.subscriptions.list({ limit: 100 })

    return NextResponse.json({
      summary: {
        total_products: products.data.length,
        total_prices: prices.data.length,
        subscription_prices: subscriptionPrices.length,
        one_time_prices: oneTimePrices.length,
        total_customers: customers.data.length,
        active_subscriptions: subscriptions.data.filter(s => s.status === 'active').length
      },
      products: formattedProducts,
      subscription_prices: subscriptionPrices.map(price => ({
        id: price.id,
        product: typeof price.product === 'object' ? price.product.name : price.product,
        nickname: price.nickname,
        amount: price.unit_amount ? price.unit_amount / 100 : 0,
        currency: price.currency,
        interval: price.recurring?.interval,
        interval_count: price.recurring?.interval_count
      })),
      config: {
        api_version: stripe.apiVersion,
        webhook_configured: !!process.env.STRIPE_WEBHOOK_SECRET,
        publishable_key_configured: !!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
      }
    }, { 
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      }
    })
  } catch (error) {
    console.error('Error fetching Stripe config:', error)
    return NextResponse.json({
      error: 'Failed to fetch Stripe configuration',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}