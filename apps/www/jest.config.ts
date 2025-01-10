import { nextJsConfig } from '@ashgw/jest-config/nextjs';
import type { Config } from 'jest';

const config: Config = {
  ...nextJsConfig,
  preset: 'ts-jest',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^~/(.*)$': '<rootDir>/src/$1',
  },
  globalSetup: '<rootDir>/src/__tests__/setup/units/setup.ts',
  globalTeardown: '<rootDir>/src/__tests__/setup/units/teardown.ts',
  testTimeout: 30000,
};

export default config;
