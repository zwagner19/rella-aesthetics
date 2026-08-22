/** Lazy-load sharp for Vercel serverless compatibility. */
export async function getSharp() {
  const mod = await import("sharp");
  return mod.default;
}
