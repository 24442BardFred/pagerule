import {
  encodeCursor,
  decodeCursor,
  buildPageCursor,
  PageCursor,
} from "./pageCursor";

describe("encodeCursor", () => {
  it("encodes a page number to a base64 string", () => {
    const cursor = encodeCursor(3);
    expect(typeof cursor).toBe("string");
    expect(cursor.length).toBeGreaterThan(0);
  });

  it("produces different cursors for different pages", () => {
    expect(encodeCursor(1)).not.toBe(encodeCursor(2));
  });
});

describe("decodeCursor", () => {
  it("decodes a valid cursor back to a page number", () => {
    const cursor = encodeCursor(5);
    expect(decodeCursor(cursor)).toBe(5);
  });

  it("returns null for an invalid cursor string", () => {
    expect(decodeCursor("not-a-cursor")).toBeNull();
  });

  it("returns null for an empty string", () => {
    expect(decodeCursor("")).toBeNull();
  });

  it("round-trips page numbers correctly", () => {
    for (const page of [1, 10, 99, 1000]) {
      expect(decodeCursor(encodeCursor(page))).toBe(page);
    }
  });
});

describe("buildPageCursor", () => {
  it("builds a cursor for a middle page", () => {
    const cursor: PageCursor = buildPageCursor(3, 5);
    expect(cursor.currentPage).toBe(3);
    expect(cursor.totalPages).toBe(5);
    expect(cursor.hasPrev).toBe(true);
    expect(cursor.hasNext).toBe(true);
    expect(cursor.prevCursor).toBe(encodeCursor(2));
    expect(cursor.nextCursor).toBe(encodeCursor(4));
  });

  it("sets hasPrev to false on first page", () => {
    const cursor = buildPageCursor(1, 5);
    expect(cursor.hasPrev).toBe(false);
    expect(cursor.prevCursor).toBeNull();
  });

  it("sets hasNext to false on last page", () => {
    const cursor = buildPageCursor(5, 5);
    expect(cursor.hasNext).toBe(false);
    expect(cursor.nextCursor).toBeNull();
  });

  it("builds a cursorMap with an entry for every page", () => {
    const cursor = buildPageCursor(2, 4);
    expect(Object.keys(cursor.cursorMap)).toHaveLength(4);
    expect(decodeCursor(cursor.cursorMap[1])).toBe(1);
    expect(decodeCursor(cursor.cursorMap[4])).toBe(4);
  });

  it("throws when totalPages is less than 1", () => {
    expect(() => buildPageCursor(1, 0)).toThrow(RangeError);
  });

  it("throws when currentPage is out of range", () => {
    expect(() => buildPageCursor(6, 5)).toThrow(RangeError);
    expect(() => buildPageCursor(0, 5)).toThrow(RangeError);
  });
});
