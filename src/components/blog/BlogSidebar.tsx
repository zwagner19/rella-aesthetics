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
      {/* Categories */}
      <div className="bg-rose p-6 text-white">
        <h3 className="font-medium text-lg text-white mb-4">Categories</h3>
        <ul className="space-y-2">
          {categories.map((cat) => (
            <li key={cat.slug}>
              <Link
                href={`/blog?category=${cat.slug}`}
                className="text-sm text-white transition-colors hover:text-white"
              >
                {cat.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Recent Posts */}
      {recentPosts.length > 0 && (
        <div className="bg-rose p-6 text-white">
          <h3 className="font-medium text-lg text-white mb-4">Recent Posts</h3>
          <ul className="space-y-3">
            {recentPosts.map((post) => (
              <li key={post.slug}>
                <Link
                  href={`/blog/${post.slug}`}
                  className="block text-sm leading-snug text-white transition-colors hover:text-white"
                >
                  {post.title}
                </Link>
                <time className="text-xs text-white/80" dateTime={post.date}>
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

      {/* CTA */}
      <div className="bg-rose p-6 text-center text-white">
        <p className="font-medium text-white mb-2">Ready to begin?</p>
        <p className="text-sm text-white mb-4">Schedule your consultation today.</p>
        <Button
          href={resolveBookingHref({})}
          size="sm"
          className="!border-white !bg-white !text-rose hover:!border-white hover:!bg-white hover:!text-rose"
        >
          Book Consultation
        </Button>
      </div>
    </aside>
  );
}
