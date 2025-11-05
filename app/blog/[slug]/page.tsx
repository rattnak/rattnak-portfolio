// app/blog/[slug]/page.tsx
import { mockBlogPosts } from "@/lib/mockData";
import { notFound } from "next/navigation";
import Link from "next/link";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function BlogDetailPage({ params }: Props) {
  const { slug } = await params;
  const blog = mockBlogPosts.find((post) => post.slug === slug);

  if (!blog) notFound();

  return (
    <div className="section" style={{ minHeight: 'calc(100vh - 4rem)' }}>
      <div className="container max-w-4xl">
        {/* Back button */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm link-text mb-8 group"
        >
          <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Blog
        </Link>

        {/* Blog Header */}
        <div className="space-y-6 mb-12">
          <h1 className="text-4xl md:text-5xl font-bold" style={{ color: 'var(--text-primary)' }}>
            {blog.title}
          </h1>

          <p className="text-lg leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            {blog.excerpt}
          </p>

          <div className="flex items-center gap-6 text-sm" style={{ color: 'var(--text-muted)' }}>
            <span>
              {new Date(blog.publishedAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
            <span>•</span>
            <span>{blog.readTime} min read</span>
          </div>

          {blog.tags && (
            <div className="flex flex-wrap gap-2 pt-2">
              {blog.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="text-sm px-4 py-2 rounded-full"
                  style={{
                    backgroundColor: 'var(--background-secondary)',
                    color: 'var(--text-secondary)'
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Cover image */}
        {blog.coverImage && (
          <div className="mb-12">
            <img
              src={blog.coverImage}
              alt={blog.title}
              className="rounded-lg w-full object-cover aspect-video"
            />
          </div>
        )}

        {/* Content */}
        <article className="prose max-w-none" style={{ color: 'var(--text-secondary)' }}>
          {blog.content ? (
            <div dangerouslySetInnerHTML={{ __html: blog.content }} />
          ) : (
            <p className="italic" style={{ color: 'var(--text-muted)' }}>Full blog content coming soon.</p>
          )}
        </article>
      </div>
    </div>
  );
}
