import { describe, it, expect } from "vitest";
import { slugify, formatPrice, generateOrderNumber } from "@/lib/utils";

describe("utils", () => {
  it("slugifies text", () => {
    expect(slugify("Hello World!")).toBe("hello-world");
    expect(slugify("  MacBook Pro 14\"  ")).toBe("macbook-pro-14");
  });

  it("formats price", () => {
    expect(formatPrice(19.99)).toBe("$19.99");
    expect(formatPrice("100")).toBe("$100.00");
  });

  it("generates order numbers", () => {
    const num = generateOrderNumber();
    expect(num).toMatch(/^CUBO-/);
  });
});
