import Link from "next/link";
import { SITE_NAME } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-gray-200 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div>
            <h3 className="font-semibold text-gray-900">Buy</h3>
            <ul className="mt-3 space-y-2 text-sm text-gray-600">
              <li><Link href="/search" className="hover:text-blue-600">Browse</Link></li>
              <li><Link href="/deals" className="hover:text-blue-600">Deals</Link></li>
              <li><Link href="/auctions" className="hover:text-blue-600">Auctions</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Sell</h3>
            <ul className="mt-3 space-y-2 text-sm text-gray-600">
              <li><Link href="/sell" className="hover:text-blue-600">Start selling</Link></li>
              <li><Link href="/dashboard/seller" className="hover:text-blue-600">Seller dashboard</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Help</h3>
            <ul className="mt-3 space-y-2 text-sm text-gray-600">
              <li><Link href="/help" className="hover:text-blue-600">Help center</Link></li>
              <li><Link href="/contact" className="hover:text-blue-600">Contact us</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">About</h3>
            <ul className="mt-3 space-y-2 text-sm text-gray-600">
              <li><Link href="/about" className="hover:text-blue-600">About {SITE_NAME}</Link></li>
              <li><Link href="/privacy" className="hover:text-blue-600">Privacy</Link></li>
              <li><Link href="/terms" className="hover:text-blue-600">Terms</Link></li>
            </ul>
          </div>
        </div>
        <p className="mt-8 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} {SITE_NAME}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
