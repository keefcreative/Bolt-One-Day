# 🔧 Troubleshooting Guide

## Common Issues & Solutions

### 1. ❌ "ENOENT: no such file or directory, scandir './data'"

**Problem:** The system can't find your content files.

**Solution:**
```bash
# Use explicit path
npm run analyze ../data

# Or if running directly
node content_analyzer.js ../data
```

**Permanent Fix:** The scripts are now updated to use `../data` by default.

---

### 2. ❌ Low Brand Voice Scores (44.8% average)

**Problem:** Content doesn't match brand guidelines.

**Solution:**
```bash
# 1. Review specific issues
npm run review:preview

# 2. Apply AI improvements
npm run enhance

# 3. Run complete workflow
npm run workflow
```

**Expected:** After AI enhancement, scores should reach 80%+

---

### 3. ❌ API Key Errors

**Problem:** "API key not found" or authentication errors.

**Solution:**
1. Check `.env.local` exists in **parent directory** (not Content Script)
2. Verify format:
```env
OPENAI_API_KEY=sk-proj-...
FREEPIK_API_KEY=FPSXba...
REPLICATE_API_TOKEN=r8_...
```

3. Test connection:
```bash
node assistant_content_improver.js test
```

---

### 4. ❌ Module Import Errors

**Problem:** "Cannot use import statement" or similar.

**Solution:** Ensure `package.json` has:
```json
{
  "type": "module"
}
```

---

### 5. ❌ Text Rendering Issues in Images

**Problem:** AI-generated images have gibberish text.

**Solution:**
```bash
# Use Freepik with DALL-E 3 (better text)
node freepik_client.js generate "your prompt" 

# Or search stock photos (real text)
node freepik_client.js search "laptop mockup"
```

---

### 6. ❌ Reports Not Opening

**Problem:** HTML reports don't open automatically.

**Solution:**
```bash
# Manual open on Mac
open reports/analysis.html

# Windows
start reports/analysis.html

# Linux
xdg-open reports/analysis.html
```

---

### 7. ❌ "Command not found" Errors

**Problem:** npm scripts not working.

**Solution:**
```bash
# Reinstall dependencies
npm install

# Check Node version (need 18+)
node --version

# Use direct commands
node content_analyzer.js ../data
```

---

### 8. ❌ Assistant Not Responding

**Problem:** OpenAI Assistant timing out or wrong responses.

**Solution:**
1. Verify Assistant ID in `.env.local`:
```env
OPENAI_BRANDVOICE_ASSISTANT_ID=asst_0GsBgIUHApbshi9n1SSBISKg
```

2. Test directly:
```bash
node assistant_content_improver.js test
```

3. Fall back to direct GPT-4:
```bash
node ai_content_improver.js
```

---

## 🚀 Quick Fixes

### Reset Everything
```bash
# Clean all generated files
npm run clean

# Remove node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Test System Health
```bash
# Run system test
npm test

# Should output:
# ✅ System check...
# ✅ All systems operational
```

### Get Help
```bash
# Show all commands
npm run help

# Check documentation
cat README.md
cat USER_GUIDE.md
```

---

## 📊 Expected Performance

After proper setup, you should see:

| Metric | Expected Value |
|--------|---------------|
| Brand Voice Score | 80-90% |
| Analysis Time | 5-10 seconds |
| AI Enhancement | 30-60 seconds |
| Image Generation | 5-30 seconds |
| Workflow Complete | 2-3 minutes |

---

## 🆘 Still Having Issues?

1. **Check logs:** Look for error details in console output
2. **Verify paths:** Ensure all file paths are correct
3. **Test components:** Run each part separately to isolate issues
4. **Review config:** Double-check `brand_voice_config.json`
5. **Contact support:** team@designworks.com

---

*Last updated: 2025-08-28*