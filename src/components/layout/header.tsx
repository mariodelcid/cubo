import Link from "next/link";
import { Search, ShoppingCart, Heart, User, Menu } from "lucide-react";
import { SITE_NAME, NAV_CATEGORIES } from "@/lib/constants";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center gap-4">
          <Link href="/" className="flex shrink-0 items-center gap-2">
            <span className="text-2xl font-bold text-blue-600">{SITE_NAME}</span>
          </Link>

          <form action="/search" method="GET" className="hidden flex-1 md:flex">
            <div className="relative w-full max-w-2xl">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                name="q"
                type="search"
                placeholder="Search for anything..."
                className="w-full rounded-full border border-gray-300 py-2 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          </form>

          <nav className="ml-auto flex items-center gap-1 sm:gap-2">
            <Link
              href="/sell"
              className="hidden rounded-full bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 sm:inline-flex"
            >
              Sell
            </Link>
            <Link href="/watchlist" className="rounded-lg p-2 text-gray-600 hover:bg-gray-100" aria-label="Watchlist">
              <Heart className="h-5 w-5" />
            </Link>
            <Link href="/cart" className="rounded-lg p-2 text-gray-600 hover:bg-gray-100" aria-label="Cart">
              <ShoppingCart className="h-5 w-5" />
            </Link>
            <Link href="/login" className="rounded-lg p-2 text-gray-600 hover:bg-gray-100" aria-label="Account">
              <User className="h-5 w-5" />
            </Link>
            <button className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 md:hidden" aria-label="Menu">
              <Menu className="h-5 w-5" />
            </button>
          </nav>
        </div>

        <nav className="hidden border-t border-gray-100 py-2 md:flex md:gap-6">
          {NAV_CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/category/${cat.slug}`}
              className="text-sm text-gray-600 hover:text-blue-600"
            >
              {cat.name}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
