"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function ListingActions({
  slug,
  status,
}: {
  slug: string;
  status: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function remove() {
    if (!confirm("Remove this listing from the marketplace?")) return;
    setLoading(true);
    await fetch(`/api/listings/${slug}`, { method: "DELETE" });
    setLoading(false);
    router.refresh();
  }

  async function toggleStatus() {
    setLoading(true);
    const newStatus = status === "ACTIVE" ? "DRAFT" : "ACTIVE";
    await fetch(`/api/listings/${slug}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status: newStatus,
        publishedAt: newStatus === "ACTIVE" ? new Date().toISOString() : null,
      }),
    });
    setLoading(false);
    router.refresh();
  }

  return (
    <div className="flex justify-end gap-2">
      <Link href={`/dashboard/seller/listings/${slug}/edit`}>
        <Button variant="secondary" size="sm">
          Edit
        </Button>
      </Link>
      <Button variant="ghost" size="sm" onClick={toggleStatus} disabled={loading}>
        {status === "ACTIVE" ? "Hide" : "Publish"}
      </Button>
      <Button variant="danger" size="sm" onClick={remove} disabled={loading}>
        Remove
      </Button>
    </div>
  );
}
