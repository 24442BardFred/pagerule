/**
 * pageCounter.ts
 * Utilities for counting and tracking pagination statistics.
 */

export interface PageCounterStats {
  totalItems: number;
  totalPages: number;
  itemsOnCurrentPage: number;
  firstItemIndex: number;
  lastItemIndex: number;
  pageSize: number;
  currentPage: number;
}

export interface PageCounterOptions {
  totalItems: number;
  pageSize: number;
  currentPage: number;
  itemsOnCurrentPage?: number;
}

/**
 * Builds a stats object describing item counts and indices for a given page.
 */
export function buildPageCounter(options: PageCounterOptions): PageCounterStats {
  const { totalItems, pageSize, currentPage } = options;

  if (pageSize <= 0) throw new RangeError("pageSize must be greater than 0");
  if (currentPage < 1) throw new RangeError("currentPage must be at least 1");
  if (totalItems < 0) throw new RangeError("totalItems cannot be negative");

  const totalPages = totalItems === 0 ? 1 : Math.ceil(totalItems / pageSize);
  const firstItemIndex = (currentPage - 1) * pageSize + 1;
  const rawLastIndex = currentPage * pageSize;
  const lastItemIndex = Math.min(rawLastIndex, totalItems);
  const itemsOnCurrentPage =
    options.itemsOnCurrentPage !== undefined
      ? options.itemsOnCurrentPage
      : Math.max(0, lastItemIndex - firstItemIndex + 1);

  return {
    totalItems,
    totalPages,
    itemsOnCurrentPage,
    firstItemIndex: totalItems === 0 ? 0 : firstItemIndex,
    lastItemIndex: totalItems === 0 ? 0 : lastItemIndex,
    pageSize,
    currentPage,
  };
}

/**
 * Returns a human-readable label for the current page range.
 * e.g. "Showing 11–20 of 53 items"
 */
export function formatPageCounter(stats: PageCounterStats): string {
  if (stats.totalItems === 0) {
    return "No items to display";
  }
  return `Showing ${stats.firstItemIndex}\u2013${stats.lastItemIndex} of ${stats.totalItems} items`;
}
