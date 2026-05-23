import { buildPageSorter, resolveSort, SortKey } from './pageSorter';

interface Item {
  name: string;
  age: number;
  score: number | null;
}

const items: Item[] = [
  { name: 'Charlie', age: 30, score: 80 },
  { name: 'Alice', age: 25, score: null },
  { name: 'Bob', age: 25, score: 90 },
  { name: 'Diana', age: 35, score: 70 },
];

describe('buildPageSorter', () => {
  it('sorts by a single numeric field ascending', () => {
    const sorter = buildPageSorter<Item>({ keys: [{ field: 'age' }] });
    const result = sorter(items);
    expect(result.map(i => i.name)).toEqual(['Alice', 'Bob', 'Charlie', 'Diana']);
  });

  it('sorts by a single numeric field descending', () => {
    const sorter = buildPageSorter<Item>({ keys: [{ field: 'age', direction: 'desc' }] });
    const result = sorter(items);
    expect(result[0].name).toBe('Diana');
    expect(result[result.length - 1].age).toBe(25);
  });

  it('sorts by a string field ascending', () => {
    const sorter = buildPageSorter<Item>({ keys: [{ field: 'name' }] });
    const result = sorter(items);
    expect(result.map(i => i.name)).toEqual(['Alice', 'Bob', 'Charlie', 'Diana']);
  });

  it('applies multi-key sorting', () => {
    const keys: SortKey<Item>[] = [
      { field: 'age', direction: 'asc' },
      { field: 'name', direction: 'asc' },
    ];
    const sorter = buildPageSorter<Item>({ keys });
    const result = sorter(items);
    // age 25: Alice before Bob
    expect(result[0].name).toBe('Alice');
    expect(result[1].name).toBe('Bob');
  });

  it('places nulls last by default', () => {
    const sorter = buildPageSorter<Item>({ keys: [{ field: 'score' }] });
    const result = sorter(items);
    expect(result[result.length - 1].score).toBeNull();
  });

  it('places nulls first when nullsLast is false', () => {
    const sorter = buildPageSorter<Item>({ keys: [{ field: 'score' }], nullsLast: false });
    const result = sorter(items);
    expect(result[0].score).toBeNull();
  });

  it('does not mutate the original array', () => {
    const original = [...items];
    const sorter = buildPageSorter<Item>({ keys: [{ field: 'age' }] });
    sorter(items);
    expect(items).toEqual(original);
  });

  it('returns items unchanged when no keys provided', () => {
    const sorter = buildPageSorter<Item>({ keys: [] });
    const result = sorter(items);
    expect(result).toEqual(items);
  });
});

describe('resolveSort', () => {
  it('sorts items using provided keys', () => {
    const result = resolveSort(items, [{ field: 'age', direction: 'desc' }]);
    expect(result[0].name).toBe('Diana');
  });

  it('returns a new array reference', () => {
    const result = resolveSort(items, [{ field: 'name' }]);
    expect(result).not.toBe(items);
  });
});
