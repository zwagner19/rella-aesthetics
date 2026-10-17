import type { NextRequest } from "next/server";
import { packageBridge } from "@/lib/guided-booking/package-server-bridge";
export const dynamic = "force-dynamic";
async function handle(req: NextRequest, ctx: { params: Promise<{ operation: string }> }) {
  return packageBridge(req, (await ctx.params).operation);
}
export const GET = handle;
export const POST = handle;
