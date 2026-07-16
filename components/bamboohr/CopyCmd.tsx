"use client";

import { useState } from "react";

/** A single copy-to-clipboard command line, styled for the BambooHR hub. */
export function CopyCmd({ cmd }: { cmd: string }) {
  const [done, setDone] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(cmd);
      setDone(true);
      setTimeout(() => setDone(false), 1400);
    } catch {
      /* clipboard blocked; the command is still visible to copy by hand */
    }
  }

  return (
    <div className="bamboo-cmd">
      <span role="status" aria-live="polite" className="sr-only">
        {done ? "Command copied to clipboard" : ""}
      </span>
      <code>{cmd}</code>
      <button
        className="copy"
        onClick={copy}
        aria-label={done ? "Command copied" : `Copy command: ${cmd}`}
      >
        {done ? "Copied" : "Copy"}
      </button>
    </div>
  );
}
