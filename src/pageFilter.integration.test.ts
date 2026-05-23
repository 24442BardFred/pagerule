import { describe, it, expect } from "vitest";
import { buildFilterConfig, applyFilterConfig } from "./pageFilter";
import { paginate } from "./paginate";

interface Article {
  title: string;
  views: number;
  published: boolean;
}

const articles: Article[] = Array.from({ length: 20 }, (_, i) => ({
  title: `Article ${i + 1}`,
  views: (i + 1) * 10,
  published: i % 2 === 0,
}));

describe("pageFilter + paginate integration", () => {
  it("paginates only published articles", () => {
    const config = buildFilterConfig<Article>([
      { field: "published", operator: "eq", value: true },
    ]);
    const filtered = applyFilterConfig(articles, config);
    expect(filtered).toHaveLength(10);

    const page = paginate(filtered, { page: 1, pageSize: 4 });
    expect(page.items).toHaveLength(4);
    expect(page.totalItems).toBe(10);
    expect(page.totalPages).toBe(3);
  });

  it("paginates high-view articles across multiple pages", () => {
    const config = buildFilterConfig<Article>([
      { field: "views", operator: "gte", value: 100 },
    ]);
    const filtered = applyFilterConfig(articles, config);
    expect(filtered).toHaveLength(11);

    const page1 = paginate(filtered, { page: 1, pageSize: 5 });
    const page2 = paginate(filtered, { page: 2, pageSize: 5 });

    expect(page1.items).toHaveLength(5);
    expect(page2.items).toHaveLength(5);
    expect(page1.hasNextPage).toBe(true);
    expect(page2.hasNextPage).toBe(true);
  });

  it("returns empty pagination when no items match", () => {
    const config = buildFilterConfig<Article>([
      { field: "views", operator: "gt", value: 9999 },
    ]);
    const filtered = applyFilterConfig(articles, config);
    expect(filtered).toHaveLength(0);

    const page = paginate(filtered, { page: 1, pageSize: 10 });
    expect(page.totalItems).toBe(0);
    expect(page.totalPages).toBe(0);
    expect(page.items).toHaveLength(0);
  });
});
