import { buildPageUrl, buildPageUrls } from "./urlBuilder";

describe("buildPageUrl", () => {
  const base = { basePath: "/posts" };

  it("returns the base path for page 1 when cleanFirstPage is true", () => {
    expect(buildPageUrl(1, base)).toBe("/posts");
  });

  it("returns a numbered URL for page 2+", () => {
    expect(buildPageUrl(2, base)).toBe("/posts/page/2");
    expect(buildPageUrl(5, base)).toBe("/posts/page/5");
  });

  it("includes page number for page 1 when cleanFirstPage is false", () => {
    expect(buildPageUrl(1, { ...base, cleanFirstPage: false })).toBe("/posts/page/1");
  });

  it("supports a custom pagePattern", () => {
    expect(
      buildPageUrl(3, { ...base, pagePattern: "/:page" })
    ).toBe("/posts/3");
  });

  it("appends trailing slash when trailingSlash is true", () => {
    expect(buildPageUrl(1, { ...base, trailingSlash: true })).toBe("/posts/");
    expect(buildPageUrl(2, { ...base, trailingSlash: true })).toBe("/posts/page/2/");
  });

  it("handles root basePath", () => {
    expect(buildPageUrl(1, { basePath: "/" })).toBe("/");
    expect(buildPageUrl(2, { basePath: "/" })).toBe("/page/2");
  });

  it("throws a RangeError for page < 1", () => {
    expect(() => buildPageUrl(0, base)).toThrow(RangeError);
    expect(() => buildPageUrl(-1, base)).toThrow(RangeError);
  });
});

describe("buildPageUrls", () => {
  it("returns a map of all page URLs", () => {
    const urls = buildPageUrls(3, { basePath: "/blog" });
    expect(urls).toEqual({
      1: "/blog",
      2: "/blog/page/2",
      3: "/blog/page/3",
    });
  });

  it("returns a single entry for totalPages = 1", () => {
    const urls = buildPageUrls(1, { basePath: "/news" });
    expect(urls).toEqual({ 1: "/news" });
  });

  it("throws a RangeError for totalPages < 1", () => {
    expect(() => buildPageUrls(0, { basePath: "/posts" })).toThrow(RangeError);
  });
});
