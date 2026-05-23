import { buildPageWindow } from "./pageWindow";

describe("buildPageWindow", () => {
  it("returns empty result for zero total pages", () => {
    const result = buildPageWindow({ currentPage: 1, totalPages: 0 });
    expect(result.pages).toEqual([]);
    expect(result.hasPrevEllipsis).toBe(false);
    expect(result.hasNextEllipsis).toBe(false);
  });

  it("returns all pages when total is within window size", () => {
    const result = buildPageWindow({ currentPage: 2, totalPages: 4, windowSize: 5 });
    expect(result.pages).toEqual([1, 2, 3, 4]);
    expect(result.hasPrevEllipsis).toBe(false);
    expect(result.hasNextEllipsis).toBe(false);
  });

  it("shows next ellipsis when far from end", () => {
    const result = buildPageWindow({ currentPage: 1, totalPages: 20, windowSize: 5 });
    expect(result.pages[0]).toBe(1);
    expect(result.hasNextEllipsis).toBe(true);
    expect(result.pages[result.pages.length - 1]).toBe(20);
    expect(result.pages).toContain(null);
  });

  it("shows prev ellipsis when far from start", () => {
    const result = buildPageWindow({ currentPage: 18, totalPages: 20, windowSize: 5 });
    expect(result.hasPrevEllipsis).toBe(true);
    expect(result.pages[0]).toBe(1);
    expect(result.pages[result.pages.length - 1]).toBe(20);
  });

  it("shows both ellipses when in the middle", () => {
    const result = buildPageWindow({ currentPage: 10, totalPages: 20, windowSize: 5 });
    expect(result.hasPrevEllipsis).toBe(true);
    expect(result.hasNextEllipsis).toBe(true);
    const nullCount = result.pages.filter((p) => p === null).length;
    expect(nullCount).toBe(2);
  });

  it("respects showEdges: false", () => {
    const result = buildPageWindow({ currentPage: 10, totalPages: 20, windowSize: 5, showEdges: false });
    expect(result.pages).not.toContain(null);
    expect(result.pages.length).toBe(5);
  });

  it("clamps window to start correctly", () => {
    const result = buildPageWindow({ currentPage: 1, totalPages: 10, windowSize: 5 });
    expect(result.pages).toContain(1);
    expect(result.pages).toContain(5);
  });

  it("clamps window to end correctly", () => {
    const result = buildPageWindow({ currentPage: 10, totalPages: 10, windowSize: 5 });
    expect(result.pages).toContain(10);
    expect(result.pages).toContain(6);
  });
});
