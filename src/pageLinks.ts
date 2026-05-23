/**
 * pageLinks.ts
 * Builds rel link descriptors (first, prev, next, last) for a paginated result.
 * Useful for HTTP Link headers and HTML <link> tags.
 */

export interface PageLinks {
  first: string | null;
  prev: string | null;
  next: string | null;
  last: string | null;
}

export interface PageLinksInput {
  currentPage: number;
  totalPages: number;
  buildUrl: (page: number) => string;
}

/**
 * Builds a set of navigational link URLs for the given page context.
 */
export function buildPageLinks(input: PageLinksInput): PageLinks {
  const { currentPage, totalPages, buildUrl } = input;

  if (totalPages < 1) {
    return { first: null, prev: null, next: null, last: null };
  }

  return {
    first: currentPage > 1 ? buildUrl(1) : null,
    prev: currentPage > 1 ? buildUrl(currentPage - 1) : null,
    next: currentPage < totalPages ? buildUrl(currentPage + 1) : null,
    last: currentPage < totalPages ? buildUrl(totalPages) : null,
  };
}

/**
 * Serializes a PageLinks object into an HTTP Link header string.
 * Only includes non-null links.
 */
export function serializeLinksHeader(links: PageLinks): string {
  const entries: string[] = [];

  if (links.first) entries.push(`<${links.first}>; rel="first"`);
  if (links.prev) entries.push(`<${links.prev}>; rel="prev"`);
  if (links.next) entries.push(`<${links.next}>; rel="next"`);
  if (links.last) entries.push(`<${links.last}>; rel="last"`);

  return entries.join(", ");
}
