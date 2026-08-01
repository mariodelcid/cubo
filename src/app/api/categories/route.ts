import { getCategories } from "@/lib/services/listings";
import { apiSuccess, apiError } from "@/lib/api-utils";

export async function GET() {
  try {
    const categories = await getCategories();
    return apiSuccess(categories);
  } catch (error) {
    console.error("Categories GET error:", error);
    return apiError("Internal server error", 500);
  }
}
