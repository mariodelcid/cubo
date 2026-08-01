"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ImageUpload } from "@/components/listings/image-upload";

interface Category {
  id: string;
  name: string;
  slug: string;
  children?: Category[];
}

interface ListingFormProps {
  categories: Category[];
  initial?: {
    slug?: string;
    title?: string;
    description?: string;
    categoryId?: string;
    price?: number;
    condition?: string;
    imageUrl?: string;
    imageUrls?: string[];
    type?: string;
    status?: string;
  };
  mode?: "create" | "edit";
}

export function ListingForm({
  categories,
  initial,
  mode = "create",
}: ListingFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [images, setImages] = useState<{ url: string }[]>(() => {
    if (initial?.imageUrls?.length) {
      return initial.imageUrls.map((url) => ({ url }));
    }
    if (initial?.imageUrl) return [{ url: initial.imageUrl }];
    return [];
  });
  const [form, setForm] = useState({
    title: initial?.title ?? "",
    description: initial?.description ?? "",
    categoryId: initial?.categoryId ?? "",
    price: initial?.price?.toString() ?? "",
    condition: initial?.condition ?? "New",
    type: initial?.type ?? "FIXED_PRICE",
    status: initial?.status ?? "ACTIVE",
  });

  const flatCategories = categories.flatMap((parent) => [
    parent,
    ...(parent.children ?? []),
  ]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const payload = {
      title: form.title,
      description: form.description,
      categoryId: form.categoryId,
      price: parseFloat(form.price),
      condition: form.condition,
      type: form.type,
      status: form.status,
      imageUrls: images.map((img) => img.url),
    };

    const url =
      mode === "edit" && initial?.slug
        ? `/api/listings/${initial.slug}`
        : "/api/listings";
    const method = mode === "edit" ? "PATCH" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error ?? "Something went wrong");
      return;
    }

    router.push("/dashboard/seller/listings");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <Input
        id="title"
        label="Title"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
        required
        placeholder="e.g. Commercial espresso machine"
      />

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          id="description"
          rows={5}
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          required
          className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="Describe the item or service in detail..."
        />
      </div>

      <div>
        <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700">
          Category
        </label>
        <select
          id="categoryId"
          value={form.categoryId}
          onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
          required
          className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
        >
          <option value="">Select a category</option>
          {flatCategories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          id="price"
          label="Price (USD)"
          type="number"
          min="0"
          step="0.01"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
          required
        />
        <div>
          <label htmlFor="condition" className="block text-sm font-medium text-gray-700">
            Condition / Type
          </label>
          <select
            id="condition"
            value={form.condition}
            onChange={(e) => setForm({ ...form, condition: e.target.value })}
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          >
            <option value="New">New</option>
            <option value="Like New">Like New</option>
            <option value="Used - Good">Used - Good</option>
            <option value="Service">Service</option>
            <option value="Consultation">Consultation</option>
          </select>
        </div>
      </div>

      <ImageUpload images={images} onChange={setImages} maxImages={5} />

      <div>
        <label htmlFor="status" className="block text-sm font-medium text-gray-700">
          Status
        </label>
        <select
          id="status"
          value={form.status}
          onChange={(e) => setForm({ ...form, status: e.target.value })}
          className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
        >
          <option value="ACTIVE">Active (visible on site)</option>
          <option value="DRAFT">Draft (hidden)</option>
        </select>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex gap-3">
        <Button type="submit" isLoading={loading}>
          {mode === "edit" ? "Save changes" : "Publish listing"}
        </Button>
        <Button type="button" variant="secondary" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
