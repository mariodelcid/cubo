import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { apiSuccess, apiError } from "@/lib/api-utils";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) return apiError("Unauthorized", 401);

    const isAdmin = session.user.role === "ADMIN";

    const listings = await db.listing.findMany({
      where: isAdmin ? { status: { not: "REMOVED" } } : { sellerId: session.user.id },
      orderBy: { updatedAt: "desc" },
      include: {
        images: { take: 1 },
        category: { select: { name: true, slug: true } },
      },
    });

    return apiSuccess(listings);
  } catch {
    return apiError("Failed to fetch listings", 500);
  }
}
