#!/bin/bash

# Pre-commit Content Validation Hook
# Validates content quality before allowing commits to data files

set -e

echo "🔍 Running content validation checks..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if content system is available
if [ ! -d "content-improver" ]; then
    echo -e "${YELLOW}⚠️ Content-improver system not found. Skipping content validation.${NC}"
    exit 0
fi

# Check for changes in data directory
DATA_CHANGES=$(git diff --cached --name-only | grep '^data/' || true)

if [ -z "$DATA_CHANGES" ]; then
    echo "✅ No data file changes detected. Skipping content validation."
    exit 0
fi

echo "📄 Data files changed:"
echo "$DATA_CHANGES" | sed 's/^/  /'

# Initialize shared configuration
echo "🔧 Initializing content system configuration..."
if command -v node >/dev/null 2>&1; then
    node -e "
        try {
            const { initializeSharedConfig } = require('./lib/shared-config.ts');
            initializeSharedConfig().then(() => {
                console.log('✅ Configuration initialized');
            }).catch(err => {
                console.warn('⚠️ Configuration warning:', err.message);
            });
        } catch (err) {
            console.warn('⚠️ Could not initialize config:', err.message);
        }
    " 2>/dev/null || echo "⚠️ Could not initialize configuration"
fi

# Run quick quality check
echo "📊 Running quick quality check..."
QUALITY_CHECK_RESULT=""
if npm run content:quality --silent 2>/dev/null; then
    QUALITY_CHECK_RESULT="passed"
    echo -e "${GREEN}✅ Quick quality check passed${NC}"
else
    QUALITY_CHECK_RESULT="failed"
    echo -e "${YELLOW}⚠️ Quality check had warnings${NC}"
fi

# Validate specific changed files
echo "🔍 Validating changed files..."
ERROR_COUNT=0

# Create temporary file list
TEMP_FILE_LIST=$(mktemp)
echo "$DATA_CHANGES" > "$TEMP_FILE_LIST"

while IFS= read -r file; do
    if [ -f "$file" ]; then
        echo "  Checking $file..."
        
        # Basic JSON validation
        if [[ "$file" == *.json ]]; then
            if ! python3 -m json.tool "$file" >/dev/null 2>&1; then
                echo -e "${RED}❌ Invalid JSON: $file${NC}"
                ERROR_COUNT=$((ERROR_COUNT + 1))
            fi
        fi
        
        # Check for common issues
        if grep -q "TODO\|FIXME\|XXX" "$file" 2>/dev/null; then
            echo -e "${YELLOW}⚠️ Contains TODO/FIXME markers: $file${NC}"
        fi
        
        # Check file size (warn if over 1MB)
        FILE_SIZE=$(wc -c < "$file" 2>/dev/null || echo "0")
        if [ "$FILE_SIZE" -gt 1048576 ]; then
            echo -e "${YELLOW}⚠️ Large file ($(echo "scale=1; $FILE_SIZE/1024/1024" | bc 2>/dev/null || echo ">1")MB): $file${NC}"
        fi
    fi
done < "$TEMP_FILE_LIST"

rm -f "$TEMP_FILE_LIST"

# Run content system validation if available
if [ -f "content-improver/package.json" ]; then
    echo "🤖 Running content system validation..."
    
    cd content-improver
    if npm run test --silent 2>/dev/null; then
        echo -e "${GREEN}✅ Content system validation passed${NC}"
    else
        echo -e "${YELLOW}⚠️ Content system validation had warnings${NC}"
    fi
    cd ..
fi

# Summary
echo ""
echo "📋 Validation Summary:"
if [ "$ERROR_COUNT" -eq 0 ]; then
    echo -e "${GREEN}✅ All validation checks passed${NC}"
    echo "🚀 Commit can proceed"
    exit 0
else
    echo -e "${RED}❌ $ERROR_COUNT error(s) found${NC}"
    echo -e "${RED}🚫 Commit blocked due to validation errors${NC}"
    echo ""
    echo "To override this check (not recommended):"
    echo "  git commit --no-verify"
    echo ""
    echo "To fix issues:"
    echo "  npm run content:analyze"
    echo "  npm run content:improve"
    exit 1
fi