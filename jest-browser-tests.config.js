module.exports = {
  "preset": "jest-puppeteer",
  "testEnvironment": "node",
  "transform": {
    "^.+\\.ts?$": "ts-jest"
  },
  "transformIgnorePatterns": ["<rootDir>/node_modules/"],
  testTimeout: 20000
}