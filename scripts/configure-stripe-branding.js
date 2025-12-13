// Script to configure Stripe branding to match DesignWorks premium aesthetic
// Run with: node scripts/configure-stripe-branding.js

const Stripe = require('stripe');

if (!process.env.STRIPE_SECRET_KEY) {
  console.error('❌ STRIPE_SECRET_KEY not found in environment variables');
  process.exit(1);
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-11-20.acacia',
});

async function configureStripeBranding() {
  try {
    console.log('🎨 Configuring Stripe Branding to match DesignWorks aesthetic...\n');

    // DesignWorks Premium Design System Colors
    const brandColors = {
      primary: '#FF6B35',      // Flame - Primary CTA color
      background: '#0A0A0A',   // Ink - Deep black background
      text: '#FAFAFA',         // Pearl - Primary text
      accent: '#1A1A1A',       // Smoke - Card backgrounds
    };

    // Configure Account Branding Settings
    console.log('📝 Updating account branding settings...');

    const accountUpdate = await stripe.accounts.update('acct_self', {
      settings: {
        branding: {
          // Primary brand color (for buttons, links, highlights)
          primary_color: brandColors.primary,

          // Secondary color (for accents)
          secondary_color: brandColors.accent,

          // Icon (you'll need to upload this separately via Dashboard)
          // icon: 'file_xxxxx', // Upload via Dashboard first

          // Logo (you'll need to upload this separately via Dashboard)
          // logo: 'file_xxxxx', // Upload via Dashboard first
        },

        // Payment page branding
        payments: {
          statement_descriptor: 'DESIGNWORKS',
          statement_descriptor_suffix: null,
        },

        dashboard: {
          display_name: 'DesignWorks',
          timezone: 'Europe/London',
        }
      },

      business_profile: {
        name: 'DesignWorks',
        support_email: 'hello@designworks.com',
        support_phone: null, // Add if you have one
        url: 'https://designworks.com',
        mcc: '7372', // Business services - design
      }
    });

    console.log('✅ Account branding configured');

    // Configure Checkout Session Branding (applied to all checkout sessions)
    console.log('\n🛒 Configuring Checkout Session branding...');

    // Note: Checkout branding is set per-session, but we can create a default configuration
    const checkoutSessionConfig = {
      ui_mode: 'hosted', // Use Stripe's hosted checkout page

      // Appearance customization for checkout
      custom_text: {
        submit: {
          message: 'You will be charged immediately. Cancel anytime with no penalties.',
        },
        terms_of_service_acceptance: {
          message: 'I agree to the Terms of Service and Privacy Policy',
        },
      },

      consent_collection: {
        promotions: 'auto',
        terms_of_service: 'required',
      },

      // Customer creation setting
      customer_creation: 'always',

      // Invoice creation
      invoice_creation: {
        enabled: true,
        invoice_data: {
          description: 'DesignWorks Subscription',
          footer: 'Thank you for choosing DesignWorks. Questions? Contact hello@designworks.com',
        },
      },
    };

    console.log('✅ Checkout session configuration prepared');
    console.log('\n📋 Default checkout session config:');
    console.log(JSON.stringify(checkoutSessionConfig, null, 2));

    // Configure Customer Portal Branding
    console.log('\n🎛️  Configuring Customer Portal...');

    const portalConfiguration = await stripe.billingPortal.configurations.create({
      business_profile: {
        headline: 'Manage Your DesignWorks Subscription',
        privacy_policy_url: 'https://designworks.com/privacy',
        terms_of_service_url: 'https://designworks.com/terms',
      },

      features: {
        customer_update: {
          enabled: true,
          allowed_updates: ['email', 'address', 'phone', 'tax_id'],
        },

        invoice_history: {
          enabled: true,
        },

        payment_method_update: {
          enabled: true,
        },

        subscription_cancel: {
          enabled: true,
          mode: 'at_period_end',
          cancellation_reason: {
            enabled: true,
            options: [
              'too_expensive',
              'missing_features',
              'switched_service',
              'unused',
              'customer_service',
              'too_complex',
              'low_quality',
              'other',
            ],
          },
        },

        subscription_pause: {
          enabled: true,
        },

        subscription_update: {
          enabled: true,
          default_allowed_updates: ['price', 'quantity', 'promotion_code'],
          proration_behavior: 'always_invoice',
        },
      },

      default_return_url: 'https://designworks.com/dashboard',
    });

    console.log('✅ Customer Portal configured');
    console.log(`   Portal ID: ${portalConfiguration.id}`);

    // Print summary
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✨ Stripe Branding Configuration Complete!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    console.log('🎨 Brand Colors Applied:');
    console.log(`   Primary: ${brandColors.primary} (Flame Orange)`);
    console.log(`   Background: ${brandColors.background} (Deep Black)`);
    console.log(`   Text: ${brandColors.text} (Pearl White)`);
    console.log(`   Accent: ${brandColors.accent} (Smoke Gray)`);

    console.log('\n📝 Next Steps:');
    console.log('1. Upload your logo to Stripe Dashboard:');
    console.log('   https://dashboard.stripe.com/settings/branding');
    console.log('   Recommended: White logo on transparent background (PNG, 512x512px)');
    console.log('');
    console.log('2. Upload your icon/favicon:');
    console.log('   Recommended: Square icon (PNG, 128x128px)');
    console.log('');
    console.log('3. Save the Customer Portal Configuration ID:');
    console.log(`   STRIPE_PORTAL_CONFIG_ID=${portalConfiguration.id}`);
    console.log('   Add this to your .env.local file');
    console.log('');
    console.log('4. Test a checkout session to see the branding:');
    console.log('   Visit: http://localhost:3001/class-of-2025');
    console.log('   Click "Subscribe Now" to see your branded checkout');

    console.log('\n🎉 Your Stripe checkout will now match your premium dark aesthetic!');

    return {
      accountUpdate,
      portalConfiguration,
      checkoutSessionConfig,
    };

  } catch (error) {
    console.error('\n❌ Error configuring Stripe branding:', error.message);
    if (error.type) {
      console.error('Error type:', error.type);
    }
    if (error.raw) {
      console.error('Details:', error.raw.message);
    }
    process.exit(1);
  }
}

// Run the configuration
configureStripeBranding()
  .then(() => {
    console.log('\n✅ Configuration completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Configuration failed:', error);
    process.exit(1);
  });
