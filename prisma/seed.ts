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

  await db.user.upsert({
    where: { email: "admin@cubo.market" },
    update: {},
    create: {
      email: "admin@cubo.market",
      name: "Cubo Admin",
      username: "cuboadmin",
      passwordHash,
      role: UserRole.ADMIN,
      sellerStatus: "VERIFIED",
    },
  });

  const topCategories = [
    {
      name: "Commercial Equipment",
      slug: "commercial-equipment",
      sortOrder: 0,
      description: "Restaurant, industrial, office & medical equipment for your business.",
    },
    {
      name: "Services",
      slug: "services",
      sortOrder: 1,
      description: "Professional, home, repair & consulting services from trusted providers.",
    },
    { name: "Electronics", slug: "electronics", sortOrder: 2 },
    { name: "Fashion", slug: "fashion", sortOrder: 3 },
    { name: "Home & Garden", slug: "home-garden", sortOrder: 4 },
    { name: "Sports", slug: "sports", sortOrder: 5 },
    { name: "Collectibles", slug: "collectibles", sortOrder: 6 },
    { name: "Automotive", slug: "automotive", sortOrder: 7 },
  ];

  for (const cat of topCategories) {
    await db.category.upsert({
      where: { slug: cat.slug },
      update: { sortOrder: cat.sortOrder, description: cat.description },
      create: cat,
    });
  }

  const commercial = await db.category.findUniqueOrThrow({
    where: { slug: "commercial-equipment" },
  });
  const services = await db.category.findUniqueOrThrow({
    where: { slug: "services" },
  });

  const subCategories = [
    { name: "Restaurant Equipment", slug: "restaurant-equipment", parentId: commercial.id, sortOrder: 1 },
    { name: "Industrial Machinery", slug: "industrial-machinery", parentId: commercial.id, sortOrder: 2 },
    { name: "Office Equipment", slug: "office-equipment", parentId: commercial.id, sortOrder: 3 },
    { name: "Medical Equipment", slug: "medical-equipment", parentId: commercial.id, sortOrder: 4 },
    { name: "Professional Services", slug: "professional-services", parentId: services.id, sortOrder: 1 },
    { name: "Home Services", slug: "home-services", parentId: services.id, sortOrder: 2 },
    { name: "Repair & Maintenance", slug: "repair-maintenance", parentId: services.id, sortOrder: 3 },
    { name: "Consulting", slug: "consulting", parentId: services.id, sortOrder: 4 },
  ];

  for (const sub of subCategories) {
    await db.category.upsert({
      where: { slug: sub.slug },
      update: { parentId: sub.parentId },
      create: sub,
    });
  }

  const restaurant = await db.category.findUniqueOrThrow({ where: { slug: "restaurant-equipment" } });
  const industrial = await db.category.findUniqueOrThrow({ where: { slug: "industrial-machinery" } });
  const professional = await db.category.findUniqueOrThrow({ where: { slug: "professional-services" } });
  const homeServices = await db.category.findUniqueOrThrow({ where: { slug: "home-services" } });
  const electronics = await db.category.findUniqueOrThrow({ where: { slug: "electronics" } });

  const sampleListings = [
    {
      title: "Commercial Espresso Machine — La Marzocco Linea",
      slug: "commercial-espresso-la-marzocco",
      description:
        "Professional 2-group espresso machine. Recently serviced, ideal for cafés and restaurants.",
      price: 8500.0,
      condition: "Used - Good",
      featured: true,
      type: ListingType.FIXED_PRICE,
      categoryId: restaurant.id,
      imageUrl: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800",
    },
    {
      title: "Industrial Forklift — 5000 lb Capacity",
      slug: "industrial-forklift-5000lb",
      description: "Propane forklift with side shift. Low hours, warehouse-ready.",
      price: 12500.0,
      condition: "Used - Good",
      featured: true,
      type: ListingType.FIXED_PRICE,
      categoryId: industrial.id,
      imageUrl: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800",
    },
    {
      title: "Bookkeeping & Tax Prep — Monthly Package",
      slug: "bookkeeping-tax-prep-monthly",
      description:
        "Certified CPA offering monthly bookkeeping, payroll, and quarterly tax filings for small businesses.",
      price: 299.0,
      condition: "Service",
      featured: true,
      type: ListingType.FIXED_PRICE,
      categoryId: professional.id,
      imageUrl: "https://images.unsplash.com/photo-1554224311-beee415c201f?w=800",
    },
    {
      title: "Licensed Electrician — Home & Commercial",
      slug: "licensed-electrician-services",
      description:
        "Fully licensed electrician. Panel upgrades, rewiring, EV charger installs. Free estimates.",
      price: 85.0,
      condition: "Service",
      featured: true,
      type: ListingType.FIXED_PRICE,
      categoryId: homeServices.id,
      imageUrl: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800",
    },
    {
      title: "Apple MacBook Pro 14\" M3 Pro",
      slug: "macbook-pro-14-m3-pro",
      description:
        "Excellent condition MacBook Pro with 18GB RAM and 512GB SSD. Includes original charger.",
      price: 1899.99,
      condition: "Like New",
      featured: true,
      type: ListingType.FIXED_PRICE,
      categoryId: electronics.id,
      imageUrl: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800",
    },
    {
      title: "Sony WH-1000XM5 Headphones",
      slug: "sony-wh-1000xm5",
      description: "Premium noise-cancelling headphones. Barely used, full box.",
      price: 249.99,
      condition: "Like New",
      featured: false,
      type: ListingType.FIXED_PRICE,
      categoryId: electronics.id,
      imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800",
    },
    {
      title: "Vintage Rolex Submariner (Replica Display)",
      slug: "vintage-rolex-display",
      description: "Display piece for collectors. Not a functional watch.",
      price: 89.0,
      condition: "Used - Good",
      featured: false,
      type: ListingType.AUCTION,
      categoryId: electronics.id,
      imageUrl: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=800",
    },
  ];

  for (const item of sampleListings) {
    const { imageUrl, ...listingData } = item;
    const listing = await db.listing.upsert({
      where: { slug: item.slug },
      update: {
        title: item.title,
        description: item.description,
        price: item.price,
        featured: item.featured,
        categoryId: item.categoryId,
      },
      create: {
        ...listingData,
        sellerId: seller.id,
        status: ListingStatus.ACTIVE,
        publishedAt: new Date(),
        quantity: 1,
        images: {
          create: {
            url: imageUrl,
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
  console.log("  admin@cubo.market / password123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
