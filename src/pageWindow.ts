/**
 * pageWindow.ts
 * Generates a sliding window of visible page numbers for pagination UI.
 */

export interface PageWindowOptions {
  currentPage: number;
  totalPages: number;
  windowSize?: number;
  showEdges?: boolean;
}

export interface PageWindowResult {
  pages: (number | null)[];
  hasPrevEllipsis: boolean;
  hasNextEllipsis: boolean;
}

/**
 * Builds a windowed array of page numbers centered around the current page.
 * Null values represent ellipsis gaps.
 */
export function buildPageWindow(options: PageWindowOptions): PageWindowResult {
  const { currentPage, totalPages, windowSize = 5, showEdges = true } = options;

  if (totalPages <= 0) return { pages: [], hasPrevEllipsis: false, hasNextEllipsis: false };

  const half = Math.floor(windowSize / 2);
  let start = Math.max(1, currentPage - half);
  let end = Math.min(totalPages, start + windowSize - 1);

  if (end - start + 1 < windowSize) {
    start = Math.max(1, end - windowSize + 1);
  }

  const pages: (number | null)[] = [];

  const hasPrevEllipsis = showEdges && start > 2;
  const hasNextEllipsis = showEdges && end < totalPages - 1;

  if (showEdges && start > 1) {
    pages.push(1);
    if (hasPrevEllipsis) pages.push(null);
  }

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  if (showEdges && end < totalPages) {
    if (hasNextEllipsis) pages.push(null);
    pages.push(totalPages);
  }

  return { pages, hasPrevEllipsis, hasNextEllipsis };
}
