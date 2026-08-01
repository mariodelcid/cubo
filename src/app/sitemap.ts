import type { MetadataRoute } from "next";
import { db } from "@/lib/db";
import { getAppUrl } from "@/lib/env";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getAppUrl();

  const staticPages: MetadataRoute.Sitemap = [
    { url: base, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${base}/search`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/sell`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
  ];

  try {
    const listings = await db.listing.findMany({
      where: { status: "ACTIVE" },
      select: { slug: true, updatedAt: true },
    });

    const listingPages = listings.map((l) => ({
      url: `${base}/listing/${l.slug}`,
      lastModified: l.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));

    return [...staticPages, ...listingPages];
  } catch {
    return staticPages;
  }
}
