# Calculator PWA

A beautiful offline-first calculator PWA built with **React + Vite**. Two themes (light beige / dark), pill-shaped keys, Orbitron font (self-hosted), full keyboard support, and installable on phones.

## Features
- Light & dark themes (toggle saved in `localStorage`, respects `prefers-color-scheme`)
- + − × ÷, %, +/−, decimal, AC — with a clean reducer (no `eval`)
- Division-by-zero → "Error", floating-point fixes (0.1+0.2 → 0.3), auto-shrinking display font
- Keyboard: digits, `+ − * /`, Enter, Backspace, Escape
- Haptic feedback via `navigator.vibrate` on mobile
- PWA: offline caching (vite-plugin-pwa, autoUpdate), icons 192/512/maskable, apple-touch-icon
- Mobile-first: fills `100dvh`, safe-area insets, 48px+ touch targets, compact landscape layout

## Run

```bash
npm install
npm run dev        # http://localhost:5173 (also --host for phone testing)
npm test           # Vitest unit tests
npm run build      # production build to dist/
npm run preview    # preview the PWA build (test offline + install)
npm run icons      # regenerate PNG icons from SVG
```

## Structure

```
src/
  components/  Calculator, Display, Keypad, Key, ThemeToggle
  hooks/       useCalculator, useTheme, useKeyboard, calculatorReducer
  utils/       math, format
  styles/      fonts.css (self-hosted Orbitron), global.css
tests/         unit tests for the calculation logic
scripts/       icon generation (sharp)
```

## Deploy (Render — Static Site)
- Build command: `npm run build`
- Publish directory: `dist`
