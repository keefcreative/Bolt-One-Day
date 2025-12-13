/**
 * Scroll Utilities
 * Centralized scroll functions with dynamic header offset calculation
 */

/**
 * Calculates total fixed header height (banner + navigation)
 * Accounts for campaign banner presence dynamically
 */
export function getHeaderHeight(): number {
  // Check for campaign banner
  const hasBanner = document.documentElement.classList.contains('has-banner')
  const bannerHeight = hasBanner ? 50 : 0

  // Navigation height (check actual element if possible)
  const navElement = document.querySelector('nav')
  const navHeight = navElement?.offsetHeight || 80 // Fallback to 80px

  return bannerHeight + navHeight
}

/**
 * Smooth scroll to element with dynamic offset
 * @param selector - CSS selector for target element
 * @param additionalOffset - Optional extra offset (default: 20px for breathing room)
 */
export function scrollToElement(selector: string, additionalOffset: number = 20): void {
  const element = document.querySelector(selector)
  if (!element) {
    console.warn(`scrollToElement: Element not found for selector "${selector}"`)
    return
  }

  const headerHeight = getHeaderHeight()
  const elementPosition = element.getBoundingClientRect().top + window.pageYOffset
  const offsetPosition = elementPosition - headerHeight - additionalOffset

  window.scrollTo({
    top: Math.max(0, offsetPosition), // Prevent negative scroll
    behavior: 'smooth'
  })
}

/**
 * Scroll to top of page (useful for page transitions)
 */
export function scrollToTop(): void {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

/**
 * Check if element is in viewport
 * @param element - DOM element to check
 * @param offset - Optional offset from top (default: header height)
 */
export function isInViewport(element: Element, offset?: number): boolean {
  const rect = element.getBoundingClientRect()
  const headerHeight = offset ?? getHeaderHeight()

  return (
    rect.top >= headerHeight &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  )
}
