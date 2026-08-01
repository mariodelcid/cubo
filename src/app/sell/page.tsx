import Link from "next/link";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function SellPage() {
  const session = await auth();
  if (!session?.user) redirect("/login?callbackUrl=/sell");

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900">Sell an item</h1>
      <p className="mt-2 text-gray-500">
        List your item for sale or start an auction. The full listing wizard is
        coming in Phase 2 — for now use the API or seed data to test.
      </p>

      <div className="mt-8 space-y-4 rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="font-semibold text-gray-900">Quick start</h2>
        <ol className="list-inside list-decimal space-y-2 text-sm text-gray-600">
          <li>Create a listing via POST /api/listings</li>
          <li>Upload images via POST /api/upload</li>
          <li>Publish by setting status to ACTIVE</li>
        </ol>
        <div className="flex gap-3 pt-2">
          <Link href="/dashboard/seller">
            <Button>Seller dashboard</Button>
          </Link>
          <Link href="/search">
            <Button variant="secondary">Browse listings</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
