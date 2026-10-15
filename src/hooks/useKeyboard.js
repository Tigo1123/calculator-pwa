import { useEffect } from "react";

/** Map keyboard events to calculator actions. */
export function useKeyboard({
  inputDigit,
  inputOperator,
  equals,
  clear,
  negate,
  backspace,
  parentheses,
  percent,
}) {
  useEffect(() => {
    const handler = (e) => {
      const k = e.key;
      if (/^[0-9]$/.test(k)) inputDigit(k);
      else if (k === ".") inputDigit(".");
      else if (k === "+") inputOperator("+");
      else if (k === "-") inputOperator("−");
      else if (k === "*") inputOperator("×");
      else if (k === "/") {
        e.preventDefault();
        inputOperator("÷");
      } else if (k === "(" || k === ")") {
        e.preventDefault();
        parentheses?.();
      } else if (k === "%") {
        e.preventDefault();
        percent?.();
      } else if (k === "Enter" || k === "=") {
        e.preventDefault();
        equals();
      } else if (k === "Escape") clear();
      else if (k === "Backspace") backspace();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [
    inputDigit,
    inputOperator,
    equals,
    clear,
    negate,
    backspace,
    parentheses,
    percent,
  ]);
}
