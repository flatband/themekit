# themekit

Headless named-theme switching for Next.js, on top of `next-themes`. It decides
*which* theme is applied; what each theme looks like and how it's picked is up
to the app.

- Named themes (`"ocean"`, `"forest"`, …), not just light/dark.
- Optional once-a-day random theme (`reroll="daily"`).
- `?theme=name` in the URL forces a theme for that visit, then gets removed from the address bar.
- No styles, no components with markup, no labels.

## Install

```bash
npm install github:flatband/themekit
```

Your lockfile pins the commit you installed; run the same command again to pick
up newer pushes.

It compiles itself on install: npm runs the `prepare` script after cloning,
which builds `src/` into plain JavaScript in `dist/`. No bundler config needed
in the app.

`react` and `next-themes` are peer dependencies — the app installs them, so
there's only ever one copy of each.

## How to use

1. Wrap the app in `ThemeProvider` and give it your theme names:

   ```tsx
   import { ThemeProvider } from "themekit";

   <html suppressHydrationWarning>
     <body>
       <ThemeProvider themes={["ocean", "forest"]} reroll="daily">
         {children}
       </ThemeProvider>
     </body>
   </html>
   ```

   `suppressHydrationWarning` is needed because next-themes sets `data-theme`
   on `<html>` before React hydrates.

2. Style each theme in your own CSS, keyed on the attribute:

   ```css
   :root, [data-theme="ocean"] { --paper: #f3f6fa; --ink: #0d2236; }
   [data-theme="forest"]       { --paper: #f2f5ef; --ink: #13241a; }
   ```

   Give each theme its own `@media (prefers-color-scheme: dark)` half if you
   want dark mode — the provider doesn't toggle light/dark itself.

3. Build any picker you like with `useTheme()`:

   ```tsx
   "use client";
   import { useTheme } from "themekit";

   export function Picker() {
     const { theme, themes, setTheme } = useTheme();
     return themes.map((name) => (
       <button key={name} aria-current={name === theme} onClick={() => setTheme(name)}>
         {name}
       </button>
     ));
   }
   ```

   `theme` is `undefined` until after hydration, so the first render always
   matches the server's HTML.

## ThemeProvider props

| Prop | Default | |
|---|---|---|
| `themes` | — | Every theme name. Required. |
| `defaultTheme` | `themes[0]` | Used when nothing is stored. |
| `storageKey` | `"theme"` | localStorage key. The daily stamp uses `${storageKey}-day`. |
| `attribute` | `"data-theme"` | Where the theme lands on `<html>`: `"class"` or any `data-*`. |
| `reroll` | none | `"daily"`: random theme once per calendar day (UTC). Omit to keep the last pick. |
| `param` | `"theme"` | URL override parameter, or `false` to disable. |

## Files

- `ThemeProvider.tsx`: wraps next-themes and mounts `InitialTheme`.
- `InitialTheme.tsx`: runs once per page load and applies the `?theme=` override or the daily pick.
- `pick.ts`: the pure decision behind it (`pickInitialTheme`), plus `today()`.
- `useTheme.ts`: the hydration-safe hook for pickers.
