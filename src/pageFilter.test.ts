import { describe, it, expect } from "vitest";
import {
  applyFilterConfig,
  buildFilterConfig,
  countFiltered,
  FilterRule,
} from "./pageFilter";

interface Product {
  name: string;
  price: number;
  category: string;
}

const items: Product[] = [
  { name: "Apple",  price: 1.5,  category: "fruit" },
  { name: "Banana", price: 0.75, category: "fruit" },
  { name: "Carrot", price: 0.9,  category: "vegetable" },
  { name: "Date",   price: 3.0,  category: "fruit" },
];

describe("buildFilterConfig", () => {
  it("defaults conjunction to 'and'", () => {
    const cfg = buildFilterConfig<Product>([]);
    expect(cfg.conjunction).toBe("and");
  });

  it("accepts explicit conjunction", () => {
    const cfg = buildFilterConfig<Product>([], "or");
    expect(cfg.conjunction).toBe("or");
  });
});

describe("applyFilterConfig", () => {
  it("returns all items when no rules", () => {
    const cfg = buildFilterConfig<Product>([]);
    expect(applyFilterConfig(items, cfg)).toHaveLength(4);
  });

  it("filters by eq operator", () => {
    const cfg = buildFilterConfig<Product>([{ field: "category", operator: "eq", value: "fruit" }]);
    expect(applyFilterConfig(items, cfg)).toHaveLength(3);
  });

  it("filters by gte operator", () => {
    const cfg = buildFilterConfig<Product>([{ field: "price", operator: "gte", value: 1.5 }]);
    const result = applyFilterConfig(items, cfg);
    expect(result.map((i) => i.name)).toEqual(["Apple", "Date"]);
  });

  it("filters by contains operator", () => {
    const cfg = buildFilterConfig<Product>([{ field: "name", operator: "contains", value: "a" }]);
    const result = applyFilterConfig(items, cfg);
    expect(result.map((i) => i.name)).toEqual(["Banana", "Carrot", "Date"]);
  });

  it("applies 'and' conjunction across multiple rules", () => {
    const cfg = buildFilterConfig<Product>([
      { field: "category", operator: "eq",  value: "fruit" },
      { field: "price",    operator: "lt",  value: 2.0 },
    ]);
    const result = applyFilterConfig(items, cfg);
    expect(result.map((i) => i.name)).toEqual(["Apple", "Banana"]);
  });

  it("applies 'or' conjunction across multiple rules", () => {
    const cfg = buildFilterConfig<Product>(
      [
        { field: "category", operator: "eq", value: "vegetable" },
        { field: "price",    operator: "gt", value: 2.5 },
      ],
      "or"
    );
    const result = applyFilterConfig(items, cfg);
    expect(result.map((i) => i.name)).toEqual(["Carrot", "Date"]);
  });
});

describe("countFiltered", () => {
  it("returns count of matching items", () => {
    const cfg = buildFilterConfig<Product>([{ field: "category", operator: "neq", value: "fruit" }]);
    expect(countFiltered(items, cfg)).toBe(1);
  });
});
