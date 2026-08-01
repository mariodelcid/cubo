import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import { getAppUrl } from "@/lib/env";

const UPLOAD_ROOT = path.join(process.cwd(), "uploads");
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

const EXTENSIONS: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

export function validateImageFile(file: File) {
  if (!ALLOWED_TYPES.has(file.type)) {
    return "Only JPEG, PNG, WebP, and GIF images are allowed.";
  }
  if (file.size > MAX_FILE_SIZE) {
    return "Each image must be 5 MB or smaller.";
  }
  return null;
}

export async function saveUploadedImage(file: File, folder = "listings") {
  const error = validateImageFile(file);
  if (error) throw new Error(error);

  const extension = EXTENSIONS[file.type] ?? "jpg";
  const filename = `${randomUUID()}.${extension}`;
  const dir = path.join(UPLOAD_ROOT, folder);
  await mkdir(dir, { recursive: true });

  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(dir, filename), buffer);

  const publicUrl = `${getAppUrl()}/api/files/${folder}/${filename}`;
  return { publicUrl, key: `${folder}/${filename}` };
}

export function getUploadFilePath(key: string) {
  const normalized = path.normalize(key).replace(/^(\.\.(\/|\\|$))+/, "");
  const fullPath = path.join(UPLOAD_ROOT, normalized);
  if (!fullPath.startsWith(UPLOAD_ROOT)) {
    throw new Error("Invalid file path");
  }
  return fullPath;
}

export { MAX_FILE_SIZE, ALLOWED_TYPES };
