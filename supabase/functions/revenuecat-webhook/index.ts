import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// RevenueCat webhook event types
type RevenueCatEventType =
  | 'INITIAL_PURCHASE'
  | 'RENEWAL'
  | 'CANCELLATION'
  | 'UNCANCELLATION'
  | 'NON_RENEWING_PURCHASE'
  | 'SUBSCRIPTION_PAUSED'
  | 'EXPIRATION'
  | 'BILLING_ISSUE'
  | 'PRODUCT_CHANGE'
  | 'TRANSFER';

interface RevenueCatWebhookEvent {
  api_version: string;
  event: {
    type: RevenueCatEventType;
    id: string;
    app_id: string;
    app_user_id: string;
    original_app_user_id: string;
    aliases: string[];
    product_id: string;
    entitlement_ids: string[];
    period_type: 'NORMAL' | 'INTRO' | 'TRIAL';
    purchased_at_ms: number;
    expiration_at_ms: number | null;
    store: 'APP_STORE' | 'PLAY_STORE' | 'STRIPE' | 'PROMOTIONAL';
    environment: 'SANDBOX' | 'PRODUCTION';
    is_trial_conversion?: boolean;
    cancel_reason?: string;
    grace_period_expiration_at_ms?: number;
    auto_resume_at_ms?: number;
    presented_offering_id?: string;
  };
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Parse webhook payload
    const payload: RevenueCatWebhookEvent = await req.json();
    const event = payload.event;

    console.log('[RevenueCat Webhook] Received event:', event.type, 'for user:', event.app_user_id);

    // Determine subscription status based on event type
    let status: string;
    let willRenew = true;

    switch (event.type) {
      case 'INITIAL_PURCHASE':
      case 'RENEWAL':
      case 'UNCANCELLATION':
        status = 'active';
        willRenew = true;
        break;

      case 'CANCELLATION':
        // Still active until expiration, but won't renew
        status = 'active';
        willRenew = false;
        break;

      case 'EXPIRATION':
        status = 'expired';
        willRenew = false;
        break;

      case 'BILLING_ISSUE':
        status = 'billing_issue';
        willRenew = true; // Will renew if billing is fixed
        break;

      case 'SUBSCRIPTION_PAUSED':
        status = 'cancelled';
        willRenew = false;
        break;

      case 'PRODUCT_CHANGE':
      case 'NON_RENEWING_PURCHASE':
        status = 'active';
        willRenew = event.type === 'PRODUCT_CHANGE';
        break;

      case 'TRANSFER':
        // Handle transfer - update the user association
        status = 'active';
        willRenew = true;
        break;

      default:
        console.log('[RevenueCat Webhook] Unknown event type:', event.type);
        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }

    // The app_user_id should be the Supabase user ID (we set this in RevenueCatService.login)
    const userId = event.app_user_id;

    // Skip anonymous users (start with $RCAnonymousID:)
    if (userId.startsWith('$RCAnonymousID:')) {
      console.log('[RevenueCat Webhook] Skipping anonymous user');
      return new Response(JSON.stringify({ success: true, message: 'Skipped anonymous user' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Map store names
    const storeMap: Record<string, string> = {
      'APP_STORE': 'app_store',
      'PLAY_STORE': 'play_store',
      'STRIPE': 'stripe',
      'PROMOTIONAL': 'promotional',
    };

    // Prepare subscription data
    const subscriptionData = {
      user_id: userId,
      revenuecat_app_user_id: event.original_app_user_id,
      status,
      entitlement_id: event.entitlement_ids?.[0] || null,
      product_id: event.product_id,
      purchased_at: event.purchased_at_ms ? new Date(event.purchased_at_ms).toISOString() : null,
      expires_at: event.expiration_at_ms ? new Date(event.expiration_at_ms).toISOString() : null,
      is_trial: event.period_type === 'TRIAL',
      will_renew: willRenew,
      original_purchase_date: event.purchased_at_ms ? new Date(event.purchased_at_ms).toISOString() : null,
      latest_purchase_date: new Date().toISOString(),
      store: storeMap[event.store] || 'app_store',
      updated_at: new Date().toISOString(),
    };

    // Upsert subscription record
    const { error } = await supabase
      .from('user_subscriptions')
      .upsert(subscriptionData, {
        onConflict: 'user_id',
      });

    if (error) {
      console.error('[RevenueCat Webhook] Database error:', error);
      
      // If user doesn't exist, log but don't fail
      if (error.code === '23503') { // Foreign key violation
        console.log('[RevenueCat Webhook] User not found in database:', userId);
        return new Response(JSON.stringify({ success: true, message: 'User not found' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      throw error;
    }

    console.log('[RevenueCat Webhook] Successfully updated subscription for user:', userId, 'status:', status);

    return new Response(
      JSON.stringify({ 
        success: true, 
        user_id: userId, 
        status,
        event_type: event.type,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('[RevenueCat Webhook] Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
