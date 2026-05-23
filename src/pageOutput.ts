import { SerializedPage } from './pageSerializer';

export type OutputFormat = 'json' | 'frontmatter' | 'context';

export type PageOutputOptions = {
  format?: OutputFormat;
  indent?: number;
};

/**
 * Converts a serialized page to a JSON string.
 */
export function toJson<T>(page: SerializedPage<T>, indent = 2): string {
  return JSON.stringify(page, null, indent);
}

/**
 * Converts a serialized page to YAML-style frontmatter string.
 */
export function toFrontmatter<T>(page: SerializedPage<T>): string {
  const lines: string[] = ['---'];
  lines.push(`currentPage: ${page.currentPage}`);
  lines.push(`totalPages: ${page.totalPages}`);
  lines.push(`totalItems: ${page.totalItems}`);
  lines.push(`itemsPerPage: ${page.itemsPerPage}`);
  lines.push(`hasPreviousPage: ${page.hasPreviousPage}`);
  lines.push(`hasNextPage: ${page.hasNextPage}`);
  if (page.previousPage !== null) lines.push(`previousPage: ${page.previousPage}`);
  if (page.nextPage !== null) lines.push(`nextPage: ${page.nextPage}`);
  lines.push(`pageUrl: "${page.pageUrl}"`);
  if (page.previousPageUrl) lines.push(`previousPageUrl: "${page.previousPageUrl}"`);
  if (page.nextPageUrl) lines.push(`nextPageUrl: "${page.nextPageUrl}"`);
  lines.push(`pageRange: [${page.pageRange.join(', ')}]`);
  lines.push('---');
  return lines.join('\n');
}

/**
 * Returns the serialized page as a plain context object (identity transform).
 * Useful for passing to template engines like Nunjucks or Handlebars.
 */
export function toContext<T>(page: SerializedPage<T>): Record<string, unknown> {
  return page as unknown as Record<string, unknown>;
}

/**
 * Dispatches to the appropriate output formatter.
 */
export function formatPage<T>(
  page: SerializedPage<T>,
  options: PageOutputOptions = {}
): string | Record<string, unknown> {
  const { format = 'json', indent = 2 } = options;
  switch (format) {
    case 'json':
      return toJson(page, indent);
    case 'frontmatter':
      return toFrontmatter(page);
    case 'context':
      return toContext(page);
    default:
      throw new Error(`Unknown output format: ${format}`);
  }
}
