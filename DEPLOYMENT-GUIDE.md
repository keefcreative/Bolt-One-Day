# Deployment Guide - DesignWorks Bureau

Complete deployment instructions for your Next.js design agency website with Brevo integration.

## Overview

This guide covers deploying your Next.js application to Vercel and configuring domain redirects since your hosting provider (designworksbureau.co.uk) only supports WordPress/Weebly.

**Deployment Strategy:**
- **Application Hosting**: Vercel (handles Next.js optimally)
- **Domain Management**: Your current hosting provider
- **DNS Configuration**: Redirect/proxy to Vercel deployment

## Pre-Deployment Checklist

### 1. Environment Variables Ready
Ensure you have all required environment variables:

```bash
# Brevo Configuration
BREVO_API_KEY=your_brevo_api_key
BREVO_SENDER_EMAIL=hello@designworksbureau.co.uk
BREVO_SENDER_NAME=DesignWorks Bureau
NOTIFICATION_EMAIL=team@designworksbureau.co.uk
NEXT_PUBLIC_BREVO_CONVERSATIONS_ID=689cd1ce16d06dcf6c0f5674

# Optional Brevo Lists
BREVO_LIST_ID=your_main_list_id
BREVO_CHAT_LEADS_LIST_ID=your_chat_leads_list_id
BREVO_HIGH_INTENT_LEADS_LIST_ID=your_high_intent_list_id

# Stripe Configuration
STRIPE_SECRET_KEY=sk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### 2. Production Branding Updates
Update any references from "DesignWorks" to "DesignWorks Bureau":
- [ ] Check `/data/contact.json`
- [ ] Update email templates
- [ ] Verify Brevo sender name
- [ ] Check metadata in `app/layout.tsx`

## Vercel Deployment

### Step 1: Prepare Repository
```bash
# Ensure all changes are committed
git add .
git commit -m "Prepare for production deployment"
git push origin main
```

### Step 2: Deploy to Vercel

#### Option A: Vercel CLI (Recommended)
```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy from project directory
vercel --prod

# Follow prompts:
# - Link to existing project? N
# - Project name: designworks-bureau
# - Deploy? Y
```

#### Option B: Vercel Dashboard
1. Go to [vercel.com](https://vercel.com)
2. Click **"New Project"**
3. Import from GitHub: `Bolt-One-Day` repository
4. Configure:
   - **Framework**: Next.js
   - **Root Directory**: `./`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

### Step 3: Configure Environment Variables in Vercel
1. In Vercel dashboard, go to your project
2. Navigate to **Settings** → **Environment Variables**
3. Add all environment variables from your `.env.local`
4. Make sure to set environment to **"Production"**

### Step 4: Custom Domain Setup
1. In Vercel dashboard, go to **Settings** → **Domains**
2. Add domain: `designworksbureau.co.uk`
3. Add subdomain: `www.designworksbureau.co.uk`
4. Vercel will provide DNS configuration instructions

## Domain Configuration Strategy

Since your hosting provider only supports WordPress/Weebly, you have two options:

### Option 1: DNS Redirect (Recommended)
**Best for**: Full control and optimal performance

1. **Check DNS Management Access**
   - Log into your domain hosting control panel
   - Look for "DNS Management", "DNS Settings", or "Nameservers"

2. **Configure DNS Records**
   ```
   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   
   Type: A
   Name: @
   Value: 76.76.19.19 (Vercel's IP)
   ```

3. **Alternative: Change Nameservers**
   - Point your domain's nameservers to Vercel's:
     - `ns1.vercel-dns.com`
     - `ns2.vercel-dns.com`

### Option 2: HTML Redirect (If DNS not accessible)
**Use if**: You can only upload files to your hosting

1. **Create redirect page** on your current hosting:
   ```html
   <!DOCTYPE html>
   <html>
   <head>
       <meta http-equiv="refresh" content="0;URL=https://your-vercel-app.vercel.app">
       <title>DesignWorks Bureau</title>
   </head>
   <body>
       <p>Redirecting to <a href="https://your-vercel-app.vercel.app">DesignWorks Bureau</a></p>
   </body>
   </html>
   ```

2. **Upload as `index.html`** to your hosting root directory

## Post-Deployment Configuration

### 1. Update Brevo Webhook URL
⚠️ **CRITICAL**: Update your webhook URL in Brevo

1. **Go to Brevo Dashboard**
   - Navigate to **Conversations** → **Settings** → **Integrations** → **Webhooks**

2. **Update Webhook URL**
   - Change from: `https://230ea33c3aef.ngrok-free.app/api/brevo-conversations-webhook`
   - To: `https://designworksbureau.co.uk/api/brevo-conversations-webhook`

3. **Test Webhook**
   ```bash
   curl -X GET https://designworksbureau.co.uk/api/brevo-conversations-webhook
   ```
   Should return webhook status confirmation.

### 2. Update Stripe Webhook Endpoint
1. Go to [Stripe Dashboard](https://dashboard.stripe.com/webhooks)
2. Update webhook endpoint URL to: `https://designworksbureau.co.uk/api/stripe-webhook`
3. Ensure events are selected:
   - `customer.created`
   - `customer.updated`
   - `invoice.payment_succeeded`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`

### 3. Configure Custom Domain in Vercel
1. In Vercel dashboard → **Settings** → **Domains**
2. Add `designworksbureau.co.uk`
3. Add `www.designworksbureau.co.uk`
4. Set `designworksbureau.co.uk` as primary domain
5. Enable automatic HTTPS

## SSL Certificate & Security

Vercel automatically provides:
- ✅ **SSL/TLS Certificate** (Let's Encrypt)
- ✅ **HTTP to HTTPS Redirect**
- ✅ **HSTS Headers**
- ✅ **Security Headers** (CSP, etc.)

## Performance Optimization

### 1. Vercel Analytics (Optional)
```bash
npm install @vercel/analytics
```

Add to `app/layout.tsx`:
```tsx
import { Analytics } from '@vercel/analytics/react'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
```

### 2. Enable Vercel Speed Insights
1. In Vercel dashboard → **Settings** → **Speed Insights**
2. Enable **Web Vitals tracking**

## Testing Checklist

After deployment, verify:

### Functionality Tests
- [ ] Website loads at `https://designworksbureau.co.uk`
- [ ] Chat widget appears and functions correctly
- [ ] Contact form submits successfully
- [ ] Stripe payment integration works
- [ ] Portfolio images load correctly
- [ ] Mobile responsiveness

### Integration Tests
- [ ] Brevo webhook receives conversation events
- [ ] New contacts appear in Brevo CRM
- [ ] Email notifications are sent
- [ ] Stripe webhooks process payments
- [ ] Analytics tracking works

### SEO & Performance
- [ ] SSL certificate is active (green padlock)
- [ ] Page speed is optimal (Google PageSpeed Insights)
- [ ] Meta tags are correct
- [ ] Sitemap is accessible: `/sitemap.xml`

## Monitoring & Maintenance

### 1. Set Up Vercel Monitoring
- **Function Logs**: Monitor API route performance
- **Real User Monitoring**: Track user experience
- **Error Tracking**: Get notified of deployment issues

### 2. Regular Updates
- **Monthly**: Check for Next.js updates
- **Quarterly**: Review Brevo integration performance  
- **As Needed**: Update environment variables

## Troubleshooting

### Common Issues

**Domain Not Resolving**
- Check DNS propagation: `dig designworksbureau.co.uk`
- Verify DNS records are correctly configured
- Wait up to 48 hours for DNS propagation

**Chat Widget Not Loading**
- Verify `NEXT_PUBLIC_BREVO_CONVERSATIONS_ID` is set
- Check browser console for JavaScript errors
- Test in incognito mode to rule out caching

**Webhook Not Working**
- Test webhook URL directly
- Check Vercel function logs
- Verify webhook URL in Brevo dashboard

**Stripe Issues**
- Confirm webhook endpoint URL is updated
- Check webhook secret matches environment variable
- Test with Stripe's webhook testing tool

## Rollback Plan

If issues occur:

1. **Quick Fix**: Revert to previous Vercel deployment
   ```bash
   vercel rollback
   ```

2. **Domain Issues**: Point DNS back to original hosting temporarily

3. **Critical Bug**: Deploy hotfix
   ```bash
   git revert <commit-hash>
   git push origin main
   # Vercel auto-deploys
   ```

## Support Resources

- **Vercel Documentation**: https://vercel.com/docs
- **Next.js Deployment**: https://nextjs.org/docs/deployment
- **Brevo API Docs**: https://developers.brevo.com/
- **Domain DNS Tools**: https://www.whatsmydns.net/

## Deployment Summary

Your Next.js application will be:
- ✅ **Hosted on Vercel** (optimal Next.js performance)
- ✅ **Accessible via your domain** (designworksbureau.co.uk)
- ✅ **Secured with SSL** (automatic HTTPS)
- ✅ **Integrated with Brevo** (live chat & CRM)
- ✅ **Connected to Stripe** (payment processing)
- ✅ **Optimized for performance** (Vercel CDN)

The combination of Vercel hosting with domain redirection gives you the best of both worlds: keeping your existing domain while leveraging Vercel's superior Next.js hosting capabilities.