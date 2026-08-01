import { describe, it, expect } from "vitest";
import { slugify, formatPrice, generateOrderNumber } from "@/lib/utils";

describe("utils", () => {
  describe("slugify", () => {
    it("converts title to slug", () => {
      expect(slugify("Hello World!")).toBe("hello-world");
    });

    it("handles special characters", () => {
      expect(slugify("iPhone 15 Pro Max — 256GB")).toBe("iphone-15-pro-max-256gb");
    });
  });

  describe("formatPrice", () => {
    it("formats USD currency", () => {
      expect(formatPrice(1099.99)).toBe("$1,099.99");
    });
  });

  describe("generateOrderNumber", () => {
    it("generates unique order numbers", () => {
      const a = generateOrderNumber();
      const b = generateOrderNumber();
      expect(a).toMatch(/^CUBO-/);
      expect(a).not.toBe(b);
    });
  });
});
