import Link from "next/link";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import { Clock, Star } from "lucide-react";

interface ListingCardProps {
  listing: {
    id: string;
    title: string;
    slug: string;
    price: { toString(): string } | number;
    currency: string;
    type: string;
    images: { url: string; alt?: string | null }[];
    seller: { name?: string | null; reputationScore: number };
    auction?: { endsAt: Date; currentBid?: { toString(): string } | null } | null;
  };
}

export function ListingCard({ listing }: ListingCardProps) {
  const image = listing.images[0];
  const price =
    listing.auction?.currentBid ?? listing.price;
  const isAuction = listing.type.includes("AUCTION");

  return (
    <Link
      href={`/listing/${listing.slug}`}
      className="group overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md"
    >
      <div className="relative aspect-square bg-gray-100">
        {image ? (
          <Image
            src={image.url}
            alt={image.alt ?? listing.title}
            fill
            className="object-cover transition group-hover:scale-105"
            sizes="(max-width:768px) 50vw, 25vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-gray-400 text-sm">
            No image
          </div>
        )}
        {isAuction && (
          <span className="absolute left-2 top-2 rounded bg-orange-500 px-2 py-0.5 text-xs font-medium text-white">
            Auction
          </span>
        )}
      </div>
      <div className="p-3">
        <h3 className="line-clamp-2 text-sm font-medium text-gray-900 group-hover:text-blue-600">
          {listing.title}
        </h3>
        <p className="mt-1 text-lg font-bold text-gray-900">
          {formatPrice(price.toString(), listing.currency)}
        </p>
        {listing.auction && (
          <p className="mt-1 flex items-center gap-1 text-xs text-orange-600">
            <Clock className="h-3 w-3" />
            Ends {new Date(listing.auction.endsAt).toLocaleDateString()}
          </p>
        )}
        <p className="mt-1 flex items-center gap-1 text-xs text-gray-500">
          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
          {listing.seller.reputationScore.toFixed(1)} · {listing.seller.name ?? "Seller"}
        </p>
      </div>
    </Link>
  );
}
