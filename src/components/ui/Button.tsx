import Link from "next/link";
import { type ComponentPropsWithoutRef } from "react";

type ButtonVariant = "primary" | "ghost" | "light" | "dark";
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
    "border-[1.5px] border-rose bg-rose text-ink hover:bg-rose/70",
  ghost:
    "border-[1.5px] border-ink bg-transparent text-ink hover:bg-ink hover:text-white",
  light:
    "border-[1.5px] border-paper bg-paper text-ink hover:border-rose hover:bg-rose",
  dark:
    "border-[1.5px] border-ink bg-ink text-white hover:bg-ink/80",
};

const sizeStyles: Record<ButtonSize, string> = {
  default: "px-10 py-[18px]",
  sm: "px-7 py-3",
};

const base =
  "inline-flex items-center justify-center rounded-full font-bold text-[0.6875rem] tracking-[0.2em] uppercase transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-50";

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
