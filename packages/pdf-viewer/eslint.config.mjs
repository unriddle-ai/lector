// @ts-check
import eslint from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import tseslint from "typescript-eslint";

const config = tseslint.config(
  eslint.configs.recommended,
  {
    plugins: {
      "simple-import-sort": simpleImportSort,
    },
    rules: {
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",
    },
  },
  {
    files: ["src/**/*.ts"],
    languageOptions: {
      parserOptions: {
        project: "./tsconfig.json",
      },
    },
    extends: [...tseslint.configs.recommendedTypeChecked],
    rules: {
      "require-await": "off",
      "@typescript-eslint/require-await": "off",
    },
  },
  eslintConfigPrettier,
  {
    ignores: ["dist", "node_modules", "**/dist", "**/node_modules"],
  },
);

export default config;
