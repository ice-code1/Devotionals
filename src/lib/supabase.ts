import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://egviwzalnthgykrwelmj.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVndml3emFsbnRoZ3lrcndlbG1qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc0MTU5NzAsImV4cCI6MjA3Mjk5MTk3MH0.rpHigEm0AinCQB-wWmQgY2mcO4Y962IgFgQhb1FsdLo";

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please click "Connect to Supabase" to set up your connection.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Devotional {
  id: string;
  section: 'children' | 'teenagers';
  title: string;
  body: string;
  scripture: string;
  authorName: string;
  authorImage: string;
  shareImage?: string;
  date: string;
  slug: string;
  created_at: string;
}

export interface ModeratorCard {
  id: string;
  section: 'children' | 'teenagers';
  message: string;
  preview: string;
  moderatorImage: string;
  created_at: string;
}

export interface PrayerRequest {
  id: string;
  name: string;
  location: string;
  phone: string;
  prayer_request: string;
  created_at: string;
}

export interface CounselRequest {
  id: string;
  name: string;
  phone: string;
  problem_statement: string;
  created_at: string;
}

export interface DevotionalQuestion {
  id: string;
  devotional_id: string;
  name: string;
  contact: string;
  question: string;
  created_at: string;
}

export interface Writer {
  id: string;
  user_id: string;
  name: string;
  profile_image?: string;
  bio?: string;
  created_at: string;
}

export interface DevotionalSubmission {
  id: string;
  writer_id: string;
  section: 'children' | 'teenagers';
  title: string;
  body: string;
  scripture: string;
  status: 'pending' | 'approved' | 'rejected';
  review_link: string;
  submitted_at: string;
  reviewed_at?: string;
  reviewed_by?: string;
  admin_notes?: string;
  writer?: Writer;
}