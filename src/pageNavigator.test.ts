import { buildPageNavigator } from "./pageNavigator";

describe("buildPageNavigator", () => {
  const base = "/blog";

  it("returns null prevUrl on first page", () => {
    const nav = buildPageNavigator({ currentPage: 1, totalPages: 10, baseUrl: base });
    expect(nav.prevUrl).toBeNull();
    expect(nav.nextUrl).not.toBeNull();
  });

  it("returns null nextUrl on last page", () => {
    const nav = buildPageNavigator({ currentPage: 10, totalPages: 10, baseUrl: base });
    expect(nav.nextUrl).toBeNull();
    expect(nav.prevUrl).not.toBeNull();
  });

  it("builds correct prevUrl and nextUrl", () => {
    const nav = buildPageNavigator({ currentPage: 5, totalPages: 10, baseUrl: base });
    expect(nav.prevUrl).toContain("4");
    expect(nav.nextUrl).toContain("6");
  });

  it("builds firstUrl and lastUrl", () => {
    const nav = buildPageNavigator({ currentPage: 5, totalPages: 10, baseUrl: base });
    expect(nav.firstUrl).toContain("1");
    expect(nav.lastUrl).toContain("10");
  });

  it("includes window with correct currentPage", () => {
    const nav = buildPageNavigator({ currentPage: 5, totalPages: 10, baseUrl: base, windowSize: 3 });
    expect(nav.window.pages).toContain(5);
  });

  it("maps page numbers to URLs in pageUrls", () => {
    const nav = buildPageNavigator({ currentPage: 1, totalPages: 5, baseUrl: base, showEdges: false });
    nav.pageUrls.forEach((url) => {
      expect(typeof url).toBe("string");
    });
  });

  it("maps null pages to null in pageUrls", () => {
    const nav = buildPageNavigator({ currentPage: 10, totalPages: 20, baseUrl: base, windowSize: 3 });
    const nullPages = nav.window.pages.filter((p) => p === null);
    const nullUrls = nav.pageUrls.filter((u) => u === null);
    expect(nullUrls.length).toBe(nullPages.length);
  });

  it("appends urlSuffix correctly", () => {
    const nav = buildPageNavigator({ currentPage: 2, totalPages: 5, baseUrl: base, urlSuffix: "/" });
    expect(nav.prevUrl).toMatch(/\/$/); 
  });
});
