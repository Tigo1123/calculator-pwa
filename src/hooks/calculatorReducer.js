/** Calculator reducer — the single source of truth for app state. */
import { applyOp, normalize } from "../utils/math";
import { formatNumber } from "../utils/format";

export const initialState = {
  current: "0", // string being typed
  acc: null, // accumulated value (number)
  op: null, // pending operator: + − × ÷
  history: "", // equation line under the result
  overwrite: true, // next digit replaces current
  error: false,
};

export function calculatorReducer(state, action) {
  const { current, acc, op, overwrite } = state;
  const digit = (d) =>
    overwrite
      ? { current: d === "." ? "0." : d, overwrite: false }
      : // no duplicate decimal point
        current.includes(".")
        ? d === "."
          ? state
          : current.length < 12
            ? { current: current + d }
            : state
        : { current: current + (d === "." ? "." : d) };

  switch (action.type) {
    case "DIGIT":
      if (state.error)
        return { ...initialState, current: action.payload, overwrite: false };
      return {
        ...state,
        ...digit(action.payload),
        history: op ? `${formatNumber(acc)} ${op}` : "",
      };

    case "OPERATOR": {
      if (state.error) return initialState;
      const cur = parseFloat(current);
      if (op && !overwrite) {
        const next = applyOp(acc, cur, op);
        if (next === null)
          return { ...initialState, current: "Error", error: true };
        return {
          ...state,
          acc: next,
          current: formatNumber(next),
          op: action.payload,
          overwrite: true,
          history: `${formatNumber(next)} ${action.payload}`,
        };
      }
      return {
        ...state,
        acc: cur,
        op: action.payload,
        overwrite: true,
        history: `${formatNumber(cur)} ${action.payload}`,
      };
    }

    case "EQUALS": {
      if (state.error || op === null) return state;
      const next = applyOp(acc, parseFloat(current), op);
      if (next === null)
        return { ...initialState, current: "Error", error: true };
      return {
        ...initialState,
        current: formatNumber(next),
        history: `${formatNumber(acc)} ${op} ${formatNumber(parseFloat(current))} =`,
      };
    }

    case "PERCENT": {
      if (state.error) return initialState;
      const cur = parseFloat(current) / 100;
      return {
        ...state,
        current: formatNumber(cur),
        overwrite: op ? true : false,
        acc: op ? acc : null,
      };
    }

    case "NEGATE": {
      if (state.error) return initialState;
      const s = current.startsWith("-") ? current.slice(1) : "-" + current;
      return { ...state, current: s === "-" ? "0" : s };
    }

    case "BACKSPACE": {
      if (state.error) return initialState;
      if (overwrite)
        return {
          ...state,
          current: "0",
          overwrite: true,
          op: null,
          acc: null,
          history: "",
        };
      const s = current.length <= 1 ? "0" : current.slice(0, -1);
      return { ...state, current: s === "-" ? "0" : s };
    }

    case "CLEAR":
      return initialState;

    default:
      return state;
  }
}

export { normalize };
