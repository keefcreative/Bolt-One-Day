# Deployment To-Do Checklist

Complete this checklist to successfully deploy your DesignWorks Bureau website to production.

## Pre-Deployment Setup

### 1. Repository & Code
- [ ] All code changes committed and pushed to `main` branch
- [ ] Remove any development/testing files or comments
- [ ] Verify all images are optimized and properly referenced
- [ ] Test build locally: `npm run build`
- [ ] Run linting: `npm run lint` (fix any issues)

### 2. Environment Variables
- [ ] Copy all variables from `.env.local` to deployment platform
- [ ] Update `BREVO_SENDER_EMAIL` to `hello@designworksbureau.co.uk`  
- [ ] Update `BREVO_SENDER_NAME` to `DesignWorks Bureau`
- [ ] Update `NOTIFICATION_EMAIL` to your production email
- [ ] Verify `NEXT_PUBLIC_BREVO_CONVERSATIONS_ID` is correct
- [ ] Confirm Stripe keys are for **LIVE** environment (not test)

### 3. Content Updates
- [ ] Update company name from "DesignWorks" to "DesignWorks Bureau" in:
  - [ ] `app/layout.tsx` metadata
  - [ ] `/data/contact.json`
  - [ ] `/data/hero.json`
  - [ ] Any other data files with company references

## Vercel Deployment

### 4. Initial Deployment
- [ ] Install Vercel CLI: `npm install -g vercel`
- [ ] Login to Vercel: `vercel login`
- [ ] Deploy: `vercel --prod`
- [ ] Note the deployment URL (e.g., `https://designworks-bureau.vercel.app`)

### 5. Environment Variables in Vercel
- [ ] Go to Vercel dashboard → Project → Settings → Environment Variables
- [ ] Add all production environment variables
- [ ] Set environment to "Production"
- [ ] Redeploy to apply variables: `vercel --prod`

### 6. Domain Configuration
- [ ] Add custom domain in Vercel: `designworksbureau.co.uk`
- [ ] Add www subdomain: `www.designworksbureau.co.uk`
- [ ] Set primary domain (probably `designworksbureau.co.uk`)

## Domain & DNS Setup

### 7. Current Hosting Provider Setup
**Choose ONE option based on your hosting provider's capabilities:**

#### Option A: DNS Records (Recommended)
- [ ] Access your domain's DNS settings
- [ ] Add CNAME record: `www` → `cname.vercel-dns.com`
- [ ] Add A record: `@` → `76.76.19.19`
- [ ] Wait for DNS propagation (up to 48 hours)

#### Option B: Nameserver Change
- [ ] Change nameservers to Vercel's:
  - [ ] `ns1.vercel-dns.com`
  - [ ] `ns2.vercel-dns.com`
- [ ] Wait for propagation

#### Option C: HTML Redirect (Last Resort)
- [ ] Create redirect HTML file
- [ ] Upload to hosting provider's root directory as `index.html`
- [ ] Test redirect works

### 8. SSL & Security
- [ ] Verify HTTPS is working: `https://designworksbureau.co.uk`
- [ ] Check SSL certificate is valid (green padlock in browser)
- [ ] Confirm HTTP redirects to HTTPS

## Critical Post-Deployment Updates

### 9. ⚠️ UPDATE BREVO WEBHOOK (CRITICAL)
- [ ] Go to Brevo → Conversations → Settings → Integrations → Webhooks
- [ ] Update webhook URL from ngrok to: `https://designworksbureau.co.uk/api/brevo-conversations-webhook`
- [ ] Test webhook: `curl -X GET https://designworksbureau.co.uk/api/brevo-conversations-webhook`
- [ ] Should return JSON status confirmation

### 10. Update Stripe Webhook
- [ ] Go to Stripe Dashboard → Webhooks
- [ ] Update endpoint URL to: `https://designworksbureau.co.uk/api/stripe-webhook`
- [ ] Test webhook endpoint
- [ ] Verify all required events are enabled

### 11. Update Any Other Webhooks
- [ ] Check if any other services have webhook URLs pointing to localhost/ngrok
- [ ] Update all webhook URLs to production domain

## Testing & Verification

### 12. Functionality Testing
- [ ] **Website Loading**: Visit `https://designworksbureau.co.uk`
- [ ] **Chat Widget**: Verify Brevo chat appears and functions
- [ ] **Contact Form**: Test form submission and email delivery  
- [ ] **Portfolio**: Check all images load correctly
- [ ] **Navigation**: Test all menu items and internal links
- [ ] **Mobile**: Test responsive design on mobile device

### 13. Integration Testing
- [ ] **Chat Integration**: Start a test conversation, verify it appears in Brevo
- [ ] **Lead Capture**: Test that contact info is captured in Brevo CRM
- [ ] **Email Notifications**: Confirm team notifications are sent
- [ ] **Stripe**: Test subscription flow (use test mode first)
- [ ] **Webhooks**: Monitor webhook logs in Vercel for successful events

### 14. Performance & SEO
- [ ] **Page Speed**: Test with Google PageSpeed Insights (aim for 90+)
- [ ] **SEO**: Check meta tags, titles, and descriptions
- [ ] **Analytics**: Verify tracking is working (if enabled)
- [ ] **Social Media**: Test Open Graph meta tags

## Monitoring Setup

### 15. Set Up Monitoring
- [ ] Enable Vercel Analytics (optional)
- [ ] Set up error monitoring/alerts
- [ ] Configure uptime monitoring
- [ ] Set up Brevo notification for failed webhook deliveries

### 16. Documentation
- [ ] Document production URLs and credentials securely
- [ ] Share access credentials with team members (if applicable)
- [ ] Update any internal documentation with new URLs

## Go-Live Checklist

### 17. Final Go-Live Steps
- [ ] **Announce**: Inform stakeholders website is live
- [ ] **Social Media**: Update social profiles with new website URL
- [ ] **Business Cards/Marketing**: Note URL change for future prints
- [ ] **Google**: Submit new sitemap to Google Search Console
- [ ] **Backups**: Ensure regular backups are configured

### 18. Post-Launch Monitoring (First 48 Hours)
- [ ] Monitor Vercel function logs for errors
- [ ] Check Brevo for incoming conversations and leads
- [ ] Monitor email deliverability 
- [ ] Watch for any 404 errors or broken links
- [ ] Verify DNS propagation is complete globally

## Rollback Plan (If Issues Occur)

### 19. Emergency Procedures
- [ ] **Document rollback steps**: How to revert to previous version
- [ ] **DNS Rollback**: How to point domain back to old hosting
- [ ] **Contact Info**: Have hosting provider support details ready
- [ ] **Team Contact**: Ensure team knows who to contact for issues

## Success Criteria

### 20. Deployment Complete When:
- [ ] ✅ Website loads fast at `https://designworksbureau.co.uk`
- [ ] ✅ All functionality works (chat, forms, payments)
- [ ] ✅ Brevo integration captures leads successfully
- [ ] ✅ Email notifications are delivered
- [ ] ✅ SSL certificate is active and valid
- [ ] ✅ Mobile experience is optimal
- [ ] ✅ No broken links or 404 errors
- [ ] ✅ Performance scores are good (90+ PageSpeed)

## Notes & Reminders

- **DNS Propagation**: Can take up to 48 hours globally
- **Testing**: Use incognito/private browsing to avoid cache issues
- **Webhooks**: Critical to update ALL webhook URLs post-deployment
- **Backups**: Consider setting up automated backups of your data
- **Team Training**: Ensure team knows how to use new Brevo features

---

**Deployment Date**: _____________  
**Deployed By**: _____________  
**Production URL**: https://designworksbureau.co.uk  
**Vercel Project**: _____________

## Quick Reference

**Key URLs After Deployment:**
- Website: `https://designworksbureau.co.uk`
- Admin: `https://vercel.com/dashboard`
- Brevo: `https://app.brevo.com`
- Stripe: `https://dashboard.stripe.com`

**Critical Post-Deployment:**
1. Update Brevo webhook URL
2. Update Stripe webhook URL  
3. Test all integrations
4. Monitor for 48 hours