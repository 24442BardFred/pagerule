/**
 * pageAnchor.ts
 * Utilities for building anchor/fragment links within paginated pages.
 */

export interface PageAnchor {
  id: string;
  label: string;
  url: string;
  pageNumber: number;
}

export interface AnchorOptions {
  baseUrl: string;
  pageNumber: number;
  slugify?: (label: string) => string;
}

/**
 * Default slugify: lowercase, replace spaces/special chars with hyphens.
 */
export function defaultSlugify(label: string): string {
  return label
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-");
}

/**
 * Build a single PageAnchor given a label and options.
 */
export function buildPageAnchor(
  label: string,
  options: AnchorOptions
): PageAnchor {
  const slugify = options.slugify ?? defaultSlugify;
  const id = slugify(label);
  const url = `${options.baseUrl.replace(/\/$/, "")}#${id}`;
  return {
    id,
    label,
    url,
    pageNumber: options.pageNumber,
  };
}

/**
 * Build multiple PageAnchors from an array of labels.
 */
export function buildPageAnchors(
  labels: string[],
  options: AnchorOptions
): PageAnchor[] {
  return labels.map((label) => buildPageAnchor(label, options));
}

/**
 * Serialize anchors to an HTML fragment string (e.g. for injection into templates).
 */
export function serializeAnchorsToHtml(anchors: PageAnchor[]): string {
  return anchors
    .map(
      (a) =>
        `<a href="${a.url}" id="${a.id}" data-page="${a.pageNumber}">${a.label}</a>`
    )
    .join("\n");
}
