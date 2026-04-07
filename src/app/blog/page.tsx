import type { Metadata } from "next";
import { client, projectId } from "@/sanity/client";
import { allBlogPostsQuery, allCategoriesQuery } from "@/sanity/queries";
import { urlFor } from "@/sanity/image";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { BlogCard } from "@/components/blog/BlogCard";
import { BlogSidebar } from "@/components/blog/BlogSidebar";

export const metadata: Metadata = {
  title: "Education & Blog",
  description:
    "Expert insights on Botox, fillers, skin care, weight loss, and aesthetic treatments from the Rella Aesthetics team. Stay informed and empowered.",
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

const placeholderPosts = [
  {
    slug: "botox-vs-dysport",
    title: "Botox vs. Dysport: Which Is Right for You?",
    excerpt:
      "Both neuromodulators deliver excellent results, but subtle differences make one a better fit depending on your goals and anatomy.",
    category: "Injectables",
    date: "2026-04-01",
  },
  {
    slug: "semaglutide-weight-loss-guide",
    title: "Your Complete Guide to Semaglutide Weight Loss",
    excerpt:
      "Everything you need to know about our physician-supervised medical weight loss program — how it works, what to expect, and who qualifies.",
    category: "Weight Loss",
    date: "2026-03-25",
  },
  {
    slug: "hydrafacial-benefits",
    title: "5 Reasons the HydraFacial Is Worth the Hype",
    excerpt:
      "From instant glow to long-term skin health improvements, here is why HydraFacial is one of our most requested treatments.",
    category: "Skin Care",
    date: "2026-03-18",
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
              <SectionHeader eyebrow="Latest Articles" title="From the Blog" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {placeholderPosts.map((post) => (
                  <BlogCard
                    key={post.slug}
                    slug={post.slug}
                    title={post.title}
                    excerpt={post.excerpt}
                    date={post.date}
                    category={post.category}
                  />
                ))}
              </div>
              <p className="mt-12 text-center text-silver text-sm">
                Blog content will be managed through Sanity CMS once integrated.
                These are placeholder articles.
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
