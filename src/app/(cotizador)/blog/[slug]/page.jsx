import { notFound } from "next/navigation";
import { getBlogPostBySlug } from "@/features/admin/blog/actions";
import BlogArticleLayout from "@/shared/components/BlogArticleLayout";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) return {};

  return {
    title: post.meta_title || `${post.title} | Shippar`,
    description: post.meta_description || post.excerpt || "",
    openGraph: {
      title: post.meta_title || post.title,
      description: post.meta_description || post.excerpt || "",
      url: `https://shippar.net/blog/${post.slug}`,
      type: "article",
    },
    alternates: { canonical: `https://shippar.net/blog/${post.slug}` },
  };
}

export default async function BlogPostPage({ params }) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  /* Article JSON-LD */
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.meta_description || post.excerpt || "",
    url: `https://shippar.net/blog/${post.slug}`,
    datePublished: post.created_at,
    dateModified: post.updated_at || post.created_at,
    author: { "@type": "Organization", name: "Shippar Global Logistics", url: "https://shippar.net" },
    publisher: { "@type": "Organization", name: "Shippar Global Logistics", url: "https://shippar.net" },
  };

  /* Breadcrumb JSON-LD */
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Shippar", item: "https://shippar.net" },
      { "@type": "ListItem", position: 2, name: "Blog", item: "https://shippar.net/blog" },
      { "@type": "ListItem", position: 3, name: post.title, item: `https://shippar.net/blog/${post.slug}` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <BlogArticleLayout
        title={post.title}
        readTime={post.read_time}
        tags={post.tags || []}
      >
        {/* Content is stored as HTML in Supabase */}
        <div dangerouslySetInnerHTML={{ __html: post.content }} />
      </BlogArticleLayout>
    </>
  );
}
