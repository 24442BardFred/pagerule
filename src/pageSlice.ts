/**
 * pageSlice.ts
 * Utility for slicing a flat array of items into page-sized chunks.
 */

export interface PageSliceOptions {
  /** Total list of items to paginate */
  items: unknown[];
  /** Current page number (1-based) */
  currentPage: number;
  /** Number of items per page */
  pageSize: number;
}

export interface PageSliceResult<T> {
  /** Items belonging to the current page */
  items: T[];
  /** Total number of items across all pages */
  totalItems: number;
  /** Total number of pages */
  totalPages: number;
  /** Current page number (1-based) */
  currentPage: number;
  /** Index of the first item on this page (0-based, relative to full list) */
  startIndex: number;
  /** Index of the last item on this page (0-based, relative to full list) */
  endIndex: number;
}

/**
 * Slices an array of items into a single page's worth of results.
 *
 * @param options - Slice configuration
 * @returns A PageSliceResult containing the page's items and metadata
 * @throws {RangeError} if pageSize < 1 or currentPage < 1
 */
export function buildPageSlice<T>(options: PageSliceOptions): PageSliceResult<T> {
  const { items, currentPage, pageSize } = options;

  if (pageSize < 1) {
    throw new RangeError(`pageSize must be at least 1, got ${pageSize}`);
  }

  if (currentPage < 1) {
    throw new RangeError(`currentPage must be at least 1, got ${currentPage}`);
  }

  const totalItems = items.length;
  const totalPages = totalItems === 0 ? 1 : Math.ceil(totalItems / pageSize);

  const clampedPage = Math.min(currentPage, totalPages);
  const startIndex = (clampedPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize - 1, totalItems - 1);

  const pageItems = totalItems === 0 ? [] : (items as T[]).slice(startIndex, endIndex + 1);

  return {
    items: pageItems,
    totalItems,
    totalPages,
    currentPage: clampedPage,
    startIndex: totalItems === 0 ? 0 : startIndex,
    endIndex: totalItems === 0 ? 0 : endIndex,
  };
}
