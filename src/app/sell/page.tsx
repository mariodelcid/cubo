import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getCategories } from "@/lib/services/listings";
import { ListingForm } from "@/components/listings/listing-form";

export default async function SellPage() {
  const session = await auth();
  if (!session?.user) redirect("/login?callbackUrl=/sell");

  const categories = await getCategories();

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900">Add a listing</h1>
      <p className="mt-2 text-gray-500">
        List commercial equipment, services, or any product for sale on Cubo.
      </p>

      <div className="mt-8 rounded-xl border border-gray-200 bg-white p-6">
        <ListingForm categories={categories} mode="create" />
      </div>
    </div>
  );
}
