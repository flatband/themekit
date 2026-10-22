"use client";

import { useEffect } from "react";
import { useTheme } from "next-themes";
import { pickInitialTheme, today } from "./pick.js";

/**
 * Applies the starting theme once per page load: the ?theme= override and,
 * with reroll "daily", the once-a-day random pick. next-themes has no notion
 * of either, so this sits inside its provider and calls setTheme like any
 * other consumer would. Renders nothing.
 *
 * It runs after paint, so a visitor whose stored pick is from a previous day
 * can see one palette swap right after load. That's on purpose: hiding the
 * page until this settles would leave it blank without JavaScript, which
 * costs more than an occasional one-time colour correction.
 */
export default function InitialTheme({
  themes,
  storageKey,
  reroll,
  param,
}: {
  themes: readonly string[];
  storageKey: string;
  reroll?: "daily";
  param: string | false;
}) {
  const { setTheme } = useTheme();

  useEffect(() => {
    const dayKey = `${storageKey}-day`;
    const day = today();

    let stored: string | null = null;
    let storedDay: string | null = null;
    try {
      stored = localStorage.getItem(storageKey);
      storedDay = localStorage.getItem(dayKey);
    } catch {}

    const asked = param ? new URLSearchParams(location.search).get(param) : null;
    const pick = pickInitialTheme(themes, { asked, stored, storedDay, day, reroll });

    if (reroll === "daily") {
      try {
        localStorage.setItem(dayKey, day);
      } catch {}
    }
    if (pick !== null) setTheme(pick);

    // The override has done its job once picked up; drop it so a copied link
    // doesn't pass on someone else's chosen theme.
    if (param && asked !== null) {
      const url = new URL(location.href);
      url.searchParams.delete(param);
      history.replaceState(null, "", url.pathname + url.search + url.hash);
    }
    // Once per load by design — props changing later shouldn't reroll.
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return null;
}
