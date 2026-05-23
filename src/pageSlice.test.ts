import { buildPageSlice } from './pageSlice';

describe('buildPageSlice', () => {
  const items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  it('returns the first page of items', () => {
    const result = buildPageSlice({ items, currentPage: 1, pageSize: 3 });
    expect(result.items).toEqual([1, 2, 3]);
    expect(result.currentPage).toBe(1);
    expect(result.startIndex).toBe(0);
    expect(result.endIndex).toBe(2);
  });

  it('returns the second page of items', () => {
    const result = buildPageSlice({ items, currentPage: 2, pageSize: 3 });
    expect(result.items).toEqual([4, 5, 6]);
    expect(result.startIndex).toBe(3);
    expect(result.endIndex).toBe(5);
  });

  it('returns a partial last page', () => {
    const result = buildPageSlice({ items, currentPage: 4, pageSize: 3 });
    expect(result.items).toEqual([10]);
    expect(result.endIndex).toBe(9);
  });

  it('calculates totalPages correctly', () => {
    const result = buildPageSlice({ items, currentPage: 1, pageSize: 3 });
    expect(result.totalPages).toBe(4);
    expect(result.totalItems).toBe(10);
  });

  it('handles a pageSize equal to the total items', () => {
    const result = buildPageSlice({ items, currentPage: 1, pageSize: 10 });
    expect(result.items).toEqual(items);
    expect(result.totalPages).toBe(1);
  });

  it('clamps currentPage to totalPages when page exceeds total', () => {
    const result = buildPageSlice({ items, currentPage: 99, pageSize: 3 });
    expect(result.currentPage).toBe(4);
    expect(result.items).toEqual([10]);
  });

  it('handles an empty items array', () => {
    const result = buildPageSlice({ items: [], currentPage: 1, pageSize: 5 });
    expect(result.items).toEqual([]);
    expect(result.totalItems).toBe(0);
    expect(result.totalPages).toBe(1);
    expect(result.startIndex).toBe(0);
    expect(result.endIndex).toBe(0);
  });

  it('throws RangeError when pageSize is less than 1', () => {
    expect(() => buildPageSlice({ items, currentPage: 1, pageSize: 0 })).toThrow(RangeError);
  });

  it('throws RangeError when currentPage is less than 1', () => {
    expect(() => buildPageSlice({ items, currentPage: 0, pageSize: 5 })).toThrow(RangeError);
  });

  it('works with generic types', () => {
    const strItems = ['a', 'b', 'c', 'd'];
    const result = buildPageSlice<string>({ items: strItems, currentPage: 2, pageSize: 2 });
    expect(result.items).toEqual(['c', 'd']);
  });
});
