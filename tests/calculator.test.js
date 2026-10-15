import { describe, it, expect } from "vitest";
import { applyOp, normalize } from "../src/utils/math";
import { formatNumber, displayFontSize } from "../src/utils/format";
import {
  calculatorReducer,
  initialState,
} from "../src/hooks/calculatorReducer";

const type = (state, actions) => actions.reduce(calculatorReducer, state);

describe("normalize / applyOp", () => {
  it("fixes floating point noise (0.1+0.2 = 0.3)", () => {
    expect(normalize(0.1 + 0.2)).toBe(0.3);
    expect(applyOp(0.1, 0.2, "+")).toBe(0.3);
  });
  it("division by zero returns null (Error)", () => {
    expect(applyOp(5, 0, "÷")).toBe(null);
  });
  it("performs all operations", () => {
    expect(applyOp(7, 3, "−")).toBe(4);
    expect(applyOp(6, 7, "×")).toBe(42);
    expect(applyOp(9, 3, "÷")).toBe(3);
  });
});

describe("formatNumber", () => {
  it("formats integers and decimals", () => {
    expect(formatNumber(42)).toBe("42");
    expect(formatNumber(0.3)).toBe("0.3");
  });
  it("handles Error and non-finite", () => {
    expect(formatNumber("Error")).toBe("Error");
    expect(formatNumber(Infinity)).toBe("Error");
  });
});

describe("reducer sequences", () => {
  it("28 + 67 − 20 = 75", () => {
    const s = type(initialState, [
      { type: "DIGIT", payload: "2" },
      { type: "DIGIT", payload: "8" },
      { type: "OPERATOR", payload: "+" },
      { type: "DIGIT", payload: "6" },
      { type: "DIGIT", payload: "7" },
      { type: "OPERATOR", payload: "−" },
      { type: "DIGIT", payload: "2" },
      { type: "DIGIT", payload: "0" },
      { type: "EQUALS" },
    ]);
    expect(s.current).toBe("75");
  });

  it("no duplicate decimal point", () => {
    let s = type(initialState, [
      { type: "DIGIT", payload: "1" },
      { type: "DIGIT", payload: "." },
      { type: "DIGIT", payload: "." },
      { type: "DIGIT", payload: "5" },
    ]);
    expect(s.current).toBe("1.5");
  });

  it("division by zero shows Error and recovers on digit", () => {
    let s = type(initialState, [
      { type: "DIGIT", payload: "5" },
      { type: "OPERATOR", payload: "÷" },
      { type: "DIGIT", payload: "0" },
      { type: "EQUALS" },
    ]);
    expect(s.current).toBe("Error");
    s = type(s, [{ type: "DIGIT", payload: "7" }]);
    expect(s.current).toBe("7");
  });

  it("percent: 50 % of nothing = 0.5", () => {
    const s = type(initialState, [
      { type: "DIGIT", payload: "5" },
      { type: "DIGIT", payload: "0" },
      { type: "PERCENT" },
    ]);
    expect(s.current).toBe("0.5");
  });

  it("negate toggles sign", () => {
    let s = type(initialState, [
      { type: "DIGIT", payload: "8" },
      { type: "NEGATE" },
    ]);
    expect(s.current).toBe("-8");
    s = type(s, [{ type: "NEGATE" }]);
    expect(s.current).toBe("8");
  });

  it("backspace shrinks current value", () => {
    let s = type(initialState, [
      { type: "DIGIT", payload: "1" },
      { type: "DIGIT", payload: "2" },
      { type: "BACKSPACE" },
    ]);
    expect(s.current).toBe("1");
    s = type(s, [{ type: "BACKSPACE" }]);
    expect(s.current).toBe("0");
  });

  it("clear resets everything", () => {
    const s = type(initialState, [
      { type: "DIGIT", payload: "9" },
      { type: "CLEAR" },
    ]);
    expect(s).toEqual(initialState);
  });

  it("decimal precision: 0.1 + 0.2 = 0.3 via UI flow", () => {
    const s = type(initialState, [
      { type: "DIGIT", payload: "0" },
      { type: "DIGIT", payload: "." },
      { type: "DIGIT", payload: "1" },
      { type: "OPERATOR", payload: "+" },
      { type: "DIGIT", payload: "0" },
      { type: "DIGIT", payload: "." },
      { type: "DIGIT", payload: "2" },
      { type: "EQUALS" },
    ]);
    expect(s.current).toBe("0.3");
  });
});

describe("displayFontSize", () => {
  it("shrinks for long numbers", () => {
    expect(displayFontSize("1234567")).toBe(34);
    expect(displayFontSize("12345678901234")).toBeLessThan(22);
  });
});
