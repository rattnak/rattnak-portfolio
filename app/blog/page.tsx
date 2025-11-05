// app/blog/page.tsx
import { mockBlogPosts } from "@/lib/mockData";
import BlogCard from "@/components/BlogCard";

export const metadata = {
  title: "Blog – Chanrattnak Mong",
  description: "Thoughts on software, design, and technology",
};

export default function BlogPage() {
  const publishedPosts = mockBlogPosts.filter(post => post.publishedAt !== null);

  return (
    <div className="section" style={{ minHeight: 'calc(100vh - 4rem)' }}>
      <div className="container">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
            Blog
          </h1>
          <p className="text-lg max-w-3xl" style={{ color: 'var(--text-secondary)' }}>
            Thoughts on software, design, and technology.
          </p>
        </div>

        {/* Blog Posts */}
        {publishedPosts.length === 0 ? (
          <div className="text-center py-20" style={{ color: 'var(--text-muted)' }}>
            <p>No blog posts published yet.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {publishedPosts.map((post) => (
              <BlogCard key={post.id} {...post} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
