/**
 * Campaign Type Definitions
 * Complete TypeScript interfaces for Class of 2025 campaign system
 */

/**
 * Available campaign types
 */
export type CampaignType = 'classOf2025' | 'designForGood' | null

/**
 * Pricing information for a campaign
 */
export interface CampaignPricing {
  amount: string // e.g., "£999"
  period: string // e.g., "/month"
  originalPrice: string // e.g., "£1,449"
  savings: string // e.g., "£450"
  stripePriceId: string
}

/**
 * Banner configuration for sticky countdown
 */
export interface CampaignBanner {
  text: string // Template with {spots} placeholder
  cta: string // Button text
  ctaHref: string // Button link
}

/**
 * Campaign URLs configuration
 */
export interface CampaignUrls {
  discoveryCall?: string
  email?: string
}

/**
 * Class of 2025 campaign configuration
 */
export interface ClassOf2025Campaign {
  enabled: boolean
  name: string
  spotsRemaining: number
  totalSpots: number
  deadline: string // ISO 8601 date string
  pricing: CampaignPricing
  banner: CampaignBanner
  urls?: CampaignUrls
}

/**
 * Design for Good campaign configuration
 */
export interface DesignForGoodCampaign {
  enabled: boolean
  name: string
  tagline: string
  showBelowPricing: boolean
  ctaText: string
  ctaHref: string
  backgroundColor: string
  accentColor: string
}

/**
 * Root campaign configuration object
 */
export interface CampaignConfig {
  active: CampaignType
  classOf2025: ClassOf2025Campaign
  designForGood: DesignForGoodCampaign
}

/**
 * Type guard to check if campaign is active
 */
export function isCampaignActive(
  config: CampaignConfig,
  campaignType: Exclude<CampaignType, null>
): boolean {
  return config.active === campaignType && config[campaignType].enabled
}

/**
 * Countdown timer time units
 */
export interface TimeRemaining {
  days: number
  hours: number
  minutes: number
  seconds: number
}

/**
 * Countdown timer variant props
 */
export type CountdownVariant = 'inline' | 'full'

export interface CountdownTimerProps {
  deadline: string
  variant?: CountdownVariant
}
