import { defaults } from "ts-jest/presets";
import type { Config } from "@jest/types";

const config: Config.InitialOptions = {
  ...defaults,
  testMatch: ["**/*.spec.ts"],
  preset: "ts-jest",
  testEnvironment: "node",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  coveragePathIgnorePatterns: ["/node_modules/"],
};

export default config;
