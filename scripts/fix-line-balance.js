/**
 * Fix Line Balance Script
 *
 * Removes nbsp entities and adds strategic <br /> tags for proper line balance
 * Uses CSS text-wrap: balance for modern browsers and manual breaks for critical text
 */

const fs = require('fs');
const path = require('path');

/**
 * Add strategic line breaks to prevent widows and balance lines
 * @param {string} text - Text to process
 * @returns {string} - Text with optimized line breaks
 */
function balanceLines(text) {
  if (!text || typeof text !== 'string') return text;

  // Skip if already has HTML tags or is very short
  if (text.includes('<br') || text.length < 40) {
    return text;
  }

  const words = text.split(' ');
  const wordCount = words.length;

  // For headlines (shorter text, fewer words)
  if (wordCount <= 10 && text.length < 80) {
    // Find middle point and add break
    if (wordCount >= 4) {
      const midPoint = Math.floor(wordCount / 2);
      return words.slice(0, midPoint).join(' ') + '<br />' +
             words.slice(midPoint).join(' ');
    }
    return text;
  }

  // For descriptions (longer text)
  if (wordCount > 10) {
    // Only add break if it would prevent a widow (single word on last line)
    // Estimate: ~8-10 words per line on average
    const estimatedLines = Math.ceil(wordCount / 9);
    const wordsOnLastLine = wordCount % 9;

    // If last line would have 1-2 words, pull more words down
    if (wordsOnLastLine > 0 && wordsOnLastLine <= 2 && wordCount > 15) {
      const breakPoint = wordCount - 5; // Pull 3 extra words to last line
      return words.slice(0, breakPoint).join(' ') + '<br />' +
             words.slice(breakPoint).join(' ');
    }
  }

  return text;
}

/**
 * Remove nbsp entities and clean text
 * @param {string} text - Text to clean
 * @returns {string} - Cleaned text
 */
function removeNbsp(text) {
  if (!text || typeof text !== 'string') return text;
  return text.replace(/&nbsp;/g, ' ');
}

/**
 * Process a JSON object recursively
 * @param {*} obj - Object to process
 * @returns {*} - Processed object
 */
function processObject(obj, isHeadline = false) {
  if (typeof obj === 'string') {
    let cleaned = removeNbsp(obj);
    // Only add breaks to specific fields, not URLs or short labels
    if (cleaned.length > 30 && !cleaned.startsWith('http') && !cleaned.startsWith('#')) {
      return balanceLines(cleaned);
    }
    return cleaned;
  }

  if (Array.isArray(obj)) {
    return obj.map(item => processObject(item));
  }

  if (obj && typeof obj === 'object') {
    const processed = {};
    for (const [key, value] of Object.entries(obj)) {
      // Skip URLs and technical fields
      if (['href', 'url', 'src', 'alt', 'stripePriceId', 'image', 'avatar', 'icon'].includes(key)) {
        processed[key] = typeof value === 'string' ? removeNbsp(value) : value;
      }
      // Process headlines differently
      else if (['title', 'eyebrow'].includes(key)) {
        processed[key] = processObject(value, true);
      }
      // Process descriptions and other text
      else {
        processed[key] = processObject(value, false);
      }
    }
    return processed;
  }

  return obj;
}

/**
 * Process a JSON file
 * @param {string} filePath - Path to JSON file
 */
function processJsonFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(content);

    const processed = processObject(data);

    // Write back with pretty formatting
    fs.writeFileSync(filePath, JSON.stringify(processed, null, 2) + '\n', 'utf8');

    console.log(`✅ Processed: ${path.relative(process.cwd(), filePath)}`);
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
  }
}

/**
 * Recursively find all JSON files in a directory
 * @param {string} dir - Directory to search
 * @param {string[]} files - Accumulator for file paths
 * @returns {string[]} - Array of JSON file paths
 */
function findJsonFiles(dir, files = []) {
  const items = fs.readdirSync(dir);

  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      // Skip node_modules, .git, etc.
      if (!item.startsWith('.') && item !== 'node_modules' && item !== 'backups') {
        findJsonFiles(fullPath, files);
      }
    } else if (item.endsWith('.json') && !item.includes('package')) {
      files.push(fullPath);
    }
  }

  return files;
}

// Main execution
const dataDir = path.join(__dirname, '..', 'data');

console.log('🔍 Finding JSON files in', dataDir);
const jsonFiles = findJsonFiles(dataDir);

console.log(`\n📝 Processing ${jsonFiles.length} files...\n`);

jsonFiles.forEach(file => processJsonFile(file));

console.log('\n✨ Done! All JSON files have been processed.');
console.log('\n💡 Line balance strategy:');
console.log('   • Removed &nbsp; entities (using CSS text-balance instead)');
console.log('   • Added strategic <br /> tags for headlines and long descriptions');
console.log('   • CSS utilities (.text-balance, .text-pretty) will handle the rest');
console.log('\n📋 Review changes with: git diff data/');