# Cubo API Reference

Base URL: `{APP_URL}/api`

All responses follow:
```json
{ "success": true, "data": { ... } }
{ "success": false, "error": "message", "errors": { "field": ["msg"] } }
```

Pagination query params: `page` (default 1), `limit` (default 20, max 100)

---

## Auth

### POST /api/auth/register
Create a new account.

**Body:**
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "SecurePass1",
  "username": "janedoe"
}
```

**Response 201:** User object (no password)

### POST /api/auth/[...nextauth]
NextAuth endpoints — use `/login` page or `signIn()` client-side.

Providers: `credentials`, `google`, `apple`

---

## Listings

### GET /api/listings
Search and filter listings.

**Query params:**
| Param | Type | Description |
|-------|------|-------------|
| q | string | Search query |
| category | string | Category slug |
| minPrice | number | Min price filter |
| maxPrice | number | Max price filter |
| condition | string | Item condition |
| type | enum | FIXED_PRICE, AUCTION, BOTH |
| sort | enum | relevance, price_asc, price_desc, newest, ending_soon |
| page | number | Page number |
| limit | number | Items per page |

### POST /api/listings
Create a listing (auth required, seller role).

**Body:**
```json
{
  "title": "iPhone 15 Pro",
  "description": "<p>Description HTML</p>",
  "categoryId": "clx...",
  "type": "FIXED_PRICE",
  "price": 999.99,
  "quantity": 1,
  "condition": "New",
  "localPickup": false,
  "auction": {
    "startPrice": 500,
    "reservePrice": 800,
    "buyItNowPrice": 1200,
    "startsAt": "2026-08-01T00:00:00Z",
    "endsAt": "2026-08-08T00:00:00Z"
  }
}
```

### GET /api/listings/:slug
Get listing detail with images, seller, auction, reviews.

### PATCH /api/listings/:slug
Update listing (owner or admin).

### DELETE /api/listings/:slug
Soft-delete (sets status SUSPENDED).

---

## Auctions

### POST /api/listings/:slug/bid
Place a bid (auth required).

**Body:**
```json
{
  "amount": 550.00,
  "isAutoBid": false,
  "maxAmount": 700.00
}
```

**Errors:**
- 400: Bid below minimum increment
- 400: Cannot bid on own listing
- 400: Auction not live

---

## Categories

### GET /api/categories
Returns category tree with subcategories.

---

## Watchlist

### GET /api/watchlist
User's saved items (auth required).

### POST /api/watchlist
**Body:** `{ "listingId": "clx..." }`

### DELETE /api/watchlist
**Body:** `{ "listingId": "clx..." }`

---

## Upload

### POST /api/upload
Get presigned S3 upload URL.

**Body:**
```json
{
  "filename": "photo.jpg",
  "contentType": "image/jpeg",
  "folder": "listings"
}
```

**Response:**
```json
{
  "uploadUrl": "https://s3...",
  "publicUrl": "https://bucket.s3.../listings/uuid.jpg",
  "key": "listings/uuid.jpg"
}
```

### PUT /api/upload
Attach uploaded image to listing.

**Body:**
```json
{
  "listingId": "clx...",
  "url": "https://...",
  "alt": "Front view",
  "sortOrder": 0
}
```

---

## Planned Endpoints (Phase 2+)

| Endpoint | Description |
|----------|-------------|
| POST /api/cart/items | Add to cart |
| POST /api/checkout | Create Stripe session |
| POST /api/webhooks/stripe | Payment webhooks |
| GET /api/orders | Order history |
| GET /api/messages | Conversations |
| POST /api/reviews | Leave feedback |
| GET /api/admin/users | Admin user management |
| POST /api/ai/description | AI product description |
