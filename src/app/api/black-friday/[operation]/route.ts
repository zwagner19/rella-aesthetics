import type { NextRequest } from "next/server";
import { giftBridge } from "@/lib/gift-cards/gift-server-bridge";
export const dynamic = "force-dynamic";
export async function POST(req: NextRequest, ctx: { params: Promise<{ operation: string }> }) {
  return giftBridge(req, (await ctx.params).operation);
}
