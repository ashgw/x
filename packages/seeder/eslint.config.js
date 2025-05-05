import baseConfig from "@ashgw/eslint-config/base";

/** @type {import('typescript-eslint').Config} */
export default [
  {
    "no-restricted-syntax": "off", // to use console object
  },
  ...baseConfig,
];
