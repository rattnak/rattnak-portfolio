// components/BlogSection.tsx
import { mockBlogPosts } from "@/lib/mockData";
import BlogCard from "./BlogCard";
import Link from "next/link";

export default async function BlogSection() {
  // TODO: Switch back to getRecentBlogPosts(3) after database is synced
  // const posts = await getRecentBlogPosts(3);
  const posts = mockBlogPosts;

  return (
    <section id="blog" className="section" style={{ borderTop: '1px solid var(--border)' }}>
      <div className="container">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-xs tracking-widest uppercase" style={{ color: 'var(--text-muted)' }}>
            Writing
          </h2>
          {posts.length > 0 && (
            <Link
              href="/blog"
              className="text-sm link-text inline-flex items-center gap-1 group"
            >
              View All
              <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          )}
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-20" style={{ color: 'var(--text-muted)' }}>
            <p>No blog posts published yet. Check back soon!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {posts.map((post) => (
              <BlogCard key={post.id} {...post} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
