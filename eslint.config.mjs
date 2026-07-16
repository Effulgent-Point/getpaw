// Flat ESLint config (ESLint 9 / Next 16). `next lint` was removed in Next 16,
// so lint runs via `eslint .` (see package.json). eslint-config-next 16 ships
// its rules as a flat-config array, which we spread in directly.
import next from "eslint-config-next/core-web-vitals";

export default [
  {
    ignores: [
      ".next/**",
      ".next.back*/**",
      "**/*.back",
      "node_modules/**",
      "next-env.d.ts",
      // Generated tutorial data mirrors: not hand-authored, don't lint.
      "lib/tutorial/data.ts",
      "lib/tutorial/summaries.ts",
      "lib/tutorial/search-index.ts",
    ],
  },
  ...next,
  {
    // eslint-plugin-react-hooks v6 (bundled with Next 16) adds several strict,
    // opinionated rules that flag long-standing, intentional patterns in this
    // codebase (reading a ref during render for one-shot animation gates, a
    // sync setState in a subscribe effect, etc.). Surface them as warnings so
    // the pipeline still reports them without hard-failing on working code.
    rules: {
      "react-hooks/refs": "warn",
      "react-hooks/set-state-in-effect": "warn",
      "react-hooks/error-boundaries": "warn",
      "react-hooks/exhaustive-deps": "warn",
    },
  },
  {
    // Config files legitimately export anonymous objects/arrays.
    files: ["*.mjs", "*.config.mjs", "*.config.ts"],
    rules: { "import/no-anonymous-default-export": "off" },
  },
];
