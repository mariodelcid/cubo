import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { parsePagination, apiError } from "@/lib/api-utils";
import { ListingStatus } from "@prisma/client";

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
      ...(category && { category: { slug: category } }),
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
