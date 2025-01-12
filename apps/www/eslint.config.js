import baseConfig, { restrictEnvAccess } from '@ashgw/eslint-config/base';
import nextjsConfig from '@ashgw/eslint-config/nextjs';
import reactConfig from '@ashgw/eslint-config/react';

/** @type {import('typescript-eslint').Config} */
export default [
  {
    ignores: ['.next/**'],
  },
  ...baseConfig,
  ...reactConfig,
  ...nextjsConfig,
  ...restrictEnvAccess,
];
