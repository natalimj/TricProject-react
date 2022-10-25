module.exports = {
  "preset": "jest-puppeteer",
  "testEnvironment": "node",
  "transform": {
    "^.+\\.(ts|js)x?$": "ts-jest"
  },
  "transformIgnorePatterns": ["<rootDir>/node_modules/"],
  testTimeout: 5000
}