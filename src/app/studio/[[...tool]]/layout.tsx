export const metadata = {
  title: "Rella Aesthetics — Studio",
  description: "Content management studio for Rella Aesthetics",
};

export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  );
}
