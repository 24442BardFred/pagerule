import { createPageCache, buildCacheKey } from "./pageCache";

describe("createPageCache", () => {
  it("stores and retrieves a value by key", () => {
    const cache = createPageCache<number>();
    cache.set("a", 42);
    expect(cache.get("a")).toBe(42);
  });

  it("returns undefined for missing keys", () => {
    const cache = createPageCache<string>();
    expect(cache.get("missing")).toBeUndefined();
  });

  it("has() returns true for existing, false for missing", () => {
    const cache = createPageCache<boolean>();
    cache.set("x", true);
    expect(cache.has("x")).toBe(true);
    expect(cache.has("y")).toBe(false);
  });

  it("clear() empties the cache", () => {
    const cache = createPageCache<number>();
    cache.set("a", 1);
    cache.set("b", 2);
    cache.clear();
    expect(cache.size()).toBe(0);
    expect(cache.get("a")).toBeUndefined();
  });

  it("evicts oldest entry when maxSize is exceeded", () => {
    const cache = createPageCache<number>({ maxSize: 2 });
    cache.set("a", 1);
    cache.set("b", 2);
    cache.set("c", 3);
    expect(cache.size()).toBe(2);
    expect(cache.get("a")).toBeUndefined();
    expect(cache.get("b")).toBe(2);
    expect(cache.get("c")).toBe(3);
  });

  it("expires entries after ttl", async () => {
    const cache = createPageCache<string>({ ttl: 50 });
    cache.set("k", "val");
    expect(cache.get("k")).toBe("val");
    await new Promise((r) => setTimeout(r, 60));
    expect(cache.get("k")).toBeUndefined();
  });

  it("does not expire entries when ttl is 0", async () => {
    const cache = createPageCache<string>({ ttl: 0 });
    cache.set("k", "persistent");
    await new Promise((r) => setTimeout(r, 30));
    expect(cache.get("k")).toBe("persistent");
  });
});

describe("buildCacheKey", () => {
  it("produces consistent keys regardless of property order", () => {
    const k1 = buildCacheKey({ page: 1, slug: "posts", size: 10 });
    const k2 = buildCacheKey({ size: 10, slug: "posts", page: 1 });
    expect(k1).toBe(k2);
  });

  it("produces different keys for different values", () => {
    const k1 = buildCacheKey({ page: 1 });
    const k2 = buildCacheKey({ page: 2 });
    expect(k1).not.toBe(k2);
  });

  it("serializes nested objects", () => {
    const k = buildCacheKey({ filter: { tag: "ts" }, page: 1 });
    expect(typeof k).toBe("string");
    expect(k).toContain("filter");
  });
});
