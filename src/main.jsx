import React from "react";
import { createRoot } from "react-dom/client";
import Calculator from "./components/Calculator";
import ThemeToggle from "./components/ThemeToggle";
import { useTheme } from "./hooks/useTheme";
import "./styles/fonts.css";
import "./styles/global.css";

function App() {
  const { theme, toggle } = useTheme();
  return (
    <main className="app">
      {/* anchor row keeps the toggle above the calculator's top-right corner */}
      <div className="theme-toggle-anchor">
        <ThemeToggle theme={theme} toggle={toggle} />
      </div>
      <Calculator />
    </main>
  );
}

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
