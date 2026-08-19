// lib/database.ts
import { supabase } from './supabase';

// A failed query must never be mistaken for "there is no content".
//
// These functions used to log the error and return [] / null. Under ISR that
// is the worst possible outcome: Next.js sees a successful render of an empty
// site and caches it. When the Supabase project was paused for inactivity,
// every query errored, every list came back empty, and the blank homepage was
// frozen into the build. It stayed blank after the database woke up.
//
// Throwing instead aborts the render, so Next.js discards it and keeps
// serving the last good page. A database outage then degrades to stale
// content rather than to an empty site.
//
// The distinction this preserves: a query that succeeds and matches nothing
// is still a legitimate empty result. Only the error branch throws.
function failed(context: string, error: { message?: string }): never {
  throw new Error(`Supabase query failed (${context}): ${error.message ?? 'unknown error'}`);
}

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

// The Postgres ProjectType enum. Each value maps to exactly one
// WorkCategory (see PROJECT_TYPE_TO_CATEGORY), which is what the
// home-page filter rail selects on.
export type ProjectType = 'DEVELOP' | 'OPEN_SOURCE' | 'DESIGN' | 'LEADERSHIP';

export type Project = {
  id: number;
  name: string;
  slug: string; // URL identity for /projects/[slug]; unique, stable across renames
  excerpt: string | null; // Short summary for project cards (~150 chars)
  description: string; // Full description shown under project name on detail page
  overview: string | null; // Detailed overview section on detail page
  outcome: string | null; // Short delta rendered in mono on the card: "2 days to 20 min"
  url: string | null;
  // Multi-valued: one project can appear under several filter chips.
  // Never empty (enforced by a CHECK constraint); the first entry is the
  // primary category, used where a single label is needed.
  type: ProjectType[];
  organizer: string | null; // Host org, mainly for LEADERSHIP / OPEN_SOURCE work
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

export type AchievementLink = {
  label: string;
  url: string;
};

export type Achievement = {
  id: number;
  name: string;
  slug: string; // URL identity for /achievements/[slug]; unique, stable across renames
  type: string;
  description: string;
  content: string | null;
  result: string;
  organizer: string | null;
  url: string | null; // Legacy: single link, kept for backward compatibility.
  links: AchievementLink[] | null; // Up to 3 labeled links; see getAchievementLinks.
  imageUrl: string | null; // Card cover: /achievements/<slug>/cover.<ext>
  tags: string[]; // Legacy: old string array (kept for backward compatibility)
  date: string;
  featured: boolean;
  createdAt: string;
};

const MAX_ACHIEVEMENT_LINKS = 3;

// Normalizes an achievement's links for rendering: prefers the new
// `links` column (capped at 3, entries missing a url or label dropped),
// falls back to the legacy single `url` column so older content that
// hasn't been migrated to `links` still shows its one link.
export function getAchievementLinks(achievement: { url?: string | null; links?: AchievementLink[] | null }): AchievementLink[] {
  if (Array.isArray(achievement.links) && achievement.links.length > 0) {
    return achievement.links
      .filter((l): l is AchievementLink => Boolean(l && typeof l === "object" && l.url && l.label))
      .slice(0, MAX_ACHIEVEMENT_LINKS);
  }
  if (achievement.url) {
    return [{ label: "View Details", url: achievement.url }];
  }
  return [];
}

// Extracts the first image path from an achievement's markdown content
// (either a ![]() image or the first line of a ```slideshow block), for use
// as the card/list thumbnail. Images live only in `content` now.
export function getFirstImageFromContent(content: string | null): string | null {
  if (!content) return null;

  const slideshowMatch = content.match(/```slideshow\s*\n([^`]*)```/);
  if (slideshowMatch) {
    const firstLine = slideshowMatch[1]
      .split('\n')
      .map((line) => line.trim())
      .find(Boolean);
    if (firstLine) return firstLine;
  }

  const imageMatch = content.match(/!\[[^\]]*\]\(([^)]+)\)/);
  return imageMatch ? imageMatch[1] : null;
}

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

// A labeled link. Shared by Work.links and OpenSourceContribution.links so
// both tables render the same way: the repo link in the teal accent from its
// own githubUrl column, every other link in the amber signal.
export type WorkLink = {
  label: string;
  url: string;
};

export type OpenSourceContribution = {
  id: number;
  projectName: string;
  organization: string | null;
  description: string;
  prUrl: string | null;
  githubUrl: string | null; // Repo link, renamed from repoUrl to match Work
  links: WorkLink[] | null; // Labeled links; absorbed the old liveUrl column
  skills: string[]; // Per-PR skills; grouped cards union them
  merged: boolean;
  featured: boolean;
  imageUrl: string | null; // Card cover: /open-source/<slug>/cover.<ext>
  date: string;
  createdAt: string;
};

// Projects
export async function getAllProjects(): Promise<ProjectWithTags[]> {
  const { data, error } = await supabase
    .from("Project")
    .select("*")
    .order("featured", { ascending: false })
    .order("startDate", { ascending: false });

  if (error) failed('getAllProjects', error);

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

  if (error) failed('getFeaturedProjects', error);

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

  if (error) failed('getAllAchievements', error);

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

  // .single() signals "no matching row" as PGRST116, which is an ordinary
  // 404 for a bad id. Every other code is a real failure and must throw so
  // the render is discarded rather than cached as a missing item.
  if (error) {
    if (error.code === 'PGRST116') return null;
    failed(`getAchievementById(${id})`, error);
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

  if (error) failed('getFeaturedAchievements', error);

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

  if (error) failed('getAllPublishedBlogPosts', error);

  return data as BlogPost[];
}

export async function hasPublishedBlogPosts(): Promise<boolean> {
  const { count, error } = await supabase
    .from('BlogPost')
    .select('*', { count: 'exact', head: true })
    .eq('published', true);

  if (error) failed('hasPublishedBlogPosts', error);

  return (count ?? 0) > 0;
}

export async function getBlogPostBySlug(slug: string) {
  const { data, error } = await supabase
    .from('BlogPost')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    failed(`getBlogPostBySlug(${slug})`, error);
  }

  return data as BlogPost;
}

export async function getAllBlogSlugs() {
  const { data, error } = await supabase
    .from('BlogPost')
    .select('slug')
    .eq('published', true);

  if (error) failed('getAllBlogSlugs', error);

  return data.map(post => post.slug);
}

// Open Source Contributions
export async function getAllOpenSourceContributions(): Promise<OpenSourceContribution[]> {
  const { data, error } = await supabase
    .from('OpenSourceContribution')
    .select('*')
    .order('featured', { ascending: false })
    .order('date', { ascending: false });

  if (error) failed('getAllOpenSourceContributions', error);

  return data as OpenSourceContribution[];
}

export async function getFeaturedOpenSourceContributions(): Promise<OpenSourceContribution[]> {
  const { data, error } = await supabase
    .from('OpenSourceContribution')
    .select('*')
    .eq('featured', true)
    .order('date', { ascending: false })
    .limit(3);

  if (error) failed('getFeaturedOpenSourceContributions', error);

  return data as OpenSourceContribution[];
}

export function projectNameToSlug(projectName: string): string {
  return projectName
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export type OpenSourceProjectGroup = {
  projectName: string;
  slug: string;
  organization: string | null;
  githubUrl: string | null;
  links: WorkLink[] | null;
  skills: string[]; // Union of the group's per-PR skills
  mergedCount: number;
  totalCount: number;
  latestDate: string;
  featured: boolean;
  imageUrl: string | null; // First non-null cover among the group's rows
  contributions: OpenSourceContribution[];
};

export async function getOpenSourceContributionsGroupedByProject(): Promise<OpenSourceProjectGroup[]> {
  const contributions = await getAllOpenSourceContributions();

  const groups = new Map<string, OpenSourceProjectGroup>();

  for (const c of contributions) {
    const slug = projectNameToSlug(c.projectName);
    const existing = groups.get(slug);

    if (!existing) {
      groups.set(slug, {
        projectName: c.projectName,
        slug,
        organization: c.organization,
        githubUrl: c.githubUrl,
        links: c.links ?? null,
        skills: [...(c.skills ?? [])],
        mergedCount: c.merged ? 1 : 0,
        totalCount: 1,
        latestDate: c.date,
        featured: c.featured,
        imageUrl: c.imageUrl,
        contributions: [c],
      });
    } else {
      existing.mergedCount += c.merged ? 1 : 0;
      existing.totalCount += 1;
      existing.featured = existing.featured || c.featured;
      existing.links = existing.links ?? c.links ?? null;
      existing.imageUrl = existing.imageUrl ?? c.imageUrl;
      // Union the group's skills, preserving first-seen order.
      for (const sk of c.skills ?? []) {
        if (!existing.skills.includes(sk)) existing.skills.push(sk);
      }
      if (new Date(c.date) > new Date(existing.latestDate)) {
        existing.latestDate = c.date;
      }
      existing.contributions.push(c);
    }
  }

  return Array.from(groups.values()).sort(
    (a, b) => new Date(b.latestDate).getTime() - new Date(a.latestDate).getTime()
  );
}

export async function getOpenSourceProjectGroupBySlug(slug: string): Promise<OpenSourceProjectGroup | null> {
  const groups = await getOpenSourceContributionsGroupedByProject();
  return groups.find((g) => g.slug === slug) ?? null;
}

// Tags
export async function getAllTags() {
  const { data, error } = await supabase
    .from('Tag')
    .select('*')
    .order('type', { ascending: true })
    .order('name', { ascending: true });

  if (error) failed('getAllTags', error);

  return data as Tag[];
}

export async function getTagsByType(type: TagType) {
  const { data, error } = await supabase
    .from('Tag')
    .select('*')
    .eq('type', type)
    .order('name', { ascending: true });

  if (error) failed('getTagsByType', error);

  return data as Tag[];
}

export async function getTagBySlug(slug: string) {
  const { data, error } = await supabase
    .from('Tag')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    failed(`getTagBySlug(${slug})`, error);
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

  if (error) failed(`getProjectTags(${projectId})`, error);

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

  if (error) failed(`getAchievementTags(${achievementId})`, error);

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

  if (error) failed(`getBlogPostTags(${blogPostId})`, error);

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
    if (error.code === 'PGRST116') return null;
    failed(`getProjectWithTags(${id})`, error);
  }
  if (!data) return null;

  const tagList = await getProjectTags(id); // ← removed the stray "{"
  return { ...(data as Project), tagList };
}


// Slug is the URL identity for /projects/[slug]. The id lookup above is
// kept for the numeric legacy route, which resolves an id only to 301
// to the slug URL.
export async function getProjectBySlug(slug: string): Promise<ProjectWithTags | null> {
  const { data, error } = await supabase
    .from('Project')
    .select('*')
    // maybeSingle, not single: an unknown slug is an ordinary 404, not
    // an error worth logging on every bad URL a crawler tries.
    .eq('slug', slug)
    .maybeSingle();

  // maybeSingle already reports "no such slug" as data === null with no
  // error, so anything landing here is a real failure, not a 404.
  if (error) failed(`getProjectBySlug(${slug})`, error);
  if (!data) return null;

  const project = data as Project;
  const tagList = await getProjectTags(project.id);
  return { ...project, tagList };
}

export async function getAchievementBySlug(slug: string): Promise<AchievementWithTags | null> {
  const { data, error } = await supabase
    .from('Achievement')
    .select('*')
    .eq('slug', slug)
    .maybeSingle();

  if (error) failed(`getAchievementBySlug(${slug})`, error);
  if (!data) return null;

  const achievement = data as Achievement;
  const tagList = await getAchievementTags(achievement.id);
  return { ...achievement, tagList };
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

// ================================
// Unified work items: projects, curated open source, and achievements
// merged into the one home-page card grid.
// ================================

export type WorkCategory = 'develop' | 'design' | 'opensource' | 'leadership';

// One place naming each work category, shared by the filter rail and by
// the breadcrumb trail on detail pages so the two cannot drift. Shaped
// as a Crumb ({ label, href }) so a breadcrumb can spread it directly.
// The href deep-links into the filter: /#work-develop selects the
// development chip (see WorkGridClient's hash sync).
export const WORK_CATEGORY_META: Record<WorkCategory, { label: string; href: string }> = {
  develop: { label: "Development", href: "/#work-develop" },
  design: { label: "Design", href: "/#work-design" },
  opensource: { label: "Open Source", href: "/#work-opensource" },
  leadership: { label: "Leadership", href: "/#work-leadership" },
};

// Project.type stores the DB enum; the grid filters on WorkCategory. This
// is the only place the two vocabularies meet.
export const PROJECT_TYPE_TO_CATEGORY: Record<ProjectType, WorkCategory> = {
  DEVELOP: 'develop',
  OPEN_SOURCE: 'opensource',
  DESIGN: 'design',
  LEADERSHIP: 'leadership',
};

// A project's categories, deduped and in the canonical chip order so two
// rows listing the same pair render their badges identically. Falls back
// to 'develop' if a row somehow arrives with an empty array, so the item
// still appears under a chip instead of vanishing from the grid.
export function projectCategories(
  type: ProjectType[] | ProjectType | null | undefined
): WorkCategory[] {
  // Tolerates a bare scalar as well as an array: rows written before the
  // multi-category migration still arrive as a single value, and the old
  // CODING / CASE_STUDY spellings are mapped to their renamed equivalents
  // so an unmigrated database still renders instead of throwing.
  const legacy: Record<string, WorkCategory> = { CODING: 'develop', CASE_STUDY: 'design' };
  const values = type == null ? [] : Array.isArray(type) ? type : [type];
  const order = Object.keys(WORK_CATEGORY_META) as WorkCategory[];
  const mapped = new Set(
    values.map((t) => PROJECT_TYPE_TO_CATEGORY[t] ?? legacy[t as string]).filter(Boolean)
  );
  const ordered = order.filter((c) => mapped.has(c));
  return ordered.length > 0 ? ordered : ['develop'];
}

export type WorkItem = {
  key: string;
  title: string;
  pitch: string;
  outcome: string | null; // Mono result line: a project delta, an achievement result, merged PR count
  categories: WorkCategory[];
  cover: string | null;
  coverFallback: string; // typographic cover text when there is no image
  href: string | null;
  external: boolean;
  featured: boolean;
  dateLabel: string; // rendered uppercase in mono: "Nov 2023", "Aug 2024 - Present"
  // Skills shown as small chips next to the date, so the grid says what a
  // piece of work was built with without opening it. Capped at render time,
  // not here, so the detail page can use the same field in full.
  skills: string[];
  sortDate: string;
};

function formatMonthYear(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

function formatDateRange(start: string, end: string | null): string {
  const from = formatMonthYear(start);
  if (!end) return `${from} - Present`;
  const to = formatMonthYear(end);
  return from === to ? from : `${from} - ${to}`;
}

// Cover fallback: a short result ("Top 3") works as a typographic cover;
// anything longer falls back to the item's initials.
function coverFallbackText(preferred: string | null, name: string): string {
  if (preferred && preferred.length <= 16) return preferred;
  return name
    .split(/\s+/)
    .filter((word) => /^[a-z0-9]/i.test(word))
    .slice(0, 3)
    .map((word) => word[0])
    .join('')
    .toUpperCase();
}

// Pulls skill names out of the ProjectTag(Tag(name)) join. supabase-js returns
// the nested relation as an array of { Tag: { name } }, and a row with no tags
// comes back as an empty array rather than null.
// Work.categories stores the Postgres WorkCategory enum in upper snake case;
// the grid filters on the lowercase WorkCategory union. This is the only place
// the two spellings meet.
const DB_CATEGORY_TO_WORK: Record<string, WorkCategory> = {
  DEVELOP: 'develop',
  OPEN_SOURCE: 'opensource',
  DESIGN: 'design',
  LEADERSHIP: 'leadership',
};

// Categories for one row, read from the Work table by slug. Falls back to the
// caller's default when the row is missing or somehow has an empty array, so a
// gap in Work can never drop an item out of every filter chip.
function workCategoriesFor(
  bySlug: Map<string, string[]>,
  slug: string,
  fallback: WorkCategory[]
): WorkCategory[] {
  const raw = bySlug.get(slug);
  if (!raw || raw.length === 0) return fallback;
  const order = Object.keys(WORK_CATEGORY_META) as WorkCategory[];
  const mapped = new Set(raw.map((v) => DB_CATEGORY_TO_WORK[v]).filter(Boolean));
  const ordered = order.filter((c) => mapped.has(c));
  return ordered.length > 0 ? ordered : fallback;
}

// A grouped open source card shows its most recent contribution's blurb, and
// a PR description is written for a changelog, not for a two-line card. Cut it
// at a word boundary so the clamp never lands mid-word; the detail page lists
// every contribution in full.
function shortenPitch(text: string, max = 110): string {
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  const at = cut.lastIndexOf(' ');
  return (at > max * 0.6 ? cut.slice(0, at) : cut).replace(/[,;:.]$/, '') + '...';
}

function extractJoinedSkills(row: unknown): string[] {
  const joins = (row as { ProjectTag?: { Tag?: { name?: string } | null }[] }).ProjectTag;
  if (!Array.isArray(joins)) return [];
  return joins
    .map((j) => j?.Tag?.name)
    .filter((n): n is string => typeof n === 'string' && n.length > 0)
    .sort();
}

// The Work row as the grid reads it. Work merged Project and Achievement,
// so this is one query where there used to be two plus a tag join per row.
type WorkRow = {
  slug: string;
  name: string;
  categories: string[];
  skills: string[] | null;
  cardBlurb: string | null;
  tldr: string;
  content: string | null;
  outcome: string | null;
  imageUrl: string | null;
  links: WorkLink[] | null;
  featured: boolean;
  startDate: string;
  endDate: string | null;
  legacy_project_id: number | null;
};

export async function getWorkItems(): Promise<WorkItem[]> {
  const [workRes, ossGroups] = await Promise.all([
    supabase
      .from('Work')
      .select('slug,name,categories,skills,cardBlurb,tldr,content,outcome,imageUrl,links,featured,startDate,endDate,legacy_project_id')
      .order('featured', { ascending: false })
      .order('startDate', { ascending: false }),
    getOpenSourceContributionsGroupedByProject(),
  ]);

  if (workRes.error) failed('getWorkItems', workRes.error);
  const rows = workRes.data as WorkRow[];

  const workItems: WorkItem[] = rows.map((w) => {
    // legacy_project_id is what distinguishes a row that came from Project
    // from one that came from Achievement, and it still decides the URL
    // prefix. Both route families stay live until /work/[slug] replaces them.
    const isProject = w.legacy_project_id !== null;
    const externalUrl = w.links?.[0]?.url ?? null;
    const href = isProject
      ? `/projects/${w.slug}`
      : w.content
        ? `/achievements/${w.slug}`
        : externalUrl;

    return {
      key: `work-${w.slug}`,
      title: w.name,
      // cardBlurb is written to the card's two-line budget; tldr is the
      // longer detail-page summary and is only a fallback here.
      pitch: w.cardBlurb ?? w.tldr,
      outcome: w.outcome,
      categories: workCategoriesFor(
        new Map([[w.slug, w.categories ?? []]]),
        w.slug,
        ['develop']
      ),
      cover: w.imageUrl ?? getFirstImageFromContent(w.content),
      coverFallback: coverFallbackText(w.outcome, w.name),
      href,
      external: !isProject && !w.content && Boolean(externalUrl),
      featured: w.featured,
      dateLabel: isProject
        ? formatDateRange(w.startDate, w.endDate)
        : formatMonthYear(w.startDate),
      skills: w.skills ?? [],
      sortDate: w.startDate,
    };
  });

  // Every open source group appears, the same as every project and
  // achievement does. This used to filter on g.featured, which made open
  // source the only category that needed a flag to show up at all: when no
  // contribution carried it, the whole category vanished from the grid with
  // nothing to indicate why. `featured` still controls ordering below, so a
  // flagged group sorts to the top rather than being the only one visible.
  const ossItems: WorkItem[] = ossGroups
    .map((g) => ({
      key: `oss-${g.slug}`,
      title: g.projectName,
      pitch: shortenPitch(g.contributions[0]?.description ?? ''),
      outcome: g.mergedCount > 0 ? `${g.mergedCount} merged` : null,
      categories: ['opensource'],
      cover: g.imageUrl,
      coverFallback:
        g.mergedCount > 0 ? `${g.mergedCount} merged` : coverFallbackText(null, g.projectName),
      href: `/open-source/${g.slug}`,
      external: false,
      featured: g.featured,
      dateLabel: formatMonthYear(g.latestDate),
      skills: g.skills,
      sortDate: g.latestDate,
    }));

  return [...workItems, ...ossItems].sort((a, b) => {
    if (a.featured !== b.featured) return a.featured ? -1 : 1;
    return new Date(b.sortDate).getTime() - new Date(a.sortDate).getTime();
  });
}

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

// ================================
// Work-backed detail fetchers
//
// Work is the single source for detail pages now. These return the legacy
// Project / Achievement shapes so ProjectDetailClient and
// AchievementDetailClient need no changes: the row is adapted here rather
// than the components being rewritten against a new type, which keeps this
// step to one file.
//
// Skills are a plain String[] on the row, so the tagList the components
// expect is synthesized. Only `name` is ever read from a Tag (Tag.tsx looks
// up its colour by name), so the other fields are filled with inert values.
// ================================

// A link labelled as the live site, versus everything else. The two are kept
// apart because ProjectDetailClient renders them as separate buttons, so a
// row with one link must not satisfy both.
function liveLink(links: WorkLink[] | null): WorkLink | undefined {
  return (links ?? []).find((l) => /live|site|demo/i.test(l.label));
}

function firstNonLiveLink(links: WorkLink[] | null): WorkLink | undefined {
  const live = liveLink(links);
  return (links ?? []).find((l) => l !== live);
}

function skillsAsTagList(skills: string[] | null | undefined): Tag[] {
  return (skills ?? []).map((name, i) => ({
    id: -(i + 1), // negative: these are synthetic, not rows in Tag
    name,
    slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    type: 'TECHNICAL' as TagType,
    description: null,
    color: null,
    createdAt: '',
  }));
}

const WORK_DETAIL_COLUMNS =
  'id,slug,name,categories,skills,kind,cardBlurb,tldr,content,outcome,organizer,startDate,endDate,githubUrl,links,imageUrl,featured,createdAt,legacy_project_id';

type WorkDetailRow = {
  id: number;
  slug: string;
  name: string;
  categories: string[];
  skills: string[] | null;
  kind: string | null;
  cardBlurb: string | null;
  tldr: string;
  content: string | null;
  outcome: string | null;
  organizer: string | null;
  startDate: string;
  endDate: string | null;
  githubUrl: string | null;
  links: WorkLink[] | null;
  imageUrl: string | null;
  featured: boolean;
  createdAt: string;
  legacy_project_id: number | null;
};

// The DB enum spelling, mapped back to the legacy ProjectType union the
// detail component still types its `type` prop against.
const WORK_CATEGORY_TO_PROJECT_TYPE: Record<string, ProjectType> = {
  DEVELOP: 'DEVELOP',
  OPEN_SOURCE: 'OPEN_SOURCE',
  DESIGN: 'DESIGN',
  LEADERSHIP: 'LEADERSHIP',
};

export async function getWorkProjectBySlug(slug: string): Promise<ProjectWithTags | null> {
  const { data, error } = await supabase
    .from('Work')
    .select(WORK_DETAIL_COLUMNS)
    .eq('slug', slug)
    .maybeSingle();

  if (error) failed(`getWorkProjectBySlug(${slug})`, error);
  if (!data) return null;

  const w = data as WorkDetailRow;
  // Achievements live in Work too; this route only serves the project half.
  if (w.legacy_project_id === null) return null;

  const types = (w.categories ?? [])
    .map((c) => WORK_CATEGORY_TO_PROJECT_TYPE[c])
    .filter(Boolean) as ProjectType[];

  return {
    id: w.id,
    name: w.name,
    slug: w.slug,
    excerpt: w.cardBlurb,
    description: w.tldr,
    overview: w.content,
    outcome: w.outcome,
    // `url` and `liveUrl` were separate columns before the migration folded
    // both into `links`. The detail page still renders them as two different
    // buttons ("View Case Study" and "Live Website"), so handing the same
    // entry to both draws one link twice. liveUrl claims the live-site entry;
    // url only gets what is left over.
    url: firstNonLiveLink(w.links)?.url ?? null,
    type: types.length > 0 ? types : ['DEVELOP'],
    organizer: w.organizer,
    tags: w.skills ?? [],
    imageUrl: w.imageUrl,
    githubUrl: w.githubUrl,
    liveUrl: liveLink(w.links)?.url ?? null,
    featured: w.featured,
    startDate: w.startDate,
    endDate: w.endDate,
    createdAt: w.createdAt,
    tagList: skillsAsTagList(w.skills),
  };
}

export async function getWorkAchievementBySlug(slug: string): Promise<AchievementWithTags | null> {
  const { data, error } = await supabase
    .from('Work')
    .select(WORK_DETAIL_COLUMNS)
    .eq('slug', slug)
    .maybeSingle();

  if (error) failed(`getWorkAchievementBySlug(${slug})`, error);
  if (!data) return null;

  const w = data as WorkDetailRow;
  if (w.legacy_project_id !== null) return null;

  return {
    id: w.id,
    name: w.name,
    slug: w.slug,
    type: w.kind ?? '',
    description: w.tldr,
    content: w.content,
    result: w.outcome ?? '',
    organizer: w.organizer,
    url: null, // folded into links; getAchievementLinks reads `links` first
    links: w.links ?? null,
    imageUrl: w.imageUrl,
    tags: w.skills ?? [],
    date: w.startDate,
    featured: w.featured,
    createdAt: w.createdAt,
    tagList: skillsAsTagList(w.skills),
  };
}

// Slugs for generateStaticParams, split by which route family serves them.
export async function getWorkSlugs(kind: 'project' | 'achievement'): Promise<string[]> {
  const query = supabase.from('Work').select('slug,legacy_project_id');
  const { data, error } = kind === 'project'
    ? await query.not('legacy_project_id', 'is', null)
    : await query.is('legacy_project_id', null);

  if (error) failed(`getWorkSlugs(${kind})`, error);
  return (data as { slug: string }[]).map((r) => r.slug);
}

// Legacy /projects/<id> and /achievements/<id> links, resolved to a slug.
//
// Projects carry their original id in Work.legacy_project_id, so those
// resolve from Work directly. Achievements do not: Work.id is a fresh
// sequence, not the old Achievement.id (Work.id 16 is Achievement.id 4), so
// that lookup still needs the Achievement table. It is the one remaining
// reader of it, and the reason the table cannot be dropped until these old
// links are considered dead.
export async function slugForLegacyProjectId(id: number): Promise<string | null> {
  const { data, error } = await supabase
    .from('Work')
    .select('slug')
    .eq('legacy_project_id', id)
    .maybeSingle();

  if (error) failed(`slugForLegacyProjectId(${id})`, error);
  return (data as { slug: string } | null)?.slug ?? null;
}

export async function slugForLegacyAchievementId(id: number): Promise<string | null> {
  const { data, error } = await supabase
    .from('Achievement')
    .select('slug')
    .eq('id', id)
    .maybeSingle();

  if (error) failed(`slugForLegacyAchievementId(${id})`, error);
  return (data as { slug: string } | null)?.slug ?? null;
}

// Every Work row, for the sitemap and the search index. Both used to read
// Project and Achievement separately, which meant a row that existed only in
// Work (the design case studies) was absent from both.
export async function getAllWorkRows(): Promise<
  { slug: string; name: string; legacy_project_id: number | null }[]
> {
  const { data, error } = await supabase
    .from('Work')
    .select('slug,name,legacy_project_id')
    .order('startDate', { ascending: false });

  if (error) failed('getAllWorkRows', error);
  return data as { slug: string; name: string; legacy_project_id: number | null }[];
}
