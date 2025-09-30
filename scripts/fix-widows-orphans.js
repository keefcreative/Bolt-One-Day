/**
 * Fix Widows & Orphans Script
 *
 * Automatically adds non-breaking spaces to JSON content files
 * to prevent single-word lines (widows/orphans).
 */

const fs = require('fs');
const path = require('path');

/**
 * Add non-breaking spaces to prevent widows
 * @param {string} text - Text to process
 * @returns {string} - Text with non-breaking spaces
 */
function fixWidowsOrphans(text) {
  if (!text || typeof text !== 'string') return text;

  // Don't process if already has HTML tags (except <br />)
  if (text.includes('<') && !text.match(/^[^<]*(<br\s*\/?>)?[^<]*$/)) {
    return text;
  }

  let processed = text;

  // 1. Keep last 2-3 words of sentences together
  processed = processed.replace(/(\w+)\s+(\w+)\s+(\w+)([.!?])/g, '$1 $2&nbsp;$3$4');

  // 2. Keep short words (articles, prepositions) with following word
  const shortWords = ['a', 'an', 'the', 'of', 'in', 'on', 'at', 'to', 'for', 'and', 'or', 'but', 'if', 'by', 'as', 'is', 'it', 'be'];
  shortWords.forEach(word => {
    // Word at start or after space
    const regex = new RegExp(`(^|\\s)(${word})\\s+`, 'gi');
    processed = processed.replace(regex, '$1$2&nbsp;');
  });

  // 3. Keep short ending words (3 chars or less) with previous word
  processed = processed.replace(/\s+(\w{1,3})([.!?,;:])/g, '&nbsp;$1$2');

  // 4. Keep numbers with their units
  processed = processed.replace(/(\d+)\s+(hours?|days?|weeks?|months?|years?|%|mins?|secs?)/gi, '$1&nbsp;$2');

  return processed;
}

/**
 * Process a JSON object recursively
 * @param {*} obj - Object to process
 * @returns {*} - Processed object
 */
function processObject(obj) {
  if (typeof obj === 'string') {
    return fixWidowsOrphans(obj);
  }

  if (Array.isArray(obj)) {
    return obj.map(item => processObject(item));
  }

  if (obj && typeof obj === 'object') {
    const processed = {};
    for (const [key, value] of Object.entries(obj)) {
      // Skip certain keys that shouldn't be processed
      if (['href', 'url', 'src', 'alt', 'stripePriceId', 'image', 'avatar', 'icon'].includes(key)) {
        processed[key] = value;
      } else {
        processed[key] = processObject(value);
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

console.log('\n✨ Done! All JSON files have been processed for widow/orphan prevention.');
console.log('\n💡 Tip: Review the changes with git diff before committing.');