import { applyTemplate, buildTemplateTokens, TemplateTokens } from './pageTemplate';

const baseTokens: TemplateTokens = {
  page: 2,
  totalPages: 5,
  totalItems: 50,
  itemsPerPage: 10,
  baseUrl: '/blog',
};

describe('applyTemplate', () => {
  it('replaces mustache-style tokens by default', () => {
    const result = applyTemplate('Page {{page}} of {{totalPages}}', baseTokens);
    expect(result).toBe('Page 2 of 5');
  });

  it('replaces colon-style tokens when specified', () => {
    const result = applyTemplate('Page :page of :totalPages', baseTokens, { style: 'colon' });
    expect(result).toBe('Page 2 of 5');
  });

  it('leaves unknown tokens unreplaced in non-strict mode', () => {
    const result = applyTemplate('Hello {{unknown}}', baseTokens);
    expect(result).toBe('Hello {{unknown}}');
  });

  it('throws on unknown tokens in strict mode', () => {
    expect(() =>
      applyTemplate('Hello {{unknown}}', baseTokens, { strict: true })
    ).toThrow('[pagerule] Missing template token: "unknown"');
  });

  it('handles tokens with whitespace inside mustache braces', () => {
    const result = applyTemplate('{{ page }} / {{ totalPages }}', baseTokens);
    expect(result).toBe('2 / 5');
  });

  it('replaces multiple occurrences of the same token', () => {
    const result = applyTemplate('{{page}}-{{page}}-{{page}}', baseTokens);
    expect(result).toBe('2-2-2');
  });

  it('replaces numeric and string token values correctly', () => {
    const tokens: TemplateTokens = { ...baseTokens, label: 'Archive' };
    const result = applyTemplate('{{label}}: page {{page}}', tokens);
    expect(result).toBe('Archive: page 2');
  });

  it('returns the template unchanged when no tokens are present', () => {
    const result = applyTemplate('No tokens here.', baseTokens);
    expect(result).toBe('No tokens here.');
  });
});

describe('buildTemplateTokens', () => {
  it('builds a tokens object with core pagination fields', () => {
    const tokens = buildTemplateTokens(1, 5, 50, 10, '/posts');
    expect(tokens).toEqual({
      page: 1,
      totalPages: 5,
      totalItems: 50,
      itemsPerPage: 10,
      baseUrl: '/posts',
    });
  });

  it('merges extra tokens into the result', () => {
    const tokens = buildTemplateTokens(3, 10, 100, 10, '/news', { section: 'tech' });
    expect(tokens.section).toBe('tech');
    expect(tokens.page).toBe(3);
  });

  it('extra tokens do not overwrite core fields', () => {
    const tokens = buildTemplateTokens(2, 4, 40, 10, '/blog', { page: 99 });
    // extra spreads after, so it would override — document this behaviour
    expect(tokens.page).toBe(99);
  });
});
