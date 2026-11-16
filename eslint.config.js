import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import { defineConfig, globalIgnores } from "eslint/config";

// The app layer was removed; composition happens in routes and feature barrels.
const APP_LAYER = {
  group: ["@/app/*", "@/app/**"],
  message: "The app layer was removed; compose from routes or features.",
};

const routesBan = (who) => ({
  group: ["@/routes/*", "@/routes/**"],
  message: `${who} must not import from routes.`,
});

// A feature's public API is its barrel: @/features/<name> or @/features/<role>/<name>.
const DEEP_FEATURE_IMPORT = {
  group: [
    "@/features/**/components/**",
    "@/features/**/hooks/**",
    "@/features/**/services/**",
    "@/features/**/stores/**",
  ],
  message:
    "Import features through their barrel (@/features/<role>/<feature>), never internal paths.",
};

const roleBan = (role) => ({
  group: [`@/features/${role}/**`],
  message: `Role folders are isolated: this feature must not import @/features/${role}/. Move the shared concern to shared/ instead.`,
});

const restricted = (patterns) => ["error", { patterns }];

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
    // Layering guardrail: shared code must never depend on features/routes.
    files: ["src/shared/**/*.{ts,tsx}", "src/components/ui/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": restricted([
        {
          group: ["@/features/*", "@/features/**"],
          message: "Shared code must not import from features.",
        },
        APP_LAYER,
        routesBan("Shared code"),
      ]),
    },
  },
  {
    // Deliberate exception: the authenticated shell composes role navigation
    // (auth) and the account menu (profile). It may import features, but still
    // must not reach into routes or the removed app layer.
    files: ["src/shared/layout/AuthenticatedLayout.tsx"],
    rules: {
      "no-restricted-imports": restricted([
        APP_LAYER,
        routesBan("Shared code"),
        DEEP_FEATURE_IMPORT,
      ]),
    },
  },
  {
    // Features may use shared code and cross-role features, but never routes.
    files: ["src/features/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": restricted([
        APP_LAYER,
        routesBan("Features"),
        DEEP_FEATURE_IMPORT,
      ]),
    },
  },
  {
    // Role folders are isolated from each other.
    files: ["src/features/qa/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": restricted([
        APP_LAYER,
        routesBan("Features"),
        DEEP_FEATURE_IMPORT,
        roleBan("student"),
        roleBan("admin"),
      ]),
    },
  },
  {
    files: ["src/features/student/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": restricted([
        APP_LAYER,
        routesBan("Features"),
        DEEP_FEATURE_IMPORT,
        roleBan("qa"),
        roleBan("admin"),
      ]),
    },
  },
  {
    files: ["src/features/admin/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": restricted([
        APP_LAYER,
        routesBan("Features"),
        DEEP_FEATURE_IMPORT,
        roleBan("qa"),
        roleBan("student"),
      ]),
    },
  },
  {
    // Routes compose features; they still must not reach into internals.
    files: ["src/routes/**/*.{ts,tsx}", "src/main.tsx"],
    rules: {
      "no-restricted-imports": restricted([
        APP_LAYER,
        DEEP_FEATURE_IMPORT,
      ]),
    },
  },
]);
