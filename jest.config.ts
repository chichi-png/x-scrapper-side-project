import type { Config } from 'jest';
const config: Config = {
  testEnvironment: 'node',
  moduleNameMapper: { '^@/(.*)$': '<rootDir>/$1' },
  transform: { '^.+\\.tsx?$': ['ts-jest', {}] },
};
export default config;
