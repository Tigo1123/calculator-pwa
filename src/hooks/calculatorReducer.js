/** Calculator reducer — the single source of truth for app state. */
import { applyOp, normalize } from "../utils/math";
import { formatNumber } from "../utils/format";

// Recursive-descent parser for + − × ÷ and parentheses. Never uses eval.
export function evaluateExpression(source) {
  const text = source
    .replaceAll("−", "-")
    .replaceAll("×", "*")
    .replaceAll("÷", "/");
  const tokens = text.match(/\d*\.?\d+|[()+*/-]/g) || [];
  let index = 0;
  const primary = () => {
    if (tokens[index] === "-") {
      index++;
      return -primary();
    }
    if (tokens[index] === "(") {
      index++;
      const value = sum();
      if (tokens[index++] !== ")") throw new Error("Unbalanced parentheses");
      return value;
    }
    const value = Number(tokens[index++]);
    if (!Number.isFinite(value)) throw new Error("Invalid number");
    return value;
  };
  const product = () => {
    let value = primary();
    while (tokens[index] === "*" || tokens[index] === "/") {
      const op = tokens[index++],
        rhs = primary();
      if (op === "/" && rhs === 0) throw new Error("Division by zero");
      value = op === "*" ? value * rhs : value / rhs;
    }
    return value;
  };
  const sum = () => {
    let value = product();
    while (tokens[index] === "+" || tokens[index] === "-") {
      const op = tokens[index++],
        rhs = product();
      value = op === "+" ? value + rhs : value - rhs;
    }
    return value;
  };
  try {
    if (!tokens.length) return null;
    const value = sum();
    if (index !== tokens.length) return null;
    return normalize(value);
  } catch {
    return null;
  }
}

export const initialState = {
  current: "0", // string being typed
  acc: null, // accumulated value (number)
  op: null, // pending operator: + − × ÷
  history: "", // equation line under the result
  expression: "",
  overwrite: true, // next digit replaces current
  error: false,
};

export function calculatorReducer(state, action) {
  const { current, acc, op, overwrite } = state;
  const digit = (d) =>
    overwrite || current === "0"
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
        return {
          ...initialState,
          current: action.payload,
          overwrite: false,
          expression: action.payload,
        };
      {
        const next = digit(action.payload);
        const expression =
          overwrite && state.expression.trimEnd().endsWith(")")
            ? `${state.expression} × ${next.current}`
            : `${state.expression}${action.payload}`;
        return {
          ...state,
          ...next,
          expression,
          history: op ? `${formatNumber(acc)} ${op}` : state.history,
        };
      }

    case "OPERATOR": {
      if (state.error) return initialState;
      const trimmed = state.expression.trimEnd();
      const expression = /[+−×÷]$/.test(trimmed)
        ? `${trimmed.slice(0, -1)} ${action.payload} `
        : `${state.expression || current} ${action.payload} `;
      const cur = parseFloat(current);
      if (op && !overwrite && !state.expression.includes(")")) {
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
          expression,
        };
      }
      return {
        ...state,
        acc: cur,
        op: action.payload,
        overwrite: true,
        history: `${formatNumber(cur)} ${action.payload}`,
        expression,
      };
    }

    case "EQUALS": {
      if (state.error) return state;
      if (state.expression.includes("(") || state.expression.includes(")")) {
        const completedExpression =
          state.expression +
          ")".repeat(
            Math.max(
              0,
              (state.expression.match(/\(/g) || []).length -
                (state.expression.match(/\)/g) || []).length,
            ),
          );
        const result = evaluateExpression(completedExpression);
        if (result === null)
          return { ...initialState, current: "Error", error: true };
        return {
          ...initialState,
          current: formatNumber(result),
          history: `${completedExpression} =`,
        };
      }
      if (op === null) return state;
      const next = applyOp(acc, parseFloat(current), op);
      if (next === null)
        return { ...initialState, current: "Error", error: true };
      return {
        ...initialState,
        current: formatNumber(next),
        history: `${formatNumber(acc)} ${op} ${formatNumber(parseFloat(current))} =`,
      };
    }

    case "PARENTHESES": {
      if (state.error) return initialState;
      const expr = state.expression;
      const opens = (expr.match(/\(/g) || []).length;
      const closes = (expr.match(/\)/g) || []).length;
      const last = expr.trim().slice(-1);
      const token = opens > closes && /[0-9.)]/.test(last) ? ")" : "(";
      const prefix = token === "(" && /[0-9.)]$/.test(expr.trim()) ? " × " : "";
      const next = `${expr}${prefix}${token}`;
      return {
        ...state,
        expression: next,
        history: next,
        current: "0",
        overwrite: true,
      };
    }

    case "PERCENT": {
      if (state.error) return initialState;
      const cur = parseFloat(current) / 100;
      return {
        ...state,
        current: formatNumber(cur),
        expression: `${state.expression}${formatNumber(cur)}`,
        history: state.expression,
        overwrite: op ? true : false,
        acc: op ? acc : null,
      };
    }

    case "NEGATE": {
      if (state.error) return initialState;
      const s = current.startsWith("-") ? current.slice(1) : "-" + current;
      const expression = state.expression.endsWith(current)
        ? state.expression.slice(0, -current.length) + s
        : s;
      return { ...state, current: s === "-" ? "0" : s, expression };
    }

    case "BACKSPACE": {
      if (state.error) return initialState;

      // If finished calculation with =, backspace resets history and allows editing result
      if (state.history.endsWith("=")) {
        const next =
          state.current.length <= 1 ? "0" : state.current.slice(0, -1);
        const finalVal = next === "-" || next === "" ? "0" : next;
        return {
          ...state,
          history: "",
          current: finalVal,
          expression: finalVal === "0" ? "" : finalVal,
          overwrite: finalVal === "0",
        };
      }

      // If building an expression with operators or parentheses
      if (state.expression.length > 0) {
        const trimmed = state.expression.trimEnd();
        const nextExpr = trimmed.slice(0, -1).trimEnd();
        const lastNumberMatch = nextExpr.match(/-?\d*\.?\d*$/);
        const lastNumber = lastNumberMatch ? lastNumberMatch[0] : "";
        const hasOperators = /[+−×÷()]/.test(nextExpr);

        return {
          ...state,
          expression: nextExpr,
          current: lastNumber || (hasOperators ? "0" : "0"),
          history: hasOperators
            ? nextExpr
            : state.op && state.acc !== null
              ? `${formatNumber(state.acc)} ${state.op}`
              : "",
          overwrite: false,
        };
      }

      if (overwrite) {
        return {
          ...state,
          current: "0",
          overwrite: true,
          op: null,
          acc: null,
          history: "",
          expression: "",
        };
      }

      const s = current.length <= 1 ? "0" : current.slice(0, -1);
      const finalS = s === "-" || s === "" ? "0" : s;
      return {
        ...state,
        current: finalS,
        overwrite: finalS === "0",
      };
    }

    case "CLEAR":
      return initialState;

    default:
      return state;
  }
}

export { normalize };
