/**
 * Integration test: pageBreakpoint with paginate and pageWindow
 * Verifies that breakpoint-resolved pageSize and windowSize
 * produce consistent pagination output.
 */

import { resolveBreakpoint } from "./pageBreakpoint";
import { paginate } from "./paginate";
import { buildPageWindow } from "./pageWindow";

const items = Array.from({ length: 100 }, (_, i) => ({ id: i + 1 }));

describe("pageBreakpoint integration", () => {
  it("produces correct page count for xs breakpoint", () => {
    const { pageSize } = resolveBreakpoint(320);
    const pages = paginate(items, { pageSize, currentPage: 1, baseUrl: "/" });
    expect(pages.totalPages).toBe(20);
    expect(pages.items).toHaveLength(5);
  });

  it("produces correct page count for xl breakpoint", () => {
    const { pageSize } = resolveBreakpoint(1440);
    const pages = paginate(items, { pageSize, currentPage: 1, baseUrl: "/" });
    expect(pages.totalPages).toBe(2);
    expect(pages.items).toHaveLength(50);
  });

  it("window size matches breakpoint for md", () => {
    const { windowSize, pageSize } = resolveBreakpoint(900);
    const pages = paginate(items, { pageSize, currentPage: 5, baseUrl: "/" });
    const window = buildPageWindow(pages.currentPage, pages.totalPages, windowSize);
    expect(window.pages.length).toBeLessThanOrEqual(windowSize);
  });

  it("windowSize does not exceed totalPages", () => {
    const smallItems = items.slice(0, 8);
    const { pageSize, windowSize } = resolveBreakpoint(320);
    const pages = paginate(smallItems, { pageSize, currentPage: 1, baseUrl: "/" });
    const window = buildPageWindow(pages.currentPage, pages.totalPages, windowSize);
    expect(window.pages.length).toBeLessThanOrEqual(pages.totalPages);
  });
});
