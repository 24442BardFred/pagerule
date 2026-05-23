import { resolveConfig, DEFAULT_CONFIG } from './paginationConfig';

describe('resolveConfig', () => {
  it('returns a config with defaults applied', () => {
    const config = resolveConfig({ baseUrl: '/blog/page/:page' });
    expect(config.pageSize).toBe(DEFAULT_CONFIG.pageSize);
    expect(config.indexFirstPage).toBe(DEFAULT_CONFIG.indexFirstPage);
    expect(config.firstPageLabel).toBe(DEFAULT_CONFIG.firstPageLabel);
    expect(config.baseUrl).toBe('/blog/page/:page');
  });

  it('overrides defaults with user-supplied values', () => {
    const config = resolveConfig({
      baseUrl: '/posts/:page',
      pageSize: 5,
      indexFirstPage: true,
      firstPageLabel: 'first',
    });
    expect(config.pageSize).toBe(5);
    expect(config.indexFirstPage).toBe(true);
    expect(config.firstPageLabel).toBe('first');
  });

  it('throws if baseUrl is missing', () => {
    expect(() => resolveConfig({ baseUrl: '' })).toThrow(
      'PaginationConfig: baseUrl is required'
    );
  });

  it('throws if baseUrl is whitespace', () => {
    expect(() => resolveConfig({ baseUrl: '   ' })).toThrow(
      'PaginationConfig: baseUrl is required'
    );
  });

  it('throws if pageSize is less than 1', () => {
    expect(() => resolveConfig({ baseUrl: '/page/:page', pageSize: 0 })).toThrow(
      'PaginationConfig: pageSize must be a positive integer'
    );
  });

  it('preserves sort and filter options', () => {
    const predicate = (item: { published: boolean }) => item.published;
    const config = resolveConfig({
      baseUrl: '/page/:page',
      sort: { key: 'title' as never, order: 'asc' },
      filter: { predicate },
    });
    expect(config.sort).toBeDefined();
    expect(config.filter?.predicate).toBe(predicate);
  });
});
