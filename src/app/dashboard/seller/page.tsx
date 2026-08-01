import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/db";
import { ListingStatus } from "@prisma/client";

export default async function SellerDashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const activeCount = await db.listing.count({
    where: {
      sellerId: session.user.id,
      status: ListingStatus.ACTIVE,
    },
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900">Seller Dashboard</h1>
      <p className="mt-2 text-gray-500">
        Welcome, {session.user.name ?? session.user.email}. Manage your listings and track sales.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Revenue", value: "$0.00" },
          { label: "Orders", value: "0" },
          { label: "Active listings", value: String(activeCount) },
          { label: "Rating", value: "—" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-gray-200 bg-white p-6"
          >
            <p className="text-sm text-gray-500">{stat.label}</p>
            <p className="mt-1 text-2xl font-bold text-gray-900">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/sell">
          <Button>Add listing</Button>
        </Link>
        <Link href="/dashboard/seller/listings">
          <Button variant="secondary">Manage listings</Button>
        </Link>
        <Link href="/search">
          <Button variant="ghost">View marketplace</Button>
        </Link>
      </div>
    </div>
  );
}
