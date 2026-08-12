import { createClient, SupabaseClient } from '@supabase/supabase-js';

let supabaseClient: SupabaseClient | null = null;

/**
 * Returns a initialized Supabase client if SUPABASE_URL and SUPABASE_ANON_KEY / SUPABASE_SERVICE_ROLE_KEY are set.
 * Uses lazy initialization to prevent crashes when environment variables are not yet set.
 */
export function getSupabaseClient(): SupabaseClient | null {
  if (supabaseClient) return supabaseClient;

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

  if (!url || !key) {
    return null;
  }

  try {
    supabaseClient = createClient(url, key, {
      auth: { persistSession: false }
    });
    return supabaseClient;
  } catch (err) {
    console.error('Failed to initialize Supabase client:', err);
    return null;
  }
}

/**
 * SQL Schema script to create tables in Supabase SQL Editor
 */
export const SUPABASE_SQL_SCHEMA = `
-- =========================================================================
-- SUPABASE TABLES SCHEMA FOR PORTFOLIO
-- Execute this script in your Supabase Dashboard -> SQL Editor
-- =========================================================================

-- 1. Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id TEXT PRIMARY KEY DEFAULT 'default',
  name TEXT,
  title TEXT,
  tagline TEXT,
  bio TEXT,
  about_detail TEXT,
  avatar_url TEXT,
  cover_url TEXT,
  location TEXT,
  email TEXT,
  phone TEXT,
  status TEXT,
  status_text TEXT,
  years_experience INT,
  completed_projects INT DEFAULT 0,
  happy_clients INT DEFAULT 0,
  social_links JSONB,
  resume_url TEXT DEFAULT '#',
  theme TEXT DEFAULT 'orange',
  dark_mode BOOLEAN DEFAULT TRUE,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Projects Table
CREATE TABLE IF NOT EXISTS public.projects (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT,
  short_description TEXT,
  full_description TEXT,
  image_url TEXT,
  gallery JSONB,
  tags JSONB,
  featured BOOLEAN DEFAULT FALSE,
  demo_url TEXT,
  github_url TEXT,
  completion_date TEXT,
  metrics JSONB,
  client TEXT,
  role TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Skills Table
CREATE TABLE IF NOT EXISTS public.skills (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT,
  proficiency INT DEFAULT 80,
  icon_name TEXT,
  years INT DEFAULT 1,
  featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Experiences Table
CREATE TABLE IF NOT EXISTS public.experiences (
  id TEXT PRIMARY KEY,
  company TEXT NOT NULL,
  role TEXT NOT NULL,
  period TEXT,
  location TEXT,
  description TEXT,
  technologies JSONB,
  highlights JSONB,
  current BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Education Table
CREATE TABLE IF NOT EXISTS public.education (
  id TEXT PRIMARY KEY,
  institution TEXT NOT NULL,
  degree TEXT NOT NULL,
  period TEXT,
  description TEXT,
  honors TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Testimonials Table
CREATE TABLE IF NOT EXISTS public.testimonials (
  id TEXT PRIMARY KEY,
  author TEXT NOT NULL,
  role TEXT,
  company TEXT,
  avatar_url TEXT,
  content TEXT NOT NULL,
  rating INT DEFAULT 5,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Contact Messages Table
CREATE TABLE IF NOT EXISTS public.messages (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Disable RLS or set open policy for demo API access if required
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.experiences DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.education DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages DISABLE ROW LEVEL SECURITY;
`;

