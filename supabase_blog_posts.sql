-- ═══════════════════════════════════════════════
-- Blog Posts table for Shippar blog
-- ═══════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  meta_title TEXT,                    -- For SEO <title> tag (if different from title)
  meta_description TEXT,              -- SEO meta description
  excerpt TEXT,                       -- Short summary for cards/previews
  content TEXT NOT NULL,              -- Full HTML content of the article
  tags TEXT[] DEFAULT '{}',           -- Array of tag strings e.g. {'Guía', 'Principiantes'}
  read_time TEXT DEFAULT '5 min',     -- Estimated read time
  icon TEXT DEFAULT 'document',       -- Icon identifier (truck, chart, ship, document)
  published BOOLEAN DEFAULT false,    -- Draft vs published
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Index for slug lookups (fast article fetching)
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);

-- Index for listing published posts
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON blog_posts(published, created_at DESC);

-- Enable RLS
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Public can read published posts
CREATE POLICY "Anyone can read published blog posts"
  ON blog_posts FOR SELECT
  USING (published = true);

-- Admins can do everything (assuming admin role check is done server-side)
-- For admin operations we use the service role key or server-side auth check
