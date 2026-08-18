import Image from "next/image";
import Link from "next/link";

interface ServiceCardProps {
  href: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  imagePosition?: string;
}

export function ServiceCard({
  href,
  title,
  description,
  image,
  imageAlt,
  imagePosition = "center center",
}: ServiceCardProps) {
  return (
    <Link
      href={href}
      className="group flex flex-col bg-white border border-silver-pale overflow-hidden hover:border-rose transition-colors duration-150"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={image}
          alt={imageAlt}
          fill
          className="object-cover motion-safe:group-hover:scale-[1.02] motion-safe:transition-transform motion-safe:duration-500"
          style={{ objectPosition: imagePosition }}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      </div>
      <div className="p-6 flex flex-col flex-1">
        <h3 className="font-medium text-lg text-silver-dark mb-2">{title}</h3>
        <p className="text-silver text-sm mb-4 flex-1">{description}</p>
        <span className="inline-flex min-h-11 items-center gap-2 font-medium text-[0.8125rem] text-rose-text group-hover:gap-3 transition-all duration-150">
          Learn more <span>&rarr;</span>
        </span>
      </div>
    </Link>
  );
}
