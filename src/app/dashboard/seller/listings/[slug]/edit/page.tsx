import { auth } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { db } from "@/lib/db";
import { getCategories } from "@/lib/services/listings";
import { ListingForm } from "@/components/listings/listing-form";

interface EditListingPageProps {
  params: Promise<{ slug: string }>;
}

export default async function EditListingPage({ params }: EditListingPageProps) {
  const session = await auth();
  if (!session?.user) redirect("/login?callbackUrl=/dashboard/seller/listings");

  const { slug } = await params;
  const listing = await db.listing.findUnique({
    where: { slug },
    include: { images: { orderBy: { sortOrder: "asc" } } },
  });

  if (!listing) notFound();
  if (listing.sellerId !== session.user.id && session.user.role !== "ADMIN") {
    redirect("/dashboard/seller/listings");
  }

  const categories = await getCategories();

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900">Edit listing</h1>
      <p className="mt-2 text-gray-500">Update details for &ldquo;{listing.title}&rdquo;</p>

      <div className="mt-8 rounded-xl border border-gray-200 bg-white p-6">
        <ListingForm
          categories={categories}
          mode="edit"
          initial={{
            slug: listing.slug,
            title: listing.title,
            description: listing.description,
            categoryId: listing.categoryId,
            price: Number(listing.price),
            condition: listing.condition ?? "New",
            imageUrls: listing.images.map((img) => img.url),
            type: listing.type,
            status: listing.status,
          }}
        />
      </div>
    </div>
  );
}
