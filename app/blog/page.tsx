// app/blog/page.tsx
import { getAllPublishedBlogPosts } from "@/lib/database";
import BlogCard from "@/components/BlogCard";

export const metadata = {
  title: "Blog - Chanrattnak Mong",
  description: "Thoughts on software, design, and technology",
};

export const revalidate = 3600;

export default async function BlogPage() {
  const publishedPosts = await getAllPublishedBlogPosts();

  return (
    <div style={{ minHeight: 'calc(100vh - 4rem)' }}>
      <div className="container" style={{
        paddingTop: '4.5rem',
        paddingBottom: '4rem'
      }}>
        {/* Header */}
        <div style={{ marginBottom: '2.5rem' }}>
          <h1 style={{
            fontSize: 'var(--text-3xl)',
            fontWeight: 600,
            color: 'var(--text-primary)',
            marginBottom: '0.75rem',
            letterSpacing: '-0.02em'
          }}>
            Blog
          </h1>
          <p style={{
            fontSize: 'var(--text-md)',
            color: 'var(--text-secondary)',
            lineHeight: '1.6'
          }}>
            Thoughts on software, design, and technology.
          </p>
        </div>

        {/* Blog Posts */}
        {publishedPosts.length === 0 ? (
          <div className="text-center" style={{
            padding: '6rem 0',
            color: 'var(--text-muted)'
          }}>
            <p>No blog posts published yet.</p>
          </div>
        ) : (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem',
            maxWidth: '56rem'
          }}>
            {publishedPosts.map((post) => (
              <BlogCard key={post.id} {...post} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
