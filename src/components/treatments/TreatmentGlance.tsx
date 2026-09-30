import type { TreatmentGlanceItem } from "@/lib/treatment-editorial";

interface TreatmentGlanceProps {
  id: string;
  items: readonly TreatmentGlanceItem[];
}

export function TreatmentGlance({ id, items }: TreatmentGlanceProps) {
  return (
    <section
      className="rella-site-reveal bg-ivory pb-8 md:pb-12"
      aria-labelledby={id}
    >
      <div className="mx-auto max-w-[1200px] px-6 md:px-8 lg:px-12">
        <h2 id={id} className="sr-only">
          At a glance
        </h2>
        <dl className="grid border-y border-rule sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item) => (
            <div
              key={item.label}
              className="border-rule px-0 py-9 sm:border-r sm:px-7 sm:[&:nth-child(2n)]:border-r-0 lg:[&:nth-child(2n)]:border-r lg:[&:nth-child(4n)]:border-r-0"
            >
              <dt className="rella-editorial-eyebrow mb-4">{item.label}</dt>
              <dd className="text-[1.05rem] font-medium leading-snug tracking-[-0.015em] text-ink md:text-lg">
                {item.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
