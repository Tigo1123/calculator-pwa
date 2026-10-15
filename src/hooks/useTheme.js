import { useEffect, useState } from "react";

const KEY = "calculator-theme";

export function themeColor(theme) {
  return theme === "dark" ? "#222326" : "#D9D2BF";
}

/** Persisted theme with system preference as initial fallback. */
export function useTheme() {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem(KEY);
    if (saved === "light" || saved === "dark") return saved;
    return matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  });

  useEffect(() => {
    const color = themeColor(theme);
    localStorage.setItem(KEY, theme);
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.setProperty("--c-page", color);
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", color);
    const bgMeta = document.querySelector('meta[name="background-color"]');
    if (bgMeta) bgMeta.setAttribute("content", color);
    const manifestLink = document.querySelector('link[rel="manifest"]');
    if (manifestLink) {
      const manifestUrl = new URL(manifestLink.href, window.location.href);
      fetch(manifestUrl)
        .then((response) => response.json())
        .then((manifest) => {
          manifest.theme_color = color;
          manifest.background_color = color;
          const blob = new Blob([JSON.stringify(manifest)], {
            type: "application/manifest+json",
          });
          const dynamicUrl = URL.createObjectURL(blob);
          manifestLink.href = dynamicUrl;
        })
        .catch(() => {});
    }
  }, [theme]);

  const toggle = () =>
    setTheme((current) => (current === "light" ? "dark" : "light"));
  return { theme, toggle };
}
