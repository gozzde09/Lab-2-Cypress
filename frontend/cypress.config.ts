import { defineConfig } from "cypress";
import codeCoverage from "@cypress/code-coverage/task";
import babelrc from "@cypress/code-coverage/use-babelrc";
export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      codeCoverage(on, config);
      on("file:preprocessor", require("@cypress/code-coverage/use-babelrc"));

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
