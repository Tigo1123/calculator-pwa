/** Format a number for display: trim noise, group thousands, cap length. */
export function formatNumber(n) {
  if (n === "Error") return "Error";
  if (typeof n === "string") n = parseFloat(n);
  if (Number.isNaN(n)) return "0";
  if (!Number.isFinite(n)) return "Error";
  const rounded = Math.round(n * 1e10) / 1e10;
  // keep up to 12 significant chars to fit screen
  let s = String(rounded);
  if (s.length > 12) s = rounded.toPrecision(9).replace(/\.?0+$/, "");
  return s;
}

/** Font size (px) that shrinks as the display text grows. */
export function displayFontSize(text, base = 44) {
  if (!text) return base;
  const len = String(text).length;
  if (len <= 7) return base;
  if (len <= 9) return base - 8;
  if (len <= 12) return base - 14;
  return base - 20;
}
