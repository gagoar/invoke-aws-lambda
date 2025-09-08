process.env.TZ = 'UTC';

module.exports = {
  verbose: true,
  transform: {
    '^.+\\.(t|j)sx?$': ['@swc/jest'],
  },
  testEnvironmentOptions: {
    url: 'http://localhost',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  transformIgnorePatterns: ['[/\\\\]node_modules[/\\\\].+\\.(js|jsx)$'],
  testMatch: ['**/*.spec.ts'],
  collectCoverage: true,
  collectCoverageFrom: ['src/*.ts', '!./index.ts'],
  coverageDirectory: './coverage/',
};
