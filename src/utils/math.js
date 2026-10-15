/* Calculator logic — pure functions, no eval. */

export const OPS = {
  "+": (a, b) => a + b,
  "−": (a, b) => a - b,
  "×": (a, b) => a * b,
  "÷": (a, b) => a / b,
};

/** Round away floating-point noise: 0.1+0.2 -> 0.3 */
export function normalize(n) {
  if (!Number.isFinite(n)) return null; // division by zero / overflow
  const r = Math.round(n * 1e10) / 1e10;
  return r;
}

/** Apply pending operation between acc and current. */
export function applyOp(acc, current, op) {
  if (op === null || op === undefined) return current;
  const fn = OPS[op];
  if (!fn) return current;
  return normalize(fn(acc, current));
}
