import { defineConfig } from "cypress";
import codeCoverage from "@cypress/code-coverage/task";

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // Set up the code coverage task
      codeCoverage(on, config);

      // Add Babel preprocessor (this automatically uses the `useBabelrc` config)
      // on("file:preprocessor", require("@cypress/code-coverage/use-babelrc"));

      return config;
    },
  },

  component: {
    devServer: {
      framework: "react",
      bundler: "vite", // Use Vite for bundling React components
    },
  },
});
