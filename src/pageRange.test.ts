import { describe, it, expect } from 'vitest';
import { buildPageRange } from './pageRange';

describe('buildPageRange', () => {
  it('returns empty array when totalPages is 0', () => {
    expect(buildPageRange({ totalPages: 0, currentPage: 0 })).toEqual([]);
  });

  it('throws when currentPage is out of range', () => {
    expect(() =>
      buildPageRange({ totalPages: 5, currentPage: 6 })
    ).toThrow(RangeError);

    expect(() =>
      buildPageRange({ totalPages: 5, currentPage: 0 })
    ).toThrow(RangeError);
  });

  it('returns all pages when totalPages is small', () => {
    expect(buildPageRange({ totalPages: 3, currentPage: 2 })).toEqual([1, 2, 3]);
  });

  it('includes ellipsis at end when current page is near start', () => {
    const result = buildPageRange({ totalPages: 10, currentPage: 1 });
    expect(result[0]).toBe(1);
    expect(result).toContain('ellipsis');
    expect(result[result.length - 1]).toBe(10);
  });

  it('includes ellipsis at start when current page is near end', () => {
    const result = buildPageRange({ totalPages: 10, currentPage: 10 });
    expect(result[0]).toBe(1);
    expect(result).toContain('ellipsis');
    expect(result[result.length - 1]).toBe(10);
  });

  it('includes ellipsis on both sides for middle pages', () => {
    const result = buildPageRange({ totalPages: 10, currentPage: 5 });
    expect(result[0]).toBe(1);
    expect(result[result.length - 1]).toBe(10);
    const ellipsisCount = result.filter((r) => r === 'ellipsis').length;
    expect(ellipsisCount).toBe(2);
  });

  it('respects siblings option', () => {
    const result = buildPageRange({
      totalPages: 20,
      currentPage: 10,
      siblings: 2,
    });
    const nums = result.filter((r): r is number => r !== 'ellipsis');
    expect(nums).toContain(8);
    expect(nums).toContain(9);
    expect(nums).toContain(10);
    expect(nums).toContain(11);
    expect(nums).toContain(12);
  });

  it('respects boundaryCount option', () => {
    const result = buildPageRange({
      totalPages: 20,
      currentPage: 10,
      boundaryCount: 2,
    });
    const nums = result.filter((r): r is number => r !== 'ellipsis');
    expect(nums).toContain(1);
    expect(nums).toContain(2);
    expect(nums).toContain(19);
    expect(nums).toContain(20);
  });

  it('does not produce duplicate page numbers', () => {
    const result = buildPageRange({ totalPages: 10, currentPage: 3 });
    const nums = result.filter((r): r is number => r !== 'ellipsis');
    expect(nums.length).toBe(new Set(nums).size);
  });
});
