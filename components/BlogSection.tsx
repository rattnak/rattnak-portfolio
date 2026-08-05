// components/BlogSection.tsx
import { getAllPublishedBlogPosts } from "@/lib/database";
import BlogCard from "./BlogCard";
import Link from "next/link";

export default async function BlogSection() {
  const allPosts = await getAllPublishedBlogPosts();
  const posts = allPosts.slice(0, 3);

  if (posts.length === 0) {
    return null;
  }

  return (
    <section id="blog" className="section">
      <div className="container">
        <div className="ledger-rule">
          <span className="instrument-label ledger-rule-label">blog</span>
          <Link
            href="/blog"
            className="link-text inline-flex items-center group"
            style={{
              fontSize: 'var(--text-ui)',
              gap: '0.25rem'
            }}
          >
            View All
            <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>

        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem'
        }}>
          {posts.map((post) => (
            <BlogCard key={post.id} {...post} />
          ))}
        </div>
      </div>
    </section>
  );
}
