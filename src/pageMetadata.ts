/**
 * Builds metadata for a given page in a paginated collection.
 */
export interface PageMetadata {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  nextPage: number | null;
  prevPage: number | null;
  isFirstPage: boolean;
  isLastPage: boolean;
  startIndex: number;
  endIndex: number;
}

export interface PageMetadataOptions {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
}

/**
 * Builds a metadata object describing the current page's position
 * within the full paginated set.
 *
 * @param options - Page metadata options
 * @returns PageMetadata object
 */
export function buildPageMetadata(options: PageMetadataOptions): PageMetadata {
  const { currentPage, totalItems, itemsPerPage } = options;

  if (itemsPerPage <= 0) {
    throw new Error("itemsPerPage must be greater than 0");
  }

  if (currentPage <= 0) {
    throw new Error("currentPage must be greater than 0");
  }

  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));

  if (currentPage > totalPages) {
    throw new Error(
      `currentPage (${currentPage}) exceeds totalPages (${totalPages})`
    );
  }

  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages;
  const hasPrevPage = !isFirstPage;
  const hasNextPage = !isLastPage;

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage - 1, totalItems - 1);

  return {
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    hasNextPage,
    hasPrevPage,
    nextPage: hasNextPage ? currentPage + 1 : null,
    prevPage: hasPrevPage ? currentPage - 1 : null,
    isFirstPage,
    isLastPage,
    startIndex,
    endIndex,
  };
}
