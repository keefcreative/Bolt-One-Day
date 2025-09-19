export const reportTemplates = {
  html: {
    main: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Brand Voice Analysis Report - {{date}}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
            line-height: 1.6;
            color: #333;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 2rem;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            border-radius: 12px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            overflow: hidden;
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 3rem;
            text-align: center;
        }
        h1 {
            font-size: 2.5rem;
            margin-bottom: 0.5rem;
            font-weight: 700;
        }
        .subtitle {
            font-size: 1.1rem;
            opacity: 0.9;
        }
        .summary {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 2rem;
            padding: 2rem;
            background: #f7f9fc;
        }
        .metric-card {
            background: white;
            padding: 1.5rem;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .metric-label {
            font-size: 0.875rem;
            color: #666;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 0.5rem;
        }
        .metric-value {
            font-size: 2rem;
            font-weight: bold;
            color: #333;
        }
        .metric-value.good { color: #22c55e; }
        .metric-value.warning { color: #f59e0b; }
        .metric-value.poor { color: #ef4444; }
        .content {
            padding: 2rem;
        }
        .section {
            margin-bottom: 3rem;
        }
        h2 {
            color: #667eea;
            margin-bottom: 1.5rem;
            padding-bottom: 0.5rem;
            border-bottom: 2px solid #e5e7eb;
        }
        .pillar-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1rem;
            margin-top: 1rem;
        }
        .pillar-card {
            background: white;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            padding: 1rem;
            position: relative;
            overflow: hidden;
        }
        .pillar-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            height: 4px;
            width: 100%;
            background: linear-gradient(90deg, #667eea, #764ba2);
        }
        .pillar-name {
            font-weight: 600;
            margin-bottom: 0.5rem;
        }
        .pillar-score {
            font-size: 1.5rem;
            font-weight: bold;
        }
        .file-list {
            background: #f7f9fc;
            border-radius: 8px;
            padding: 1.5rem;
        }
        .file-item {
            background: white;
            margin-bottom: 1rem;
            padding: 1rem;
            border-radius: 6px;
            border: 1px solid #e5e7eb;
            transition: transform 0.2s;
        }
        .file-item:hover {
            transform: translateX(5px);
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .file-name {
            font-weight: 600;
            color: #667eea;
            margin-bottom: 0.5rem;
        }
        .file-metrics {
            display: flex;
            gap: 2rem;
            margin-top: 0.5rem;
            font-size: 0.875rem;
        }
        .progress-bar {
            width: 100%;
            height: 8px;
            background: #e5e7eb;
            border-radius: 4px;
            overflow: hidden;
            margin-top: 0.5rem;
        }
        .progress-fill {
            height: 100%;
            background: linear-gradient(90deg, #667eea, #764ba2);
            transition: width 0.3s ease;
        }
        .recommendations {
            background: #fef3c7;
            border: 1px solid #fbbf24;
            border-radius: 8px;
            padding: 1.5rem;
            margin-top: 2rem;
        }
        .recommendations h3 {
            color: #d97706;
            margin-bottom: 1rem;
        }
        .recommendation-item {
            background: white;
            padding: 1rem;
            border-radius: 6px;
            margin-bottom: 0.75rem;
            border-left: 4px solid #fbbf24;
        }
        .priority-high {
            border-left-color: #ef4444;
        }
        .priority-medium {
            border-left-color: #f59e0b;
        }
        .priority-low {
            border-left-color: #22c55e;
        }
        .footer {
            background: #f7f9fc;
            padding: 2rem;
            text-align: center;
            color: #666;
            border-top: 1px solid #e5e7eb;
        }
        @media print {
            body { background: white; padding: 0; }
            .container { box-shadow: none; }
        }
    </style>
</head>
<body>
    <div class="container">
        {{content}}
    </div>
</body>
</html>`,

    executiveSummary: `
<div class="header">
    <h1>Brand Voice Analysis Report</h1>
    <p class="subtitle">{{date}} | {{fileCount}} files analyzed</p>
</div>

<div class="summary">
    <div class="metric-card">
        <div class="metric-label">Overall Score</div>
        <div class="metric-value {{scoreClass}}">{{overallScore}}%</div>
        <div class="progress-bar">
            <div class="progress-fill" style="width: {{overallScore}}%"></div>
        </div>
    </div>
    <div class="metric-card">
        <div class="metric-label">Files Analyzed</div>
        <div class="metric-value">{{fileCount}}</div>
    </div>
    <div class="metric-card">
        <div class="metric-label">Content Fields</div>
        <div class="metric-value">{{contentFieldsCount}}</div>
    </div>
    <div class="metric-card">
        <div class="metric-label">Jargon Found</div>
        <div class="metric-value {{jargonClass}}">{{jargonCount}}</div>
    </div>
</div>`,

    pillarBreakdown: `
<div class="section">
    <h2>Voice Pillar Performance</h2>
    <div class="pillar-grid">
        {{pillars}}
    </div>
</div>`,

    fileAnalysis: `
<div class="section">
    <h2>File-by-File Analysis</h2>
    <div class="file-list">
        {{files}}
    </div>
</div>`,

    recommendations: `
<div class="recommendations">
    <h3>📋 Priority Recommendations</h3>
    {{recommendationItems}}
</div>`
  },

  markdown: {
    header: `# Brand Voice Analysis Report
_Generated: {{date}}_

---

## Executive Summary

{{summary}}

---
`,

    metrics: `### Key Metrics

| Metric | Value | Status |
|--------|-------|--------|
| **Overall Score** | {{overallScore}}% | {{status}} |
| **Files Analyzed** | {{fileCount}} | - |
| **Content Fields** | {{contentFieldsCount}} | - |
| **Jargon Instances** | {{jargonCount}} | {{jargonStatus}} |
| **Power Words Used** | {{powerWordsCount}} | {{powerStatus}} |

---
`,

    pillars: `### Voice Pillar Breakdown

{{pillarTable}}

---
`,

    fileDetails: `### File Analysis

{{fileList}}

---
`,

    recommendations: `### 📋 Priority Recommendations

{{recommendationList}}

---
`,

    footer: `
---

_Report generated by Brand Voice Analysis System_  
_For questions or support, contact the development team_
`
  }
};

export function generateHTMLReport(data) {
  const overallScore = parseFloat(data.summary.overallScore) || 0;
  const scoreClass = overallScore >= 70 ? 'good' : 
                     overallScore >= 40 ? 'warning' : 'poor';
  
  const jargonClass = data.summary.jargonCount <= 5 ? 'good' :
                      data.summary.jargonCount <= 15 ? 'warning' : 'poor';

  let html = reportTemplates.html.main;
  
  // Build executive summary
  let summary = reportTemplates.html.executiveSummary
    .replace(/{{date}}/g, new Date().toLocaleDateString())
    .replace(/{{fileCount}}/g, data.summary.filesAnalyzed)
    .replace(/{{overallScore}}/g, overallScore.toFixed(1))
    .replace(/{{scoreClass}}/g, scoreClass)
    .replace(/{{contentFieldsCount}}/g, data.summary.contentFieldsAnalyzed)
    .replace(/{{jargonCount}}/g, data.summary.jargonCount)
    .replace(/{{jargonClass}}/g, jargonClass);

  // Build pillar cards
  let pillars = '';
  for (const [pillar, score] of Object.entries(data.pillars)) {
    const pillarScoreClass = score >= 70 ? 'good' : score >= 40 ? 'warning' : 'poor';
    pillars += `
      <div class="pillar-card">
        <div class="pillar-name">${pillar}</div>
        <div class="pillar-score ${pillarScoreClass}">${score.toFixed(1)}%</div>
        <div class="progress-bar">
          <div class="progress-fill" style="width: ${score}%"></div>
        </div>
      </div>
    `;
  }

  // Build file list
  let fileList = '';
  data.files.forEach(file => {
    const fileScoreClass = file.voiceConsistency >= 70 ? 'good' : 
                          file.voiceConsistency >= 40 ? 'warning' : 'poor';
    fileList += `
      <div class="file-item">
        <div class="file-name">${file.name}</div>
        <div class="file-metrics">
          <span>Score: <strong class="${fileScoreClass}">${file.voiceConsistency.toFixed(1)}%</strong></span>
          <span>Fields: ${file.fieldsAnalyzed}</span>
          <span>Jargon: ${file.jargonCount}</span>
        </div>
        <div class="progress-bar">
          <div class="progress-fill" style="width: ${file.voiceConsistency}%"></div>
        </div>
      </div>
    `;
  });

  // Build recommendations
  let recommendations = '';
  if (data.recommendations && data.recommendations.length > 0) {
    data.recommendations.forEach(rec => {
      const priority = rec.priority || 'MEDIUM';
      const priorityClass = `priority-${priority.toLowerCase()}`;
      const title = rec.title || rec.action || 'Improvement needed';
      recommendations += `
        <div class="recommendation-item ${priorityClass}">
          <strong>${priority}:</strong> ${title}
          ${rec.description ? `<br><small>${rec.description}</small>` : ''}
        </div>
      `;
    });
  } else {
    recommendations = '<div class="recommendation-item">No specific recommendations generated.</div>';
  }

  // Assemble content
  let content = summary;
  content += `<div class="content">`;
  content += reportTemplates.html.pillarBreakdown.replace('{{pillars}}', pillars);
  content += reportTemplates.html.fileAnalysis.replace('{{files}}', fileList);
  content += reportTemplates.html.recommendations.replace('{{recommendationItems}}', recommendations);
  content += `</div>`;
  content += `<div class="footer">Report generated on ${new Date().toLocaleString()}</div>`;

  html = html.replace('{{date}}', new Date().toLocaleDateString())
            .replace('{{content}}', content);

  return html;
}

export function generateMarkdownReport(data) {
  const overallScore = parseFloat(data.summary.overallScore) || 0;
  let markdown = reportTemplates.markdown.header
    .replace('{{date}}', new Date().toLocaleString())
    .replace('{{summary}}', `The brand voice analysis of **${data.summary.filesAnalyzed} files** shows an overall consistency score of **${overallScore.toFixed(1)}%**. ${overallScore >= 70 ? 'The content maintains strong brand voice alignment.' : overallScore >= 40 ? 'The content shows moderate brand voice consistency with room for improvement.' : 'Significant improvements needed to align with brand voice guidelines.'}`);

  // Add metrics table
  markdown += reportTemplates.markdown.metrics
    .replace('{{overallScore}}', overallScore.toFixed(1))
    .replace('{{status}}', overallScore >= 70 ? '✅ Good' : overallScore >= 40 ? '⚠️ Needs Work' : '❌ Poor')
    .replace('{{fileCount}}', data.summary.filesAnalyzed)
    .replace('{{contentFieldsCount}}', data.summary.contentFieldsAnalyzed)
    .replace('{{jargonCount}}', data.summary.jargonCount)
    .replace('{{jargonStatus}}', data.summary.jargonCount <= 5 ? '✅' : data.summary.jargonCount <= 15 ? '⚠️' : '❌')
    .replace('{{powerWordsCount}}', data.summary.powerWordsUsed || 0)
    .replace('{{powerStatus}}', (data.summary.powerWordsUsed || 0) >= 10 ? '✅' : '⚠️');

  // Add pillar table
  let pillarTable = '| Pillar | Score | Status |\n|--------|-------|--------|\n';
  for (const [pillar, score] of Object.entries(data.pillars)) {
    const status = score >= 70 ? '✅' : score >= 40 ? '⚠️' : '❌';
    pillarTable += `| **${pillar}** | ${score.toFixed(1)}% | ${status} |\n`;
  }
  markdown += reportTemplates.markdown.pillars.replace('{{pillarTable}}', pillarTable);

  // Add file list
  let fileListMd = '';
  const topFiles = data.files.slice(0, 10);
  topFiles.forEach((file, index) => {
    const emoji = file.voiceConsistency >= 70 ? '✅' : file.voiceConsistency >= 40 ? '⚠️' : '❌';
    fileListMd += `${index + 1}. **${file.name}** - ${file.voiceConsistency.toFixed(1)}% ${emoji}\n`;
    fileListMd += `   - Fields analyzed: ${file.fieldsAnalyzed}\n`;
    fileListMd += `   - Jargon instances: ${file.jargonCount}\n`;
    if (file.topIssues && file.topIssues.length > 0) {
      fileListMd += `   - Top issues: ${file.topIssues.join(', ')}\n`;
    }
    fileListMd += '\n';
  });
  
  if (data.files.length > 10) {
    fileListMd += `\n_...and ${data.files.length - 10} more files_\n`;
  }
  
  markdown += reportTemplates.markdown.fileDetails.replace('{{fileList}}', fileListMd);

  // Add recommendations
  let recommendationList = '';
  data.recommendations.forEach((rec, index) => {
    const priority = rec.priority || 'MEDIUM';
    const emoji = priority === 'HIGH' ? '🔴' : priority === 'MEDIUM' ? '🟡' : '🟢';
    const title = rec.title || rec.action || 'Improvement needed';
    recommendationList += `${index + 1}. ${emoji} **${priority}**: ${title}\n`;
    if (rec.description) {
      recommendationList += `   - ${rec.description}\n`;
    }
    if (rec.impact && rec.effort) {
      recommendationList += `   - Impact: ${rec.impact} | Effort: ${rec.effort}\n`;
    }
    if (rec.files && rec.files.length > 0) {
      recommendationList += `   - Affected files: ${rec.files.slice(0, 3).join(', ')}${rec.files.length > 3 ? '...' : ''}\n`;
    }
    recommendationList += '\n';
  });
  markdown += reportTemplates.markdown.recommendations.replace('{{recommendationList}}', recommendationList);

  // Add footer
  markdown += reportTemplates.markdown.footer;

  return markdown;
}

export default { generateHTMLReport, generateMarkdownReport, reportTemplates };