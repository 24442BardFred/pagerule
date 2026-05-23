import {
  defaultSlugify,
  buildPageAnchor,
  buildPageAnchors,
  serializeAnchorsToHtml,
} from "./pageAnchor";

describe("defaultSlugify", () => {
  it("lowercases and replaces spaces with hyphens", () => {
    expect(defaultSlugify("Hello World")).toBe("hello-world");
  });

  it("removes special characters", () => {
    expect(defaultSlugify("Section 1: Overview!")).toBe("section-1-overview");
  });

  it("trims leading and trailing whitespace", () => {
    expect(defaultSlugify("  trimmed  ")).toBe("trimmed");
  });

  it("collapses multiple spaces", () => {
    expect(defaultSlugify("a  b   c")).toBe("a-b-c");
  });
});

describe("buildPageAnchor", () => {
  const baseOptions = { baseUrl: "https://example.com/page/1", pageNumber: 1 };

  it("builds an anchor with correct id and url", () => {
    const anchor = buildPageAnchor("Introduction", baseOptions);
    expect(anchor.id).toBe("introduction");
    expect(anchor.url).toBe("https://example.com/page/1#introduction");
    expect(anchor.label).toBe("Introduction");
    expect(anchor.pageNumber).toBe(1);
  });

  it("uses a custom slugify function when provided", () => {
    const anchor = buildPageAnchor("My Section", {
      ...baseOptions,
      slugify: (s) => s.replace(/\s/g, "_").toUpperCase(),
    });
    expect(anchor.id).toBe("MY_SECTION");
    expect(anchor.url).toContain("#MY_SECTION");
  });

  it("strips trailing slash from baseUrl", () => {
    const anchor = buildPageAnchor("test", {
      baseUrl: "https://example.com/page/2/",
      pageNumber: 2,
    });
    expect(anchor.url).toBe("https://example.com/page/2#test");
  });
});

describe("buildPageAnchors", () => {
  it("returns an anchor for each label", () => {
    const anchors = buildPageAnchors(["Alpha", "Beta", "Gamma"], {
      baseUrl: "https://example.com/page/3",
      pageNumber: 3,
    });
    expect(anchors).toHaveLength(3);
    expect(anchors[0].id).toBe("alpha");
    expect(anchors[2].pageNumber).toBe(3);
  });

  it("returns empty array for empty labels", () => {
    const anchors = buildPageAnchors([], {
      baseUrl: "https://example.com/page/1",
      pageNumber: 1,
    });
    expect(anchors).toEqual([]);
  });
});

describe("serializeAnchorsToHtml", () => {
  it("produces correct HTML for each anchor", () => {
    const anchors = buildPageAnchors(["Intro", "Details"], {
      baseUrl: "https://example.com/page/1",
      pageNumber: 1,
    });
    const html = serializeAnchorsToHtml(anchors);
    expect(html).toContain('<a href="https://example.com/page/1#intro"');
    expect(html).toContain('id="intro"');
    expect(html).toContain('data-page="1"');
    expect(html).toContain("Intro");
    expect(html).toContain("Details");
  });

  it("returns empty string for empty array", () => {
    expect(serializeAnchorsToHtml([])).toBe("");
  });
});
