# Cubo UI Wireframes

Design language: clean white background, blue primary (#2563eb), inspired by eBay/Amazon/Etsy.

---

## Homepage

```
┌─────────────────────────────────────────────────────────────┐
│ [Cubo]  [🔍 Search for anything...        ]  Browse Sell 🛒 │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────────────────────────────────────────┐  │
│  │  HERO: Buy & sell anything on Cubo                    │  │
│  │  [Start shopping]  [Sell an item]                     │  │
│  └─────────────────────────────────────────────────────┘  │
│                                                             │
│  🏷 Auctions  🛡 Protection  🚚 Shipping  ⚡ Checkout      │
│                                                             │
│  Shop by category                                           │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐  │
│  │Elect │ │Fashion│ │ Home │ │Sports│ │ Toys │ │ Auto │  │
│  └──────┘ └──────┘ └──────┘ └──────┘ └──────┘ └──────┘  │
│                                                             │
│  Featured items                              [View all →]  │
│  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐             │
│  │ [img]  │ │ [img]  │ │ [img]  │ │ [img]  │             │
│  │ Title  │ │ Title  │ │ Title  │ │ Title  │             │
│  │ $99.99 │ │ $249   │ │ AUCTION│ │ $1,799 │             │
│  └────────┘ └────────┘ └────────┘ └────────┘             │
│                                                             │
│  Trending now                                               │
│  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐             │
│  │ ...    │ │ ...    │ │ ...    │ │ ...    │             │
│  └────────┘ └────────┘ └────────┘ └────────┘             │
├─────────────────────────────────────────────────────────────┤
│ Footer: Buy | Sell | Help | © 2026 Cubo                    │
└─────────────────────────────────────────────────────────────┘
```

---

## Search Results

```
┌─────────────────────────────────────────────────────────────┐
│ Header (same as homepage)                                   │
├──────────┬──────────────────────────────────────────────────┤
│ FILTERS  │  Results for "iphone"          Sort: [Newest ▼]  │
│          │  24 items found                                 │
│ Category │  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐   │
│ □ Phones │  │ [img]  │ │ [img]  │ │ [img]  │ │ [img]  │   │
│ □ Laptops│  │ iPhone │ │ iPhone │ │ iPhone │ │ AirPods│   │
│          │  │ $1,099 │ │ $899   │ │ AUCTION│ │ $149   │   │
│ Price    │  └────────┘ └────────┘ └────────┘ └────────┘   │
│ [$] - [$]│                                                  │
│          │  [← Prev]  Page 1 of 3  [Next →]               │
│ Condition│                                                  │
│ □ New    │                                                  │
│ □ Used   │                                                  │
│          │                                                  │
│ Type     │                                                  │
│ ○ All    │                                                  │
│ ○ Auction│                                                  │
│ ○ Buy Now│                                                  │
└──────────┴──────────────────────────────────────────────────┘
```

---

## Listing Detail

```
┌─────────────────────────────────────────────────────────────┐
│ Header                                                      │
├────────────────────────────┬────────────────────────────────┤
│  ┌──────────────────────┐  │  Electronics > Phones           │
│  │                      │  │  iPhone 15 Pro Max 256GB        │
│  │    MAIN IMAGE        │  │                                 │
│  │                      │  │  $1,099.99  ̶$̶1̶,̶1̶9̶9̶.̶9̶9̶          │
│  └──────────────────────┘  │                                 │
│  [thumb][thumb][thumb]     │  ┌─────────────────────────┐   │
│                            │  │ ⏱ 12 bids · Ends Aug 8  │   │
│                            │  │ Buy It Now: $1,500      │   │
│                            │  └─────────────────────────┘   │
│                            │                                 │
│                            │  [Place bid] [Add to cart] [♡] │
│                            │                                 │
│                            │  Condition: New                 │
│                            │  📍 Local pickup available      │
│                            │  🚚 Shipping at checkout        │
│                            │                                 │
│                            │  ┌─────────────────────────┐   │
│                            │  │ 👤 Demo Seller ★ 4.8   │   │
│                            │  └─────────────────────────┘   │
├────────────────────────────┴────────────────────────────────┤
│  Description                                                │
│  Brand new, sealed iPhone 15 Pro Max...                     │
│                                                             │
│  Bid history (auctions)                                     │
│  ┌─────────────────────────────────────────────────────┐  │
│  │ $1,099 — demobuyer — 2 min ago                       │  │
│  │ $1,050 — user123 — 15 min ago                        │  │
│  └─────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## Seller Dashboard (Phase 2)

```
┌─────────────────────────────────────────────────────────────┐
│ Header                                                      │
├──────────┬──────────────────────────────────────────────────┤
│ SIDEBAR  │  Dashboard                                       │
│          │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌────────┐│
│ Overview │  │ Revenue │ │ Orders  │ │ Listings│ │ Rating ││
│ Listings │  │ $12,450 │ │   47    │ │   23    │ │  4.8   ││
│ Orders   │  └─────────┘ └─────────┘ └─────────┘ └────────┘│
│ Messages │                                                  │
│ Analytics│  Revenue chart (30 days)                         │
│ Settings │  ┌──────────────────────────────────────────┐  │
│          │  │     📈                                    │  │
│          │  └──────────────────────────────────────────┘  │
│          │                                                  │
│          │  Recent orders                                   │
│          │  ┌──────────────────────────────────────────┐  │
│          │  │ #CUBO-ABC — iPhone 15 — $1,099 — Shipped│  │
│          │  │ #CUBO-DEF — AirPods — $149 — Processing │  │
│          │  └──────────────────────────────────────────┘  │
└──────────┴──────────────────────────────────────────────────┘
```

---

## Listing Wizard (Phase 2)

```
Step 1: Photos → Step 2: Details → Step 3: Pricing → Step 4: Review

┌─────────────────────────────────────────────────────────────┐
│  Create listing — Step 1: Photos                            │
│  ● ─── ○ ─── ○ ─── ○                                       │
│                                                             │
│  ┌ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┐  │
│  │  Drag & drop up to 20 photos                        │  │
│  │  or click to browse                                 │  │
│  └ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┘  │
│                                                             │
│  [img1] [img2] [img3] [+]                                  │
│                                                             │
│                              [Cancel]  [Next: Details →]   │
└─────────────────────────────────────────────────────────────┘
```

---

## Mobile (responsive)

- Header collapses to hamburger menu
- Search bar moves below logo on mobile
- Listing grid: 2 columns on mobile, 4 on desktop
- Bottom nav bar (Phase 2): Home | Search | Sell | Messages | Account

---

## Dark Mode

Toggle via system preference or header switch. Uses `next-themes`:
- Background: `#0f172a`
- Cards: `#1e293b`
- Primary stays `#2563eb`
