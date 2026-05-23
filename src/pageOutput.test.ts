import { describe, it, expect } from 'vitest';
import { toJson, toFrontmatter, toContext, formatPage } from './pageOutput';
import { SerializedPage } from './pageSerializer';

const mockPage: SerializedPage<string> = {
  currentPage: 2,
  totalPages: 4,
  totalItems: 20,
  itemsPerPage: 5,
  items: ['a', 'b', 'c', 'd', 'e'],
  hasPreviousPage: true,
  hasNextPage: true,
  previousPage: 1,
  nextPage: 3,
  pageUrl: '/page/2',
  previousPageUrl: '/page/1',
  nextPageUrl: '/page/3',
  pageRange: [1, 2, 3, 4],
};

describe('toJson', () => {
  it('should produce valid JSON', () => {
    const output = toJson(mockPage);
    expect(() => JSON.parse(output)).not.toThrow();
  });

  it('should include currentPage in output', () => {
    const output = toJson(mockPage);
    expect(output).toContain('"currentPage": 2');
  });

  it('should respect indent option', () => {
    const output = toJson(mockPage, 4);
    expect(output).toContain('    "currentPage"');
  });
});

describe('toFrontmatter', () => {
  it('should start and end with ---', () => {
    const output = toFrontmatter(mockPage);
    expect(output.startsWith('---')).toBe(true);
    expect(output.endsWith('---')).toBe(true);
  });

  it('should include pagination metadata', () => {
    const output = toFrontmatter(mockPage);
    expect(output).toContain('currentPage: 2');
    expect(output).toContain('totalPages: 4');
    expect(output).toContain('pageUrl: "/page/2"');
  });

  it('should omit null fields', () => {
    const firstPage = { ...mockPage, previousPage: null, previousPageUrl: null, hasPreviousPage: false };
    const output = toFrontmatter(firstPage);
    expect(output).not.toContain('previousPage:');
    expect(output).not.toContain('previousPageUrl:');
  });
});

describe('toContext', () => {
  it('should return the page as a plain object', () => {
    const ctx = toContext(mockPage);
    expect(ctx['currentPage']).toBe(2);
    expect(ctx['items']).toEqual(['a', 'b', 'c', 'd', 'e']);
  });
});

describe('formatPage', () => {
  it('should default to json format', () => {
    const output = formatPage(mockPage);
    expect(typeof output).toBe('string');
    expect(output).toContain('currentPage');
  });

  it('should support frontmatter format', () => {
    const output = formatPage(mockPage, { format: 'frontmatter' }) as string;
    expect(output.startsWith('---')).toBe(true);
  });

  it('should support context format', () => {
    const output = formatPage(mockPage, { format: 'context' }) as Record<string, unknown>;
    expect(output['currentPage']).toBe(2);
  });

  it('should throw for unknown format', () => {
    expect(() => formatPage(mockPage, { format: 'xml' as any })).toThrow('Unknown output format: xml');
  });
});
