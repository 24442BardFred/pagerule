import {
  resolveBreakpoint,
  buildBreakpointMap,
  getDefaultBreakpoints,
  PageBreakpoint,
} from "./pageBreakpoint";

const customBreakpoints: PageBreakpoint[] = [
  { name: "small", minWidth: 0, maxWidth: 599, pageSize: 5, windowSize: 3 },
  { name: "large", minWidth: 600, maxWidth: Infinity, pageSize: 20, windowSize: 7 },
];

describe("resolveBreakpoint", () => {
  it("resolves xs breakpoint for narrow widths", () => {
    const result = resolveBreakpoint(320);
    expect(result.active.name).toBe("xs");
    expect(result.pageSize).toBe(5);
    expect(result.windowSize).toBe(3);
  });

  it("resolves md breakpoint for medium widths", () => {
    const result = resolveBreakpoint(900);
    expect(result.active.name).toBe("md");
    expect(result.pageSize).toBe(20);
  });

  it("resolves xl breakpoint for large widths", () => {
    const result = resolveBreakpoint(1440);
    expect(result.active.name).toBe("xl");
    expect(result.pageSize).toBe(50);
  });

  it("uses custom breakpoints when provided", () => {
    const result = resolveBreakpoint(300, customBreakpoints);
    expect(result.active.name).toBe("small");
    expect(result.pageSize).toBe(5);
  });

  it("falls back to last breakpoint when width exceeds all ranges", () => {
    const result = resolveBreakpoint(9999, customBreakpoints);
    expect(result.active.name).toBe("large");
  });

  it("throws when no breakpoints are provided", () => {
    expect(() => resolveBreakpoint(800, [])).toThrow(
      "At least one breakpoint must be provided."
    );
  });

  it("resolves boundary value at minWidth exactly", () => {
    const result = resolveBreakpoint(768);
    expect(result.active.name).toBe("md");
  });
});

describe("buildBreakpointMap", () => {
  it("returns a map keyed by breakpoint name", () => {
    const map = buildBreakpointMap(customBreakpoints);
    expect(map["small"]).toBeDefined();
    expect(map["large"]).toBeDefined();
    expect(map["small"].pageSize).toBe(5);
  });

  it("uses default breakpoints when none provided", () => {
    const map = buildBreakpointMap();
    expect(Object.keys(map)).toEqual(["xs", "sm", "md", "lg", "xl"]);
  });
});

describe("getDefaultBreakpoints", () => {
  it("returns a copy of the default breakpoints array", () => {
    const defaults = getDefaultBreakpoints();
    expect(defaults).toHaveLength(5);
    defaults.pop();
    expect(getDefaultBreakpoints()).toHaveLength(5);
  });
});
