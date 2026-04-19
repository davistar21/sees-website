import { createClient } from '@supabase/supabase-js'

// Fallback prevents createClient from throwing when .env.local isn't filled in yet.
// Replace these placeholders with your real values from supabase.com → Project Settings → API.
const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL || "https://placeholder.supabase.co";
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY || "placeholder-anon-key";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type GalleryImage = {
  url: string
  description: string
}

export type DBEvent = {
  id: string
  title: string
  description: string | null
  image_url: string | null
  location: string | null
  event_time: string | null
  event_date: string | null
  category: string
  is_featured: boolean
  youtube_url: string | null
  gallery_images: GalleryImage[] | null
  created_at: string
}

export type Executive = {
  id: string
  name: string
  role: string
  description: string | null
  image_url: string | null
  portfolio: string
  display_order: number
  created_at: string
}

export type Resource = {
  id: string
  title: string
  type: 'lesson_notes' | 'youtube' | 'tutorial' | 'textbook'
  url: string | null
  level: number | null
  created_at: string
}

export type HeroSlide = {
  id: string
  image_url: string
  title: string
  subtitle: string | null
  display_order: number
  active: boolean
  created_at: string
}

export type Announcement = {
  id: string
  title: string
  content: string | null
  active: boolean
  created_at: string
}

export type HodProfile = {
  id: string
  name: string
  title: string | null
  bio: string | null
  image_url: string | null
  contact_email: string | null
  created_at: string
}
