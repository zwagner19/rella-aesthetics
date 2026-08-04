import type { Metadata } from "next";
import Link from "next/link";
import { client } from "@/sanity/client";
import { allBlogPostsQuery, allCategoriesQuery } from "@/sanity/queries";
import { urlFor } from "@/sanity/image";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { BlogCard } from "@/components/blog/BlogCard";
import { BlogSidebar } from "@/components/blog/BlogSidebar";

export const metadata: Metadata = {
  title: "Education & Blog",
  description:
    "Expert insights on Botox, fillers, skin care, weight loss, and aesthetic treatments from the Rella Aesthetics team. Stay informed and empowered.",
  alternates: { canonical: "/blog" },
};

interface SanityPost {
  _id: string;
  title: string;
  slug: { current: string };
  publishedAt: string;
  excerpt: string;
  coverImage?: { asset: { _ref: string } };
  categoryName?: string;
  authorName?: string;
}

interface SanityCategory {
  _id: string;
  name: string;
  slug: { current: string };
}

const educationPaths = [
  {
    href: "/services/botox",
    title: "Understand Botox and Dysport",
    description:
      "Compare treatment basics, current per-unit pricing, common questions, and what to discuss at a consultation.",
    category: "Injectables",
  },
  {
    href: "/services/weight-loss",
    title: "Explore medical weight management",
    description:
      "See how the physician-led program starts, what the first conversation covers, and how to choose your nearest clinic.",
    category: "Medical Weight Management",
  },
  {
    href: "/services/hydrafacial",
    title: "Review HydraFacial options",
    description:
      "Compare the three published HydraFacial tiers, treatment steps, and questions to bring to your skin consultation.",
    category: "Skin Care",
  },
];

export default async function BlogPage() {
  let posts: SanityPost[] = [];
  let categories: SanityCategory[] = [];
  let usingSanity = false;

  if (client) {
    try {
      [posts, categories] = await Promise.all([
        client.fetch<SanityPost[]>(allBlogPostsQuery),
        client.fetch<SanityCategory[]>(allCategoriesQuery),
      ]);
      usingSanity = true;
    } catch {
      usingSanity = false;
    }
  }

  return (
    <>
      {/* Hero */}
      <section className="py-24 bg-rose-blush">
        <div className="mx-auto max-w-[1200px] px-6 md:px-8 lg:px-12">
          <p className="font-bold text-[0.6875rem] tracking-[0.2em] uppercase text-silver mb-4">
            Education
          </p>
          <h1 className="font-bold text-4xl md:text-5xl tracking-[0.08em] uppercase text-rose-text mb-4 leading-[1.1]">
            Insights &amp; Guides
          </h1>
          <p className="text-lg font-light text-silver max-w-[560px] leading-relaxed">
            Expert knowledge to help you make informed decisions about your aesthetic journey.
          </p>
        </div>
      </section>

      {/* Posts */}
      <section className="py-20">
        <div className="mx-auto max-w-[1200px] px-6 md:px-8 lg:px-12">
          {usingSanity && posts.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-12">
              <div>
                <SectionHeader eyebrow="Latest Articles" title="From the Blog" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {posts.map((post) => (
                    <BlogCard
                      key={post._id}
                      slug={post.slug.current}
                      title={post.title}
                      excerpt={post.excerpt}
                      date={post.publishedAt}
                      category={post.categoryName ?? "Uncategorized"}
                      image={
                        post.coverImage
                          ? urlFor(post.coverImage).width(600).height(340).url()
                          : undefined
                      }
                    />
                  ))}
                </div>
              </div>
              <BlogSidebar
                categories={categories.map((c) => ({
                  name: c.name,
                  slug: c.slug.current,
                }))}
                recentPosts={posts.slice(0, 5).map((p) => ({
                  slug: p.slug.current,
                  title: p.title,
                  date: p.publishedAt,
                }))}
              />
            </div>
          ) : (
            <div>
              <SectionHeader
                eyebrow="Start Here"
                title="Useful guidance while the education library grows"
                description="Rella's verified service guides are available now. New articles will appear here only after they are reviewed and published through the content system."
              />
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                {educationPaths.map((path) => (
                  <Link
                    key={path.href}
                    href={path.href}
                    className="group flex min-h-[260px] flex-col rounded-[1.25rem] border border-silver-pale bg-white p-7 transition-all hover:-translate-y-1 hover:border-rose-light hover:shadow-md"
                  >
                    <p className="mb-8 text-[0.625rem] font-bold uppercase tracking-[0.2em] text-rose-dark">
                      {path.category}
                    </p>
                    <h2 className="mb-3 text-xl font-medium leading-snug text-ink">
                      {path.title}
                    </h2>
                    <p className="mb-6 flex-1 text-sm leading-relaxed text-silver">
                      {path.description}
                    </p>
                    <span className="text-sm font-medium text-rose-text transition-colors group-hover:text-rose-dark">
                      Read the verified guide →
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
