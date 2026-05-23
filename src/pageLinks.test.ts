import { buildPageLinks, serializeLinksHeader, PageLinks } from "./pageLinks";

const buildUrl = (page: number) => `/blog/page/${page}`;

describe("buildPageLinks", () => {
  it("returns all nulls when totalPages is 0", () => {
    const links = buildPageLinks({ currentPage: 1, totalPages: 0, buildUrl });
    expect(links).toEqual({ first: null, prev: null, next: null, last: null });
  });

  it("returns null for first and prev on the first page", () => {
    const links = buildPageLinks({ currentPage: 1, totalPages: 5, buildUrl });
    expect(links.first).toBeNull();
    expect(links.prev).toBeNull();
  });

  it("returns correct next and last on the first page", () => {
    const links = buildPageLinks({ currentPage: 1, totalPages: 5, buildUrl });
    expect(links.next).toBe("/blog/page/2");
    expect(links.last).toBe("/blog/page/5");
  });

  it("returns null for next and last on the last page", () => {
    const links = buildPageLinks({ currentPage: 5, totalPages: 5, buildUrl });
    expect(links.next).toBeNull();
    expect(links.last).toBeNull();
  });

  it("returns correct first and prev on the last page", () => {
    const links = buildPageLinks({ currentPage: 5, totalPages: 5, buildUrl });
    expect(links.first).toBe("/blog/page/1");
    expect(links.prev).toBe("/blog/page/4");
  });

  it("returns all four links on a middle page", () => {
    const links = buildPageLinks({ currentPage: 3, totalPages: 5, buildUrl });
    expect(links.first).toBe("/blog/page/1");
    expect(links.prev).toBe("/blog/page/2");
    expect(links.next).toBe("/blog/page/4");
    expect(links.last).toBe("/blog/page/5");
  });

  it("returns all nulls when totalPages is 1 and on page 1", () => {
    const links = buildPageLinks({ currentPage: 1, totalPages: 1, buildUrl });
    expect(links).toEqual({ first: null, prev: null, next: null, last: null });
  });
});

describe("serializeLinksHeader", () => {
  it("returns empty string when all links are null", () => {
    const links: PageLinks = { first: null, prev: null, next: null, last: null };
    expect(serializeLinksHeader(links)).toBe("");
  });

  it("serializes only non-null links", () => {
    const links: PageLinks = {
      first: null,
      prev: null,
      next: "/blog/page/2",
      last: "/blog/page/5",
    };
    const header = serializeLinksHeader(links);
    expect(header).toBe(`</blog/page/2>; rel="next", </blog/page/5>; rel="last"`);
  });

  it("serializes all four links in correct order", () => {
    const links: PageLinks = {
      first: "/blog/page/1",
      prev: "/blog/page/2",
      next: "/blog/page/4",
      last: "/blog/page/5",
    };
    const header = serializeLinksHeader(links);
    expect(header).toBe(
      `</blog/page/1>; rel="first", </blog/page/2>; rel="prev", </blog/page/4>; rel="next", </blog/page/5>; rel="last"`
    );
  });
});
