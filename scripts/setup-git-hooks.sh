#!/bin/bash

# Setup Git Hooks for Content Validation
# Installs git hooks to validate content before commits

set -e

echo "🔗 Setting up Git hooks for content validation..."

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Check if we're in a git repository
if [ ! -d ".git" ]; then
    echo "❌ Not in a git repository. Please run this from the project root."
    exit 1
fi

# Create git hooks directory if it doesn't exist
mkdir -p .git/hooks

# Install pre-commit hook
PRE_COMMIT_HOOK=".git/hooks/pre-commit"

echo "📝 Installing pre-commit hook..."

cat > "$PRE_COMMIT_HOOK" << 'EOF'
#!/bin/bash

# Git pre-commit hook for content validation
# Automatically runs content validation before commits

# Run the content validation script
./scripts/pre-commit-content-check.sh

# Exit with the same code as the validation script
exit $?
EOF

# Make hook executable
chmod +x "$PRE_COMMIT_HOOK"

# Install pre-push hook (optional - more thorough validation)
PRE_PUSH_HOOK=".git/hooks/pre-push"

echo "📤 Installing pre-push hook..."

cat > "$PRE_PUSH_HOOK" << 'EOF'
#!/bin/bash

# Git pre-push hook for comprehensive content validation
# Runs more thorough validation before pushing to remote

echo "🚀 Running comprehensive content validation before push..."

# Check if content system is available and run full validation
if [ -d "content-improver" ]; then
    echo "🔍 Running full content analysis..."
    
    # Run a quick workflow check
    if npm run content:status --silent; then
        echo "✅ Content system status OK"
    else
        echo "⚠️ Content system status warnings - push proceeding anyway"
    fi
fi

# Run pre-build validation (without failing)
if node scripts/pre-build-content-validation.js 2>/dev/null; then
    echo "✅ Pre-build validation passed"
else
    echo "⚠️ Pre-build validation had issues - consider running content improvements"
    echo "To improve content: npm run content:workflow"
fi

echo "🎯 Push validation completed"
exit 0
EOF

# Make hook executable
chmod +x "$PRE_PUSH_HOOK"

# Create commit-msg hook for commit message validation
COMMIT_MSG_HOOK=".git/hooks/commit-msg"

echo "💬 Installing commit-msg hook..."

cat > "$COMMIT_MSG_HOOK" << 'EOF'
#!/bin/bash

# Git commit-msg hook
# Validates commit message format and adds content-related tags

COMMIT_MSG_FILE=$1
COMMIT_MSG=$(cat "$COMMIT_MSG_FILE")

# Check if this is a content-related commit
DATA_CHANGES=$(git diff --cached --name-only | grep '^data/' || true)

if [ -n "$DATA_CHANGES" ]; then
    # Add content tag if not already present
    if ! echo "$COMMIT_MSG" | grep -q "\[content\]"; then
        # Prepend [content] tag to commit message
        echo "[content] $COMMIT_MSG" > "$COMMIT_MSG_FILE"
    fi
fi

exit 0
EOF

# Make hook executable
chmod +x "$COMMIT_MSG_HOOK"

# Summary
echo ""
echo -e "${GREEN}✅ Git hooks installed successfully!${NC}"
echo ""
echo "📋 Installed hooks:"
echo "  • pre-commit: Validates content before commits"
echo "  • pre-push: Runs comprehensive validation before pushes"
echo "  • commit-msg: Adds content tags to relevant commits"
echo ""
echo "🎯 Usage:"
echo "  • Hooks run automatically with git commands"
echo "  • To bypass validation: git commit --no-verify"
echo "  • To test hooks manually: ./scripts/pre-commit-content-check.sh"
echo ""
echo -e "${YELLOW}💡 Tip: Run 'npm run content:workflow' regularly to maintain content quality${NC}"