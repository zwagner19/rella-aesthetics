import type { NextRequest } from "next/server";
import { bookingBridge } from "@/lib/guided-booking/server-bridge";
export const dynamic = "force-dynamic";
async function handle(req: NextRequest, ctx: { params: Promise<{ operation: string }> }) {
  return bookingBridge(req, (await ctx.params).operation);
}
export const GET = handle;
export const POST = handle;
