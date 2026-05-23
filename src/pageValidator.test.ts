import {
  validatePageSize,
  validateCurrentPage,
  validateBaseUrl,
  validateTotalItems,
  validateConfig,
} from "./pageValidator";

describe("validatePageSize", () => {
  it("returns null for valid page size", () => {
    expect(validatePageSize(10)).toBeNull();
    expect(validatePageSize(1)).toBeNull();
    expect(validatePageSize(10000)).toBeNull();
  });

  it("returns error for non-number", () => {
    expect(validatePageSize("10")).toBe("pageSize must be a number");
    expect(validatePageSize(null)).toBe("pageSize must be a number");
  });

  it("returns error for non-integer", () => {
    expect(validatePageSize(1.5)).toBe("pageSize must be an integer");
  });

  it("returns error for out-of-range values", () => {
    expect(validatePageSize(0)).toBe("pageSize must be at least 1");
    expect(validatePageSize(-1)).toBe("pageSize must be at least 1");
    expect(validatePageSize(10001)).toBe("pageSize must not exceed 10000");
  });
});

describe("validateCurrentPage", () => {
  it("returns null for valid current page", () => {
    expect(validateCurrentPage(1)).toBeNull();
    expect(validateCurrentPage(3, 5)).toBeNull();
  });

  it("returns error when currentPage exceeds totalPages", () => {
    expect(validateCurrentPage(6, 5)).toMatch(/exceeds totalPages/);
  });

  it("returns error for invalid values", () => {
    expect(validateCurrentPage(0)).toBe("currentPage must be at least 1");
    expect(validateCurrentPage("1")).toBe("currentPage must be a number");
  });
});

describe("validateBaseUrl", () => {
  it("returns null for valid base URL", () => {
    expect(validateBaseUrl("/blog")).toBeNull();
    expect(validateBaseUrl("https://example.com/page")).toBeNull();
  });

  it("returns error for non-string or empty", () => {
    expect(validateBaseUrl(42)).toBe("baseUrl must be a string");
    expect(validateBaseUrl("")).toBe("baseUrl must not be empty");
    expect(validateBaseUrl("   ")).toBe("baseUrl must not be empty");
  });
});

describe("validateTotalItems", () => {
  it("returns null for valid total items", () => {
    expect(validateTotalItems(0)).toBeNull();
    expect(validateTotalItems(100)).toBeNull();
  });

  it("returns error for negative or non-integer", () => {
    expect(validateTotalItems(-1)).toBe("totalItems must be non-negative");
    expect(validateTotalItems(1.5)).toBe("totalItems must be an integer");
  });
});

describe("validateConfig", () => {
  it("returns valid for a correct config", () => {
    const result = validateConfig({ pageSize: 10, currentPage: 2, totalItems: 50, baseUrl: "/posts" });
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it("collects multiple errors", () => {
    const result = validateConfig({ pageSize: 0, currentPage: -1, totalItems: -5 });
    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(1);
  });

  it("validates currentPage against computed totalPages", () => {
    const result = validateConfig(
      { pageSize: 10, currentPage: 6, totalItems: 50, baseUrl: "/posts" }
    );
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => /exceeds totalPages/.test(e))).toBe(true);
  });

  it("returns valid for a single-page result set", () => {
    const result = validateConfig({ pageSize: 10, currentPage: 1, totalItems: 5, baseUrl: "/posts" });
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it("returns valid when totalItems is zero", () => {
    const result = validateConfig({ pageSize: 10, currentPage: 1, totalItems: 0, baseUrl: "/posts" });
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });
});
