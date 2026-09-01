import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <section className="py-32 text-center">
      <div className="mx-auto max-w-[600px] px-6">
        <p className="font-bold text-[0.6875rem] tracking-[0.2em] uppercase text-silver mb-4">
          Page Not Found
        </p>
        <h1 className="font-bold text-5xl md:text-6xl tracking-[0.08em] uppercase text-rose-text mb-6">
          404
        </h1>
        <p className="text-lg text-ink/70 mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has moved.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button href="/">Back to Home</Button>
          <Button href="/services" variant="ghost">
            View Services
          </Button>
        </div>
      </div>
    </section>
  );
}
