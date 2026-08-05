// app/blog/[slug]/page.tsx
import { getAllBlogSlugs, getBlogPostBySlug } from "@/lib/database";
import { notFound } from "next/navigation";
import BackLink from "@/components/BackLink";

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
        <BackLink href="/blog" label="Back to Blog" />

        {/* Blog header */}
        <div style={{ marginBottom: "3rem" }}>
          <h1
            style={{
              fontSize: "var(--text-3xl)",
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
              fontSize: "var(--text-md)",
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
              fontSize: "var(--text-ui)",
              color: "var(--text-muted)",
              marginBottom: "1.5rem",
            }}
          >
            <span>{formattedDate}</span>
            <span>•</span>
            <span>{blog.readTime ?? "N/A"} min read</span>
          </div>

          {blog.tags && (
            <div className="flex flex-wrap" style={{ gap: "0.5rem", opacity: 0.7 }}>
              {blog.tags.map((tag, i) => (
                <span
                  key={i}
                  style={{
                    fontSize: "var(--text-xs)",
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
