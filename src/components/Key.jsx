import { useCallback } from "react";

/** A single pill-shaped key. */
export default function Key({ id, label, kind, span, onPress, aria }) {
  const handle = useCallback(() => {
    // Light haptic feedback on supported mobile devices
    if (navigator.vibrate) navigator.vibrate(10);
    onPress();
  }, [onPress]);

  return (
    <button
      type="button"
      className={`key key--${kind}${span === 2 ? " key--wide" : ""}`}
      onClick={handle}
      aria-label={aria}
    >
      {label}
    </button>
  );
}
