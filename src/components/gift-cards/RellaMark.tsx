/** Rella circle-"r" mark, from public/brand/rella-logo-rose.svg (first glyph). */
export const RELLA_MARK_PATH =
  "M88,29.3c-32.4,0-58.7,26.3-58.7,58.7s26.3,58.7,58.7,58.7s58.7-26.3,58.7-58.7S120.4,29.3,88,29.3z M85.9,129.9c-17.4,0-31.4-14.1-31.4-31.4v0c0-13.1,0-26.2,0-39.3h31.4C85.9,82.8,85.9,106.3,85.9,129.9z M111.2,94.5c-9.7,0-17.6-7.9-17.6-17.6s7.9-17.6,17.6-17.6c9.7,0,17.6,7.9,17.6,17.6S121,94.5,111.2,94.5z";

export function RellaMark({ size = 40, color = "#FFFFFF", title = "Rella" }: { size?: number; color?: string; title?: string }) {
  return (
    <svg width={size} height={size} viewBox="29.3 29.3 117.4 117.4" role="img" aria-label={title} focusable="false">
      <path d={RELLA_MARK_PATH} fill={color} fillRule="evenodd" />
    </svg>
  );
}
