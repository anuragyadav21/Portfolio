export type StudioStackLayout = {
  columns: string;
  rows: string;
  /** Per-tile gridColumn (e.g. "span 2") — only set when spanning is needed */
  itemSpans?: string[];
};

/**
 * Desktop grid for the studio stack (all paintings except the featured temple).
 * Every count gets exactly N cells — no empty grid slots.
 */
export function getStudioStackLayout(count: number): StudioStackLayout {
  const n = Math.max(0, count);
  if (n === 0) {
    return { columns: "1fr", rows: "1fr" };
  }
  if (n === 1) {
    return { columns: "1fr", rows: "1fr" };
  }
  if (n === 2) {
    return { columns: "repeat(2, 1fr)", rows: "1fr" };
  }
  if (n === 3) {
    return { columns: "repeat(3, 1fr)", rows: "1fr" };
  }
  if (n === 4) {
    return { columns: "repeat(2, 1fr)", rows: "repeat(2, 1fr)" };
  }
  if (n === 5) {
    return {
      columns: "repeat(6, 1fr)",
      rows: "repeat(2, 1fr)",
      itemSpans: ["span 2", "span 2", "span 2", "span 3", "span 3"],
    };
  }
  if (n === 6) {
    return { columns: "repeat(3, 1fr)", rows: "repeat(2, 1fr)" };
  }
  if (n === 7) {
    return {
      columns: "repeat(12, 1fr)",
      rows: "repeat(2, 1fr)",
      itemSpans: ["span 3", "span 3", "span 3", "span 3", "span 4", "span 4", "span 4"],
    };
  }

  return layoutForLargeN(n);
}

function layoutForLargeN(n: number): StudioStackLayout {
  const cols = Math.ceil(Math.sqrt(n));
  const rows = Math.ceil(n / cols);
  const fullRows = Math.floor(n / cols);
  const remainder = n % cols;

  const columns = `repeat(${cols}, 1fr)`;
  const rowTracks = Array.from({ length: rows }, () => "1fr").join(" ");

  if (remainder === 0) {
    return { columns, rows: rowTracks };
  }

  const baseCols = lcm(cols, remainder);
  const spanFull = baseCols / cols;
  const spanPartial = baseCols / remainder;

  const itemSpans: string[] = [];
  for (let i = 0; i < n; i++) {
    const row = Math.floor(i / cols);
    const isLastPartialRow = row === fullRows && remainder > 0;
    itemSpans.push(isLastPartialRow ? `span ${spanPartial}` : `span ${spanFull}`);
  }

  return {
    columns: `repeat(${baseCols}, 1fr)`,
    rows: rowTracks,
    itemSpans,
  };
}

function lcm(a: number, b: number): number {
  return (a * b) / gcd(a, b);
}

function gcd(a: number, b: number): number {
  let x = a;
  let y = b;
  while (y !== 0) {
    const t = y;
    y = x % y;
    x = t;
  }
  return x;
}
