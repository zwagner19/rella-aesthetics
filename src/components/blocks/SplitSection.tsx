import Image from "next/image";

interface SplitSectionProps {
  children: React.ReactNode;
  image: string;
  imageAlt: string;
  reverse?: boolean;
}

export function SplitSection({ children, image, imageAlt, reverse = false }: SplitSectionProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16 items-center">
      <div className={reverse ? "md:order-2" : ""}>
        {children}
      </div>
      <div className={reverse ? "md:order-1" : ""}>
        <div className="relative aspect-[7/5] overflow-hidden">
          <Image
            src={image}
            alt={imageAlt}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
      </div>
    </div>
  );
}
