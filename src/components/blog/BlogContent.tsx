import { PortableText, type PortableTextComponents } from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/types";
import Image from "next/image";
import { urlFor } from "@/sanity/image";

const components: PortableTextComponents = {
  block: {
    h2: ({ children }) => (
      <h2 className="font-medium text-2xl text-rose-text mt-10 mb-4">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="font-medium text-xl text-rose-text mt-8 mb-3">{children}</h3>
    ),
    h4: ({ children }) => (
      <h4 className="font-medium text-lg text-rose-text mt-6 mb-2">{children}</h4>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-rose-light pl-6 my-6 italic text-ink/70">
        {children}
      </blockquote>
    ),
    normal: ({ children }) => (
      <p className="text-ink/70 leading-relaxed mb-4">{children}</p>
    ),
  },
  marks: {
    link: ({ children, value }) => (
      <a
        href={value?.href}
        className="text-rose-text underline underline-offset-2 hover:text-ink transition-colors"
        target={value?.href?.startsWith("http") ? "_blank" : undefined}
        rel={value?.href?.startsWith("http") ? "noopener noreferrer" : undefined}
      >
        {children}
      </a>
    ),
  },
  types: {
    image: ({ value }) => {
      if (!value?.asset) return null;
      return (
        <figure className="my-8">
          <Image
            src={urlFor(value).width(800).url()}
            alt={value.alt || ""}
            width={800}
            height={450}
            className="w-full h-auto"
          />
          {value.caption && (
            <figcaption className="mt-2 text-sm text-silver text-center">
              {value.caption}
            </figcaption>
          )}
        </figure>
      );
    },
  },
};

interface BlogContentProps {
  body: PortableTextBlock[];
}

export function BlogContent({ body }: BlogContentProps) {
  return (
    <div className="max-w-[720px]">
      <PortableText value={body} components={components} />
    </div>
  );
}
