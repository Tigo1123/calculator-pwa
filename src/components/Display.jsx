import { displayFontSize } from "../utils/format";

/** Result: big right-aligned value + small equation line. */
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
        style={{ fontSize: `${displayFontSize(value)}px` }}
      >
        {value}
      </div>
    </div>
  );
}
