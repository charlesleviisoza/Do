/** @type {import('ts-jest/<rootDir>/srctypes').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testPathIgnorePatterns: [".d.ts", ".js", "/node_modules/", "/dist/"],
  moduleNameMapper: {
    "^~(.*)$": "<rootDir>/src$1",
    "^@config(.*)$": "<rootDir>/src/config$1",
    "^@services(.*)$": "<rootDir>/src/services$1",
    "^@models(.*)$": "<rootDir>/src/models$1",
    "^@controllers(.*)$": "<rootDir>/src/controllers$1",
    "^@middlewares(.*)$": "<rootDir>/src/middlewares$1",
    "^@schemas(.*)$": "<rootDir>/src/schemas$1",
    "^@enums(.*)$": "<rootDir>/src/enums$1",
    "^@errors(.*)$": "<rootDir>/src/errors$1",
    "^@utils(.*)$": "<rootDir>/src/utils$1",
    "^@resolvers(.*)$": "<rootDir>/src/resolvers$1"
  }
};