module.exports = {
  preset: "@vue/cli-plugin-unit-jest/presets/no-babel",
  transform: {
    "^.+\\.jsx?$": "babel-jest",
  },
  moduleNameMapper: {
    "^axios$": "axios/dist/node/axios.cjs",
  },
  collectCoverage: true,
  collectCoverageFrom: ["**/*.{js,vue}", "!**/node_modules/**"],
}
