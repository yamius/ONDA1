# Analytics Views Guide

> **⚠️ Event-name drift:** some SQL below uses pre-cleanup event names
> (`practice_view`, old onboarding→sign_up shape). The canonical event schema is
> [`../architecture/analytics.md`](../architecture/analytics.md) — `practice_view`
> was retired (folded into `practice_start`); the funnel is `onboarding_start →
> onboarding_complete → first_practice_complete → paywall_view → purchase`. Adjust
> queries to the canon.

This guide explains how to use the built-in analytics views in Supabase to track ONDA metrics.

## Quick Start

Go to **Supabase Dashboard** → **SQL Editor** and run queries against the views.

---

## Available Views

### Executive Summary

```sql
-- One row with all key metrics
SELECT * FROM analytics_key_metrics;
```

Returns:
- `dau_today`, `wau_week`, `mau_month` — active users
- `practices_today/week/month` — completed practices
- `signups_today/week/month` — new registrations
- `total_registered_users`, `total_events`

---

### Active Users (DAU/WAU/MAU)

```sql
-- Daily Active Users (last 90 days)
SELECT * FROM analytics_dau LIMIT 30;

-- Weekly Active Users
SELECT * FROM analytics_wau LIMIT 12;

-- Monthly Active Users  
SELECT * FROM analytics_mau;
```

---

### Practice Funnel

```sql
-- Daily practice funnel with conversion rates
SELECT * FROM analytics_practice_funnel LIMIT 14;

-- Which practices have best completion rates?
SELECT * FROM analytics_practice_performance;
```

**Key metrics:**
- `view_to_start_pct` — Are users clicking "Start"?
- `start_to_complete_pct` — Are users finishing practices?

---

### User Retention

```sql
-- Weekly cohort retention
SELECT * FROM analytics_retention_weekly;
```

Shows for each week's cohort:
- How many came back in week 1, 2, 3, 4
- `retention_week_1_pct` — First week retention (target: >40%)
- `retention_week_4_pct` — Month retention (target: >20%)

---

### Onboarding Funnel

```sql
SELECT * FROM analytics_onboarding_funnel LIMIT 7;
```

Track conversion through:
`app_open` → `onboarding_start` → `onboarding_complete` → `sign_up` → `health_permission` → `watch_connection`

---

### Platform Breakdown

```sql
-- Users by platform (ios/android/web)
SELECT * FROM analytics_platforms WHERE day > CURRENT_DATE - 7;

-- App version distribution
SELECT * FROM analytics_app_versions;
```

---

### Error Monitoring

```sql
-- Recent errors grouped
SELECT * FROM analytics_errors;

-- Error rate trend
SELECT * FROM analytics_error_rate LIMIT 14;
```

**Alert if `error_rate_pct` > 5%**

---

### Gamification

```sql
-- OND earning trends
SELECT * FROM analytics_ond_earned LIMIT 14;

-- Level progression
SELECT * FROM analytics_level_ups;
```

---

### Real-time (Last 24h)

```sql
SELECT * FROM analytics_realtime;
```

Hourly breakdown of activity for live monitoring.

---

### Attribution (UTM)

```sql
SELECT * FROM analytics_attribution;
```

See which marketing campaigns drive sign-ups and engagement.

---

## Common Queries

### Power Users (most practices completed)

```sql
SELECT 
  user_id,
  COUNT(*) as practices_completed
FROM app_events
WHERE event_name = 'practice_complete'
  AND user_id IS NOT NULL
GROUP BY user_id
ORDER BY practices_completed DESC
LIMIT 20;
```

### Conversion: Anonymous → Registered

```sql
SELECT 
  date_trunc('day', created_at)::date as day,
  COUNT(DISTINCT anonymous_id) as anonymous_users,
  COUNT(DISTINCT user_id) as registered_users,
  ROUND(100.0 * COUNT(DISTINCT user_id) / NULLIF(COUNT(DISTINCT anonymous_id), 0), 1) as conversion_pct
FROM app_events
WHERE created_at > NOW() - INTERVAL '30 days'
GROUP BY 1
ORDER BY 1 DESC;
```

### Session Duration (approximate)

```sql
WITH sessions AS (
  SELECT 
    session_id,
    MIN(created_at) as session_start,
    MAX(created_at) as session_end,
    COUNT(*) as events
  FROM app_events
  WHERE session_id IS NOT NULL
    AND created_at > NOW() - INTERVAL '7 days'
  GROUP BY session_id
)
SELECT 
  date_trunc('day', session_start)::date as day,
  COUNT(*) as sessions,
  ROUND(AVG(EXTRACT(EPOCH FROM (session_end - session_start)) / 60), 1) as avg_duration_min,
  ROUND(AVG(events), 1) as avg_events_per_session
FROM sessions
WHERE session_end > session_start
GROUP BY 1
ORDER BY 1 DESC;
```

### Stickiness (DAU/MAU ratio)

```sql
WITH daily AS (
  SELECT COUNT(DISTINCT COALESCE(user_id::text, anonymous_id)) as dau
  FROM app_events WHERE created_at > NOW() - INTERVAL '1 day'
),
monthly AS (
  SELECT COUNT(DISTINCT COALESCE(user_id::text, anonymous_id)) as mau
  FROM app_events WHERE created_at > NOW() - INTERVAL '30 days'
)
SELECT 
  dau, 
  mau, 
  ROUND(100.0 * dau / NULLIF(mau, 0), 1) as stickiness_pct
FROM daily, monthly;
```

**Good stickiness: >20%** (means users come back frequently)

---

## Setting Up Alerts

You can create a simple alert system with Supabase Edge Functions:

```typescript
// Check error rate and send alert if too high
const { data } = await supabase
  .from('analytics_error_rate')
  .select('*')
  .limit(1)
  .single();

if (data.error_rate_pct > 5) {
  // Send Slack/email alert
}
```

---

## Recommended Dashboard Structure

### Daily Check (5 min)
1. `analytics_key_metrics` — Overall health
2. `analytics_realtime` — Any spikes/issues?
3. `analytics_errors` — New errors?

### Weekly Review (15 min)
1. `analytics_dau` — User growth trend
2. `analytics_practice_funnel` — Engagement quality
3. `analytics_retention_weekly` — Are users coming back?

### Monthly Deep Dive
1. Full cohort analysis
2. Practice performance optimization
3. Platform/version analysis

---

## Next Steps

When you outgrow SQL queries, consider:
- **Metabase** — Free BI tool, beautiful dashboards
- **PostHog** — Product analytics with built-in funnels
- **Amplitude** — Advanced behavioral analytics
