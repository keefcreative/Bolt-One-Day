# Enhanced Brevo Integration Setup Guide

This guide walks you through setting up the advanced Brevo integration with native chat widget, automation workflows, and behavioral triggers.

## Overview

The enhanced integration replaces the custom chatbot with Brevo's native Conversations widget and leverages Brevo's full marketing automation platform for:

- **Native Chat Widget**: Brevo's built-in chat with AI-powered responses
- **Behavioral Triggers**: Auto-start conversations based on user behavior
- **Multi-channel Automation**: Email → SMS → WhatsApp follow-up sequences  
- **Lead Scoring**: Automatic qualification based on engagement
- **Real-time Webhooks**: Live conversation tracking and analytics

## Step 1: Brevo Conversations Setup

### 1.1 Enable Conversations in Brevo
1. Log into your Brevo account
2. Navigate to **Conversations** in the main menu
3. Go to **Settings** → **Chat Widget**
4. Complete your profile setup:
   - Company name: DesignWorks
   - Business hours
   - Welcome message
   - Team member profiles

### 1.2 Get Your Conversations ID
1. In **Conversations** → **Settings** → **Chat Widget**
2. Click **Install** → **Manual Installation** 
3. Copy your Conversations ID from the code snippet
4. Add it to your `.env.local` file:
   ```
   NEXT_PUBLIC_BREVO_CONVERSATIONS_ID=your_actual_id_here
   ```

### 1.3 Configure Widget Appearance
The widget is pre-configured to match your design system:
- **Button Style**: Round 
- **Position**: Bottom right
- **Colors**: Flame background (#FF6B35), white text
- **Size**: 400px wide × 600px height

## Step 2: Behavioral Triggers Configuration

### 2.1 Page-Based Triggers
Set up automatic conversation starters in Brevo:

1. Go to **Conversations** → **Settings** → **Behavioral Triggers**
2. Create triggers for:
   - **Pricing Page**: Trigger after 30 seconds on pricing page
   - **Portfolio Engagement**: Trigger after 2+ minutes viewing portfolio
   - **Design for Good**: Trigger after 45 seconds on nonprofit page
   - **Exit Intent**: Trigger when mouse leaves viewport

### 2.2 Visitor Segmentation  
Configure different messages for:
- **New visitors**: General welcome message
- **Return visitors**: "Welcome back" message
- **High-value pages**: Targeted questions about specific services

## Step 3: AI-Powered Chat Scenarios

### 3.1 Set Up Chat Scenarios
1. In Brevo, go to **Conversations** → **Settings** → **Chatbot**
2. Create scenarios based on `/data/brevo-automation-config.json`:
   - Welcome message with quick reply buttons
   - Pricing inquiry flow
   - Portfolio showcase flow
   - Service-specific responses

### 3.2 Quick Reply Buttons
Configure pre-defined responses:
- "I need design help"
- "Tell me about pricing"  
- "I have a specific question"
- "I'm just browsing"

## Step 4: Automation Workflows

### 4.1 Chat Lead Nurture Sequence
Create an automation that triggers when someone starts a chat:

**Trigger**: Contact added to 'chat-conversation' list
**Workflow**:
1. Wait 1 hour
2. Send follow-up email: "Great chatting with you!"
3. Wait 2 days  
4. Send portfolio showcase email (if previous not opened)
5. Wait 3 days
6. Send SMS follow-up (if phone number exists)

### 4.2 High-Intent Lead Fast Track  
For leads mentioning budget, timeline, or "interested":

**Trigger**: Contact added to 'high-intent-chat-leads' list
**Workflow**:
1. Send immediate email: "Let's discuss your project"
2. Create sales task: "High-intent lead - follow up ASAP"  
3. Send personal SMS after 2 hours if no email response

### 4.3 Abandoned Conversation Recovery
**Trigger**: Chat started but no response in 30 minutes
**Actions**:
1. Send chat message: "Still there? Happy to help!"
2. Wait 2 hours
3. Send email: "We missed you in chat"

## Step 5: Lead Scoring Setup

### 5.1 Configure Lead Scoring Rules
Set up point values in Brevo for:
- Visited pricing page: +15 points
- Started chat: +25 points
- Mentioned "interested": +30 points
- Mentioned "budget/timeline": +40 points
- Provided email: +35 points
- Company name mentioned: +25 points

### 5.2 Automatic Lead Qualification
Contacts with 75+ points automatically move to "Qualified Leads" list.

## Step 6: Webhook Configuration

### 6.1 Set Up Conversation Webhooks
1. In Brevo: **Conversations** → **Settings** → **Integrations** → **Webhooks**
2. Add webhook URL: `https://yourdomain.com/api/brevo-conversations-webhook`
3. Select events:
   - `conversation.started`
   - `message.received`
   - `conversation.resolved` 
   - `contact.identified`

### 6.2 Webhook Events Handled
The webhook endpoint processes:
- **Conversation Started**: Create initial lead entry
- **Message Received**: Analyze for high-value keywords
- **Contact Identified**: Update lead with full info
- **Conversation Resolved**: Mark as completed interaction

## Step 7: Multi-Channel Campaigns

### 7.1 Email Templates
Create email templates for:
- `chat-follow-up-1`: Initial follow-up after chat
- `portfolio-showcase`: Work examples and case studies
- `urgent-follow-up`: High-intent lead immediate response
- `missed-chat-follow-up`: Abandoned conversation recovery

### 7.2 SMS Integration
Configure SMS for high-value leads:
- Enable SMS in Brevo settings
- Add SMS credits to account
- Create compliant opt-out messaging

### 7.3 WhatsApp Business (Optional)
For enterprise leads:
- Connect WhatsApp Business account
- Create approval workflows for WhatsApp messages
- Set up template messages

## Step 8: Testing & Optimization

### 8.1 Test Chat Functionality
1. Visit your website incognito
2. Verify chat widget appears with correct styling
3. Test behavioral triggers on different pages
4. Confirm webhook events fire correctly

### 8.2 Analytics Setup
Monitor key metrics:
- Chat engagement rate
- Conversation-to-lead conversion
- Multi-channel campaign performance  
- Lead scoring accuracy

### 8.3 A/B Testing
Test variations of:
- Chat trigger messages
- Response timing
- Quick reply options
- Follow-up email subject lines

## Environment Variables Required

Add these to your `.env.local`:

```bash
# Brevo Core
BREVO_API_KEY=your_api_key
BREVO_SENDER_EMAIL=hello@designworks.com
BREVO_SENDER_NAME=DesignWorks
NOTIFICATION_EMAIL=team@designworks.com

# Brevo Conversations
NEXT_PUBLIC_BREVO_CONVERSATIONS_ID=your_conversations_id

# Optional List IDs
BREVO_CHAT_LEADS_LIST_ID=123
BREVO_HIGH_INTENT_LEADS_LIST_ID=124
BREVO_PAID_CUSTOMERS_LIST_ID=125
```

## Benefits of Enhanced Integration

### Improved User Experience
- **Faster Loading**: Native widget loads instantly
- **AI Responses**: Smarter, contextual replies
- **Mobile Optimized**: Perfect mobile experience

### Better Lead Generation  
- **Behavioral Targeting**: Catch visitors at optimal moments
- **Multi-touch Campaigns**: 3-5x higher conversion rates
- **Automatic Qualification**: Focus on highest-value leads

### Reduced Maintenance
- **No Custom Code**: Brevo handles all chat functionality
- **Built-in Analytics**: Comprehensive reporting included
- **Automatic Updates**: Always latest features and security

### Enhanced ROI
- **Higher Conversion**: AI-optimized response timing
- **Multi-channel**: More touchpoints = more opportunities
- **Advanced Segmentation**: Precise targeting increases relevance

## Support & Resources

- **Brevo Documentation**: https://developers.brevo.com/
- **Conversations Setup**: https://help.brevo.com/hc/en-us/sections/12710617773714
- **Automation Workflows**: https://help.brevo.com/hc/en-us/articles/15445989568402
- **Webhook Reference**: https://developers.brevo.com/docs/conversations-webhooks

This enhanced integration transforms your simple chat widget into a comprehensive customer acquisition and nurturing system leveraging Brevo's full platform capabilities.