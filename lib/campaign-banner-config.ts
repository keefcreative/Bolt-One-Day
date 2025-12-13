/**
 * Campaign Banner Configuration
 *
 * Centralized configuration for banner dismissal behavior
 */

export const BANNER_CONFIG = {
  /**
   * How long (in hours) the banner stays dismissed after user clicks X
   *
   * Examples:
   * - 24: Show again after 24 hours (recommended for urgent campaigns)
   * - 72: Show again after 3 days
   * - 168: Show again after 1 week (less aggressive)
   * - 0: Session only (show again on next browser session)
   */
  DISMISS_DURATION_HOURS: 24,

  /**
   * LocalStorage key for dismissal timestamp
   */
  STORAGE_KEY: 'designworks_class2025_banner_dismissed_until',

  /**
   * Legacy storage key (permanent dismissal - now deprecated)
   */
  LEGACY_STORAGE_KEY: 'designworks_class2025_banner_dismissed',
} as const

/**
 * Get the dismissal expiration date
 */
export function getDismissalExpiration(): Date {
  const now = new Date()
  now.setHours(now.getHours() + BANNER_CONFIG.DISMISS_DURATION_HOURS)
  return now
}

/**
 * Check if banner is currently dismissed
 */
export function isBannerDismissed(): {
  isDismissed: boolean
  hoursRemaining?: number
  expiresAt?: Date
} {
  const dismissedUntil = localStorage.getItem(BANNER_CONFIG.STORAGE_KEY)

  if (!dismissedUntil) {
    return { isDismissed: false }
  }

  const dismissedUntilDate = new Date(dismissedUntil)
  const now = new Date()

  if (dismissedUntilDate > now) {
    const hoursRemaining = Math.ceil((dismissedUntilDate.getTime() - now.getTime()) / (1000 * 60 * 60))
    return {
      isDismissed: true,
      hoursRemaining,
      expiresAt: dismissedUntilDate
    }
  }

  // Dismissal expired
  localStorage.removeItem(BANNER_CONFIG.STORAGE_KEY)
  return { isDismissed: false }
}

/**
 * Dismiss the banner for the configured duration
 */
export function dismissBanner(): Date {
  const expiresAt = getDismissalExpiration()
  localStorage.setItem(BANNER_CONFIG.STORAGE_KEY, expiresAt.toISOString())

  // Clean up legacy permanent dismissal key
  localStorage.removeItem(BANNER_CONFIG.LEGACY_STORAGE_KEY)

  return expiresAt
}

/**
 * Clear banner dismissal (show banner immediately)
 */
export function clearBannerDismissal(): void {
  localStorage.removeItem(BANNER_CONFIG.STORAGE_KEY)
  localStorage.removeItem(BANNER_CONFIG.LEGACY_STORAGE_KEY)
}
