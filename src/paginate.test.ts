import { paginate, PaginateOptions } from './paginate';

describe('paginate', () => {
  const baseOptions: PaginateOptions = {
    totalItems: 50,
    pageSize: 10,
    currentPage: 1,
    basePath: '/blog',
  };

  it('calculates totalPages correctly', () => {
    const result = paginate(baseOptions);
    expect(result.totalPages).toBe(5);
  });

  it('rounds up totalPages for uneven division', () => {
    const result = paginate({ ...baseOptions, totalItems: 45 });
    expect(result.totalPages).toBe(5);
  });

  it('returns hasPreviousPage=false on first page', () => {
    const result = paginate({ ...baseOptions, currentPage: 1 });
    expect(result.hasPreviousPage).toBe(false);
    expect(result.previousPage).toBeNull();
  });

  it('returns hasNextPage=false on last page', () => {
    const result = paginate({ ...baseOptions, currentPage: 5 });
    expect(result.hasNextPage).toBe(false);
    expect(result.nextPage).toBeNull();
  });

  it('returns correct previous and next page numbers', () => {
    const result = paginate({ ...baseOptions, currentPage: 3 });
    expect(result.previousPage).toBe(2);
    expect(result.nextPage).toBe(4);
  });

  it('marks the correct page as current', () => {
    const result = paginate({ ...baseOptions, currentPage: 3 });
    const currentPages = result.pages.filter((p) => p.isCurrent);
    expect(currentPages).toHaveLength(1);
    expect(currentPages[0].pageNumber).toBe(3);
  });

  it('generates correct URL for page 1', () => {
    const result = paginate({ ...baseOptions, currentPage: 1 });
    expect(result.pages[0].url).toBe('/blog/');
  });

  it('generates correct URL for pages beyond 1', () => {
    const result = paginate({ ...baseOptions, currentPage: 2 });
    expect(result.pages[1].url).toBe('/blog/page/2/');
  });

  it('handles basePath with trailing slash', () => {
    const result = paginate({ ...baseOptions, basePath: '/blog/', currentPage: 2 });
    expect(result.pages[1].url).toBe('/blog/page/2/');
  });

  it('throws RangeError for invalid pageSize', () => {
    expect(() => paginate({ ...baseOptions, pageSize: 0 })).toThrow(RangeError);
  });

  it('throws RangeError for currentPage exceeding totalPages', () => {
    expect(() => paginate({ ...baseOptions, currentPage: 10 })).toThrow(RangeError);
  });

  it('uses default basePath when not provided', () => {
    const result = paginate({ totalItems: 20, pageSize: 10, currentPage: 2 });
    expect(result.pages[1].url).toBe('/page/2/');
  });
});
