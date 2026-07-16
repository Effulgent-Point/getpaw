"use client";

import { useTutorialTheme } from "./TutorialShell";

export function ThemeToggle() {
  const { theme, toggle } = useTutorialTheme();
  const dark = theme === "dark";
  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={dark}
      aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
      title={dark ? "Light theme" : "Dark theme"}
      className="inline-flex h-9 w-9 items-center justify-center rounded-md border transition-colors hover:bg-[var(--tut-elev)]"
      style={{ borderColor: "var(--tut-line)", color: "var(--tut-dim)" }}
    >
      {dark ? (
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="12" cy="12" r="4.4" fill="currentColor" />
          <g stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
            <path d="M12 2.6v2.6M12 18.8v2.6M2.6 12h2.6M18.8 12h2.6M5.3 5.3l1.9 1.9M16.8 16.8l1.9 1.9M18.7 5.3l-1.9 1.9M7.2 16.8l-1.9 1.9" />
          </g>
        </svg>
      ) : (
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M20 14.2A8 8 0 1 1 9.8 4a6.4 6.4 0 0 0 10.2 10.2Z"
            fill="currentColor"
          />
        </svg>
      )}
    </button>
  );
}
