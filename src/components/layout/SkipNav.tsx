export function SkipNav() {
  return (
    <a
      href="#main"
      className="sr-only focus:not-sr-only focus:fixed focus:top-0 focus:left-4 focus:z-[1000] focus:bg-ink focus:text-white focus:px-6 focus:py-3 focus:text-sm focus:font-medium focus:rounded-b-lg"
    >
      Skip to main content
    </a>
  );
}
