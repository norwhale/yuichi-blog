import { notFound } from "next/navigation";
import Image from "next/image";
import { getAllSlugs, getPostBySlug } from "@/lib/posts";
import AdBanner from "@/components/AdBanner";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.date,
      url: `https://yuichi.blog/blog/${slug}`,
      authors: ["Yuichi"],
      ...(post.image && {
        images: [{ url: post.image, width: 1200, height: 630, alt: post.title }],
      }),
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      ...(post.image && { images: [post.image] }),
    },
    alternates: {
      canonical: `https://yuichi.blog/blog/${slug}`,
    },
  };
}

export default async function BlogPost({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    author: {
      "@type": "Person",
      name: "Yuichi",
    },
    url: `https://yuichi.blog/blog/${slug}`,
    ...(post.image && { image: `https://yuichi.blog${post.image}` }),
  };

  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 pt-24 pb-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero Image */}
      {post.image && (
        <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden mb-8 -mt-2">
          <Image
            src={post.image}
            alt={`${post.title} — ${post.description}`}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 100vw, 768px"
          />
        </div>
      )}

      {/* Header */}
      <header className="mb-8">
        <div className="flex items-center gap-3 text-sm text-muted mb-3">
          <time dateTime={post.date}>
            {new Date(post.date).toLocaleDateString("ja-JP", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>
          <span>&middot;</span>
          <span>{post.readingTime}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
          {post.title}
        </h1>
        <div className="flex gap-2 flex-wrap">
          {post.tags.map((tag) => (
            <span key={tag} className="text-xs px-2.5 py-1 rounded-full bg-accent-light text-accent font-medium">
              {tag}
            </span>
          ))}
        </div>
      </header>

      {/* Ad - Top */}
      <AdBanner />

      {/* Content */}
      <div
        className="prose"
        dangerouslySetInnerHTML={{ __html: post.contentHtml }}
      />

      {/* Ad - Bottom */}
      <AdBanner />

      {/* Back link */}
      <div className="mt-12 pt-6 border-t border-border">
        <a href="/" className="text-accent hover:underline text-sm">
          &larr; Back to all posts
        </a>
      </div>
    </article>
  );
}
