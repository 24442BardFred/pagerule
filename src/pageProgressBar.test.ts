import { renderProgressBar, renderPageSteps } from "./pageProgressBar";
import { buildPageProgress } from "./pageProgress";

describe("renderProgressBar", () => {
  it("renders a half-filled bar at 50%", () => {
    const progress = buildPageProgress({ total: 100, current: 5, pageSize: 10 });
    const bar = renderProgressBar(progress, { width: 10 });
    expect(bar).toBe("[█████░░░░░] 50%");
  });

  it("renders a fully filled bar at 100%", () => {
    const progress = buildPageProgress({ total: 100, current: 10, pageSize: 10 });
    const bar = renderProgressBar(progress, { width: 10 });
    expect(bar).toBe("[██████████] 100%");
  });

  it("renders an empty bar at 0% (page 0 clamped to 1 of 10)", () => {
    const progress = buildPageProgress({ total: 100, current: 1, pageSize: 10 });
    const bar = renderProgressBar(progress, { width: 10 });
    expect(bar).toBe("[█░░░░░░░░░] 10%");
  });

  it("hides percent when showPercent is false", () => {
    const progress = buildPageProgress({ total: 100, current: 5, pageSize: 10 });
    const bar = renderProgressBar(progress, { width: 4, showPercent: false });
    expect(bar).toBe("[██░░]");
  });

  it("supports custom fill characters", () => {
    const progress = buildPageProgress({ total: 100, current: 10, pageSize: 10 });
    const bar = renderProgressBar(progress, { width: 5, filledChar: "#", emptyChar: "-", showPercent: false });
    expect(bar).toBe("[#####]");
  });
});

describe("renderPageSteps", () => {
  it("renders step indicators with active page highlighted", () => {
    const progress = buildPageProgress({ total: 50, current: 3, pageSize: 10 });
    const steps = renderPageSteps(progress);
    expect(steps).toBe("○ ○ ● ○ ○");
  });

  it("supports custom active and inactive characters", () => {
    const progress = buildPageProgress({ total: 30, current: 2, pageSize: 10 });
    const steps = renderPageSteps(progress, { activeChar: ">", inactiveChar: "-" });
    expect(steps).toBe("- > -");
  });

  it("renders single step for single page", () => {
    const progress = buildPageProgress({ total: 5, current: 1, pageSize: 10 });
    const steps = renderPageSteps(progress);
    expect(steps).toBe("●");
  });
});
