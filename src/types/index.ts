import type { Listing, ListingImage, Category, User, Auction } from "@prisma/client";

export type ListingWithRelations = Listing & {
  images: ListingImage[];
  category: Category;
  seller: Pick<User, "id" | "name" | "username" | "avatarUrl" | "reputationScore">;
  auction?: Auction | null;
};

export type SearchFilters = {
  q?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  condition?: string;
  type?: string;
  sort?: string;
  page?: number;
  limit?: number;
};

export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
  errors?: Record<string, string[]>;
};

export type PaginatedResponse<T> = ApiResponse<T> & {
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
};
