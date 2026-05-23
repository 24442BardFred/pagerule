/**
 * pageValidator.ts
 * Validates pagination configuration and page data before processing.
 */

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export interface ValidatableConfig {
  pageSize?: unknown;
  currentPage?: unknown;
  totalItems?: unknown;
  baseUrl?: unknown;
}

export function validatePageSize(pageSize: unknown): string | null {
  if (typeof pageSize !== "number") return "pageSize must be a number";
  if (!Number.isInteger(pageSize)) return "pageSize must be an integer";
  if (pageSize < 1) return "pageSize must be at least 1";
  if (pageSize > 10000) return "pageSize must not exceed 10000";
  return null;
}

export function validateCurrentPage(currentPage: unknown, totalPages?: number): string | null {
  if (typeof currentPage !== "number") return "currentPage must be a number";
  if (!Number.isInteger(currentPage)) return "currentPage must be an integer";
  if (currentPage < 1) return "currentPage must be at least 1";
  if (totalPages !== undefined && currentPage > totalPages) {
    return `currentPage (${currentPage}) exceeds totalPages (${totalPages})`;
  }
  return null;
}

export function validateBaseUrl(baseUrl: unknown): string | null {
  if (typeof baseUrl !== "string") return "baseUrl must be a string";
  if (baseUrl.trim() === "") return "baseUrl must not be empty";
  return null;
}

export function validateTotalItems(totalItems: unknown): string | null {
  if (typeof totalItems !== "number") return "totalItems must be a number";
  if (!Number.isInteger(totalItems)) return "totalItems must be an integer";
  if (totalItems < 0) return "totalItems must be non-negative";
  return null;
}

export function validateConfig(config: ValidatableConfig): ValidationResult {
  const errors: string[] = [];

  const pageSizeError = validatePageSize(config.pageSize);
  if (pageSizeError) errors.push(pageSizeError);

  const totalItemsError = validateTotalItems(config.totalItems);
  if (totalItemsError) errors.push(totalItemsError);

  const totalPages =
    typeof config.pageSize === "number" && typeof config.totalItems === "number"
      ? Math.ceil((config.totalItems as number) / (config.pageSize as number))
      : undefined;

  const currentPageError = validateCurrentPage(config.currentPage, totalPages);
  if (currentPageError) errors.push(currentPageError);

  if (config.baseUrl !== undefined) {
    const baseUrlError = validateBaseUrl(config.baseUrl);
    if (baseUrlError) errors.push(baseUrlError);
  }

  return { valid: errors.length === 0, errors };
}
