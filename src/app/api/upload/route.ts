import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { isS3Configured, getUploadUrl } from "@/lib/s3";
import { apiSuccess, apiError } from "@/lib/api-utils";

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) return apiError("Unauthorized", 401);

    if (!isS3Configured()) {
      return apiError("File storage not configured", 503);
    }

    const { filename, contentType, folder = "listings" } = await request.json();

    if (!filename || !contentType) {
      return apiError("filename and contentType required", 400);
    }

    const extension = filename.split(".").pop() ?? "jpg";
    const { uploadUrl, publicUrl, key } = await getUploadUrl(
      folder,
      contentType,
      extension
    );

    return apiSuccess({ uploadUrl, publicUrl, key });
  } catch (error) {
    console.error("Upload POST error:", error);
    return apiError("Internal server error", 500);
  }
}

export async function PUT(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) return apiError("Unauthorized", 401);

    const { listingId, url, alt, sortOrder = 0 } = await request.json();

    const listing = await db.listing.findUnique({ where: { id: listingId } });
    if (!listing) return apiError("Listing not found", 404);
    if (listing.sellerId !== session.user.id) {
      return apiError("Forbidden", 403);
    }

    const imageCount = await db.listingImage.count({ where: { listingId } });
    if (imageCount >= 20) {
      return apiError("Maximum 20 images per listing", 400);
    }

    const image = await db.listingImage.create({
      data: { listingId, url, alt, sortOrder },
    });

    return apiSuccess(image, 201);
  } catch (error) {
    console.error("Upload PUT error:", error);
    return apiError("Internal server error", 500);
  }
}
