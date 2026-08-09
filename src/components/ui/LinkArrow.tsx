import Link from "next/link";

interface LinkArrowProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

export function LinkArrow({ href, children, className = "" }: LinkArrowProps) {
  return (
    <Link
      href={href}
      className={`group inline-flex items-center gap-2 border-b border-rose pb-1 text-[0.75rem] font-bold uppercase tracking-[0.14em] text-ink transition-colors hover:border-ink ${className}`}
    >
      {children}
      <span aria-hidden="true" className="transition-transform duration-150 group-hover:translate-x-1">&rarr;</span>
    </Link>
  );
}
