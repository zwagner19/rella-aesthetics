import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

const SANITY_WEBHOOK_SECRET = process.env.SANITY_WEBHOOK_SECRET ?? "";

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    if (SANITY_WEBHOOK_SECRET && authHeader !== `Bearer ${SANITY_WEBHOOK_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { _type, slug } = body;

    switch (_type) {
      case "blogPost":
        revalidatePath("/blog");
        if (slug?.current) revalidatePath(`/blog/${slug.current}`);
        break;
      case "service":
        revalidatePath("/services");
        if (slug?.current) revalidatePath(`/services/${slug.current}`);
        revalidatePath("/");
        break;
      case "teamMember":
        revalidatePath("/about");
        break;
      case "location":
        revalidatePath("/contact");
        revalidatePath("/locations/vacaville");
        revalidatePath("/locations/napa");
        revalidatePath("/");
        break;
      case "category":
        revalidatePath("/blog");
        break;
      default:
        revalidatePath("/");
    }

    return NextResponse.json({ revalidated: true, type: _type });
  } catch (error) {
    console.error("Revalidation error:", error);
    return NextResponse.json({ error: "Revalidation failed" }, { status: 500 });
  }
}
