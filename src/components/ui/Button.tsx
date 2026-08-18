import Link from "next/link";
import { type ComponentPropsWithoutRef } from "react";

type ButtonVariant = "primary" | "ghost";
type ButtonSize = "default" | "sm";

interface ButtonBaseProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

type ButtonAsButton = ButtonBaseProps &
  ComponentPropsWithoutRef<"button"> & { href?: never };

type ButtonAsLink = ButtonBaseProps &
  ComponentPropsWithoutRef<typeof Link> & { href: string };

type ButtonProps = ButtonAsButton | ButtonAsLink;

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-rose text-ink hover:bg-rose-dark",
  ghost:
    "bg-transparent text-silver border-[1.5px] border-silver-light hover:border-rose hover:text-rose-text",
};

const sizeStyles: Record<ButtonSize, string> = {
  default: "min-h-11 px-10 py-3",
  sm: "min-h-11 px-7 py-3",
};

const base =
  "inline-flex items-center justify-center font-bold text-[0.6875rem] tracking-[0.18em] uppercase transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed";

export function Button({
  variant = "primary",
  size = "default",
  className = "",
  ...props
}: ButtonProps) {
  const classes = `${base} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`;

  if ("href" in props && props.href) {
    const { href, ...rest } = props as ButtonAsLink;
    return <Link href={href} className={classes} {...rest} />;
  }

  return <button className={classes} {...(props as ButtonAsButton)} />;
}
