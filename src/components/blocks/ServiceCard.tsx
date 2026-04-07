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
      className="group flex flex-col bg-white border border-silver-pale rounded-lg overflow-hidden hover:shadow-md hover:-translate-y-1 hover:border-rose-light transition-all duration-300"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={image}
          alt={imageAlt}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      </div>
      <div className="p-6 flex flex-col flex-1">
        <h3 className="font-medium text-lg text-silver-dark mb-2">{title}</h3>
        <p className="text-silver text-sm mb-4 flex-1">{description}</p>
        <span className="inline-flex items-center gap-2 font-medium text-[0.8125rem] text-rose-text group-hover:gap-3 transition-all duration-150">
          Learn more <span>&rarr;</span>
        </span>
      </div>
    </Link>
  );
}
