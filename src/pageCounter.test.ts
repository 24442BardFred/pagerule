import { buildPageCounter, formatPageCounter, PageCounterStats } from "./pageCounter";

describe("buildPageCounter", () => {
  it("returns correct stats for a mid-range page", () => {
    const stats = buildPageCounter({ totalItems: 53, pageSize: 10, currentPage: 2 });
    expect(stats.firstItemIndex).toBe(11);
    expect(stats.lastItemIndex).toBe(20);
    expect(stats.itemsOnCurrentPage).toBe(10);
    expect(stats.totalPages).toBe(6);
    expect(stats.totalItems).toBe(53);
  });

  it("returns correct stats for the last page with fewer items", () => {
    const stats = buildPageCounter({ totalItems: 53, pageSize: 10, currentPage: 6 });
    expect(stats.firstItemIndex).toBe(51);
    expect(stats.lastItemIndex).toBe(53);
    expect(stats.itemsOnCurrentPage).toBe(3);
  });

  it("returns correct stats for the first page", () => {
    const stats = buildPageCounter({ totalItems: 20, pageSize: 10, currentPage: 1 });
    expect(stats.firstItemIndex).toBe(1);
    expect(stats.lastItemIndex).toBe(10);
    expect(stats.totalPages).toBe(2);
  });

  it("handles zero totalItems gracefully", () => {
    const stats = buildPageCounter({ totalItems: 0, pageSize: 10, currentPage: 1 });
    expect(stats.totalPages).toBe(1);
    expect(stats.firstItemIndex).toBe(0);
    expect(stats.lastItemIndex).toBe(0);
    expect(stats.itemsOnCurrentPage).toBe(0);
  });

  it("accepts an explicit itemsOnCurrentPage override", () => {
    const stats = buildPageCounter({
      totalItems: 53,
      pageSize: 10,
      currentPage: 3,
      itemsOnCurrentPage: 7,
    });
    expect(stats.itemsOnCurrentPage).toBe(7);
  });

  it("throws when pageSize is 0", () => {
    expect(() => buildPageCounter({ totalItems: 10, pageSize: 0, currentPage: 1 })).toThrow(RangeError);
  });

  it("throws when currentPage is less than 1", () => {
    expect(() => buildPageCounter({ totalItems: 10, pageSize: 5, currentPage: 0 })).toThrow(RangeError);
  });

  it("throws when totalItems is negative", () => {
    expect(() => buildPageCounter({ totalItems: -1, pageSize: 5, currentPage: 1 })).toThrow(RangeError);
  });
});

describe("formatPageCounter", () => {
  it("returns a readable range string", () => {
    const stats: PageCounterStats = buildPageCounter({ totalItems: 53, pageSize: 10, currentPage: 2 });
    expect(formatPageCounter(stats)).toBe("Showing 11\u201320 of 53 items");
  });

  it("returns a no-items message when totalItems is 0", () => {
    const stats = buildPageCounter({ totalItems: 0, pageSize: 10, currentPage: 1 });
    expect(formatPageCounter(stats)).toBe("No items to display");
  });

  it("handles single-item pages correctly", () => {
    const stats = buildPageCounter({ totalItems: 1, pageSize: 10, currentPage: 1 });
    expect(formatPageCounter(stats)).toBe("Showing 1\u20131 of 1 items");
  });
});
