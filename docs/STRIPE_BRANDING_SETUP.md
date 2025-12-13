# Stripe Branding Setup Guide

Complete premium DesignWorks branding for your Stripe checkout and customer portal.

## ✅ Automated Configuration (Already Applied)

The following branding is automatically applied via code to every checkout session:

- **Custom checkout text**: "You will be charged immediately. Cancel anytime with no penalties."
- **Terms acceptance message**: Customized terms agreement text
- **Invoice branding**: DesignWorks footer and description on all invoices
- **Metadata tracking**: Campaign and source tracking on all transactions
- **Customer portal features**: Full self-service subscription management enabled

## 🎨 Manual Stripe Dashboard Configuration

These settings require one-time manual configuration in your Stripe Dashboard:

### 1. Brand Colors & Logo

**URL**: https://dashboard.stripe.com/settings/branding

1. **Primary Brand Color**:
   - Color: `#FF6B35` (Flame Orange)
   - This will be used for buttons, links, and highlights

2. **Upload Logo**:
   - Format: White logo on transparent background (PNG)
   - Recommended size: 512x512px
   - Used on: Checkout pages, invoices, receipts

3. **Upload Icon**:
   - Format: Square icon/favicon (PNG)
   - Recommended size: 128x128px
   - Used on: Browser tabs, mobile apps

### 2. Business Information

**URL**: https://dashboard.stripe.com/settings/public

- **Business Name**: DesignWorks
- **Support Email**: hello@designworks.com
- **Website**: https://designworks.com

This information appears on:
- Receipts
- Invoices
- Customer communications

### 3. Customer Portal Configuration

**URL**: https://dashboard.stripe.com/settings/billing/portal

Enable the following features:

#### ✅ Payment Methods
- Allow customers to update their payment methods
- Show saved payment methods

#### ✅ Subscription Cancellation
- **Mode**: At period end (customers keep access until subscription expires)
- **Collect cancellation reasons**: Enabled
- **Reasons to offer**:
  - Too expensive
  - Missing features
  - Switched to another service
  - Not using the service
  - Customer service
  - Too complex
  - Low quality
  - Other

#### ✅ Subscription Pausing
- Allow customers to pause subscriptions
- **Pause behavior**: Pause at period end

#### ✅ Subscription Updates
- Allow customers to change plans
- **Default allowed updates**: Price, quantity, promotion codes
- **Proration**: Always invoice for prorated amounts

#### ✅ Invoice History
- Show all past invoices
- Allow customers to download PDFs

#### ✅ Customer Information Updates
- Email address
- Billing address
- Phone number
- Tax ID (for EU/UK VAT)

### 4. Checkout Page Settings

**URL**: https://dashboard.stripe.com/settings/checkout

Enable:

- ✅ **Customer creation**: Always create customers
- ✅ **Billing address collection**: Required
- ✅ **Promotion codes**: Allow customers to apply discount codes
- ✅ **Invoice PDFs**: Show invoice PDFs on success page

### 5. Email & Receipt Customization

**URL**: https://dashboard.stripe.com/settings/emails

1. **Accent Color**: Set to `#FF6B35` (Flame Orange)
2. **Email Templates**: Review and customize:
   - Payment confirmations
   - Subscription invoices
   - Failed payment notifications
   - Upcoming invoice reminders

### 6. Statement Descriptors

**URL**: https://dashboard.stripe.com/settings/public

- **Statement Descriptor**: `DESIGNWORKS`
- **Statement Descriptor Suffix**: (leave empty)

This is how charges appear on customer bank/credit card statements:
```
DESIGNWORKS
```

---

## 🧪 Testing Your Branding

### Test Checkout Experience

1. Navigate to: http://localhost:3001/class-of-2025
2. Click "Subscribe Now - £999/mo"
3. You should see:
   - Your brand colors (#FF6B35 for buttons/links)
   - Your logo at the top
   - Custom checkout message at bottom
   - Terms acceptance checkbox with your custom text

### Test Customer Portal

1. Create a test subscription using Stripe test mode
2. Navigate to the customer portal URL
3. Verify all features are enabled:
   - Update payment method
   - Cancel subscription
   - Pause subscription
   - View invoices

### Test Emails

1. Create a test subscription
2. Check the confirmation email for:
   - Proper branding colors
   - Correct business information
   - DesignWorks footer

---

## 📋 Brand Colors Reference

Use these exact colors for consistency:

| Element | Color | Hex Code |
|---------|-------|----------|
| **Primary (CTA)** | Flame Orange | `#FF6B35` |
| **Background** | Ink Black | `#0A0A0A` |
| **Text** | Pearl White | `#FAFAFA` |
| **Cards** | Smoke Gray | `#1A1A1A` |
| **Borders** | Subtle Gray | `#2C2C2C` |

---

## ✨ Result

When configured correctly, your Stripe checkout will:

✅ Match your website's premium dark aesthetic
✅ Show consistent branding across all touchpoints
✅ Provide a seamless experience from landing page → checkout → confirmation
✅ Display professional invoices with your branding
✅ Offer a fully-featured self-service customer portal

---

## 🔗 Quick Links

- **Stripe Dashboard**: https://dashboard.stripe.com
- **Branding Settings**: https://dashboard.stripe.com/settings/branding
- **Customer Portal**: https://dashboard.stripe.com/settings/billing/portal
- **Email Templates**: https://dashboard.stripe.com/settings/emails
- **Checkout Settings**: https://dashboard.stripe.com/settings/checkout

---

## 📞 Need Help?

If you encounter any issues:

1. Check that you're using **live mode** (not test mode) in Dashboard
2. Clear browser cache and try again
3. Test with a different browser/incognito mode
4. Contact Stripe support if branding isn't applying

---

**Last Updated**: December 2025
