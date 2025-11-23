// lib/database.ts
import { supabase } from './supabase';

export type TagType = 'TECHNICAL' | 'NON_TECHNICAL';

export type Tag = {
  id: number;
  name: string;
  slug: string;
  type: TagType;
  description: string | null;
  color: string | null;
  createdAt: string;
};

export type Project = {
  id: number;
  name: string;
  excerpt: string | null; // Short summary for project cards (~150 chars)
  description: string; // Full description shown under project name on detail page
  overview: string | null; // Detailed overview section on detail page
  url: string | null;
  type: 'CODING' | 'CASE_STUDY';
  tags: string[]; // Legacy: old string array (kept for backward compatibility)
  imageUrl: string | null;
  githubUrl: string | null;
  liveUrl: string | null;
  featured: boolean;
  startDate: string;
  endDate: string | null;
  createdAt: string;
};

export type ProjectWithTags = Project & {
  tagList: Tag[]; // Resolved tag objects from junction table
};

export type Achievement = {
  id: number;
  name: string;
  type: string;
  description: string;
  content: string | null;
  result: string;
  organizer: string | null;
  imageUrl: string | null;
  url: string | null;
  tags: string[]; // Legacy: old string array (kept for backward compatibility)
  date: string;
  featured: boolean;
  createdAt: string;
};

// Legacy type alias for backward compatibility
export type Competition = Achievement;

export type AchievementWithTags = Achievement & {
  tagList: Tag[];
};

// Legacy type alias for backward compatibility
export type CompetitionWithTags = AchievementWithTags;

export type BlogPost = {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string | null;
  tags: string[]; // Legacy: old string array (kept for backward compatibility)
  published: boolean;
  readTime: number | null;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type BlogPostWithTags = BlogPost & {
  tagList: Tag[]; // Resolved tag objects from junction table
};

// Projects
export async function getAllProjects(): Promise<ProjectWithTags[]> {
  const { data, error } = await supabase
    .from("Project")
    .select("*")
    .order("featured", { ascending: false })
    .order("startDate", { ascending: false });

  if (error) {
    console.error("Error fetching projects:", error);
    return [];
  }

  const projects = data as Project[];
  const projectsWithTags = await Promise.all(
    projects.map(async (project) => {
      const tagList = await getProjectTags(project.id);
      return { ...project, tagList };
    })
  );

  return projectsWithTags;
}

export async function getFeaturedProjects(): Promise<ProjectWithTags[]> {
  const { data, error } = await supabase
    .from("Project")
    .select("*")
    .eq("featured", true)
    .order("startDate", { ascending: false })
    .limit(3);

  if (error) {
    console.error("Error fetching featured projects:", error);
    return [];
  }

  const projects = data as Project[];
  const projectsWithTags = await Promise.all(
    projects.map(async (project) => {
      const tagList = await getProjectTags(project.id);
      return { ...project, tagList };
    })
  );

  return projectsWithTags;
}


// Achievements
export async function getAllAchievements() {
  const { data, error } = await supabase
    .from('Achievement')
    .select('*')
    .order('featured', { ascending: false })
    .order('date', { ascending: false });

  if (error) {
    console.error('Error fetching achievements:', error);
    return [];
  }

  return data as Achievement[];
}

// Legacy function for backward compatibility
export const getAllCompetitions = getAllAchievements;

export async function getAchievementById(id: number) {
  const { data, error } = await supabase
    .from('Achievement')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching achievement:', error);
    return null;
  }

  return data as Achievement;
}

// Legacy function for backward compatibility
export const getCompetitionById = getAchievementById;

export async function getFeaturedAchievements() {
  const { data, error } = await supabase
    .from('Achievement')
    .select('*')
    .eq('featured', true)
    .order('date', { ascending: false })
    .limit(3);

  if (error) {
    console.error('Error fetching featured achievements:', error);
    return [];
  }

  return data as Achievement[];
}

// Legacy function for backward compatibility
export const getFeaturedCompetitions = getFeaturedAchievements;

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

// Tags
export async function getAllTags() {
  const { data, error } = await supabase
    .from('Tag')
    .select('*')
    .order('type', { ascending: true })
    .order('name', { ascending: true });

  if (error) {
    console.error('Error fetching tags:', error);
    return [];
  }

  return data as Tag[];
}

export async function getTagsByType(type: TagType) {
  const { data, error } = await supabase
    .from('Tag')
    .select('*')
    .eq('type', type)
    .order('name', { ascending: true });

  if (error) {
    console.error('Error fetching tags by type:', error);
    return [];
  }

  return data as Tag[];
}

export async function getTagBySlug(slug: string) {
  const { data, error } = await supabase
    .from('Tag')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) {
    console.error('Error fetching tag:', error);
    return null;
  }

  return data as Tag;
}

// Helper function to get tags for a project (uses junction table)
async function getProjectTags(projectId: number): Promise<Tag[]> {
  const { data, error } = await supabase
    .from('ProjectTag')
    .select(`
      Tag (*)
    `)
    .eq('projectId', projectId);

  if (error) {
    console.error('Error fetching project tags:', error);
    return [];
  }

  const tags = data.map((item: any) => item.Tag as Tag).filter(Boolean);

  // Debug: Log tag colors (only in development)
  if (process.env.NODE_ENV === 'development' && tags.length > 0) {
    console.log(`Tags for project ${projectId}:`, tags.map(t => ({ name: t.name, color: t.color })));
  }

  return tags;
}

// Helper function to get tags for an achievement (uses junction table)
async function getAchievementTags(achievementId: number): Promise<Tag[]> {
  const { data, error } = await supabase
    .from('AchievementTag')
    .select(`
      Tag (*)
    `)
    .eq('achievementId', achievementId);

  if (error) {
    console.error('Error fetching achievement tags:', error);
    return [];
  }

  return data.map((item: any) => item.Tag as Tag).filter(Boolean);
}

// Legacy function for backward compatibility
const getCompetitionTags = getAchievementTags;

// Helper function to get tags for a blog post (uses junction table)
async function getBlogPostTags(blogPostId: number): Promise<Tag[]> {
  const { data, error } = await supabase
    .from('BlogPostTag')
    .select(`
      Tag (*)
    `)
    .eq('blogPostId', blogPostId);

  if (error) {
    console.error('Error fetching blog post tags:', error);
    return [];
  }

  return data.map((item: any) => item.Tag as Tag).filter(Boolean);
}

// Enhanced functions with tag relationships
// Replace your current getProjectWithTags with this:
export async function getProjectWithTags(id: number): Promise<ProjectWithTags | null> {
  // Inline the fetch so we don't rely on getProjectById being in scope
  const { data, error } = await supabase
    .from('Project')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching project:', error);
    return null;
  }
  if (!data) return null;

  const tagList = await getProjectTags(id); // ← removed the stray "{"
  return { ...(data as Project), tagList };
}


export async function getAllProjectsWithTags(): Promise<ProjectWithTags[]> {
  const projects = await getAllProjects();
  const projectsWithTags = await Promise.all(
    projects.map(async (project) => {
      const tagList = await getProjectTags(project.id);
      return { ...project, tagList };
    })
  );
  return projectsWithTags;
}

export async function getAchievementWithTags(id: number): Promise<AchievementWithTags | null> {
  const achievement = await getAchievementById(id);
  if (!achievement) return null;

  const tagList = await getAchievementTags(id);
  return { ...achievement, tagList };
}

// Legacy function for backward compatibility
export const getCompetitionWithTags = getAchievementWithTags;

export async function getAllAchievementsWithTags(): Promise<AchievementWithTags[]> {
  const achievements = await getAllAchievements();
  const achievementsWithTags = await Promise.all(
    achievements.map(async (achievement) => {
      const tagList = await getAchievementTags(achievement.id);
      return { ...achievement, tagList };
    })
  );
  return achievementsWithTags;
}

// Legacy function for backward compatibility
export const getAllCompetitionsWithTags = getAllAchievementsWithTags;

export async function getBlogPostWithTags(slug: string): Promise<BlogPostWithTags | null> {
  const blogPost = await getBlogPostBySlug(slug);
  if (!blogPost) return null;

  const tagList = await getBlogPostTags(blogPost.id);
  return { ...blogPost, tagList };
}

export async function getAllBlogPostsWithTags(): Promise<BlogPostWithTags[]> {
  const blogPosts = await getAllPublishedBlogPosts();
  const blogPostsWithTags = await Promise.all(
    blogPosts.map(async (blogPost) => {
      const tagList = await getBlogPostTags(blogPost.id);
      return { ...blogPost, tagList };
    })
  );
  return blogPostsWithTags;
}
