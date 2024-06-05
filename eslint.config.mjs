import globals from "globals";
import pluginJs from "@eslint/js";

export default [
  {
    files: ["**/*.js"],
    languageOptions: {
      sourceType: "commonjs",
    },
    rules: {
      noConsole: "off",
    },
    extends: ["airbnb-base"],
  },
  {
    languageOptions: {
      globals: globals.browser,
    },
  },
  {
    parserOptions: {
      ecmaVersion: 12,
    },
  },
  pluginJs.configs.recommended,
];
