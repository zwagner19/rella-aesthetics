import type { Metadata } from "next";
import Link from "next/link";
import { client } from "@/sanity/client";
import { allBlogPostsQuery, allCategoriesQuery } from "@/sanity/queries";
import { urlFor } from "@/sanity/image";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { BlogCard } from "@/components/blog/BlogCard";
import { BlogSidebar } from "@/components/blog/BlogSidebar";
import { LOCAL_EDITORIAL_POSTS } from "@/lib/local-editorial-posts";

export const metadata: Metadata = {
  title: "Education & Blog",
  description:
    "Transparent local guides to Botox pricing, fillers, skin care, laser treatments, and medical weight management from Rella Aesthetics in Napa and Vacaville.",
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

interface BlogCardRecord {
  id: string;
  title: string;
  slug: string;
  publishedAt: string;
  excerpt: string;
  category: string;
  image?: string;
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

  if (client) {
    try {
      [posts, categories] = await Promise.all([
        client.fetch<SanityPost[]>(allBlogPostsQuery),
        client.fetch<SanityCategory[]>(allCategoriesQuery),
      ]);
    } catch {
      posts = [];
      categories = [];
    }
  }

  const localCards: BlogCardRecord[] = LOCAL_EDITORIAL_POSTS.map((post) => ({
    id: `local-${post.slug}`,
    title: post.title,
    slug: post.slug,
    publishedAt: post.publishedAt,
    excerpt: post.excerpt,
    category: post.category,
    image: post.coverImage,
  }));

  const localSlugs = new Set(localCards.map((post) => post.slug));
  const sanityCards: BlogCardRecord[] = posts
    .filter((post) => !localSlugs.has(post.slug.current))
    .map((post) => ({
      id: post._id,
      title: post.title,
      slug: post.slug.current,
      publishedAt: post.publishedAt,
      excerpt: post.excerpt,
      category: post.categoryName ?? "Education",
      image: post.coverImage
        ? urlFor(post.coverImage).width(600).height(340).url()
        : undefined,
    }));

  const publishedPosts = [...localCards, ...sanityCards].sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );

  const categoryMap = new Map<string, { name: string; slug: string }>();
  for (const category of categories) {
    categoryMap.set(category.slug.current, {
      name: category.name,
      slug: category.slug.current,
    });
  }
  for (const post of LOCAL_EDITORIAL_POSTS) {
    const slug = post.category.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    categoryMap.set(slug, { name: post.category, slug });
  }
  const publishedCategories = [...categoryMap.values()];

  return (
    <>
      {/* Hero */}
      <section className="bg-rose py-24 text-white">
        <div className="mx-auto max-w-[1200px] px-6 md:px-8 lg:px-12">
          <p className="font-bold text-[0.6875rem] tracking-[0.2em] uppercase text-ink mb-4">
            Education
          </p>
          <h1 className="mb-5 text-4xl font-bold uppercase leading-[1.08] tracking-[0.08em] text-white md:text-6xl">
            Insights &amp; Guides
          </h1>
          <p className="max-w-[560px] text-lg font-light leading-relaxed text-white">
            Local facts, transparent pricing, and practical questions to help
            you make a more informed treatment decision.
          </p>
        </div>
      </section>

      {/* Posts */}
      <section className="py-20">
        <div className="mx-auto max-w-[1200px] px-6 md:px-8 lg:px-12">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_300px]">
            <div>
              <SectionHeader
                eyebrow="Latest Article"
                title="Local answers that lead somewhere useful"
                description="Each article is built from Rella's current public facts and connects to the relevant clinic, service, and booking path."
              />
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {publishedPosts.map((post) => (
                  <BlogCard
                    key={post.id}
                    slug={post.slug}
                    title={post.title}
                    excerpt={post.excerpt}
                    date={post.publishedAt}
                    category={post.category}
                    image={post.image}
                  />
                ))}
              </div>
            </div>
            <BlogSidebar
              categories={publishedCategories}
              recentPosts={publishedPosts.slice(0, 5).map((post) => ({
                slug: post.slug,
                title: post.title,
                date: post.publishedAt,
              }))}
            />
          </div>

          <div className="mt-20 border-t border-silver-pale pt-16">
            <SectionHeader
              eyebrow="Verified Starting Points"
              title="Go straight to the treatment guide"
              description="Prefer the essentials? These service guides use the same current pricing and booking rules."
            />
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {educationPaths.map((path) => (
                <Link
                  key={path.href}
                  href={path.href}
                  className="group flex min-h-[260px] flex-col border border-ink/12 bg-white p-7 transition-colors hover:border-rose"
                >
                  <p className="mb-8 text-[0.625rem] font-bold uppercase tracking-[0.2em] text-rose">
                    {path.category}
                  </p>
                  <h2 className="mb-3 text-xl font-medium leading-snug text-rose">
                    {path.title}
                  </h2>
                  <p className="mb-6 flex-1 text-sm leading-relaxed text-ink/70">
                    {path.description}
                  </p>
                  <span className="text-sm font-medium text-rose transition-colors group-hover:text-ink">
                    Read the verified guide →
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
