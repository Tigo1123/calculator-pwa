import { useCallback } from "react";

/** A single circular key with a short mobile haptic. */
export default function Key({ label, kind, onPress, aria, className = "" }) {
  const handle = useCallback(() => {
    if (navigator.vibrate) navigator.vibrate(10);
    onPress?.();
  }, [onPress]);

  return (
    <button
      type="button"
      className={`key key--${kind} ${className}`.trim()}
      onClick={handle}
      aria-label={aria}
    >
      {label}
    </button>
  );
}
