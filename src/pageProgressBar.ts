import { PageProgress } from "./pageProgress";

export interface ProgressBarOptions {
  width?: number;
  filledChar?: string;
  emptyChar?: string;
  showPercent?: boolean;
}

const DEFAULTS: Required<ProgressBarOptions> = {
  width: 20,
  filledChar: "█",
  emptyChar: "░",
  showPercent: true,
};

export function renderProgressBar(
  progress: PageProgress,
  options: ProgressBarOptions = {}
): string {
  const opts = { ...DEFAULTS, ...options };
  const filled = Math.round((progress.percentComplete / 100) * opts.width);
  const empty = opts.width - filled;
  const bar = opts.filledChar.repeat(filled) + opts.emptyChar.repeat(empty);
  return opts.showPercent ? `[${bar}] ${progress.percentComplete}%` : `[${bar}]`;
}

export function renderPageSteps(
  progress: PageProgress,
  options: { activeChar?: string; inactiveChar?: string } = {}
): string {
  const active = options.activeChar ?? "●";
  const inactive = options.inactiveChar ?? "○";
  return Array.from({ length: progress.totalPages }, (_, i) =>
    i + 1 === progress.currentPage ? active : inactive
  ).join(" ");
}
