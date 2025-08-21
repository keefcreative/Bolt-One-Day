import Stripe from 'stripe'

const stripeSecretKey = process.env.STRIPE_SECRET_KEY
const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY

if (!stripeSecretKey) {
  console.warn('STRIPE_SECRET_KEY not found in environment variables')
}

if (!stripePublishableKey) {
  console.warn('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY not found in environment variables')
}

export const stripe = stripeSecretKey 
  ? new Stripe(stripeSecretKey, {
      apiVersion: '2024-11-20.acacia',
      typescript: true,
    })
  : null

export const stripePublicKey = stripePublishableKey || ''

// Export for use in client-side components
export const stripeConfig = {
  publishableKey: stripePublishableKey,
} as const