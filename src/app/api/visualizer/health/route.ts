import { NextResponse } from "next/server";
import { getOpenAIRuntimeStatus } from "@/lib/visualizer/openai";
import { referenceCatalogSummary } from "@/lib/visualizer/references";

export const runtime = "nodejs";

/** Safe runtime diagnostics for the visualizer (no secrets). */
export async function GET() {
  const openai = getOpenAIRuntimeStatus();
  const references = referenceCatalogSummary();

  return NextResponse.json({
    ok: true,
    openai,
    references,
  });
}
