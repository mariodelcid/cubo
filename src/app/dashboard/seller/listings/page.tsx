import Link from "next/link";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ListingActions } from "@/components/listings/listing-actions";

export default async function SellerListingsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login?callbackUrl=/dashboard/seller/listings");

  const isAdmin = session.user.role === "ADMIN";

  const listings = await db.listing.findMany({
    where: isAdmin ? { status: { not: "REMOVED" } } : { sellerId: session.user.id },
    orderBy: { updatedAt: "desc" },
    include: {
      images: { take: 1 },
      category: { select: { name: true } },
    },
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isAdmin ? "Manage all listings" : "My listings"}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Add, edit, or remove items from the marketplace.
          </p>
        </div>
        <Link href="/sell">
          <Button>+ Add listing</Button>
        </Link>
      </div>

      {listings.length === 0 ? (
        <div className="mt-12 rounded-xl border border-dashed border-gray-300 bg-white p-12 text-center">
          <p className="text-gray-500">You have no listings yet.</p>
          <Link href="/sell" className="mt-4 inline-block">
            <Button>Create your first listing</Button>
          </Link>
        </div>
      ) : (
        <div className="mt-8 overflow-hidden rounded-xl border border-gray-200 bg-white">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">
                  Item
                </th>
                <th className="hidden px-4 py-3 text-left text-xs font-medium uppercase text-gray-500 sm:table-cell">
                  Category
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">
                  Price
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">
                  Status
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium uppercase text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {listings.map((listing) => (
                <tr key={listing.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {listing.images[0] && (
                        <img
                          src={listing.images[0].url}
                          alt=""
                          className="h-10 w-10 rounded-lg object-cover"
                        />
                      )}
                      <div>
                        <Link
                          href={`/listing/${listing.slug}`}
                          className="font-medium text-gray-900 hover:text-blue-600"
                        >
                          {listing.title}
                        </Link>
                      </div>
                    </div>
                  </td>
                  <td className="hidden px-4 py-3 text-sm text-gray-500 sm:table-cell">
                    {listing.category.name}
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">
                    {formatPrice(listing.price.toString())}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                        listing.status === "ACTIVE"
                          ? "bg-green-100 text-green-800"
                          : listing.status === "DRAFT"
                            ? "bg-gray-100 text-gray-800"
                            : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {listing.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <ListingActions slug={listing.slug} status={listing.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-6 rounded-lg bg-blue-50 p-4 text-sm text-blue-900">
        <strong>Admin tip:</strong> Log in as{" "}
        <code className="rounded bg-blue-100 px-1">admin@cubo.market</code> to manage all
        listings. Sellers only see their own items.
      </div>
    </div>
  );
}
