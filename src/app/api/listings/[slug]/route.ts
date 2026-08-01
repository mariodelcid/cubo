import { db } from "@/lib/db";
import { apiSuccess, apiError } from "@/lib/api-utils";
import { getListingBySlug, incrementViewCount } from "@/lib/services/listings";
import { auth } from "@/lib/auth";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const listing = await getListingBySlug(slug);

    if (!listing) return apiError("Listing not found", 404);

    const session = await auth();
    await incrementViewCount(listing.id, session?.user?.id);

    return apiSuccess(listing);
  } catch (error) {
    console.error("Listing GET error:", error);
    return apiError("Internal server error", 500);
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) return apiError("Unauthorized", 401);

    const { slug } = await params;
    const listing = await db.listing.findUnique({ where: { slug } });

    if (!listing) return apiError("Listing not found", 404);
    if (listing.sellerId !== session.user.id && session.user.role !== "ADMIN") {
      return apiError("Forbidden", 403);
    }

    const body = await request.json();
    const updated = await db.listing.update({
      where: { id: listing.id },
      data: body,
      include: { images: true, category: true, auction: true },
    });

    return apiSuccess(updated);
  } catch (error) {
    console.error("Listing PATCH error:", error);
    return apiError("Internal server error", 500);
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) return apiError("Unauthorized", 401);

    const { slug } = await params;
    const listing = await db.listing.findUnique({ where: { slug } });

    if (!listing) return apiError("Listing not found", 404);
    if (listing.sellerId !== session.user.id && session.user.role !== "ADMIN") {
      return apiError("Forbidden", 403);
    }

    await db.listing.update({
      where: { id: listing.id },
      data: { status: "REMOVED" },
    });

    return apiSuccess({ deleted: true });
  } catch (error) {
    console.error("Listing DELETE error:", error);
    return apiError("Internal server error", 500);
  }
}
