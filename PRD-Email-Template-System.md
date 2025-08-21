# Product Requirements Document (PRD)
## Email Template Creation & Management System for DesignWorks

**Version:** 1.0  
**Date:** January 2025  
**Status:** Proposed  
**Author:** DesignWorks Technical Team

---

## 1. Executive Summary

### 1.1 Purpose
Develop a standalone email template creation and management system that integrates with Brevo (formerly Sendinblue) to provide version-controlled, branded email templates for DesignWorks' client communications, marketing campaigns, and transactional emails.

### 1.2 Problem Statement
Currently, email templates are created ad-hoc or directly in Brevo's dashboard, leading to:
- Inconsistent branding across email communications
- No version control for email template changes
- Difficulty maintaining templates across environments
- Limited reusability of email components
- No automated testing of email rendering

### 1.3 Solution Overview
A dedicated Next.js application that serves as a central hub for creating, previewing, testing, and deploying email templates to Brevo, with full version control and component reusability.

---

## 2. Goals & Objectives

### 2.1 Primary Goals
- **Centralize** all email template management in one system
- **Standardize** email design with reusable components
- **Automate** template deployment to Brevo
- **Enable** non-technical team members to customize templates

### 2.2 Success Metrics
- 100% of email templates version controlled
- 50% reduction in template creation time
- Zero brand inconsistencies in emails
- 90% component reuse across templates
- Full email client compatibility (Gmail, Outlook, Apple Mail, etc.)

---

## 3. Functional Requirements

### 3.1 Template Builder
- **Visual Editor**: Drag-and-drop interface for non-technical users
- **Code Editor**: Direct HTML/CSS editing for developers
- **Component Library**: Pre-built, reusable email components
- **Variable System**: Dynamic content placeholders ({{firstName}}, {{companyName}})
- **Responsive Design**: Mobile-first email templates

### 3.2 Template Types
Required templates for initial release:
1. **Transactional Emails**
   - Welcome email (new contacts)
   - Payment confirmation
   - Invoice/Receipt
   - Password reset
   - Account notifications

2. **Marketing Emails**
   - Newsletter template
   - Product announcements
   - Case study highlights
   - Event invitations

3. **Client Communication**
   - Project updates
   - Weekly/Monthly reports
   - Design delivery notifications
   - Feedback requests

4. **Internal Notifications**
   - New lead alerts
   - Subscription changes
   - System notifications

### 3.3 Component System
Reusable email components:
- Headers (with logo variations)
- Footers (with social links, unsubscribe)
- Buttons (CTA styles)
- Content blocks (text, image, two-column)
- Data tables
- Progress bars
- Testimonial blocks
- Portfolio showcases

### 3.4 Preview & Testing
- **Live Preview**: Real-time preview as you edit
- **Device Preview**: Desktop, tablet, mobile views
- **Email Client Preview**: Render testing for major clients
- **Dark Mode Testing**: Ensure compatibility
- **Spam Score Check**: Validate content for deliverability
- **Link Validation**: Check all URLs are valid

### 3.5 Brevo Integration
- **Template Sync**: Push templates to Brevo via API
- **Version Management**: Track which version is live
- **Template Mapping**: Map local templates to Brevo IDs
- **Variable Mapping**: Ensure variables match Brevo contacts
- **List Management**: Associate templates with contact lists

### 3.6 Version Control
- **Git Integration**: All templates in repository
- **Change History**: Track who changed what and when
- **Rollback**: Revert to previous versions
- **Diff Viewer**: Compare template versions
- **Approval Workflow**: Review before deploying

### 3.7 Analytics Integration
- **Open Rates**: Track per template
- **Click Rates**: Monitor engagement
- **A/B Testing**: Support multiple versions
- **Performance Dashboard**: Visualize metrics

---

## 4. Technical Requirements

### 4.1 Technology Stack
- **Framework**: Next.js 14+ (App Router)
- **UI Framework**: React with TypeScript
- **Styling**: Tailwind CSS + MJML for email compatibility
- **Email Engine**: React Email or MJML
- **Database**: PostgreSQL (Supabase) for template storage
- **API Integration**: Brevo API v3
- **Version Control**: Git
- **Deployment**: Vercel

### 4.2 Architecture
```
email-template-system/
├── app/
│   ├── dashboard/          # Main dashboard
│   ├── editor/            # Template editor
│   ├── preview/           # Preview routes
│   └── api/              # API endpoints
├── components/
│   ├── email/            # Email components
│   ├── editor/           # Editor UI components
│   └── ui/              # Shared UI components
├── lib/
│   ├── brevo/           # Brevo integration
│   ├── compiler/        # Template compiler
│   └── validators/      # Email validation
├── templates/
│   ├── transactional/   # Transactional templates
│   ├── marketing/       # Marketing templates
│   └── components/      # Reusable components
└── tests/
    ├── rendering/       # Email rendering tests
    └── compatibility/   # Client compatibility tests
```

### 4.3 API Endpoints
- `GET /api/templates` - List all templates
- `GET /api/templates/:id` - Get specific template
- `POST /api/templates` - Create new template
- `PUT /api/templates/:id` - Update template
- `DELETE /api/templates/:id` - Delete template
- `POST /api/templates/:id/deploy` - Deploy to Brevo
- `POST /api/templates/:id/preview` - Generate preview
- `GET /api/templates/:id/history` - Get version history

### 4.4 Security Requirements
- **Authentication**: OAuth with DesignWorks credentials
- **Authorization**: Role-based access (Admin, Editor, Viewer)
- **API Security**: Rate limiting, API key management
- **Data Encryption**: Encrypt sensitive template data
- **Audit Logging**: Track all template changes

---

## 5. User Interface Design

### 5.1 Dashboard
- Template gallery with search/filter
- Quick stats (emails sent, open rates)
- Recent activity feed
- Quick actions (new template, deploy changes)

### 5.2 Template Editor
- Split view: Code/Visual editor + Live preview
- Component panel (drag & drop)
- Properties panel (styling, variables)
- Toolbar (save, preview, deploy, test)

### 5.3 Design System Alignment
- Match DesignWorks brand colors: ink, smoke, flame, ocean
- Use sharp edges (no border radius) for modern aesthetic
- Consistent typography with main website
- Premium, minimalist interface

---

## 6. Integration Points

### 6.1 Brevo Integration
- API key management
- Template CRUD operations
- Contact list synchronization
- Campaign management
- Analytics webhook receipt

### 6.2 Main Website Integration
- Shared design tokens
- Component library sync
- User authentication (SSO)
- Analytics dashboard embedding

### 6.3 Future Integrations
- Stripe (transaction emails)
- Slack (notifications)
- Google Analytics (tracking)
- Figma (design import)

---

## 7. Development Phases

### Phase 1: Foundation (Week 1-2)
- Project setup and architecture
- Basic template editor
- Brevo API integration
- Component system foundation

### Phase 2: Core Features (Week 3-4)
- Visual editor implementation
- Template preview system
- Version control integration
- Basic component library

### Phase 3: Advanced Features (Week 5-6)
- Email client testing
- Analytics dashboard
- A/B testing support
- Approval workflows

### Phase 4: Polish & Launch (Week 7-8)
- UI/UX refinement
- Performance optimization
- Documentation
- Team training

---

## 8. Success Criteria

### 8.1 Acceptance Criteria
- [ ] All email templates are version controlled
- [ ] Templates render correctly in top 5 email clients
- [ ] Non-technical users can create/edit templates
- [ ] Deployment to Brevo takes < 30 seconds
- [ ] 100% brand consistency across templates

### 8.2 Performance Requirements
- Template preview: < 500ms
- Template deployment: < 30s
- Dashboard load: < 2s
- Email rendering: < 100ms

---

## 9. Risks & Mitigation

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Email client compatibility issues | High | Medium | Use MJML/tested components |
| Brevo API limitations | Medium | Low | Implement caching/queuing |
| Complex approval workflows | Medium | Medium | Start with simple flow, iterate |
| Performance with many templates | Low | Low | Implement pagination/lazy loading |

---

## 10. Future Enhancements

### Version 2.0 Considerations
- AI-powered content suggestions
- Multilingual template support
- Advanced personalization rules
- Email automation workflows
- White-label capability for clients
- Template marketplace
- Advanced analytics with ML insights

---

## 11. Budget & Resources

### 11.1 Team Requirements
- 1 Full-stack Developer (8 weeks)
- 1 UI/UX Designer (2 weeks)
- 1 QA Tester (2 weeks)
- 1 Project Manager (part-time)

### 11.2 Infrastructure Costs
- Vercel hosting: ~$20/month
- Supabase database: ~$25/month
- Brevo API: Included in existing plan
- Email testing tools: ~$50/month

### 11.3 Total Estimated Investment
- Development: $25,000 - $35,000
- Infrastructure (annual): $1,140
- Maintenance (monthly): ~$2,000

---

## 12. Appendix

### 12.1 Example Template Structure
```html
<!-- MJML Example -->
<mjml>
  <mj-head>
    <mj-attributes>
      <mj-all font-family="-apple-system, BlinkMacSystemFont, sans-serif" />
      <mj-text color="#2C2C2C" font-size="16px" line-height="1.6" />
    </mj-attributes>
  </mj-head>
  <mj-body background-color="#FBFBFB">
    <mj-section>
      <mj-column>
        <mj-text>Hello {{contact.FIRSTNAME}},</mj-text>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>
```

### 12.2 Brevo API Integration Example
```typescript
interface TemplateSync {
  localId: string;
  brevoId: number;
  version: string;
  lastSynced: Date;
  status: 'draft' | 'active' | 'archived';
}
```

### 12.3 Component Library Example
```typescript
// Reusable email button component
export const EmailButton = ({ 
  href, 
  text, 
  variant = 'primary' 
}: EmailButtonProps) => {
  const styles = {
    primary: 'background: #FF5733; color: #FFFFFF;',
    secondary: 'background: #2C2C2C; color: #FBFBFB;'
  };
  
  return (
    <mj-button href={href} css-class={styles[variant]}>
      {text}
    </mj-button>
  );
};
```

---

**Document Status**: Ready for Review  
**Next Steps**: Stakeholder approval → Technical design → Development kickoff