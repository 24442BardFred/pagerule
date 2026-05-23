import { buildPageSummary, formatPageSummary } from "./pageSummary";

describe("buildPageSummary", () => {
  it("returns correct summary for a middle page", () => {
    const summary = buildPageSummary({
      currentPage: 2,
      totalPages: 5,
      totalItems: 50,
      pageSize: 10,
    });
    expect(summary.startItem).toBe(11);
    expect(summary.endItem).toBe(20);
    expect(summary.hasNextPage).toBe(true);
    expect(summary.hasPreviousPage).toBe(true);
    expect(summary.isFirstPage).toBe(false);
    expect(summary.isLastPage).toBe(false);
  });

  it("returns correct summary for the first page", () => {
    const summary = buildPageSummary({
      currentPage: 1,
      totalPages: 3,
      totalItems: 25,
      pageSize: 10,
    });
    expect(summary.startItem).toBe(1);
    expect(summary.endItem).toBe(10);
    expect(summary.isFirstPage).toBe(true);
    expect(summary.hasPreviousPage).toBe(false);
    expect(summary.hasNextPage).toBe(true);
  });

  it("returns correct summary for the last page with partial items", () => {
    const summary = buildPageSummary({
      currentPage: 3,
      totalPages: 3,
      totalItems: 25,
      pageSize: 10,
    });
    expect(summary.startItem).toBe(21);
    expect(summary.endItem).toBe(25);
    expect(summary.isLastPage).toBe(true);
    expect(summary.hasNextPage).toBe(false);
  });

  it("handles zero total items", () => {
    const summary = buildPageSummary({
      currentPage: 1,
      totalPages: 0,
      totalItems: 0,
      pageSize: 10,
    });
    expect(summary.startItem).toBe(0);
    expect(summary.endItem).toBe(0);
    expect(summary.isLastPage).toBe(true);
    expect(summary.isFirstPage).toBe(true);
  });
});

describe("formatPageSummary", () => {
  it("formats a standard summary string", () => {
    const summary = buildPageSummary({
      currentPage: 2,
      totalPages: 5,
      totalItems: 50,
      pageSize: 10,
    });
    expect(formatPageSummary(summary)).toBe(
      "Showing 11–20 of 50 items (page 2 of 5)"
    );
  });

  it("returns a no-items message when totalItems is 0", () => {
    const summary = buildPageSummary({
      currentPage: 1,
      totalPages: 0,
      totalItems: 0,
      pageSize: 10,
    });
    expect(formatPageSummary(summary)).toBe("No items found.");
  });
});
