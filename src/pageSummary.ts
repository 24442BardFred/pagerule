export interface PageSummary {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  startItem: number;
  endItem: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  isFirstPage: boolean;
  isLastPage: boolean;
}

export interface PageSummaryInput {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
}

export function buildPageSummary(input: PageSummaryInput): PageSummary {
  const { currentPage, totalPages, totalItems, pageSize } = input;

  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  return {
    currentPage,
    totalPages,
    totalItems,
    pageSize,
    startItem,
    endItem,
    hasNextPage: currentPage < totalPages,
    hasPreviousPage: currentPage > 1,
    isFirstPage: currentPage === 1,
    isLastPage: currentPage === totalPages || totalPages === 0,
  };
}

export function formatPageSummary(summary: PageSummary): string {
  if (summary.totalItems === 0) {
    return `No items found.`;
  }
  return `Showing ${summary.startItem}–${summary.endItem} of ${summary.totalItems} items (page ${summary.currentPage} of ${summary.totalPages})`;
}
