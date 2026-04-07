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
      className={`inline-flex items-center gap-2 font-medium text-[0.8125rem] tracking-[0.06em] text-rose-text group ${className}`}
    >
      {children}
      <span className="transition-transform duration-150 group-hover:translate-x-1">&rarr;</span>
    </Link>
  );
}
