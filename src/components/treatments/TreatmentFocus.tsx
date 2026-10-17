import Image from "next/image";

interface TreatmentFocusProps {
  id: string;
  eyebrow: string;
  heading: string;
  body: string;
  items: readonly string[];
  image: string;
  imageAlt: string;
  /** Wellness/device pages can reverse the split for visual variety. */
  imageFirst?: boolean;
}

export function TreatmentFocus({
  id,
  eyebrow,
  heading,
  body,
  items,
  image,
  imageAlt,
  imageFirst = false,
}: TreatmentFocusProps) {
  const copy = (
    <div>
      <p className="rella-editorial-eyebrow mb-6">{eyebrow}</p>
      <h2
        id={id}
        className="max-w-[14ch] text-[clamp(1.85rem,4vw,3.1rem)] font-medium leading-[1.12] tracking-[-0.02em] text-ink"
      >
        {heading}
      </h2>
      <p className="mt-7 max-w-[32rem] text-base font-light leading-relaxed text-silver md:text-lg">
        {body}
      </p>
      <ul className="mt-12 space-y-0 border-t border-rule">
        {items.map((item) => (
          <li
            key={item}
            className="border-b border-rule py-5 text-[1.05rem] font-medium tracking-[-0.01em] text-ink md:text-xl"
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );

  const media = (
    <div className="relative aspect-[3/4] overflow-hidden bg-oat lg:mt-10">
      <Image
        src={image}
        alt={imageAlt}
        fill
        className="object-cover object-center"
        sizes="(min-width: 1024px) 42vw, 100vw"
      />
    </div>
  );

  return (
    <section
      className="rella-site-reveal bg-ivory py-24 md:py-32"
      aria-labelledby={id}
    >
      <div className="mx-auto grid max-w-[1440px] items-start gap-14 px-6 md:px-8 lg:grid-cols-[0.95fr_1.05fr] lg:gap-20 lg:px-12">
        {imageFirst ? (
          <>
            {media}
            {copy}
          </>
        ) : (
          <>
            {copy}
            {media}
          </>
        )}
      </div>
    </section>
  );
}
