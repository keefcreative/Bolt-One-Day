import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import campaignData from '@/data/activeCampaign.json'
import type { CampaignConfig } from '@/types/campaign'

const typedCampaignData = campaignData as CampaignConfig

export async function GET(request: NextRequest) {
  if (!stripe) {
    return NextResponse.json(
      { error: 'Stripe is not configured' },
      { status: 500 }
    )
  }

  try {
    const { searchParams } = new URL(request.url)
    const campaignId = searchParams.get('campaign') || 'classOf2025'

    // Get campaign config (only support actual campaign keys, not 'active')
    if (campaignId !== 'classOf2025' && campaignId !== 'designForGood') {
      return NextResponse.json({
        available: false,
        spotsRemaining: 0,
        totalSpots: 0,
        message: 'Invalid campaign ID'
      })
    }

    const campaign = typedCampaignData[campaignId]
    if (!campaign || !campaign.enabled) {
      return NextResponse.json({
        available: false,
        spotsRemaining: 0,
        totalSpots: 0,
        message: 'Campaign is not active'
      })
    }

    // Only classOf2025 has spot tracking with pricing
    if (campaignId !== 'classOf2025') {
      return NextResponse.json({
        available: campaign.enabled,
        spotsRemaining: 0,
        totalSpots: 0,
        message: 'This campaign does not have spot tracking'
      })
    }

    // Type-narrow to ClassOf2025Campaign (we've validated campaignId above)
    const classOf2025Campaign = campaign as import('@/types/campaign').ClassOf2025Campaign

    // Count active subscriptions for this campaign
    // Query by price ID (most reliable method)
    const subscriptions = await stripe.subscriptions.list({
      price: classOf2025Campaign.pricing.stripePriceId,
      status: 'active',
      limit: 100, // Should be enough for 10 spots
    })

    const activeSubscriptions = subscriptions.data.length

    // Calculate remaining spots
    const spotsRemaining = Math.max(0, classOf2025Campaign.totalSpots - activeSubscriptions)
    const spotsAvailable = spotsRemaining > 0

    // Check if deadline has passed
    const deadline = new Date(classOf2025Campaign.deadline)
    const now = new Date()
    const deadlinePassed = now > deadline

    return NextResponse.json({
      available: spotsAvailable && !deadlinePassed,
      spotsRemaining,
      totalSpots: classOf2025Campaign.totalSpots,
      activeSubscriptions,
      deadline: classOf2025Campaign.deadline,
      deadlinePassed,
      priceId: classOf2025Campaign.pricing.stripePriceId,
      message: !spotsAvailable
        ? 'All spots have been filled'
        : deadlinePassed
        ? 'Campaign deadline has passed'
        : `${spotsRemaining} spot${spotsRemaining !== 1 ? 's' : ''} remaining`
    })

  } catch (error: any) {
    console.error('Error fetching campaign spots:', error)
    return NextResponse.json(
      {
        error: 'Failed to fetch campaign availability',
        details: error.message
      },
      { status: 500 }
    )
  }
}

// Optional: POST endpoint to manually refresh campaign status
export async function POST(request: NextRequest) {
  if (!stripe) {
    return NextResponse.json(
      { error: 'Stripe is not configured' },
      { status: 500 }
    )
  }

  try {
    const body = await request.json()
    const { campaignId = 'classOf2025', adminKey } = body as { campaignId?: string; adminKey?: string }

    // Simple admin key check (you should use a real auth system in production)
    if (adminKey !== process.env.ADMIN_API_KEY) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Validate campaign ID
    if (campaignId !== 'classOf2025' && campaignId !== 'designForGood') {
      return NextResponse.json(
        { error: 'Invalid campaign ID' },
        { status: 400 }
      )
    }

    const campaign = typedCampaignData[campaignId as 'classOf2025' | 'designForGood']
    if (!campaign) {
      return NextResponse.json(
        { error: 'Campaign not found' },
        { status: 404 }
      )
    }

    // Only classOf2025 has pricing/spot tracking
    if (campaignId !== 'classOf2025') {
      return NextResponse.json(
        { error: 'This campaign does not have spot tracking' },
        { status: 400 }
      )
    }

    // Type-narrow to ClassOf2025Campaign
    const classOf2025Campaign = campaign as import('@/types/campaign').ClassOf2025Campaign

    // Get all subscriptions for this price
    const subscriptions = await stripe.subscriptions.list({
      price: classOf2025Campaign.pricing.stripePriceId,
      limit: 100,
    })

    // Filter only active ones
    const activeSubscriptions = subscriptions.data.filter(
      sub => sub.status === 'active'
    )

    const activeCount = activeSubscriptions.length
    const spotsRemaining = Math.max(0, classOf2025Campaign.totalSpots - activeCount)

    return NextResponse.json({
      campaignId,
      totalSpots: classOf2025Campaign.totalSpots,
      activeSubscriptions: activeCount,
      spotsRemaining,
      subscribers: activeSubscriptions.map(sub => ({
        id: sub.id,
        customerId: sub.customer,
        status: sub.status,
        created: new Date(sub.created * 1000).toISOString(),
      })),
      shouldDisable: spotsRemaining === 0,
      message: spotsRemaining === 0
        ? 'Campaign should be disabled - all spots filled'
        : `${spotsRemaining} spots still available`
    })

  } catch (error: any) {
    console.error('Error refreshing campaign status:', error)
    return NextResponse.json(
      {
        error: 'Failed to refresh campaign status',
        details: error.message
      },
      { status: 500 }
    )
  }
}
