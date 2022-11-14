import { Config } from 'jest';
import { pathsToModuleNameMapper } from 'ts-jest';

import { compilerOptions } from './tsconfig.json';

const backendConfig: Config = {
  preset: 'ts-jest',
  testRegex: '.spec.(ts|tsx)$',
  rootDir: './src/backend',
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: '<rootDir>/../..',
  }),
  testEnvironment: 'node',
};

const frontendConfig: Config = {
  preset: 'ts-jest',
  testRegex: '.spec.(ts|tsx)$',
  rootDir: './src/frontend',
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: '<rootDir>/../..',
  }),
  testEnvironment: 'jsdom',
  transform: {
    '^.+.(png|svg|jpg|gif|webp)$': 'jest-transform-stub',
  },
};

const config: Config = {
  passWithNoTests: true,
  preset: 'ts-jest',
  testRegex: '.spec.(ts|tsx)$',
  rootDir: '.',
  projects: [backendConfig, frontendConfig],
  coverageDirectory: 'coverage',
  collectCoverageFrom: ['./src/**/*.{ts,tsx}', '!**/index.{ts,tsx}'],
};

export default config;
