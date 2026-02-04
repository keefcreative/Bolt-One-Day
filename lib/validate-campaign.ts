/**
 * Campaign Configuration Validation
 * Runtime validation for activeCampaign.json with helpful error messages
 */

import type { CampaignConfig } from '@/types/campaign'

interface ValidationError {
  field: string
  message: string
}

export function validateCampaignConfig(data: unknown): {
  valid: boolean
  errors: ValidationError[]
  data?: CampaignConfig
} {
  const errors: ValidationError[] = []

  // Type guard
  if (typeof data !== 'object' || data === null) {
    return {
      valid: false,
      errors: [{ field: 'root', message: 'Campaign data must be an object' }]
    }
  }

  const config = data as Partial<CampaignConfig>

  // Validate active field
  if (config.active !== null && config.active !== 'classOf2025' && config.active !== 'classOf2026' && config.active !== 'designForGood') {
    errors.push({
      field: 'active',
      message: 'Must be "classOf2025", "classOf2026", "designForGood", or null'
    })
  }

  // Validate classOf2026 (primary campaign)
  const configAny = config as any
  if (configAny.classOf2026) {
    const c = configAny.classOf2026

    if (typeof c.enabled !== 'boolean') {
      errors.push({ field: 'classOf2026.enabled', message: 'Must be a boolean' })
    }

    if (typeof c.spotsRemaining !== 'number' || c.spotsRemaining < 0) {
      errors.push({ field: 'classOf2026.spotsRemaining', message: 'Must be a non-negative number' })
    }

    if (typeof c.totalSpots !== 'number' || c.totalSpots < 1) {
      errors.push({ field: 'classOf2026.totalSpots', message: 'Must be a positive number' })
    }

    if (c.spotsRemaining > c.totalSpots) {
      errors.push({ field: 'classOf2026.spotsRemaining', message: 'Cannot exceed totalSpots' })
    }

    // Validate deadline format
    if (c.deadline) {
      const date = new Date(c.deadline)
      if (isNaN(date.getTime())) {
        errors.push({ field: 'classOf2026.deadline', message: 'Invalid date format (use ISO 8601)' })
      }
      // Note: Allow past deadlines for testing purposes, just warn
      if (date < new Date()) {
        console.warn('Campaign deadline is in the past:', c.deadline)
      }
    } else {
      errors.push({ field: 'classOf2026.deadline', message: 'Required field missing' })
    }

    // Validate pricing
    if (!c.pricing || typeof c.pricing !== 'object') {
      errors.push({ field: 'classOf2026.pricing', message: 'Required field missing or invalid' })
    } else {
      if (!c.pricing.amount) errors.push({ field: 'classOf2026.pricing.amount', message: 'Required' })
      if (!c.pricing.stripePriceId) errors.push({ field: 'classOf2026.pricing.stripePriceId', message: 'Required' })
    }

    // Validate banner
    if (!c.banner || typeof c.banner !== 'object') {
      errors.push({ field: 'classOf2026.banner', message: 'Required field missing or invalid' })
    } else {
      if (!c.banner.text) errors.push({ field: 'classOf2026.banner.text', message: 'Required' })
      if (!c.banner.cta) errors.push({ field: 'classOf2026.banner.cta', message: 'Required' })
      if (!c.banner.ctaHref) errors.push({ field: 'classOf2026.banner.ctaHref', message: 'Required' })
    }
  } else if (config.active === 'classOf2026') {
    errors.push({ field: 'classOf2026', message: 'Required configuration missing for active campaign' })
  }

  // Validate classOf2025 (legacy, optional)
  if (config.classOf2025) {
    const c = config.classOf2025

    if (typeof c.enabled !== 'boolean') {
      errors.push({ field: 'classOf2025.enabled', message: 'Must be a boolean' })
    }

    if (typeof c.spotsRemaining !== 'number' || c.spotsRemaining < 0) {
      errors.push({ field: 'classOf2025.spotsRemaining', message: 'Must be a non-negative number' })
    }

    if (typeof c.totalSpots !== 'number' || c.totalSpots < 1) {
      errors.push({ field: 'classOf2025.totalSpots', message: 'Must be a positive number' })
    }

    if (c.spotsRemaining > c.totalSpots) {
      errors.push({ field: 'classOf2025.spotsRemaining', message: 'Cannot exceed totalSpots' })
    }

    // Validate deadline format
    if (c.deadline) {
      const date = new Date(c.deadline)
      if (isNaN(date.getTime())) {
        errors.push({ field: 'classOf2025.deadline', message: 'Invalid date format (use ISO 8601)' })
      }
      // Note: Allow past deadlines for testing purposes, just warn
      if (date < new Date()) {
        console.warn('Campaign deadline is in the past:', c.deadline)
      }
    } else {
      errors.push({ field: 'classOf2025.deadline', message: 'Required field missing' })
    }

    // Validate pricing
    if (!c.pricing || typeof c.pricing !== 'object') {
      errors.push({ field: 'classOf2025.pricing', message: 'Required field missing or invalid' })
    } else {
      if (!c.pricing.amount) errors.push({ field: 'classOf2025.pricing.amount', message: 'Required' })
      if (!c.pricing.stripePriceId) errors.push({ field: 'classOf2025.pricing.stripePriceId', message: 'Required' })
    }

    // Validate banner
    if (!c.banner || typeof c.banner !== 'object') {
      errors.push({ field: 'classOf2025.banner', message: 'Required field missing or invalid' })
    } else {
      if (!c.banner.text) errors.push({ field: 'classOf2025.banner.text', message: 'Required' })
      if (!c.banner.cta) errors.push({ field: 'classOf2025.banner.cta', message: 'Required' })
      if (!c.banner.ctaHref) errors.push({ field: 'classOf2025.banner.ctaHref', message: 'Required' })
    }
  } else if (config.active === 'classOf2025') {
    errors.push({ field: 'classOf2025', message: 'Required configuration missing for active campaign' })
  }

  // Validate designForGood (basic check)
  if (config.designForGood) {
    const d = config.designForGood
    if (typeof d.enabled !== 'boolean') {
      errors.push({ field: 'designForGood.enabled', message: 'Must be a boolean' })
    }
  } else {
    errors.push({ field: 'designForGood', message: 'Required configuration missing' })
  }

  // Return validation result
  if (errors.length === 0) {
    return {
      valid: true,
      errors: [],
      data: config as CampaignConfig
    }
  }

  return {
    valid: false,
    errors
  }
}
