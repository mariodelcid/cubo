export const SITE_NAME = "Cubo";
export const SITE_DESCRIPTION =
  "Buy and sell anything — auctions, fixed price listings, and more.";

export const LISTING_CONDITIONS = [
  "New",
  "Like New",
  "Used - Excellent",
  "Used - Good",
  "Used - Fair",
  "For Parts",
] as const;

export const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "ending_soon", label: "Ending Soon" },
  { value: "popular", label: "Most Popular" },
] as const;

export const NAV_CATEGORIES = [
  { name: "Commercial Equipment", slug: "commercial-equipment", highlight: true },
  { name: "Services", slug: "services", highlight: true },
  { name: "Electronics", slug: "electronics" },
  { name: "Fashion", slug: "fashion" },
  { name: "Home & Garden", slug: "home-garden" },
  { name: "Automotive", slug: "automotive" },
] as const;

export const MARKETPLACE_SECTIONS = [
  {
    slug: "commercial-equipment",
    name: "Commercial Equipment",
    description: "Restaurant, industrial, office & medical equipment for your business.",
    icon: "🏭",
  },
  {
    slug: "services",
    name: "Services",
    description: "Professional, home, repair & consulting services from trusted providers.",
    icon: "🛠️",
  },
] as const;
