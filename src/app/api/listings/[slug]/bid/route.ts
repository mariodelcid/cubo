import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { bidSchema } from "@/lib/validators/schemas";
import { apiSuccess, apiError, zodError } from "@/lib/api-utils";
import { Decimal } from "@prisma/client/runtime/library";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) return apiError("Unauthorized", 401);

    const { slug } = await params;
    const body = await request.json();
    const parsed = bidSchema.safeParse(body);
    if (!parsed.success) return zodError(parsed.error);

    const listing = await db.listing.findUnique({
      where: { slug },
      include: { auction: true },
    });

    if (!listing?.auction) return apiError("Auction not found", 404);
    if (listing.status !== "ACTIVE") {
      return apiError("Listing is not active", 400);
    }
    if (new Date(listing.auction.endsAt) <= new Date()) {
      return apiError("Auction has ended", 400);
    }
    if (listing.sellerId === session.user.id) {
      return apiError("Cannot bid on your own listing", 400);
    }

    const minBid = listing.auction.currentBid
      ? new Decimal(listing.auction.currentBid).plus(listing.auction.bidIncrement)
      : listing.auction.startingBid;

    if (new Decimal(parsed.data.amount).lessThan(minBid)) {
      return apiError(`Minimum bid is ${minBid}`, 400);
    }

    const bid = await db.$transaction(async (tx) => {
      const newBid = await tx.bid.create({
        data: {
          auctionId: listing.auction!.id,
          bidderId: session.user!.id,
          amount: parsed.data.amount,
          isAuto: parsed.data.isAutoBid,
          maxAuto: parsed.data.maxAmount,
        },
      });

      await tx.auction.update({
        where: { id: listing.auction!.id },
        data: {
          currentBid: parsed.data.amount,
        },
      });

      return newBid;
    });

    return apiSuccess(bid, 201);
  } catch (error) {
    console.error("Bid POST error:", error);
    return apiError("Internal server error", 500);
  }
}
