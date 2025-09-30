/**
 * Typography Helper Utilities
 *
 * Provides smart text processing for better line balance, preventing widows/orphans,
 * and ensuring minimum word counts per line for optimal readability.
 */

/**
 * Balance text by adding non-breaking spaces and processing markdown
 * @param text - The text to balance
 * @returns HTML string with balanced text
 */
export const balanceText = (text: string): string => {
  if (!text) return '';

  // Convert markdown bold to HTML with extrabold styling (using inline style to ensure it works with JIT)
  text = text.replace(/\*\*(.*?)\*\*/g, '<strong style="font-weight: 800;">$1</strong>');

  // Add non-breaking spaces before short prepositions and articles to prevent orphans
  // Common short words that should stay with the following word
  const shortWords = /\s(a|an|the|of|in|on|at|to|for|and|or|but|if|by|as)\s/gi;
  text = text.replace(shortWords, '&nbsp;$1 ');

  // Prevent single-word last lines in sentences by keeping last 2 words together
  text = text.replace(/(\w+)\s+(\w+)([.!?])/g, '$1&nbsp;$2$3');

  // Keep short ending words (3 chars or less) with previous word
  text = text.replace(/\s(\w{1,3})([.!?,;:])/g, '&nbsp;$1$2');

  return text;
};

/**
 * Apply smart line breaks based on target character count per line
 * Prevents widows and ensures balanced line lengths
 * @param text - The text to process
 * @param maxCharsPerLine - Target maximum characters per line (default: 65)
 * @param minWordsLastLine - Minimum words required on last line (default: 3)
 * @returns HTML string with optimized line breaks
 */
export const smartBreaks = (
  text: string,
  maxCharsPerLine: number = 65,
  minWordsLastLine: number = 3
): string => {
  if (!text) return '';

  const words = text.split(' ');
  if (words.length <= minWordsLastLine) return text; // Too short to break

  let lines: string[] = [];
  let currentLine = '';

  words.forEach((word, index) => {
    const testLine = currentLine + (currentLine ? ' ' : '') + word;
    const isLastWord = index === words.length - 1;
    const wordsRemaining = words.length - index;

    // If adding this word exceeds max chars and we have content in current line
    if (testLine.length > maxCharsPerLine && currentLine) {
      // Check if we'd create an orphan (last line with too few words)
      if (wordsRemaining <= minWordsLastLine) {
        // Pull back one word from current line to balance last line
        const lineWords = currentLine.split(' ');
        if (lineWords.length > minWordsLastLine) {
          const lastWord = lineWords.pop();
          lines.push(lineWords.join(' '));
          currentLine = lastWord + ' ' + word;
        } else {
          lines.push(currentLine);
          currentLine = word;
        }
      } else {
        lines.push(currentLine);
        currentLine = word;
      }
    } else {
      currentLine = testLine;
    }

    // Add final line
    if (isLastWord && currentLine) {
      lines.push(currentLine);
    }
  });

  return lines.join('<br />');
};

/**
 * Process text for headlines - ensures balanced multi-line headlines
 * with no single-word lines
 * @param text - Headline text
 * @param maxCharsPerLine - Target characters per line (default: 35 for headlines)
 * @returns HTML string with balanced headline
 */
export const balanceHeadline = (text: string, maxCharsPerLine: number = 35): string => {
  if (!text) return '';

  // IMPORTANT: If text already contains manual line breaks, preserve them
  if (text.includes('<br />') || text.includes('<br>')) {
    // Just apply basic text balancing to each line separately
    return text.split(/<br\s*\/?>/gi).map(line => balanceText(line.trim())).join('<br />');
  }

  // For headlines, be more aggressive about balance
  const words = text.split(' ');

  // If short enough for one line, return as-is
  if (text.length <= maxCharsPerLine) return text;

  // If only 2 words, keep together
  if (words.length === 2) return words.join('&nbsp;');

  // Find optimal break point closest to middle
  const targetLength = text.length / 2;
  let bestBreakIndex = 0;
  let bestDifference = Infinity;
  let currentLength = 0;

  words.forEach((word, index) => {
    if (index === 0) {
      currentLength = word.length;
    } else {
      currentLength += word.length + 1; // +1 for space
    }

    const difference = Math.abs(currentLength - targetLength);
    if (difference < bestDifference && index > 0 && index < words.length - 1) {
      bestDifference = difference;
      bestBreakIndex = index;
    }
  });

  // If we found a good break point, use it
  if (bestBreakIndex > 0) {
    const line1 = words.slice(0, bestBreakIndex + 1).join(' ');
    const line2 = words.slice(bestBreakIndex + 1).join(' ');

    // Ensure line2 isn't a single short word
    const line2Words = line2.split(' ');
    if (line2Words.length === 1 && line2Words[0].length < 4) {
      // Pull one more word to second line
      return words.slice(0, bestBreakIndex).join(' ') + '<br />' +
             words.slice(bestBreakIndex).join('&nbsp;');
    }

    return line1 + '<br />' + line2;
  }

  // Fallback: use character-based smart breaks
  return smartBreaks(text, maxCharsPerLine, 2);
};

/**
 * Process description text - optimized for short descriptive paragraphs
 * @param text - Description text
 * @returns HTML string with balanced description
 */
export const balanceDescription = (text: string): string => {
  if (!text) return '';

  // IMPORTANT: If text already contains manual line breaks, preserve them
  if (text.includes('<br />') || text.includes('<br>')) {
    // Just apply basic text balancing to each line separately
    return text.split(/<br\s*\/?>/gi).map(line => balanceText(line.trim())).join('<br />');
  }

  // Apply basic balance with non-breaking spaces
  let balanced = balanceText(text);

  // If text is long enough, apply smart breaks
  if (text.length > 120) {
    balanced = smartBreaks(text, 55, 4);
  }

  return balanced;
};

/**
 * Count words in a text string
 * @param text - Text to count words in
 * @returns Number of words
 */
export const countWords = (text: string): number => {
  if (!text) return 0;
  return text.trim().split(/\s+/).length;
};

/**
 * Check if text has potential widow/orphan issues
 * @param text - Text to check
 * @returns Object with analysis
 */
export const analyzeLineBalance = (text: string): {
  hasIssues: boolean;
  wordCount: number;
  estimatedLines: number;
  recommendation: string;
} => {
  const wordCount = countWords(text);
  const avgCharsPerLine = 60;
  const estimatedLines = Math.ceil(text.length / avgCharsPerLine);
  const wordsPerLine = wordCount / estimatedLines;

  let hasIssues = false;
  let recommendation = 'Text balance looks good';

  if (wordsPerLine < 3) {
    hasIssues = true;
    recommendation = 'Consider shortening to reduce single-word lines';
  } else if (wordCount % estimatedLines === 1) {
    hasIssues = true;
    recommendation = 'Likely to have a widow (single word on last line)';
  }

  return {
    hasIssues,
    wordCount,
    estimatedLines,
    recommendation,
  };
};