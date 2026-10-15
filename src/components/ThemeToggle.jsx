/** Floating theme toggle button. */
export default function ThemeToggle({ theme, toggle }) {
  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={toggle}
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} theme`}
      title="Toggle theme"
    >
      {theme === "light" ? "🌙" : "☀"}
    </button>
  );
}
