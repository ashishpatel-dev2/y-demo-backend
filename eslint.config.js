import js from "@eslint/js";
import globals from "globals";

export default [
  { ignores: ["node_modules/"] },
  js.configs.recommended,
  {
    files: ["**/*.js"],
    languageOptions: { globals: globals.node },
    rules: {
      // Express error handlers must declare 4 args even if one is unused
      "no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
    },
  },
  {
    files: ["**/*.cjs", ".sequelizerc"],
    languageOptions: { sourceType: "commonjs", globals: globals.node },
  },
];
