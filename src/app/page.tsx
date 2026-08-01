import Link from "next/link";
import { db } from "@/lib/db";
import { ListingStatus } from "@prisma/client";
import { ListingCard } from "@/components/listings/listing-card";
import { SITE_NAME } from "@/lib/constants";
import { Tag, Gavel, TrendingUp, Shield } from "lucide-react";

async function getFeaturedListings() {
  try {
    return await db.listing.findMany({
      where: { status: ListingStatus.ACTIVE },
      orderBy: [{ featured: "desc" }, { publishedAt: "desc" }],
      take: 8,
      include: {
        images: { orderBy: { sortOrder: "asc" }, take: 1 },
        category: { select: { name: true, slug: true } },
        seller: { select: { id: true, name: true, username: true, reputationScore: true } },
        auction: { select: { endsAt: true, currentBid: true } },
      },
    });
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const listings = await getFeaturedListings();

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Buy &amp; sell anything on {SITE_NAME}
            </h1>
            <p className="mt-4 text-lg text-blue-100">
              Auctions, fixed-price listings, and trusted sellers — all in one marketplace.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/search"
                className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-blue-600 hover:bg-blue-50"
              >
                Start shopping
              </Link>
              <Link
                href="/sell"
                className="rounded-full border-2 border-white px-6 py-3 text-sm font-semibold text-white hover:bg-white/10"
              >
                Start selling
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-b border-gray-200 bg-white py-8">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 sm:grid-cols-4 sm:px-6 lg:px-8">
          {[
            { icon: Gavel, label: "Live auctions", desc: "Bid in real time" },
            { icon: Shield, label: "Buyer protection", desc: "Shop with confidence" },
            { icon: TrendingUp, label: "Trending deals", desc: "Best prices daily" },
            { icon: Tag, label: "Free to list", desc: "Start selling today" },
          ].map(({ icon: Icon, label, desc }) => (
            <div key={label} className="flex items-start gap-3">
              <div className="rounded-lg bg-blue-50 p-2">
                <Icon className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">{label}</p>
                <p className="text-xs text-gray-500">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured listings */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Featured listings</h2>
          <Link href="/search" className="text-sm font-medium text-blue-600 hover:text-blue-700">
            View all →
          </Link>
        </div>

        {listings.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {listings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-gray-300 bg-white p-12 text-center">
            <p className="text-gray-500">No listings yet. Be the first to sell on {SITE_NAME}!</p>
            <Link
              href="/sell"
              className="mt-4 inline-block rounded-full bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Create a listing
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
