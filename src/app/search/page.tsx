import { Suspense } from "react";
import { ListingCard } from "@/components/listings/listing-card";
import { SortSelect } from "@/components/search/sort-select";
import { searchListings } from "@/lib/services/listings";

interface SearchPageProps {
  searchParams: Promise<Record<string, string | undefined>>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const q = params.q ?? "";

  let listings: Awaited<ReturnType<typeof searchListings>>["listings"] = [];
  let total = 0;

  try {
    const result = await searchListings({
      q,
      category: params.category,
      sort: (params.sort as "relevance") ?? "relevance",
      page: parseInt(params.page ?? "1", 10),
    });
    listings = result.listings;
    total = result.total;
  } catch {
    // DB not connected
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {q ? `Results for "${q}"` : "Browse listings"}
          </h1>
          <p className="mt-1 text-sm text-gray-500">{total} items found</p>
        </div>
        <Suspense fallback={null}>
          <SortSelect />
        </Suspense>
      </div>

      {listings.length > 0 ? (
        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {listings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      ) : (
        <div className="mt-12 text-center">
          <p className="text-gray-500">No listings found. Try a different search.</p>
        </div>
      )}
    </div>
  );
}
