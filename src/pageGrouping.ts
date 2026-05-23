/**
 * pageGrouping.ts
 * Groups paginated items by a key field for category-based pagination.
 */

export type GroupMap<T> = Map<string, T[]>;

export interface GroupedPage<T> {
  group: string;
  items: T[];
  count: number;
}

/**
 * Groups an array of items by a derived key.
 */
export function groupItems<T>(
  items: T[],
  keyFn: (item: T) => string
): GroupMap<T> {
  const map: GroupMap<T> = new Map();
  for (const item of items) {
    const key = keyFn(item);
    if (!map.has(key)) {
      map.set(key, []);
    }
    map.get(key)!.push(item);
  }
  return map;
}

/**
 * Converts a GroupMap into a sorted array of GroupedPage objects.
 */
export function groupMapToPages<T>(
  groupMap: GroupMap<T>,
  sortGroups: "asc" | "desc" | "none" = "asc"
): GroupedPage<T>[] {
  const entries = Array.from(groupMap.entries()).map(([group, items]) => ({
    group,
    items,
    count: items.length,
  }));

  if (sortGroups === "asc") {
    entries.sort((a, b) => a.group.localeCompare(b.group));
  } else if (sortGroups === "desc") {
    entries.sort((a, b) => b.group.localeCompare(a.group));
  }

  return entries;
}

/**
 * Returns the list of unique group keys from a GroupMap.
 */
export function getGroupKeys(groupMap: GroupMap<unknown>): string[] {
  return Array.from(groupMap.keys());
}
