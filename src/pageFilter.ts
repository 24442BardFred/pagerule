export interface FilterRule<T> {
  field: keyof T;
  operator: "eq" | "neq" | "gt" | "gte" | "lt" | "lte" | "contains" | "startsWith" | "endsWith";
  value: unknown;
}

export interface FilterConfig<T> {
  rules: FilterRule<T>[];
  conjunction: "and" | "or";
}

function applyRule<T>(item: T, rule: FilterRule<T>): boolean {
  const fieldValue = item[rule.field];
  const v = rule.value;

  switch (rule.operator) {
    case "eq":         return fieldValue === v;
    case "neq":        return fieldValue !== v;
    case "gt":         return (fieldValue as number) > (v as number);
    case "gte":        return (fieldValue as number) >= (v as number);
    case "lt":         return (fieldValue as number) < (v as number);
    case "lte":        return (fieldValue as number) <= (v as number);
    case "contains":   return String(fieldValue).includes(String(v));
    case "startsWith": return String(fieldValue).startsWith(String(v));
    case "endsWith":   return String(fieldValue).endsWith(String(v));
    default:           return true;
  }
}

export function applyFilterConfig<T>(items: T[], config: FilterConfig<T>): T[] {
  if (!config.rules.length) return items;

  return items.filter((item) => {
    if (config.conjunction === "or") {
      return config.rules.some((rule) => applyRule(item, rule));
    }
    return config.rules.every((rule) => applyRule(item, rule));
  });
}

export function buildFilterConfig<T>(
  rules: FilterRule<T>[],
  conjunction: "and" | "or" = "and"
): FilterConfig<T> {
  return { rules, conjunction };
}

export function countFiltered<T>(items: T[], config: FilterConfig<T>): number {
  return applyFilterConfig(items, config).length;
}
