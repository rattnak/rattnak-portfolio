// app/blog/[slug]/page.tsx
import { getAllBlogSlugs, getBlogPostBySlug } from "@/lib/database";
import { notFound } from "next/navigation";
import Link from "next/link";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const slugs = await getAllBlogSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const blog = await getBlogPostBySlug(slug);
  if (!blog) return { title: "Blog Post Not Found" };
  return { title: `${blog.title} - Chanrattnak Mong`, description: blog.excerpt };
}

export default async function BlogDetailPage({ params }: Props) {
  const { slug } = await params;
  const blog = await getBlogPostBySlug(slug);
  if (!blog) notFound();

  const formattedDate =
    typeof blog.publishedAt === "string" && blog.publishedAt
      ? new Date(blog.publishedAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : "Unpublished";

  return (
    <div className="min-h-screen">
      <div
        className="container"
        style={{ paddingTop: "4.5rem", paddingBottom: "4rem", maxWidth: "56rem" }}
      >
        {/* Back button */}
        <Link
          href="/blog"
          className="inline-flex items-center group transition-colors hover:text-[var(--accent-primary)]"
          style={{
            gap: "0.5rem",
            fontSize: "0.875rem",
            color: "var(--text-secondary)",
            marginBottom: "2rem",
          }}
        >
          <svg
            className="transition-transform group-hover:-translate-x-1"
            style={{ width: "0.875rem", height: "0.875rem" }}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Blog
        </Link>

        {/* Blog header */}
        <div style={{ marginBottom: "3rem" }}>
          <h1
            style={{
              fontSize: "clamp(1.75rem,5vw,2.5rem)",
              fontWeight: 700,
              color: "var(--text-primary)",
              marginBottom: "1rem",
              lineHeight: 1.2,
              letterSpacing: "-0.02em",
            }}
          >
            {blog.title}
          </h1>

          <p
            style={{
              fontSize: "1.0625rem",
              lineHeight: 1.6,
              color: "var(--text-secondary)",
              marginBottom: "1rem",
            }}
          >
            {blog.excerpt}
          </p>

          <div
            className="flex items-center flex-wrap"
            style={{
              gap: "1rem",
              fontSize: "0.875rem",
              color: "var(--text-muted)",
              marginBottom: "1.5rem",
            }}
          >
            <span>{formattedDate}</span>
            <span>•</span>
            <span>{blog.readTime ?? "—"} min read</span>
          </div>

          {blog.tags && (
            <div className="flex flex-wrap" style={{ gap: "0.5rem", opacity: 0.7 }}>
              {blog.tags.map((tag, i) => (
                <span
                  key={i}
                  style={{
                    fontSize: "0.75rem",
                    padding: "0.375rem 0.75rem",
                    borderRadius: "0.25rem",
                    backgroundColor: "var(--background-secondary)",
                    color: "var(--text-secondary)",
                    fontWeight: 500,
                    border: "1px solid var(--border)",
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {blog.coverImage && (
          <div
            style={{
              marginBottom: "3rem",
              borderRadius: "0.75rem",
              overflow: "hidden",
              backgroundColor: "var(--background-secondary)",
              border: "1px solid var(--border)",
            }}
          >
            <img
              src={blog.coverImage}
              alt={blog.title}
              className="w-full object-cover aspect-video"
            />
          </div>
        )}

        <article className="prose max-w-none" style={{ color: "var(--text-secondary)" }}>
          {blog.content ? (
            <div dangerouslySetInnerHTML={{ __html: blog.content }} />
          ) : (
            <p className="italic" style={{ color: "var(--text-muted)" }}>
              Full blog content coming soon.
            </p>
          )}
        </article>
      </div>
    </div>
  );
}
