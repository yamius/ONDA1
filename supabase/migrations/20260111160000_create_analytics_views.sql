-- Analytics Views for ONDA
-- Provides ready-to-use reports for key product metrics

-- ============================================
-- 1. ACTIVE USERS (DAU / WAU / MAU)
-- ============================================

-- Daily Active Users
CREATE OR REPLACE VIEW analytics_dau AS
SELECT 
  date_trunc('day', created_at)::date as day,
  COUNT(DISTINCT COALESCE(user_id::text, anonymous_id)) as unique_users,
  COUNT(DISTINCT user_id) as registered_users,
  COUNT(DISTINCT CASE WHEN user_id IS NULL THEN anonymous_id END) as anonymous_users,
  COUNT(*) as total_events
FROM app_events
WHERE created_at > NOW() - INTERVAL '90 days'
GROUP BY 1
ORDER BY 1 DESC;

-- Weekly Active Users
CREATE OR REPLACE VIEW analytics_wau AS
SELECT 
  date_trunc('week', created_at)::date as week_start,
  COUNT(DISTINCT COALESCE(user_id::text, anonymous_id)) as unique_users,
  COUNT(DISTINCT user_id) as registered_users
FROM app_events
WHERE created_at > NOW() - INTERVAL '6 months'
GROUP BY 1
ORDER BY 1 DESC;

-- Monthly Active Users
CREATE OR REPLACE VIEW analytics_mau AS
SELECT 
  date_trunc('month', created_at)::date as month,
  COUNT(DISTINCT COALESCE(user_id::text, anonymous_id)) as unique_users,
  COUNT(DISTINCT user_id) as registered_users
FROM app_events
WHERE created_at > NOW() - INTERVAL '12 months'
GROUP BY 1
ORDER BY 1 DESC;


-- ============================================
-- 2. PRACTICE FUNNEL
-- ============================================

-- Daily practice funnel
CREATE OR REPLACE VIEW analytics_practice_funnel AS
SELECT 
  date_trunc('day', created_at)::date as day,
  COUNT(*) FILTER (WHERE event_name = 'practice_view') as views,
  COUNT(*) FILTER (WHERE event_name = 'practice_start') as starts,
  COUNT(*) FILTER (WHERE event_name = 'practice_pause') as pauses,
  COUNT(*) FILTER (WHERE event_name = 'practice_complete') as completes,
  COUNT(*) FILTER (WHERE event_name = 'practice_abandon') as abandons,
  -- Conversion rates
  ROUND(
    100.0 * COUNT(*) FILTER (WHERE event_name = 'practice_start') / 
    NULLIF(COUNT(*) FILTER (WHERE event_name = 'practice_view'), 0), 1
  ) as view_to_start_pct,
  ROUND(
    100.0 * COUNT(*) FILTER (WHERE event_name = 'practice_complete') / 
    NULLIF(COUNT(*) FILTER (WHERE event_name = 'practice_start'), 0), 1
  ) as start_to_complete_pct
FROM app_events
WHERE event_name LIKE 'practice_%'
  AND created_at > NOW() - INTERVAL '90 days'
GROUP BY 1
ORDER BY 1 DESC;

-- Practice completion by practice_id
CREATE OR REPLACE VIEW analytics_practice_performance AS
SELECT 
  metadata->>'practice_id' as practice_id,
  COUNT(*) FILTER (WHERE event_name = 'practice_start') as starts,
  COUNT(*) FILTER (WHERE event_name = 'practice_complete') as completes,
  COUNT(*) FILTER (WHERE event_name = 'practice_abandon') as abandons,
  ROUND(
    100.0 * COUNT(*) FILTER (WHERE event_name = 'practice_complete') / 
    NULLIF(COUNT(*) FILTER (WHERE event_name = 'practice_start'), 0), 1
  ) as completion_rate_pct
FROM app_events
WHERE event_name LIKE 'practice_%'
  AND metadata->>'practice_id' IS NOT NULL
  AND created_at > NOW() - INTERVAL '30 days'
GROUP BY 1
ORDER BY starts DESC;


-- ============================================
-- 3. USER RETENTION (Cohort Analysis)
-- ============================================

-- User first seen date (cohort assignment)
CREATE OR REPLACE VIEW analytics_user_cohorts AS
SELECT 
  COALESCE(user_id::text, anonymous_id) as user_identifier,
  MIN(date_trunc('week', created_at))::date as cohort_week,
  MIN(created_at) as first_seen
FROM app_events
GROUP BY 1;

-- Weekly retention by cohort
CREATE OR REPLACE VIEW analytics_retention_weekly AS
WITH user_cohorts AS (
  SELECT 
    COALESCE(user_id::text, anonymous_id) as user_identifier,
    MIN(date_trunc('week', created_at))::date as cohort_week
  FROM app_events
  GROUP BY 1
),
user_activity AS (
  SELECT DISTINCT
    COALESCE(user_id::text, anonymous_id) as user_identifier,
    date_trunc('week', created_at)::date as activity_week
  FROM app_events
)
SELECT 
  uc.cohort_week,
  COUNT(DISTINCT uc.user_identifier) as cohort_size,
  COUNT(DISTINCT CASE WHEN ua.activity_week = uc.cohort_week THEN uc.user_identifier END) as week_0,
  COUNT(DISTINCT CASE WHEN ua.activity_week = uc.cohort_week + INTERVAL '1 week' THEN uc.user_identifier END) as week_1,
  COUNT(DISTINCT CASE WHEN ua.activity_week = uc.cohort_week + INTERVAL '2 weeks' THEN uc.user_identifier END) as week_2,
  COUNT(DISTINCT CASE WHEN ua.activity_week = uc.cohort_week + INTERVAL '3 weeks' THEN uc.user_identifier END) as week_3,
  COUNT(DISTINCT CASE WHEN ua.activity_week = uc.cohort_week + INTERVAL '4 weeks' THEN uc.user_identifier END) as week_4,
  -- Retention percentages
  ROUND(100.0 * COUNT(DISTINCT CASE WHEN ua.activity_week = uc.cohort_week + INTERVAL '1 week' THEN uc.user_identifier END) / 
    NULLIF(COUNT(DISTINCT uc.user_identifier), 0), 1) as retention_week_1_pct,
  ROUND(100.0 * COUNT(DISTINCT CASE WHEN ua.activity_week = uc.cohort_week + INTERVAL '4 weeks' THEN uc.user_identifier END) / 
    NULLIF(COUNT(DISTINCT uc.user_identifier), 0), 1) as retention_week_4_pct
FROM user_cohorts uc
LEFT JOIN user_activity ua ON uc.user_identifier = ua.user_identifier
WHERE uc.cohort_week > NOW() - INTERVAL '3 months'
GROUP BY 1
ORDER BY 1 DESC;


-- ============================================
-- 4. PLATFORM & VERSION BREAKDOWN
-- ============================================

CREATE OR REPLACE VIEW analytics_platforms AS
SELECT 
  date_trunc('day', created_at)::date as day,
  platform,
  COUNT(DISTINCT COALESCE(user_id::text, anonymous_id)) as unique_users,
  COUNT(*) as events
FROM app_events
WHERE created_at > NOW() - INTERVAL '30 days'
GROUP BY 1, 2
ORDER BY 1 DESC, 3 DESC;

CREATE OR REPLACE VIEW analytics_app_versions AS
SELECT 
  app_version,
  platform,
  COUNT(DISTINCT COALESCE(user_id::text, anonymous_id)) as unique_users,
  COUNT(*) as events,
  MIN(created_at)::date as first_seen,
  MAX(created_at)::date as last_seen
FROM app_events
WHERE created_at > NOW() - INTERVAL '30 days'
  AND app_version IS NOT NULL
GROUP BY 1, 2
ORDER BY events DESC;


-- ============================================
-- 5. EVENT BREAKDOWN
-- ============================================

-- Events summary by type
CREATE OR REPLACE VIEW analytics_events_summary AS
SELECT 
  event_name,
  COUNT(*) as total_count,
  COUNT(DISTINCT COALESCE(user_id::text, anonymous_id)) as unique_users,
  COUNT(*) FILTER (WHERE created_at > NOW() - INTERVAL '1 day') as last_24h,
  COUNT(*) FILTER (WHERE created_at > NOW() - INTERVAL '7 days') as last_7d,
  COUNT(*) FILTER (WHERE created_at > NOW() - INTERVAL '30 days') as last_30d
FROM app_events
GROUP BY 1
ORDER BY total_count DESC;

-- Hourly event distribution (for understanding usage patterns)
CREATE OR REPLACE VIEW analytics_hourly_distribution AS
SELECT 
  EXTRACT(hour FROM created_at) as hour_utc,
  event_name,
  COUNT(*) as event_count
FROM app_events
WHERE created_at > NOW() - INTERVAL '7 days'
GROUP BY 1, 2
ORDER BY 1, 3 DESC;


-- ============================================
-- 6. ONBOARDING FUNNEL
-- ============================================

CREATE OR REPLACE VIEW analytics_onboarding_funnel AS
SELECT 
  date_trunc('day', created_at)::date as day,
  COUNT(*) FILTER (WHERE event_name = 'app_open') as app_opens,
  COUNT(*) FILTER (WHERE event_name = 'onboarding_start') as onboarding_starts,
  COUNT(*) FILTER (WHERE event_name = 'onboarding_complete') as onboarding_completes,
  COUNT(*) FILTER (WHERE event_name = 'sign_up') as sign_ups,
  COUNT(*) FILTER (WHERE event_name = 'sign_in') as sign_ins,
  COUNT(*) FILTER (WHERE event_name = 'health_permission_granted') as health_permissions,
  COUNT(*) FILTER (WHERE event_name = 'watch_connection_success') as watch_connections
FROM app_events
WHERE created_at > NOW() - INTERVAL '30 days'
GROUP BY 1
ORDER BY 1 DESC;


-- ============================================
-- 7. ERRORS & HEALTH
-- ============================================

CREATE OR REPLACE VIEW analytics_errors AS
SELECT 
  date_trunc('day', created_at)::date as day,
  metadata->>'error_type' as error_type,
  metadata->>'message' as error_message,
  platform,
  app_version,
  COUNT(*) as error_count,
  COUNT(DISTINCT COALESCE(user_id::text, anonymous_id)) as affected_users
FROM app_events
WHERE event_name IN ('error', 'audio_load_error', 'api_error')
  AND created_at > NOW() - INTERVAL '7 days'
GROUP BY 1, 2, 3, 4, 5
ORDER BY 1 DESC, error_count DESC;

-- Error rate by day
CREATE OR REPLACE VIEW analytics_error_rate AS
SELECT 
  date_trunc('day', created_at)::date as day,
  COUNT(*) as total_events,
  COUNT(*) FILTER (WHERE event_name IN ('error', 'audio_load_error', 'api_error')) as error_events,
  ROUND(
    100.0 * COUNT(*) FILTER (WHERE event_name IN ('error', 'audio_load_error', 'api_error')) / 
    NULLIF(COUNT(*), 0), 2
  ) as error_rate_pct
FROM app_events
WHERE created_at > NOW() - INTERVAL '30 days'
GROUP BY 1
ORDER BY 1 DESC;


-- ============================================
-- 8. GAMIFICATION & ENGAGEMENT
-- ============================================

CREATE OR REPLACE VIEW analytics_ond_earned AS
SELECT 
  date_trunc('day', created_at)::date as day,
  COUNT(*) as ond_earn_events,
  COUNT(DISTINCT COALESCE(user_id::text, anonymous_id)) as users_earning,
  SUM((metadata->>'amount')::numeric) as total_ond_earned
FROM app_events
WHERE event_name = 'ond_earned'
  AND created_at > NOW() - INTERVAL '30 days'
GROUP BY 1
ORDER BY 1 DESC;

CREATE OR REPLACE VIEW analytics_level_ups AS
SELECT 
  date_trunc('day', created_at)::date as day,
  metadata->>'new_level' as new_level,
  COUNT(*) as level_up_count,
  COUNT(DISTINCT user_id) as unique_users
FROM app_events
WHERE event_name = 'level_up'
  AND created_at > NOW() - INTERVAL '30 days'
GROUP BY 1, 2
ORDER BY 1 DESC;


-- ============================================
-- 9. UTM / ATTRIBUTION
-- ============================================

CREATE OR REPLACE VIEW analytics_attribution AS
SELECT 
  utm_source,
  utm_medium,
  utm_campaign,
  COUNT(DISTINCT COALESCE(user_id::text, anonymous_id)) as unique_users,
  COUNT(*) FILTER (WHERE event_name = 'sign_up') as sign_ups,
  COUNT(*) FILTER (WHERE event_name = 'practice_complete') as practices_completed
FROM app_events
WHERE utm_source IS NOT NULL
  AND created_at > NOW() - INTERVAL '90 days'
GROUP BY 1, 2, 3
ORDER BY unique_users DESC;


-- ============================================
-- 10. REAL-TIME DASHBOARD (last 24h)
-- ============================================

CREATE OR REPLACE VIEW analytics_realtime AS
SELECT 
  date_trunc('hour', created_at) as hour,
  COUNT(*) as events,
  COUNT(DISTINCT COALESCE(user_id::text, anonymous_id)) as unique_users,
  COUNT(*) FILTER (WHERE event_name = 'practice_start') as practices_started,
  COUNT(*) FILTER (WHERE event_name = 'practice_complete') as practices_completed,
  COUNT(*) FILTER (WHERE event_name LIKE 'error%') as errors
FROM app_events
WHERE created_at > NOW() - INTERVAL '24 hours'
GROUP BY 1
ORDER BY 1 DESC;


-- ============================================
-- 11. KEY METRICS SUMMARY (Executive Dashboard)
-- ============================================

CREATE OR REPLACE VIEW analytics_key_metrics AS
SELECT
  -- Today
  COUNT(DISTINCT COALESCE(user_id::text, anonymous_id)) 
    FILTER (WHERE created_at > NOW() - INTERVAL '1 day') as dau_today,
  COUNT(*) FILTER (WHERE event_name = 'practice_complete' AND created_at > NOW() - INTERVAL '1 day') as practices_today,
  COUNT(*) FILTER (WHERE event_name = 'sign_up' AND created_at > NOW() - INTERVAL '1 day') as signups_today,
  
  -- This week
  COUNT(DISTINCT COALESCE(user_id::text, anonymous_id)) 
    FILTER (WHERE created_at > NOW() - INTERVAL '7 days') as wau_week,
  COUNT(*) FILTER (WHERE event_name = 'practice_complete' AND created_at > NOW() - INTERVAL '7 days') as practices_week,
  COUNT(*) FILTER (WHERE event_name = 'sign_up' AND created_at > NOW() - INTERVAL '7 days') as signups_week,
  
  -- This month
  COUNT(DISTINCT COALESCE(user_id::text, anonymous_id)) 
    FILTER (WHERE created_at > NOW() - INTERVAL '30 days') as mau_month,
  COUNT(*) FILTER (WHERE event_name = 'practice_complete' AND created_at > NOW() - INTERVAL '30 days') as practices_month,
  COUNT(*) FILTER (WHERE event_name = 'sign_up' AND created_at > NOW() - INTERVAL '30 days') as signups_month,
  
  -- Totals
  COUNT(DISTINCT user_id) as total_registered_users,
  COUNT(*) as total_events
FROM app_events;


-- ============================================
-- Grant access to authenticated users (for admin role check later)
-- ============================================

-- Note: These views use service_role by default
-- For a proper admin panel, you'd add RLS or check user role

COMMENT ON VIEW analytics_dau IS 'Daily Active Users - last 90 days';
COMMENT ON VIEW analytics_wau IS 'Weekly Active Users - last 6 months';
COMMENT ON VIEW analytics_mau IS 'Monthly Active Users - last 12 months';
COMMENT ON VIEW analytics_practice_funnel IS 'Practice conversion funnel by day';
COMMENT ON VIEW analytics_practice_performance IS 'Performance metrics per practice';
COMMENT ON VIEW analytics_retention_weekly IS 'Weekly cohort retention analysis';
COMMENT ON VIEW analytics_platforms IS 'User breakdown by platform';
COMMENT ON VIEW analytics_events_summary IS 'Event counts by type';
COMMENT ON VIEW analytics_onboarding_funnel IS 'Onboarding conversion funnel';
COMMENT ON VIEW analytics_errors IS 'Error breakdown for debugging';
COMMENT ON VIEW analytics_key_metrics IS 'Executive summary - key metrics';
COMMENT ON VIEW analytics_realtime IS 'Last 24 hours activity';
