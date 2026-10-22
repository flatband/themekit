"use client";

import { useSyncExternalStore } from "react";
import { useTheme as useNextTheme } from "next-themes";

/** Subscribing to nothing: "mounted" only ever changes once. */
const subscribe = () => () => {};

/**
 * The applied theme and a setter, for building pickers.
 *
 * `theme` is undefined until after hydration. next-themes reads localStorage
 * in its state initialiser, so on the first client render it already knows
 * the stored theme while the server rendered nothing — showing that straight
 * away tears hydration. Holding it back one commit matches the server's HTML
 * first, then swaps to the real value.
 */
export function useTheme(): {
  theme: string | undefined;
  themes: string[];
  setTheme: (name: string) => void;
} {
  const { theme, themes, setTheme } = useNextTheme();
  const mounted = useSyncExternalStore(subscribe, () => true, () => false);

  return { theme: mounted ? theme : undefined, themes, setTheme };
}
