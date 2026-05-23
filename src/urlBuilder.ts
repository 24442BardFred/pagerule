/**
 * Builds paginated URLs based on a base path and page number.
 * Supports customizable patterns for first-page and subsequent pages.
 */

export interface UrlBuilderOptions {
  /** Base path for the paginated route, e.g. "/posts" */
  basePath: string;
  /** Pattern for page URLs beyond the first. Use ":page" as placeholder. Default: "/page/:page" */
  pagePattern?: string;
  /** Whether the first page should use the base path without a page suffix. Default: true */
  cleanFirstPage?: boolean;
  /** Optional trailing slash enforcement */
  trailingSlash?: boolean;
}

/**
 * Builds a URL for a given page number.
 */
export function buildPageUrl(page: number, options: UrlBuilderOptions): string {
  const {
    basePath,
    pagePattern = "/page/:page",
    cleanFirstPage = true,
    trailingSlash = false,
  } = options;

  if (page < 1) {
    throw new RangeError(`Page number must be >= 1, got ${page}`);
  }

  const normalizedBase = basePath.replace(/\/+$/, "");

  let url: string;

  if (page === 1 && cleanFirstPage) {
    url = normalizedBase || "/";
  } else {
    const pageSuffix = pagePattern.replace(":page", String(page));
    url = `${normalizedBase}${pageSuffix}`;
  }

  if (trailingSlash && !url.endsWith("/")) {
    url = `${url}/`;
  } else if (!trailingSlash && url !== "/" && url.endsWith("/")) {
    url = url.replace(/\/+$/, "");
  }

  return url;
}

/**
 * Builds a full map of page numbers to URLs for all pages.
 */
export function buildPageUrls(
  totalPages: number,
  options: UrlBuilderOptions
): Record<number, string> {
  if (totalPages < 1) {
    throw new RangeError(`totalPages must be >= 1, got ${totalPages}`);
  }

  const urls: Record<number, string> = {};
  for (let page = 1; page <= totalPages; page++) {
    urls[page] = buildPageUrl(page, options);
  }
  return urls;
}
