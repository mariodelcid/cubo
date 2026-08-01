# Cubo — How to Administer Listings

This guide explains how to **add**, **update**, and **remove** items on your Cubo marketplace.

**Live site:** https://cubo-production-c3c5.up.railway.app

---

## Quick reference

| Action | Where to go |
|--------|-------------|
| **Add** a listing | Log in → **Sell** (or `/sell`) |
| **View / edit / hide / remove** | **Seller Dashboard → Manage listings** (`/dashboard/seller/listings`) |
| **Manage all listings (admin)** | Log in as admin → same listings page |
| **Browse by section** | Homepage → **Commercial Equipment** or **Services** cards |

---

## 1. Log in

Use one of these accounts (password for all: `password123`):

| Account | Role | Can do |
|---------|------|--------|
| `seller@cubo.market` | Seller | Add/edit/remove **own** listings |
| `admin@cubo.market` | Admin | Add/edit/remove **all** listings |
| `buyer@cubo.market` | Buyer | Browse & buy only |

1. Go to **Login** (`/login`)
2. Enter email and password
3. You'll be redirected to the dashboard or the page you came from

---

## 2. Add a new item

1. Click **Sell** in the header (or visit `/sell`)
2. Fill in the form:
   - **Title** — what buyers see first
   - **Description** — full details
   - **Category** — pick **Commercial Equipment** or **Services** subcategories, or any other category
   - **Price** — in USD
   - **Condition / Type** — use **Service** or **Consultation** for service listings
   - **Image URL** — optional link to an image (e.g. from Unsplash)
   - **Status** — **Active** (visible) or **Draft** (hidden)
3. Click **Publish listing**

The item appears on the homepage section that matches its category (Commercial Equipment, Services, or Featured).

---

## 3. Update an existing item

1. Go to **Seller Dashboard** → **Manage listings** (`/dashboard/seller/listings`)
2. Find the item in the table
3. Click **Edit**
4. Change any fields and click **Save changes**

**Hide without deleting:** click **Hide** — sets status to Draft (not visible on the site). Click **Publish** to show it again.

---

## 4. Remove an item

1. Go to **Manage listings** (`/dashboard/seller/listings`)
2. Click **Remove** on the row
3. Confirm — the listing is soft-deleted (status `REMOVED`) and no longer appears on the site

---

## 5. Commercial Equipment & Services sections

These are **categories**, not separate apps:

- **Commercial Equipment** — `/category/commercial-equipment`  
  Subcategories: Restaurant, Industrial, Office, Medical
- **Services** — `/category/services`  
  Subcategories: Professional, Home, Repair, Consulting

The **homepage** shows preview cards for both sections. When you add a listing under one of these categories (or their subcategories), it automatically appears in the right section.

---

## 6. Deploying changes to Railway

When you change **code** (not just listings via the UI):

1. Commit and push to GitHub (`main` branch)
2. Railway auto-redeploys the `cubo` service
3. Check deploy status: [Railway dashboard](https://railway.com/project/d49e152f-da57-4ae0-b2c4-405f18ba4856)

### Re-seed demo data (optional)

If you add new categories or sample listings in `prisma/seed.ts`:

1. In Railway → **cubo** service → **Variables**
2. Set `RUN_SEED=true`
3. Redeploy (or restart)
4. Set `RUN_SEED=false` again after seed completes

---

## 7. Direct database access (advanced)

For bulk edits or inspecting data:

1. In Railway, open the **Postgres** service
2. Use **Connect** → copy `DATABASE_URL`
3. Run locally:
   ```bash
   DATABASE_URL="..." npx prisma studio
   ```
4. Edit `Listing`, `Category`, and `User` tables in the browser UI

---

## 8. API (for scripts or integrations)

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `GET` | `/api/listings` | Search listings (`?category=commercial-equipment`) |
| `POST` | `/api/listings` | Create (requires login cookie/session) |
| `PATCH` | `/api/listings/[slug]` | Update |
| `DELETE` | `/api/listings/[slug]` | Remove |
| `GET` | `/api/dashboard/listings` | List your (or all) listings |

See `docs/API.md` for full API documentation.

---

## Summary

- **Day-to-day:** use the website — **Sell** to add, **Manage listings** to edit or remove.
- **Admin:** log in as `admin@cubo.market` to manage every seller's items.
- **Code/deploy:** push to GitHub; Railway handles the rest.
