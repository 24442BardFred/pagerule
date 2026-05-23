import { buildPageProgress, formatPageProgress } from "./pageProgress";

describe("buildPageProgress", () => {
  it("returns correct progress for first page", () => {
    const result = buildPageProgress({ total: 100, current: 1, pageSize: 10 });
    expect(result.currentPage).toBe(1);
    expect(result.totalPages).toBe(10);
    expect(result.startItem).toBe(1);
    expect(result.endItem).toBe(10);
    expect(result.itemsOnCurrentPage).toBe(10);
    expect(result.percentComplete).toBe(10);
    expect(result.isFirstPage).toBe(true);
    expect(result.isLastPage).toBe(false);
  });

  it("returns correct progress for last page", () => {
    const result = buildPageProgress({ total: 100, current: 10, pageSize: 10 });
    expect(result.currentPage).toBe(10);
    expect(result.endItem).toBe(100);
    expect(result.percentComplete).toBe(100);
    expect(result.isFirstPage).toBe(false);
    expect(result.isLastPage).toBe(true);
  });

  it("handles partial last page", () => {
    const result = buildPageProgress({ total: 25, current: 3, pageSize: 10 });
    expect(result.totalPages).toBe(3);
    expect(result.startItem).toBe(21);
    expect(result.endItem).toBe(25);
    expect(result.itemsOnCurrentPage).toBe(5);
  });

  it("clamps current page to valid range", () => {
    const over = buildPageProgress({ total: 30, current: 99, pageSize: 10 });
    expect(over.currentPage).toBe(3);
    const under = buildPageProgress({ total: 30, current: -5, pageSize: 10 });
    expect(under.currentPage).toBe(1);
  });

  it("handles zero total items", () => {
    const result = buildPageProgress({ total: 0, current: 1, pageSize: 10 });
    expect(result.totalItems).toBe(0);
    expect(result.startItem).toBe(0);
    expect(result.endItem).toBe(0);
    expect(result.itemsOnCurrentPage).toBe(0);
    expect(result.totalPages).toBe(1);
  });
});

describe("formatPageProgress", () => {
  it("formats a progress message correctly", () => {
    const progress = buildPageProgress({ total: 50, current: 2, pageSize: 10 });
    const result = formatPageProgress(progress);
    expect(result).toBe("Page 2 of 5 — items 11–20 of 50 (40%)");
  });

  it("returns a message for empty items", () => {
    const progress = buildPageProgress({ total: 0, current: 1, pageSize: 10 });
    expect(formatPageProgress(progress)).toBe("No items to display");
  });
});
