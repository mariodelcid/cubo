"use client";

import { useRef, useState } from "react";
import { ImagePlus, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface UploadedImage {
  url: string;
  preview?: string;
}

interface ImageUploadProps {
  images: UploadedImage[];
  onChange: (images: UploadedImage[]) => void;
  maxImages?: number;
}

export function ImageUpload({
  images,
  onChange,
  maxImages = 5,
}: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [urlInput, setUrlInput] = useState("");

  async function uploadFiles(files: FileList | File[]) {
    const fileArray = Array.from(files);
    const remaining = maxImages - images.length;

    if (remaining <= 0) {
      setError(`Maximum ${maxImages} images allowed.`);
      return;
    }

    const toUpload = fileArray.slice(0, remaining);
    setUploading(true);
    setError("");

    const uploaded: UploadedImage[] = [];

    for (const file of toUpload) {
      const preview = URL.createObjectURL(file);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "listings");

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        URL.revokeObjectURL(preview);
        setError(data.error ?? "Upload failed");
        continue;
      }

      uploaded.push({ url: data.data.publicUrl, preview });
    }

    if (uploaded.length > 0) {
      onChange([...images, ...uploaded]);
    }

    setUploading(false);
    if (inputRef.current) inputRef.current.value = "";
  }

  function removeImage(index: number) {
    const removed = images[index];
    if (removed.preview) URL.revokeObjectURL(removed.preview);
    onChange(images.filter((_, i) => i !== index));
  }

  function addUrl() {
    if (!urlInput.trim()) return;
    try {
      new URL(urlInput);
    } catch {
      setError("Enter a valid image URL.");
      return;
    }
    if (images.length >= maxImages) {
      setError(`Maximum ${maxImages} images allowed.`);
      return;
    }
    onChange([...images, { url: urlInput.trim() }]);
    setUrlInput("");
    setError("");
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">Photos</label>
        <span className="text-xs text-gray-500">
          {images.length}/{maxImages}
        </span>
      </div>

      {images.length > 0 && (
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
          {images.map((image, index) => (
            <div
              key={`${image.url}-${index}`}
              className="group relative aspect-square overflow-hidden rounded-lg border border-gray-200 bg-gray-100"
            >
              <img
                src={image.preview ?? image.url}
                alt=""
                className="h-full w-full object-cover"
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute right-1 top-1 rounded-full bg-black/60 p-1 text-white opacity-0 transition group-hover:opacity-100"
                aria-label="Remove image"
              >
                <X className="h-3.5 w-3.5" />
              </button>
              {index === 0 && (
                <span className="absolute bottom-1 left-1 rounded bg-black/60 px-1.5 py-0.5 text-[10px] font-medium text-white">
                  Cover
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {images.length < maxImages && (
        <div
          className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 px-4 py-8 transition hover:border-blue-400 hover:bg-blue-50/50"
          onClick={() => !uploading && inputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            if (!uploading && e.dataTransfer.files.length) {
              uploadFiles(e.dataTransfer.files);
            }
          }}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            multiple
            className="hidden"
            onChange={(e) => e.target.files && uploadFiles(e.target.files)}
          />
          {uploading ? (
            <>
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              <p className="mt-2 text-sm text-gray-600">Uploading...</p>
            </>
          ) : (
            <>
              <ImagePlus className="h-8 w-8 text-gray-400" />
              <p className="mt-2 text-sm font-medium text-gray-700">
                Click or drag photos here
              </p>
              <p className="mt-1 text-xs text-gray-500">
                JPEG, PNG, WebP, GIF — up to 5 MB each
              </p>
            </>
          )}
        </div>
      )}

      <div className="flex gap-2">
        <Input
          id="imageUrl"
          label=""
          type="url"
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
          placeholder="Or paste an image URL"
          className="flex-1"
        />
        <Button
          type="button"
          variant="secondary"
          className="mt-auto shrink-0"
          onClick={addUrl}
          disabled={!urlInput.trim() || images.length >= maxImages}
        >
          Add URL
        </Button>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
