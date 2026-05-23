import { describe, it, expect } from "vitest";
import { groupItems, groupMapToPages, getGroupKeys } from "./pageGrouping";

type Post = { title: string; category: string };

const posts: Post[] = [
  { title: "Post A", category: "news" },
  { title: "Post B", category: "tech" },
  { title: "Post C", category: "news" },
  { title: "Post D", category: "design" },
  { title: "Post E", category: "tech" },
];

describe("groupItems", () => {
  it("groups items by key function", () => {
    const map = groupItems(posts, (p) => p.category);
    expect(map.size).toBe(3);
    expect(map.get("news")).toHaveLength(2);
    expect(map.get("tech")).toHaveLength(2);
    expect(map.get("design")).toHaveLength(1);
  });

  it("returns an empty map for empty input", () => {
    const map = groupItems([], (p: Post) => p.category);
    expect(map.size).toBe(0);
  });

  it("handles single-item groups", () => {
    const map = groupItems(posts, (p) => p.title);
    expect(map.size).toBe(5);
  });
});

describe("groupMapToPages", () => {
  it("converts map to sorted pages (asc)", () => {
    const map = groupItems(posts, (p) => p.category);
    const pages = groupMapToPages(map, "asc");
    expect(pages[0].group).toBe("design");
    expect(pages[1].group).toBe("news");
    expect(pages[2].group).toBe("tech");
  });

  it("converts map to sorted pages (desc)", () => {
    const map = groupItems(posts, (p) => p.category);
    const pages = groupMapToPages(map, "desc");
    expect(pages[0].group).toBe("tech");
  });

  it("preserves insertion order when sortGroups is none", () => {
    const map = groupItems(posts, (p) => p.category);
    const pages = groupMapToPages(map, "none");
    expect(pages).toHaveLength(3);
  });

  it("includes correct count per group", () => {
    const map = groupItems(posts, (p) => p.category);
    const pages = groupMapToPages(map);
    const news = pages.find((p) => p.group === "news");
    expect(news?.count).toBe(2);
  });
});

describe("getGroupKeys", () => {
  it("returns all group keys", () => {
    const map = groupItems(posts, (p) => p.category);
    const keys = getGroupKeys(map);
    expect(keys).toContain("news");
    expect(keys).toContain("tech");
    expect(keys).toContain("design");
    expect(keys).toHaveLength(3);
  });
});
