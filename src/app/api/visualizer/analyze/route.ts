import { NextRequest, NextResponse } from "next/server";
import { analyzeSelfie } from "@/lib/visualizer/openai";
import { parseDataUrl } from "@/lib/visualizer/image-utils";

export const maxDuration = 60;
export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as { image?: string };
    if (!body.image) {
      return NextResponse.json({ error: "Image is required" }, { status: 400 });
    }

    const { buffer, mimeType } = parseDataUrl(body.image);
    const analysis = await analyzeSelfie(buffer, mimeType);

    if (!analysis.faceDetected || analysis.quality === "poor") {
      return NextResponse.json(
        {
          error: "Photo quality insufficient",
          analysis,
        },
        { status: 422 }
      );
    }

    return NextResponse.json({ analysis });
  } catch (error) {
    console.error("[visualizer/analyze]", error);
    const message = error instanceof Error ? error.message : "Analysis failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
