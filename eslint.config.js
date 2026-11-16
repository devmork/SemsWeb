import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
    },
  },
  {
    // shadcn/ui primitives intentionally co-export variants and hooks.
    files: ["src/components/ui/**/*.{ts,tsx}"],
    rules: {
      "react-refresh/only-export-components": "off",
    },
  },
  {
    // Layering guardrail: shared code must never depend on app/features/routes.
    files: ["src/shared/**/*.{ts,tsx}", "src/components/ui/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@/features/*", "@/features/**"],
              message: "Shared code must not import from features.",
            },
            {
              group: ["@/app/*", "@/app/**"],
              message: "The app layer was removed; compose from routes or features.",
            },
            {
              group: ["@/routes/*", "@/routes/**"],
              message: "Shared code must not import from routes.",
            },
          ],
        },
      ],
    },
  },
  {
    // Deliberate exception: the authenticated shell composes role navigation
    // (auth) and the account menu (profile). It may import features, but still
    // must not reach into routes or the removed app layer.
    files: ["src/shared/layout/AuthenticatedLayout.tsx"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@/app/*", "@/app/**"],
              message: "The app layer was removed; compose from routes or features.",
            },
            {
              group: ["@/routes/*", "@/routes/**"],
              message: "Shared code must not import from routes.",
            },
          ],
        },
      ],
    },
  },
  {
    // Features may use shared code, but never routes or the removed app layer.
    files: ["src/features/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@/app/*", "@/app/**"],
              message: "The app layer was removed; compose from routes or features.",
            },
            {
              group: ["@/routes/*", "@/routes/**"],
              message: "Features must not import from routes.",
            },
          ],
        },
      ],
    },
  },
]);
