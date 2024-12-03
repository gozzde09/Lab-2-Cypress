import { defineConfig } from "cypress";
import codeCoverage from "@cypress/code-coverage/task";
export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      codeCoverage(on, config);

      // Return the config object
      return config;
    },
  },

  component: {
    devServer: {
      framework: "react",
      bundler: "vite",
    },
  },
});
