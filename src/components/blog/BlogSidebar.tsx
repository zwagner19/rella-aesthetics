import Link from "next/link";
import { resolveBookingHref } from "@/lib/booking-routes";
import { Button } from "@/components/ui/Button";

interface SidebarPost {
  slug: string;
  title: string;
  date: string;
}

interface BlogSidebarProps {
  categories: { name: string; slug: string }[];
  recentPosts: SidebarPost[];
}

export function BlogSidebar({ categories, recentPosts }: BlogSidebarProps) {
  return (
    <aside className="space-y-8">
      <div className="bg-white border border-silver-pale p-6">
        <h3 className="font-medium text-lg text-ink mb-4">Categories</h3>
        <ul className="space-y-2">
          {categories.map((cat) => (
            <li key={cat.slug}>
              <Link
                href={`/blog?category=${cat.slug}`}
                className="text-sm text-silver hover:text-rose-text transition-colors"
              >
                {cat.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {recentPosts.length > 0 && (
        <div className="bg-white border border-silver-pale p-6">
          <h3 className="font-medium text-lg text-ink mb-4">Recent Posts</h3>
          <ul className="space-y-3">
            {recentPosts.map((post) => (
              <li key={post.slug}>
                <Link
                  href={`/blog/${post.slug}`}
                  className="text-sm text-ink hover:text-rose-text transition-colors block leading-snug"
                >
                  {post.title}
                </Link>
                <time className="text-xs text-silver-light" dateTime={post.date}>
                  {new Date(post.date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </time>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="bg-white border border-silver-pale p-6 text-center">
        <p className="font-medium text-ink mb-2">Ready to begin?</p>
        <p className="text-sm text-silver mb-4">Schedule your consultation today.</p>
        <Button href={resolveBookingHref({})} size="sm">
          Book Consultation
        </Button>
      </div>
    </aside>
  );
}
