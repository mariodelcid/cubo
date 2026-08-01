import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Clock, MapPin, Star, Truck } from "lucide-react";
import { getListingBySlug } from "@/lib/services/listings";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface ListingPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ListingPageProps) {
  const { slug } = await params;
  const listing = await getListingBySlug(slug);
  if (!listing) return { title: "Not found" };

  return {
    title: listing.title,
    description: listing.description.slice(0, 160),
    openGraph: {
      title: listing.title,
      images: listing.images[0]?.url ? [listing.images[0].url] : [],
    },
  };
}

export default async function ListingPage({ params }: ListingPageProps) {
  const { slug } = await params;

  let listing: Awaited<ReturnType<typeof getListingBySlug>> = null;
  try {
    listing = await getListingBySlug(slug);
  } catch {
    notFound();
  }

  if (!listing) notFound();

  const mainImage = listing.images[0];
  const isAuction =
    listing.type === "AUCTION" || listing.type === "AUCTION_WITH_BUY_NOW";

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Images */}
        <div>
          <div className="relative aspect-square overflow-hidden rounded-xl bg-gray-100">
            {mainImage ? (
              <Image
                src={mainImage.url}
                alt={mainImage.alt ?? listing.title}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-gray-400">
                No image
              </div>
            )}
          </div>
          {listing.images.length > 1 && (
            <div className="mt-3 grid grid-cols-5 gap-2">
              {listing.images.slice(1, 6).map((img) => (
                <div
                  key={img.id}
                  className="relative aspect-square overflow-hidden rounded-lg bg-gray-100"
                >
                  <Image
                    src={img.url}
                    alt={img.alt ?? ""}
                    fill
                    className="object-cover"
                    sizes="100px"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          <p className="text-sm text-gray-500">{listing.category.name}</p>
          <h1 className="mt-1 text-2xl font-bold text-gray-900 md:text-3xl">
            {listing.title}
          </h1>

          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-3xl font-bold text-gray-900">
              {listing.price
                ? formatPrice(Number(listing.price), listing.currency)
                : listing.auction
                  ? formatPrice(
                      Number(listing.auction.currentBid ?? listing.auction.startingBid),
                      listing.currency
                    )
                  : "—"}
            </span>
            {listing.compareAtPrice && (
              <span className="text-lg text-gray-400 line-through">
                {formatPrice(Number(listing.compareAtPrice), listing.currency)}
              </span>
            )}
          </div>

          {listing.auction && (
            <div className="mt-4 rounded-lg bg-amber-50 p-4">
              <div className="flex items-center gap-2 text-amber-800">
                <Clock className="h-4 w-4" />
                <span className="font-semibold">
                  {listing.auction.bids.length} bids · Ends{" "}
                  {new Date(listing.auction.endsAt).toLocaleDateString()}
                </span>
              </div>
              {listing.auction.buyItNowPrice && (
                <p className="mt-2 text-sm text-amber-700">
                  Buy It Now:{" "}
                  {formatPrice(Number(listing.auction.buyItNowPrice), listing.currency)}
                </p>
              )}
            </div>
          )}

          <div className="mt-6 flex flex-wrap gap-3">
            {isAuction ? (
              <Button size="lg">Place bid</Button>
            ) : (
              <Button size="lg">Buy now</Button>
            )}
            <Button size="lg" variant="secondary">
              Add to cart
            </Button>
            <Button size="lg" variant="ghost">
              ♡ Watch
            </Button>
          </div>

          <div className="mt-6 space-y-3 border-t border-gray-200 pt-6 text-sm text-gray-600">
            {listing.condition && (
              <p>
                <span className="font-medium text-gray-900">Condition:</span>{" "}
                {listing.condition}
              </p>
            )}
            {listing.localPickup && (
              <p className="flex items-center gap-2">
                <MapPin className="h-4 w-4" /> Local pickup available
              </p>
            )}
            <p className="flex items-center gap-2">
              <Truck className="h-4 w-4" /> Shipping calculated at checkout
            </p>
          </div>

          {/* Seller */}
          <div className="mt-6 rounded-xl border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-100 text-brand-600">
                {(listing.seller.name ?? listing.seller.username ?? "S")[0]}
              </div>
              <div>
                <Link
                  href={`/seller/${listing.seller.username ?? listing.seller.id}`}
                  className="font-semibold text-gray-900 hover:text-brand-600"
                >
                  {listing.seller.name ?? listing.seller.username}
                </Link>
                <p className="flex items-center gap-1 text-sm text-gray-500">
                  <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                  {listing.seller.reputationScore.toFixed(1)} rating
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="mt-12">
        <h2 className="text-xl font-bold text-gray-900">Description</h2>
        <div
          className="prose mt-4 max-w-none text-gray-700"
          dangerouslySetInnerHTML={{ __html: listing.description }}
        />
      </div>
    </div>
  );
}
