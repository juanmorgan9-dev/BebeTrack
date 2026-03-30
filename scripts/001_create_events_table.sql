-- BebeTrack Events Table
-- Simple table to store all baby tracking events

CREATE TABLE IF NOT EXISTS public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  baby_id TEXT,
  type TEXT NOT NULL,
  subtype TEXT,
  other_subtype TEXT,
  date_time TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  duration_min INTEGER,
  ml INTEGER,
  consistency TEXT,
  poop_color TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_events_date_time ON public.events(date_time DESC);
CREATE INDEX IF NOT EXISTS idx_events_baby_id ON public.events(baby_id);

-- Enable RLS but allow all operations (simple shared app without auth)
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist, then create new ones
DROP POLICY IF EXISTS "Allow anonymous read" ON public.events;
DROP POLICY IF EXISTS "Allow anonymous insert" ON public.events;
DROP POLICY IF EXISTS "Allow anonymous update" ON public.events;
DROP POLICY IF EXISTS "Allow anonymous delete" ON public.events;

CREATE POLICY "Allow anonymous read" ON public.events FOR SELECT USING (true);
CREATE POLICY "Allow anonymous insert" ON public.events FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anonymous update" ON public.events FOR UPDATE USING (true);
CREATE POLICY "Allow anonymous delete" ON public.events FOR DELETE USING (true);
