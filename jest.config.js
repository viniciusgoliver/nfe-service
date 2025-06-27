module.exports = {
  roots: ['<rootDir>'],
  moduleFileExtensions: ['ts', 'js', 'tsx', 'jsx', 'json'],
  preset: 'ts-jest',
  testRegex: '.*\\.spec\\.ts$',
  moduleNameMapper: {
    '^src/(.*)': '<rootDir>/$1',
  },
  transform: {
    '^.+\\.(t|j)s$': '@swc/jest',
  },
  coverageDirectory: 'coverage',
  testEnvironment: 'node',
  coverageReporters: ['json-summary', 'text', 'lcov'],  
  collectCoverageFrom: [
    '<rootDir>/**/*.{js,jsx,ts,tsx}',
    '!<rootDir>/**/*.module.{js,jsx,ts,tsx}',
    '!<rootDir>/**/*.dto.{js,jsx,ts,tsx}',
    '!<rootDir>/**/http.service.{js,jsx,ts,tsx}',
    '!<rootDir>/**/*.entity.{js,jsx,ts,tsx}',
    '!<rootDir>/**/*.enum.{js,jsx,ts,tsx}',
    '!<rootDir>/**/*.interface.{js,jsx,ts,tsx}',
    '!<rootDir>/**/*.config.{js,jsx,ts,tsx}',
  ],
};
