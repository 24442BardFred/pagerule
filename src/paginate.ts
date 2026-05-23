export interface PaginateOptions {
  /** Total number of items to paginate */
  totalItems: number;
  /** Number of items per page */
  pageSize: number;
  /** Current page number (1-based) */
  currentPage: number;
  /** Base URL path for generating page links */
  basePath?: string;
}

export interface PaginationResult {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  previousPage: number | null;
  nextPage: number | null;
  pages: PageInfo[];
}

export interface PageInfo {
  pageNumber: number;
  url: string;
  isCurrent: boolean;
}

export function paginate(options: PaginateOptions): PaginationResult {
  const { totalItems, pageSize, currentPage, basePath = '/' } = options;

  if (pageSize <= 0) {
    throw new RangeError('pageSize must be greater than 0');
  }

  if (currentPage <= 0) {
    throw new RangeError('currentPage must be greater than 0');
  }

  const totalPages = Math.ceil(totalItems / pageSize);

  if (currentPage > totalPages && totalPages > 0) {
    throw new RangeError(`currentPage (${currentPage}) exceeds totalPages (${totalPages})`);
  }

  const hasPreviousPage = currentPage > 1;
  const hasNextPage = currentPage < totalPages;

  const normalizedBase = basePath.endsWith('/') ? basePath.slice(0, -1) : basePath;

  const buildUrl = (page: number): string =>
    page === 1 ? `${normalizedBase}/` : `${normalizedBase}/page/${page}/`;

  const pages: PageInfo[] = Array.from({ length: totalPages }, (_, i) => {
    const pageNumber = i + 1;
    return {
      pageNumber,
      url: buildUrl(pageNumber),
      isCurrent: pageNumber === currentPage,
    };
  });

  return {
    currentPage,
    totalPages,
    pageSize,
    totalItems,
    hasPreviousPage,
    hasNextPage,
    previousPage: hasPreviousPage ? currentPage - 1 : null,
    nextPage: hasNextPage ? currentPage + 1 : null,
    pages,
  };
}
