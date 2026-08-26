import type { Metadata } from "next";
import { resolveBookingHref } from "@/lib/booking-routes";
import Image from "next/image";
import { notFound } from "next/navigation";
import { client } from "@/sanity/client";
import { urlFor } from "@/sanity/image";
import { blogPostBySlugQuery, blogPostSlugsQuery } from "@/sanity/queries";
import { BlogContent } from "@/components/blog/BlogContent";
import { LocalEditorialPost } from "@/components/blog/LocalEditorialPost";
import { Button } from "@/components/ui/Button";
import {
  getLocalEditorialPost,
  LOCAL_EDITORIAL_POSTS,
} from "@/lib/local-editorial-posts";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const localParams = LOCAL_EDITORIAL_POSTS.map((post) => ({ slug: post.slug }));
  if (!client) return localParams;
  try {
    const posts = await client.fetch<{ slug: string }[]>(blogPostSlugsQuery);
    const localSlugs = new Set(localParams.map((post) => post.slug));
    return [
      ...localParams,
      ...posts
        .filter((post) => !localSlugs.has(post.slug))
        .map((post) => ({ slug: post.slug })),
    ];
  } catch {
    // Don’t fail the whole Vercel build if Sanity is unreachable at build time;
    // `[slug]` can still render on-demand when the CMS is available.
    return localParams;
  }
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const localPost = getLocalEditorialPost(slug);
  if (localPost) {
    return {
      title: localPost.seoTitle,
      description: localPost.seoDescription,
      alternates: { canonical: `/blog/${slug}` },
      openGraph: {
        title: localPost.title,
        description: localPost.seoDescription,
        url: `/blog/${slug}`,
        type: "article",
        publishedTime: localPost.publishedAt,
        modifiedTime: localPost.modifiedAt,
        images: [{ url: localPost.ogImage, alt: localPost.seoTitle }],
      },
      twitter: {
        card: "summary_large_image",
        title: localPost.seoTitle,
        description: localPost.seoDescription,
        images: [localPost.ogImage],
      },
    };
  }

  if (!client) return {};
  let post;
  try {
    post = await client.fetch(blogPostBySlugQuery, { slug });
  } catch {
    return {};
  }
  if (!post) return {};

  const title = post.seoTitle || post.title;
  const description = post.seoDescription || post.excerpt;

  return {
    title,
    description,
    alternates: { canonical: `/blog/${slug}` },
    openGraph: {
      title,
      description,
      url: `/blog/${slug}`,
      type: "article",
      publishedTime: post.publishedAt,
      ...(post.coverImage && {
        images: [{ url: urlFor(post.coverImage).width(1200).height(630).url() }],
      }),
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const localPost = getLocalEditorialPost(slug);
  if (localPost) return <LocalEditorialPost post={localPost} />;

  if (!client) notFound();
  let post;
  try {
    post = await client.fetch(blogPostBySlugQuery, { slug });
  } catch {
    notFound();
  }
  if (!post) notFound();

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    datePublished: post.publishedAt,
    description: post.excerpt,
    author: post.author
      ? {
          "@type": "Person",
          name: post.author.name,
          jobTitle: post.author.role,
        }
      : undefined,
    publisher: {
      "@type": "Organization",
      name: "Rella Aesthetics",
      url: "https://experiencerella.com",
    },
    ...(post.coverImage && {
      image: urlFor(post.coverImage).width(1200).height(630).url(),
    }),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleSchema).replace(/</g, "\\u003c"),
        }}
      />

      {/* Hero */}
      <section className="py-20 bg-rose-blush">
        <div className="mx-auto max-w-[1200px] px-6 md:px-8 lg:px-12">
          {post.categoryName && (
            <p className="font-bold text-[0.6875rem] tracking-[0.2em] uppercase text-rose mb-3">
              {post.categoryName}
            </p>
          )}
          <h1 className="font-bold text-3xl md:text-4xl lg:text-5xl tracking-[0.04em] text-rose mb-4 max-w-[800px] leading-[1.2]">
            {post.title}
          </h1>
          <div className="flex items-center gap-4 text-sm text-silver">
            {post.author && <span>By {post.author.name}</span>}
            {post.publishedAt && (
              <time dateTime={post.publishedAt}>
                {new Date(post.publishedAt).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </time>
            )}
          </div>
        </div>
      </section>

      {/* Cover Image */}
      {post.coverImage && (
        <div className="mx-auto max-w-[1200px] px-6 md:px-8 lg:px-12 -mt-2 mb-12">
          <div className="relative aspect-[2/1] overflow-hidden">
            <Image
              src={urlFor(post.coverImage).width(1200).height(600).url()}
              alt={post.title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 1200px) 100vw, 1200px"
            />
          </div>
        </div>
      )}

      {/* Body */}
      <section className="py-8 pb-20">
        <div className="mx-auto max-w-[1200px] px-6 md:px-8 lg:px-12">
          {post.body && <BlogContent body={post.body} />}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-rose-cta py-16 text-center text-white">
        <div className="mx-auto max-w-[600px] px-6">
          <h2 className="font-bold text-2xl md:text-3xl tracking-[0.06em] uppercase mb-4 text-white">
            Questions? We&apos;re Here to Help
          </h2>
          <p className="font-light text-lg mb-6 opacity-90">
            Book a consultation to discuss your treatment options with our team.
          </p>
          <Button
            href={resolveBookingHref({})}
            disableHover
            className="!border-white !bg-white !text-rose"
          >
            Book Consultation
          </Button>
        </div>
      </section>
    </>
  );
}
