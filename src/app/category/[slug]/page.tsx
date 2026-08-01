import Link from "next/link";
import { notFound } from "next/navigation";
import { ListingCard } from "@/components/listings/listing-card";
import {
  getCategoryBySlug,
} from "@/lib/services/listings";
import { db } from "@/lib/db";
import { ListingStatus } from "@prisma/client";

export const dynamic = "force-dynamic";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ sub?: string }>;
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  return { title: category?.name ?? "Category" };
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { slug } = await params;
  const { sub } = await searchParams;
  const category = await getCategoryBySlug(slug);

  if (!category) notFound();

  const categoryIds = sub
    ? category.children.filter((c) => c.slug === sub).map((c) => c.id)
    : [category.id, ...category.children.map((c) => c.id)];

  const [listings, total] = await Promise.all([
    db.listing.findMany({
      where: { status: ListingStatus.ACTIVE, categoryId: { in: categoryIds } },
      include: {
        images: { orderBy: { sortOrder: "asc" }, take: 1 },
        category: { select: { name: true, slug: true } },
        seller: { select: { id: true, name: true, username: true, reputationScore: true } },
        auction: { select: { endsAt: true, currentBid: true } },
      },
      orderBy: [{ featured: "desc" }, { publishedAt: "desc" }],
    }),
    db.listing.count({
      where: { status: ListingStatus.ACTIVE, categoryId: { in: categoryIds } },
    }),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <nav className="text-sm text-gray-500">
        <Link href="/" className="hover:text-blue-600">
          Home
        </Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900">{category.name}</span>
      </nav>

      <div className="mt-4">
        <h1 className="text-3xl font-bold text-gray-900">{category.name}</h1>
        {category.description && (
          <p className="mt-2 max-w-2xl text-gray-600">{category.description}</p>
        )}
        <p className="mt-1 text-sm text-gray-500">{total} items</p>
      </div>

      {category.children.length > 0 && (
        <div className="mt-6 flex flex-wrap gap-2">
          <Link
            href={`/category/${slug}`}
            className={`rounded-full px-4 py-1.5 text-sm font-medium ${
              !sub
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            All
          </Link>
          {category.children.map((child) => (
            <Link
              key={child.id}
              href={`/category/${slug}?sub=${child.slug}`}
              className={`rounded-full px-4 py-1.5 text-sm font-medium ${
                sub === child.slug
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {child.name}
            </Link>
          ))}
        </div>
      )}

      {listings.length > 0 ? (
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {listings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      ) : (
        <div className="mt-12 rounded-xl border border-dashed border-gray-300 bg-white p-12 text-center">
          <p className="text-gray-500">No listings in this category yet.</p>
          <Link
            href="/sell"
            className="mt-4 inline-block rounded-full bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Be the first to list
          </Link>
        </div>
      )}

      {listings.length === 0 && category.children.length > 0 && sub && (
        <p className="mt-4 text-center text-xs text-gray-400">
          No items in this subcategory yet. Try &ldquo;All&rdquo; to see everything in {category.name}.
        </p>
      )}
    </div>
  );
}
