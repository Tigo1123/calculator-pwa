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
      <ThemeToggle theme={theme} toggle={toggle} />
      <Calculator />
    </main>
  );
}

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
