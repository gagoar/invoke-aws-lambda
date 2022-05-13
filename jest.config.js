process.env.TZ = 'UTC';

module.exports = {
  globals: {
    'ts-jest': {
      disableSourceMapSupport: true,
    },
  },
  verbose: true,
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  testEnvironmentOptions: {
    url: 'http://localhost',
  },
  preset: 'ts-jest',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  transformIgnorePatterns: ['[/\\\\]node_modules[/\\\\].+\\.(js|jsx)$'],
  testMatch: ['**/*.spec.ts'],
  collectCoverage: true,
  collectCoverageFrom: ['src/*.ts', '!./index.ts'],
  coverageDirectory: './coverage/',
};
