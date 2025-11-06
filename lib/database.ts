// lib/database.ts
import { supabase } from './supabase';

export type Project = {
  id: number;
  name: string;
  description: string;
  url: string;
  type: 'CODING' | 'CASE_STUDY';
  tags: string[];
  imageUrl: string | null;
  githubUrl: string | null;
  liveUrl: string | null;
  featured: boolean;
  startDate: string;
  endDate: string | null;
  createdAt: string;
};

export type Competition = {
  id: number;
  name: string;
  type: string;
  description: string;
  content: string | null;
  result: string;
  organizer: string | null;
  imageUrl: string | null;
  url: string | null;
  tags: string[];
  date: string;
  featured: boolean;
  createdAt: string;
};

export type BlogPost = {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string | null;
  tags: string[];
  published: boolean;
  readTime: number | null;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

// Projects
export async function getAllProjects() {
  const { data, error } = await supabase
    .from('Project')
    .select('*')
    .order('featured', { ascending: false })
    .order('startDate', { ascending: false });

  if (error) {
    console.error('Error fetching projects:', error);
    return [];
  }

  return data as Project[];
}

export async function getProjectById(id: number) {
  const { data, error } = await supabase
    .from('Project')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching project:', error);
    return null;
  }

  return data as Project;
}

export async function getFeaturedProjects() {
  const { data, error } = await supabase
    .from('Project')
    .select('*')
    .eq('featured', true)
    .order('startDate', { ascending: false })
    .limit(3);

  if (error) {
    console.error('Error fetching featured projects:', error);
    return [];
  }

  return data as Project[];
}

// Competitions/Achievements
export async function getAllCompetitions() {
  const { data, error } = await supabase
    .from('Competition')
    .select('*')
    .order('featured', { ascending: false })
    .order('date', { ascending: false });

  if (error) {
    console.error('Error fetching competitions:', error);
    return [];
  }

  return data as Competition[];
}

export async function getCompetitionById(id: number) {
  const { data, error } = await supabase
    .from('Competition')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching competition:', error);
    return null;
  }

  return data as Competition;
}

export async function getFeaturedCompetitions() {
  const { data, error } = await supabase
    .from('Competition')
    .select('*')
    .eq('featured', true)
    .order('date', { ascending: false })
    .limit(3);

  if (error) {
    console.error('Error fetching featured competitions:', error);
    return [];
  }

  return data as Competition[];
}

// Blog Posts
export async function getAllPublishedBlogPosts() {
  const { data, error } = await supabase
    .from('BlogPost')
    .select('*')
    .eq('published', true)
    .order('publishedAt', { ascending: false });

  if (error) {
    console.error('Error fetching blog posts:', error);
    return [];
  }

  return data as BlogPost[];
}

export async function getBlogPostBySlug(slug: string) {
  const { data, error } = await supabase
    .from('BlogPost')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .single();

  if (error) {
    console.error('Error fetching blog post:', error);
    return null;
  }

  return data as BlogPost;
}

export async function getAllBlogSlugs() {
  const { data, error } = await supabase
    .from('BlogPost')
    .select('slug')
    .eq('published', true);

  if (error) {
    console.error('Error fetching blog slugs:', error);
    return [];
  }

  return data.map(post => post.slug);
}
