module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/src/test"],
  moduleFileExtensions: ["ts", "js", "json"],
  moduleDirectories: ["node_modules", "src"],
  transform: {
    "^.+\\.ts$": "ts-jest"
  },
  modulePathIgnorePatterns: ["<rootDir>/dist/"]
};
