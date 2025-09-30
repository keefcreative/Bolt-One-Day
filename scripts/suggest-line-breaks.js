/**
 * Suggest Line Breaks Script
 *
 * Analyzes JSON content and suggests where to add <br /> tags
 * for better line balance and to prevent widows/orphans
 */

const fs = require('fs');
const path = require('path');

/**
 * Analyze text and suggest line break placement
 * @param {string} text - Text to analyze
 * @param {string} fieldName - Name of the field
 * @returns {Object} - Analysis and suggestion
 */
function analyzeText(text, fieldName) {
  if (!text || typeof text !== 'string' || text.includes('<br')) {
    return null;
  }

  const words = text.split(' ');
  const wordCount = words.length;
  const charCount = text.length;

  // Skip very short text
  if (wordCount < 4 || charCount < 30) {
    return null;
  }

  const analysis = {
    original: text,
    wordCount,
    charCount,
    issue: null,
    suggestion: null
  };

  // Check for potential widow (would create single word on last line)
  const avgWordsPerLine = fieldName.includes('title') || fieldName.includes('eyebrow') ? 6 : 12;
  const estimatedLines = Math.ceil(wordCount / avgWordsPerLine);
  const wordsOnLastLine = wordCount % avgWordsPerLine;

  if (wordsOnLastLine === 1) {
    analysis.issue = 'Likely WIDOW - single word on last line';
    // Suggest breaking to balance lines
    const midPoint = Math.floor(wordCount / 2);
    analysis.suggestion =
      words.slice(0, midPoint).join(' ') + '<br />' +
      words.slice(midPoint).join(' ');
  } else if (wordsOnLastLine === 2 && wordCount > 8) {
    analysis.issue = 'Possible SHORT LAST LINE - 2 words';
    const breakPoint = wordCount - 4;
    analysis.suggestion =
      words.slice(0, breakPoint).join(' ') + '<br />' +
      words.slice(breakPoint).join(' ');
  } else if (fieldName.includes('title') && charCount > 50 && !text.includes('<br')) {
    analysis.issue = 'LONG HEADLINE - could benefit from break';
    const midPoint = Math.floor(wordCount / 2);
    analysis.suggestion =
      words.slice(0, midPoint).join(' ') + '<br />' +
      words.slice(midPoint).join(' ');
  }

  return analysis.issue ? analysis : null;
}

/**
 * Process JSON file and report issues
 * @param {string} filePath - Path to JSON file
 * @param {Array} issues - Array to collect issues
 */
function analyzeJsonFile(filePath, issues = []) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(content);

    const relativePath = path.relative(process.cwd(), filePath);

    function traverse(obj, path = '') {
      if (typeof obj === 'string') {
        const analysis = analyzeText(obj, path);
        if (analysis) {
          issues.push({
            file: relativePath,
            field: path,
            ...analysis
          });
        }
      } else if (Array.isArray(obj)) {
        obj.forEach((item, index) => traverse(item, `${path}[${index}]`));
      } else if (obj && typeof obj === 'object') {
        Object.entries(obj).forEach(([key, value]) => {
          const newPath = path ? `${path}.${key}` : key;
          traverse(value, newPath);
        });
      }
    }

    traverse(data);
  } catch (error) {
    console.error(`❌ Error analyzing ${filePath}:`, error.message);
  }
}

/**
 * Recursively find all JSON files
 */
function findJsonFiles(dir, files = []) {
  const items = fs.readdirSync(dir);

  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
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

console.log('🔍 Analyzing JSON files for widow/orphan issues...\n');

const jsonFiles = findJsonFiles(dataDir);
const issues = [];

jsonFiles.forEach(file => analyzeJsonFile(file, issues));

// Sort by severity
issues.sort((a, b) => {
  const severityOrder = { 'WIDOW': 0, 'SHORT LAST LINE': 1, 'LONG HEADLINE': 2 };
  const aSeverity = a.issue.includes('WIDOW') ? 0 : a.issue.includes('SHORT') ? 1 : 2;
  const bSeverity = b.issue.includes('WIDOW') ? 0 : b.issue.includes('SHORT') ? 1 : 2;
  return aSeverity - bSeverity;
});

if (issues.length === 0) {
  console.log('✅ No widow/orphan issues found! Your content has good line balance.');
} else {
  console.log(`⚠️  Found ${issues.length} potential issues:\n`);

  issues.forEach((issue, index) => {
    console.log(`${index + 1}. ${issue.file}`);
    console.log(`   Field: ${issue.field}`);
    console.log(`   Issue: ${issue.issue}`);
    console.log(`   Current: "${issue.original}"`);
    console.log(`   Suggested: "${issue.suggestion}"`);
    console.log();
  });

  console.log('\n💡 To fix these issues:');
  console.log('   1. Copy the suggested text');
  console.log('   2. Replace the original text in the JSON file');
  console.log('   3. The <br /> tag will force a line break at that point');
  console.log('\n📝 Components already support <br /> tags via dangerouslySetInnerHTML');
}