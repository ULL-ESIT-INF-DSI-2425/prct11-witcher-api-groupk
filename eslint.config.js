import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import eslintConfigPrettier from "eslint-config-prettier";
import tsdoc from "eslint-plugin-tsdoc";
import { off } from "process";

/** @type {import('eslint').Linter.Config[]} */
export default [
  { files: ["**/*.{js,mjs,cjs,ts}"] },
  { languageOptions: { globals: globals.node } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  eslintConfigPrettier,
  {
    plugins: {
      tsdoc,
    },
  },
  {
    rules: {
      "tsdoc/syntax": "warn",
      "@typescript-eslint/no-explicit-any" : off,
    },
  },
  { ignores: ["eslint.config.mjs", "coverage/*", "dist/*", "docs/*", ".github/*"] },
];