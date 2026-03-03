-- Run this in Supabase SQL Editor to create tables for article votes and comments

-- Article votes (validate / invalidate) — one vote per fingerprint per article
CREATE TABLE IF NOT EXISTS article_votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  article_slug TEXT NOT NULL,
  vote_type TEXT NOT NULL CHECK (vote_type IN ('validate', 'invalidate')),
  fingerprint TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(article_slug, fingerprint)
);

-- Article comments
CREATE TABLE IF NOT EXISTS article_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  article_slug TEXT NOT NULL,
  text TEXT NOT NULL,
  fingerprint TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes for fast lookups
CREATE INDEX IF NOT EXISTS idx_article_votes_slug ON article_votes(article_slug);
CREATE INDEX IF NOT EXISTS idx_article_comments_slug ON article_comments(article_slug);

-- RLS: allow public read and insert (anonymous)
ALTER TABLE article_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE article_comments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read votes" ON article_votes;
CREATE POLICY "Allow public read votes" ON article_votes FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public insert votes" ON article_votes;
CREATE POLICY "Allow public insert votes" ON article_votes FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public update votes" ON article_votes;
CREATE POLICY "Allow public update votes" ON article_votes FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Allow public read comments" ON article_comments;
CREATE POLICY "Allow public read comments" ON article_comments FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public insert comments" ON article_comments;
CREATE POLICY "Allow public insert comments" ON article_comments FOR INSERT WITH CHECK (true);
