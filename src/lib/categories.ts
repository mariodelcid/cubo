import { db } from "@/lib/db";

export async function getCategoryIdsBySlug(slug: string): Promise<string[]> {
  const category = await db.category.findUnique({
    where: { slug },
    include: { children: true },
  });
  if (!category) return [];
  return [category.id, ...category.children.map((c) => c.id)];
}
