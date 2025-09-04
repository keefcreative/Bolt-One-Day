// Stripe Product and Price ID Mapping
// This maps the frontend pricing tiers to actual Stripe price IDs

export const STRIPE_PRICE_MAPPINGS = {
  // Main subscription plans
  essential: 'price_1PP4M8P3PqPfy1jM3lzwQMmc', // £7.99/month - DesignWorks Essential
  business: 'price_1PP4N8P3PqPfy1jMpxXppeTe', // £12.49/month - Business DesignWorks
  enterprise: 'price_1PP4O6P3PqPfy1jMxw8JtIad', // £25.00/month - Enterprise DesignWorks
  enterprise_plus: 'price_1PP4P2P3PqPfy1jMg755YNF3', // £45.00/month - Enterprise DesignWorks +
  
  // Design for Good (Non-profit plans)
  design_for_good: 'price_1RCLNfP3PqPfy1jMQQrRKcFv', // £25.00/month - Design For Good
  design_for_good_discounted: 'price_1RH2QCP3PqPfy1jMN2bAn90J', // £14.99/month - Design for Good: Charity Cohort Membership
  design_for_good_standard: 'price_1RH2QCP3PqPfy1jMbS2yn4ns', // £24.99/month - Design for Good: Charity Cohort Membership
  
  // Add-ons
  interim_boost: 'price_1RJyOlP3PqPfy1jMqFCjzsGl', // £24.98/month - Interim Boost (Business Plan Add-On)
  priority_triage: 'price_1RJyQKP3PqPfy1jMpwQlXr0t', // £12.49/month - Priority Triage + One Designer
}

// Product metadata for display
export const STRIPE_PRODUCTS = {
  essential: {
    name: 'DesignWorks Essential',
    displayPrice: '£799',
    actualPrice: 799, // in pence: 79900
    stripePriceId: STRIPE_PRICE_MAPPINGS.essential,
    features: [
      '5 design requests per month',
      '48h turnaround',
      'Email support',
      'Unlimited revisions',
      'Dedicated designer'
    ]
  },
  business: {
    name: 'Business DesignWorks',
    displayPrice: '£1,249',
    actualPrice: 1249, // in pence: 124900
    stripePriceId: STRIPE_PRICE_MAPPINGS.business,
    features: [
      '10 design requests per month',
      '48h turnaround',
      'Priority support',
      'Unlimited revisions',
      'Senior designer'
    ]
  },
  enterprise: {
    name: 'Enterprise DesignWorks',
    displayPrice: '£2,500',
    actualPrice: 2500, // in pence: 250000
    stripePriceId: STRIPE_PRICE_MAPPINGS.enterprise,
    features: [
      'Unlimited design requests',
      '24h turnaround',
      '24/7 priority support',
      'Unlimited revisions',
      'Dedicated design team'
    ]
  },
  enterprise_plus: {
    name: 'Enterprise DesignWorks +',
    displayPrice: '£4,500',
    actualPrice: 4500, // in pence: 450000
    stripePriceId: STRIPE_PRICE_MAPPINGS.enterprise_plus,
    features: [
      'Unlimited design requests',
      'Same-day turnaround',
      '24/7 priority support',
      'Unlimited revisions',
      'Dedicated design team',
      '4-hour rush available',
      'Senior creative director'
    ]
  }
}

// Helper function to get the correct Stripe price ID
export function getStripePriceId(planName: string): string | null {
  const normalizedName = planName.toLowerCase().replace(/\s+/g, '_')
  return STRIPE_PRICE_MAPPINGS[normalizedName] || null
}

// Helper function to validate if a price ID exists in Stripe
export function isValidStripePriceId(priceId: string): boolean {
  return Object.values(STRIPE_PRICE_MAPPINGS).includes(priceId)
}