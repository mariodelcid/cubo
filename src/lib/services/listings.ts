import type { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import type { SearchFilters } from "@/types";

const listingInclude = {
  images: { orderBy: { sortOrder: "asc" as const }, take: 1 },
  category: true,
  seller: {
    select: {
      id: true,
      name: true,
      username: true,
      avatarUrl: true,
      reputationScore: true,
    },
  },
  auction: true,
} satisfies Prisma.ListingInclude;

export async function searchListings(filters: SearchFilters) {
  const page = filters.page ?? 1;
  const limit = filters.limit ?? 20;
  const skip = (page - 1) * limit;

  const where: Prisma.ListingWhereInput = {
    status: "ACTIVE",
    ...(filters.category && {
      category: { slug: filters.category },
    }),
    ...(filters.condition && { condition: filters.condition }),
    ...(filters.type && { type: filters.type as Prisma.EnumListingTypeFilter }),
    ...(filters.minPrice || filters.maxPrice
      ? {
          price: {
            ...(filters.minPrice && { gte: filters.minPrice }),
            ...(filters.maxPrice && { lte: filters.maxPrice }),
          },
        }
      : {}),
    ...(filters.q && {
      OR: [
        { title: { contains: filters.q, mode: "insensitive" } },
        { description: { contains: filters.q, mode: "insensitive" } },
      ],
    }),
  };

  let orderBy: Prisma.ListingOrderByWithRelationInput = { createdAt: "desc" };

  switch (filters.sort) {
    case "price_asc":
      orderBy = { price: "asc" };
      break;
    case "price_desc":
      orderBy = { price: "desc" };
      break;
    case "newest":
      orderBy = { publishedAt: "desc" };
      break;
    case "ending_soon":
      orderBy = { endsAt: "asc" };
      break;
  }

  const [listings, total] = await Promise.all([
    db.listing.findMany({
      where,
      include: listingInclude,
      orderBy,
      skip,
      take: limit,
    }),
    db.listing.count({ where }),
  ]);

  return { listings, total, page, limit };
}

export async function getFeaturedListings(limit = 12) {
  return db.listing.findMany({
    where: { status: "ACTIVE", featured: true },
    include: listingInclude,
    orderBy: { publishedAt: "desc" },
    take: limit,
  });
}

export async function getTrendingListings(limit = 12) {
  return db.listing.findMany({
    where: { status: "ACTIVE" },
    include: listingInclude,
    orderBy: { viewCount: "desc" },
    take: limit,
  });
}

export async function getListingBySlug(slug: string) {
  return db.listing.findUnique({
    where: { slug },
    include: {
      images: { orderBy: { sortOrder: "asc" } },
      videos: { orderBy: { sortOrder: "asc" } },
      variations: true,
      category: { include: { parent: true } },
      seller: {
        select: {
          id: true,
          name: true,
          username: true,
          avatarUrl: true,
          reputationScore: true,
          sellerStatus: true,
        },
      },
      auction: {
        include: {
          bids: {
            orderBy: { amount: "desc" },
            take: 10,
            include: {
              bidder: {
                select: { id: true, name: true, username: true },
              },
            },
          },
        },
      },
      reviews: {
        include: {
          reviewer: { select: { id: true, name: true, avatarUrl: true } },
        },
        orderBy: { createdAt: "desc" },
        take: 5,
      },
    },
  });
}

export async function getCategories() {
  return db.category.findMany({
    where: { parentId: null },
    include: {
      children: {
        orderBy: { sortOrder: "asc" },
      },
    },
    orderBy: { sortOrder: "asc" },
  });
}

export async function getListingsInCategory(slug: string, limit = 8) {
  const category = await db.category.findUnique({
    where: { slug },
    include: { children: { orderBy: { sortOrder: "asc" } } },
  });

  if (!category) return { category: null, listings: [] };

  const categoryIds = [category.id, ...category.children.map((c) => c.id)];

  const listings = await db.listing.findMany({
    where: { status: "ACTIVE", categoryId: { in: categoryIds } },
    include: listingInclude,
    orderBy: [{ featured: "desc" }, { publishedAt: "desc" }],
    take: limit,
  });

  return { category, listings };
}

export async function getCategoryBySlug(slug: string) {
  return db.category.findUnique({
    where: { slug },
    include: { children: { orderBy: { sortOrder: "asc" } } },
  });
}

export async function countListingsInCategory(slug: string) {
  const category = await db.category.findUnique({
    where: { slug },
    include: { children: true, parent: true },
  });
  if (!category) return 0;

  const categoryIds = category.children.length
    ? [category.id, ...category.children.map((c) => c.id)]
    : [category.id];

  return db.listing.count({
    where: { status: "ACTIVE", categoryId: { in: categoryIds } },
  });
}

export async function incrementViewCount(listingId: string, userId?: string) {
  await db.listing.update({
    where: { id: listingId },
    data: { viewCount: { increment: 1 } },
  });

  if (userId) {
    const existing = await db.recentlyViewed.findFirst({
      where: { userId, listingId },
    });
    if (existing) {
      await db.recentlyViewed.update({
        where: { id: existing.id },
        data: { viewedAt: new Date() },
      });
    } else {
      await db.recentlyViewed.create({
        data: { userId, listingId },
      });
    }
  }
}
