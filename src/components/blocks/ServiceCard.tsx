import Image from "next/image";
import Link from "next/link";

interface ServiceCardProps {
  href: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
}

export function ServiceCard({ href, title, description, image, imageAlt }: ServiceCardProps) {
  return (
    <Link
      href={href}
      className="group flex flex-col overflow-hidden border border-ink/10 bg-white transition-colors duration-150 hover:border-rose hover:bg-rose focus-visible:border-rose focus-visible:bg-rose"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-rose-blush">
        <Image
          src={image}
          alt={imageAlt}
          fill
          className="object-cover object-center"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      </div>
      <div className="p-6 flex flex-col flex-1">
        <h3 className="mb-3 text-xl font-bold uppercase leading-tight tracking-[0.08em] text-rose transition-colors duration-150 group-hover:text-white group-focus-visible:text-white">
          {title}
        </h3>
        <p className="mb-5 flex-1 text-sm font-light leading-relaxed text-ink/70 transition-colors duration-150 group-hover:text-white group-focus-visible:text-white">{description}</p>
        <span className="inline-flex items-center gap-2 border-t border-ink/10 pt-4 text-[0.75rem] font-bold uppercase tracking-[0.14em] text-rose transition-colors duration-150 group-hover:border-white/40 group-hover:text-white group-focus-visible:border-white/40 group-focus-visible:text-white">
          Learn more <span aria-hidden="true">&rarr;</span>
        </span>
      </div>
    </Link>
  );
}
