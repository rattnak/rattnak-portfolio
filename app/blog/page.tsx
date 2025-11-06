// app/blog/page.tsx
import { mockBlogPosts } from "@/lib/mockData";
import BlogCard from "@/components/BlogCard";

export const metadata = {
  title: "Blog - Chanrattnak Mong",
  description: "Thoughts on software, design, and technology",
};

export default function BlogPage() {
  const publishedPosts = mockBlogPosts.filter(post => post.publishedAt !== null);

  return (
    <div className="min-h-screen">
      <div className="container" style={{
        paddingTop: '4.5rem',
        paddingBottom: '4rem',
        maxWidth: '56rem'
      }}>
        {/* Header */}
        <div style={{ marginBottom: '1rem' }}>
          <h1 className="text-4xl md:text-5xl font-bold" style={{
            color: 'var(--text-primary)',
            marginBottom: '0.5rem',
            letterSpacing: '-0.02em'
          }}>
            Blog
          </h1>
          <p className="text-lg" style={{
            color: 'var(--text-secondary)',
            lineHeight: '1.7'
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
            gap: '1.5rem'
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
