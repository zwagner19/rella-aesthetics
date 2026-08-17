import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { resolveBookingHref } from "@/lib/booking-routes";
import type { LocalEditorialPost as LocalEditorialPostData } from "@/lib/local-editorial-posts";

const NAPA_BOOKING_HREF = resolveBookingHref({
  location: "napa",
  service: "botox",
});

function PricingTable({ post }: { post: LocalEditorialPostData }) {
  return (
    <div className="my-8 overflow-x-auto border border-ink/12">
      <table className="w-full min-w-[640px] border-collapse text-left">
        <caption className="sr-only">
          Current Rella Napa Botox, Dysport, membership, and deposit pricing
        </caption>
        <thead className="bg-rose-blush text-[0.6875rem] font-bold uppercase tracking-[0.14em] text-silver-dark">
          <tr>
            <th className="px-5 py-4" scope="col">Item</th>
            <th className="px-5 py-4" scope="col">Current public price</th>
            <th className="px-5 py-4" scope="col">What it means</th>
          </tr>
        </thead>
        <tbody>
          {post.priceRows.map((row) => (
            <tr key={row.item} className="border-t border-silver-pale align-top">
              <th className="px-5 py-4 font-medium text-ink" scope="row">
                {row.item}
              </th>
              <td className="px-5 py-4 font-semibold text-rose-text">
                {row.publicPrice}
              </td>
              <td className="px-5 py-4 text-sm leading-relaxed text-silver-dark">
                {row.whatItMeans}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function LocalEditorialPost({
  post,
}: {
  post: LocalEditorialPostData;
}) {
  const articleSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": `https://experiencerella.com/blog/${post.slug}#article`,
        headline: post.title,
        description: post.excerpt,
        datePublished: post.publishedAt,
        dateModified: post.modifiedAt,
        mainEntityOfPage: `https://experiencerella.com/blog/${post.slug}`,
        image: `https://experiencerella.com${post.coverImage}`,
        author: {
          "@type": "Organization",
          name: post.authorName,
          url: "https://experiencerella.com/about",
        },
        publisher: {
          "@type": "Organization",
          "@id": "https://experiencerella.com/#organization",
          name: "Rella Aesthetics",
          url: "https://experiencerella.com",
        },
        about: [
          { "@type": "Thing", name: "Botox pricing" },
          { "@type": "City", name: "Napa" },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: post.faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: { "@type": "Answer", text: faq.answer },
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: "https://experiencerella.com/",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Education",
            item: "https://experiencerella.com/blog",
          },
          {
            "@type": "ListItem",
            position: 3,
            name: post.title,
            item: `https://experiencerella.com/blog/${post.slug}`,
          },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleSchema).replace(/</g, "\\u003c"),
        }}
      />

      <article>
        <header className="bg-rose-blush py-16 md:py-24">
          <div className="mx-auto max-w-[1100px] px-6 md:px-8 lg:px-12">
            <nav aria-label="Breadcrumb" className="mb-8 text-sm text-silver">
              <ol className="flex flex-wrap items-center gap-2">
                <li><Link href="/" className="hover:text-rose-text">Home</Link></li>
                <li aria-hidden="true">/</li>
                <li><Link href="/blog" className="hover:text-rose-text">Education</Link></li>
                <li aria-hidden="true">/</li>
                <li aria-current="page" className="text-silver-dark">Botox cost in Napa</li>
              </ol>
            </nav>

            <p className="mb-5 text-[0.6875rem] font-bold uppercase tracking-[0.2em] text-rose">
              {post.eyebrow}
            </p>
            <h1 className="max-w-[950px] text-[clamp(2.35rem,6vw,4.75rem)] font-medium leading-[1.02] tracking-[-0.055em] text-rose">
              {post.title}
            </h1>
            <p className="mt-7 max-w-[760px] text-lg font-light leading-relaxed text-silver-dark md:text-xl">
              {post.dek}
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-silver">
              <span>Published by {post.authorName}</span>
              <span aria-hidden="true">·</span>
              <time dateTime={post.publishedAt}>
                August 3, 2026
              </time>
              <span aria-hidden="true">·</span>
              <span>{post.readingTime}</span>
            </div>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button
                href={NAPA_BOOKING_HREF}
                data-cta="service-booking"
                className="rounded-full"
              >
                Book Napa Botox
              </Button>
              <Button href="/napa/botox" variant="ghost" className="rounded-full bg-white/70">
                View Napa Treatment Page
              </Button>
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-[1100px] px-6 md:px-8 lg:px-12">
          <div className="relative -mt-7 overflow-hidden border border-ink/12 bg-white">
            <div className="relative aspect-[1731/909] max-h-[470px] bg-white">
              <Image
                src={post.coverImage}
                alt={post.coverAlt}
                fill
                preload
                className="object-contain"
                sizes="(max-width: 1100px) 100vw, 1100px"
              />
            </div>
          </div>
        </div>

        <div className="mx-auto grid max-w-[1100px] gap-12 px-6 py-16 md:px-8 lg:grid-cols-[minmax(0,1fr)_300px] lg:px-12 lg:py-24">
          <div className="min-w-0">
            <section aria-labelledby="answer-first" className="border-l-4 border-rose bg-rose-blush p-6 md:p-8">
              <p className="mb-3 text-[0.6875rem] font-bold uppercase tracking-[0.18em] text-rose">
                The short answer
              </p>
              <h2 id="answer-first" className="sr-only">Current Rella Napa tox pricing</h2>
              <p className="text-lg leading-relaxed text-ink">{post.answerFirst}</p>
            </section>

            <section aria-labelledby="pricing-table" className="mt-14">
              <p className="mb-3 text-[0.6875rem] font-bold uppercase tracking-[0.18em] text-rose">
                Transparent 2026 pricing
              </p>
              <h2 id="pricing-table" className="text-3xl font-medium tracking-[-0.035em] text-rose">
                Rella Napa price table
              </h2>
              <p className="mt-4 leading-relaxed text-silver-dark">
                These are Rella&apos;s current public prices. The treatment total depends on the plan reviewed at your visit.
              </p>
              <PricingTable post={post} />
            </section>

            {post.sections.map((section, index) => (
              <section key={section.id} id={section.id} aria-labelledby={`${section.id}-heading`} className="scroll-mt-28 border-t border-silver-pale py-10 first:border-t-0">
                <h2 id={`${section.id}-heading`} className="text-2xl font-medium tracking-[-0.025em] text-rose md:text-3xl">
                  {section.heading}
                </h2>
                <div className="mt-5 space-y-4">
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph} className="leading-8 text-silver-dark">
                      {paragraph}
                    </p>
                  ))}
                </div>
                {section.bullets && (
                  <ul className="mt-6 space-y-3">
                    {section.bullets.map((bullet) => (
                      <li key={bullet} className="flex gap-3 leading-7 text-silver-dark">
                        <span aria-hidden="true" className="mt-2.5 h-1.5 w-1.5 flex-none rounded-full bg-rose" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                )}
                {index === 1 && (
                  <div className="mt-8 bg-ink p-6 text-white md:p-8">
                    <p className="text-[0.6875rem] font-bold uppercase tracking-[0.18em] text-rose-light">
                      Want the exact plan, not a guess?
                    </p>
                    <p className="mt-3 max-w-[560px] text-lg font-light leading-relaxed text-white/80">
                      Book the 30-minute Napa new-patient visit. Your provider reviews the proposed units and total before treatment.
                    </p>
                    <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                      <Button
                        href={NAPA_BOOKING_HREF}
                        data-cta="service-booking"
                        className="rounded-full"
                      >
                        See Napa Tox Times
                      </Button>
                      <a
                        href="tel:+17073582928"
                        className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/35 px-6 text-sm font-medium text-white transition-colors hover:border-white"
                      >
                        Call (707) 358-2928
                      </a>
                    </div>
                  </div>
                )}
              </section>
            ))}

            <section aria-labelledby="faq-heading" className="border-t border-silver-pale pt-10">
              <p className="mb-3 text-[0.6875rem] font-bold uppercase tracking-[0.18em] text-rose">
                Napa Botox pricing FAQ
              </p>
              <h2 id="faq-heading" className="text-3xl font-medium tracking-[-0.035em] text-rose">
                Questions before you book
              </h2>
              <div className="mt-7 divide-y divide-silver-pale border-y border-silver-pale">
                {post.faqs.map((faq) => (
                  <details key={faq.question} className="group py-1">
                    <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-3 font-medium text-ink">
                      {faq.question}
                      <span aria-hidden="true" className="text-xl font-light text-rose-text group-open:rotate-45">+</span>
                    </summary>
                    <p className="max-w-[680px] pb-5 pr-8 leading-7 text-silver-dark">
                      {faq.answer}
                    </p>
                  </details>
                ))}
              </div>
            </section>

            <p className="mt-10 border-l-2 border-rose pl-5 text-sm leading-6 text-silver">
              {post.reviewedAgainst} Individual results vary. This article is general education and does not replace an in-person assessment.
            </p>
          </div>

          <aside className="space-y-6 lg:sticky lg:top-28 lg:self-start" aria-label="Article actions and key facts">
            <div className="border-l-4 border-rose bg-rose-blush p-6">
              <h2 className="text-lg font-medium text-rose">Key Napa facts</h2>
              <ul className="mt-5 space-y-4">
                {post.keyFacts.map((fact) => (
                  <li key={fact} className="border-b border-rose-light/70 pb-4 text-sm leading-6 text-silver-dark last:border-0 last:pb-0">
                    {fact}
                  </li>
                ))}
              </ul>
            </div>
            <div className="border border-ink/12 p-6">
              <h2 className="text-lg font-medium text-rose">Continue exploring</h2>
              <nav aria-label="Related Napa Botox pages" className="mt-4 flex flex-col gap-3 text-sm">
                <Link href="/napa/botox" className="text-rose-text hover:text-rose-dark">Napa Botox treatment page →</Link>
                <Link href="/membership" className="text-rose-text hover:text-rose-dark">2026 Tox Membership →</Link>
                <Link href="/services/botox" className="text-rose-text hover:text-rose-dark">Botox &amp; Dysport guide →</Link>
                <Link href="/locations/napa" className="text-rose-text hover:text-rose-dark">Rella Napa location →</Link>
              </nav>
            </div>
          </aside>
        </div>
      </article>

      <section className="bg-rose-cta py-16 text-white">
        <div className="mx-auto grid max-w-[900px] gap-7 px-6 md:grid-cols-[1fr_auto] md:items-center md:px-8">
          <div>
            <p className="text-[0.6875rem] font-bold uppercase tracking-[0.18em] text-white">
              Rella Aesthetics · Downtown Napa
            </p>
            <h2 className="mt-3 text-3xl font-medium tracking-[-0.035em]">
              Ready for your exact price and plan?
            </h2>
            <p className="mt-3 max-w-[580px] font-light leading-relaxed text-white">
              Book the verified Napa new-patient tox path or call the team with a pricing question.
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <Button
              href={NAPA_BOOKING_HREF}
              data-cta="service-booking"
              className="rounded-full !border-white !bg-white !text-rose hover:!border-white hover:!bg-white hover:!text-rose"
            >
              Book Napa Botox
            </Button>
            <a href="tel:+17073582928" className="text-center text-sm font-medium text-white underline decoration-white underline-offset-4">
              (707) 358-2928
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
