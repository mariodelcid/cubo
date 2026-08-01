import { PrismaClient, ListingStatus, ListingType, UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";

const db = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("password123", 12);

  const seller = await db.user.upsert({
    where: { email: "seller@cubo.market" },
    update: {},
    create: {
      email: "seller@cubo.market",
      name: "Demo Seller",
      username: "demoseller",
      passwordHash,
      role: UserRole.SELLER,
      sellerStatus: "VERIFIED",
      reputationScore: 4.8,
    },
  });

  await db.user.upsert({
    where: { email: "buyer@cubo.market" },
    update: {},
    create: {
      email: "buyer@cubo.market",
      name: "Demo Buyer",
      username: "demobuyer",
      passwordHash,
      role: UserRole.BUYER,
    },
  });

  const categories = [
    { name: "Electronics", slug: "electronics", sortOrder: 1 },
    { name: "Fashion", slug: "fashion", sortOrder: 2 },
    { name: "Home & Garden", slug: "home-garden", sortOrder: 3 },
    { name: "Sports", slug: "sports", sortOrder: 4 },
    { name: "Collectibles", slug: "collectibles", sortOrder: 5 },
    { name: "Automotive", slug: "automotive", sortOrder: 6 },
  ];

  for (const cat of categories) {
    await db.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }

  const electronics = await db.category.findUniqueOrThrow({
    where: { slug: "electronics" },
  });

  const sampleListings = [
    {
      title: "Apple MacBook Pro 14\" M3 Pro",
      slug: "macbook-pro-14-m3-pro",
      description:
        "Excellent condition MacBook Pro with 18GB RAM and 512GB SSD. Includes original charger.",
      price: 1899.99,
      condition: "Like New",
      featured: true,
      type: ListingType.FIXED_PRICE,
    },
    {
      title: "Sony WH-1000XM5 Headphones",
      slug: "sony-wh-1000xm5",
      description: "Premium noise-cancelling headphones. Barely used, full box.",
      price: 249.99,
      condition: "Like New",
      featured: true,
      type: ListingType.FIXED_PRICE,
    },
    {
      title: "Vintage Rolex Submariner (Replica Display)",
      slug: "vintage-rolex-display",
      description: "Display piece for collectors. Not a functional watch.",
      price: 89.0,
      condition: "Used - Good",
      featured: false,
      type: ListingType.AUCTION,
    },
  ];

  for (const item of sampleListings) {
    const listing = await db.listing.upsert({
      where: { slug: item.slug },
      update: {},
      create: {
        ...item,
        sellerId: seller.id,
        categoryId: electronics.id,
        status: ListingStatus.ACTIVE,
        publishedAt: new Date(),
        quantity: 1,
        images: {
          create: {
            url: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800",
            alt: item.title,
            sortOrder: 0,
          },
        },
      },
    });

    if (item.type === ListingType.AUCTION) {
      const endsAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
      await db.auction.upsert({
        where: { listingId: listing.id },
        update: {},
        create: {
          listingId: listing.id,
          startingBid: 50,
          currentBid: 65,
          reservePrice: 80,
          endsAt,
        },
      });
      await db.listing.update({
        where: { id: listing.id },
        data: { endsAt },
      });
    }
  }

  console.log("Seed complete.");
  console.log("  seller@cubo.market / password123");
  console.log("  buyer@cubo.market / password123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
