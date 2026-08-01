import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { apiSuccess, apiError } from "@/lib/api-utils";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) return apiError("Unauthorized", 401);

    const items = await db.watchlistItem.findMany({
      where: { userId: session.user.id },
      include: {
        listing: {
          include: {
            images: { orderBy: { sortOrder: "asc" }, take: 1 },
            auction: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return apiSuccess(items);
  } catch (error) {
    console.error("Watchlist GET error:", error);
    return apiError("Internal server error", 500);
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) return apiError("Unauthorized", 401);

    const { listingId } = await request.json();
    if (!listingId) return apiError("listingId required", 400);

    const item = await db.watchlistItem.upsert({
      where: {
        userId_listingId: {
          userId: session.user.id,
          listingId,
        },
      },
      create: { userId: session.user.id, listingId },
      update: {},
      include: {
        listing: {
          include: { images: { take: 1 } },
        },
      },
    });

    return apiSuccess(item, 201);
  } catch (error) {
    console.error("Watchlist POST error:", error);
    return apiError("Internal server error", 500);
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) return apiError("Unauthorized", 401);

    const { listingId } = await request.json();
    if (!listingId) return apiError("listingId required", 400);

    await db.watchlistItem.delete({
      where: {
        userId_listingId: {
          userId: session.user.id,
          listingId,
        },
      },
    });

    return apiSuccess({ removed: true });
  } catch (error) {
    console.error("Watchlist DELETE error:", error);
    return apiError("Internal server error", 500);
  }
}
