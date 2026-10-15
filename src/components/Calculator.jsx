import { useCalculator } from "../hooks/useCalculator";
import { useKeyboard } from "../hooks/useKeyboard";
import Display from "./Display";
import Keypad from "./Keypad";


/** Main calculator body: display + keypad. */
export default function Calculator() {
  const calc = useCalculator();
  useKeyboard(calc);

  return (
    <div className="calculator">
      <Display value={calc.state.current} history={calc.state.history} />
      <Keypad
        onDigit={calc.inputDigit}
        onOperator={calc.inputOperator}
        onEquals={calc.equals}
        onPercent={calc.percent}
        onNegate={calc.negate}
        onClear={calc.clear}
      />
    </div>
  );
}
