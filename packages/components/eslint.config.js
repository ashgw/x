import baseConfig from "@ashgw/eslint-config/base";
import reactConfig from "@ashgw/eslint-config/react";

/** @type {import('typescript-eslint').Config} */
export default [
  {
    ignores: ["dist/**"],
  },
  ...baseConfig,
  ...reactConfig,
];
