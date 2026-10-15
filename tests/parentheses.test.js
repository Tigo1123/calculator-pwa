import { describe, expect, it } from "vitest";
import {
  calculatorReducer,
  evaluateExpression,
  initialState,
} from "../src/hooks/calculatorReducer";

const seq = (...actions) => actions.reduce(calculatorReducer, initialState);
const digit = (value) => ({ type: "DIGIT", payload: value });

describe("parentheses expression support", () => {
  it("evaluates nested expressions using operator precedence", () => {
    expect(evaluateExpression("2 × (3 + 4) − 1")).toBe(13);
  });

  it("returns null for invalid expressions and division by zero", () => {
    expect(evaluateExpression("(2 + )")).toBeNull();
    expect(evaluateExpression("4 ÷ (2 − 2)")).toBeNull();
  });

  it("toggles opening/closing parentheses and evaluates", () => {
    let state = seq(digit("2"), { type: "OPERATOR", payload: "+" });
    state = calculatorReducer(state, { type: "PARENTHESES" });
    state = calculatorReducer(state, digit("3"));
    state = calculatorReducer(state, { type: "OPERATOR", payload: "×" });
    state = calculatorReducer(state, { type: "PARENTHESES" });
    state = calculatorReducer(state, digit("4"));
    state = calculatorReducer(state, { type: "PARENTHESES" });
    state = calculatorReducer(state, { type: "EQUALS" });
    expect(state.current).toBe("14");
  });
});
