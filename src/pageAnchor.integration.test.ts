import { buildPageAnchors, serializeAnchorsToHtml } from "./pageAnchor";
import { buildPageUrl } from "./urlBuilder";

/**
 * Integration test: verify that pageAnchor works correctly
 * when anchor URLs are derived from urlBuilder output.
 */
describe("pageAnchor integration with urlBuilder", () => {
  const baseUrl = "https://docs.example.com/items";
  const pageSize = 10;
  const totalItems = 50;

  function getPageUrl(page: number): string {
    return buildPageUrl(baseUrl, page, { pageParam: "page" });
  }

  it("builds anchors using a URL from urlBuilder", () => {
    const pageUrl = getPageUrl(2);
    const anchors = buildPageAnchors(["Overview", "Details", "Summary"], {
      baseUrl: pageUrl,
      pageNumber: 2,
    });

    expect(anchors).toHaveLength(3);
    expect(anchors[0].url).toContain("page=2");
    expect(anchors[0].url).toContain("#overview");
    expect(anchors[1].id).toBe("details");
    expect(anchors[2].pageNumber).toBe(2);
  });

  it("serializes anchors from a real page URL to valid HTML", () => {
    const pageUrl = getPageUrl(1);
    const anchors = buildPageAnchors(["Introduction", "Getting Started"], {
      baseUrl: pageUrl,
      pageNumber: 1,
    });
    const html = serializeAnchorsToHtml(anchors);

    expect(html).toContain("introduction");
    expect(html).toContain("getting-started");
    expect(html).toContain('data-page="1"');
  });
});
