import { Config } from 'jest';
import { pathsToModuleNameMapper } from 'ts-jest';

import { compilerOptions } from './tsconfig.json';

const backendConfig: Config = {
  rootDir: './src/backend',
  testEnvironment: 'node',
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: '<rootDir>',
  }),
};

const frontendConfig: Config = {
  rootDir: './src/frontend',
  testEnvironment: 'jsdom',
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: '<rootDir>',
  }),
  transform: {
    '^.+.(png|svg|jpg|gif|webp)$': 'jest-transform-stub',
  },
};

const config: Config = {
  passWithNoTests: true,
  preset: 'ts-jest',
  testRegex: '.spec.(ts|tsx)$',
  projects: [backendConfig, frontendConfig],
  coverageDirectory: 'coverage',
  collectCoverageFrom: ['./src/**/*.{ts,tsx}', '!**/index.{ts,tsx}'],
};

export default config;
