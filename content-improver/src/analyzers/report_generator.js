#!/usr/bin/env node

/**
 * Report Generator Module
 * Generates comprehensive reports in multiple formats (HTML, Markdown, JSON, Console)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateHTMLReport, generateMarkdownReport } from './report_templates.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

class ReportGenerator {
  constructor() {
    this.reportDir = './reports';
    this.ensureReportDir();
  }

  ensureReportDir() {
    if (!fs.existsSync(this.reportDir)) {
      fs.mkdirSync(this.reportDir, { recursive: true });
    }
  }

  // Generate comprehensive report from analysis data
  generateReport(analysisData, format = 'console', outputPath = null) {
    const timestamp = new Date().toISOString();
    const reportData = {
      ...analysisData,
      timestamp,
      generatedBy: 'DesignWorks Bureau Content Analysis System'
    };

    let report;
    switch (format.toLowerCase()) {
      case 'html':
        report = this.generateEnhancedHTMLReport(reportData);
        break;
      case 'markdown':
      case 'md':
        report = this.generateEnhancedMarkdownReport(reportData);
        break;
      case 'json':
        report = JSON.stringify(reportData, null, 2);
        break;
      case 'detailed':
        report = this.generateDetailedConsoleReport(reportData);
        break;
      default:
        report = this.generateConsoleReport(reportData);
    }

    // Save to file if path provided
    if (outputPath) {
      const fullPath = path.resolve(outputPath);
      fs.writeFileSync(fullPath, report);
      console.log(`📄 Report saved to: ${fullPath}`);
    }

    return report;
  }

  // Generate detailed console report with better formatting
  generateDetailedConsoleReport(data) {
    const lines = [];
    const hr = '━'.repeat(80);
    const subhr = '─'.repeat(60);
    
    // Header
    lines.push('');
    lines.push(hr);
    lines.push('📊 BRAND VOICE ANALYSIS REPORT');
    lines.push(`Generated: ${new Date(data.timestamp).toLocaleString()}`);
    lines.push(hr);
    
    // Executive Summary
    lines.push('\n🎯 EXECUTIVE SUMMARY');
    lines.push(subhr);
    
    const summary = this.generateExecutiveSummary(data);
    lines.push(`├─ Files Analyzed: ${summary.filesAnalyzed}`);
    lines.push(`├─ Overall Score: ${summary.overallScore}% ${summary.scoreEmoji}`);
    lines.push(`├─ Critical Issues: ${summary.criticalIssues}`);
    lines.push(`├─ Estimated Time to Fix: ${summary.estimatedTime}`);
    lines.push(`└─ Priority Actions: ${summary.priorityActions}`);
    
    // Voice Pillar Breakdown
    if (data.voiceConsistency?.pillarBreakdown) {
      lines.push('\n📍 VOICE PILLAR BREAKDOWN');
      lines.push(subhr);
      
      Object.entries(data.voiceConsistency.pillarBreakdown).forEach(([pillar, score], index, arr) => {
        const isLast = index === arr.length - 1;
        const prefix = isLast ? '└─' : '├─';
        const scorePercent = (score * 100).toFixed(0);
        const bar = this.generateProgressBar(score, 20);
        const needs = this.getPillarNeeds(pillar, score);
        lines.push(`${prefix} ${this.capitalize(pillar)}: ${scorePercent}% ${bar} ${needs}`);
      });
    }
    
    // Content Type Analysis
    if (data.contentTypes) {
      lines.push('\n📁 CONTENT TYPES ANALYZED');
      lines.push(subhr);
      
      const types = Object.entries(data.contentTypes);
      types.forEach(([type, count], index) => {
        const isLast = index === types.length - 1;
        const prefix = isLast ? '└─' : '├─';
        lines.push(`${prefix} ${this.capitalize(type)}: ${count} files`);
      });
    }
    
    // File-by-File Breakdown
    if (data.fileAnalysis) {
      lines.push('\n📄 FILE-BY-FILE ANALYSIS');
      lines.push(subhr);
      
      // Sort files by score (lowest first)
      const sortedFiles = Object.entries(data.fileAnalysis)
        .sort((a, b) => a[1].score - b[1].score)
        .slice(0, 10); // Show worst 10
      
      sortedFiles.forEach(([filename, fileData], index) => {
        const isLast = index === sortedFiles.length - 1;
        const prefix = isLast ? '└─' : '├─';
        
        lines.push(`${prefix} ${filename}`);
        lines.push(`   ├─ Score: ${(fileData.score * 100).toFixed(1)}% ${this.getScoreEmoji(fileData.score)}`);
        
        if (fileData.issues && fileData.issues.length > 0) {
          lines.push(`   ├─ Issues:`);
          fileData.issues.slice(0, 3).forEach((issue, i) => {
            const issuePrefix = i === fileData.issues.length - 1 ? '└─' : '├─';
            lines.push(`   │  ${issuePrefix} ${issue}`);
          });
        }
        
        if (fileData.recommendations && fileData.recommendations.length > 0) {
          lines.push(`   └─ Top Recommendation: ${fileData.recommendations[0]}`);
        }
      });
    }
    
    // Jargon Analysis
    if (data.jargonAnalysis) {
      lines.push('\n🚫 JARGON DETECTED');
      lines.push(subhr);
      
      const jargonList = Object.entries(data.jargonAnalysis.terms);
      jargonList.forEach(([term, details], index) => {
        const isLast = index === jargonList.length - 1;
        const prefix = isLast ? '└─' : '├─';
        lines.push(`${prefix} "${term}" → "${details.replacement}"`);
        lines.push(`   Found in: ${details.files.join(', ')}`);
      });
    }
    
    // Priority Improvements
    lines.push('\n⭐ TOP PRIORITY IMPROVEMENTS');
    lines.push(subhr);
    
    const improvements = this.generatePriorityImprovements(data);
    improvements.forEach((improvement, index) => {
      lines.push(`\n${index + 1}. ${improvement.title}`);
      lines.push(`   Impact: ${improvement.impact} | Effort: ${improvement.effort}`);
      lines.push(`   ${improvement.description}`);
      if (improvement.affectedFiles) {
        lines.push(`   Files: ${improvement.affectedFiles.join(', ')}`);
      }
    });
    
    // Statistics
    lines.push('\n📈 DETAILED STATISTICS');
    lines.push(subhr);
    lines.push(`├─ Total Words Analyzed: ${data.totalWords?.toLocaleString() || 0}`);
    lines.push(`├─ Average Words per File: ${data.avgWordsPerFile || 0}`);
    lines.push(`├─ Files Below 80% Threshold: ${data.filesBelowThreshold || 0}`);
    lines.push(`├─ Total Issues Found: ${data.totalIssues || 0}`);
    lines.push(`└─ Total Suggestions: ${data.totalSuggestions || 0}`);
    
    // Footer
    lines.push('\n' + hr);
    lines.push('💡 NEXT STEPS:');
    lines.push('1. Run "npm run update:voice" to improve brand voice automatically');
    lines.push('2. Or use "node voice_review.js preview ../data" to review changes first');
    lines.push('3. Generate comparison report after updates to measure improvement');
    lines.push(hr);
    
    return lines.join('\n');
  }

  // Generate enhanced HTML report using templates
  generateEnhancedHTMLReport(data) {
    // Prepare data for template
    const reportData = {
      summary: this.generateExecutiveSummary(data),
      pillars: {},
      files: [],
      recommendations: this.generatePriorityImprovements(data)
    };

    // Process pillar data
    if (data.voiceConsistency?.pillarBreakdown) {
      Object.entries(data.voiceConsistency.pillarBreakdown).forEach(([pillar, score]) => {
        reportData.pillars[this.capitalize(pillar)] = score * 100;
      });
    }

    // Process file data
    if (data.fileAnalysis) {
      const sortedFiles = Object.entries(data.fileAnalysis)
        .sort((a, b) => a[1].score - b[1].score);
      
      sortedFiles.forEach(([filename, fileData]) => {
        reportData.files.push({
          name: filename,
          voiceConsistency: (fileData.score || 0) * 100,
          fieldsAnalyzed: fileData.fieldsAnalyzed || 0,
          jargonCount: fileData.jargonCount || 0,
          topIssues: fileData.issues || []
        });
      });
    }

    return generateHTMLReport(reportData);
  }

  // Generate enhanced Markdown report using templates
  generateEnhancedMarkdownReport(data) {
    // Prepare data for template
    const reportData = {
      summary: this.generateExecutiveSummary(data),
      pillars: {},
      files: [],
      recommendations: this.generatePriorityImprovements(data)
    };

    // Process pillar data
    if (data.voiceConsistency?.pillarBreakdown) {
      Object.entries(data.voiceConsistency.pillarBreakdown).forEach(([pillar, score]) => {
        reportData.pillars[this.capitalize(pillar)] = score * 100;
      });
    }

    // Process file data
    if (data.fileAnalysis) {
      const sortedFiles = Object.entries(data.fileAnalysis)
        .sort((a, b) => a[1].score - b[1].score);
      
      sortedFiles.forEach(([filename, fileData]) => {
        reportData.files.push({
          name: filename,
          voiceConsistency: (fileData.score || 0) * 100,
          fieldsAnalyzed: fileData.fieldsAnalyzed || 0,
          jargonCount: fileData.jargonCount || 0,
          topIssues: fileData.issues || []
        });
      });
    }

    // Add additional summary data
    reportData.summary.filesAnalyzed = data.filesAnalyzed || data.stats?.totalFiles || 0;
    reportData.summary.contentFieldsAnalyzed = data.totalFields || 0;
    reportData.summary.jargonCount = data.jargonAnalysis?.count || 0;
    reportData.summary.powerWordsUsed = data.powerWords?.count || 0;

    return generateMarkdownReport(reportData);
  }

  // Keep original HTML report method for backward compatibility
  generateHTMLReport(data) {
    const summary = this.generateExecutiveSummary(data);
    
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Brand Voice Analysis Report - ${new Date(data.timestamp).toLocaleDateString()}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #0A0A0A;
            background: #FAFAFA;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 2rem;
        }
        
        header {
            background: #0A0A0A;
            color: white;
            padding: 2rem 0;
            margin-bottom: 2rem;
        }
        
        h1 {
            font-size: 2.5rem;
            font-weight: 300;
            margin-bottom: 0.5rem;
        }
        
        .timestamp {
            opacity: 0.7;
            font-size: 0.9rem;
        }
        
        .summary-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 1.5rem;
            margin-bottom: 3rem;
        }
        
        .metric-card {
            background: white;
            padding: 1.5rem;
            border-left: 4px solid #FF6B35;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        .metric-label {
            font-size: 0.875rem;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            color: #666;
            margin-bottom: 0.5rem;
        }
        
        .metric-value {
            font-size: 2rem;
            font-weight: 300;
            color: #0A0A0A;
        }
        
        .score-badge {
            display: inline-block;
            padding: 0.25rem 0.75rem;
            border-radius: 0;
            font-size: 0.875rem;
            font-weight: 600;
        }
        
        .score-good { background: #10B981; color: white; }
        .score-warning { background: #F59E0B; color: white; }
        .score-poor { background: #EF4444; color: white; }
        
        .section {
            background: white;
            padding: 2rem;
            margin-bottom: 2rem;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        h2 {
            font-size: 1.75rem;
            font-weight: 300;
            margin-bottom: 1.5rem;
            padding-bottom: 0.75rem;
            border-bottom: 2px solid #F5F5F5;
        }
        
        .progress-bar {
            height: 24px;
            background: #F5F5F5;
            position: relative;
            overflow: hidden;
        }
        
        .progress-fill {
            height: 100%;
            background: linear-gradient(90deg, #FF6B35, #FF8F5C);
            transition: width 0.3s ease;
        }
        
        .progress-label {
            position: absolute;
            top: 50%;
            left: 1rem;
            transform: translateY(-50%);
            font-size: 0.875rem;
            font-weight: 600;
            color: white;
            mix-blend-mode: difference;
        }
        
        .pillar-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1rem;
            margin-top: 1.5rem;
        }
        
        .pillar-card {
            padding: 1rem;
            background: #FAFAFA;
            border-left: 3px solid #FF6B35;
        }
        
        .file-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 1rem;
        }
        
        .file-table th {
            background: #0A0A0A;
            color: white;
            padding: 0.75rem;
            text-align: left;
            font-weight: 500;
        }
        
        .file-table td {
            padding: 0.75rem;
            border-bottom: 1px solid #F5F5F5;
        }
        
        .file-table tr:hover {
            background: #FAFAFA;
        }
        
        .issue-list {
            list-style: none;
            margin-top: 1rem;
        }
        
        .issue-list li {
            padding: 0.75rem;
            background: #FFF5F5;
            border-left: 3px solid #EF4444;
            margin-bottom: 0.5rem;
        }
        
        .recommendation-list {
            list-style: none;
            margin-top: 1rem;
        }
        
        .recommendation-list li {
            padding: 0.75rem;
            background: #F0FDF4;
            border-left: 3px solid #10B981;
            margin-bottom: 0.5rem;
        }
        
        .cta-section {
            background: #0A0A0A;
            color: white;
            padding: 2rem;
            text-align: center;
            margin-top: 3rem;
        }
        
        .cta-button {
            display: inline-block;
            padding: 1rem 2rem;
            background: #FF6B35;
            color: white;
            text-decoration: none;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            margin: 0.5rem;
            transition: background 0.3s;
        }
        
        .cta-button:hover {
            background: #FF8F5C;
        }
    </style>
</head>
<body>
    <header>
        <div class="container">
            <h1>Brand Voice Analysis Report</h1>
            <div class="timestamp">Generated: ${new Date(data.timestamp).toLocaleString()}</div>
        </div>
    </header>
    
    <div class="container">
        <!-- Executive Summary -->
        <div class="summary-grid">
            <div class="metric-card">
                <div class="metric-label">Overall Score</div>
                <div class="metric-value">${summary.overallScore}%</div>
                <span class="score-badge ${summary.scoreClass}">${summary.scoreLabel}</span>
            </div>
            <div class="metric-card">
                <div class="metric-label">Files Analyzed</div>
                <div class="metric-value">${summary.filesAnalyzed}</div>
            </div>
            <div class="metric-card">
                <div class="metric-label">Critical Issues</div>
                <div class="metric-value">${summary.criticalIssues}</div>
            </div>
            <div class="metric-card">
                <div class="metric-label">Est. Time to Fix</div>
                <div class="metric-value">${summary.estimatedTime}</div>
            </div>
        </div>
        
        <!-- Voice Pillars -->
        <div class="section">
            <h2>Voice Pillar Analysis</h2>
            <div class="pillar-grid">
                ${this.generatePillarHTML(data.voiceConsistency?.pillarBreakdown || {})}
            </div>
        </div>
        
        <!-- File Analysis -->
        <div class="section">
            <h2>File-by-File Breakdown</h2>
            <table class="file-table">
                <thead>
                    <tr>
                        <th>File</th>
                        <th>Score</th>
                        <th>Content Type</th>
                        <th>Issues</th>
                        <th>Priority</th>
                    </tr>
                </thead>
                <tbody>
                    ${this.generateFileTableHTML(data.fileAnalysis || {})}
                </tbody>
            </table>
        </div>
        
        <!-- Priority Improvements -->
        <div class="section">
            <h2>Priority Improvements</h2>
            <ul class="recommendation-list">
                ${this.generatePriorityImprovements(data).map(imp => `
                    <li>
                        <strong>${imp.title}</strong><br>
                        ${imp.description}<br>
                        <small>Impact: ${imp.impact} | Effort: ${imp.effort}</small>
                    </li>
                `).join('')}
            </ul>
        </div>
        
        <!-- CTA -->
        <div class="cta-section">
            <h2>Ready to Improve Your Content?</h2>
            <p>Run the voice improvement tool to automatically fix these issues</p>
            <div style="margin-top: 1.5rem;">
                <code style="background: #1A1A1A; padding: 1rem; display: inline-block;">
                    npm run update:voice
                </code>
            </div>
        </div>
    </div>
</body>
</html>`;
  }

  // Generate Markdown report
  generateMarkdownReport(data) {
    const summary = this.generateExecutiveSummary(data);
    const lines = [];
    
    lines.push('# Brand Voice Analysis Report');
    lines.push(`*Generated: ${new Date(data.timestamp).toLocaleString()}*`);
    lines.push('');
    
    lines.push('## Executive Summary');
    lines.push('');
    lines.push(`- **Overall Score**: ${summary.overallScore}% ${summary.scoreEmoji}`);
    lines.push(`- **Files Analyzed**: ${summary.filesAnalyzed}`);
    lines.push(`- **Critical Issues**: ${summary.criticalIssues}`);
    lines.push(`- **Estimated Time to Fix**: ${summary.estimatedTime}`);
    lines.push(`- **Priority Actions**: ${summary.priorityActions}`);
    lines.push('');
    
    if (data.voiceConsistency?.pillarBreakdown) {
      lines.push('## Voice Pillar Breakdown');
      lines.push('');
      lines.push('| Pillar | Score | Status | Needs |');
      lines.push('|--------|-------|--------|-------|');
      
      Object.entries(data.voiceConsistency.pillarBreakdown).forEach(([pillar, score]) => {
        const percent = (score * 100).toFixed(0);
        const status = score >= 0.7 ? '✅' : score >= 0.5 ? '⚠️' : '❌';
        const needs = this.getPillarNeeds(pillar, score);
        lines.push(`| ${this.capitalize(pillar)} | ${percent}% | ${status} | ${needs} |`);
      });
      lines.push('');
    }
    
    if (data.fileAnalysis) {
      lines.push('## File Analysis (Bottom 10)');
      lines.push('');
      lines.push('| File | Score | Type | Main Issue |');
      lines.push('|------|-------|------|------------|');
      
      const sortedFiles = Object.entries(data.fileAnalysis)
        .sort((a, b) => a[1].score - b[1].score)
        .slice(0, 10);
      
      sortedFiles.forEach(([filename, fileData]) => {
        const score = (fileData.score * 100).toFixed(1);
        const type = fileData.contentType || 'general';
        const mainIssue = fileData.issues?.[0] || 'N/A';
        lines.push(`| ${filename} | ${score}% | ${type} | ${mainIssue} |`);
      });
      lines.push('');
    }
    
    lines.push('## Priority Improvements');
    lines.push('');
    
    const improvements = this.generatePriorityImprovements(data);
    improvements.forEach((imp, index) => {
      lines.push(`### ${index + 1}. ${imp.title}`);
      lines.push('');
      lines.push(imp.description);
      lines.push('');
      lines.push(`- **Impact**: ${imp.impact}`);
      lines.push(`- **Effort**: ${imp.effort}`);
      if (imp.affectedFiles) {
        lines.push(`- **Files**: ${imp.affectedFiles.join(', ')}`);
      }
      lines.push('');
    });
    
    lines.push('## Next Steps');
    lines.push('');
    lines.push('1. Review this report to understand current voice consistency issues');
    lines.push('2. Run `npm run update:voice` to automatically improve brand voice');
    lines.push('3. Or use `node voice_review.js preview ../data` to review changes first');
    lines.push('4. Generate a comparison report after updates to measure improvement');
    
    return lines.join('\n');
  }

  // Helper: Generate executive summary
  generateExecutiveSummary(data) {
    const filesAnalyzed = data.filesAnalyzed || data.stats?.totalFiles || 0;
    const overallScore = data.voiceConsistency?.avgScore 
      ? (data.voiceConsistency.avgScore * 100).toFixed(1)
      : '0';
    
    const criticalIssues = data.issues?.filter(i => i.severity === 'high').length || 0;
    const mediumIssues = data.issues?.filter(i => i.severity === 'medium').length || 0;
    const totalIssues = criticalIssues + mediumIssues;
    
    // Estimate time: 3 min per critical, 1 min per medium issue
    const estimatedMinutes = (criticalIssues * 3) + (mediumIssues * 1);
    const estimatedTime = estimatedMinutes < 60 
      ? `${estimatedMinutes} minutes`
      : `${Math.round(estimatedMinutes / 60)} hours`;
    
    const scoreFloat = parseFloat(overallScore) / 100;
    const scoreEmoji = scoreFloat >= 0.8 ? '✅' : scoreFloat >= 0.6 ? '⚠️' : '❌';
    const scoreLabel = scoreFloat >= 0.8 ? 'Good' : scoreFloat >= 0.6 ? 'Needs Improvement' : 'Poor';
    const scoreClass = scoreFloat >= 0.8 ? 'score-good' : scoreFloat >= 0.6 ? 'score-warning' : 'score-poor';
    
    const priorityActions = Math.min(5, totalIssues);
    
    return {
      filesAnalyzed,
      overallScore,
      scoreEmoji,
      scoreLabel,
      scoreClass,
      criticalIssues,
      mediumIssues,
      totalIssues,
      estimatedTime,
      priorityActions
    };
  }

  // Helper: Generate priority improvements
  generatePriorityImprovements(data) {
    const improvements = [];
    
    // Check for low overall score
    const avgScore = data.voiceConsistency?.avgScore || 0;
    if (avgScore < 0.5) {
      improvements.push({
        title: 'Implement comprehensive brand voice overhaul',
        description: 'Current score is very low. Focus on removing jargon, adding signature phrases, and strengthening CTAs',
        impact: 'High',
        effort: 'High',
        priority: 'HIGH',
        category: 'overall'
      });
    }
    
    // Count jargon from file analysis
    const filesWithJargon = [];
    if (data.fileAnalysis) {
      Object.entries(data.fileAnalysis).forEach(([file, analysis]) => {
        if (analysis.jargonCount > 0 || (analysis.issues && analysis.issues.some(i => i.includes('jargon')))) {
          filesWithJargon.push(file);
        }
      });
    }
    
    if (filesWithJargon.length > 0) {
      improvements.push({
        title: `Remove corporate jargon from ${filesWithJargon.length} files`,
        description: 'Replace terms like "seamless", "innovative", "robust", "leverage", "optimize" with plain language',
        impact: 'High',
        effort: 'Low',
        priority: 'HIGH',
        category: 'jargon',
        files: filesWithJargon.slice(0, 5)
      });
    }
    
    // Check pillar scores
    const pillarBreakdown = data.voiceConsistency?.pillarBreakdown || {};
    const weakPillars = Object.entries(pillarBreakdown)
      .filter(([_, score]) => score < 0.3)
      .map(([pillar]) => pillar);
    
    if (weakPillars.includes('honest')) {
      improvements.push({
        title: 'Strengthen "Honest" voice pillar',
        description: 'Use more plain language, avoid marketing speak, be transparent and direct',
        impact: 'High',
        effort: 'Medium',
        priority: 'MEDIUM',
        category: 'pillar'
      });
    }
    
    if (weakPillars.includes('human')) {
      improvements.push({
        title: 'Improve "Human" voice pillar',
        description: 'Add personal stories, use conversational tone, show empathy and understanding',
        impact: 'High',
        effort: 'Medium',
        priority: 'MEDIUM',
        category: 'pillar'
      });
    }
    
    if (weakPillars.includes('balanced')) {
      improvements.push({
        title: 'Enhance "Balanced" voice pillar',
        description: 'Mix professional expertise with approachability, vary sentence structure',
        impact: 'Medium',
        effort: 'Medium',
        priority: 'MEDIUM',
        category: 'pillar'
      });
    }
    
    // Files with lowest scores
    const poorFiles = data.voiceConsistency?.failedFiles || [];
    if (poorFiles.length > 0) {
      improvements.push({
        title: `Focus on ${Math.min(5, poorFiles.length)} lowest-scoring files`,
        description: `Priority files: ${poorFiles.slice(0, 5).map(f => f.file).join(', ')}`,
        impact: 'High',
        effort: 'Low',
        priority: 'HIGH',
        category: 'files'
      });
    }
    
    // Add signature phrases recommendation
    if (avgScore < 0.6) {
      improvements.push({
        title: 'Add signature brand phrases',
        description: 'Include phrases like "Design that works", "No drama", "Good design for everyone"',
        impact: 'Medium',
        effort: 'Low',
        priority: 'MEDIUM',
        category: 'signature'
      });
    }
    
    // Add CTA improvement
    improvements.push({
      title: 'Strengthen call-to-action language',
      description: 'Replace generic CTAs with action-oriented, value-driven language',
      impact: 'High',
      effort: 'Low',
      priority: 'MEDIUM',
      category: 'cta'
    });
    
    return improvements.slice(0, 5); // Return top 5
  }

  // Helper: Generate progress bar
  generateProgressBar(value, width = 20) {
    const filled = Math.round(value * width);
    const empty = width - filled;
    return '█'.repeat(filled) + '░'.repeat(empty);
  }

  // Helper: Get score emoji
  getScoreEmoji(score) {
    if (score >= 0.8) return '✅';
    if (score >= 0.6) return '⚠️';
    return '❌';
  }

  // Helper: Capitalize first letter
  capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  // Helper: Get pillar needs
  getPillarNeeds(pillar, score) {
    if (score >= 0.7) return '✓';
    
    const needs = {
      honest: 'Needs: plain language, transparency',
      principled: 'Needs: values-driven language',
      human: 'Needs: empathy, stories',
      balanced: 'Needs: thoughtful structure'
    };
    
    return needs[pillar] || 'Needs improvement';
  }

  // Helper: Generate pillar HTML
  generatePillarHTML(pillars) {
    return Object.entries(pillars).map(([pillar, score]) => {
      const percent = (score * 100).toFixed(0);
      return `
        <div class="pillar-card">
          <h3>${this.capitalize(pillar)}</h3>
          <div class="progress-bar">
            <div class="progress-fill" style="width: ${percent}%"></div>
            <span class="progress-label">${percent}%</span>
          </div>
          <p style="margin-top: 0.5rem; font-size: 0.875rem; color: #666;">
            ${this.getPillarNeeds(pillar, score)}
          </p>
        </div>
      `;
    }).join('');
  }

  // Helper: Generate file table HTML
  generateFileTableHTML(fileAnalysis) {
    const sortedFiles = Object.entries(fileAnalysis)
      .sort((a, b) => a[1].score - b[1].score)
      .slice(0, 20); // Show worst 20
    
    return sortedFiles.map(([filename, data]) => {
      const score = (data.score * 100).toFixed(1);
      const scoreClass = data.score >= 0.8 ? 'score-good' : 
                        data.score >= 0.6 ? 'score-warning' : 'score-poor';
      const priority = data.score < 0.5 ? 'High' : 
                      data.score < 0.7 ? 'Medium' : 'Low';
      
      return `
        <tr>
          <td><strong>${filename}</strong></td>
          <td><span class="score-badge ${scoreClass}">${score}%</span></td>
          <td>${data.contentType || 'general'}</td>
          <td>${data.issues?.length || 0} issues</td>
          <td>${priority}</td>
        </tr>
      `;
    }).join('');
  }

  // Generate simple console report (backward compatible)
  generateConsoleReport(data) {
    const lines = [];
    lines.push('\n' + '='.repeat(60));
    lines.push('📊 CONTENT ANALYSIS REPORT');
    lines.push('='.repeat(60));
    
    if (data.stats) {
      lines.push('\n📈 STATISTICS:');
      lines.push(`Total files analyzed: ${data.stats.totalFiles}`);
      lines.push(`Total words: ${data.stats.totalWords?.toLocaleString()}`);
    }
    
    if (data.voiceConsistency?.avgScore) {
      lines.push('\n🎯 BRAND VOICE CONSISTENCY:');
      const score = (data.voiceConsistency.avgScore * 100).toFixed(1);
      lines.push(`Average voice consistency: ${score}%`);
    }
    
    if (data.issues?.length > 0) {
      lines.push('\n🚨 ISSUES FOUND:');
      data.issues.slice(0, 10).forEach(issue => {
        lines.push(`  • ${issue.message}`);
      });
    }
    
    return lines.join('\n');
  }
}

// Export for use in other scripts
export default ReportGenerator;

// CLI usage
if (import.meta.url.endsWith(process.argv[1]?.replace(/\\/g, '/'))) {
  console.log('Report Generator Module');
  console.log('This module is meant to be imported by other scripts.');
  console.log('Use: import ReportGenerator from "./report_generator.js"');
}