import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { parsePagination, apiError, apiSuccess, zodError } from "@/lib/api-utils";
import { ListingStatus } from "@prisma/client";
import { auth } from "@/lib/auth";
import { z } from "zod";
import { listingSchema } from "@/lib/validators/schemas";
import { slugify } from "@/lib/utils";
import { getCategoryIdsBySlug } from "@/lib/categories";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const { page, limit, skip } = parsePagination(searchParams);
    const q = searchParams.get("q") ?? "";
    const category = searchParams.get("category");
    const sort = searchParams.get("sort") ?? "newest";
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const type = searchParams.get("type");

    const where = {
      status: ListingStatus.ACTIVE,
      ...(q && {
        OR: [
          { title: { contains: q, mode: "insensitive" as const } },
          { description: { contains: q, mode: "insensitive" as const } },
        ],
      }),
    ...(category && {
      categoryId: {
        in: await getCategoryIdsBySlug(category),
      },
    }),
      ...(type && { type: type as never }),
      ...(minPrice || maxPrice
        ? {
            price: {
              ...(minPrice && { gte: parseFloat(minPrice) }),
              ...(maxPrice && { lte: parseFloat(maxPrice) }),
            },
          }
        : {}),
    };

    const orderBy = (() => {
      switch (sort) {
        case "price_asc":
          return { price: "asc" as const };
        case "price_desc":
          return { price: "desc" as const };
        case "popular":
          return { viewCount: "desc" as const };
        case "ending_soon":
          return { endsAt: "asc" as const };
        default:
          return { publishedAt: "desc" as const };
      }
    })();

    const [listings, total] = await Promise.all([
      db.listing.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          images: { orderBy: { sortOrder: "asc" }, take: 1 },
          category: { select: { name: true, slug: true } },
          seller: { select: { id: true, name: true, username: true, reputationScore: true } },
          auction: { select: { endsAt: true, currentBid: true } },
        },
      }),
      db.listing.count({ where }),
    ]);

    return Response.json({
      data: listings,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch {
    return apiError("Failed to fetch listings", 500);
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) return apiError("Unauthorized", 401);

    const body = await request.json();
    const createSchema = listingSchema.extend({
      status: z.enum(["DRAFT", "ACTIVE", "SCHEDULED"]).optional(),
      imageUrl: z.string().url().optional(),
      imageUrls: z.array(z.string().url()).max(20).optional(),
    });

    const result = createSchema.safeParse(body);
    if (!result.success) return zodError(result.error);

    const data = result.data;
    const baseSlug = slugify(data.title);
    let slug = baseSlug;
    let counter = 1;
    while (await db.listing.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter++}`;
    }

    const imageUrls =
      body.imageUrls ??
      (body.imageUrl ? [body.imageUrl as string] : []);

    const listing = await db.listing.create({
      data: {
        sellerId: session.user.id,
        categoryId: data.categoryId,
        title: data.title,
        slug,
        description: data.description,
        type: data.type,
        price: data.price ?? 0,
        compareAtPrice: data.compareAtPrice,
        quantity: data.quantity,
        condition: data.condition,
        sku: data.sku,
        localPickup: data.localPickup,
        status: (body.status as ListingStatus) ?? ListingStatus.ACTIVE,
        publishedAt: body.status === "DRAFT" ? null : new Date(),
        featured: false,
        ...(imageUrls.length > 0 && {
          images: {
            create: imageUrls.map((url: string, index: number) => ({
              url,
              alt: data.title,
              sortOrder: index,
            })),
          },
        }),
      },
      include: { images: true, category: true },
    });

    return apiSuccess(listing, 201);
  } catch (error) {
    console.error("Listings POST error:", error);
    return apiError("Failed to create listing", 500);
  }
}
