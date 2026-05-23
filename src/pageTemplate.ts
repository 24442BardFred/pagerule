/**
 * pageTemplate.ts
 * Utilities for applying template strings and token replacement
 * to paginated page output, enabling flexible content rendering.
 */

export interface TemplateTokens {
  page: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  baseUrl: string;
  [key: string]: string | number | boolean;
}

export interface TemplateOptions {
  /** Delimiter style: 'mustache' uses {{token}}, 'colon' uses :token */
  style?: 'mustache' | 'colon';
  /** Whether to throw on missing tokens or leave them unreplaced */
  strict?: boolean;
}

const DEFAULT_OPTIONS: Required<TemplateOptions> = {
  style: 'mustache',
  strict: false,
};

/**
 * Replaces template tokens in a string with values from a tokens map.
 */
export function applyTemplate(
  template: string,
  tokens: TemplateTokens,
  options: TemplateOptions = {}
): string {
  const opts = { ...DEFAULT_OPTIONS, ...options };

  const pattern =
    opts.style === 'mustache'
      ? /\{\{\s*(\w+)\s*\}\}/g
      : /:([a-zA-Z_][\w]*)/g;

  return template.replace(pattern, (match, key: string) => {
    if (Object.prototype.hasOwnProperty.call(tokens, key)) {
      return String(tokens[key]);
    }
    if (opts.strict) {
      throw new Error(`[pagerule] Missing template token: "${key}"`);
    }
    return match;
  });
}

/**
 * Builds a TemplateTokens object from common pagination metadata.
 */
export function buildTemplateTokens(
  page: number,
  totalPages: number,
  totalItems: number,
  itemsPerPage: number,
  baseUrl: string,
  extra: Record<string, string | number | boolean> = {}
): TemplateTokens {
  return {
    page,
    totalPages,
    totalItems,
    itemsPerPage,
    baseUrl,
    ...extra,
  };
}
