"use client";

// Themed wrapper for every tutorial page. Holds the light/dark state, applies
// it to a .tut-root element (so tokens stay scoped to the tutorial and never
// touch the light-only sibling pages), and persists the choice to localStorage.

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

type Theme = "light" | "dark";
const STORAGE_KEY = "getpaw:theme";

interface ThemeContext {
  theme: Theme;
  toggle: () => void;
}

const Ctx = createContext<ThemeContext>({ theme: "light", toggle: () => {} });

export function useTutorialTheme(): ThemeContext {
  return useContext(Ctx);
}

export function TutorialShell({ children }: { children: ReactNode }) {
  // Start light (matches SSR); reconcile with the stored / system choice after
  // mount. Only dark-mode users see a one-frame light flash.
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored === "dark" || stored === "light") {
        setTheme(stored);
        return;
      }
      if (window.matchMedia?.("(prefers-color-scheme: dark)").matches) {
        setTheme("dark");
      }
    } catch {
      /* private mode: stay light */
    }
  }, []);

  const toggle = useCallback(() => {
    setTheme((prev) => {
      const next: Theme = prev === "dark" ? "light" : "dark";
      try {
        window.localStorage.setItem(STORAGE_KEY, next);
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);

  return (
    <Ctx.Provider value={{ theme, toggle }}>
      <div className="tut-root min-h-screen" data-theme={theme} suppressHydrationWarning>
        {children}
      </div>
    </Ctx.Provider>
  );
}
