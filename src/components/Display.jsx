import { displayFontSize } from "../utils/format";

/** Phone-style display: equation line above, large result + blinking cursor below. */
export default function Display({ value, history }) {
  return (
    <div
      className="display"
      role="status"
      aria-live="polite"
      aria-label={`Result ${value}`}
    >
      <div className="display__history" aria-hidden="true">
        {history}
      </div>
      <div
        className="display__value"
        style={{ fontSize: `${displayFontSize(value, 64)}px` }}
      >
        <span>{value}</span>
        <span className="display__cursor" aria-hidden="true" />
      </div>
    </div>
  );
}
