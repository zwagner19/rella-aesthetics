import Image from "next/image";
import Link from "next/link";

interface BlogCardProps {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  image?: string;
}

export function BlogCard({ slug, title, excerpt, date, category, image }: BlogCardProps) {
  return (
    <article className="overflow-hidden border border-ink/12 bg-white transition-colors duration-300 hover:border-rose">
      <Link href={`/blog/${slug}`}>
        {image ? (
          <div className="relative aspect-[16/9] overflow-hidden">
            <Image
              src={image}
              alt={title}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          </div>
        ) : (
          <div className="aspect-[16/9] bg-silver-pale" />
        )}
      </Link>
      <div className="p-6">
        <p className="font-bold text-[0.625rem] tracking-[0.2em] uppercase text-rose-text mb-2">
          {category}
        </p>
        <h3 className="font-medium text-lg text-rose-text mb-2">
          <Link href={`/blog/${slug}`} className="transition-colors hover:text-ink">
            {title}
          </Link>
        </h3>
        <p className="text-sm text-ink/70 mb-3">{excerpt}</p>
        <time className="text-xs text-ink/70" dateTime={date}>
          {new Date(date).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </time>
      </div>
    </article>
  );
}
