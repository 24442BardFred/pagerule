import { describe, it, expect } from "vitest";
import { searchItems, buildSearchPredicate } from "./pageSearch";

type Article = { title: string; author: string; tags: string };

const items: Article[] = [
  { title: "Introduction to TypeScript", author: "Alice", tags: "typescript,dev" },
  { title: "Advanced React Patterns", author: "Bob", tags: "react,frontend" },
  { title: "TypeScript Generics Deep Dive", author: "Alice", tags: "typescript,generics" },
  { title: "CSS Grid Layout", author: "Carol", tags: "css,frontend" },
];

describe("searchItems", () => {
  it("returns all items when query is empty", () => {
    const result = searchItems(items, { query: "", fields: ["title"] });
    expect(result.items).toHaveLength(4);
    expect(result.totalMatches).toBe(4);
  });

  it("filters items by a single field", () => {
    const result = searchItems(items, { query: "typescript", fields: ["title"] });
    expect(result.items).toHaveLength(2);
    expect(result.totalMatches).toBe(2);
  });

  it("filters items across multiple fields", () => {
    const result = searchItems(items, { query: "alice", fields: ["title", "author"] });
    expect(result.items).toHaveLength(2);
  });

  it("is case-insensitive by default", () => {
    const result = searchItems(items, { query: "REACT", fields: ["title"] });
    expect(result.items).toHaveLength(1);
    expect(result.items[0].title).toBe("Advanced React Patterns");
  });

  it("respects caseSensitive option", () => {
    const result = searchItems(items, { query: "REACT", fields: ["title"], caseSensitive: true });
    expect(result.items).toHaveLength(0);
  });

  it("returns the original query in result", () => {
    const result = searchItems(items, { query: "css", fields: ["tags"] });
    expect(result.query).toBe("css");
  });

  it("handles whitespace-only query as empty", () => {
    const result = searchItems(items, { query: "   ", fields: ["title"] });
    expect(result.items).toHaveLength(4);
  });
});

describe("buildSearchPredicate", () => {
  it("returns a predicate that matches correctly", () => {
    const predicate = buildSearchPredicate<Article>({ query: "frontend", fields: ["tags"] });
    const filtered = items.filter(predicate);
    expect(filtered).toHaveLength(2);
  });

  it("returns a predicate that matches all when query is empty", () => {
    const predicate = buildSearchPredicate<Article>({ query: "", fields: ["title"] });
    expect(items.every(predicate)).toBe(true);
  });
});
