// Script to create Stripe Price for Class of 2025 Campaign
// Run with: node scripts/create-class-of-2025-price.js

const Stripe = require('stripe');

if (!process.env.STRIPE_SECRET_KEY) {
  console.error('❌ STRIPE_SECRET_KEY not found in environment variables');
  process.exit(1);
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-11-20.acacia',
});

async function createClassOf2025Price() {
  try {
    console.log('🚀 Creating Class of 2025 Stripe Price...\n');

    // First, get or create the product
    let product;

    // Try to find existing Business DesignWorks product
    const products = await stripe.products.list({ limit: 100 });
    product = products.data.find(p => p.name === 'Business DesignWorks');

    if (!product) {
      console.log('Creating new Business DesignWorks product...');
      product = await stripe.products.create({
        name: 'Business DesignWorks',
        description: 'Two tasks at once, 24-48 hour turnaround, endless revisions',
      });
      console.log('✅ Product created:', product.id);
    } else {
      console.log('✅ Found existing product:', product.id);
    }

    // Create the Class of 2025 price (£999/month = 99900 pence)
    console.log('\nCreating Class of 2025 price at £999/month...');

    const price = await stripe.prices.create({
      product: product.id,
      currency: 'gbp',
      unit_amount: 99900, // £999 in pence
      recurring: {
        interval: 'month',
        interval_count: 1,
      },
      nickname: 'Class of 2025 - Business DesignWorks',
      metadata: {
        campaign: 'classOf2025',
        original_price: '124900',
        savings: '45000',
        deadline: '2025-12-31T23:59:59Z',
        plan_type: 'business',
        promotional: 'true'
      },
    });

    console.log('\n✅ Class of 2025 Price Created Successfully!\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Price ID:', price.id);
    console.log('Amount:', `£${price.unit_amount / 100}/month`);
    console.log('Product:', product.name);
    console.log('Currency:', price.currency.toUpperCase());
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    console.log('📝 Next Steps:');
    console.log('1. Add this price ID to lib/stripe-products.ts');
    console.log('2. Update data/activeCampaign.json with stripePriceId');
    console.log('3. Update app/class-of-2025/page.tsx to use Stripe checkout\n');

    console.log('Copy this for stripe-products.ts:');
    console.log(`  class_of_2025: '${price.id}',\n`);

    return price;
  } catch (error) {
    console.error('❌ Error creating price:', error.message);
    if (error.type) {
      console.error('Error type:', error.type);
    }
    if (error.raw) {
      console.error('Details:', error.raw.message);
    }
    process.exit(1);
  }
}

// Run the script
createClassOf2025Price()
  .then(() => {
    console.log('✅ Script completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Script failed:', error);
    process.exit(1);
  });
