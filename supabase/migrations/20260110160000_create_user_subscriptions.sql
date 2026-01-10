-- Create user_subscriptions table for tracking subscription status from RevenueCat
CREATE TABLE IF NOT EXISTS user_subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- RevenueCat data
    revenuecat_app_user_id TEXT,
    
    -- Subscription status
    status TEXT NOT NULL DEFAULT 'inactive' CHECK (status IN ('active', 'expired', 'cancelled', 'billing_issue', 'inactive')),
    
    -- Entitlement info
    entitlement_id TEXT,
    product_id TEXT,
    
    -- Dates
    purchased_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ,
    
    -- Billing
    is_trial BOOLEAN DEFAULT false,
    will_renew BOOLEAN DEFAULT true,
    
    -- Metadata from RevenueCat webhook
    original_purchase_date TIMESTAMPTZ,
    latest_purchase_date TIMESTAMPTZ,
    store TEXT CHECK (store IN ('app_store', 'play_store', 'stripe', 'promotional')),
    
    -- Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    -- Ensure one subscription record per user
    CONSTRAINT unique_user_subscription UNIQUE (user_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_user_id ON user_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_status ON user_subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_expires_at ON user_subscriptions(expires_at);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_revenuecat_id ON user_subscriptions(revenuecat_app_user_id);

-- Enable RLS
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;

-- Users can read their own subscription
CREATE POLICY "Users can view their own subscription"
    ON user_subscriptions FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

-- Service role can do everything (for webhooks)
CREATE POLICY "Service role has full access to subscriptions"
    ON user_subscriptions FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_user_subscriptions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
DROP TRIGGER IF EXISTS trigger_update_user_subscriptions_updated_at ON user_subscriptions;
CREATE TRIGGER trigger_update_user_subscriptions_updated_at
    BEFORE UPDATE ON user_subscriptions
    FOR EACH ROW
    EXECUTE FUNCTION update_user_subscriptions_updated_at();

-- Create function to check if user has active subscription
CREATE OR REPLACE FUNCTION is_user_subscribed(check_user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM user_subscriptions
        WHERE user_id = check_user_id
        AND status = 'active'
        AND (expires_at IS NULL OR expires_at > NOW())
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
