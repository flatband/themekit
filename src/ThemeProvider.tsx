"use client";

import { ThemeProvider as NextThemesProvider, type Attribute } from "next-themes";
import InitialTheme from "./InitialTheme.js";

export type ThemeProviderProps = {
  /** Every theme name. The first is the default unless `defaultTheme` says otherwise. */
  themes: readonly string[];
  defaultTheme?: string;
  /** localStorage key for the applied theme. The daily stamp uses `${storageKey}-day`. */
  storageKey?: string;
  /** Where the theme lands on <html>. */
  attribute?: Attribute;
  /** "daily" rolls a random theme once per calendar day; omit to keep the last pick forever. */
  reroll?: "daily";
  /** Query parameter that forces a theme for this load (?theme=name), or false to disable. */
  param?: string | false;
  children: React.ReactNode;
};

/**
 * next-themes configured for named themes rather than a light/dark toggle.
 * enableSystem/enableColorScheme are off on purpose: both only understand the
 * literal values "light"/"dark", and named themes are expected to carry their
 * own light and dark halves (via prefers-color-scheme in the app's CSS).
 *
 * Holds no styling and no theme list of its own — the app supplies both.
 */
export default function ThemeProvider({
  themes,
  defaultTheme = themes[0],
  storageKey = "theme",
  attribute = "data-theme",
  reroll,
  param = "theme",
  children,
}: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute={attribute}
      themes={[...themes]}
      defaultTheme={defaultTheme}
      storageKey={storageKey}
      enableSystem={false}
      enableColorScheme={false}
    >
      <InitialTheme themes={themes} storageKey={storageKey} reroll={reroll} param={param} />
      {children}
    </NextThemesProvider>
  );
}
