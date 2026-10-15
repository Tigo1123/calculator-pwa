import Key from "./Key";

/** Phone-style 4 × 5 circular keypad. */
export default function Keypad({
  onDigit,
  onOperator,
  onEquals,
  onPercent,
  onNegate,
  onClear,
  onParentheses,
}) {
  const rows = [
    [
      {
        id: "clear",
        label: "AC",
        kind: "util",
        onPress: onClear,
        aria: "Clear all",
      },
      {
        id: "parentheses",
        label: "( )",
        kind: "util",
        onPress: onParentheses,
        aria: "Parentheses",
      },
      {
        id: "percent",
        label: "%",
        kind: "util",
        onPress: onPercent,
        aria: "Percent",
      },
      {
        id: "divide",
        label: "÷",
        kind: "op",
        onPress: () => onOperator("÷"),
        aria: "Divide",
      },
    ],
    [
      {
        id: "7",
        label: "7",
        kind: "num",
        onPress: () => onDigit("7"),
        aria: "7",
      },
      {
        id: "8",
        label: "8",
        kind: "num",
        onPress: () => onDigit("8"),
        aria: "8",
      },
      {
        id: "9",
        label: "9",
        kind: "num",
        onPress: () => onDigit("9"),
        aria: "9",
      },
      {
        id: "multiply",
        label: "×",
        kind: "op",
        onPress: () => onOperator("×"),
        aria: "Multiply",
      },
    ],
    [
      {
        id: "4",
        label: "4",
        kind: "num",
        onPress: () => onDigit("4"),
        aria: "4",
      },
      {
        id: "5",
        label: "5",
        kind: "num",
        onPress: () => onDigit("5"),
        aria: "5",
      },
      {
        id: "6",
        label: "6",
        kind: "num",
        onPress: () => onDigit("6"),
        aria: "6",
      },
      {
        id: "minus",
        label: "−",
        kind: "op",
        onPress: () => onOperator("−"),
        aria: "Subtract",
      },
    ],
    [
      {
        id: "1",
        label: "1",
        kind: "num",
        onPress: () => onDigit("1"),
        aria: "1",
      },
      {
        id: "2",
        label: "2",
        kind: "num",
        onPress: () => onDigit("2"),
        aria: "2",
      },
      {
        id: "3",
        label: "3",
        kind: "num",
        onPress: () => onDigit("3"),
        aria: "3",
      },
      {
        id: "plus",
        label: "+",
        kind: "op",
        onPress: () => onOperator("+"),
        aria: "Add",
      },
    ],
    [
      {
        id: "negate",
        label: "+/−",
        kind: "util",
        onPress: onNegate,
        aria: "Toggle sign",
      },
      {
        id: "0",
        label: "0",
        kind: "num",
        onPress: () => onDigit("0"),
        aria: "Zero",
      },
      {
        id: "dot",
        label: ".",
        kind: "num",
        onPress: () => onDigit("."),
        aria: "Decimal point",
      },
      {
        id: "equals",
        label: "=",
        kind: "op",
        onPress: onEquals,
        aria: "Equals",
      },
    ],
  ];

  return (
    <div className="keypad" role="group" aria-label="Calculator keypad">
      {rows.flat().map((key) => (
        <Key key={key.id} {...key} />
      ))}
    </div>
  );
}
