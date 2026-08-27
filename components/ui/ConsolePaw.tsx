"use client";

import { useEffect } from "react";

/** A little something for the developers who open the console. */
export function ConsolePaw() {
  useEffect(() => {
    const art = [
      "",
      "   /\\_/\\   paw",
      "  ( o.o )  Personal Agent Workforce",
      "   > ^ <   you found the console.",
      "",
      "  Now go build an agent: github.com/Effulgent-Point/paw",
      "",
    ].join("\n");
    console.log(
      "%c" + art,
      "color:#21908c;font-family:monospace;font-size:12px",
    );
  }, []);

  return null;
}
