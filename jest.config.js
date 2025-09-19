const nextJest = require('next/jest')

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files
  dir: './',
})

// Add any custom config to be passed to Jest
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/'],
  collectCoverageFrom: [
    'lib/**/*.{js,ts}',
    'app/**/*.{js,ts}',
    'components/**/*.{js,ts}',
    'hooks/**/*.{js,ts}',
    'content-improver/src/**/*.js',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/.next/**',
    '!**/coverage/**',
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '^@/components/(.*)$': '<rootDir>/components/$1',
    '^@/lib/(.*)$': '<rootDir>/lib/$1',
    '^@/app/(.*)$': '<rootDir>/app/$1',
    '^@/hooks/(.*)$': '<rootDir>/hooks/$1',
  },
  testMatch: [
    '<rootDir>/__tests__/**/*.{js,ts,tsx}',
    '<rootDir>/**/*.{test,spec}.{js,ts,tsx}',
  ],
  projects: [
    {
      displayName: 'main-project',
      testMatch: ['<rootDir>/__tests__/**/*.{js,ts,tsx}'],
      setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
      testEnvironment: 'jest-environment-jsdom',
      moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/$1',
      },
    },
    {
      displayName: 'content-improver',
      testMatch: ['<rootDir>/content-improver/__tests__/**/*.{js,ts}'],
      setupFilesAfterEnv: ['<rootDir>/content-improver/jest.setup.js'],
      testEnvironment: 'node',
      transform: {
        '^.+\\.js$': ['babel-jest', { presets: ['@babel/preset-env'] }]
      },
    },
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
}

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig)