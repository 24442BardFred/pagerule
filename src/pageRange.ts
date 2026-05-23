/**
 * Generates a range of page numbers for pagination controls,
 * optionally with ellipsis markers for large page sets.
 */

export interface PageRangeOptions {
  /** Total number of pages */
  totalPages: number;
  /** Currently active page (1-indexed) */
  currentPage: number;
  /** Number of pages to show on each side of the current page */
  siblings?: number;
  /** Number of pages to always show at the start and end */
  boundaryCount?: number;
}

export type PageRangeItem = number | 'ellipsis';

/**
 * Returns an array of page numbers and ellipsis markers for rendering
 * a pagination control.
 *
 * @example
 * buildPageRange({ totalPages: 10, currentPage: 5 })
 * // => [1, 'ellipsis', 4, 5, 6, 'ellipsis', 10]
 */
export function buildPageRange(options: PageRangeOptions): PageRangeItem[] {
  const { totalPages, currentPage, siblings = 1, boundaryCount = 1 } = options;

  if (totalPages <= 0) return [];
  if (currentPage < 1 || currentPage > totalPages) {
    throw new RangeError(
      `currentPage must be between 1 and ${totalPages}, got ${currentPage}`
    );
  }

  const range = (start: number, end: number): number[] =>
    Array.from({ length: end - start + 1 }, (_, i) => start + i);

  const startPages = range(1, Math.min(boundaryCount, totalPages));
  const endPages = range(
    Math.max(totalPages - boundaryCount + 1, boundaryCount + 1),
    totalPages
  );

  const siblingsStart = Math.max(
    Math.min(currentPage - siblings, totalPages - boundaryCount - siblings * 2 - 1),
    boundaryCount + 2
  );
  const siblingsEnd = Math.min(
    Math.max(currentPage + siblings, boundaryCount + siblings * 2 + 2),
    endPages.length > 0 ? endPages[0] - 2 : totalPages - 1
  );

  const items: PageRangeItem[] = [];

  for (const p of startPages) items.push(p);

  if (siblingsStart > boundaryCount + 2) {
    items.push('ellipsis');
  } else if (boundaryCount + 1 < siblingsStart) {
    items.push(boundaryCount + 1);
  }

  for (const p of range(siblingsStart, siblingsEnd)) items.push(p);

  if (siblingsEnd < totalPages - boundaryCount - 1) {
    items.push('ellipsis');
  } else if (siblingsEnd < totalPages - boundaryCount) {
    items.push(totalPages - boundaryCount);
  }

  for (const p of endPages) items.push(p);

  // Deduplicate while preserving order
  const seen = new Set<PageRangeItem>();
  return items.filter((item) => {
    if (item === 'ellipsis') return true;
    if (seen.has(item)) return false;
    seen.add(item);
    return true;
  });
}
