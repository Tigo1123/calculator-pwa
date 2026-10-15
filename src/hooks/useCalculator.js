import { useReducer, useCallback } from "react";
import { calculatorReducer, initialState } from "./calculatorReducer";

/** Hook exposing calculator state + action dispatchers. */
export function useCalculator() {
  const [state, dispatch] = useReducer(calculatorReducer, initialState);

  const inputDigit = useCallback(
    (d) => dispatch({ type: "DIGIT", payload: d }),
    [],
  );
  const inputOperator = useCallback(
    (op) => dispatch({ type: "OPERATOR", payload: op }),
    [],
  );
  const equals = useCallback(() => dispatch({ type: "EQUALS" }), []);
  const percent = useCallback(() => dispatch({ type: "PERCENT" }), []);
  const negate = useCallback(() => dispatch({ type: "NEGATE" }), []);
  const clear = useCallback(() => dispatch({ type: "CLEAR" }), []);
  const backspace = useCallback(() => dispatch({ type: "BACKSPACE" }), []);

  return { state, inputDigit, inputOperator, equals, percent, negate, clear, backspace };
}
