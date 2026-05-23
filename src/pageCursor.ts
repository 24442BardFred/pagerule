/**
 * pageCursor.ts
 * Provides cursor-based pagination helpers for tracking position across pages.
 */

export interface PageCursor {
  currentPage: number;
  totalPages: number;
  hasPrev: boolean;
  hasNext: boolean;
  prevCursor: string | null;
  nextCursor: string | null;
  cursorMap: Record<number, string>;
}

/**
 * Encodes a page number into a base64 cursor string.
 */
export function encodeCursor(page: number): string {
  return Buffer.from(`page:${page}`).toString("base64");
}

/**
 * Decodes a base64 cursor string back to a page number.
 * Returns null if the cursor is invalid.
 */
export function decodeCursor(cursor: string): number | null {
  try {
    const decoded = Buffer.from(cursor, "base64").toString("utf-8");
    const match = decoded.match(/^page:(\d+)$/);
    if (!match) return null;
    const page = parseInt(match[1], 10);
    return isNaN(page) ? null : page;
  } catch {
    return null;
  }
}

/**
 * Builds a PageCursor object for the given current page and total pages.
 */
export function buildPageCursor(currentPage: number, totalPages: number): PageCursor {
  if (totalPages < 1) {
    throw new RangeError("totalPages must be at least 1");
  }
  if (currentPage < 1 || currentPage > totalPages) {
    throw new RangeError(`currentPage must be between 1 and ${totalPages}`);
  }

  const hasPrev = currentPage > 1;
  const hasNext = currentPage < totalPages;

  const cursorMap: Record<number, string> = {};
  for (let i = 1; i <= totalPages; i++) {
    cursorMap[i] = encodeCursor(i);
  }

  return {
    currentPage,
    totalPages,
    hasPrev,
    hasNext,
    prevCursor: hasPrev ? encodeCursor(currentPage - 1) : null,
    nextCursor: hasNext ? encodeCursor(currentPage + 1) : null,
    cursorMap,
  };
}
