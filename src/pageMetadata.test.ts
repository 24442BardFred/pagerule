import { buildPageMetadata } from "./pageMetadata";

describe("buildPageMetadata", () => {
  it("returns correct metadata for the first page", () => {
    const meta = buildPageMetadata({
      currentPage: 1,
      totalItems: 50,
      itemsPerPage: 10,
    });

    expect(meta.currentPage).toBe(1);
    expect(meta.totalPages).toBe(5);
    expect(meta.totalItems).toBe(50);
    expect(meta.itemsPerPage).toBe(10);
    expect(meta.isFirstPage).toBe(true);
    expect(meta.isLastPage).toBe(false);
    expect(meta.hasPrevPage).toBe(false);
    expect(meta.hasNextPage).toBe(true);
    expect(meta.prevPage).toBeNull();
    expect(meta.nextPage).toBe(2);
    expect(meta.startIndex).toBe(0);
    expect(meta.endIndex).toBe(9);
  });

  it("returns correct metadata for a middle page", () => {
    const meta = buildPageMetadata({
      currentPage: 3,
      totalItems: 50,
      itemsPerPage: 10,
    });

    expect(meta.isFirstPage).toBe(false);
    expect(meta.isLastPage).toBe(false);
    expect(meta.prevPage).toBe(2);
    expect(meta.nextPage).toBe(4);
    expect(meta.startIndex).toBe(20);
    expect(meta.endIndex).toBe(29);
  });

  it("returns correct metadata for the last page", () => {
    const meta = buildPageMetadata({
      currentPage: 5,
      totalItems: 50,
      itemsPerPage: 10,
    });

    expect(meta.isFirstPage).toBe(false);
    expect(meta.isLastPage).toBe(true);
    expect(meta.hasNextPage).toBe(false);
    expect(meta.nextPage).toBeNull();
    expect(meta.prevPage).toBe(4);
    expect(meta.endIndex).toBe(49);
  });

  it("handles a partial last page correctly", () => {
    const meta = buildPageMetadata({
      currentPage: 3,
      totalItems: 25,
      itemsPerPage: 10,
    });

    expect(meta.totalPages).toBe(3);
    expect(meta.startIndex).toBe(20);
    expect(meta.endIndex).toBe(24);
  });

  it("returns totalPages of 1 when totalItems is 0", () => {
    const meta = buildPageMetadata({
      currentPage: 1,
      totalItems: 0,
      itemsPerPage: 10,
    });

    expect(meta.totalPages).toBe(1);
    expect(meta.isFirstPage).toBe(true);
    expect(meta.isLastPage).toBe(true);
  });

  it("throws when itemsPerPage is 0", () => {
    expect(() =>
      buildPageMetadata({ currentPage: 1, totalItems: 10, itemsPerPage: 0 })
    ).toThrow("itemsPerPage must be greater than 0");
  });

  it("throws when currentPage exceeds totalPages", () => {
    expect(() =>
      buildPageMetadata({ currentPage: 10, totalItems: 20, itemsPerPage: 10 })
    ).toThrow("currentPage (10) exceeds totalPages (2)");
  });

  it("throws when currentPage is 0", () => {
    expect(() =>
      buildPageMetadata({ currentPage: 0, totalItems: 20, itemsPerPage: 10 })
    ).toThrow("currentPage must be greater than 0");
  });
});
