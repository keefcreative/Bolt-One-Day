# Stripe Webhook Testing Guide

Complete guide for testing Stripe webhooks locally using ngrok or Stripe CLI.

## Quick Setup

### Option 1: Using ngrok (Recommended for consistency with Brevo)

Since you're already using ngrok for Brevo webhooks, you can use the same approach for Stripe.

#### Step 1: Start your development server
```bash
npm run dev
# Server runs on http://localhost:3000 (or 3001 if 3000 is in use)
```

#### Step 2: Start ngrok tunnel
```bash
# If your server is on port 3000
ngrok http 3000

# If your server is on port 3001
ngrok http 3001
```

You'll see output like:
```
Session Status                online
Account                       your-email@example.com (Plan: Free)
Version                       3.18.4
Region                        United States (us)
Forwarding                    https://abc123.ngrok-free.app -> http://localhost:3000
```

#### Step 3: Configure Stripe Webhook Endpoint

1. Go to [Stripe Dashboard → Webhooks](https://dashboard.stripe.com/webhooks)
2. Click **"Add endpoint"**
3. **Endpoint URL**: `https://YOUR-NGROK-ID.ngrok-free.app/api/stripe-webhook`
   - Example: `https://abc123.ngrok-free.app/api/stripe-webhook`
4. **Select events to listen for**:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
   - `customer.created`
   - `customer.updated`

#### Step 4: Get Webhook Signing Secret

1. After creating the endpoint, click on it
2. Click **"Reveal"** under Signing secret
3. Copy the secret (starts with `whsec_`)
4. Add to your `.env.local`:
```bash
STRIPE_WEBHOOK_SECRET=whsec_your_signing_secret_here
```

#### Step 5: Restart your dev server
```bash
# Ctrl+C to stop, then:
npm run dev
```

---

### Option 2: Using Stripe CLI (Easier for testing)

The Stripe CLI automatically handles webhook forwarding without needing to configure endpoints in the dashboard.

#### Step 1: Install Stripe CLI

**macOS (Homebrew):**
```bash
brew install stripe/stripe-cli/stripe
```

**Windows/Linux:**
Download from [https://stripe.com/docs/stripe-cli](https://stripe.com/docs/stripe-cli)

#### Step 2: Login to Stripe
```bash
stripe login
# Opens browser for authentication
```

#### Step 3: Start webhook forwarding
```bash
stripe listen --forward-to localhost:3000/api/stripe-webhook

# Output:
# Ready! Your webhook signing secret is whsec_test_abc123...
```

#### Step 4: Use the temporary signing secret
Copy the `whsec_test_...` secret from the output and add to `.env.local`:
```bash
STRIPE_WEBHOOK_SECRET=whsec_test_your_temporary_secret
```

#### Step 5: Trigger test events
In a new terminal:
```bash
# Test subscription creation
stripe trigger customer.subscription.created

# Test successful payment
stripe trigger invoice.payment_succeeded

# Test failed payment
stripe trigger invoice.payment_failed

# Test checkout completion
stripe trigger checkout.session.completed
```

---

## Testing Your Integration

### 1. Create a Test Subscription

```bash
# Using Stripe CLI to create a test customer and subscription
stripe customers create \
  --email="test@example.com" \
  --name="Test Customer"

# Note the customer ID (cus_xxx), then create a subscription
stripe subscriptions create \
  --customer="cus_xxx" \
  --items[0][price]="price_xxx"
```

### 2. Monitor Webhook Events

**In your terminal running the dev server, you should see:**
```
Stripe webhook received: customer.subscription.created
Creating/updating Brevo contact: test@example.com
Sending welcome email to: test@example.com
```

### 3. Check Brevo Integration

1. Go to your [Brevo Dashboard](https://app.brevo.com)
2. Check Contacts → should see the test customer
3. Check Email logs → should see welcome email sent

### 4. Test Different Scenarios

**Successful Payment:**
```bash
stripe trigger invoice.payment_succeeded
```

**Failed Payment:**
```bash
stripe trigger invoice.payment_failed
```

**Subscription Cancellation:**
```bash
stripe trigger customer.subscription.deleted
```

---

## Troubleshooting

### Common Issues

#### "Webhook signature verification failed"
- Make sure `STRIPE_WEBHOOK_SECRET` in `.env.local` matches the signing secret
- For ngrok: Use the secret from Stripe Dashboard
- For CLI: Use the secret shown when running `stripe listen`

#### "No signature provided"
- Check that your webhook URL is correct
- Ensure ngrok is still running
- Verify the endpoint URL in Stripe Dashboard

#### Events not showing up
- Check ngrok web interface: http://127.0.0.1:4040
- Verify your server is running on the correct port
- Check console for any error messages

### Debugging Tips

1. **View ngrok requests:**
   - Open http://127.0.0.1:4040 in your browser
   - See all incoming requests and responses

2. **Stripe Dashboard Event Log:**
   - Go to [Stripe Webhooks](https://dashboard.stripe.com/webhooks)
   - Click on your endpoint
   - View "Recent deliveries" for success/failure status

3. **Console Logging:**
   Add to your webhook handler for debugging:
   ```typescript
   console.log('Event type:', event.type)
   console.log('Event data:', JSON.stringify(event.data.object, null, 2))
   ```

---

## Production Setup

When deploying to production (Vercel):

1. **Add production webhook endpoint:**
   ```
   https://designworksbureau.co.uk/api/stripe-webhook
   ```

2. **Use production webhook secret:**
   ```bash
   # In Vercel environment variables
   STRIPE_WEBHOOK_SECRET=whsec_production_secret
   ```

3. **Enable all required events** for production endpoint

4. **Remove test endpoints** from Stripe Dashboard

---

## Security Notes

- **Never commit webhook secrets** to git
- **Use different secrets** for development and production
- **Verify signatures** on all webhook requests (already implemented)
- **Return 200 OK quickly** to prevent Stripe retries
- **Log but don't expose** sensitive customer data

---

## Quick Reference

### Environment Variables Needed
```bash
# Stripe API Keys
STRIPE_SECRET_KEY=sk_live_xxx  # or sk_test_xxx for testing
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxx  # or pk_test_xxx

# Webhook Secret (different for each endpoint)
STRIPE_WEBHOOK_SECRET=whsec_xxx
```

### Test Card Numbers
```
Success: 4242 4242 4242 4242
Decline: 4000 0000 0000 0002
3D Secure: 4000 0000 0000 3220
```

### Useful Stripe CLI Commands
```bash
# View recent events
stripe events list

# Replay a specific event
stripe events resend evt_xxx

# Create test data
stripe fixtures ./test/fixtures.json

# Tail logs in real-time
stripe logs tail
```

This setup allows you to fully test your Stripe integration locally before deploying to production!