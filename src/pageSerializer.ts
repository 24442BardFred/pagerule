import { PaginationResult } from './paginate';

export type SerializedPage<T> = {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  items: T[];
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  previousPage: number | null;
  nextPage: number | null;
  pageUrl: string;
  previousPageUrl: string | null;
  nextPageUrl: string | null;
  pageRange: number[];
};

/**
 * Serializes a PaginationResult into a plain object suitable for
 * JSON output, template rendering, or passing to static site generators.
 */
export function serializePage<T>(result: PaginationResult<T>): SerializedPage<T> {
  const { metadata, slice, navigator, range } = result;

  return {
    currentPage: metadata.currentPage,
    totalPages: metadata.totalPages,
    totalItems: metadata.totalItems,
    itemsPerPage: metadata.itemsPerPage,
    items: slice.items,
    hasPreviousPage: navigator.hasPreviousPage,
    hasNextPage: navigator.hasNextPage,
    previousPage: navigator.previousPage,
    nextPage: navigator.nextPage,
    pageUrl: navigator.currentUrl,
    previousPageUrl: navigator.previousPageUrl,
    nextPageUrl: navigator.nextPageUrl,
    pageRange: range.pages,
  };
}

/**
 * Serializes all pages from a PaginationResult array into plain objects.
 */
export function serializePages<T>(results: PaginationResult<T>[]): SerializedPage<T>[] {
  return results.map(serializePage);
}
