// Stripe Checkout Branding Configuration
// Matches DesignWorks premium dark aesthetic

import type Stripe from 'stripe'

/**
 * DesignWorks Premium Brand Colors
 * Matches the design system used across the website
 */
export const BRAND_COLORS = {
  primary: '#FF6B35',      // Flame - Primary CTA color
  background: '#0A0A0A',   // Ink - Deep black background
  text: '#FAFAFA',         // Pearl - Primary text
  accent: '#1A1A1A',       // Smoke - Card backgrounds
  border: '#2C2C2C',       // Subtle borders
} as const

/**
 * Stripe Checkout Session Appearance
 * Configures the hosted checkout page to match brand aesthetic
 */
export function getCheckoutAppearance(): Stripe.Checkout.SessionCreateParams['custom_text'] {
  return {
    submit: {
      message: 'You will be charged immediately. Cancel anytime with no penalties.',
    },
    terms_of_service_acceptance: {
      message: 'By subscribing, you agree to our terms and privacy policy.',
    },
  }
}

/**
 * Customer Portal Configuration
 * Settings for the self-service customer portal
 */
export const PORTAL_FEATURES = {
  customer_update: {
    enabled: true,
    allowed_updates: ['email', 'address', 'phone'] as const,
  },
  invoice_history: {
    enabled: true,
  },
  payment_method_update: {
    enabled: true,
  },
  subscription_cancel: {
    enabled: true,
    mode: 'at_period_end' as const,
    cancellation_reason: {
      enabled: true,
      options: [
        'too_expensive',
        'missing_features',
        'switched_service',
        'unused',
        'customer_service',
        'too_complex',
        'low_quality',
        'other',
      ] as const,
    },
  },
  subscription_pause: {
    enabled: true,
  },
  subscription_update: {
    enabled: true,
    default_allowed_updates: ['price', 'quantity', 'promotion_code'] as const,
    proration_behavior: 'always_invoice' as const,
  },
} as const

/**
 * Invoice Branding
 * Custom footer and description for invoices
 */
export function getInvoiceSettings() {
  return {
    description: 'DesignWorks Subscription',
    footer: 'Thank you for choosing DesignWorks. Questions? Contact hello@designworks.com',
  }
}

/**
 * Checkout Session Metadata
 * Standard metadata to include with all checkout sessions
 */
export function getCheckoutMetadata(campaign?: string) {
  return {
    source: 'website',
    brand: 'DesignWorks',
    ...(campaign && { campaign }),
  }
}

/**
 * Business Profile Information
 * Displayed on receipts and checkout pages
 */
export const BUSINESS_PROFILE = {
  name: 'DesignWorks',
  support_email: 'hello@designworks.com',
  url: 'https://designworks.com',
} as const

/**
 * Payment Settings
 * How charges appear on customer statements
 */
export const PAYMENT_SETTINGS = {
  statement_descriptor: 'DESIGNWORKS',
  statement_descriptor_suffix: null,
} as const

/**
 * Apply branding to a Stripe Checkout Session
 * Use this when creating checkout sessions to ensure consistent branding
 */
export function applyBrandingToCheckout(
  params: Stripe.Checkout.SessionCreateParams,
  campaign?: string
): Stripe.Checkout.SessionCreateParams {
  return {
    ...params,
    custom_text: getCheckoutAppearance(),
    metadata: {
      ...getCheckoutMetadata(campaign),
      ...(params.metadata || {}),
    },
    consent_collection: {
      terms_of_service: 'required',
      ...(params.consent_collection || {}),
    },
    phone_number_collection: {
      enabled: false,
    },
  }
}

/**
 * Instructions for manual Stripe Dashboard configuration
 */
export const MANUAL_SETUP_INSTRUCTIONS = `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📝 Manual Stripe Dashboard Configuration
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

These settings must be configured manually in the Stripe Dashboard:

1. BRANDING SETTINGS
   URL: https://dashboard.stripe.com/settings/branding

   Primary Color: ${BRAND_COLORS.primary} (Flame Orange)

   Logo: Upload white logo on transparent background
         Recommended size: 512x512px PNG

   Icon: Upload square favicon/icon
         Recommended size: 128x128px PNG

2. BUSINESS INFORMATION
   URL: https://dashboard.stripe.com/settings/public

   Business name: ${BUSINESS_PROFILE.name}
   Support email: ${BUSINESS_PROFILE.support_email}
   Website: ${BUSINESS_PROFILE.url}

3. CUSTOMER PORTAL
   URL: https://dashboard.stripe.com/settings/billing/portal

   Enable all features:
   ✅ Update payment methods
   ✅ Cancel subscriptions (at period end)
   ✅ Pause subscriptions
   ✅ Update subscriptions
   ✅ View invoice history
   ✅ Update customer information

4. CHECKOUT SETTINGS
   URL: https://dashboard.stripe.com/settings/checkout

   ✅ Enable customer creation
   ✅ Collect billing address
   ✅ Allow promotion codes
   ✅ Show invoice PDFs

5. EMAILS & RECEIPTS
   URL: https://dashboard.stripe.com/settings/emails

   Customize email templates to match brand colors
   Add ${BRAND_COLORS.primary} as accent color

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`

// Log instructions when this module is imported
if (typeof window === 'undefined') {
  // Server-side only
  console.log(MANUAL_SETUP_INSTRUCTIONS)
}
