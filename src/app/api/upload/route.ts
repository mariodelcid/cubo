import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { isS3Configured, getUploadUrl } from "@/lib/s3";
import { saveUploadedImage } from "@/lib/local-storage";
import { apiSuccess, apiError } from "@/lib/api-utils";

export const runtime = "nodejs";
export const maxDuration = 30;

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) return apiError("Unauthorized", 401);

    const contentType = request.headers.get("content-type") ?? "";

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      const file = formData.get("file");
      const folder = (formData.get("folder") as string) || "listings";

      if (!(file instanceof File)) {
        return apiError("No file provided", 400);
      }

      try {
        const { publicUrl, key } = await saveUploadedImage(file, folder);
        return apiSuccess({ publicUrl, key, storage: "local" }, 201);
      } catch (error) {
        return apiError(
          error instanceof Error ? error.message : "Upload failed",
          400
        );
      }
    }

    if (!isS3Configured()) {
      return apiError(
        "Use multipart form upload for local files, or configure S3 for presigned URLs.",
        503
      );
    }

    const { filename, contentType: fileType, folder = "listings" } =
      await request.json();

    if (!filename || !fileType) {
      return apiError("filename and contentType required", 400);
    }

    const extension = filename.split(".").pop() ?? "jpg";
    const { uploadUrl, publicUrl, key } = await getUploadUrl(
      folder,
      fileType,
      extension
    );

    return apiSuccess({ uploadUrl, publicUrl, key, storage: "s3" });
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
    if (
      listing.sellerId !== session.user.id &&
      session.user.role !== "ADMIN"
    ) {
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
