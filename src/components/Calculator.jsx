import { useCallback } from "react";
import { useCalculator } from "../hooks/useCalculator";
import { useKeyboard } from "../hooks/useKeyboard";
import Display from "./Display";
import Keypad from "./Keypad";
import ThemeToggle from "./ThemeToggle";

/** Full-height calculator screen with display, toolbar, separator, and keypad. */
export default function Calculator({ theme, toggleTheme }) {
  const calc = useCalculator();
  useKeyboard(calc);

  const handleBackspace = useCallback(() => {
    if (navigator.vibrate) navigator.vibrate(10);
    calc.backspace();
  }, [calc]);

  return (
    <section className="calculator" aria-label="Calculator">
      <Display value={calc.state.current} history={calc.state.history} />
      <div className="calculator__toolbar">
        <ThemeToggle theme={theme} toggle={toggleTheme} />
        <button
          type="button"
          className="toolbar-btn toolbar-btn--delete"
          onClick={handleBackspace}
          aria-label="Delete"
          title="Delete"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M21 4H8l-7 8 7 8h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z" />
            <line x1="18" y1="9" x2="12" y2="15" />
            <line x1="12" y1="9" x2="18" y2="15" />
          </svg>
        </button>
      </div>
      <div className="calculator__divider" aria-hidden="true" />
      <Keypad
        onDigit={calc.inputDigit}
        onOperator={calc.inputOperator}
        onEquals={calc.equals}
        onPercent={calc.percent}
        onNegate={calc.negate}
        onClear={calc.clear}
        onParentheses={calc.parentheses}
      />
    </section>
  );
}
