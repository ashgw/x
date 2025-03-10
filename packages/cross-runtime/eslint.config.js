import baseConfig from "@ashgw/eslint-config/base";
import restrictedEnv from "@ashgw/eslint-config/restricted-env";

/** @type {import('typescript-eslint').Config} */
export default [
  {
    ignores: ["dist/**"],
  },
  ...baseConfig,
  ...restrictedEnv,
];
