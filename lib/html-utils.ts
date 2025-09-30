/**
 * HTML Entity Utilities
 *
 * Helper functions for safely rendering HTML entities in React components
 */

/**
 * Decode HTML entities in a string
 * @param text - Text containing HTML entities
 * @returns Decoded text
 */
export const decodeHtmlEntities = (text: string): string => {
  if (!text || typeof text !== 'string') return text;

  // Create a temporary element to decode entities
  if (typeof document !== 'undefined') {
    const textarea = document.createElement('textarea');
    textarea.innerHTML = text;
    return textarea.value;
  }

  // Fallback for server-side rendering
  return text
    .replace(/&nbsp;/g, '\u00A0')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
};

/**
 * Create props for rendering text with HTML entities
 * Use this when you need to display text that contains &nbsp; or other entities
 * @param text - Text with HTML entities
 * @returns Props object with dangerouslySetInnerHTML
 */
export const htmlProps = (text: string) => {
  if (!text) return {};
  return {
    dangerouslySetInnerHTML: { __html: text }
  };
};

/**
 * Safe text component wrapper
 * Renders text with HTML entities properly decoded
 */
export const renderText = (text: string): string => {
  if (!text) return '';
  return decodeHtmlEntities(text);
};