import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  password: z
    .string()
    .min(8)
    .regex(/[A-Z]/, "Must contain uppercase letter")
    .regex(/[0-9]/, "Must contain number"),
  username: z
    .string()
    .min(3)
    .max(30)
    .regex(/^[a-zA-Z0-9_]+$/)
    .optional(),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const listingSchema = z.object({
  title: z.string().min(3).max(200),
  description: z.string().min(10),
  categoryId: z.string().cuid(),
  type: z.enum(["FIXED_PRICE", "AUCTION", "AUCTION_WITH_BUY_NOW"]),
  price: z.number().positive().optional(),
  compareAtPrice: z.number().positive().optional(),
  quantity: z.number().int().min(1).default(1),
  condition: z.string().optional(),
  sku: z.string().optional(),
  localPickup: z.boolean().default(false),
  itemSpecifics: z.record(z.string()).optional(),
  shippingOptions: z
    .array(
      z.object({
        method: z.string(),
        cost: z.number().min(0),
        estimatedDays: z.number().int().optional(),
      })
    )
    .optional(),
  auction: z
    .object({
      startPrice: z.number().positive(),
      reservePrice: z.number().positive().optional(),
      buyItNowPrice: z.number().positive().optional(),
      startsAt: z.string().datetime(),
      endsAt: z.string().datetime(),
      bidIncrement: z.number().positive().default(1),
    })
    .optional(),
});

export const bidSchema = z.object({
  amount: z.number().positive(),
  maxAmount: z.number().positive().optional(),
  isAutoBid: z.boolean().default(false),
});

export const searchSchema = z.object({
  q: z.string().optional(),
  category: z.string().optional(),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
  condition: z.string().optional(),
  type: z.enum(["FIXED_PRICE", "AUCTION", "AUCTION_WITH_BUY_NOW"]).optional(),
  sort: z
    .enum(["relevance", "price_asc", "price_desc", "newest", "ending_soon"])
    .default("relevance"),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ListingInput = z.infer<typeof listingSchema>;
export type BidInput = z.infer<typeof bidSchema>;
export type SearchInput = z.infer<typeof searchSchema>;
