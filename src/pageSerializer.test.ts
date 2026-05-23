import { describe, it, expect } from 'vitest';
import { serializePage, serializePages } from './pageSerializer';
import { PaginationResult } from './paginate';

function makeMockResult(page: number, total: number): PaginationResult<string> {
  return {
    metadata: { currentPage: page, totalPages: total, totalItems: total * 5, itemsPerPage: 5 },
    slice: { items: ['a', 'b', 'c', 'd', 'e'], startIndex: (page - 1) * 5, endIndex: page * 5 - 1 },
    navigator: {
      currentUrl: `/page/${page}`,
      hasPreviousPage: page > 1,
      hasNextPage: page < total,
      previousPage: page > 1 ? page - 1 : null,
      nextPage: page < total ? page + 1 : null,
      previousPageUrl: page > 1 ? `/page/${page - 1}` : null,
      nextPageUrl: page < total ? `/page/${page + 1}` : null,
    },
    range: { pages: [1, 2, 3], hasLeftEllipsis: false, hasRightEllipsis: false },
  };
}

describe('serializePage', () => {
  it('should serialize a middle page correctly', () => {
    const result = makeMockResult(2, 3);
    const serialized = serializePage(result);

    expect(serialized.currentPage).toBe(2);
    expect(serialized.totalPages).toBe(3);
    expect(serialized.totalItems).toBe(15);
    expect(serialized.itemsPerPage).toBe(5);
    expect(serialized.items).toEqual(['a', 'b', 'c', 'd', 'e']);
    expect(serialized.hasPreviousPage).toBe(true);
    expect(serialized.hasNextPage).toBe(true);
    expect(serialized.previousPage).toBe(1);
    expect(serialized.nextPage).toBe(3);
    expect(serialized.pageUrl).toBe('/page/2');
    expect(serialized.previousPageUrl).toBe('/page/1');
    expect(serialized.nextPageUrl).toBe('/page/3');
    expect(serialized.pageRange).toEqual([1, 2, 3]);
  });

  it('should serialize the first page with no previous', () => {
    const result = makeMockResult(1, 3);
    const serialized = serializePage(result);

    expect(serialized.hasPreviousPage).toBe(false);
    expect(serialized.previousPage).toBeNull();
    expect(serialized.previousPageUrl).toBeNull();
    expect(serialized.hasNextPage).toBe(true);
  });

  it('should serialize the last page with no next', () => {
    const result = makeMockResult(3, 3);
    const serialized = serializePage(result);

    expect(serialized.hasNextPage).toBe(false);
    expect(serialized.nextPage).toBeNull();
    expect(serialized.nextPageUrl).toBeNull();
  });
});

describe('serializePages', () => {
  it('should serialize an array of results', () => {
    const results = [makeMockResult(1, 2), makeMockResult(2, 2)];
    const serialized = serializePages(results);

    expect(serialized).toHaveLength(2);
    expect(serialized[0].currentPage).toBe(1);
    expect(serialized[1].currentPage).toBe(2);
  });

  it('should return an empty array for empty input', () => {
    expect(serializePages([])).toEqual([]);
  });
});
