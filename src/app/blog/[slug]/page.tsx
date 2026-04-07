import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { client } from "@/sanity/client";
import { urlFor } from "@/sanity/image";
import { blogPostBySlugQuery, blogPostSlugsQuery } from "@/sanity/queries";
import { BlogContent } from "@/components/blog/BlogContent";
import { Button } from "@/components/ui/Button";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  if (!client) return [];
  const posts = await client.fetch<{ slug: string }[]>(blogPostSlugsQuery);
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  if (!client) return {};
  const { slug } = await params;
  const post = await client.fetch(blogPostBySlugQuery, { slug });
  if (!post) return {};

  const title = post.seoTitle || post.title;
  const description = post.seoDescription || post.excerpt;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime: post.publishedAt,
      ...(post.coverImage && {
        images: [{ url: urlFor(post.coverImage).width(1200).height(630).url() }],
      }),
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  if (!client) notFound();
  const { slug } = await params;
  const post = await client.fetch(blogPostBySlugQuery, { slug });
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      {/* Hero */}
      <section className="py-20 bg-rose-blush">
        <div className="mx-auto max-w-[1200px] px-6 md:px-8 lg:px-12">
          {post.categoryName && (
            <p className="font-bold text-[0.6875rem] tracking-[0.2em] uppercase text-silver mb-3">
              {post.categoryName}
            </p>
          )}
          <h1 className="font-bold text-3xl md:text-4xl lg:text-5xl tracking-[0.04em] text-silver-dark mb-4 max-w-[800px] leading-[1.2]">
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
          <div className="relative aspect-[2/1] rounded-lg overflow-hidden">
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
      <section className="py-16 bg-rose text-white text-center">
        <div className="mx-auto max-w-[600px] px-6">
          <h2 className="font-bold text-2xl md:text-3xl tracking-[0.06em] uppercase mb-4">
            Questions? We&apos;re Here to Help
          </h2>
          <p className="font-light text-lg mb-6 opacity-90">
            Book a consultation to discuss your treatment options with our team.
          </p>
          <Button
            href="/booking"
            className="bg-white !text-rose hover:bg-white/90 hover:!text-rose-dark"
          >
            Book Consultation
          </Button>
        </div>
      </section>
    </>
  );
}
